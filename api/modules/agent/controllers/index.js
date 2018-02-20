'use strict';
const AddController = require('./add.agent.controller');
const DeleteByIdController = require('./deleteById.agent.controller');
const FindAllController = require('./findAll.agent.controller');
const FindByIdController = require('./findById.agent.controller');
const FindByNameController = require('./findByName.agent.controller');
const FindDomainsByAgentIdController = require('./findDomainsByAgentId.agent.controller');
const FindDomainByIdByAgentIdController = require('./findDomainByIdByAgentId.agent.controller');
const FindEntitiesByAgentIdController = require('./findEntitiesByAgentId.agent.controller');
const FindEntityByIdByAgentIdController = require('./findEntityByIdByAgentId.agent.controller');
const FindIntentByIdInDomainByIdByAgentIdController = require('./findIntentByIdInDomainByIdByAgentId.agent.controller');
const FindIntentsInDomainByIdByAgentIdController = require('./findIntentsInDomainByIdByAgentId.agent.controller');
const FindIntentScenarioInDomainByIdByAgentIdController = require('./findIntentScenarioInDomainByIdByAgentId.agent.controller');
const FindIntentWebhookInDomainByIdByAgentIdController = require('./findIntentWebhookInDomainByIdByAgentId.agent.controller');
const UpdateByIdController = require('./updateById.agent.controller');
const ParseController = require('./parse.agent.controller');
const ConverseController = require('./converse.agent.controller');
const ExportController = require('./export.agent.controller');
const ImportController = require('./import.agent.controller');
const FindIntentsByIdByAgentIdController = require('./findIntentsByIdByAgentId.agent.controller');
const AddWebhookController = require('./addWebhook.agent.controller');
const FindWebhookController = require('./findWebhook.agent.controller');
const UpdateWebhookController = require('./updateWebhook.agent.controller');
const DeleteWebhookController = require('./deleteWebhook.agent.controller');


const AgentController = {

    add: AddController,

    deleteById: DeleteByIdController,

    findAll: FindAllController,

    findById: FindByIdController,

    findByName: FindByNameController,

    findEntitiesByAgentId: FindEntitiesByAgentIdController,

    findEntityByIdByAgentId: FindEntityByIdByAgentIdController,

    findDomainsByAgentId: FindDomainsByAgentIdController,

    findDomainByIdByAgentId: FindDomainByIdByAgentIdController,

    findIntentByIdInDomainByIdByAgentId: FindIntentByIdInDomainByIdByAgentIdController,

    findIntentsInDomainByIdByAgentId: FindIntentsInDomainByIdByAgentIdController,

    findIntentScenarioInDomainByIdByAgentId: FindIntentScenarioInDomainByIdByAgentIdController,

    findIntentWebhookInDomainByIdByAgentId: FindIntentWebhookInDomainByIdByAgentIdController,

    updateById: UpdateByIdController,

    parse: ParseController,

    converse: ConverseController,

    export: ExportController,

    import: ImportController,

    findIntentsByAgentId: FindIntentsByIdByAgentIdController,

    addWebhook: AddWebhookController,

    findWebhook: FindWebhookController,

    updateWebhook: UpdateWebhookController,

    deleteWebhook: DeleteWebhookController
};

module.exports = AgentController;
