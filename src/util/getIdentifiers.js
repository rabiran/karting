const matchToKartoffel = require('./matchToKartoffel');
const fn = require('../config/fieldNames');
const assembleDomainUser = require('./fieldsUtils/assembleDomainUser');

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
const getIdentifiers = async (record, dataSource, Auth, sendLog) => {
    let matchedRecord = await matchToKartoffel(record, dataSource, Auth, sendLog);
    let domainUser;

    if (matchedRecord.entityType === fn.entityTypeValue.s || matchedRecord.entityType === fn.entityTypeValue.c) {
        return {
            personalNumber: matchedRecord.personalNumber,
            identityCard: matchedRecord.identityCard
        };
    } else if (matchedRecord.entityType === fn.entityTypeValue.gu) {
        domainUser = assembleDomainUser(dataSource, record, sendLog);
    }
    
    return { domainUser };
}

module.exports = getIdentifiers;
