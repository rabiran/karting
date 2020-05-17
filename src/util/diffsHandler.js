const currentUnit_to_DataSource = require('./createDataSourcesMap');
const added = require('./diffsHandlerUtils/addedDataHandler');
const updated = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const DataModel = require('./DataModel');
const fn = require('../config/fieldNames');

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async (diffsObj, dataSource, aka_all_data) => {
    const newData = diffsObj.added.map(newRecord => new DataModel(newRecord, dataSource, fn.flowTypes.add));
    const updatedData = diffsObj.updated.map(
        deepDiffObj => new DataModel(deepDiffObj[1], dataSource, fn.flowTypes.update, deepDiffObj)
    );

    return PromiseAllWithFails([
        added(newData, dataSource, aka_all_data, currentUnit_to_DataSource),
        updated(updatedData, dataSource, aka_all_data, currentUnit_to_DataSource)
    ]);
}
