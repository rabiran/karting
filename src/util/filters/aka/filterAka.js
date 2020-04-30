const filterAsync = require('../../generalUtils/filterAsync');
const byExistence = require('./byExistence');

/**
 * Filter aka records
 *
 * @param {Array<DataModel>} data - all the raw data from the data source
 */
module.exports = async (data) => {
    return await filterAsync(
        data,
        async (DataModel, index) => {
            return (
                await byExistence(DataModel)
            );
        }
    );
}