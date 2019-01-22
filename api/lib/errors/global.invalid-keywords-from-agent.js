module.exports = ({ statusCode = 404, keywordIds, agentId }) => {

    return {
        isHandled: true,
        statusCode,
        message: `Keyword(s) [${keywordIds.join()}] not found for the current Agent id=[${agentId}]`
    };
};
