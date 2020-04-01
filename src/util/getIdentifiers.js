const matchToKartoffel = require('./matchToKartoffel');
const fn = require('../config/fieldNames');

/**
 * Returns the identifiers for the raw data record
 * 
 * @param { object } record - raw data object 
 * @param { string } dataSource - which data source
 */
const getIdentifiers = async (record, dataSource) => {
    let recordRelevants = {};

    fn[dataSource].idsFields.forEach(field => {
        recordRelevants[fn[dataSource][field]] = record[fn[dataSource][field]];
    });

    return await matchToKartoffel(recordRelevants, dataSource);
}

module.exports = getIdentifiers;