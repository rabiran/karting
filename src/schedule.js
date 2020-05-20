const dataSync = require('./util/data_synchronizeData');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const Auth = require('./auth/auth');
const schedule = require('node-schedule');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails');
const logDetails = require('./util/logDetails');
const connectToRedis = require('./util/generalUtils/connectToRedis');
const express = require("express")
const bodyParser = require('body-parser');

require('dotenv').config();
const scheduleRecoveryTime = process.env.NODE_ENV === 'production' ? fn.recoveryRunningTime : new Date().setMilliseconds(new Date().getMilliseconds() + 200);
const scheduleTime = process.env.NODE_ENV === 'production' ? fn.runningTime : new Date().setMilliseconds(new Date().getMilliseconds() + 200);

// schedule.scheduleJob(scheduleTime, async () => await run(fn.runnigTypes.dailyRun));
// schedule.scheduleJob(scheduleRecoveryTime, async () => await run(fn.runnigTypes.recoveryRun));

// Create immediateRun server app

let port = 3002

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let data;
app.post("/immediateRun", async (req, res) => {
    console.log(req.body);
    data = req.body;
    await run(fn.runnigTypes.ImmediateRun);
    res.json('yes');
})

app.get("/immediateRun", (req, res) => {
    res.json(data);
})
app.listen(port, () => console.log("immediateRun server run on port:" + port))


const run = async runnigType => {
    try {
        const redis = await connectToRedis();

        // check if the root hierarchy exist and adding it if not
        await Auth.axiosKartoffel.get(p(encodeURIComponent(fn.rootHierarchy.ourCompany)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
            .then((result) => {
                sendLog(logLevel.info, logDetails.info.INF_ROOT_EXSIST, result.data.name);
            })
            .catch(async () => {
                await Auth.axiosKartoffel.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy.ourCompany })
                    .then((result) => {
                        sendLog(logLevel.info, logDetails.info.INF_ADD_ROOT, result.data.name);
                    })
                    .catch((err) => {
                        let errorMessage = (err.response) ? err.response.data.message : err.message;
                        sendLog(logLevel.error, logDetails.error.ERR_ADD_ROOT, errorMessage);
                    })
            });

        // get the new json from aka & save him on the server
        let aka_data = await dataSync(fn.dataSources.aka, runnigType , true);

        if(runnigType == fn.runnigTypes.ImmediateRun) {
            await PromiseAllWithFails([
                GetDataAndProcess(fn.dataSources.es, aka_data, runnigType, dataSync),
            ]);
        } else {
            await PromiseAllWithFails([
                GetDataAndProcess(fn.dataSources.aka, aka_data),
                GetDataAndProcess(fn.dataSources.es, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.ads, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.adNN, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.lmn, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.mdn, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.mm, aka_data, runnigType, dataSync),
                GetDataAndProcess(fn.dataSources.city, aka_data, runnigType, dataSync),
            ]);
        }
        if (redis && redis.status === 'ready') redis.quit();
    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, runnigType, JSON.stringify(err));
    }
}

/**
 *
 * @param {*} dataSource - The source of the data
 * @param {*} akaData - The aka data to complete data information
 * @param {*} func - The function thet get and compare data from data source
 */
const GetDataAndProcess = async (dataSource, akaData, runnigType, func) => {
    // In case datasource is aka, I get data before function and therefore not need to get data again
    let data = func ? await func(dataSource, runnigType) : akaData;
    await diffsHandler(data, dataSource, akaData.all);
}

module.exports = async (data, dataSource, akaData, runnigType) => {
    await diffsHandler(data, dataSource, akaData.all);
}
