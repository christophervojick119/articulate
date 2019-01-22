module.exports = ({ mainType, subType, mainId }) => {

    const message = `${mainType} id=[${mainId}] already have a ${subType} linked.`;
    return { isHandled: true, statusCode: 400, message };
};
