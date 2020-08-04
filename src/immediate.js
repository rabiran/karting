const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');
const searchRecords = require("./util/searchRecords");
const AuthClass = require('./auth/auth');


let { logLevel } = require('./util/logger');
module.exports = async (dataSource, identifiersArray, runUID) => {
    for (let identifierObj of identifiersArray) {
        try {
            let { dataObj, sendLog } = await preRun(fn.runnigTypes.immediateRun, 
                [fn.dataSources.aka, dataSource]
            ,identifierObj, runUID)
            
            let akaRecords = dataObj[fn.dataSources.aka].data;
            let foundRecords = dataObj[dataSource].data;

            if(!foundRecords.length) {
                let sourceResults = await searchRecords([identifierObj.identityCard, identifierObj.personalNumber], [dataSource])
                foundRecords = [sourceResults[0].results[0].record];
            }

            let Auth = new AuthClass(sendLog);

            await diffsHandler({ added: foundRecords }, dataSource, akaRecords, fn.runnigTypes.immediateRun, sendLog, Auth);


        } catch (err) {
            sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.immediateRun, JSON.stringify(err));
        }
    }

}
