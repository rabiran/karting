const fn = require('../../config/fieldNames');
const { sendLog, logLevel } = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const updateSpecificFields = require('../updateSpecificFields');
const recordsFilter = require('../recordsFilter');
const tryArgs = require('../generalUtils/tryArgs');

require('dotenv').config();

/**
 *
 * @param {Object} diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all
 * @param {string} dataSource - represents the data source
 * @param {Object} aka_all_data - object that contain all the recent data from aka
 * @param {Map} currentUnit_to_DataSource - map of all the units from each data source
 * @param {boolean} needMatchToKartoffel - if the diffsObj needs match to kaertoffel
 */
module.exports = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = true) => {
    let records = diffsObj;

    if (needMatchToKartoffel) {
        records = recordsFilter(records);
    }

    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        let person;

        const filterdIdentifiers = [
            record[1][fn[dataSource].personalNumber] || record[1].personalNumber,
            record[1][fn[dataSource].identityCard] || record[1].identityCard
        ].filter(id => id);

        if (!filterdIdentifiers.length) {
            sendLog(logLevel.error, logDetails.error.ERR_NO_IDENTIFIERS_TO_UPDATE, JSON.stringify(record), dataSource);
            continue;
        }

        const tryFindPerson = await tryArgs(
            async id => (await Auth.axiosKartoffel.get(p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING)).data,
            ...filterdIdentifiers
        )

        if (tryFindPerson.lastErr) {
            sendLog(
                logLevel.error,
                logDetails.error.ERR_NOT_FIND_PERSON_IN_KARTOFFEL,
                JSON.stringify(filterdIdentifiers),
                dataSource,
                'update'
            );
            continue;
        }

        person = tryFindPerson.result;

        if (dataSource === fn.dataSources.aka) {
            updateSpecificFields(record[2], dataSource, person, record[1]);
        } else {
            let akaRecord = aka_all_data.find(person => ((person[fn.aka.personalNumber] == tryFindPerson.argument) || (person[fn.aka.identityCard] == tryFindPerson.argument)));
            // Check if the dataSource of the record is the primary dataSource for the person
            if ((akaRecord && akaRecord[fn.aka.unitName]) && currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]) !== dataSource) {
                // Add domain user from the record (if the required data exist)
                await domainUserHandler(person, record[1], dataSource);
                sendLog(logLevel.warn, logDetails.warn.WRN_DOMAIN_USER_NOT_SAVED_IN_KARTOFFEL, record[2].map((obj) => `${obj.path.toString()},`), dataSource, tryFindPerson.argument, dataSource, currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]));
                continue;
            }
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            let deepDiffForUpdate = record[2].filter((deepDiffObj) => {
                // if the person's object that will be updated passed through matchToKartoffel then the second expression will be the relevant, If not then the first expression will be relevant
                let keyForCheck = Object.keys(fn[dataSource]).find(val => fn[dataSource][val] == deepDiffObj.path.toString()) || deepDiffObj.path.toString();
                let include = fn.akaRigid.includes(keyForCheck);
                include ? sendLog(logLevel.warn, logDetails.warn.WRN_AKA_FIELD_RIGID, deepDiffObj.path.toString(), tryFindPerson.argument, dataSource) : null;
                return !include;
            })

            if (deepDiffForUpdate.length > 0) {
                await updateSpecificFields(deepDiffForUpdate, dataSource, person, akaRecord, needMatchToKartoffel);
            };

            await domainUserHandler(person, record[1], dataSource);
        }
    }
}