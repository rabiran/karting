const p = require('../config/paths');
const fn = require('../config/fieldNames');
const matchToKartoffel = require('./matchToKartoffel');
const axios = require('axios');
const completeFromAka = require('./completeFromAka');
const logger = require('./logger');
const domainUserHandler = require('./domainUserHandler');
const identifierHandler = require('./identifierHandler');
const currentUnit_to_DataSource = require('./createDataSourcesMap');
const updateSpecificFields = require("./updateSpecificFields");

require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSourceperson_ready_for_kartoffel - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

const added = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource) => {

    for (let i = 0; i < diffsObj.length; i++) {
        const record = diffsObj[i];
        let person_ready_for_kartoffel = await matchToKartoffel(record, dataSource);

        // Checking if the person is already exist in Kartoffel and accept his object
        try {
            // if the person is already exist in Kartoffel => only add secondary user.
            let identifier = person_ready_for_kartoffel.identityCard || person_ready_for_kartoffel.personalNumber;
            if (identifier) {
                const person = await axios.get(`${p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING}`);
                let isPrimary = (currentUnit_to_DataSource.get(person.data.currentUnit) === dataSource) ? true : false;
                await domainUserHandler(person.data, record, isPrimary, dataSource);
            }
            else {
                logger.warn(`There is no identifier to the person: ${JSON.stringify(person_ready_for_kartoffel)}`);
            }
        }
        // if the person does not exist in Kartoffel => complete the data from aka (if exist), add him to specific hierarchy & adding primary user    
        catch (err) {
            // check if the perosn not exist in Kartoffel (404 status), or if there is another error
            if (err.response.status === 404) {
                // complete the data from aka (if exist):
                aka_all_data ? person_ready_for_kartoffel = completeFromAka(person_ready_for_kartoffel, aka_all_data, dataSource) : null;
                person_ready_for_kartoffel = identifierHandler(person_ready_for_kartoffel);
                // Add the complete person object to Kartoffel
                try {
                    // check if the current unit from aka belong to our orginization, if not the loop will continue to the next iteration
                    if (!currentUnit_to_DataSource.get(person_ready_for_kartoffel.currentUnit) && person_ready_for_kartoffel.entityType === fn.entityTypeValue.s) {
                        logger.warn(`Ignoring from this person because his currentUnit is not from ${fn.rootHierarchy}.  ${JSON.stringify(person_ready_for_kartoffel)}`);
                        continue;
                    }
                    let person = await axios.post(p().KARTOFFEL_PERSON_API, person_ready_for_kartoffel);
                    logger.info(`The person with the personalNumber: ${person.data.personalNumber || person.data.identityCard} from ${dataSource}_complete_data successfully insert to Kartoffel`);
                    // add domain user for the new preson 
                    let isPrimary = (currentUnit_to_DataSource.get(person.data.currentUnit) === dataSource) ? true : false;
                    await domainUserHandler(person.data, record, isPrimary, dataSource);
                }
                catch (err) {
                    let errMessage = err.response ? err.response.data : err.message;
                    logger.error(`Not insert the person with the personalNumber: ${person_ready_for_kartoffel.personalNumber || person_ready_for_kartoffel.identityCard} from ${dataSource}_complete_data to Kartoffel. The error message:"${errMessage}" ${JSON.stringify(record)}`);
                }
            }
            else {
                let errMessage = err.response ? err.response.data : err.message;
                logger.error(`The person with the identifier: ${identifier} from ${dataSource}_raw_data not found in Kartoffel. The error message:"${errMessage}"`);
            };
        }
    }
}
const updated = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource) => {
    for (let i = 0; i < diffsObj.length; i++) {
        const record = diffsObj[i];
        if (dataSource === "aka") {
            updateSpecificFields(record[2]);
        }
        else {
            let identifier = record[0][fn[dataSource].personalNumber] || record[0][fn[dataSource].identityCard];
            let akaRecord = aka_all_data.find(person => ((person[fn.aka.personalNumber] == identifier) || (person[fn.aka.identityCard] == identifier)));
            if (currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]) === dataSource) {
                // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
                updateSpecificFields(record[2].filter((deepDiffObj) => {
                    let include = fn.akaRigid.includes(deepDiffObj.path.toString())
                    include ? null : logger.warn(`The field '${deepDiffObj.path.toString()}' of the person with the identifier ${identifier} from the dataSource '${dataSource}' is not update because is rigid to Aka`);
                    return !include;
                }));
            }
            else {
                // Add secondary domain user from the record if the required data exist
                try {
                    let person = await axios.get(P(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING);
                    domainUserHandler(person, record, false, dataSource);
                }
                catch (err) {
                    logger.err(`Failed to get data from Kartoffel about the person with the identifier ${identifier} from '${dataSource}' when trying to add him dumainUser at update flow. The error message: "${err}"`);
                }
                logger.warn(`The data about the person with the identifier ${identifier} updated but not saved in kartoffel because the dataSource '${dataSource}' is not match to the person's currentUnit '${currentUnit_to_DataSource.get(akaRecord.currentUnit)}'`);
            }
        }
    }
}




module.exports = (diffsObj, dataSource, aka_all_data) => {
    //added the new person from es to Kartoffel
    added(diffsObj.added, dataSource, aka_all_data, currentUnit_to_DataSource);
    updated(diffsObj.updated, dataSource, aka_all_data, currentUnit_to_DataSource);
}