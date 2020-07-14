const redis = require("redis");
const path = require("path");
const { promisify } = require("util");

const redisClient = (redisHost) => {
    const client = redis.createClient(redisHost);
    const getAsync = promisify(client.get).bind(client);

    client.on("connect", () => {
        console.log("Redis connected");
    })

    client.on("error", (err) => {
        console.error("Redis Error: " + err);
    })


    const getValue = async (key) => await getAsync(key);
    const setValue = async (key, value) => client.set(key, value);

    return { getValue, setValue };
}




module.exports = { redisClient };