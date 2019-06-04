const simpleOauth2 = require('simple-oauth2');
const axios = require('axios');
const authParams = require('../config/authParams');

const credentials = {
    client: {
      id: authParams.clientId,
      secret: authParams.ClientSecret,
    },
    auth: {
      tokenHost: `${authParams.tokenHost}:${authParams.tokenPort}`,
      tokenPath: authParams.tokenPath,
    },
    http: {
        rejectUnauthorized: false
    }
  };

const oauth2 = simpleOauth2.create(credentials);
const tokenConfig = {
    scope: authParams.scope.join(' '),
    audience: authParams.audience,
};

let result, accessToken;

const getToken = async ()=>{
    if(!accessToken || accessToken.expired()){
        result = await oauth2.clientCredentials.getToken(tokenConfig);
        accessToken = oauth2.accessToken.create(result);
    }
    return accessToken.token.access_token;
}

    kartofelAxios = axios.create();
    kartofelAxios.interceptors.request.use(async (config)=> {
        config.headers.Authorization = await getToken();
        return config;
    });

    module.exports = kartofelAxios;