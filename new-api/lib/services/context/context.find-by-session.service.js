import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, loadFrames = false, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);
    const { globalService } = await this.server.services();
    try {
        await Model.findBySessionId({ sessionId });
        if (Model.inDb) {
            //Only load frames if we are NOT returning the model, or else we can't create and object with a frames list.
            if (!returnModel && loadFrames) {
                const frames = await globalService.loadAllLinked({ parentModel: Model, model: MODEL_FRAME, returnModel });
                const context = Model.allProperties();
                context.frames = frames;
                return context;
            }
            return returnModel ? Model : Model.allProperties();
        }
        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
