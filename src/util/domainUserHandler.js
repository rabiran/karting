const fn = require('../config/fieldNames');
const p = require('../config/paths');
const logger = require('./logger');
const kartofelAxios = require('../auth/auth');

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

    (dataSource === fn.dataSources.ads && record[fn.ads.sAMAccountName]) ?
        user_object.uniqueID = `${record[fn.ads.sAMAccountName]}${fn.ads.domainSuffix}` : null;
    (dataSource === fn.dataSources.adNN && record[fn.adNN.sAMAccountName]) ?
        user_object.uniqueID = `${record[fn.adNN.sAMAccountName]}${fn.adNN.domainSuffix}` : null;
    (dataSource === fn.dataSources.nvSQL && record[fn.nv.uniqueID]) ?
        user_object.uniqueID = record[fn.nv.uniqueID].toLowerCase() : null;
    (dataSource === fn.dataSources.es && record[fn.es.userName]) ?
        user_object.uniqueID = `${record[fn.es.userName]}${fn.es.domainSuffix}` : null;

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
            if (breaking){return;}
        }
    }

    try {
        const user = await kartofelAxios.post(p(person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        logger.info(`Add ${(isPrimary) ? "primary" : "secondary"} user ${user_object.uniqueID} to the person with the idetifier: ${user.data.personalNumber || user.data.identityCard} from ${dataSource} successfully.`);
    } catch (err) {
        logger.error(`Not add ${(isPrimary) ? "primary" : "secondary"} user to person with the identifier: ${person.mail} to the person with the idetifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${err.response.data}"`);
    }

} 
