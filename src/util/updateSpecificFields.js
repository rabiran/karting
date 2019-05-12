const matchToKartoffel = require('./matchToKartoffel');
const axios = require('axios');
const p = require('../config/paths');
const logger = require('./logger');

/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 * @param {*} deepDiffArray Array of DeepDiff objects 
 * @param {*} dataSource The source of the raw person object
 * @param {*} person Person object from Kartoffel
 */

const updateSpecificFields = async (deepDiffArray, dataSource, person) => {
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

    // Update the person object
    try {
        objForUpdate ? await axios.put(p(person.id).KARTOFFEL_UPDATE_PERSON_API, objForUpdate) : null;
        logger.info(`The person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource} update successfully. ${JSON.stringify(objForUpdate)}`);
    }
    catch (err) {
        let errMessage = err.response ? err.response.data : err.message;
        logger.error(`Not update the person with the identifier: ${person.personalNumber || person.identityCard} from ${dataSource}. The error message:"${errMessage}" ${JSON.stringify(objForUpdate)}`);
    }
}

module.exports = updateSpecificFields;


