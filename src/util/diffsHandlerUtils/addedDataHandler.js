const identifierHandler = require('../fieldsUtils/identifierHandler');
const diff = require("diff-arrays-of-objects");
const updated = require('./updatedDataHandler')
const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const {logLevel} = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const recordsFilter = require('../recordsFilter');
const tryArgs = require('../generalUtils/tryArgs');
const goalUserFromPersonCreation = require('../goalUserFromPersonCreation');
const DataModel = require('../DataModel');
const PromiseAllWithFails = require('../generalUtils/promiseAllWithFails');
const preRun = require('../preRun');

require('dotenv').config();

/**
 * Take new object and add it to kartoffel
 *  @param extraData:
 *  { { DataModel[], string } } addedData - represnts the changes from last data
 *  {*} aka_all_data - all the data from aka data source (for compilation)
 */
module.exports = async ({ addedData, dataSource }, extraData) => {
    let dataModels = addedData;
    dataModels = await recordsFilter({dataModels, dataSource});

    for (let i = 0; i < dataModels.length; i++) {
        const DataModel = dataModels[i];
        
        let tryFindPerson;
        let path;
        try {
            await DataModel.matchToKartoffel();

            if (DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu) {
                if (dataSource === fn.dataSources.city && !DataModel.record.addedTags.isExternal) { 
                    continue;
                }
                DataModel.identifiers = [DataModel.person_ready_for_kartoffel.domainUsers[0].uniqueID].filter(id => id);
                path = id => p(id).KARTOFFEL_DOMAIN_USER_API;
            } else if (
                DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.s ||
                DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.c
            ) {
                DataModel.complete(extraData)
                DataModel.identifiers = [
                    DataModel.person_ready_for_kartoffel.identityCard,
                    DataModel.person_ready_for_kartoffel.personalNumber
                ].filter(id => id);
                path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;
            } else {
                DataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_UNRECOGNIZED_ENTITY_TYPE,
                    JSON.stringify(DataModel.record),
                    DataModel.dataSource
                );
                continue;
            }
            
            if (!DataModel.identifiers.length) {
                DataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_MISSING_IDENTIFIER_PERSON,
                    JSON.stringify(DataModel.person_ready_for_kartoffel),
                    JSON.stringify(DataModel.record),
                    DataModel.dataSource
                );
                continue;
            }
    
            tryFindPerson = await tryArgs(
                async id => (await DataModel.Auth.axiosKartoffel.get(path(id))).data,
                ...DataModel.identifiers
            );
    
            if (tryFindPerson.lastErr) {
                if (tryFindPerson.lastErr.response && tryFindPerson.lastErr.response.status === 404) {
                    if (!DataModel.person_ready_for_kartoffel.directGroup) {
                        DataModel.sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_MISSING_DIRECT_GROUP,
                            JSON.stringify(DataModel.identifiers),
                            DataModel.dataSource,
                            JSON.stringify(DataModel.record),
                        );
                        continue;
                    }
                    DataModel.person_ready_for_kartoffel = identifierHandler(DataModel.person_ready_for_kartoffel, DataModel.sendLog);
                    // Add the complete person object to Kartoffel
                    try {
                        DataModel.person = (
                            await DataModel.Auth.axiosKartoffel.post(
                                p().KARTOFFEL_PERSON_API, DataModel.person_ready_for_kartoffel
                            )
                        ).data;
    
                        DataModel.sendLog(
                            logLevel.info,
                            logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL,
                            JSON.stringify(DataModel.identifiers),
                            DataModel.dataSource
                        );
                        // for goalUser domainUsers already created in matchToKartoffel
                        if (DataModel.person.entityType !== fn.entityTypeValue.gu) {
                            // add domain user for the new person
                            await domainUserHandler(DataModel);
                        }
                    } catch (err) {
                        const errMessage = err.response ? err.response.data.message : err.message;
                        DataModel.sendLog(
                            logLevel.error,
                            logDetails.error.ERR_INSERT_PERSON,
                            JSON.stringify(DataModel.identifiers),
                            DataModel.dataSource,
                            errMessage,
                            JSON.stringify(DataModel)
                        );
                    }
                } else {
                    const errMessage = tryFindPerson.lastErr.response ? tryFindPerson.lastErr.response.data.message : tryFindPerson.lastErr.message;
                    DataModel.sendLog(
                        logLevel.error,
                        logDetails.error.ERR_ADD_FUNCTION_PERSON_NOT_FOUND,
                        JSON.stringify(DataModel.identifiers),
                        DataModel.dataSource,
                        errMessage
                    );
                }
            } else if (tryFindPerson.result) {
    
                DataModel.person = tryFindPerson.result;
    
                if (
                    DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu &&
                    DataModel.person.entityType !== fn.entityTypeValue.gu
                ) {
                    await goalUserFromPersonCreation(DataModel.person, DataModel.person_ready_for_kartoffel, DataModel.dataSource, DataModel.Auth, DataModel.sendLog);
                }
                    Object.keys(DataModel.person).map(key => {
                        fn.fieldsForRmoveFromKartoffel.includes(key) ? delete DataModel.person[key] : null;
                    })
    
                    let KeyForComparison = Object.keys(DataModel.person).find(key => DataModel.person[key] === tryFindPerson.argument);
                    let personCopy = { ...DataModel.person }
                    if (personCopy.pictures && personCopy.pictures.profile) {
                        personCopy.pictures.profile = personCopy.pictures.profile.meta
                    }
                    DataModel.updateDeepDiff = diff(
                        [personCopy],
                        [DataModel.person_ready_for_kartoffel],
                        KeyForComparison,
                        { updatedValues: 4 }
                    ).updated[0];
    
                    if (DataModel.updateDeepDiff && DataModel.updateDeepDiff.length > 0) {
                        updated(
                            { updatedData: [DataModel], dataSource },
                            extraData
                        );
                    }
            } else {
                DataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', JSON.stringify(tryFindPerson.lastErr));
            }
        } catch(err) {
            DataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', err.toString());
            DataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', err.stack.toString());
        }
        
    }
}