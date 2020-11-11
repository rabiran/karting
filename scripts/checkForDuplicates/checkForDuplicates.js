const fn = require('../../src/config/fieldNames');
const samePersonMissingInformation = require('./samePersonMissingInformation');
const preRun = require('../../src/util/preRun');
/**
 * Iterates over all the recrods in aka and checks if there are records that exist in Kartoffel, as a duplicate,
 * once only with the ID and once with the PN
 */
    //get all the records in aka, and iterate over each one with the "samePersonMissingInformation" function
    (async function() {
    let { sendLog, dataObj } = await preRun(fn.runnigTypes.recoveryRun, [fn.dataSources.aka]);
    let akaData = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
    let haveDuplicates = []
    for (akaRecord of akaData){
        let isDuplicate = await samePersonMissingInformation(akaRecord,sendLog)
        if(isDuplicate){
            haveDuplicates.push(akaRecord)
        }
    };
    console.log(haveDuplicates)
    })();