const add = require('./diffsHandlerUtils/addedDataHandler');
const update = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const DataModel = require('./DataModel');
const fn = require('../config/fieldNames');
let { sendLog } = require('./logger');
const AuthClass = require('../auth/auth');
let DHAuth = new AuthClass(sendLog);

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async ({ added = [], updated = [] }, dataSource, aka_all_data, runnigType, DHsendLog = sendLog, Auth = DHAuth) => {
    const addedData = added.map(newRecord => new DataModel(newRecord, dataSource, fn.flowTypes.add, runnigType, Auth, DHsendLog));
    const updatedData = updated.map(
        deepDiffObj => new DataModel(deepDiffObj[1], dataSource, fn.flowTypes.update, runnigType, Auth, DHsendLog, deepDiffObj)
    );

    return PromiseAllWithFails([
        add({ addedData, dataSource }, aka_all_data),
        update({ updatedData, dataSource }, aka_all_data),
    ]);
}
