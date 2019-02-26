/**
 * This module checking if the personalNumber & the identityCard of specific person are equal 
 * and delete the redundant field by recognized which of them is not matching 
 */
const logger = require('./logger');

const identityCardValidation = (idNumber) => {
    idNumber = idNumber.toString();
    if (!idNumber.match(/^\d{5,9}$/g)) return false;
    // The number is too short - add leading zeroes
    idNumber = idNumber.padStart(9, '0');
    //ID Validation
    const accumulator = idNumber.split('').reduce((count, currChar, currIndex) => {
        const num = Number(currChar) * ((currIndex % 2) + 1);
        return count += num > 9 ? num - 9 : num;
    }, 0);
    return (accumulator % 10 === 0);
}


module.exports = (person) => {
    if (person.identityCard == person.personalNumber) {
        (identityCardValidation(person.identityCard)) ? person.personalNumber = null : person.identityCard = null;
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