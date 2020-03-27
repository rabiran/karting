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
    const tryFindGroupByUnit = await trycatch(
        Auth.axiosKartoffel.get,
        p(unitName).KARTOFFEL_GROUP_BY_AKA_UNIT
    );

    if (tryFindGroupByUnit.err) {
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
        groupByAka.name,
        fn.organizationGroups.incompletes_name,
    ].join('/');

    const tryFindIncomplete = await trycatch(
        Auth.axiosKartoffel.get,
        p(
            encodeURIComponent(hierarchyToCheck)
        ).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API
    );

    let directGroup;

    if (
        tryFindIncomplete.err &&
        tryFindIncomplete.err.response &&
        tryFindIncomplete.err.response.status == 404
    ) {
        const tryCreateGroup = await trycatch(
            Auth.axiosKartoffel.post,
            p().KARTOFFEL_ADDGROUP_API,
            {
                name: fn.organizationGroups.incompletes_name,
                parentId: groupByAka.id
            }
        );

        if (tryCreateGroup.err) {
            const err = tryCreateGroup.err;
            const message = err.response ? err.response.data.message : err.message;
            sendLog(
                logLevel.error,
                logDetails.error.ERR_ADD_HIERARCHY,
                hierarchyToCheck,
                message
            );
            return;
        }

        // log creation

        directGroup = tryCreateGroup.result.data;
    } else {
        directGroup = tryFindIncomplete.result.data
    }

    return directGroup.id;
}

module.exports = akaDirectGroupHandler;
