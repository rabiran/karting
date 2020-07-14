const axios = require("axios");
const authParams = require("../config/authParams");
const jwt = require("jsonwebtoken");
const https = require("https");
const { logLevel } = require('../util/logger');
const logDetails = require('../util/logDetails');
const redis = require('./redisInstance');
const getTokenCreator = require('./spike-get-token/index');
const path = require("path");

const getToken = getTokenCreator({
    redisHost: 'redis://localhost',
    ClientId: authParams.clientId,
    ClientSecret: authParams.ClientSecret,
    spikeURL: `${authParams.spikeHost}:${authParams.spikePort}${authParams.tokenPath}`,
    tokenGrantType: 'client_credentials',
    tokenAudience: authParams.audience,
    tokenRedisKeyName: 'accessToken',
    // path relative to current folder ( config )
    spikePublicKeyFullPath: path.join(__dirname, './key.pem'),
    useRedis: true,
    httpsValidation: false,
    hostHeader: false,
});
class Auth {
  constructor(sendLog) {

    this.axiosKartoffel = axios.create();
    this.axiosKartoffel.interceptors.request.use(async config => {
      try{
        config.headers.Authorization = await getToken();
      } catch(err){
        connsole.log('jhkj ' + err);
      }
      return config;
    });

  }

  /**
   * Return getToken from spike
   */
  // async getToken() {
  //   let verifyToken;
  //   if (!this.publicKey) {
  //     this.publicKey = await this.getPublicKey();
  //   }
  //   if (!this.accessToken) {
  //     this.accessToken = redis && redis.status === 'ready' ? await redis.get(this.keyName) : null;
  //   }
  //   try {
  //     verifyToken = jwt.verify(this.accessToken, this.publicKey);
  //   } catch (error) {
  //     verifyToken = false;
  //   }
  //   if (!verifyToken) {
  //     try {
  //       this.accessToken = (await this.axiosSpike.post(authParams.tokenPath, 
  //         grant_type: "client_credentials",
  //         audience: authParams.audience,
  //         scope: authParams.scope.join(' '),
  //       })).data.access_token;
  //       if (redis && redis.status === 'ready') {
  //         await redis.set(this.keyName, this.accessToken);
  //         this.sendLog(logLevel.info, logDetails.info.INF_SET_TOKEN);
  //       }
  //     } catch (error) {
  //       this.sendLog(logLevel.error, logDetails.error.ERR_SPIKE_TOKEN, error.message);
  //     }
  //   }
  //   return this.accessToken;
  // };
}

module.exports = Auth;