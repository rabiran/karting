

/**
 * This module accept an array that contain DeepDiff objects and build from them object for the PUT request to Kartoffel
 * @param {*} deepDiffArray Array of DeepDiff objects  
 */
const updateSpecificFields = (deepDiffArray) => {
    deepDiffArray.map(async (deepDiffRecord) => {
        let objForUpdate = {};
        switch (deepDiffRecord.kind) {
            case "N":
                console.log("N");
                objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                break;
            case "E":
                objForUpdate[deepDiffRecord.path[0]] = deepDiffRecord.rhs;
                console.log("E");
                break;
            default:
                logger.warn(`the deepDiff kind of the updated person is not recognized ${JSON.stringify(deepDiffRecord)}`);
                break;


        }
        objForUpdate = await matchToKartoffel(objForUpdate, dataSource);
        console.log(objForUpdate);
    });
}

module.exports = updateSpecificFields;


