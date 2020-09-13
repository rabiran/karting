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
    const irrelevantRecords = data.filter(record => isRecordRelevant(record, dataSource));
    const irrelevantDus = irrelevantRecords.map((record, dataSource) => isolateDu(dataSource, record, sendLog));

    return irrelevantDus;
}

function isolateDu(dataSource, record, sendLog) {
    return assembleDomainUser(dataSource, record, sendLog);
}

module.exports = getIrrelevantDus;
