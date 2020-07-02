const Redis = require("ioredis");
const { logLevel } = require('../logger');
const AuthClass = require('../../auth/auth');
const redis = require('../../auth/redisInstance');
const logDetails = require('../logDetails');

module.exports =  (sendLog) => {
    redis.on("connect", async () => {
        sendLog(logLevel.info, logDetails.info.INF_CONNECT_REDIS);
        // RedisInstance.setRedis(redis);
    })
    redis.on("error", function (err) {
        sendLog(logLevel.error, logDetails.error.ERR_CONNECTION_REDIS, err.message);
    });
    redis.on("end", function () {
        sendLog(logLevel.info, logDetails.info.INF_CLOSED_REDIS);
    });

    return redis;
}