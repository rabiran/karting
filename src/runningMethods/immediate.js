const fn = require('../config/fieldNames');
const diffsHandler = require('../util/diffsHandler');
const preRun = require('../util/preRun');
const AuthClass = require('../auth/auth');
const collectLogs = require('../util/collectLogs')


module.exports = async (dataSource, identifiersArray, runUID) => {
    let resArray = [];
    for (const idObj of identifiersArray) {
        let identifier = idObj.identityCard || idObj.personalNumber || idObj.domainUser;
        const { dataObj, sendLog } = await preRun(fn.runnigTypes.immediateRun,
        [fn.dataSources.aka, dataSource],
        idObj, runUID);

        let akaRecords = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
        let foundRecords = dataObj[dataSource] ? dataObj[dataSource].data : [];
        const Auth = new AuthClass(sendLog);

        let city_all_data = dataObj[fn.dataSources.city] ? dataObj[fn.dataSources.city].data : [];

        let extraData = {aka_all_data : akaRecords,city_all_data : city_all_data}

        await diffsHandler({ added: foundRecords }, dataSource, extraData, fn.runnigTypes.immediateRun, sendLog, Auth);

        let { logs, fileName } = await collectLogs(idObj, runUID);
        resArray.push({
            id: identifier, 
            records: foundRecords, 
            logsObj: { 
                fileName: fileName, 
                logs: logs 
            },
        });
    }
    return resArray;
};
