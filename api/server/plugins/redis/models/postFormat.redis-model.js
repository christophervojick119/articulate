import { MODEL_POST_FORMAT } from '../../../../util/constants';
import BaseModel from '../lib/base-model';

const schema = {
    postFormatPayload: {
        type: 'string'
    },
    creationDate: {
        type: 'timestamp'
    },
    modificationDate: {
        type: 'timestamp'
    }
};

class PostFormatRedisModel extends BaseModel {

    constructor() {

        super({ schema });
    }

    static get modelName() {

        return MODEL_POST_FORMAT;
    }

    static get idGenerator() {

        return 'increment';
    }

    static get definitions() {

        return schema;
    }

}

module.exports = PostFormatRedisModel;
