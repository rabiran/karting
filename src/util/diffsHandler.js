const add = require('./diffsHandlerUtils/addedDataHandler');
const update = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const DataModel = require('./DataModel');
const fn = require('../config/fieldNames');
const AuthClass = require('../auth/auth');

require('dotenv').config();
/*
* diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
* dataSource - string the express the name of the data source
* aka_all_data - object that contain all the recent data from aka
*/

module.exports = async ({ added = [], updated = [] }, dataSource, extraData, runnigType, sendLog, Auth) => {
    const addedData = added.map(newRecord => new DataModel(newRecord, dataSource, fn.flowTypes.add, runnigType, Auth, sendLog));
    const updatedData = updated.map(
        deepDiffObj => new DataModel(deepDiffObj[1], dataSource, fn.flowTypes.update, runnigType, Auth, sendLog, deepDiffObj)
    );
    
    return PromiseAllWithFails([
        add({ addedData, dataSource }, extraData),
        update({ updatedData, dataSource }, extraData),
    ]);

}
