const filterAsync = require('../../generalUtils/filterAsync');
const byExistence = require('./byExistence');
const fn = require('../../../config/fieldNames')

/**
 * Filter aka records
 *
 * @param {Array<DataModel>} data - all the raw data from the data source
 */
module.exports = async (data) => {
    let result = [];

    // split data to chuncks
    for (let i = 0; i < parseInt(data.length / fn.chunckSize) + 1; i++) {
        let chunck = data.slice(i * fn.chunckSize, (i * fn.chunckSize) + fn.chunckSize);

        chunck = await filterAsync(
            data,
            async (DataModel, index) => {
                return (
                    await byExistence(DataModel) // && <condition> - for more filter conditions
                );
            }
        );

        result.push(...chunck);
    }

    return result;
}
