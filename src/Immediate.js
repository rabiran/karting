const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const logDetails = require('./util/logDetails');
const connectToRedis = require('./util/generalUtils/connectToRedis');
const authHierarchyExistence = require('./util/generalUtils/authHierarchyExistence');
const moment = require('moment'); 
const getRawData = require('./util/getRawData'); 
const preRun = require('./util/preRun');


module.exports = async  (dataSource, identifiersArray) => {
    try {
        let { redis, data } = await preRun([fn.dataSources.aka])
        let finalData = {
            updated: []
        };
        const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");

        finalData.added = await getRawData(dataSource, fn.runnigTypes.ImmediateRun, date, identifiersArray);
        await diffsHandler(finalData, dataSource, data);

        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}