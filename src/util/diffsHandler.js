const currentUnit_to_DataSource = require('./createDataSourcesMap');
const add = require('./diffsHandlerUtils/addedDataHandler');
const update = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const DataModel = require('./DataModel');
const fn = require('../config/fieldNames');

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async ({ added = [], updated = [] }, dataSource, aka_all_data, runnigType) => {
    const addedData = added.map(newRecord => new DataModel(newRecord, dataSource, fn.flowTypes.add, runnigType));
    const updatedData = updated.map(deepDiffObj => new DataModel(deepDiffObj[1], dataSource, fn.flowTypes.update, runnigType, deepDiffObj));

    return PromiseAllWithFails([
        add({ addedData, dataSource}, aka_all_data, currentUnit_to_DataSource),
        update({updatedData, dataSource}, aka_all_data, currentUnit_to_DataSource),
    ]);
}
