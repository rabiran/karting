// const p = require('../config/paths');
const fn = require('../../config/fieldNames');
// const tryArgs = require('./generalUtils/tryArgs');
const samePersonMissingInformation = require('./samePersonMissingInformation');
const preRun = require('../preRun');
/**
 * Iterates over all the recrods in aka and checks if there are records that exist in Kartoffel, as a duplicate,
 * once only with the ID and once with the PN
 */
    //get all the records in aka, and iterate over each one with the "samePersonMissingInformation" function
    (async function() {
    let { sendLog, dataObj } = await preRun(fn.runnigTypes.recoveryRun, [fn.dataSources.aka]);
    //console.log(fn.dataSources.aka)
    //console.log(dataObj)
    //console.log("123")
    let akaData = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
    let haveDuplicates = []
    for (akaRecord of akaData){
        let isDuplicate = await samePersonMissingInformation(akaRecord,sendLog)
        //console.log(isDuplicate)
        if(isDuplicate){
            haveDuplicates.push(akaRecord)
        }
    };
    console.log(haveDuplicates)
    })();