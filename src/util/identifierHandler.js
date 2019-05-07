const logger = require('./logger');
const validators = require('../config/validators');

/**
 * This module checking if the personalNumber & the identityCard of specific person are equal 
 * and delete the redundant field by the identityCard's Validator
 *
 * @param {*} person Object of person with the keys identityCard and personalNumber
 * @returns The person object with the reapir fileds
 */
module.exports = (person) => {
    if ((person.identityCard == person.personalNumber) && (person.identityCard)) {
        validators(person.identityCard).identityCard ? person.personalNumber = null : person.identityCard = null;
        // delete the empty fields from the returned object
        Object.keys(person).forEach((key) => {
            if (!person[key] || person[key] === "null") {
                logger.warn(`The identifier fields of the person ${person.personalNumber || person.identityCard} are equals, the '${key}' field was deleted`);
                delete person[key];
            }
        });

    }
    return person;
};