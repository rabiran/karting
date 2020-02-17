const fn = require('../config/fieldNames');
const filterCity = require('./filters/city/filterCity')

/**
 * Filter records by checking their data
 *
 * @param {Array<Object>} records - array of raw data about each person
 * @param {string} dataSource - the name of the data source
 */
module.exports = (records, dataSource) => {
    switch (dataSource) {
        case fn.dataSources.city:
            return filterCity(records);
        case fn.dataSources.adNN:
        case fn.dataSources.ads:
        case fn.dataSources.es:
        case fn.dataSources.lmn:
        case fn.dataSources.mdn:
        case fn.dataSources.mm:
        case fn.dataSources.nvSQL:
        default:
            return records;
    }
}