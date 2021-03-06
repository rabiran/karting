const dataSync = require('../util/data_synchronizeData');
const fn = require('../config/fieldNames');
const diffsHandler = require('../util/diffsHandler');
const { logLevel } = require('../util/logger');
const PromiseAllWithFails = require('../util/generalUtils/promiseAllWithFails');
const logDetails = require('../util/logDetails');
const preRun = require('../util/preRun');
const cleanDus = require('../util/cleanDu/cleanDus');
const AuthClass = require('../auth/auth');


module.exports = async() => {
    let{ sendLog, dataObj } = await preRun(fn.runnigTypes.dailyRun, [
        fn.dataSources.aka,
        fn.dataSources.es,
        fn.dataSources.ads, 
        fn.dataSources.adNN, 
        fn.dataSources.lmn, 
        fn.dataSources.mdn, 
        fn.dataSources.mm, 
        fn.dataSources.city
    ]);

    let akaData = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
    akaData = await dataSync(fn.dataSources.aka, akaData, dataObj[fn.dataSources.aka].fileName, sendLog)
    
    await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
        if(dataSource !== "undefined")  {
            GetDataAndProcess(dataSource, akaData, sendLog, dataObj[dataSource], dataSync);
        }
    }));

}

/**
 *
 * @param {*} dataSource - The source of the data
 * @param {*} akaData - The aka data to complete data information
 * @param {*} func - The function thet get and compare data from data source
 */
const GetDataAndProcess = async (dataSource, akaData, sendLog, dataObj, func) => {
    const Auth = new AuthClass(sendLog);
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = dataSource === fn.dataSources.aka ? akaData : await func(dataSource, dataObj.data, dataObj.fileName);
    await diffsHandler(data, dataSource, akaData.all, fn.runnigTypes.dailyRun, sendLog, Auth);
    if(dataSource != fn.dataSources.aka) {
        await cleanDus(
            fn.runnigTypes.dailyRun,
            dataSource,
            dataObj.data,
            { params: { ['domainUsers.dataSource']: dataSource, } },
            sendLog,
            Auth
        );
    }

}