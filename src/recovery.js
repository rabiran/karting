const preRun = require('./util/preRun');
const fn = require('./config/fieldNames'); 
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails'); //check later if needed
const logDetails = require('./util/logDetails');
const authHierarchyExistence = require('./util/generalUtils/authHierarchyExistence');
const moment = require('moment');

module.exports = async () => {
    try {
        let{ redis, data } = await preRun([
            fn.dataSources.aka,
            fn.dataSources.es,
            // fn.dataSources.ads, 
            // fn.dataSources.adNN, 
            // fn.dataSources.lmn, 
            // fn.dataSources.mdn, 
            // fn.dataSources.mm, 
            // fn.dataSources.city
        ]);
        let akaData  = { updated: [] };
        akaData.added = data.find(element => {
            return element.dataSource === fn.dataSources.aka;
        }).data;

        data = data.filter(element => {
            return element.dataSource !== fn.dataSources.aka;
        });

        await Promise.all(data.map(async (dataObject) => {
            let finalData = { updated: [] };
            finalData.added = dataObject.data;
            await diffsHandler(finalData, dataObject.dataSource, akaData.added);
        }));

        await diffsHandler(akaData, fn.dataSources.aka, akaData.added);

        if (redis && redis.status === 'ready') redis.quit();
    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.recoveryRun, JSON.stringify(err));
    }
}

/**
 *
 * @param {*} dataSource - The source of the data
 * @param {*} akaData - The aka data to complete data information
 * @param {*} func - The function thet get and compare data from data source
 */
const GetDataAndProcess = async (dataSource, akaData, runnigType, func) => {
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = func ? await func(dataSource, runnigType) : akaData;
    await diffsHandler(data, dataSource, akaData.all);
}