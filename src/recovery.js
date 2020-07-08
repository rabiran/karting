const preRun = require('./util/preRun');
const fn = require('./config/fieldNames'); 
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails'); //check later if needed
const logDetails = require('./util/logDetails');
const moment = require('moment');

module.exports = async () => {
    try {
        let { redis, dataObj } = await preRun(fn.runnigTypes.recoveryRun, [
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

        delete dataObj[fn.dataSources.aka];

        await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
            await diffsHandler({ added: dataObj[dataSource].data }, dataSource, akaData, fn.runnigTypes.recoveryRun, sendLog);
        }));

        // await diffsHandler({ added: akaData }, fn.dataSources.aka, akaData, fn.runnigTypes.recoveryRun);

        if (redis && redis.status === 'ready') redis.quit();
    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.recoveryRun, JSON.stringify(err));
    }
}
