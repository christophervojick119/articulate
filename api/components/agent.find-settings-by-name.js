'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const Boom = require('boom');
const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get Settings by Name';
    c.icon = 'user';
    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.inPorts.add(PORT_REDIS, {
        datatype: 'object',
        description: 'Redis client'
    });

    c.outPorts.add(PORT_OUT, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_REDIS, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    c.forwardBrackets = {
        [PORT_IN]: [PORT_OUT]
    };

    return c.process((input, output) => {

        if (!input.has(PORT_IN, PORT_REDIS)) {
            return;
        }
        const { scope } = input;
        const [{ id, name }, redis] = input.getData(PORT_IN, PORT_REDIS);
        RedisDS
            .findById({
                redis,
                type: 'agentSettings',
                id: `${id}:${name}`
            })
            .then((setting) => {

                if (!setting) {
                    return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.notFound(`Setting [${id}] not found`), { scope }) });
                }

                const settingData = setting.string_value_setting ? setting.string_value_setting : setting;
                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', settingData, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.internal(err.message), { scope }) });
            });
    });
};
