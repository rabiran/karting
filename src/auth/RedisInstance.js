const Redis = require("ioredis");

module.exports = new Redis({
    retryStrategy: function (times) {
        return times <= 3 ? times * 1000 : "stop reconnecting";
    }
});