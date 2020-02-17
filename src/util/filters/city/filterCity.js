const byTags = require('./byTags');

/**
 * Filter by city persons
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