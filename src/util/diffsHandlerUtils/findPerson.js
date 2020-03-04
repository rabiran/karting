const trycatch = require('../generalUtils/trycatch');
const Auth = require('../../auth/auth');
const p = require('../../config/paths')

/**
 * Try to find the person from api, with both identifiers
 *
 * @param { string } identifier
 * @param { string } personalNumber
 * @param { identityCard } identityCard
 * @param { string } pathField
 * @param { Function } handleErr
 */
async function findPerson(identifier, personalNumber, identityCard, pathField, handleErr) {
    let newIdentifier = identifier === personalNumber ? identityCard : personalNumber;

    let tryResult = await trycatch(() => Auth.axiosKartoffel.get(p(identifier)[pathField]));

    if (tryResult.err &&
        tryResult.err.response &&
        tryResult.err.response.status == 404 &&
        !isNaN(Number(identifier)) &&
        identityCard &&
        personalNumber) {
            tryResult = await trycatch(() => Auth.axiosKartoffel.get(p(newIdentifier)[pathField]));

            if (tryResult.err) {
                handleErr(tryResult.err);
                return;
            }
    }

    return tryResult.result.data;
}

module.exports = findPerson;