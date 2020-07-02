const fn = require('../../config/fieldNames');
const AuthClass = require('../../auth/auth');
const DataModel = require('../DataModel')
const p = require('../../config/paths');
const { logLevel } = require('../logger');
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
 */
module.exports = async ({ updatedData, dataSource }, aka_all_data) => {
    let dataModels = updatedData;
    dataModels = await recordsFilter({dataModels, dataSource});

    for (let i = 0; i < dataModels.length; i++) {
        const DataModel = dataModels[i];
        let Auth = new AuthClass(DataModel.sendLog);
        const path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

        const { identityCard, personalNumber } = await getIdentifiers(DataModel.record, DataModel.dataSource);
        const filterdIdentifiers = [identityCard, personalNumber].filter(id => id);
        
        if (!filterdIdentifiers.length) {
            DataModel.sendLog(
                logLevel.error,
                logDetails.error.ERR_NO_IDENTIFIERS_TO_UPDATE,
                JSON.stringify(DataModel.record),
                DataModel.dataSource
            );
            continue;
        }
        
        const tryFindPerson = await tryArgs(
            async id => (await Auth.axiosKartoffel.get(path(id))).data,
            ...filterdIdentifiers
        )

        if (tryFindPerson.lastErr) {
            DataModel.sendLog(
                logLevel.error,
                logDetails.error.ERR_NOT_FIND_PERSON_IN_KARTOFFEL,
                JSON.stringify(filterdIdentifiers),
                DataModel.dataSource
            );
            continue;
        }

        DataModel.person = tryFindPerson.result;

        if (DataModel.dataSource === fn.dataSources.aka) {
            updateSpecificFields(DataModel);
        } else {
            DataModel.akaRecord = aka_all_data.find(
                person => (
                    person[fn.aka.personalNumber] == tryFindPerson.argument ||
                    person[fn.aka.identityCard] == tryFindPerson.argument
                )
            );

            // Check if the dataSource of the record is the primary dataSource for the person
            if (
                DataModel.akaRecord &&
                DataModel.akaRecord[fn.aka.unitName] &&
                DataModel.checkIfDataSourceIsPrimary(DataModel.akaRecord[fn.aka.unitName])
            ) {
                // Add domain user from the record (if the required data exist)
                await domainUserHandler(DataModel);
                DataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_DOMAIN_USER_NOT_SAVED_IN_KARTOFFEL,
                    DataModel.updateDeepDiff[2].map(obj => `${obj.path.toString()},`),
                    DataModel.dataSource,
                    tryFindPerson.argument,
                    DataModel.dataSource,
                    DataModel.akaRecord[fn.aka.unitName]
                );
                continue;
            }
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            DataModel.updateDeepDiff[2] = DataModel.updateDeepDiff[2].filter(
                diffsObj => {
                    // if the person's object that will be updated passed through matchToKartoffel
                    // then the second expression will be the relevant, If not then the first expression will be relevant
                    const keyForCheck = (
                        Object.keys(fn[DataModel.dataSource]).find(val => fn[DataModel.dataSource][val] == diffsObj.path.toString()) ||
                        diffsObj.path.toString()
                    );
                    
                    const include = fn.akaRigid.includes(keyForCheck);
                    if (include) {
                        DataModel.sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_AKA_FIELD_RIGID,
                            diffsObj.path.toString(),
                            tryFindPerson.argument,
                            DataModel.dataSource
                        )
                    }

                    return !include;
                }
            );

            if (DataModel.updateDeepDiff[2].length > 0) {
                await updateSpecificFields(DataModel);
            };

            await domainUserHandler(DataModel);
        }
    }
}
