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
const schedule = require('node-schedule');

require('dotenv').config();

if (process.env.DATA_SOURCE == fn.dataSources.excel) {
    const express = require("express")
    app = express()
    xls = require('./util/xlsxInsert');
    app.use(xls)
    app.listen(5000, () => console.log(`Example app listening on port 5000!`))
}

const scheduleTime = process.env.NODE_ENV === 'production' ? fn.runningTime : 
                            new Date().setMilliseconds(new Date().getMilliseconds() + 200);

schedule.scheduleJob(scheduleTime ,async()=>{
    const redis = new Redis({
        retryStrategy: function(times) {
            return times <= 3 ? times * 1000 : "stop reconnecting";
        }
    });

    redis.on("connect", async function(){
        logger.info("Redis connect to service");
        Auth.setRedis(redis);    
    })   
    redis.on("error", function (err) {        
        logger.error("Failed to connect to Redis. error message: " + err.message);
    });
    redis.on("end", function () {
        logger.info("The connection to Redis is closed");
    });
    
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

    await Promise.all([
        GetDataAndProcess(fn.dataSources.aka, aka_data),
        GetDataAndProcess(fn.dataSources.es, aka_data, es),
        GetDataAndProcess(fn.dataSources.ads, aka_data, ads),
/*         GetDataAndProcess(fn.dataSources.adNN, aka_data, adNN),
        GetDataAndProcess(fn.dataSources.nvSQL, aka_data, nvMM),
        GetDataAndProcess(fn.dataSources.nvSQL, aka_data, nvLMN),
        GetDataAndProcess(fn.dataSources.nvSQL, aka_data, nvMDN) */
    ]);

    if(redis && redis.status === 'ready') redis.quit();
});


const GetDataAndProcess = async (dataSource, akaData, func) => {
    let data = func ? await func() : akaData;
    await diffsHandler(data, dataSource, akaData.all);
}
