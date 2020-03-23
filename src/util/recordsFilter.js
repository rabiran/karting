const fn = require('../config/fieldNames');
const filterCity = require('./filters/city/filterCity');
const filterAka = require('./filters/aka/filterAka');


/**
 * Filter records by checking their data
 *
 * @param {Array<Object>} records - array of raw data about each person
 * @param {string} dataSource - the name of the data source
 */
module.exports = async (records, dataSource) => {
    switch (dataSource) {
        case fn.dataSources.aka:
            return await filterAka(records);
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