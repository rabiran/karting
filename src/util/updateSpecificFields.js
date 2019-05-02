const matchToKartoffel = require('./matchToKartoffel');
const logger = require('./logger');
/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request that send to Kartoffel
 * @param {*} deepDiffArray Array of DeepDiff objects 
 * @param {*} dataSource The source of the raw person object
 */
const updateSpecificFields = (deepDiffArray, dataSource) => {
    deepDiffArray.map(async (deepDiffRecord) => {
        let objForUpdate = {};
        switch (deepDiffRecord.kind) {
            case "E":
                console.log("E");
                objForUpdate[deepDiffRecord.path.toString()] = deepDiffRecord.rhs;
                break;
            case "N":
                console.log("N");
                objForUpdate[deepDiffRecord.path.toString()] = deepDiffRecord.rhs;
                break;
            default:
                logger.warn(`the deepDiff kind of the updated person is not recognized -"${JSON.stringify(deepDiffRecord)}"`);
                break;
        }
        objForUpdate = await matchToKartoffel(objForUpdate, dataSource);
        
        // NEED TO POST THIS OBJECT TO KARTOFFEL
        console.log(objForUpdate);
    });
}

module.exports = updateSpecificFields;


