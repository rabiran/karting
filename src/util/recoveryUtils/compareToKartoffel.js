const added = require('../diffsHandlerUtils/addedDataHandler');
const currentUnit_to_DataSource = require('../createDataSourcesMap');

module.exports = (adjustDataSource, dataSource, akaData) => {
    added(adjustDataSource, dataSource, akaData, currentUnit_to_DataSource, false);
};