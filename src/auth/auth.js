const axios = require("axios");
const authParams = require("../config/authParams");
const jwt = require("jsonwebtoken");
const https = require("https");
const { logLevel } = require('../util/logger');
const logDetails = require('../util/logDetails');
const redis = require('./redisInstance');
const getTokenCreator = require('./spike-get-token/index');
const path = require("path");

class Auth {
  constructor(sendLog, retries = 1) {
    let getToken = getTokenCreator({
        redisHost: 'redis://localhost',
        ClientId: authParams.clientId,
        ClientSecret: authParams.ClientSecret,
        spikeURL: `${authParams.spikeHost}:${authParams.spikePort}${authParams.tokenPath}`,
        tokenGrantType: 'client_credentials',
        tokenAudience: authParams.audience,
        tokenRedisKeyName: 'accessToken',
        spikePublicKeyFullPath: path.join(__dirname, './key.pem'),
        useRedis: true,
        httpsValidation: false,
        hostHeader: false,
        sendLog: sendLog,
        retries: retries, 
    });

    this.axiosKartoffel = axios.create();
    this.axiosKartoffel.interceptors.request.use(async config => {
      config.headers.Authorization = await getToken();
      return config;
    });

  }
}

module.exports = Auth;