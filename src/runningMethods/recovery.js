const preRun = require('../util/preRun');
const fn = require('../config/fieldNames'); 
const diffsHandler = require('../util/diffsHandler');
const { logLevel } = require('../util/logger');
const PromiseAllWithFails = require('../util/generalUtils/promiseAllWithFails'); //check later if needed
const logDetails = require('../util/logDetails');
const moment = require('moment');
const AuthClass = require('../auth/auth');
const cleanDus = require('../util/cleanDu/cleanDus');

module.exports = async () => {
    let { sendLog, dataObj } = await preRun(fn.runnigTypes.recoveryRun, [
        fn.dataSources.aka,
        // fn.dataSources.ads, 
        // fn.dataSources.es,
        // fn.dataSources.adNN, 
        // fn.dataSources.lmn, 
        // fn.dataSources.mdn,
        // fn.dataSources.sf,
        // fn.dataSources.mm, 
        fn.dataSources.city
    ]);

    let akaData = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
    //let idObj = {}
    let city_all_data = dataObj[fn.dataSources.city] ? dataObj[fn.dataSources.city].data : [];
    
    const Auth = new AuthClass(sendLog);

    let extraData = {aka_all_data : akaData,city_all_data : city_all_data}

    // remove aka flow in diffshandler
    delete dataObj[fn.dataSources.aka]

    await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
        await diffsHandler({ added: dataObj[dataSource].data }, dataSource, extraData, fn.runnigTypes.recoveryRun, sendLog, Auth);
        if(dataSource != fn.dataSources.aka) {
            await cleanDus(
                fn.runnigTypes.recoveryRun,
                dataSource,
                dataObj[dataSource].data,
                { params: { ['domainUsers.dataSource']: dataSource, } },
                sendLog,
                Auth
            );
        }

    }));
}
