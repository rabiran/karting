const fn = require("./config/fieldNames");
const schedule = require("node-schedule");
const immediateApp = require("./server/immediateServer");
const recovery = require("./runningMethods/recovery");
const daily = require("./runningMethods/daily");
//const migrationConsumer = require('./kafka/migration');

require("dotenv").config();

const scheduleRecoveryTime =
  process.env.NODE_ENV === "production"
    ? fn.recoveryRunningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 200);
const scheduleTime =
  process.env.NODE_ENV === "production"
    ? fn.runningTime
    : new Date().setMilliseconds(new Date().getMilliseconds() + 200);

 //schedule.scheduleJob(scheduleTime, async () =>  await daily());
schedule.scheduleJob(scheduleRecoveryTime, async () => await recovery());

const port = fn.immediatePort;
immediateApp.listen(port, () => console.log("immediateRun server run on port:" + port));

//migrationConsumer()
