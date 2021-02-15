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

        // Check if the dataSource of the record is the primary dataSource for the person
        if (
            DataModel.akaRecord &&
            DataModel.akaRecord[fn.aka.unitName] &&
            DataModel.checkIfDataSourceIsPrimary(DataModel.akaRecord[fn.aka.unitName])
        ) {
            if (DataModel.updateDeepDiff[2].length > 0) {
                await updateSpecificFields(DataModel);
            };
        }
        //same but from city incase akarecord doesnt exist:

        // else{
        //     const CityRecord = extraData.city_all_data.find(
        //         person => (
        //             person[fn.city_name.personalNumber] == tryFindPerson.argument ||
        //             person[fn.city_name.identityCard] == tryFindPerson.argument
        //         )
        //     );

        //     if(CityRecord &&
        //         CityRecord[fn.city_name.unitName] &&
        //         !DataModel.checkIfDataSourceIsPrimary(CityRecord[fn.city_name.unitName])
        //     ){
        //              // Add domain user from the record (if the required data exist)
        //     await domainUserHandler(DataModel);
        //     DataModel.sendLog(
        //         logLevel.warn,
        //         logDetails.warn.WRN_DOMAIN_USER_NOT_SAVED_IN_KARTOFFEL,
        //         DataModel.updateDeepDiff[2].map(obj => `${obj.path.toString()},`),
        //         DataModel.dataSource,
        //         tryFindPerson.argument,
        //         DataModel.dataSource,
        //         CityRecord[fn.city_name.unitName]
        //     );
        //     continue;
        //     }
        // }

        else if (DataModel.akaRecord) {
            // isolate the fields that not aka hardened from the deepdiff array before sent them to "updateSpecificFields" module
            DataModel.updateDeepDiff[2] = DataModel.updateDeepDiff[2].filter(
                diffsObj => {
                    // if the person's object that will be updated passed through matchToKartoffel
                    // then the second expression will be the relevant, If not then the first expression will be relevant
                    const keyForCheck = (
                        Object.keys(fn[DataModel.dataSource]).find(val => fn[DataModel.dataSource][val] == diffsObj.path.toString()) ||
                        //take into consideration, that diffsObj.path is an array (phones)
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

                    return include;
                }
                );

                if (DataModel.updateDeepDiff[2].length > 0) {
                    await updateSpecificFields(DataModel);
                };
        }
        // Add domain user from the record (if the required data exist)
        DataModel.sendLog(
            logLevel.warn,
            logDetails.warn.WRN_NOT_UPDATE_IN_KARTOFFEL,
            DataModel.dataSource,
            tryFindPerson.argument,
            DataModel.dataSource,
            DataModel.akaRecord ? DataModel.akaRecord[fn.aka.unitName] : 'none',
            DataModel.updateDeepDiff[2].map(obj => `${obj.path.toString()},`),
        );
        await domainUserHandler(DataModel);
    }
}
