const p = require('../../config/paths');
const Auth = require('../../auth/auth');
const trycatch = require('../generalUtils/trycatch');
const fn = require('../../config/fieldNames');
const { sendLog, logLevel } = require('../logger');
const logDetails = require('../logDetails');

/**
 * Handle the direct group of aka persons
 * 
 * @param {string} unitName 
 */
async function akaDirectGroupHandler(unitName) {
    const pathToGroupByAkaUnit = p(unitName).KARTOFFEL_GROUP_BY_AKA_UNIT;

    const tryFindGroupByUnit = await trycatch(
        Auth.axiosKartoffel.get,
        pathToGroupByAkaUnit
    );

    if (tryFindGroupByUnit.err) {
        const err = tryFindGroupByUnit.err;
        sendLog(
            logLevel.error,
            logDetails.error.ERR_FIND_GROUP_BY_AKA_UNIT,
            unitName
        );
        return;
    }

    const groupByAka = tryFindGroupByUnit.result.data;

    const hierarchyToCheck = [
        ...groupByAka.hierarchy,
        unitName,
        fn.organizationGroups.incomplete,
    ].join('/');

    const pathToIncompelteCheck = p(
        encodeURIComponent(hierarchyToCheck)
    ).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API;

    const tryFindIncomplete =
        await trycatch(
            Auth.axiosKartoffel.get,
            pathToIncompelteCheck
        );

    let directGroup;

    if (tryFindIncomplete.err) {
        const tryCreateGroup = await trycatch(
            Auth.axiosKartoffel.post,
            p().KARTOFFEL_ADDGROUP_API,
            {
                name: fn.organizationGroups.incomplete,
                parentId: groupByAka.id
            }
        );

        if (tryCreateGroup.err) {
            const err = tryCreateGroup.err;
            const message = err.response ? err.response.data.message : err.message;
            sendLog(
                logLevel.error,
                logDetails.error.ERR_CREATE_DIRECT_GROUP,
                hierarchyToCheck,
                message
            );
            return;
        }

        directGroup = tryCreateGroup.result.data;
    } else {
        directGroup = tryFindIncomplete.result.data
    }

    return directGroup.id;
}

module.exports = akaDirectGroupHandler;
