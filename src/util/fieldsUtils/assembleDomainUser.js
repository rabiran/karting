const fn = require('../../config/fieldNames');

/**
 * create custom uniqeID's domainUser according the given dataSource
 * 
 * @param {string} dataSource 
 * @param {object} record
 * @returns {string} the custom uniqeID for each dataSource
 */
module.exports = (dataSource, record) => {
    switch (dataSource) {
        case fn.dataSources.ads:
            return (record[fn[dataSource].sAMAccountName] ?
                `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` :
                null);
        case fn.dataSources.adNN:
            return (record[fn[dataSource].sAMAccountName] ?
                `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` :
                null);
        case fn.dataSources.mdn:
        case fn.dataSources.lmn:
        case fn.dataSources.mm:
            return (record[fn[dataSource].uniqueID] ?
                record[fn[dataSource].uniqueID].toLowerCase() :
                null);
        case fn.dataSources.es:
            return (record[fn[dataSource].userName] ?
                `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` :
                null);
        case fn.dataSources.city:
            return (record[fn[dataSource].domainUsers] ?
                `${record[fn[dataSource].domainUsers].toLowerCase()}` : null);
        default:
            return null;
    }
}