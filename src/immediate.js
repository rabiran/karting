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
            let { redis, dataObj, sendLog } = await preRun(fn.runnigTypes.ImmediateRun, [fn.dataSources.aka, dataSource], identifier, runUID)
            let akaData = dataObj[fn.dataSources.aka].data;
            
            let Auth = new AuthClass(sendLog);
            let flatIDs = Object.values(identifierObj);
            let foundRecord = await filterAsync(
                dataObj[dataSource].data,
                async record =>
                    await findrecord(record, flatIDs, dataSource, Auth, sendLog)
            );
            if (!foundRecord[0]) {
                sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA, identifier, dataSource);
            }
            await diffsHandler({ added: foundRecord }, dataSource, akaData, fn.runnigTypes.ImmediateRun, sendLog, Auth);

            if (redis && redis.status === 'ready') redis.quit();

        } catch (err) {
            sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
        }
    }

}

async function findrecord(record, flatIDs, dataSource, Auth, sendLog) {
    const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, Auth, sendLog);
    return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
}