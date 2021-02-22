const fn = require('../../../config/fieldNames');
const { logLevel } = require('../../logger');
const logDetails = require('../../logDetails');

/**
 * 
 * @param {*} dataModel 
 */
const addTags = (dataModel) => {
    let isTransportable = false;
    let isInformative = false;
    const record = dataModel.record;
    let tagsLength = record[fn[fn.dataSources.city].tags] ? record[fn[fn.dataSources.city].tags].length : 0;

    for (let i = 0; i < tagsLength; i++) {
        if (record[fn[fn.dataSources.city].tags][i].name === fn[fn.dataSources.city].userTags.transportable) {
            isTransportable = true;
        } else if (record[fn[fn.dataSources.city].tags][i].name === fn[fn.dataSources.city].userTags.information) {
            isInformative = true;
        }
    }
    dataModel.record.addedTags = {
        isInformative,
        isTransportable
    }
    return dataModel
}
/**
 * Filter by tags
 *
 * @param {Object} record
 */
const filterByTags = (dataModel, sendLog) => {
    let isTransportable = dataModel.record.addedTags.isTransportable;
    let isInformative = dataModel.record.addedTags.isInformative;
    const record = dataModel.record;
    if (isInformative && !isTransportable) {
        sendLog(logLevel.warn, logDetails.warn.WRN_IRRELEVANT_TAGS, JSON.stringify(record), fn.dataSources.city);
        return false;
    }
    return true;
}

module.exports = {
    addTags,
    filterByTags
}