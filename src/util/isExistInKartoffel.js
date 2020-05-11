const p = require('../config/paths');
const Auth = require('../auth/auth')
const fn = require('../config/fieldNames');
const tryArgs = require('./generalUtils/tryArgs');

/**
 * Check if the record from raw data exists in Kartoffel
 * 
 * @param { Object } record 
 * @param { string } flowType 
 */
module.exports = async record => {
    const filterdIdentifiers = [
        record[fn.aka.personalNumber],
        record[fn.aka.identityCard]
    ].filter(id => id);

    path = identifier => p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

    const { result, lastErr } = await tryArgs(
        async identifier => (await Auth.axiosKartoffel.get(path(identifier))).data,
        ...filterdIdentifiers
    );

    if (lastErr && lastErr.response && lastErr.response.data === 404) {
        return true;
    }

    if (result) {
        return true;
    }
}