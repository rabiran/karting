const dataSync = require('./util/data_synchronizeData');
const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');


module.exports = async() => {
    try {
        let{ redis, dataObj } = await preRun(fn.runnigTypes.dailyRun, [
            fn.dataSources.aka,
            fn.dataSources.es,
            fn.dataSources.ads, 
            fn.dataSources.adNN, 
            fn.dataSources.lmn, 
            fn.dataSources.mdn, 
            fn.dataSources.mm, 
            fn.dataSources.city
        ]);

        let akaData = dataObj[fn.dataSources.aka].data;
        akaData = await dataSync(fn.dataSources.aka, akaData, dataObj[fn.dataSources.aka].fileName)
        
        delete dataObj[fn.dataSources.aka];
        
        await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
            if(dataSource !== "undefined")  {
                GetDataAndProcess(dataSource, akaData, dataObj[dataSource], dataSync);
            }
        }));
        
        // Due performance reasons aka flow is run by itself, after other flows
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
const GetDataAndProcess = async (dataSource, akaData, dataObj, func) => {
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = func ? await func(dataSource, dataObj.data, dataObj.fileName) : akaData;
    await diffsHandler(data, dataSource, akaData.all, fn.runnigTypes.dailyRun);
}