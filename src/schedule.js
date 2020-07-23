const fn = require("./config/fieldNames");
const { sendLog, logLevel } = require("./util/logger");
const schedule = require("node-schedule");
const logDetails = require("./util/logDetails");
const express = require("express");
const bodyParser = require("body-parser");
const shortid = require('shortid');
const immediate = require("./immediate");
const recovery = require("./recovery");
const daily = require("./daily");
const searchRecords = require("./searchRecords");

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
// schedule.scheduleJob(scheduleRecoveryTime, async () => await recovery());

// Create immediateRun server app

const port = fn.ImmediatePort;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/immediateRun", async (req, res) => {
  const runUID = req.body.uid;
  if (!req.body.personIDsArray || !req.body.dataSource || !shortid.isValid(runUID)) {
    sendLog(
      logLevel.error,
      logDetails.error.ERR_SERVER_INVALID_INPUT,
      JSON.stringify({personIDsArray: req.body.personIDsArray, dataSource: req.body.dataSource}), 
      fn.runnigTypes.ImmediateRun
    );
    res.json("there is an error with the input");
  } else {
    await immediate(req.body.dataSource, req.body.personIDsArray, runUID);
    res.json("successfully added");
  }
});


app.post("/scriptRun", async (req, res) => {
  if (!req.body.personIDsArray) {
    res.json("there is an error with the IDs input");
  } else {
    await searchRecords(req.body.personIDsArray);
    res.json("successfully found");
  }
});

app.listen(port, () => console.log("immediateRun server run on port:" + port));
