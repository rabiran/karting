
const { logLevel } = require('../logger');
const AuthClass = require('../../auth/auth');
const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const logDetails = require('../../util/logDetails');

module.exports = async (sendLog) => {
    let Auth = new AuthClass(sendLog);
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