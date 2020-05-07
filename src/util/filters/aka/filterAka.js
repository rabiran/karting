const filterAsync = require('../../generalUtils/filterAsync');
const byExistence = require('./byExistence');
const fn = require('../../../config/fieldNames')

/**
 * Filter aka records
 *
 * @param {Object} records - all the raw data from the data source
 */
module.exports = async (records, flowType) => {
    let result = [];

    for (let i = 0; i < parseInt(records.length / fn.chunckSize) + 1; i++) {
        let chunck = records.slice(i * fn.chunckSize, (i * fn.chunckSize) + fn.chunckSize);

        chunck = await filterAsync(
            records,
            async (record, index) => {
                return (
                    await byExistence(record, flowType)
                );
            }
        );

        result.push(...chunck);
    }

    return result;
}
