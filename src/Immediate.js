const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { logLevel } = require('./util/logger');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');
const filterAsync = require('./util/generalUtils/filterAsync');
const getIdentifiers = require('./util/getIdentifiers')

let { sendLog } = require('./util/logger');
module.exports = async  (dataSource, identifier) => {
    try {
        let { redis, dataObj, sendLog } = await preRun(fn.runnigTypes.ImmediateRun, [fn.dataSources.aka, dataSource], identifier)
        let akaData  = dataObj[fn.dataSources.aka].data;

        let flatIDs = Object.values(identifier);
        let foundRecord = await filterAsync(
            dataObj[dataSource].data,
            async record => 
                await findrecord(record, flatIDs, dataSource)
        );
        if(!foundRecord[0]) {
            sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA, identifier.identityCard, dataSource);
        }
        await diffsHandler({ added: foundRecord }, dataSource, akaData, fn.runnigTypes.ImmediateRun, sendLog);

        

    
        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}

async function findrecord(record, flatIDs, dataSource) {
    const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, true);
    return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
}