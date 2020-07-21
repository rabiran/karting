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
            let identifier = identifierObj.identityCard;
            let { foundRecord, akaRecord, sendLog } = await immediatePreRun(fn.runnigTypes.ImmediateRun, dataSource, identifier, runUID)
            
            let Auth = new AuthClass(sendLog);

            await diffsHandler({ added: foundRecord }, dataSource, [akaRecord], fn.runnigTypes.ImmediateRun, sendLog, Auth);


        } catch (err) {
            sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
        }
    }

}

// async function findrecord(record, flatIDs, dataSource, Auth, sendLog) {
//     const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, Auth, sendLog);
//     return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
// }