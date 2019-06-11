const matchToKartoffel = require('./matchToKartoffel');
const axios = require('axios');
const p = require('../config/paths');
const logger = require('./logger');
const fn = require('../config/fieldNames');

/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 * @param {*} deepDiffArray Array of DeepDiff objects 
 * @param {*} dataSource The source of the raw person object
 * @param {*} person Person object from Kartoffel
 * @param {*} [akaRecord=null] Suitable object from AKA for complete fileds to the update's object
 */
const updateSpecificFields = async (deepDiffArray, dataSource, person, akaRecord = null) => {
    let objForUpdate = {};
    deepDiffArray.map((deepDiffRecord) => {
        if (deepDiffRecord.kind == "N" || deepDiffRecord.kind == "E") {
            objForUpdate[deepDiffRecord.path.toString()] = deepDiffRecord.rhs;
        }
        else {
            logger.warn(`the deepDiff kind of the updated person is not recognized -"${JSON.stringify(deepDiffRecord)}"`);
        }
    });
    objForUpdate = await matchToKartoffel(objForUpdate, dataSource);

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
        // delete forbidden Fields To Update
        for(let feild of fn.forbiddenFieldsToUpdate){
            objForUpdate[feild]? delete objForUpdate[feild]:null;
        }
        // Update the person object
        objForUpdate ? await axios.put(p(person.id).KARTOFFEL_UPDATE_PERSON_API, objForUpdate) : null;
        logger.info(`The person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource} update successfully. ${JSON.stringify(objForUpdate)}`);
    }
    catch (err) {
        let errMessage = err.response ? err.response.data : err.message;
        logger.error(`Not update the person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${errMessage}" ${JSON.stringify(objForUpdate)}`);
    }
}

module.exports = updateSpecificFields;


