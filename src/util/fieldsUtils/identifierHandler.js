const {sendLog, logLevel} = require('../logger');
const logDetails = require('../logDetails');
const validators = require('../../config/validators');

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
                sendLog(logLevel.warn, logDetails.warn.WRN_IDENTIFIER_FIELD_REDUNDANT, person.personalNumber || person.identityCard, key);                
                delete person[key];
            }
        });

    }
    return person;
};