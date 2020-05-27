const currentUnit_to_DataSource = require('./createDataSourcesMap');
const added = require('./diffsHandlerUtils/addedDataHandler');
const updated = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async (diffsObj, dataSource, aka_all_data) => {
    return PromiseAllWithFails([
        added(diffsObj.added, dataSource, aka_all_data, currentUnit_to_DataSource),
        updated(diffsObj.updated, dataSource, aka_all_data, currentUnit_to_DataSource)
    ]);
}