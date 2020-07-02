const axios = require("axios");
const authParams = require("../config/authParams");
const jwt = require("jsonwebtoken");
const https = require("https");
const { logLevel } = require('../util/logger');
const logDetails = require('../util/logDetails');
const redis = require('./RedisInstance');

class Auth {
  constructor(sendLog) {
    this.sendLog = sendLog;
    this.publicKey;
    this.accessToken;
    this.keyName = "accessToken";

    // Axios instances
    this.axiosSpike = axios.create({
      baseURL: `${authParams.spikeHost}:${authParams.spikePort}`,
      headers: {
        Authorization: `Basic ${Buffer.from(`${authParams.clientId}:${authParams.ClientSecret}`).toString("base64")}`
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    this.axiosKartoffel = axios.create();
    this.axiosKartoffel.interceptors.request.use(async config => {
      config.headers.Authorization = await this.getToken();
      return config;
    });

  }

  /**
   * Return spike's publicKey
   */
  async getPublicKey() {
    return (await this.axiosSpike.get(authParams.publicKeyPath)).data;
  }

  /**
   * Return getToken from spike
   */
  async getToken() {
    let verifyToken;
    if (!this.publicKey) {
      this.publicKey = await this.getPublicKey();
    }
    if (!this.accessToken) {
      this.accessToken = redis && redis.status === 'ready' ? await redis.get(this.keyName) : null;
    }
    try {
      verifyToken = jwt.verify(this.accessToken, this.publicKey);
    } catch (error) {
      verifyToken = false;
    }
    if (!verifyToken) {
      try {
        this.accessToken = (await this.axiosSpike.post(authParams.tokenPath, {
          grant_type: "client_credentials",
          audience: authParams.audience,
          scope: authParams.scope.join(' '),
        })).data.access_token;
        if (redis && redis.status === 'ready') {
          await redis.set(this.keyName, this.accessToken);
          this.sendLog(logLevel.info, logDetails.info.INF_SET_TOKEN);
        }
      } catch (error) {
        this.sendLog(logLevel.error, logDetails.error.ERR_SPIKE_TOKEN, error.message);
      }
    }
    return this.accessToken;
  };
}

module.exports = Auth;
