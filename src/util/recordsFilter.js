const fn = require('../config/fieldNames');
const filterCity = require('./filters/city/filterCity');
const filterAka = require('./filters/aka/filterAka');
const DataModel = require('./DataModel');


/**
 * Filter records by checking their data
 *
 * @param {Array<DataModel>} dataModels - array of raw data about each person
 * @param {string} dataSource - the name of the data source
 */
module.exports = async (dataModels) => {
    switch (dataModels.dataSource) {
        case fn.dataSources.aka:
            return await filterAka(dataModels);
        case fn.dataSources.city:
            return filterCity(dataModels);
        case fn.dataSources.adNN:
        case fn.dataSources.ads:
        case fn.dataSources.es:
        case fn.dataSources.lmn:
        case fn.dataSources.mdn:
        case fn.dataSources.mm:
        case fn.dataSources.nvSQL:
        default:
            return dataModels;
    }
}