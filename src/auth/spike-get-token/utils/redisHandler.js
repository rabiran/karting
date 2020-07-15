const redis = require("redis");
const path = require("path");
const { promisify } = require("util");
const { logLevel } = require('../../../util/logger');
const logDetails = require('../../../util/logDetails');

const redisClient = (redisHost, sendLog) => {
    const client = redis.createClient(redisHost);
    const getAsync = promisify(client.get).bind(client);

    client.on("connect", () => {
        // sendLog(logLevel.info, logDetails.info.INF_CONNECT_REDIS);
    })

    client.on("error", (err) => {
        sendLog(logLevel.error, logDetails.error.ERR_CONNECTION_REDIS, err.message);
    })


    const getValue = async (key) => await getAsync(key);
    const setValue = async (key, value) => client.set(key, value);

    return { getValue, setValue };
}




module.exports = { redisClient };