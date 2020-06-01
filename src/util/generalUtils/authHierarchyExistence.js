
const {sendLog, logLevel} = require('../logger');
const Auth = require('../../auth/auth');
const p = require('../../config/paths');

module.exports = async () => {
    await Auth.axiosKartoffel.get(p(encodeURIComponent(fn.rootHierarchy.ourCompany)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
    .then((result) => {
        sendLog(logLevel.info, logDetails.info.INF_ROOT_EXSIST, result.data.name);
    })
    .catch(async () => {
        await Auth.axiosKartoffel.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy.ourCompany })
            .then((result) => {
                sendLog(logLevel.info, logDetails.info.INF_ADD_ROOT, result.data.name);
            })
            .catch((err) => {
                let errorMessage = (err.response) ? err.response.data.message : err.message;
                sendLog(logLevel.error, logDetails.error.ERR_ADD_ROOT, errorMessage);
            })
    });

}