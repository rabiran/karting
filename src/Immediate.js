const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const {logLevel, wrapSendLog } = require('./util/logger');
const logDetails = require('./util/logDetails');
const moment = require('moment'); 
const getRawData = require('./util/getRawData'); 
const preRun = require('./util/preRun');
const filterAsync = require('./util/generalUtils/filterAsync');
const getIdentifiers = require('./util/getIdentifiers')

let { sendLog } = require('./util/logger');
module.exports = async  (dataSource, identifiersArray) => {
    try {
        let { redis, dataObj } = await preRun(fn.runnigTypes.ImmediateRun, [fn.dataSources.aka, dataSource])
        let akaData  = dataObj[fn.dataSources.aka].data;
        let foundRecords = [];

        for (idObj of identifiersArray) {

            // let flatIDs = [idObj.identityCard, idObj.personalNumber, idObj.domainUsers];
            sendLog = wrapSendLog(fn.runnigTypes.ImmediateRun, idObj.identityCard)
            let flatIDs = Object.values(idObj);
            let foundRecord = await filterAsync(
                dataObj[dataSource].data,
                async record => 
                    await findrecord(record, flatIDs, dataSource)
            );
            if(!foundRecord[0]) {
                sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA, idObj.identityCard, dataSource);
            }
            foundRecords = foundRecords.concat(foundRecord);
        }
        await diffsHandler({ added: foundRecords }, dataSource, akaData, fn.runnigTypes.ImmediateRun);
    
        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}

async function findrecord(record, flatIDs, dataSource) {
    const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, true);
    return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
}