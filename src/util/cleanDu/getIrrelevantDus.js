const isRecordRelevant = require('./isRecordRelevant');
const assembleDomainUser = require('../fieldsUtils/assembleDomainUser');
const fn = require('../../config/fieldNames');
const diff = require('diff-arrays-of-objects');
const fs = require("fs");
const { filename } = require('winston-daily-rotate-file');

/**
 * check each record if its irrelevant anymore
 * for kartoffel. For Example the user isn't belong
 * to anyone anymore
 * 
 * @param {Array} data - array of records 
 * @param {string} dataSource
 * @param {Function} sendLog - logger
 */
function getIrrelevantDus(data, dataSource, sendLog) {
    const irrelevantRecords = filterIrrelevantByDataSource(dataSource, data)
    const irrelevantDus = irrelevantRecords.map((record, dataSource) => isolateDu(dataSource, record, sendLog));

    return irrelevantDus;
}

function isolateDu(dataSource, record, sendLog) {
    return assembleDomainUser(dataSource, record, sendLog);
}

/**
 * filter the unneseccary records from accorrding to
 * the current data
 * 
 * @param {string} dataSource - the data source
 * @param {Array} data - all the current data from the data source
 * @returns {Array} - all the irrelevant records
 */
function filterIrrelevantByDataSource(dataSource, data) {
    switch (dataSource) {
        case fn.dataSources.aka:
            return []
        case fn.dataSources.es:
            return filterEsRecord(data)
        case fn.dataSources.ads:
            return filterAdsRecord(data)
        case fn.dataSources.adNN:
            return filterAdNNRecord(data)
        case fn.dataSources.mdn:
        case fn.dataSources.mm:
        case fn.dataSources.lmn:
        case fn.dataSources.city:
            return filterCityRecord(data)
        default:
            sendLog(logLevel.error, logDetails.error.ERR_UNIDENTIFIED_DATA_SOURCE);
    }

}


/**
 * filter irelevance records for ads
 * 
 * @param {Object} records 
 * @returns {array} the records for delete
 */
function filterAdsRecord(records) {
    return records.filter(record => !record[fn.ads_name.upn])
}

/**
 * filter irelevance records for adNN
 * 
 * @param {Object} records
 * @returns {array} the records for delete
 */
function filterAdNNRecord(records) {
    return records.filter(record => !record[fn.adNN_name.upn])
}

/**
 * filter irelevance records for es
 * 
 * @param {Object} records 
 * @returns {array} the records for delete
 */
function filterEsRecord(records) {
    let files = fs.readdirSync(`${fn.esRecoveryDataFolder}`);
    let filename = files.find(file => file.endsWith('.log'))
    let esData = JSON.parse(fs.readFileSync(`${fn.esRecoveryDataFolder}${filename}`));

    let diffObj = diff(esData, records, fn[fn.dataSources.es].uniqeFieldForDeepDiff);
    
    let recordsToRemove = diffObj.removed;

    return recordsToRemove;
}

/**
 * filter irelevance records for city
 * 
 * @param {Object} records 
 * @returns {array} the records for delete
 */
function filterCityRecord(records) {
    let files = fs.readdirSync(`${fn.cityRecoveryDataFolder}`);
    let filename = files.find(file => file.endsWith('.log'))
    let cityData = JSON.parse(fs.readFileSync(`${fn.cityRecoveryDataFolder}${filename}`));

    let diffObj = diff(cityData, records, fn[fn.dataSources.city].uniqeFieldForDeepDiff);
    
    let recordsToRemove = diffObj.removed;

    return recordsToRemove;
}

module.exports = getIrrelevantDus;
