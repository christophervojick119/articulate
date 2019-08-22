import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, direction, skip, limit, field, dateRange}) {

    const { globalService, documentService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await documentService.findByAgentId({ agentId: id, direction, skip, limit, field, dateRange });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
