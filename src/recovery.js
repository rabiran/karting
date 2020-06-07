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
        let{ redis, data } = await preRun(fn.runnigTypes.recoveryRun, [
            fn.dataSources.aka,
            fn.dataSources.es,
            fn.dataSources.ads, 
            fn.dataSources.adNN, 
            fn.dataSources.lmn, 
            fn.dataSources.mdn, 
            fn.dataSources.mm, 
            fn.dataSources.city
        ]);
        let akaData  = { updated: [] };
        akaData.added = data[fn.dataSources.aka].data;

        delete data[fn.dataSources.aka];

        await PromiseAllWithFails(Object.keys(data).map(async (dataSource) => {
            let finalData = { updated: [] };
            finalData.added = data[dataSource].data;
            await diffsHandler(finalData, dataSource, akaData.added);
        }));

        await diffsHandler(akaData, fn.dataSources.aka, akaData.added);

        if (redis && redis.status === 'ready') redis.quit();
    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.recoveryRun, JSON.stringify(err));
    }
}
