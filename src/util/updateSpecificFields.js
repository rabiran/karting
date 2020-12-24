const matchToKartoffel = require('./matchToKartoffel');
const p = require('../config/paths');
const { logLevel } = require('./logger');
const logDetails = require('../util/logDetails');
const fn = require('../config/fieldNames');
const isObjectEmpty = require('./generalUtils/isObjectEmpty');
const mergeArrays = require('./generalUtils/mergeArrays');
const DataModel = require('./DataModel');
const _ = require('lodash')

/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 *
 * @param { Array } deepDiffArray Array of DeepDiff objects
 * @param { DataModel } DataModel - the data Model
 * 
 */      
const updateSpecificFields = async (DataModel) => {
    let objForUpdate = {};
    DataModel.updateDeepDiff[2].map(deepDiffRecord => {
        switch(deepDiffRecord.kind) {
            case "N":{
                objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                break;
            }
            case "E":{
                if (deepDiffRecord.path[0] == 'phone' || deepDiffRecord.path[0] == 'mobilePhone')
                    objForUpdate[deepDiffRecord.path[0]] = mergeArrays(
                        [deepDiffRecord.rhs], DataModel.person[deepDiffRecord.path[0]]
                    );
                else
                    objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                break;
            }
            case "A":{
                if(deepDiffRecord.item.kind=="N") {
                    objForUpdate[deepDiffRecord.path[0]] = mergeArrays(
                        [deepDiffRecord.item.rhs], DataModel.person[deepDiffRecord.path[0]]
                    );
                    break;
                }

                DataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_KIND_DEEPDIFF_NOT_RECOGNIZED,
                    JSON.stringify(deepDiffRecord)
                );
                break;
            }
            default:{
                DataModel.sendLog(
                    logLevel.warn,
                    logDetails.warn.WRN_KIND_DEEPDIFF_NOT_RECOGNIZED,
                    JSON.stringify(deepDiffRecord)
                );
                break;
            }
        }
    });
    // when person from 'diffsHandler-added' come to update they already passed through 'matchToKartoffel'
    // and if the them sending again to 'matchToKartoffel' the keys of the object will be deleted
    if (DataModel.needMatchToKartoffel) {
        objForUpdate = await matchToKartoffel(objForUpdate, DataModel.dataSource, DataModel.Auth, DataModel.sendLog, fn.flowTypes.update);
    }

    DataModel.updateDeepDiff[2].map(deepDiffRecord => {
        if (
            fn[DataModel.dataSource]["entityType"] === deepDiffRecord.path.toString() &&
            deepDiffRecord.rhs === fn.entityTypeValue.s
        ) {
            objForUpdate.rank = DataModel.akaRecord[fn.aka.rank];
            objForUpdate.currentUnit = DataModel.akaRecord[fn.aka.unitName];
        }
    });

    try {
        if (objForUpdate.directGroup) {
            let updateDirectGroup = {
                group: objForUpdate.directGroup
            };
            try {
                await DataModel.Auth.axiosKartoffel.put(p(DataModel.person.id).KARTOFFEL_PERSON_ASSIGN_API, updateDirectGroup);
                DataModel.sendLog(
                    logLevel.info,
                    logDetails.info.INF_UPDATE_DIRECT_GROUP_TO_PERSON,
                    DataModel.person.personalNumber || DataModel.person.identityCard || DataModel.person.domainUsers[0].uniqeID,
                    DataModel.dataSource,
                    JSON.stringify(objForUpdate.directGroup)
                );
            } catch(err){
                let errMessage = err.response ? err.response.data.message : err.message;
                DataModel.sendLog(
                    logLevel.error,
                    logDetails.error.ERR_UPDATE_DIRECT_GROUP_TO_PERSON,
                    DataModel.person.personalNumber || DataModel.person.identityCard || DataModel.person.domainUsers[0].uniqeID,
                    DataModel.dataSource,
                    errMessage,
                    JSON.stringify(objForUpdate)
                );
            }
        }
        // delete forbidden Fields To Update
        if (DataModel.dataSource != fn.dataSources.aka) {
            for (let field of fn.forbiddenFieldsToUpdate) {
                objForUpdate[field] ? delete objForUpdate[field] : null;
            }
        } else {
            for (let field of _.without(fn.forbiddenFieldsToUpdate, 'identityCard', 'personalNumber')) {
                objForUpdate[field] ? delete objForUpdate[field] : null;
            }
        }
        // Update the person object if the objForUpdate is NOT empty
        if (!isObjectEmpty(objForUpdate)) {
            await DataModel.Auth.axiosKartoffel.put(p(DataModel.person.id).KARTOFFEL_UPDATE_PERSON_API, objForUpdate);
            DataModel.sendLog(
                logLevel.info,
                logDetails.info.INF_UPDATE_PERSON_IN_KARTOFFEL,
                DataModel.person.personalNumber || DataModel.person.identityCard || DataModel.person.domainUsers[0].uniqeID,
                DataModel.dataSource,
                JSON.stringify(objForUpdate)
            );
        }
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        DataModel.sendLog(
            logLevel.error,
            logDetails.error.ERR_UPDATE_FUNC_PERSON_NOT_FOUND,
            DataModel.person.personalNumber || DataModel.person.identityCard || DataModel.person.domainUsers[0].uniqeID,
            DataModel.dataSource,
            errMessage,
            JSON.stringify(objForUpdate)
        );
    }
}

module.exports = updateSpecificFields;
