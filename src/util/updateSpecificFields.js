const matchToKartoffel = require('./matchToKartoffel');
const p = require('../config/paths');
const {sendLog, logLevel} = require('./logger');
const logDetails = require('../util/logDetails');
const fn = require('../config/fieldNames');
const Auth = require('../auth/auth');
const isObjectEmpty = require('./generalUtils/isObjectEmpty');
const mergeArrays = require('./generalUtils/mergeArrays');
/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 *
 * @param {*} deepDiffArray Array of DeepDiff objects
 * @param {*} dataSource The source of the raw person object
 * @param {*} person Person object from Kartoffel
 * @param {*} [akaRecord=null] Suitable object from AKA for complete fileds to the update's object
 */
const updateSpecificFields = async (deepDiffArray, dataSource, person, akaRecord = null, needMatchToKartoffel = true) => {
    let objForUpdate = {};
    deepDiffArray.map((deepDiffRecord) => {
        switch(deepDiffRecord.kind) {
            case "N":{
                objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                break;
            }
            case "E":{
                if (deepDiffRecord.path[0] == 'phone' || deepDiffRecord.path[0] == 'mobilePhone')
                    objForUpdate[deepDiffRecord.path[0]] = mergeArrays([deepDiffRecord.rhs], person[deepDiffRecord.path[0]]);
                else
                    objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                break;
            }
            case "A":{
                if(deepDiffRecord.item.kind=="N") {
                    objForUpdate[deepDiffRecord.path[0]] = mergeArrays([deepDiffRecord.item.rhs], person[deepDiffRecord.path[0]]);
                    break;
                }

                sendLog(logLevel.warn, logDetails.warn.WRN_KIND_DEEPDIFF_NOT_RECOGNIZED, JSON.stringify(deepDiffRecord));
                break;
            }
            default:{
                sendLog(logLevel.warn, logDetails.warn.WRN_KIND_DEEPDIFF_NOT_RECOGNIZED, JSON.stringify(deepDiffRecord));
                break;
            }
        }
    });
    // when person from 'diffsHandler-added' come to update they already passed through 'matchToKartoffel'
    // and if the them sending again to 'matchToKartoffel' the keys of the object will be deleted
    if (needMatchToKartoffel) {
        objForUpdate = await matchToKartoffel(objForUpdate, dataSource);
    }


    deepDiffArray.map((deepDiffRecord) => {
        if (fn[dataSource]["entityType"] === deepDiffRecord.path.toString() && deepDiffRecord.rhs === fn.entityTypeValue.s) {
            objForUpdate.rank = akaRecord[fn.aka.rank];
            objForUpdate.currentUnit = akaRecord[fn.aka.unitName];
            diffsObject = diff([person], [matchedAka], comparisonField, { updatedValues: 4 });
        }
    });

    try {
        if (objForUpdate.directGroup) {
            let updateDirectGroup = {
                group: objForUpdate.directGroup
            };
            try {
                await Auth.axiosKartoffel.put(p(person.id).KARTOFFEL_PERSON_ASSIGN_API, updateDirectGroup);
                sendLog(logLevel.info, logDetails.info.INF_UPDATE_DIRECT_GROUP_TO_PERSON, person.personalNumber || person.identityCard || person.domainUsers[0].uniqeID, dataSource, JSON.stringify(objForUpdate.directGroup));
            }
            catch(err){
                let errMessage = err.response ? err.response.data.message : err.message;
                sendLog(logLevel.error, logDetails.error.ERR_UPDATE_DIRECT_GROUP_TO_PERSON, person.personalNumber || person.identityCard || person.domainUsers[0].uniqeID, dataSource, errMessage, JSON.stringify(objForUpdate));
            }
        }
        // delete forbidden Fields To Update
        for (let field of fn.forbiddenFieldsToUpdate) {
            objForUpdate[field] ? delete objForUpdate[field] : null;
        }
        // Update the person object if the objForUpdate is NOT empty
        if (!isObjectEmpty(objForUpdate)) {
            await Auth.axiosKartoffel.put(p(person.id).KARTOFFEL_UPDATE_PERSON_API, objForUpdate);
            sendLog(logLevel.info, logDetails.info.INF_UPDATE_PERSON_IN_KARTOFFEL, person.personalNumber || person.identityCard || person.domainUsers[0].uniqeID, dataSource, JSON.stringify(objForUpdate));
        }
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        sendLog(logLevel.error, logDetails.error.ERR_UPDATE_PERSON_IN_KARTOFFEL, person.personalNumber || person.identityCard || person.domainUsers[0].uniqeID, dataSource, errMessage, JSON.stringify(objForUpdate));
    }
}

module.exports = updateSpecificFields;
