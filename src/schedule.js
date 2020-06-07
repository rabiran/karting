const dataSync = require("./util/data_synchronizeData");
const fn = require("./config/fieldNames");
const diffsHandler = require("./util/diffsHandler");
const { sendLog, logLevel } = require("./util/logger");
const schedule = require("node-schedule");
const Auth = require("./auth/auth");
const PromiseAllWithFails = require("./util/generalUtils/promiseAllWithFails");
const logDetails = require("./util/logDetails");
const connectToRedis = require("./util/generalUtils/connectToRedis");
const authHierarchyExistence = require("./util/generalUtils/authHierarchyExistence");
const express = require("express");
const moment = require("moment");
const getRawData = require("./util/getRawData");
const bodyParser = require("body-parser");
const immediate = require("./immediate");
const recovery = require("./recovery");
const daily = require("./daily");

require("dotenv").config();
const scheduleRecoveryTime =
  process.env.NODE_ENV === "production"
    ? fn.recoveryRunningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 200);
const scheduleTime =
  process.env.NODE_ENV === "production"
    ? fn.runningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 200);

// schedule.scheduleJob(scheduleTime, async () =>  await daily());
schedule.scheduleJob(scheduleRecoveryTime, async () => await recovery());

// Create immediateRun server app

let port = 3002;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let data;
app.post("/immediateRun", async (req, res) => {
  // console.log(req.body);
  data = req.body;
  if (!req.body.personIDsArray || !req.body.dataSource) {
    res.json("there is an error with the input");
  } else {
    await immediate(req.body.dataSource, req.body.personIDsArray);
    res.json("successfully added");
  }
});

app.listen(port, () => console.log("immediateRun server run on port:" + port));
