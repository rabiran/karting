const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const ads = require('./ads/ads_synchronizeData');
const adNN = require('./adNN/adNN_syncData');
const nvMM = require('./nvSql/mm_synchronizeData');
const nvLMN = require('./nvSql/lmn_synchronizeData');
const nvMDN = require('./nvSql/mdn_synchronizeData');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');
const logger = require('./util/logger');
const Auth = require('./auth/auth');
const Redis = require("ioredis");
const promisify = require('util').promisify;

const redis = new Redis();

redis.on("connect", function(){
  logger.info("Redis connect to service");
})
redis.on("error", function (err) {
  logger.error(`Error from redis: ${err}`);
});

require('dotenv').config();
Auth.setRedis(redis);

if (process.env.DATA_SOURCE == fn.dataSources.excel) {
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
    await Auth.axiosKartofel.get(p(encodeURIComponent(fn.rootHierarchy)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
        .then((result) => {
            logger.info(`The root hierarchy "${result.data.name}" already exist in Kartoffel`);
        })
        .catch(async () => {
            await Auth.axiosKartofel.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy })
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
    diffsHandler(aka_data, fn.dataSources.aka, aka_data.all);

    // get the new json from es & save him on the server
    let es_Data = es().then((esDiffs) => {
        diffsHandler(esDiffs, fn.dataSources.es, aka_data.all);
    });
    // get the new json from ads & save him on the server
    let ads_Data = ads().then((adsDiff) => {
        diffsHandler(adsDiff, fn.dataSources.ads, aka_data.all);
    });
    // get the new json from nn & save him on the server
    let adNN_Data = adNN().then((adNNDiff) => {
        diffsHandler(adNNDiff, fn.dataSources.adNN, aka_data.all);
    });
    // get the new json from mm & save him on the server
    let nvMM_Data = nvMM().then((nvMMDiffs) => {
        diffsHandler(nvMMDiffs, fn.dataSources.nvSQL, aka_data.all);
    });
    // get the new json from lmn & save him on the server
    let nvLMN_Data = nvLMN().then((nvLMNDiff) => {
        diffsHandler(nvLMNDiff, fn.dataSources.nvSQL, aka_data.all);
    });
    // get the new json from mdn & save him on the server
    let nvMDN_Data = nvMDN().then((nvMDNDiff) => {
        diffsHandler(nvMDNDiff, fn.dataSources.nvSQL, aka_data.all);
    });


    //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
};

[devSchedual, promisify(() => redis.quit())].reduce((prevFunc, nextFunc) => prevFunc.then(nextFunc), Promise.resolve());

///////////////////////////////////////////////////////////////////////////
// });
