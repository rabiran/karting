const Redis = require("ioredis");
const { logLevel } = require('../logger');
const Auth = require('../../auth/auth');
const logDetails = require('../logDetails');

module.exports =  (sendLog) => {
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

    return redis;
}