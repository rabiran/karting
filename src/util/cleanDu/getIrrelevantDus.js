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
 * @param {Array} data - array of records 
 * @param {string} dataSource
 * @param {Function} sendLog - logger
 */
function getIrrelevantDus(data, dataSource, sendLog, Auth) {
    
    
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
                return getRemovedDu(data, dataSource);
            case fn.dataSources.city:
                return getRemovedDu(data, dataSource);
            case fn.dataSources.ads:
                return filterAdsRecord(data)
            case fn.dataSources.adNN:
                return filterAdNNRecord(data)
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
        const irrelevattRecords = records.filter(record => !record[fn.ads_name.upn]);
        const irrelevantDus = irrelevattRecords.map(record => isolateDu(dataSource, record, sendLog)
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
     * filter irrelevant records of dataSource
     * 
     * @param {Object} records - current data
     * @param {string} dataSource - the data source of the data
     * @returns {array} the records to delete
     */
    async function getRemovedDu(records, dataSource) {
        const duToRemove = [];
        const query = {
            params: `domainUsers.dataSource=${dataSource}`
        }

        const dataSourcePersons = await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API, query);
        
        for (person of dataSourcePersons) {
            for (domainUserObj of person.domainUsers) {
                if (domainUserObj.dataSource !== dataSource) {
                    continue;
                }
                
                const parallelRecord = findParallelRecord(records, domainUserObj, dataSource);
                
                if (!parallelRecord) {
                    duToRemove.push(domainUserObj.uniqeID);
                }
            }
        }
        
        return duToRemove;
    }
    
    /**
     * 
     * @param {Array} records - the records from dataSource
     * @param {Object} domainUserObj - domainUser object from kartoffel
     * @param {string} dataSource - the data source
     * @returns {Object} - the parallel record of the domainUser
     */
    function findParallelRecord(records, domainUserObj, dataSource) {
        //TODO...
    }
    
    const irrelevantRecords = filterIrrelevantByDataSource(dataSource, data, sendLog, Auth)
    const irrelevantDus = irrelevantRecords.map((record, dataSource) => isolateDu(dataSource, record, sendLog)); //no needl
    
    return irrelevantDus;
}

module.exports = getIrrelevantDus;
