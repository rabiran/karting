const fn = require('../config/fieldNames');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const connectToRedis = require('./generalUtils/connectToRedis');
const authHierarchyExistence = require('./generalUtils/authHierarchyExistence');
const moment = require('moment');
const { wrapSendLog } = require('./logger');
const getRawData = require('./getRawData');

module.exports = async (runningType, dataSources, identifier, runUID) => {
    let sendLog = wrapSendLog(runningType, identifier, runUID)
    const redis = await connectToRedis(sendLog);

    // check if the root hierarchy exist and adding it if not
    await authHierarchyExistence(sendLog);

    const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    let dataObj = {};
    const rawData = await PromiseAllWithFails(
        dataSources.map(
            async dataSource => {
                let { data, fileName } = await getRawData(dataSource, runningType, date, sendLog);                
                dataObj[dataSource] = { data, fileName }
            })
    );

    return { redis, dataObj, sendLog }
}
