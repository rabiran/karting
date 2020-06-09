const p = require('../config/paths');
const Auth = require('../auth/auth')
const fn = require('../config/fieldNames');
const tryArgs = require('./generalUtils/tryArgs');

/**
 * Check if the record from raw data exists in Kartoffel
 * 
 * @param { DataModel } DataModel
 */
module.exports = async DataModel => {
    const filterdIdentifiers = [
        DataModel.record[fn[DataModel.dataSource].personalNumber],
        DataModel.record[fn[DataModel.dataSource].identityCard]
    ].filter(id => id);

    path = identifier => p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

    const { result, lastErr } = await tryArgs(
        async identifier => (await Auth.axiosKartoffel.get(path(identifier))).data,
        ...filterdIdentifiers
    );
    
    if (lastErr && lastErr.response && lastErr.response.status === 404) {
        return false;
    }

    if (result) {
        return true;
    }
}