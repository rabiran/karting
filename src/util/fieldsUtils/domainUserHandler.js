const fn = require('../../config/fieldNames');
const p = require('../../config/paths');
const {sendLog, logLevel} = require('../logger');
const logDetails = require('../logDetails');
const Auth = require('../../auth/auth');

/**
 *This module create domainUser for person, using the unique properties of each dataSource
 *
 * @param {*} person The Person object that returned from kartoffel
 * @param {*} record The raw object that coming from the dataSource
 * @param {*} dataSource The dataSource of the object
 *
 *  */
module.exports = async (person, record, dataSource) => {
    let user_object = {
        uniqueID: record[fn[dataSource].mail],
        dataSource,
    };

    (dataSource === fn.dataSources.ads && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (dataSource === fn.dataSources.adNN && record[fn[dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${record[fn[dataSource].sAMAccountName]}${fn[dataSource].domainSuffix}` : null;
    (((dataSource === fn.dataSources.mdn) || (dataSource === fn.dataSources.lmn) || (dataSource === fn.dataSources.mm)) && record[fn[dataSource].uniqueID]) ?
        user_object.uniqueID = record[fn[dataSource].uniqueID].toLowerCase() : null;
    (dataSource === fn.dataSources.es && record[fn[dataSource].userName]) ?
        user_object.uniqueID = `${record[fn[dataSource].userName]}${fn[dataSource].domainSuffix}` : null;
    (dataSource === fn.dataSources.city && record[fn[dataSource].domainUsers]) ? user_object.uniqueID = `${record[fn[dataSource].domainUsers].toLowerCase()}`: null;

    if (!user_object.uniqueID) {
        return;
    } else {
        if (person.domainUsers.length > 0) {
            let breaking = false;
            person.domainUsers.map(du => {
                if (du.uniqueID === user_object.uniqueID) {
                    return breaking = true;
                }
            })
            if (breaking) { return; }
        }
    }

    try {
        user_object.uniqueID = user_object.uniqueID.toLowerCase();
        let user = await Auth.axiosKartoffel.post(p(person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        sendLog(logLevel.info, logDetails.info.INF_ADD_DOMAIN_USER, user_object.uniqueID, user.data.personalNumber || user.data.identityCard, dataSource);
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;

        // if the domain user was transfer from one person to another
        if (err.response &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message.includes('already exists') &&
            err.response.data.message.includes('domain user') &&
            err.response.data.name.includes('ValidationError')) {
                try {
                    let personToDeleteFrom = (await Auth.axiosKartoffel.get(`${p(user_object.uniqueID).KARTOFFEL_PERSON_BY_DOMAIN_USER}`)).data;
                    const deletedDomainUser = (await Auth.axiosKartoffel.delete(`${p(personToDeleteFrom.id, user_object.uniqueID).KARTOFFEL_DELETE_DOMAIN_USER_API}`)).data;
                    sendLog(logLevel.info, logDetails.info.INF_DELETE_DOMAIN_USER, deletedDomainUser, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard);

                    if (personToDeleteFrom.mail === user_object.uniqueID) {
                        personToDeleteFrom = (await Auth.axiosKartoffel.put(p(personToDeleteFrom.id).KARTOFFEL_UPDATE_PERSON_API, { mail: null })).data;
                        sendLog(logLevel.info, logDetails.info.INF_UPDATE_PERSON_IN_KARTOFFEL, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, dataSource, JSON.stringify(personToDeleteFrom));
                    }

                    user = (await Auth.axiosKartoffel.post(p(person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object)).data;
                    sendLog(logLevel.info, logDetails.info.INF_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, user.personalNumber || user.identityCard, dataSource);
                } catch (err) {
                    sendLog(logLevel.error, logDetails.ERR_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, person.personalNumber || person.identityCard, dataSource)
                }
        } else {
            sendLog(logLevel.error, logDetails.error.ERR_ADD_DOMAIN_USER, person.mail, person.personalNumber || person.identityCard, dataSource, errMessage);
        }
    }
}
