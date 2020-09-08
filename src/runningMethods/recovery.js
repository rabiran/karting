const preRun = require('../util/preRun');
const fn = require('../config/fieldNames'); 
const diffsHandler = require('../util/diffsHandler');
const { logLevel } = require('../util/logger');
const PromiseAllWithFails = require('../util/generalUtils/promiseAllWithFails'); //check later if needed
const logDetails = require('../util/logDetails');
const moment = require('moment');

module.exports = async () => {
    let { sendLog, dataObj } = await preRun(fn.runnigTypes.recoveryRun, [
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

    await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
        await diffsHandler({ added: dataObj[dataSource].data }, dataSource, akaData, fn.runnigTypes.recoveryRun, sendLog);
    }));

}