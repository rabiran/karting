const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const {sendLog, logLevel} = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../domainUserHandler');
const updateSpecificFields = require('../updateSpecificFields');
const Auth = require('../../auth/auth');

require('dotenv').config();

/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSourceperson_ready_for_kartoffel - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

module.exports = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = true) => {
    for (let i = 0; i < diffsObj.length; i++) {
        const record = diffsObj[i];
        let identifier = record[1][fn[dataSource].personalNumber] || record[1][fn[dataSource].identityCard] || record[1].personalNumber || record[1].identityCard;
        // Get the person object from kartoffel
        let person = await Auth.axiosKartoffel.get(p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING)
            .catch((err) => {
                const level = dataSource === fn.dataSources.aka ? logLevel.warn : logLevel.error;
                sendLog(level, logDetails.warn.WRN_ERR_UPDATE_FUNC_PERSON_NOT_FOUND, identifier, dataSource, err);
            });
        if (!person) {
            continue;
        };
        person = person.data;
        if (dataSource === fn.dataSources.aka) {
            updateSpecificFields(record[2], dataSource, person, record[1]);
        }
        else {
            let akaRecord = aka_all_data.find(person => ((person[fn.aka.personalNumber] == identifier) || (person[fn.aka.identityCard] == identifier)));
            // Check if the dataSource of the record is the primary dataSource for the person
            if ((akaRecord && akaRecord[fn.aka.unitName]) && currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]) !== dataSource) {
                // Add domain user from the record (if the required data exist)
                await domainUserHandler(person, record[1], dataSource);
                sendLog(logLevel.warn, logDetails.warn.WRN_DOMAIN_USER_NOT_SAVED_IN_KARTOFFEL, record[2].map((obj) => { return `${obj.path.toString()},` }), dataSource, identifier, dataSource, currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]));
                continue;
            }
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            let deepDiffForUpdate = record[2].filter((deepDiffObj) => {
                // if the person's object that will be updated passed through matchToKartoffel then the second expression will be the relevant, If not then the first expression will be relevant
                let keyForCheck = Object.keys(fn[dataSource]).find(val => { return fn[dataSource][val] == deepDiffObj.path.toString() }) || deepDiffObj.path.toString();
                let include = fn.akaRigid.includes(keyForCheck);
                include ? sendLog(logLevel.warn, logDetails.warn.WRN_AKA_FIELD_RIGID, deepDiffObj.path.toString(), identifier, dataSource) : null;
                return !include;
            })
            if (deepDiffForUpdate.length > 0) {
                updateSpecificFields(deepDiffForUpdate, dataSource, person, akaRecord, needMatchToKartoffel);
                await domainUserHandler(person, record[1], dataSource);
            };
        }
    }
}