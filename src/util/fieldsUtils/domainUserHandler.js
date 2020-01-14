const fn = require('../../config/fieldNames');
const p = require('../../config/paths');
const {sendLog, logLevel} = require('../logger');
const logDetails = require('../logDetails');
const Auth = require('../../auth/auth');

/**
 *This module create domainUser for person, using the unique properties of each dataSource
 *
 * @param {*} person The Person object that returned from kartoffel
 * @param {*} record The raw object that coming from the dataSource
 * @param {*} dataSource The dataSource of the object
 * 
 *  */
module.exports = async (person, record, dataSource) => {
    let dataSourceName = dataSource;
    if ([fn.dataSources.lmn, 
         fn.dataSources.mdn, 
         fn.dataSources.mm].includes(dataSource)) {
            dataSourceName = 'Nova';
         }

    let user_object = {
        uniqueID: record[fn[dataSource].mail],
        dataSource: dataSourceName,
    };

    (dataSource === fn.dataSources.ads && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (dataSource === fn.dataSources.adNN && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (((dataSource === fn.dataSources.mdn) || (dataSource === fn.dataSources.lmn) || (dataSource === fn.dataSources.mm)) && record[fn[dataSource].uniqueID]) ?
        user_object.uniqueID = record[fn[dataSource].uniqueID].toLowerCase() : null;
    (dataSource === fn.dataSources.es && record[fn[dataSource].userName]) ?
        user_object.uniqueID = `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` : null;
    (dataSource === fn.dataSources.city && record[fn[dataSource].domainUsers]) ? user_object.uniqueID = `${person[fn[dataSource].domainUsers]}`: null;

    if (!user_object.uniqueID) {
        return;
    } else {
        if (person.domainUsers.length > 0) {
            let breaking = false;
            person.domainUsers.map(du => {
                if (du.uniqueID === user_object.uniqueID) {
                    return breaking = true;
                }
            })
            if (breaking) { return; }
        }
    }

    try {
        const user = await Auth.axiosKartoffel.post(p(person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        sendLog(logLevel.info, logDetails.info.INF_ADD_DOMAIN_USER, user_object.uniqueID, user.data.personalNumber || user.data.identityCard, dataSource);
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        sendLog(logLevel.error, logDetails.error.ERR_ADD_DOMAIN_USER, person.mail, person.personalNumber || person.identityCard, dataSource, errMessage);        
    }
} 
