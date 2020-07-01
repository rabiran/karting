const fn = require("./config/fieldNames");
const { sendLog, logLevel } = require("./util/logger");
const schedule = require("node-schedule");
const logDetails = require("./util/logDetails");
const express = require("express");
const bodyParser = require("body-parser");
const immediate = require("./immediate");
const recovery = require("./recovery");
const daily = require("./daily");

require("dotenv").config();
const scheduleRecoveryTime =
  process.env.NODE_ENV === "production"
    ? fn.recoveryRunningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 2200);
const scheduleTime =
  process.env.NODE_ENV === "production"
    ? fn.runningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 200);


// recovery();
// daily();

// schedule.scheduleJob(scheduleRecoveryTime, async () => await recovery());
// schedule.scheduleJob(scheduleTime, async () =>  await daily());




// Create immediateRun server app

const port = fn.ImmediatePort;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/immediateRun", async (req, res) => {
  if (!req.body.personIDsArray || !req.body.dataSource) {
    sendLog(
      logLevel.error,
      logDetails.error.ERR_SERVER_INVALID_INPUT,
      JSON.stringify({personIDsArray: req.body.personIDsArray, dataSource: req.body.dataSource}), 
      fn.runnigTypes.ImmediateRun
    );
    res.json("there is an error with the input");
  } else {
    await immediate(req.body.dataSource, req.body.personIDsArray[0]);
    res.json("successfully added");
  }
});

app.listen(port, () => console.log("immediateRun server run on port:" + port));
