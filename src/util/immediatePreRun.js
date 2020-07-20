const fn = require('../config/fieldNames');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const connectToRedis = require('./generalUtils/connectToRedis');
const authHierarchyExistence = require('./generalUtils/authHierarchyExistence');
const moment = require('moment');
const { wrapSendLog } = require('./logger');
const getRawData = require('./getRawData');

module.exports = async (runningType, dataSource, idObj, runUID) => {
    let sendLog = wrapSendLog(runningType, idObj.value, runUID)

    // check if the root hierarchy exist and adding it if not
    await authHierarchyExistence(sendLog);

    const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    let foundRecord;
    let dataObj = {};

    // TODO get Raw data from last aka file, nova
    // TODO search through these files for the certain record

    // iterate through identifiers to get record

    for (const id in idObj) {
        let url = p()[`${dataSource}_API`].concat(`?${id}=${idObj[id]}`)
        data = await axios.get(url).catch(err=>{
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        if(data.data) {
            foundRecord = data.data;
            break;
        }
    }

    switch (dataSource) {
        case 

    }

    return { dataObj, sendLog }
}