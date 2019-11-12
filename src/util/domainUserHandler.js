const fn = require('../config/fieldNames');
const p = require('../config/paths');
const logger = require('./logger');
const Auth = require('../auth/auth');

/**
 *This module create domainUser for person, using the unique properties of each dataSource
 *
 * @param {*} person The Person object that returned from kartoffel
 * @param {*} record The raw object that coming from the dataSource
 * @param {*} dataSource The dataSource of the object
 * 
 *  */
module.exports = async (person, record, dataSource) => {
    let user_object = {
        uniqueID: record[fn[dataSource].mail],
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
        logger.info(`Add the domain user '${user_object.uniqueID}' to the person with the idetifier: ${user.data.personalNumber || user.data.identityCard} from ${dataSource} successfully.`);
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        logger.error(`Not add domain user to person with the identifier: ${person.mail} to the person with the idetifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${errMessage}"`);
    }

} 
