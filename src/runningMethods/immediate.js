const fn = require('../config/fieldNames');
const diffsHandler = require('../util/diffsHandler');
const preRun = require('../util/preRun');
const searchRecordsInData = require('../util/searchRecordsInData');
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
        let foundRecords = dataObj[dataSource].data ? dataObj[dataSource].data.data : [];
        
        const missingSources = [];

        akaRecords.length ? null : missingSources.push(fn.dataSources.aka);
        foundRecords.length ? null : missingSources.push(dataSource);

        const sourceResults = missingSources.length ? await searchRecordsInData(Object.values(idObj), missingSources) : null;

        akaRecords = akaRecords.length ? akaRecords : sourceResults[fn.dataSources.aka].map(elem => elem.record);
        foundRecords = foundRecords.length ? foundRecords : sourceResults[dataSource].map(elem => elem.record);

        const Auth = new AuthClass(sendLog);

        await diffsHandler({ added: foundRecords }, dataSource, akaRecords, fn.runnigTypes.immediateRun, sendLog, Auth);
        let { logs, fileName } = await collectLogs(idObj, runUID);
        resArray.push({ id: identifier, records: foundRecords ? foundRecords : [], logsObj: { fileName: fileName, logs: logs } });
    }
    return resArray;
};
