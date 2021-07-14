const fn = require('../../config/fieldNames');
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
module.exports = async ({ updatedData, dataSource }, extraData) => {
    let dataModels = updatedData;
    dataModels = await recordsFilter({dataModels, dataSource});

    for (let i = 0; i < dataModels.length; i++) {
        const DataModel = dataModels[i];
        const path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;
      
        let { identityCard, personalNumber } = await getIdentifiers(DataModel.record, DataModel.dataSource, DataModel.Auth, DataModel.sendLog);

        if (DataModel.flowType === fn.flowTypes.add) {
            identityCard = identityCard ? identityCard : DataModel.person_ready_for_kartoffel.identityCard;
            personalNumber = personalNumber ? personalNumber : DataModel.person_ready_for_kartoffel.personalNumber;
        }
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
            async id => (await DataModel.Auth.axiosKartoffel.get(path(id))).data,
            ...filterdIdentifiers
        )

        if (tryFindPerson.lastErr) {
            DataModel.sendLog(
                logLevel.error,
                logDetails.error.ERR_NOT_FIND_PERSON_AT_UPDATE,
                JSON.stringify(filterdIdentifiers),
                DataModel.dataSource
            );
            continue;
        }

        DataModel.person = tryFindPerson.result;

        DataModel.akaRecord = extraData.aka_all_data.find(
            person => (
                person[fn.aka.personalNumber] == tryFindPerson.argument ||
                person[fn.aka.identityCard] == tryFindPerson.argument
            )
        );
        let stillNotUpdated = [...DataModel.updateDeepDiff[2]];

        // Check if the dataSource of the record is the primary dataSource for the person
        let isAkaUnitPrimary = DataModel.akaRecord &&
            DataModel.akaRecord[fn.aka.unitName] &&
            DataModel.checkIfDataSourceIsPrimary(DataModel.akaRecord[fn.aka.unitName]);
        let unit_from_city = DataModel.person_ready_for_kartoffel.currentUnit;
        let isCityUnitPrimary = DataModel.cityRecord && unit_from_city && DataModel.checkIfDataSourceIsPrimary(unit_from_city);

        if (isAkaUnitPrimary || isCityUnitPrimary) {
            if (DataModel.updateDeepDiff[2].length > 0) {
                if (isCityUnitPrimary && !DataModel.akaRecord) {
                    DataModel.updateDeepDiff[2] = DataModel.updateDeepDiff[2].filter(diffsObj => {
                        let keyForCheck = (
                            Object.keys(fn[DataModel.dataSource]).find(val => fn[DataModel.dataSource][val] == diffsObj.path.toString()) || diffsObj.path.toString()
                        );
                        keyForCheck = keyForCheck.split(',')[0];
                        const include = fn.isCtsPrimary.includes(keyForCheck);
                        return include;
                    });
                }
                await updateSpecificFields(DataModel);
            }
            stillNotUpdated = [];

        } else if (DataModel.akaRecord || DataModel.cityRecord) {
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            DataModel.updateDeepDiff[2] = DataModel.updateDeepDiff[2].filter(
                diffsObj => {
                    // if the person's object that will be updated passed through matchToKartoffel
                    // then the second expression will be the relevant, If not then the first expression will be relevant
                    let keyForCheck = (
                        Object.keys(fn[DataModel.dataSource]).find(val => fn[DataModel.dataSource][val] == diffsObj.path.toString()) ||
                        //take into consideration, that diffsObj.path is an array (phones)
                        diffsObj.path.toString()
                    );
                    keyForCheck = keyForCheck.split(',')[0]
                    const include = DataModel.akaRecord ? fn.akaRigid.includes(keyForCheck) : fn.cityRigid.includes(keyForCheck);

                    if (include) {
                        DataModel.sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_AKA_FIELD_RIGID,
                            diffsObj.path.toString(),
                            tryFindPerson.argument,
                            DataModel.dataSource
                        )
                    }

                    return include;
                }
                );

                if (DataModel.updateDeepDiff[2].length > 0) {
                    await updateSpecificFields(DataModel);
                };
                //array subtraction stillNotUpdated = stillNotUpdated - DataModel.updateDeepdiff[2]
                stillNotUpdated = stillNotUpdated.filter(function(e) {
                    let i = DataModel.updateDeepDiff[2].indexOf(e)
                    return i == -1 ? true : (DataModel.updateDeepDiff[2].splice(i, 1), false)
                  })

        }
        
        // Add domain user from the record (if the required data exist)
        // if (stillNotUpdated.length > 0) {
        //     DataModel.sendLog(
        //         logLevel.warn,
        //         logDetails.warn.WRN_NOT_UPDATE_IN_KARTOFFEL,
        //         DataModel.dataSource,
        //         tryFindPerson.argument,
        //         DataModel.dataSource,
        //         DataModel.akaRecord ? DataModel.akaRecord[fn.aka.unitName] : 'none',
        //         stillNotUpdated.map(obj => `${obj.path.toString()},`),
        //     );
        // }
        await domainUserHandler(DataModel);
    }
}
