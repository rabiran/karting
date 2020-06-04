const dataSync = require('./util/data_synchronizeData');
const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');


module.exports = async() => {
    console.log('Start')
    try {
        let{ redis, data } = await preRun(fn.runnigTypes.dailyRun, [
            fn.dataSources.aka,
            fn.dataSources.es,
            fn.dataSources.ads, 
            fn.dataSources.adNN, 
            fn.dataSources.lmn, 
            fn.dataSources.mdn, 
            fn.dataSources.mm, 
            fn.dataSources.city
        ]);

        let akaData = data[fn.dataSources.aka];
        akaData = await dataSync(fn.dataSources.aka, akaData)
        
        delete data[fn.dataSources.aka];
        
        await PromiseAllWithFails(Object.keys(data).map(async (dataSource) => {
            if(dataSource !== "undefined")  {
                GetDataAndProcess(dataSource, akaData, data[dataSource], dataSync);
            }
        }));
        
        // Due performence reasons aka flow is run by itself, after the other flows
        await GetDataAndProcess(fn.dataSources.aka, akaData);

        if (redis && redis.status === 'ready') redis.quit();
    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.dailyRun, JSON.stringify(err));
    }
}

/**
 *
 * @param {*} dataSource - The source of the data
 * @param {*} akaData - The aka data to complete data information
 * @param {*} func - The function thet get and compare data from data source
 */
const GetDataAndProcess = async (dataSource, akaData, PNCYdata, func) => {
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = func ? await func(dataSource, PNCYdata) : akaData;
    await diffsHandler(data, dataSource, akaData.all);
}