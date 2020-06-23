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
const getIdentifiers = async (record, dataSource) => {
    let matchedRecord = await matchToKartoffel(record, dataSource);
    let domainUser;

    if (matchedRecord.entityType === fn.entityTypeValue.s || matchedRecord.entityType === fn.entityTypeValue.c) {
        return {
            personalNumber: matchedRecord.personalNumber,
            identityCard: matchedRecord.identityCard
        };
    } else if (matchedRecord.entityType === fn.entityTypeValue.gu) {
        (dataSource === fn.dataSources.ads && record[fn[dataSource].sAMAccountName]) ?
            domainUser = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
        (dataSource === fn.dataSources.adNN && record[fn[dataSource].sAMAccountName]) ?
            domainUser = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
        (((dataSource === fn.dataSources.mdn) || (dataSource === fn.dataSources.lmn) || (dataSource === fn.dataSources.mm)) && record[fn[dataSource].uniqueID]) ?
            domainUser = record[fn[dataSource].uniqueID].toLowerCase() : null;
        (dataSource === fn.dataSources.es && record[fn[dataSource].userName]) ?
            domainUser = `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` : null;
        (dataSource === fn.dataSources.city && record[fn[dataSource].domainUsers]) ?
            domainUser = `${record[fn[dataSource].domainUsers].toLowerCase()}` : null; 
    }
    

    return { domainUser };
}

module.exports = getIdentifiers;
