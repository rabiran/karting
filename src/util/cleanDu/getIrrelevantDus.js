const assembleDomainUser = require('../fieldsUtils/assembleDomainUser');
const fn = require('../../config/fieldNames');
const diff = require('diff-arrays-of-objects');
const fs = require("fs");
const { filename } = require('winston-daily-rotate-file');
const p = require('../../config/paths');

/**
 * check each record if its irrelevant anymore
 * for kartoffel. For Example the user isn't belong
 * to anyone anymore
 * 
 * @param {Array} records - array of records 
 * @param {string} dataSource
 * @param {Function} sendLog - logger
 */
function getIrrelevantDus(records, persons, dataSource, sendLog, Auth) {
    
    
    const isolateDu = assembleDomainUser;
    
    /**
     * filter the unneseccary records from accorrding to
     * the current data
     * 
     * @param {string} dataSource - the data source
     * @param {Array} records - all the current data from the data source
     * @returns {Array} - all the irrelevant records
     */
    function filterIrrelevantByDataSource(dataSource, records, persons) {
        switch (dataSource) {
            case fn.dataSources.aka:
                return []
            case fn.dataSources.es:
                return getRemovedDu(records, persons, dataSource);
            case fn.dataSources.city:
                return getRemovedDu(records, persons, dataSource);
            case fn.dataSources.ads:
                return filterAdsRecord(records)
            case fn.dataSources.adNN:
                return filterAdNNRecord(records)
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
        if(records.length > 0) {
            const irrelevattRecords = records.filter(record => !record[fn.ads_name.upn]);
            const irrelevantDus = irrelevattRecords.map(record => isolateDu(dataSource, record, sendLog))
            return irrelevantDus;
        } else {
            return []
        }
    }
    
    /**
     * filter irelevance records for adNN
     * 
     * @param {Object} records
     * @returns {array} the records for delete
     */
    function filterAdNNRecord(records) {
        if(records.length > 0) {
            return records.filter(record => !record[fn.adNN_name.upn])
        } else {
            return []
        }
    }
    
    /**
     * filter irrelevant records of dataSource
     * 
     * @param {Array} records - current data for data source
     * @param {Array} persons - the kartofel data of the data sou
     * @param {string} dataSource - the data source of the data
     * @returns {array} the records to delete
     */
    function getRemovedDu (records, persons, dataSource) {
        if(records.length > 0) {
            const sourceRecordsDus = records.map(record => assembleDomainUser(dataSource, record, sendLog).toLowerCase());
            const kartoffelPersonsDus = persons.map(person => person.domainUsers.filter(obj => obj.dataSource == dataSource)).flat().map(obj => obj.uniqueID.toLowerCase());
            const dusToRemove = kartoffelPersonsDus.filter(du => !sourceRecordsDus.includes(du));
            return dusToRemove;
        } else {
            return []
        }
    }

    const irrelevantDus = filterIrrelevantByDataSource(dataSource, records, persons)
    
    return irrelevantDus;
}

module.exports = getIrrelevantDus;
