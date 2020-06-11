const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const logDetails = require('./util/logDetails');
const moment = require('moment'); 
const getRawData = require('./util/getRawData'); 
const preRun = require('./util/preRun');
const filterAsync = require('./util/generalUtils/filterAsync');
const getIdentifiers = require('./util/getIdentifiers')


module.exports = async  (dataSource, identifiersArray) => {
    try {
        let { redis, dataObj } = await preRun(fn.runnigTypes.ImmediateRun, [fn.dataSources.aka, dataSource])

        let akaData  = dataObj[fn.dataSources.aka].data;
        
        let flatIDs = identifiersArray.map(obj => [obj.identityCard, obj.personalNumber, obj.domainUsers]).flat();
        let foundRecords = await filterAsync(dataObj[dataSource].data, async record => await findrecord(record));
    
        async function findrecord(record) {
            const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, true);
            return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
        }

        await diffsHandler({ added: foundRecords }, dataSource, akaData, fn.runnigTypes.ImmediateRun);

        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}
