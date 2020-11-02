const fn = require("../../config/fieldNames");
const p = require("../../config/paths");
const hierarchyHandler = require('../fieldsUtils/hierarchyHandler');
const logDetails = require('../../util/logDetails');
const { logLevel } = require('../logger');

require('dotenv').config();

const match_aka = require('./match_aka');
const match_es = require('./match_es');
const match_ads = require('./match_ads');
const match_adNN = require('./match_adNN');
const match_nv_sql = require('./match_nv_sql');
const match_city = require('./match_city');

let sendLog;

/**
 * This module accept person object and check if his hierarchy exit.
 * If yes- the module return the last hierarchy's objectID,
 * else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
 *
 * @param {*} obj Object of person after suitable to kartoffel structure
 * @returns objectID of the last hierarchy
 */
directGroupHandler = async (obj, Auth) => {
    hr = encodeURIComponent(obj.hierarchy)
    let directGroup;
    await Auth.axiosKartoffel.get(p(hr).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API)
        .then(async (result) => {
            let directGroupID = await hierarchyHandler(result.data, obj.hierarchy, Auth, sendLog);
            directGroup = directGroupID;
        })
        .catch((err) => {
            let identifier = obj.identityCard || obj.uniqueId;
            let errorMessage = (err.response) ? err.response.data.message : err.message;
            sendLog(logLevel.error, logDetails.error.ERR_ADD_DIRECT_GROUP_TO_PERSON, identifier, errorMessage);
        });
    return directGroup;
};

/**
 *This module match the fields of given person object from the raw data to Kartoffel fields structure according to its dataSource
 *and build his hierarchy if needed
 *
 * @param {*} origin_obj raw object of person from specific dataSource
 * @param {*} dataSource the dataSource of the raw person object
 * @returns person object according to the structure of kartoffel
 */
module.exports = async (origin_obj, dataSource, Auth, defaultSendLog, flowType) => {
    defaultSendLog ? sendLog = defaultSendLog : null;

    const obj = { ...origin_obj };
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null" || obj[key] === "לא ידוע") ? delete obj[key] : null);
    switch (dataSource) {
        case fn.dataSources.aka:
            await match_aka(obj, dataSource, flowType, Auth);
            break;
        case fn.dataSources.es:
            match_es(obj, dataSource);
            break;
        case fn.dataSources.ads:
            match_ads(obj, dataSource);
            if (!obj.entityType) {
                sendLog(logLevel.warn, logDetails.warn.WRN_PERSON_HAS_NOT_HAVE_USERPRINCIPALNAME, obj.mail);
            };
            break;
        case fn.dataSources.adNN:
            match_adNN(obj, dataSource);
            obj.entityType = fn.entityTypeValue.c // override the entitytype in completefromaka by checking if the object is exist in aka
            delete obj[fn[dataSource].fullName];
            break;
        case fn.dataSources.mdn:
        case fn.dataSources.mm:
        case fn.dataSources.lmn:
            match_nv_sql(obj, dataSource);
            obj.entityType = fn.entityTypeValue.c // override the entitytype in completefromaka by checking if the object is exist in aka
            break;
        case fn.dataSources.city:
            match_city(obj, dataSource);
            if (obj.entityType === fn.entityTypeValue.gu) {
                obj.personalNumber ? delete obj['personalNumber'] : null;
                obj.identityCard ? delete obj['identityCard'] : null;
            }
            break;
        default:
            sendLog(logLevel.error, logDetails.error.ERR_UNIDENTIFIED_DATA_SOURCE);
    }


    if (obj.hierarchy) {
        
        obj.directGroup = await directGroupHandler(obj, Auth);
        
        delete obj.hierarchy;
    }

    return obj;
};
