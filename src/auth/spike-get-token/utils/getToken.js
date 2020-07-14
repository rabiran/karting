/* eslint-disable require-atomic-updates */
const njwt = require("njwt");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const initialOptions = require("../initialConfig")();

const getTokenCreator = (options) => {
    // saves token for this function instance
    let token = null;

    const actualOptions = { ...initialOptions, ...options };
    const { ClientId, ClientSecret, spikeURL, tokenGrantType, tokenAudience, tokenRedisKeyName, spikePublicKeyFullPath, useRedis, redisHost } = actualOptions;

    const base64 = data => (new Buffer(data)).toString('base64');


    const getSigningKey = function () {
        if (this.key)
            return this.key;
        this.key = fs.readFileSync(spikePublicKeyFullPath, 'utf8');
        return this.key;
    };

    const generateSpikeAuthorizationHeaders = () => ({
        'Authorization': `Basic ${base64(ClientId + ":" + ClientSecret)}`,
        'Content-Type': 'application/json'
    });

    const generateSpikeBodyParams = () => ({
        'grant_type': tokenGrantType,
        'audience': tokenAudience,
    });

    const handleTokenFromSpike = async () => {
        const headers = generateSpikeAuthorizationHeaders();
        const body = generateSpikeBodyParams();        
        try {
            const { data } = await axios.post(spikeURL, { ...body }, { headers });
            if (!data)
                return { err: 'No reponse from Spike' };
            const { access_token } = data;
            if (useRedis) {
                const { redisClient } = require(path.resolve(__dirname, "./redisHandler"));
                const { setValue } = redisClient(redisHost);
                await setValue(tokenRedisKeyName, access_token);
            }
            return { newToken: access_token };
        }
        catch (err) { return { err } }
    }

    const isValid = unvalidatedToken => {
        return new Promise(async (resolve, reject) => {
            if (unvalidatedToken) {
                njwt.verify(unvalidatedToken, await getSigningKey(), 'RS256', (err, verified) => {
                    if (err)
                        return resolve(false);
                    return resolve(true);
                })
            }
            else
                resolve(false);
        })
    }

    let getTokenFromRedis;
    if (useRedis) {
        const { redisClient } = require(path.resolve(__dirname, "./redisHandler"));
        const { getValue } = redisClient(redisHost);

        getTokenFromRedis = async () => {
            try {
                const redisToken = await getValue(tokenRedisKeyName);
                if (await isValid(redisToken))
                    return { redisToken };
            }
            catch (err) { return { err } }
            return { err: 'Invalid token from redis' };
        };
    }

    const redisResponse = async () => {
        const { err: redisError, redisToken } = useRedis ? await getTokenFromRedis() : {};
        if (redisToken) {
            return redisToken;
        }
        redisError ? console.error(`redisError: ${redisError}`) : null;
        return null;
    }

    const spikeResponse = async () => {
        const { err: spikeError, newToken } = await handleTokenFromSpike();
        if (newToken) {
            return newToken;
        }
        spikeError ? console.error(`spikeError: ${spikeError}`) : null;
        return null;
    }

    const getAndSaveNewToken = async () => {
        return (await redisResponse()) ? (await redisResponse()) : (await spikeResponse()) ? (await spikeResponse()) : (await getAndSaveNewToken());
    }

    async function getToken() {
        if (await isValid(token))
            return token;
        token = await getAndSaveNewToken();
        return token;
    }

    return getToken;
};



module.exports = { getTokenCreator };