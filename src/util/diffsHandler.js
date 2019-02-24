const p = require('../config/paths');
const matchToKartoffel = require('./matchToKartoffel');
const axios = require('axios');
const completeFromAka = require('./completeFromAka');
const fn = require('../config/fieldNames');
const logger = require('./logger');
const domainUserHandler = require('./domainUserHandler');
require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

const added = async (diffsObj, dataSource, aka_all_data) => {

    for (let i = 0; i < diffsObj.length; i++) {
        const record = diffsObj[i];
        let person_ready_for_kartoffel = await matchToKartoffel(record, dataSource);
        // Define the unique changes for each "dataSource"
        let person_existence_checking;
        if (dataSource === "es") {
            person_existence_checking = `${p(person_ready_for_kartoffel.identityCard).KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}`;
        }

        else if (dataSource === "ads") {
            if (!person_ready_for_kartoffel.entityType) {
                logger.warn(`To the person with the identifier: ${person_ready_for_kartoffel.mail} has not have "userPrincipalName" field at ads`);
                continue;
            }

            (person_ready_for_kartoffel.entityType === fn.entityTypeValue.c) ? person_existence_checking = `${p(person_ready_for_kartoffel.identityCard).KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}` : null;
            (person_ready_for_kartoffel.entityType === fn.entityTypeValue.s) ? person_existence_checking = `${p(person_ready_for_kartoffel.personalNumber).KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_PN_API}` : null;
        };
        // Checking if the person is already exist in Kartoffel and accept his object from Kartoffel
        try {
            // if the person is already exist in Kartoffel => only add secondary user.
            const person = await axios.get(person_existence_checking);
            domainUserHandler(person.data, person_ready_for_kartoffel, record, false, dataSource);
        }
        // if the person does not exist in Kartoffel => complete the data from aka (if exist), add him to specific hierarchy & adding primary user    
        catch (err) {
            // check if the perosn not exist in Kartoffel (404 status), or if there is another error
            if (err.response.status === 404) {
                // complete the data from aka (if exist):
                person_ready_for_kartoffel = completeFromAka(person_ready_for_kartoffel, aka_all_data, dataSource);
                // Add the complete person object to Kartoffel
                axios.post(p().KARTOFFEL_PERSON_API, person_ready_for_kartoffel)
                    .then((person) => {
                        (person.data.entityType == fn.entityTypeValue.s) ?
                            logger.info(`The person with the personalNumber: ${person.data.personalNumber} from ${dataSource}_complete_data successfully insert to Kartoffel`) :
                            logger.info(`The person with the identityCard: ${person.data.identityCard} from ${dataSource}_complete_data successfully insert to Kartoffel`);
                        // add primary domain user for the new preson
                        domainUserHandler(person.data, person_ready_for_kartoffel, record, true, dataSource);

                    })
                    .catch(err => {
                        (person_ready_for_kartoffel.entityType == fn.entityTypeValue.s) ?
                            logger.error(`Not insert the person with the personalNumber: ${person_ready_for_kartoffel.personalNumber} from ${dataSource}_complete_data to Kartoffel. The error message:"${err.response.data}"`) :
                            logger.error(`Not insert the person with the identityCard: ${person_ready_for_kartoffel.identityCard} from ${dataSource}_complete_data to Kartoffel. The error message:"${err.response.data}"`);
                    })

            }
            else {
                let identifier = (dataSource === "nv") ? record.uniqueId : record.personalNumber;
                logger.error(`The person with the identifier: ${identifier} from ${dataSource}_raw_data not found in Kartoffel. The error message:"${err.response.data}"`);
            };
        }
    }
}








module.exports = (diffsObj, dataSource, aka_all_data) => {

    //added the new person from es to Kartoffel
    added(diffsObj.added, dataSource, aka_all_data);

}
