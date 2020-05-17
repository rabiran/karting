const fn = require('../../config/fieldNames');
const Auth = require('../../auth/auth');
const DataModel = require('../DataModel')
const p = require('../../config/paths');
const { sendLog, logLevel } = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const updateSpecificFields = require('../updateSpecificFields');
const recordsFilter = require('../recordsFilter');
const tryArgs = require('../generalUtils/tryArgs');
const getIdentifiers = require('../getIdentifiers')

require('dotenv').config();

/**
 *
 * @param {Array<DataModel>} updatedData - object that contain the results of diffs checking (added,updated,same,removed & all
 * @param {string} dataSource - represents the data source
 * @param {Object} aka_all_data - object that contain all the recent data from aka
 * @param {Map} currentUnit_to_DataSource - map of all the units from each data source
 * @param {boolean} needMatchToKartoffel - if the diffsObj needs match to kartoffel
 */
module.exports = async (updatedData, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = true, originalRecord) => {
    let dataModels = updatedData;

    // If needMatchToKartoffel = false, the data came from addedDataHandler and already filtered
    if (needMatchToKartoffel) {
        dataModels = await recordsFilter(dataModels, dataSource);
    }

    for (let i = 0; i < dataModels.length; i++) {
        const DataModel = dataModels[i];
        const path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;
        let person;

        const { identityCard, personalNumber } = await getIdentifiers(DataModel.record, dataSource, needMatchToKartoffel);
        const filterdIdentifiers = [identityCard, personalNumber].filter(id => id);
        
        if (!filterdIdentifiers.length) {
            sendLog(
                logLevel.error,
                logDetails.error.ERR_NO_IDENTIFIERS_TO_UPDATE,
                JSON.stringify(DataModel),
                dataSource
            );
            continue;
        }

        const tryFindPerson = await tryArgs(
            async id => (await Auth.axiosKartoffel.get(path(id))).data,
            ...filterdIdentifiers
        )

        if (tryFindPerson.lastErr) {
            sendLog(
                logLevel.error,
                logDetails.error.ERR_NOT_FIND_PERSON_IN_KARTOFFEL,
                JSON.stringify(filterdIdentifiers),
                dataSource
            );
            continue;
        }

        person = tryFindPerson.result;

        if (dataSource === fn.dataSources.aka) {
            updateSpecificFields(DataModel[2], dataSource, person, DataModel[1]);
        } else {
            let akaRecord = aka_all_data.find(person => ((person[fn.aka.personalNumber] == tryFindPerson.argument) || (person[fn.aka.identityCard] == tryFindPerson.argument)));
            // Check if the dataSource of the record is the primary dataSource for the person
            if ((akaRecord && akaRecord[fn.aka.unitName]) && currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]) !== dataSource) {
                // Add domain user from the record (if the required data exist)
                await domainUserHandler(person, DataModel[1], dataSource, needMatchToKartoffel, originalRecord);
                sendLog(logLevel.warn, logDetails.warn.WRN_DOMAIN_USER_NOT_SAVED_IN_KARTOFFEL, DataModel[2].map((obj) => `${obj.path.toString()},`), dataSource, tryFindPerson.argument, dataSource, currentUnit_to_DataSource.get(akaRecord[fn.aka.unitName]));
                continue;
            }
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            let deepDiffForUpdate = DataModel[2].filter((deepDiffObj) => {
                // if the person's object that will be updated passed through matchToKartoffel then the second expression will be the relevant, If not then the first expression will be relevant
                let keyForCheck = Object.keys(fn[dataSource]).find(val => fn[dataSource][val] == deepDiffObj.path.toString()) || deepDiffObj.path.toString();
                let include = fn.akaRigid.includes(keyForCheck);
                include ? sendLog(logLevel.warn, logDetails.warn.WRN_AKA_FIELD_RIGID, deepDiffObj.path.toString(), tryFindPerson.argument, dataSource) : null;
                return !include;
            })

            if (deepDiffForUpdate.length > 0) {
                await updateSpecificFields(deepDiffForUpdate, dataSource, person, akaRecord, needMatchToKartoffel);
            };

            await domainUserHandler(person, DataModel[1], dataSource, needMatchToKartoffel, originalRecord);
        }
    }
}
