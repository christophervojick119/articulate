'use strict';
const Async = require('async');
const Boom = require('boom');
const DomainTools = require('../../domain/tools');
const Wreck = require('wreck');
const Status = require('../../../helpers/status.json');
const _ = require('lodash');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    let agent = null;
    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;

    Async.waterfall([
        (callbackGetAgent) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 400){
                        const errorNotFound = Boom.notFound(res.result.message);
                        return callbackGetAgent(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                    return callbackGetAgent(error, null);
                }
                agent = res.result;
                if (agent.status && agent.status === Status.training){
                    const error = Boom.badRequest('The agent is already training, please waint until the current training finish.');
                    return callbackGetAgent(error, null);
                }
                return callbackGetAgent(null);
            });
        },
        (callbackGetRasaMaxTrainingProcesses) => {

            Wreck.get(`${rasa}/status`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                json: 'force'
            }, (err, wreckResponse, payload) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting rasa status.');
                    return callbackGetRasaMaxTrainingProcesses(error);
                }
                return callbackGetRasaMaxTrainingProcesses(null, payload);
            });
        },
        (rasaStatus, callbackGetDomains) => {

            server.inject(`/agent/${agentId}/domain`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the domains of the agent to train them');
                    return callbackGetDomains(error, null);
                }
                return callbackGetDomains(null, rasaStatus, res.result.domains);
            });
        },
        (rasaStatus, domains, callbackSetAgentTrainingStatus) => {

            redis.hmset(`agent:${agent.id}`, { status: Status.training }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status to training.');
                    return callbackSetAgentTrainingStatus(error);
                }
                return callbackSetAgentTrainingStatus(null, rasaStatus, domains);
            });
        },
        (rasaStatus, domains, callbackTrainEachDomain) => {

            const limit = rasaStatus.max_training_processes - rasaStatus.current_training_processes;
            const needToTrain = _.map(domains, 'status').indexOf(Status.outOfDate) !== -1 || _.map(domains, 'status').indexOf(Status.error) !== -1;
            if (domains.length > 1){
                domains.push({ domainRecognizer: true });
            }
            if (!needToTrain){
                return callbackTrainEachDomain(null);
            }
            Async.eachLimit(domains, limit, (domain, callbackMapOfDomain) => {

                if (domain.domainRecognizer){
                    DomainTools.retrainDomainRecognizerTool(server, redis, rasa, agent.language, agent.agentName, agent.id, (errTraining) => {

                        if (errTraining){
                            return callbackMapOfDomain(errTraining);
                        }
                        return callbackMapOfDomain(null);
                    });
                }
                else {
                    if (domain.status === Status.ready || domain.status === Status.training){
                        return callbackMapOfDomain(null);
                    }
                    server.inject(`/domain/${domain.id}/train`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error occurred training the domain ${domain.domainName}`);
                            return callbackMapOfDomain(error);
                        }
                        return callbackMapOfDomain(null);
                    });
                }
            }, (err) => {

                if (err){
                    return callbackTrainEachDomain(err);
                }
                return callbackTrainEachDomain(null);
            });
        }
    ], (errTraining) => {

        if (errTraining){
            redis.hmset(`agent:${agent.id}`, { status: Status.error }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred during training, and also an error occurred updating the agent status.');
                    return reply(error);
                }
                return reply(errTraining);
            });
        }
        const lastTraining = new Date().toISOString();
        redis.hmset(`agent:${agent.id}`, { status: Status.ready, lastTraining }, (err) => {

            if (err){
                const error = Boom.badImplementation('Model trained. An error occurred updating the agent status to ready.');
                return reply(error);
            }
            agent.status = Status.ready;
            agent.lastTraining = lastTraining;
            return reply(agent);
        });
    });
};
