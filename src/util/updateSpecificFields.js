const matchToKartoffel = require('./matchToKartoffel');
const p = require('../config/paths');
const logger = require('./logger');
const fn = require('../config/fieldNames');
const Auth = require('../auth/auth');
const axios = require('axios');
/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 * @param {*} deepDiffArray Array of DeepDiff objects 
 * @param {*} dataSource The source of the raw person object
 * @param {*} person Person object from Kartoffel
 * @param {*} [akaRecord=null] Suitable object from AKA for complete fileds to the update's object
 */
const updateSpecificFields = async (deepDiffArray, dataSource, person, akaRecord = null, needMatchToKartoffel = true) => {
    let objForUpdate = {};
    deepDiffArray.map((deepDiffRecord) => {
        if (deepDiffRecord.kind == "N" || deepDiffRecord.kind == "E") {
            objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
        }
        else {
            logger.warn(`the deepDiff kind of the updated person is not recognized -"${JSON.stringify(deepDiffRecord)}"`);
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
        }
        if (fn[dataSource]["entityType"] === deepDiffRecord.path.toString() && deepDiffRecord.rhs === fn.entityTypeValue.c) {
            objForUpdate.rank = null;
            // objForUpdate.currentUnit = null;
        }
    });

    try {
        if (objForUpdate.directGroup) {
            let updateDirectGroup = {	
                group: objForUpdate.directGroup	
            };	
            try {	
                await Auth.axiosKartoffel.put(p(person.id).KARTOFFEL_PERSON_ASSIGN_API, updateDirectGroup);	
                logger.info(`The directGroup of the person with the identifier:${person.personalNumber || person.identityCard} from ${dataSource} update successfully. ${JSON.stringify(objForUpdate.directGroup)}`);	
            }	
            catch(err){	
                let errMessage = err.response ? err.response.data.message : err.message;
                logger.error(`Failed to update directGroup for ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${errMessage}" ${JSON.stringify(objForUpdate)}`);	
            }	
        }
        // delete forbidden Fields To Update
        for (let field of fn.forbiddenFieldsToUpdate) {
            objForUpdate[field] ? delete objForUpdate[field] : null;
        }
        // Update the person object
        objForUpdate ? await Auth.axiosKartoffel.put(p(person.id).KARTOFFEL_UPDATE_PERSON_API, objForUpdate) : null;
        logger.info(`The person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource} update successfully. ${JSON.stringify(objForUpdate)}`);
    }
    catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;
        logger.error(`Not update the person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${errMessage}" ${JSON.stringify(objForUpdate)}`);
    }
}

module.exports = updateSpecificFields;


