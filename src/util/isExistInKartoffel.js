const p = require('../config/paths');
const Auth = require('../auth/auth')
const fn = require('../config/fieldNames');
const tryArgs = require('./generalUtils/tryArgs');

/**
 * Check if the record from raw data exists in Kartoffel
 * 
 * @param { DataModel } DataModel 
 * @param { string } flowType 
 */
module.exports = async DataModel => {
    const filterdIdentifiers = [
        DataModel.record[fn[DataModel.dataSource].personalNumber],
        DataModel.record[fn[DataModel.dataSource].identityCard]
    ].filter(id => id);

    path = identifier => p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

    const { result } = await tryArgs(
        async identifier => (await Auth.axiosKartoffel.get(path(identifier))).data,
        ...filterdIdentifiers
    );

    return !!result;
}