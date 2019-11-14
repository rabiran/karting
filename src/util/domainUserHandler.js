const fn = require('../config/fieldNames');
const p = require('../config/paths');
const {sendLog, logLevel} = require('./logger');
const logDetails = require('../util/logDetails');
const Auth = require('../auth/auth');

/**
 *This module create domainUser (primary or secondary) for person, using the unique properties of each dataSource
 *
 * @param {*} person The Person object that returned from kartoffel
 * @param {*} record The raw object that coming from the dataSource
 * @param {*} isPrimary Define if create primary or secondary domainUser
 * @param {*} dataSource The dataSource of the object
 * 
 *  */
module.exports = async (person, record, isPrimary, dataSource) => {
    let user_object = {
        uniqueID: record[fn[dataSource].mail],
        isPrimary: isPrimary,
    };

    (dataSource === fn.dataSources.ads && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (dataSource === fn.dataSources.adNN && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (((dataSource === fn.dataSources.mdn) || (dataSource === fn.dataSources.lmn) || (dataSource === fn.dataSources.mm)) && record[fn[dataSource].uniqueID]) ?
        user_object.uniqueID = record[fn[dataSource].uniqueID].toLowerCase() : null;
    (dataSource === fn.dataSources.es && record[fn[dataSource].userName]) ?
        user_object.uniqueID = `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` : null;

    if (!user_object.uniqueID) {
        return;
    }
    else {
        if (person.primaryDomainUser && person.primaryDomainUser.uniqueID == user_object.uniqueID) {
            return;
        }
        if (person.secondaryDomainUsers.length !== 0) {
            let breaking = false;
            person.secondaryDomainUsers.map(sdu => {
                if (sdu.uniqueID === user_object.uniqueID) {
                    return breaking = true;
                }
            })
            if (breaking) { return; }
        }
    }

    try {
        const user = await Auth.axiosKartoffel.post(p(person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        sendLog(logLevel.info, logDetails.info.INF_ADD_DOMAIN_USER, (isPrimary) ? "primary" : "secondary", user_object.uniqueID, user.data.personalNumber || user.data.identityCard, dataSource);
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        sendLog(logLevel.error, logDetails.error.ERR_ADD_DOMAIN_USER, (isPrimary) ? "primary" : "secondary", person.mail, person.personalNumber || person.identityCard, dataSource, errMessage);        
    }

} 
