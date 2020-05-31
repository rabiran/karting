const matchToKartoffel = require('./matchToKartoffel');
const fn = require('../config/fieldNames');

/**
 * Returns the identifiers for the raw data record,
 * if it didn't already passed through matchToKartoffel.
 * otherwise just return them.
 * 
 * @param { Object } record - raw data object 
 * @param { string } dataSource - which data source
 * @param { boolean } isNotMatchedToKartoffel - weather the record passed trough matchToKartoffel
 * 
 * @returns { Object } - found identifiers
 */
const getIdentifiers = async (record, dataSource, isNotMatchedToKartoffel) => {
    if (!isNotMatchedToKartoffel) {
        return {
            personalNumber: record.personalNumber,
            identityCard: record.identityCard,   
            domuser: record.domainUsers[0].uniqueID
        }
    }

    let recordRelevants = {};

    fn[dataSource].idsFields.forEach(field => {
        recordRelevants[fn[dataSource][field]] = record[fn[dataSource][field]];
    });

    let ids = await matchToKartoffel(recordRelevants, dataSource);
    (dataSource === fn.dataSources.ads && record[fn[dataSource].sAMAccountName]) ?
            ids.domuser = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
        (dataSource === fn.dataSources.adNN && record[fn[dataSource].sAMAccountName]) ?
            ids.domuser = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
        (((dataSource === fn.dataSources.mdn) || (dataSource === fn.dataSources.lmn) || (dataSource === fn.dataSources.mm)) && record[fn[dataSource].uniqueID]) ?
            ids.domuser = record[fn[dataSource].uniqueID].toLowerCase() : null;
        (dataSource === fn.dataSources.es && record[fn[dataSource].userName]) ?
            ids.domuser = `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` : null;
        (dataSource === fn.dataSources.city && record[fn[dataSource].domainUsers]) ?
            ids.domuser = `${record[fn[dataSource].domainUsers].toLowerCase()}` : null; 

    return ids;
}

module.exports = getIdentifiers;
