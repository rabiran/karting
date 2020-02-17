const byTags = require('./byTags');

/**
 * Filter city records
 *
 * @param {Object} records - all the raw data from the data source
 */
module.exports = (records) => {
    return records.filter((record) => {
        return (
            byTags(record)
        )
    });
}
