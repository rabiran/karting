const byTags = require('./byTags');

/**
 * Filter city records
 *
 * @param {Object} DataModels - all the raw data from the data source
 */
module.exports = DataModels => {
    return DataModels.filter(DataModel => {
        return (
            byTags(DataModel.record, DataModel.sendLog)
        )
    });
}
