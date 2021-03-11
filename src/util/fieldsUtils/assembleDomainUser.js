const fn = require('../../config/fieldNames');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');

/**
 * create custom uniqeID's domainUser according the given dataSource
 * 
 * @param {string} dataSource
 * @param {object} record
 * @returns {string} the custom uniqeID for each dataSource
 */
function assembleDomainUser(dataSource, record, sendLog) {
    switch (dataSource) {
        case fn.dataSources.ads:
            return (record[fn[dataSource].sAMAccountName] ?
                `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}`.toLowerCase() :
                null);
        case fn.dataSources.adNN:
            return (record[fn[dataSource].sAMAccountName] ?
                `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}`.toLowerCase() :
                null);
        case fn.dataSources.mdn:
        case fn.dataSources.lmn:
        case fn.dataSources.novaMM:
            return (record[fn[dataSource].uniqueID] ?
                record[fn[dataSource].uniqueID].toLowerCase() :
                null);
        case fn.dataSources.mm:
            return (record[fn[dataSource].primaryDU].uniqueID ?
                record[fn[dataSource].primaryDU].uniqueID.toLowerCase() :
                null);
        case fn.dataSources.es:
            return (record[fn[dataSource].userName] ?
                `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}`.toLowerCase() :
                null);
        case fn.dataSources.city:
            return (record[fn[dataSource].domainUsers] ?
                `${record[fn[dataSource].domainUsers].toLowerCase()}` : null);
        default:
            sendLog(logLevel.error, logDetails.ERR_UNRECOGNIZED_DATA_SOURCE, assembleDomainUser.name, dataSource, record);
    }
}

module.exports = assembleDomainUser;
