const fn = require('../../../config/fieldNames');
const { logLevel } = require('../../logger');
const logDetails = require('../../logDetails');
const { addTags } = require('./addCityTags');

/**
 * Filter by tags and domain
 *
 * @param {Object} record
 */
const filterRecord = (dataModel, sendLog) => {
    dataModel = addTags(dataModel)
    const { isTransportable, isInformative, isInternal, isExternal } = dataModel.record.addedTags;
    const record = dataModel.record;
    const recordDomains = record[fn[fn.dataSources.city].domains]
    if (recordDomains) {
        if(isExternal) {
            return true;
        } else {
            sendLog(logLevel.warn, logDetails.warn.WRN_IRRELEVANT_DOMAIN, JSON.stringify(record), fn.dataSources.city);
        }
        return isExternal; 
    }
    if ((isInformative && !isTransportable)) {
        sendLog(logLevel.warn, logDetails.warn.WRN_IRRELEVANT_TAGS, JSON.stringify(record), fn.dataSources.city);
        return false;
    }
    return true;
}

/**
 * Filter city records
 *
 * @param {Object} DataModels - all the raw data from the data source
 */
module.exports = DataModels => {
    return DataModels.filter(DataModel => {
        return filterRecord(DataModel, DataModel.sendLog);
    })
}
