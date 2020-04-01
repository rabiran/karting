const filterAsync = require('../../generalUtils/filterAsync');
const byExistence = require('./byExistence');

/**
 * Filter aka records
 *
 * @param {Object} records - all the raw data from the data source
 */
module.exports = async (records, flowType) => {
    return await filterAsync(
        records,
        async (record, index) => {
            return (
                await byExistence(record, flowType)
            );
        }
    );
}