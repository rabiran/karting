const fn = require('../config/fieldNames');
const p = require('../config/paths');
const axios = require('axios');
const logger = require('./logger');

module.exports = async (person, person_ready_for_kartoffel, record, isPrimary, dataSource) => {
    let user_object = {
        personId: person.id,
        uniqueID: person_ready_for_kartoffel.mail,
        isPrimary: isPrimary,
    };

    (dataSource === "ads" && record[fn.ads.sAMAccountName]) ?
        user_object.uniqueID = `${record[fn.ads.sAMAccountName]}${fn.ads.domainSuffix}` : null;
    (dataSource === "adNN" && record[fn.adNN.sAMAccountName]) ?
        user_object.uniqueID = `${record[fn.adNN.sAMAccountName]}${fn.adNN.domainSuffix}` : null;
    (dataSource === "nvSQL" && record[fn.nv.uniqueID]) ?
        user_object.uniqueID = record[fn.nv.uniqueID].toLowerCase() : null;
    (dataSource === "es" && record[fn.es.userName]) ?
        user_object.uniqueID = `${record[fn.es.userName]}${fn.es.domainSuffix}` :
        logger.warn(`The user with the identifier ${person.identityCard || person.personalNumber} from ${dataSource} does not have ${fn.es.userName} field`);
    if (!user_object.uniqueID) {
        return;
    }
    else {
        if (person.primaryDomainUser && person.primaryDomainUser.uniqueID == user_object.uniqueID) {
            return;
        }
        if (person.secondaryDomainUsers.length !== 0) {
            person.secondaryDomainUsers.filter(sdu => {
                if (sdu.uniqueID === user_object.uniqueID) {
                    return;
                }
            })
        }
    }

    try {
        const user = await axios.post(p().KARTOFFEL_DOMAIN_USER_API, user_object);
        logger.info(`Create the ${(isPrimary) ? "primary" : "secondary"} user ${user_object.uniqueID} to the person with the idetifier: ${user.data.personalNumber || user.data.identityCard} from ${dataSource} successfully.`);
    } catch (err) {
        logger.error(`Not create ${(isPrimary) ? "primary" : "secondary"} user to person with the identifier: ${person.mail} to the person with the idetifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${err.response.data}"`);
    }

} 
