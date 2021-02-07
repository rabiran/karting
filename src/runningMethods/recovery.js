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
        fn.dataSources.es,
        fn.dataSources.ads, 
        fn.dataSources.adNN, 
        fn.dataSources.lmn, 
        fn.dataSources.mdn, 
        fn.dataSources.mm, 
        fn.dataSources.city,
        fn.dataSources.pictures
    ]);

    let akaData = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
    //let idObj = {}
    let ct_all_data = dataObj[fn.dataSources.city] ? dataObj[fn.dataSources.city].data : [];
    let pictures_all_data = dataObj[fn.dataSources.pictures] ? dataObj[fn.dataSources.pictures].data : [];
    
    const Auth = new AuthClass(sendLog);

    await PromiseAllWithFails(Object.keys(dataObj).map(async (dataSource) => {
        await diffsHandler({ added: dataObj[dataSource].data }, dataSource, akaData, ct_all_data, pictures_all_data, fn.runnigTypes.recoveryRun, sendLog, Auth);
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
