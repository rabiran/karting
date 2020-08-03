const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');
const filterAsync = require('./util/generalUtils/filterAsync');
const getIdentifiers = require('./util/getIdentifiers');
const AuthClass = require('./auth/auth');

let { logLevel } = require('./util/logger');
module.exports = async (dataSource, identifiersArray, runUID) => {
    for (let identifierObj of identifiersArray) {
        try {
            let { dataObj, sendLog } = await preRun(fn.runnigTypes.immediateRun, [
                fn.dataSources.aka, dataSource
            ], identifierObj, runUID)
            
            let akaRecords = dataObj[fn.dataSources.aka].data;
            let foundRecords = dataObj[dataSource].data;

            let Auth = new AuthClass(sendLog);

            await diffsHandler({ added: foundRecords }, dataSource, akaRecords, fn.runnigTypes.immediateRun, sendLog, Auth);


        } catch (err) {
            sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.immediateRun, JSON.stringify(err));
        }
    }

}

// async function findrecord(record, flatIDs, dataSource, Auth, sendLog) {
//     const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, Auth, sendLog);
//     return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
// }