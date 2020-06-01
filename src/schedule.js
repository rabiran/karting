const dataSync = require('./util/data_synchronizeData');
const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const { sendLog, logLevel } = require('./util/logger');
const Auth = require('./auth/auth');
const schedule = require('node-schedule');
const PromiseAllWithFails = require('./util/generalUtils/promiseAllWithFails');
const logDetails = require('./util/logDetails');
const connectToRedis = require('./util/generalUtils/connectToRedis');
const authHierarchyExistence = require('./util/generalUtils/authHierarchyExistence');
const express = require("express")
const moment = require('moment');
const getRawData = require('./util/getRawData');
const bodyParser = require('body-parser');

require('dotenv').config();
const scheduleRecoveryTime = process.env.NODE_ENV === 'production' ? fn.recoveryRunningTime : new Date().setMilliseconds(new Date().getMilliseconds() + 200);
const scheduleTime = process.env.NODE_ENV === 'production' ? fn.runningTime : new Date().setMilliseconds(new Date().getMilliseconds() + 200);

schedule.scheduleJob(scheduleTime, async () => await run(fn.runnigTypes.dailyRun));
schedule.scheduleJob(scheduleRecoveryTime, async () => await run(fn.runnigTypes.recoveryRun));

// Create immediateRun server app

let port = 3002;

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let data;
app.post("/immediateRun", async (req, res) => {
    console.log(req.body);
    data = req.body;
    await runImmediate(req.body.dataSource, req.body.personIDsArray);
    res.json('yes');
})

app.listen(port, () => console.log("immediateRun server run on port:" + port))

const run = async runnigType => {
    try {
        const redis = await connectToRedis();

        // check if the root hierarchy exist and adding it if not
        authHierarchyExistence();
        // get the new json from aka & save him on the server
        let aka_data = await dataSync(fn.dataSources.aka, runnigType);

        await PromiseAllWithFails([
            GetDataAndProcess(fn.dataSources.es, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.ads, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.adNN, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.lmn, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.mdn, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.mm, aka_data, runnigType, dataSync),
            GetDataAndProcess(fn.dataSources.city, aka_data, runnigType, dataSync),
        ]);
        
        // Due performence reasons aka flow is run by itself, after the other flows
        await GetDataAndProcess(fn.dataSources.aka, aka_data);

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

const runImmediate = async (dataSource, identifiersArray) => {
    try {
        const redis = await connectToRedis();

        // check if the root hierarchy exist and adding it if not
        authHierarchyExistence();

        const dateAndTime = moment(new Date()).format("DD.MM.YYYY__HH.mm");
        let aka_data = await getRawData(fn.dataSources.aka, fn.runnigTypes.ImmediateRun, dateAndTime);
        let data = {
            updated: []
        };
        data.added = await getRawData(dataSource, fn.runnigTypes.ImmediateRun, dateAndTime, identifiersArray);
        await diffsHandler(data, dataSource, aka_data);

        if (redis && redis.status === 'ready') redis.quit();

    } catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.ImmediateRun, JSON.stringify(err));
    }

}