const fn = require('../../config/fieldNames');
const p = require('../../config/paths');
const { sendLog, logLevel } = require('../logger');
const logDetails = require('../logDetails');
const Auth = require('../../auth/auth');

/**
 * This module create domainUser for person, using the unique properties of each dataSource
 *
 * @param {Object} person The Person object that returned from kartoffel
 * @param {Object} record The raw object that coming from the dataSource
 * @param {string} dataSource The dataSource of the object
 * @param {Object} originalRecord The original raw record before matchToKartoffel 
 *
 *  */
module.exports = async (DataModel) => {
    let user_object = {
        dataSource: DataModel.dataSource,
    };
    
    (DataModel.dataSource === fn.dataSources.ads && DataModel.record[fn[DataModel.dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${DataModel.record[fn[DataModel.dataSource].sAMAccountName]}${fn[DataModel.dataSource].domainSuffix}` : null;
    (DataModel.dataSource === fn.dataSources.adNN && DataModel.record[fn[DataModel.dataSource].sAMAccountName]) ?
        user_object.uniqueID = `${DataModel.record[fn[DataModel.dataSource].sAMAccountName]}${fn[DataModel.dataSource].domainSuffix}` : null;
    (((DataModel.dataSource === fn.dataSources.mdn) || (DataModel.dataSource === fn.dataSources.lmn) || (DataModel.dataSource === fn.dataSources.mm)) && DataModel.record[fn[DataModel.dataSource].uniqueID]) ?
        user_object.uniqueID = DataModel.record[fn[DataModel.dataSource].uniqueID].toLowerCase() : null;
    (DataModel.dataSource === fn.dataSources.es && DataModel.record[fn[DataModel.dataSource].userName]) ?
        user_object.uniqueID = `${DataModel.record[fn[DataModel.dataSource].userName]}${fn[DataModel.dataSource].domainSuffix}` : null;
    (DataModel.dataSource === fn.dataSources.city && DataModel.record[fn[DataModel.dataSource].domainUsers]) ?
        user_object.uniqueID = `${DataModel.record[fn[DataModel.dataSource].domainUsers].toLowerCase()}` : null;


    if (!user_object.uniqueID) {
        return;
    } else {
        user_object.uniqueID = user_object.uniqueID.toLowerCase();

        if (DataModel.person.domainUsers.length > 0) {
            let breaking = false;
            DataModel.person.domainUsers.map(du => {
                if (du.uniqueID.toLowerCase() === user_object.uniqueID) {
                    return breaking = true;
                }
            })
            if (breaking) { return; }
        }
    }

    try {
        let user = await Auth.axiosKartoffel.post(p(DataModel.person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        sendLog(logLevel.info, logDetails.info.INF_ADD_DOMAIN_USER, user_object.uniqueID, user.data.personalNumber || user.data.identityCard, DataModel.dataSource);
    } catch (err) {
        let errMessage = err.response ? err.response.data.message : err.message;

        // if the domain user was transfer from one person to another
        if (
            err.response &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message.includes('already exists') &&
            err.response.data.message.includes('domain user') &&
            err.response.data.name.includes('ValidationError')
        ) {
            let personToDeleteFrom;
            try {
                personToDeleteFrom = (await Auth.axiosKartoffel.get(`${p(user_object.uniqueID).KARTOFFEL_PERSON_BY_DOMAIN_USER}`)).data;
                await Auth.axiosKartoffel.delete(`${p(personToDeleteFrom.id, user_object.uniqueID).KARTOFFEL_DELETE_DOMAIN_USER_API}`);
                sendLog(logLevel.info, logDetails.info.INF_DELETE_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard);

                if (personToDeleteFrom.mail === user_object.uniqueID) {
                    personToDeleteFrom = (await Auth.axiosKartoffel.put(p(personToDeleteFrom.id).KARTOFFEL_UPDATE_PERSON_API, { mail: null })).data;
                    sendLog(logLevel.info, logDetails.info.INF_UPDATE_PERSON_IN_KARTOFFEL, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, DataModel.dataSource, JSON.stringify(personToDeleteFrom));
                }

                let user = (await Auth.axiosKartoffel.post(p(DataModel.person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object)).data;
                sendLog(logLevel.info, logDetails.info.INF_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, user.personalNumber || user.identityCard, DataModel.dataSource);
            } catch (err) {
                sendLog(logLevel.error, logDetails.error.ERR_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, DataModel.person.personalNumber || DataModel.person.identityCard, DataModel.dataSource)
            }
        } else {
            sendLog(logLevel.error, logDetails.error.ERR_ADD_DOMAIN_USER, DataModel.person.mail, DataModel.person.personalNumber || DataModel.person.identityCard, DataModel.dataSource, errMessage);
        }
    }
}
