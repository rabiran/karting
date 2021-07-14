const fn = require('../../config/fieldNames');
const p = require('../../config/paths');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const lodash = require('lodash');
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
        hierarchy: DataModel.domainUserHierarchy,
        mail: DataModel.record[fn[DataModel.dataSource].mail]
    };
    user_object.uniqueID = assembleDomainUser(DataModel.dataSource, DataModel.record);

    // DataModel's data source is city and contains city domain
    let isExternal = DataModel.dataSource === fn.dataSources.city && DataModel.record.addedTags.isExternal;

    if (DataModel.dataSource === fn.dataSources.city && !isExternal) {
        user_object.dataSource = fn.dataSources.mir;
    };

    if(user_object.dataSource === fn.dataSources.mir) {
        delete user_object.hierarchy;
    }
    
    let needsToBeUpdated = false;
    let foundDU = false;

    if (!user_object.uniqueID) {
        return;
    } else {
        user_object.uniqueID = user_object.uniqueID.toLowerCase();
        // remove null/undefined before comparing users
        user_object = lodash.pickBy(user_object, lodash.identity)
        if (DataModel.person.domainUsers.length > 0) {
            DataModel.person.domainUsers.map(du => {
                if (du.uniqueID.toLowerCase() === user_object.uniqueID) {
                    foundDU = true;
                    delete du.adfsUID;
                    needUpdate = !lodash.isEqual(user_object, du)
                    if (needUpdate) {
                        return needsToBeUpdated = true;
                    }
                }
            })
            if (foundDU && !needsToBeUpdated) { return; }
        }
    }

    try {
        let user;
        if (needsToBeUpdated) {
            user = await DataModel.Auth.axiosKartoffel.put(p(DataModel.person.id, user_object.uniqueID).KARTOFFEL_UPDATE_DOMAIN_USER_API, user_object);
        } else {
            user = await DataModel.Auth.axiosKartoffel.post(p(DataModel.person.id).KARTOFFEL_ADD_DOMAIN_USER_API, user_object);
        }
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
