const currentUnit_to_DataSource = require('./createDataSourcesMap');
const add = require('./diffsHandlerUtils/addedDataHandler');
const update = require('./diffsHandlerUtils/updatedDataHandler');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async ({ added = [], updated = [] }, dataSource, aka_all_data) => {
    return PromiseAllWithFails([
        add(added, dataSource, aka_all_data, currentUnit_to_DataSource),
        update(updated, dataSource, aka_all_data, currentUnit_to_DataSource)
    ]);
}
