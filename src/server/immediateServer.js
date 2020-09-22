const logDetails = require("../util/logDetails");
const { wrapSendLog , logLevel } = require("../util/logger");
const express = require("express");
const bodyParser = require("body-parser");
const shortid = require('shortid');
const luigi = require("../runningMethods/luigi");
const immediate = require("../runningMethods/immediate");
const fn = require("../config/fieldNames");

// Create immediateRun server app

const immediateApp = express();

immediateApp.use(bodyParser.json());
immediateApp.use(bodyParser.urlencoded({ extended: true }));
immediateApp.use((req, res, next) => {
    if (req.headers['authorization'] === "123") {
        next()
    }
    else{
        throw "unauthorized";
    }
})

immediateApp.post("/luigiRun", async (req, res) => {
  const sendLog = wrapSendLog(fn.runnigTypes.luigiRun);
  const runUID = shortid.generate();
  if (!req.body.personIDsArray || !req.body.dataSource || !shortid.isValid(runUID)) {
    sendLog(
      logLevel.error,
      logDetails.error.ERR_SERVER_INVALID_INPUT,
      JSON.stringify({personIDsArray: req.body.personIDsArray, dataSource: req.body.dataSource}), 
      fn.runnigTypes.luigiRun
    );
    res.status(400);
    res.json("karting respons and needs to be a standarted. there is an error with the input");
  } else {
    const runningResults = await luigi(req.body.dataSource, req.body.personIDsArray, runUID);
    res.status(200)
    res.json(runningResults);
  }
});

immediateApp.post("/immediateRun", async (req, res) => {
  const sendLog = wrapSendLog(fn.runnigTypes.immediateRun);
  const runUID = shortid.generate(); // whether comes from luigi or not
  if (!req.body.sourceRecords || !req.body.dataSource || !req.body.akaRecords) {
    sendLog(
      logLevel.error,
      logDetails.error.ERR_SERVER_INVALID_INPUT,
      JSON.stringify({personIDsArray: req.body.sourceRecords, dataSource: req.body.dataSource}), 
      fn.runnigTypes.immediateRun
    );
    res.status(400);
    res.json("One or more of the required inputs are not given");
  } else {
    const runningResults = await immediate(req.body.dataSource, req.body.sourceRecords, req.body.akaRecords, runUID);
    res.status(200)
    res.json(runningResults);
  }
});



module.exports = immediateApp;