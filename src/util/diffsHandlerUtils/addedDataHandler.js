const matchToKartoffel = require('../matchToKartoffel');
const completeFromAka = require('../completeFromAka');
const identifierHandler = require('../fieldsUtils/identifierHandler');
const diff = require("diff-arrays-of-objects");
const updated = require('./updatedDataHandler')
const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const {sendLog, logLevel} = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const Auth = require('../../auth/auth');

require('dotenv').config();

/**
 * Take new object and add it to kartoffel
 *
 * @param {*} diffsObj - represnts the changes from last data
 * @param {*} dataSource - the data source which the data came from
 * @param {*} aka_all_data - all the data from aka data source (for compilation)
 * @param {*} currentUnit_to_DataSource - a map of all units from each data source
 * @param {*} needMatchToKartoffel - a flag to tell if the current object needs a match to kartoffel's format
 */
module.exports = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = true) => {
    if (dataSource === fn.dataSources.aka) {
        return;
    }
    for (let i = 0; i < diffsObj.length; i++) {
        const record = diffsObj[i];
        let person_ready_for_kartoffel;

        if (needMatchToKartoffel) {
            person_ready_for_kartoffel = await matchToKartoffel(record, dataSource);
        } else {
            person_ready_for_kartoffel = record;
        }

        // Checking if the person is already exist in Kartoffel and accept his object
        try {
            // check if the person already exist in Kartoffel, if exist then update his data according to "currentUnit" field
            let identifier = person_ready_for_kartoffel.identityCard || person_ready_for_kartoffel.personalNumber;
            if (identifier) {
                let person = await Auth.axiosKartoffel.get(`${p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING}`);
                person = person.data;
                let isPrimary = (currentUnit_to_DataSource.get(person.currentUnit) === dataSource);

                if (isPrimary) {
                    Object.keys(person).map((key) => {
                        fn.fieldsForRmoveFromKartoffel.includes(key) ? delete person[key] : null;
                    })
                    let KeyForComparison = Object.keys(person).find(key => { return person[key] == identifier });
                    let objForUpdate = diff([person], [person_ready_for_kartoffel], KeyForComparison, { updatedValues: 4 });
                    if (objForUpdate.updated.length > 0) { updated(objForUpdate.updated, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = false); }
                }
                else {
                    await domainUserHandler(person, record, dataSource);
                }

            }
            else {
                sendLog(logLevel.warn, logDetails.warn.WRN_MISSING_IDENTIFIER_PERSON, JSON.stringify(person_ready_for_kartoffel));
            }
        }
        // if the person does not exist in Kartoffel => complete the data from aka (if exist), add him to specific hierarchy & adding user
        catch (err) {
            // check if the perosn not exist in Kartoffel (404 status), or if there is another error
            if (err.response.status === 404) {
                // complete the data from aka (if exist):
                aka_all_data ? person_ready_for_kartoffel = completeFromAka(person_ready_for_kartoffel, aka_all_data, dataSource) : null;
                person_ready_for_kartoffel = identifierHandler(person_ready_for_kartoffel);
                // Add the complete person object to Kartoffel
                try {
                    let person = await Auth.axiosKartoffel.post(p().KARTOFFEL_PERSON_API, person_ready_for_kartoffel);
                    person = person.data;
                    sendLog(logLevel.info, logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL, person.personalNumber || person.identityCard, dataSource);
                    // add domain user for the new person
                    await domainUserHandler(person, record, dataSource);
                }
                catch (err) {
                    let errMessage = err.response ? err.response.data.message : err.message;
                    sendLog(logLevel.error, logDetails.error.ERR_INSERT_PERSON, person_ready_for_kartoffel.personalNumber || person_ready_for_kartoffel.identityCard, dataSource, errMessage, JSON.stringify(record));
                }
            }
            else {
                let errMessage = err.response ? err.response.data.message : err.message;
                sendLog(logLevel.error, logDetails.error.ERR_ADD_FUNCTION_PERSON_NOT_FOUND, identifier, dataSource, errMessage);
            };
        }
    }
}