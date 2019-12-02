const axios = require("axios");
const authParams = require("../config/authParams");
const jwt = require("jsonwebtoken");
const https = require("https");
const logger = require('../util/logger');

class Auth {
  /**
   *
   * @param redisInstance - Redis instance to get\set token from redis service
   */
  static setRedis (redisInstance) {
    Auth.redis = redisInstance;
  };

  /**
   * Return spike's publicKey
   */
  static async getPublicKey () {
    return (await Auth.axiosSpike.get(authParams.publicKeyPath)).data;
  }

  /**
   * Return getToken from spike
   */
  static async getToken () {
    let verifyToken;
    if (!Auth.publicKey) {
      Auth.publicKey = await Auth.getPublicKey();
    }
    if (!Auth.accessToken) {
      Auth.accessToken = Auth.redis && Auth.redis.status === 'ready' ? await Auth.redis.get(Auth.keyName) : null;
    }
    try {
      verifyToken = jwt.verify(Auth.accessToken, Auth.publicKey);
    } catch (error) {
      verifyToken = false;
    }
    if (!verifyToken) {
      try {
        Auth.accessToken = (await Auth.axiosSpike.post(authParams.tokenPath, {
          grant_type: "client_credentials",
          audience: authParams.audience,
          scope: authParams.scope.join(' '),
        })).data.access_token;
        if(Auth.redis && Auth.redis.status === 'ready') {
          await Auth.redis.set(Auth.keyName, Auth.accessToken);
          logger.info('Success to set access token in redis');
        }
      } catch (error) {
        logger.error(`Error from spike: ${error.message}`);
      }
    }
    return Auth.accessToken;
  };
}

// Static params
Auth.redis;
Auth.publicKey;
Auth.accessToken;
Auth.keyName = "accessToken";

// Axios instances
Auth.axiosSpike = axios.create({
  baseURL: `${authParams.spikeHost}:${authParams.spikePort}`,
  headers: {
    Authorization: `Basic ${Buffer.from(`${authParams.clientId}:${authParams.ClientSecret}`).toString("base64")}`
  },
  httpsAgent: new https.Agent({rejectUnauthorized: false}),
});

Auth.axiosKartoffel = axios.create();
Auth.axiosKartoffel.interceptors.request.use(async config => {
  config.headers.Authorization = await Auth.getToken();
  return config;
});

module.exports = Auth;
