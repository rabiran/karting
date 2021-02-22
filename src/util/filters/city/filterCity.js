const { addTags, filterByTags } = require('./byTags');

/**
 * Filter city records
 *
 * @param {Object} DataModels - all the raw data from the data source
 */
module.exports = DataModels => {
    DataModels.map(DataModel => {
        DataModel = addTags(DataModel, DataModel.sendLog);
    });
    return DataModels.filter(DataModel => {
        return filterByTags(DataModel, DataModel.sendLog);
    })
}
