const matchToKartoffel = require('./matchToKartoffel');
const fn = require('../config/fieldNames');

/**
 * Returns the identifiers for the raw data record,
 * if it didn't already passed through matchToKartoffel,
 * otherwise just return them.
 * 
 * @param { Object } record - raw data object 
 * @param { string } dataSource - which data source
 * 
 * @returns { Object } - found identifiers
 */
const getIdentifiers = async (record, dataSource) => {
    if (record.personalNumber || record.identityCard) {
        return {
            personalNumber: record.personalNumber,
            identityCard: record.identityCard
        }
    }

    let recordRelevants = {};

    fn[dataSource].idsFields.forEach(field => {
        recordRelevants[fn[dataSource][field]] = record[fn[dataSource][field]];
    });

    return await matchToKartoffel(recordRelevants, dataSource);
}

module.exports = getIdentifiers;