const fn = require('../../../config/fieldNames');
const { sendLog, logLevel } = require('../../logger');
const logDetails = require('../../logDetails');

/**
 * Filter by tags
 *
 * @param {Object} record
 */
module.exports = (record) => {
    let isTransportable = false;
    let isInformative = false;
    let tagsLength = record[fn[fn.dataSources.city].tags] ? record[fn[fn.dataSources.city].tags].length : 0;

    for (let i = 0; i < tagsLength; i++) {
        if (record[fn[fn.dataSources.city].tags][i].name === fn[fn.dataSources.city].userTags.transportable) {
            isTransportable = true;
        } else if (record[fn[fn.dataSources.city].tags][i].name === fn[fn.dataSources.city].userTags.information) {
            isInformative = true;
        }
    }

    if (isInformative && !isTransportable) {
        sendLog(logLevel.warn, logDetails.warn.WRN_IRRELEVANT_TAGS, JSON.stringify(record), fn.dataSources.city);
        return false;
    }

    return true;
}