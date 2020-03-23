const p = require('../../../config/paths');
const Auth = require('../../../auth/auth')
const fn = require('../../../config/fieldNames');
const tryArgs = require('../../generalUtils/tryArgs');

module.exports = async record => {
    const filterdIdentifiers = [
        record[fn.aka.personalNumber],
        record[fn.aka.identityCard]
    ].filter(id => id);

    path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

    const { lastErr } = await tryArgs(
        async id => (await Auth.axiosKartoffel.get(path(id))).data,
        ...filterdIdentifiers
    );

    return !!filterdIdentifiers.length && !!lastErr;
}