const identifierHandler = require('../fieldsUtils/identifierHandler');
const diff = require("diff-arrays-of-objects");
const updated = require('./updatedDataHandler')
const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const { sendLog, logLevel, wrapSendLog } = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const Auth = require('../../auth/auth');
const recordsFilter = require('../recordsFilter');
const tryArgs = require('../generalUtils/tryArgs');
const goalUserFromPersonCreation = require('../goalUserFromPersonCreation');
const DataModel = require('../DataModel');

require('dotenv').config();

/**
 * Take new object and add it to kartoffel
 *
 * @param { DataModel[] } newData - represnts the changes from last data
 * @param {*} aka_all_data - all the data from aka data source (for compilation)
 * @param {*} currentUnit_to_DataSource - a map of all units from each data source
 */
module.exports = async (newData, dataSource, aka_all_data, currentUnit_to_DataSource) => {
    let dataModels = await recordsFilter(newData, dataSource);

    for (let i = 0; i < dataModels.length; i++) {
        const DataModel = dataModels[i];
        let tryFindPerson;
        let path;

        await DataModel.matchToKartoffel();

        if (DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu) {
            DataModel.identifiers = [DataModel.person_ready_for_kartoffel.domainUsers[0].uniqueID].filter(id => id);
            path = id => p(id).KARTOFFEL_DOMAIN_USER_API;
        } else if (
            DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.s ||
            DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.c
        ) {
            DataModel.completeFromAka(aka_all_data);

            DataModel.identifiers = [
                DataModel.person_ready_for_kartoffel.identityCard,
                DataModel.person_ready_for_kartoffel.personalNumber
            ].filter(id => id);
            path = id => p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING;
        } else {
            sendLog(
                logLevel.warn,
                logDetails.warn.WRN_UNRECOGNIZED_ENTITY_TYPE,
                JSON.stringify(DataModel.record),
                dataSource
            );
            continue;
        }

        if (!DataModel.identifiers.length) {
            sendLog(
                logLevel.warn,
                logDetails.warn.WRN_MISSING_IDENTIFIER_PERSON,
                JSON.stringify(DataModel.person_ready_for_kartoffel),
                JSON.stringify(DataModel.record),
                dataSource
            );
            continue;
        }

        tryFindPerson = await tryArgs(
            async id => (await Auth.axiosKartoffel.get(path(id))).data,
            ...DataModel.identifiers
        );

        if (tryFindPerson.lastErr) {
            if (tryFindPerson.lastErr.response && tryFindPerson.lastErr.response.status === 404) {
                DataModel.person_ready_for_kartoffel = identifierHandler(DataModel.person_ready_for_kartoffel);
                // Add the complete person object to Kartoffel
                try {
                    if (!DataModel.person_ready_for_kartoffel.directGroup) {
                        // log is neccarry
                        continue;
                    }
                    DataModel.person = (
                        await Auth.axiosKartoffel.post(
                            p().KARTOFFEL_PERSON_API, DataModel.person_ready_for_kartoffel
                        )
                    ).data;

                    sendLog(
                        logLevel.info,
                        logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL,
                        JSON.stringify(DataModel.identifiers),
                        dataSource
                    );
                    // for goalUser domainUsers already created in matchToKartoffel
                    if (DataModel.person.entityType !== fn.entityTypeValue.gu) {
                        // add domain user for the new person
                        await domainUserHandler(DataModel);
                    }
                } catch (err) {
                    const errMessage = err.response ? err.response.data.message : err.message;
                    sendLog(
                        logLevel.error,
                        logDetails.error.ERR_INSERT_PERSON,
                        JSON.stringify(DataModel.identifiers),
                        dataSource,
                        errMessage,
                        JSON.stringify(DataModel)
                    );
                }
            } else {
                const errMessage = tryFindPerson.lastErr.response ? tryFindPerson.lastErr.response.data.message : tryFindPerson.lastErr.message;
                sendLog(
                    logLevel.error,
                    logDetails.error.ERR_ADD_FUNCTION_PERSON_NOT_FOUND,
                    JSON.stringify(DataModel.identifiers),
                    dataSource,
                    errMessage
                );
            }
        } else if (tryFindPerson.result) {

            DataModel.person = tryFindPerson.result;

            DataModel.isDataSourcePrimary = (currentUnit_to_DataSource.get(DataModel.person_ready_for_kartoffel.currentUnit) === dataSource);

            if (
                DataModel.person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu &&
                DataModel.person.entityType !== fn.entityTypeValue.gu
            ) {
                await goalUserFromPersonCreation(DataModel.person, DataModel.person_ready_for_kartoffel, dataSource);
            } else if (DataModel.isDataSourcePrimary) {
                Object.keys(DataModel.person).map(key => {
                    fn.fieldsForRmoveFromKartoffel.includes(key) ? delete DataModel.person[key] : null;
                })

                let KeyForComparison = Object.keys(DataModel.person).find(key => DataModel.person[key] === tryFindPerson.argument);

                DataModel.deepDiffObj = diff(
                    [DataModel.person],
                    [DataModel.person_ready_for_kartoffel],
                    KeyForComparison,
                    { updatedValues: 4 }
                ).updated[0];

                if (DataModel.deepDiffObj.length > 0) {
                    updated(
                        [DataModel],
                        dataSource,
                        aka_all_data,
                        currentUnit_to_DataSource
                    );
                }
            } else {
                await domainUserHandler(DataModel);
            }
        } else {
            sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', JSON.stringify(tryFindPerson.lastErr));
        }
    }
}