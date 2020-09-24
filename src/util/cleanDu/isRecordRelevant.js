const fn = require('../../config/fieldNames')

/**
 * Check if a given record is 
 * 
 * @param {Object} record 
 * @param {string} dataSource
 * @returns {Boolean} weather the record is still relevant to kartoffel 
 */
module.exports = (record, dataSource) => {
    switch (dataSource) {
        case fn.dataSources.ads:
            return checkAdsRecord(record);
        case fn.dataSources.adNN:
            return checkAdNNRecord(record);
        default:
            return true;
    }
}

/**
 * check relevance for ads
 * 
 * @param {Object} record 
 * @returns {Boolean} weather the record is relevant to kartoffel
 */
function checkAdsRecord(record) {
    return !!record[fn.ads_name.upn];
}

/**
 * check relevance for adNN
 * 
 * @param {Object} record 
 * @returns {Boolean} weather the record is relevant to kartoffel
 */
function checkAdNNRecord(record) {
    // return !!record[fn.adNN_name.upn];
}