const schedule = require("node-schedule");
const axios = require('axios');
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const ads = require('./ads/ads_synchronizeData');
const adNN = require('./adNN/adNN_syncData');
const nvMM = require('./nvSql/mm_synchronizeData');
const nvLMN = require('./nvSql/lmn_synchronizeData');
const nvMDN = require('./nvSql/mdn_synchronizeData');
const matchToKartoffel = require('./util/matchToKartoffel');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');
const logger = require('./util/logger');

require('dotenv').config();

if(process.env.DATA_SOURCE == "excel") {
    const express = require("express")
          app = express()
          xls = require('./util/xlsxInsert');
    app.use(xls)
    app.listen(5000, () => console.log(`Example app listening on port 5000!`))
}


// const trialLog = schedule.scheduleJob(fn.runningTime,async()=>{
//////////////MOCK-DELETE AT PRODACTION//////////////////////////////
const devSchedual = async () => {
    /////////////////////////////////////////////////////////////////////////////

    // check if the root hierarchy exist and adding it if not
    await axios.get(p(encodeURIComponent(fn.rootHierarchy)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
        .then((result) => {
            logger.info(`The root hierarchy "${result.data.name}" already exist in Kartoffel`);
        })
        .catch(async () => {
            await axios.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy })
                .then((result) => {
                    logger.info(`Success to add the root hierarchy "${result.data.name}" to Kartoffel`);
                })
                .catch((err) => {
                    let errorMessage = (err.response) ? err.response.data : err.message;
                    logger.error(`Failed to add the root hierarchy to Kartoffel. the error message: "${errorMessage}"`);
                })
        });

    // get the new json from aka & save him on the server
    let aka_data = await aka();

    // get the new json from es & save him on the server
    let es_Data = es().then((esDiffs) => {
         diffsHandler(esDiffs, "es", aka_data.all);
    });
    // get the new json from ads & save him on the server
    let ads_Data = ads().then((adsDiff)=>{
        diffsHandler(adsDiff, "ads", aka_data.all);
    });
    // get the new json from nn & save him on the server
    let adNN_Data = adNN().then((adNNDiff)=>{
        diffsHandler(adNNDiff, "adNN", aka_data.all);
    });
    // get the new json from mm & save him on the server
    let nvMM_Data = nvMM().then((nvMMDiffs) => {
         diffsHandler(nvMMDiffs, "nvSQL", aka_data.all);
    });
    // get the new json from lmn & save him on the server
    let nvLMN_Data = nvLMN().then((nvLMNDiff)=>{
        diffsHandler(nvLMNDiff, "nvSQL", aka_data.all);
    });
    // get the new json from mdn & save him on the server
    let nvMDN_Data = nvMDN().then((nvMDNDiff)=>{
        diffsHandler(nvMDNDiff, "nvSQL", aka_data.all);
    });


    // update the person's fields that update in the last iteration of Karting
    for (aka_record of aka_data.updated) {
        // Checking if the person already exist and accept his object from Kartoffel
        await axios.get(`${p(aka_record[fn.aka.identityCard]).KARTOFFEL_PERSON_EXISTENCE_CHECKING}`)
            // if the person already exist in Kartoffel => only update the person.
            .then(async (person) => {
                let person_ready_for_kartoffel = matchToKartoffel(aka_record, "aka");
                await axios.put(`${p(person.data.id).KARTOFFEL_UPDATE_PERSON_API}`, person_ready_for_kartoffel)
                    .then(() => {
                        logger.info(`The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data successfully update in Kartoffel`);
                    })
                    .catch(err => {
                        logger.warn(`The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data not exist in Kartoffel. The Kartoffel message:"${err.response.data}"`);
                    })
            })

            // if the person does not exist in Kartoffel => ignore from the record
            .catch(err => {
                let errorMessage = (err.response) ? err.response.data : err.message;
                logger.warn(`Not update the person with identityCard: ${aka_record[fn.aka.identityCard]} from aka_raw_data. The error message:"${errorMessage}"`);
            });
    }


    //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
};
devSchedual();
///////////////////////////////////////////////////////////////////////////
// });
