const fn = require('../config/fieldNames');
const p = require('../config/paths');
const axios = require('axios');
const logger = require('./logger');

module.exports = async (person, person_ready_for_kartoffel,record, isPrimary, dataSource) => {
    let user_object = {
        personId: person.data.id,
        uniqueID: person_ready_for_kartoffel.mail,
        isPrimary: isPrimary,
    };

    (dataSource === "ads" && record[fn.ads.sAMAccountName]) ?
        user_object.uniqueID = `${record[fn.ads.sAMAccountName]}${fn.ads.domainSuffix}` : null;
    (dataSource === "es" && record[fn.es.userName]) ?
        user_object.uniqueID = `${record[fn.es.userName]}${fn.es.domainSuffix}` :
        logger.warn(`The user with the identifyer ${person.data.identityCard || person.data.personalNumber} from ${dataSource} does not have ${fn.es.userName} field`);

    try {
        const user = await axios.post(p().KARTOFFEL_DOMAIN_USER_API, user_object);
        (user.data.entityType == fn.entityTypeValue.s) ?
            logger.info(`Create the ${(isPrimary) ? "primary" : "secondary"} user ${user_object.uniqueID} to the person with personalNumber: ${user.data.personalNumber} from ${dataSource}_complete_data successfully.`) :
            logger.info(`Create the ${(isPrimary) ? "primary" : "secondary"} user ${user_object.uniqueID} to the person with identityCard: ${user.data.identityCard} from ${dataSource}_complete_data successfully.`);

    } catch (err) {
        (person.data.entityType == fn.entityTypeValue.s) ?
            logger.error(`Not create ${(isPrimary) ? "primary" : "secondary"} user to person with the identifyer: ${person.data.mail} to the person with personalNumber: ${person.data.personalNumber} from ${dataSource}_complete_data. The error message:"${err.response.data}"`) :
            logger.error(`Not create ${(isPrimary) ? "primary" : "secondary"} user to person with the identifyer: ${person.data.mail} to the person with identityCard: ${person.data.identityCard} from ${dataSource}_complete_data. The error message:"${err.response.data}"`);
    }
} 