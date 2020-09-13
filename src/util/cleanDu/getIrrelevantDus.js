const isRecordRelevant = require('./isRecordRelevant');
const assembleDomainUser = require('../fieldsUtils/assembleDomainUser');

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
    // TODO...
}

module.exports = getIrrelevantDus;
