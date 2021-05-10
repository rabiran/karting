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
const dataModel = require('../dataModel');
const PromiseAllWithFails = require('../generalUtils/promiseAllWithFails');
const preRun = require('../preRun');

require('dotenv').config();


/**
 * Removes the new Groups that are empty due to the person wasn't added to Kartoffel
 * 
 * @param {*} dataModel - Contains the new groups that were added to Kartoffel
 */
const removeNewGroups = async (dataModel) => {
    for(let i = 0; i < dataModel.newGroups.length; i++) { 
        let groupID = dataModel.newGroups[i];
        try{
            await dataModel.Auth.axiosKartoffel.delete(p(groupID).KARTOFFEL_REMOVE_GROUP_API);
            dataModel.sendLog(logLevel.info, logDetails.info.INF_REMOVE_GROUP_FROM_KARTOFFEL, groupID);
        } catch (err){
            thdataModelis.sendLog(logLevel.error, logDetails.error.ERR_REMOVE_GROUP_FROM_KARTOFFEL, groupID, err.respose.data.message);
        }
    }
}


/**
 * Take new object and add it to kartoffel
 *  @param extraData:
 *  { { dataModel[], string } } addedData - represnts the changes from last data
 *  {*} aka_all_data - all the data from aka data source (for compilation)
 */
module.exports = async ({ addedData, dataSource }, extraData) => {
    let dataModels = addedData;
    dataModels = await recordsFilter({dataModels, dataSource});

    for (let i = 0; i < dataModels.length; i++) {
        const dataModel = dataModels[i];
        
        let tryFindPerson;
        let path;
        try {
            await dataModel.matchToKartoffel();

            if (dataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu) {
                if (dataSource === fn.dataSources.city && !dataModel.record.addedTags.isExternal) { 
                    continue;
                }
                dataModel.identifiers = [dataModel.person_ready_for_kartoffel.domainUsers[0].uniqueID].filter(id => id);
                path = id => p(id).KARTOFFEL_DOMAIN_USER_API;
            } else if (
                dataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.s ||
                dataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.c
            ) {
                dataModel.complete(extraData)
                dataModel.identifiers = [
                    dataModel.person_ready_for_kartoffel.identityCard,
                    dataModel.person_ready_for_kartoffel.personalNumber
                ].filter(id => id);
                path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;
            } else {
                dataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_UNRECOGNIZED_ENTITY_TYPE,
                    JSON.stringify(dataModel.record),
                    dataModel.dataSource
                );
                continue;
            }
            
            if (!dataModel.identifiers.length) {
                dataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_MISSING_IDENTIFIER_PERSON,
                    JSON.stringify(dataModel.person_ready_for_kartoffel),
                    JSON.stringify(dataModel.record),
                    dataModel.dataSource
                );
                continue;
            }
    
            tryFindPerson = await tryArgs(
                async id => (await dataModel.Auth.axiosKartoffel.get(path(id))).data,
                ...dataModel.identifiers
            );
    
            if (tryFindPerson.lastErr) {
                if (tryFindPerson.lastErr.response && tryFindPerson.lastErr.response.status === 404) {
                    if (!dataModel.person_ready_for_kartoffel.directGroup) {
                        dataModel.sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_MISSING_DIRECT_GROUP,
                            JSON.stringify(dataModel.identifiers),
                            dataModel.dataSource,
                            JSON.stringify(dataModel.record),
                        );
                        continue;
                    }
                    dataModel.person_ready_for_kartoffel = identifierHandler(dataModel.person_ready_for_kartoffel, dataModel.sendLog);
                    // Add the complete person object to Kartoffel
                    try {
                        dataModel.person = (
                            await dataModel.Auth.axiosKartoffel.post(
                                p().KARTOFFEL_PERSON_API, dataModel.person_ready_for_kartoffel
                            )
                        ).data;
    
                        dataModel.sendLog(
                            logLevel.info,
                            logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL,
                            JSON.stringify(dataModel.identifiers),
                            dataModel.dataSource
                        );
                        // for goalUser domainUsers already created in matchToKartoffel
                        if (dataModel.person.entityType !== fn.entityTypeValue.gu) {
                            // add domain user for the new person
                            await domainUserHandler(dataModel);
                        }
                    } catch (err) {
                        const errMessage = err.response ? err.response.data.message : err.message;
                        dataModel.sendLog(
                            logLevel.error,
                            logDetails.error.ERR_INSERT_PERSON,
                            JSON.stringify(dataModel.identifiers),
                            dataModel.dataSource,
                            errMessage,
                            JSON.stringify(dataModel)
                        );
                    }
                } else {
                    const errMessage = tryFindPerson.lastErr.response ? tryFindPerson.lastErr.response.data.message : tryFindPerson.lastErr.message;
                    dataModel.sendLog(
                        logLevel.error,
                        logDetails.error.ERR_ADD_FUNCTION_PERSON_NOT_FOUND,
                        JSON.stringify(dataModel.identifiers),
                        dataModel.dataSource,
                        errMessage
                    );
                    await removeNewGroups(dataModel);
                }
            } else if (tryFindPerson.result) {
    
                dataModel.person = tryFindPerson.result;
    
                if (
                    dataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu &&
                    dataModel.person.entityType !== fn.entityTypeValue.gu
                ) {
                    await goalUserFromPersonCreation(dataModel.person, dataModel.person_ready_for_kartoffel, dataModel.dataSource, dataModel.Auth, dataModel.sendLog);
                }
                    Object.keys(dataModel.person).map(key => {
                        fn.fieldsForRmoveFromKartoffel.includes(key) ? delete dataModel.person[key] : null;
                    })
    
                    let KeyForComparison = Object.keys(dataModel.person).find(key => dataModel.person[key] === tryFindPerson.argument);
                    let personCopy = { ...dataModel.person }
                    if (personCopy.pictures && personCopy.pictures.profile) {
                        personCopy.pictures.profile = personCopy.pictures.profile.meta
                    }
                    dataModel.updateDeepDiff = diff(
                        [personCopy],
                        [dataModel.person_ready_for_kartoffel],
                        KeyForComparison,
                        { updatedValues: 4 }
                    ).updated[0];
    
                    if (dataModel.updateDeepDiff && dataModel.updateDeepDiff.length > 0) {
                        updated(
                            { updatedData: [dataModel], dataSource },
                            extraData
                        );
                    }
            } else {
                dataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', JSON.stringify(tryFindPerson.lastErr));
            }
        } catch(err) {
            dataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', err.toString());
            dataModel.sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', err.stack.toString());
        }
        
    }
}