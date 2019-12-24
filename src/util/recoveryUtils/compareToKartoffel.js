const added = require('../diffsHandlerUtils/addedDataHandler');
const currentUnit_to_DataSource = require('../createDataSourcesMap');

/**
 * Compare data with kartoffel data
 *
 * @param {Object} adjustDataSource - the new data after a match to kartoffel
 * @param {string} dataSource - represents which data source compare his data
 * @param {Object} akaData - all aka data for completion
 */
module.exports = async (adjustDataSource, dataSource, akaData) => {
    await added(adjustDataSource, dataSource, akaData, currentUnit_to_DataSource, false);
};