const config = () => ({
    redisHost: 'redis://localhost',
    ClientId: 'ClientId',
    ClientSecret: 'ClientSecret',
    spikeURL: 'http://localhost:8080',
    apiURL: 'http://localhost:3000',
    tokenGrantType: 'client_credentials',
    tokenAudience: 'kartoffel',
    tokenRedisKeyName: 'token',
    // path relative to current folder ( config )
    spikePublicKeyRelativePath: './key.pem',
    useRedis: true
})

module.exports = config;