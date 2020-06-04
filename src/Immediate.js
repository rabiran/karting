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
        let { redis, data } = await preRun(fn.runnigTypes.ImmediateRun, [fn.dataSources.aka, dataSource])
        let finalData = {
            updated: []
        };

        const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");

        let akaData  = data[fn.dataSources.aka];
        
        let flatIDs = identifiersArray.map(obj => [obj.id, obj.mi, obj.domuser]).flat();
        let personsToAdd = await filterAsync(data[dataSource], async (record) => (await findrecord(record)));
    
        async function findrecord(record) {
            const { identityCard, personalNumber, domuser } = await getIdentifiers(record, dataSource, true);
            return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domuser));
        }

        finalData.added = personsToAdd;
        await diffsHandler(finalData, dataSource, akaData);

        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}