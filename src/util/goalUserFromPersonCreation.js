const p = require('../config/paths');
const Auth = require('../auth/auth');
const trycatch = require('./generalUtils/trycatch');
const { sendLog, logLevel } = require('./logger');
const logDetails = require('./logDetails');

/**
 * Delete domainUser from a real person (Soldier or Civilian)
 * and create a new GoalUser instead
 * 
 * @param {Person} personFromKartoffel - a real person from Kartoffel
 * @param {Object} goalUserToCreate - ready to create GoalUser object
 */
async function goalUserFromPersonCreation(personFromKartoffel, goalUserToCreate, dataSource) {
    // delete the domain user from the real person
    let tryDelete =  await trycatch(
        async () => (
            await Auth.axiosKartoffel.delete(
                `${p(
                    personFromKartoffel.id,
                    goalUserToCreate.domainUsers[0].uniqueID
                ).KARTOFFEL_DELETE_DOMAIN_USER_API}`
            )
        ).data
    );

    if (tryDelete.err) {
        let errMessage = tryDelete.err.response ? tryDelete.err.response.data.message : tryDelete.err.message;

        sendLog(
            logLevel.error,
            logDetails.error.ERR_DELETE_DOMAIN_USER,
            goalUserToCreate.domainUsers[0].uniqueID,
            personFromKartoffel.personalNumber || personFromKartoffel.identityCard,
            dataSource,
            errMessage
        );

        sendLog(
            logLevel.error,
            logDetails.error.ERR_INSERT_PERSON,
            goalUserToCreate.domainUsers[0].uniqueID,
            dataSource,
            errMessage,
            JSON.stringify(goalUserToCreate)
        );
    }

    let tryCreate = await trycatch(
        async () => (
            await Auth.axiosKartoffel.post(p().KARTOFFEL_PERSON_API, goalUserToCreate)
        ).data
    );

    if (tryCreate.err) {
        let errMessage = tryCreate.err.response ? tryCreate.err.response.data.message : tryCreate.err.message;
        sendLog(
            logLevel.error,
            logDetails.error.ERR_INSERT_PERSON,
            goalUserToCreate.domainUsers[0].uniqueID,
            dataSource,
            errMessage,
            JSON.stringify(goalUserToCreate)
        );
        return;
    }

    sendLog(
        logLevel.info,
        logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL,
        JSON.stringify(goalUserToCreate.domainUsers[0].uniqueID),
        dataSource
    );
}

module.exports = goalUserFromPersonCreation;
