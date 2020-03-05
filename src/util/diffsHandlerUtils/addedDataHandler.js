const matchToKartoffel = require('../matchToKartoffel');
const completeFromAka = require('../completeFromAka');
const identifierHandler = require('../fieldsUtils/identifierHandler');
const diff = require("diff-arrays-of-objects");
const updated = require('./updatedDataHandler')
const p = require('../../config/paths');
const fn = require('../../config/fieldNames');
const { sendLog, logLevel } = require('../logger');
const logDetails = require('../logDetails');
const domainUserHandler = require('../fieldsUtils/domainUserHandler');
const Auth = require('../../auth/auth');
const recordsFilter = require('../recordsFilter');
const tryArgs = require('../generalUtils/tryArgs');

require('dotenv').config();

/**
 * Take new object and add it to kartoffel
 *
 * @param {*} diffsObj - represnts the changes from last data
 * @param {*} dataSource - the data source which the data came from
 * @param {*} aka_all_data - all the data from aka data source (for compilation)
 * @param {*} currentUnit_to_DataSource - a map of all units from each data source
 * @param {*} needMatchToKartoffel - a flag to tell if the current object needs a match to kartoffel's format
 */
module.exports = async (diffsObj, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffelForAdded = true) => {
    if (dataSource === fn.dataSources.aka) {
        return;
    }

    let records = diffsObj;

    if (needMatchToKartoffelForAdded) {
        records = recordsFilter(diffsObj, dataSource);
    }

    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        let person_ready_for_kartoffel;
        let tryFindPerson;
        let person;
        let filterdIdentifiers;

        // in Recovery flow don't need matchToKartoffel
        if (needMatchToKartoffelForAdded) {
            person_ready_for_kartoffel = await matchToKartoffel(record, dataSource);
        } else {
            person_ready_for_kartoffel = record;
        }

        if (person_ready_for_kartoffel.entityType === fn.entityTypeValue.gu) {
            filterdIdentifiers = [person_ready_for_kartoffel.domainUsers[0].uniqueID];
            tryFindPerson = await tryArgs(
                async id => (await Auth.axiosKartoffel.get(p(id).KARTOFFEL_DOMAIN_USER_API)).data,
                ...filterdIdentifiers
            );
        } else if (
            person_ready_for_kartoffel.entityType === fn.entityTypeValue.s ||
            person_ready_for_kartoffel.entityType === fn.entityTypeValue.c
        ) {
            person_ready_for_kartoffel = completeFromAka(person_ready_for_kartoffel, aka_all_data, dataSource);
            filterdIdentifiers = [person_ready_for_kartoffel.identityCard, person_ready_for_kartoffel.personalNumber].filter(id => id);

            tryFindPerson = await tryArgs(
                async id => (await Auth.axiosKartoffel.get(p(id).KARTOFFEL_PERSON_EXISTENCE_CHECKING)).data,
                ...filterdIdentifiers
            );
        } else {
            sendLog(logLevel.warn, logDetails.warn.WRN_UNRECOGNIZED_ENTITY_TYPE, JSON.stringify(record), dataSource);
            continue;
        }

        if (tryFindPerson.lastErr) {
            if (tryFindPerson.lastErr.response && tryFindPerson.lastErr.response.status === 404) {
                person_ready_for_kartoffel = identifierHandler(person_ready_for_kartoffel);
                // Add the complete person object to Kartoffel
                try {
                    let person = await Auth.axiosKartoffel.post(p().KARTOFFEL_PERSON_API, person_ready_for_kartoffel);
                    person = person.data;
                    sendLog(logLevel.info, logDetails.info.INF_ADD_PERSON_TO_KARTOFFEL, JSON.stringify(filterdIdentifiers), dataSource);
                    // for goalUser domainUsers already created in matchToKartoffel
                    if (person.entityType !== fn.entityTypeValue.gu) {
                        // add domain user for the new person
                        await domainUserHandler(person, record, dataSource);
                    }
                } catch (err) {
                    let errMessage = lastErr.response ? lastErr.response.data.message : lastErr.message;
                    sendLog(logLevel.error, logDetails.error.ERR_INSERT_PERSON, JSON.stringify(filterdIdentifiers), dataSource, errMessage, JSON.stringify(record));
                }
            } else if (tryFindPerson.lastErr.message === 'tryArgs function did not get any arguments') {
                sendLog(logLevel.warn, logDetails.warn.WRN_MISSING_IDENTIFIER_PERSON, JSON.stringify(person_ready_for_kartoffel));
            } else {
                let errMessage = err.response ? err.response.data.message : err.message;
                sendLog(logLevel.error, logDetails.error.ERR_ADD_FUNCTION_PERSON_NOT_FOUND, JSON.stringify(filterdIdentifiers), dataSource, errMessage);
            }
        } else if (tryFindPerson.result) {
            person = tryFindPerson.result;

            let isPrimary = (currentUnit_to_DataSource.get(person.currentUnit) === dataSource);

            if (isPrimary) {
                Object.keys(person).map((key) => {
                    fn.fieldsForRmoveFromKartoffel.includes(key) ? delete person[key] : null;
                })

                let KeyForComparison = Object.keys(person).find(key => person[key] === tryFindPerson.argument);
                let objForUpdate = diff([person], [person_ready_for_kartoffel], KeyForComparison, { updatedValues: 4 });
                if (objForUpdate.updated.length > 0) {
                    updated(objForUpdate.updated, dataSource, aka_all_data, currentUnit_to_DataSource, needMatchToKartoffel = false);
                }
            } else {
                await domainUserHandler(person, record, dataSource);
            }
        } else {
            sendLog(logLevel.error, logDetails.error.ERR_UNKNOWN_ERROR, 'addedDataHandler', JSON.stringify(tryFindPerson.lastErr));
        }
    }
}
