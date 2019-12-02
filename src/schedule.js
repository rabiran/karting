const dataSync = require('./util/data_synchronizeData');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const Auth = require('./auth/auth');
const Redis = require("ioredis");
const schedule = require('node-schedule');
const PromiseAllWithFails = require('./util/promiseAllWithFails');
const logDetails = require('./util/logDetails');
require('dotenv').config();

if (process.env.DATA_SOURCE == fn.dataSources.excel) {
    const express = require("express")
    app = express()
    xls = require('./util/xlsxInsert');
    app.use(xls)
    app.listen(5000, () => console.log(`Example app listening on port 5000!`))
}

const scheduleTime = process.env.NODE_ENV === 'production' ? fn.runningTime : new Date().setMilliseconds(new Date().getMilliseconds() + 200);

schedule.scheduleJob(scheduleTime ,async()=>{
    const redis = new Redis({
        retryStrategy: function(times) {
            return times <= 3 ? times * 1000 : "stop reconnecting";
        }
    });

    redis.on("connect", async function(){
        sendLog(logLevel.info, logDetails.info.INF_CONNECT_REDIS);
        Auth.setRedis(redis);
    })
    redis.on("error", function (err) {
        sendLog(logLevel.error, logDetails.error.ERR_CONNECTION_REDIS, err.message);
    });
    redis.on("end", function () {
        sendLog(logLevel.info, logDetails.info.INF_CLOSED_REDIS);
    });

    // check if the root hierarchy exist and adding it if not
    await Auth.axiosKartoffel.get(p(encodeURIComponent(fn.rootHierarchy)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
        .then((result) => {
            sendLog(logLevel.info, logDetails.info.INF_ROOT_EXSIST, result.data.name);
        })
        .catch(async () => {
            await Auth.axiosKartoffel.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy })
                .then((result) => {
                    sendLog(logLevel.info, logDetails.info.INF_ADD_ROOT, result.data.name);
                })
                .catch((err) => {
                    let errorMessage = (err.response) ? err.response.data.message : err.message;
                    sendLog(logLevel.error, logDetails.error.ERR_ADD_ROOT, errorMessage);
                })
        });

    // get the new json from aka & save him on the server
    let aka_data = await dataSync(fn.dataSources.aka);

    await PromiseAllWithFails([
        GetDataAndProcess(fn.dataSources.aka, aka_data),
        GetDataAndProcess(fn.dataSources.es, aka_data, dataSync),
        GetDataAndProcess(fn.dataSources.ads, aka_data, dataSync),
        GetDataAndProcess(fn.dataSources.adNN, aka_data, dataSync),
        GetDataAndProcess(fn.dataSources.lmn, aka_data, dataSync),
        GetDataAndProcess(fn.dataSources.mdn, aka_data, dataSync),
        GetDataAndProcess(fn.dataSources.mm, aka_data, dataSync)
    ]);

    if(redis && redis.status === 'ready') redis.quit();
});

/**
 *
 * @param {*} dataSource - The source of the data
 * @param {*} akaData - The aka data to complete data information
 * @param {*} func - The function thet give data from data source
 */
const GetDataAndProcess = async (dataSource, akaData, func) => {
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = func ? await func(dataSource) : akaData;
    await diffsHandler(data, dataSource, akaData.all);
}
