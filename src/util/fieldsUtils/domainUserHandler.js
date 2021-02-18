const fn = require('../../config/fieldNames');
const p = require('../../config/paths');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const assembleDomainUser = require('./assembleDomainUser');

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
        //mail: DataModel.person.mail,
        //hierarchy: DataModel.person.hierarchy.join()
    };

    user_object.uniqueID = assembleDomainUser(DataModel.dataSource, DataModel.record);
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
        let user = await DataModel.Auth.axiosKartoffel.post(p(DataModel.person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        DataModel.sendLog(logLevel.info, logDetails.info.INF_ADD_DOMAIN_USER, user_object.uniqueID, user.data.personalNumber || user.data.identityCard, DataModel.dataSource);
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
                personToDeleteFrom = (await DataModel.Auth.axiosKartoffel.get(`${p(user_object.uniqueID).KARTOFFEL_PERSON_BY_DOMAIN_USER}`)).data;
                await DataModel.Auth.axiosKartoffel.delete(`${p(personToDeleteFrom.id, user_object.uniqueID).KARTOFFEL_DELETE_DOMAIN_USER_API}`);
                DataModel.sendLog(logLevel.info, logDetails.info.INF_DELETE_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, DataModel.dataSource);

                if (personToDeleteFrom.mail === user_object.uniqueID) {
                    personToDeleteFrom = (await DataModel.Auth.axiosKartoffel.put(p(personToDeleteFrom.id).KARTOFFEL_UPDATE_PERSON_API, { mail: null })).data;
                    DataModel.sendLog(logLevel.info, logDetails.info.INF_UPDATE_PERSON_IN_KARTOFFEL, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard, DataModel.dataSource, JSON.stringify(personToDeleteFrom));
                }

                let user = (await DataModel.Auth.axiosKartoffel.post(p(DataModel.person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object)).data;
                DataModel.sendLog(logLevel.info, logDetails.info.INF_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard ||  personToDeleteFrom.entityType, user.personalNumber || user.identityCard, DataModel.dataSource);
            } catch (err) {
                DataModel.sendLog(logLevel.error, logDetails.error.ERR_TRANSFER_DOMAIN_USER, user_object.uniqueID, personToDeleteFrom.personalNumber || personToDeleteFrom.identityCard ||  personToDeleteFrom.entityType, DataModel.person.personalNumber || DataModel.person.identityCard, DataModel.dataSource)
            }
        } else {
            DataModel.sendLog(logLevel.error, logDetails.error.ERR_ADD_DOMAIN_USER, DataModel.person.mail, DataModel.person.personalNumber || DataModel.person.identityCard, DataModel.dataSource, errMessage);
        }
    }
}
