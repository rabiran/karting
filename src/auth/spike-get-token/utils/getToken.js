/* eslint-disable require-atomic-updates */
const njwt = require("njwt");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { logLevel } = require("../../../util/logger");
const logDetails = require("../../../util/logDetails");

const initialOptions = require("../initialConfig")();
const getTokenCreator = (options) => {
  // saves token for this function instance
  let token = null;
  
  const actualOptions = { ...initialOptions, ...options };
  const {
    ClientId,
    ClientSecret,
    spikeURL,
    tokenGrantType,
    tokenAudience,
    tokenRedisKeyName,
    spikePublicKeyFullPath,
    useRedis,
    redisHost,
    sendLog,
    retries,
  } = actualOptions;
  
  let counter = retries;

  const base64 = (data) => new Buffer(data).toString("base64");

  const getSigningKey = function () {
    if (this.key) return this.key;
    this.key = fs.readFileSync(spikePublicKeyFullPath, "utf8");
    return this.key;
  };

  const generateSpikeAuthorizationHeaders = () => ({
    Authorization: `Basic ${base64(ClientId + ":" + ClientSecret)}`,
    "Content-Type": "application/json",
  });

  const generateSpikeBodyParams = () => ({
    grant_type: tokenGrantType,
    audience: tokenAudience,
  });

  const handleTokenFromSpike = async () => {
    const headers = generateSpikeAuthorizationHeaders();
    const body = generateSpikeBodyParams();
    try {
      const { data } = await axios.post(spikeURL, { ...body }, { headers });
      if (!data) return { err: "No reponse from Spike" };
      const { access_token } = data;
      if (useRedis) {
        const { redisClient } = require(path.resolve(
          __dirname,
          "./redisHandler"
        ));
        const { setValue } = redisClient(redisHost, sendLog);
        await setValue(tokenRedisKeyName, access_token);
      }
      return { newToken: access_token };
    } catch (err) {
      return { err };
    }
  };

  const isValid = (unvalidatedToken) => {
    return new Promise(async (resolve, reject) => {
      if (unvalidatedToken) {
        njwt.verify(
          unvalidatedToken,
          await getSigningKey(),
          "RS256",
          (err, verified) => {
            if (err) return resolve(false);
            return resolve(true);
          }
        );
      } else resolve(false);
    });
  };

  let getTokenFromRedis;
  if (useRedis) {
    const { redisClient } = require(path.resolve(__dirname, "./redisHandler"));
    const { getValue } = redisClient(redisHost, sendLog);

    getTokenFromRedis = async () => {
      try {
        const redisToken = await getValue(tokenRedisKeyName);
        if (await isValid(redisToken)) return { redisToken };
      } catch (err) {
        return { err };
      }
      return { err: "Invalid token from redis" };
    };
  }

  const redisResponse = async () => {
    const { err: redisError, redisToken } = useRedis
      ? await getTokenFromRedis()
      : {};
    if (redisToken) {
      return redisToken;
    }
    redisError
      ? sendLog(logLevel.error, logDetails.error.ERR_CONNECTION_REDIS, redisError)
      : null;
    return null;
  };

  const spikeResponse = async () => {
    const { err: spikeError, newToken } = await handleTokenFromSpike();
    if (newToken) {
      return newToken;
    }
    spikeError
      ? sendLog(logLevel.error, logDetails.error.ERR_SPIKE_TOKEN, spikeError)
      : null;
    return null;
  };
  
  const getAndSaveNewToken = async (counter) => {
    if (counter > 0) {
      return (await redisResponse())
        ? await redisResponse()
        : (await spikeResponse())
        ? await spikeResponse()
        : await getAndSaveNewToken(counter - 1);
    }
  };

  async function getToken() {
    if (await isValid(token)) return token;
    token = await getAndSaveNewToken(counter);
    return token;
  }

  return getToken;
};

module.exports = { getTokenCreator };
