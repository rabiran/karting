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

require('dotenv').config();

if (process.env.DATA_SOURCE == fn.dataSources.excel) {
    const express = require("express")
    app = express()
    xls = require('./util/xlsxInsert');
    app.use(xls)
    app.listen(5000, () => console.log(`Example app listening on port 5000!`))
}


// const trialLog = schedule.scheduleJob(fn.runningTime,async()=>{
//////////////MOCK-DELETE AT PRODACTION//////////////////////////////
const devSchedual = (async () => {
  /////////////////////////////////////////////////////////////////////////////
  const redis = new Redis({
        retryStrategy: function(times) {
            return times <= 3 ? 1000 : "stop reconnecting";
        }
      });

    redis.on("connect", async function(){
        logger.info("Redis connect to service");
        Auth.setRedis(redis);
        await GetDataAndInsertKartoffel();
        await redis.quit();
    })   
    redis.on("error", function (err) {        
        logger.error("Failed to connect to Redis. error message: " + err.message);
    });
    redis.on("end", function () {
        logger.info("The connection to Radis is closed");
    });    

    //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
})();

const GetDataAndInsertKartoffel = async ()=> {
    // if (redis.status !== "connect") return;
    // check if the root hierarchy exist and adding it if not
    await Auth.axiosKartoffel.get(p(encodeURIComponent(fn.rootHierarchy)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
        .then((result) => {
            logger.info(`The root hierarchy "${result.data.name}" already exist in Kartoffel`);
        })
        .catch(async () => {
            await Auth.axiosKartoffel.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy })
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
    await diffsHandler(aka_data, fn.dataSources.aka, aka_data.all);

    // get the new json from es & save him on the server
    let es_Data = await es();
    await diffsHandler(es_Data, fn.dataSources.es, aka_data.all);

    // get the new json from ads & save him on the server
    let ads_Data = await ads();
    await diffsHandler(ads_Data, fn.dataSources.ads, aka_data.all);

 /*    // get the new json from nn & save him on the server
    let adNN_Data = await adNN();
    await diffsHandler(adNN_Data, fn.dataSources.adNN, aka_data.all);

    // get the new json from mm & save him on the server
    let nvMM_Data = await nvMM();
    await diffsHandler(nvMM_Data, fn.dataSources.nvSQL, aka_data.all);

    // get the new json from lmn & save him on the server
    let nvLMN_Data = await nvLMN();
    await diffsHandler(nvLMN_Data, fn.dataSources.nvSQL, aka_data.all);

    // get the new json from mdn & save him on the server
    let nvMDN_Data = nvMDN();
    await diffsHandler(nvMDN_Data, fn.dataSources.nvSQL, aka_data.all); */
}; 

// [devSchedual, promisify(() => redis.quit())].reduce((prevFunc, nextFunc) => prevFunc.then(nextFunc), Promise.resolve());

///////////////////////////////////////////////////////////////////////////
// });
