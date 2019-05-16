const fn = require("../config/fieldNames");
const validators = require('../config/validators');
const p = require("../config/paths");
const axios = require('axios');
const hierarchyHandler = require('./hierarchyHandler');
const logger = require('./logger');
require('dotenv').config();


const match_aka = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //entityType
            case fn.aka.entityType:
                obj.entityType = fn.entityTypeValue.s;
                (rawKey === "entityType") ? null : delete obj[rawKey];
                break;
            //firstName
            case fn.aka.firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.aka.lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn.aka.identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.aka.personalNumber:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //rank
            case fn.aka.rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn.aka.phone:
                validators().phone.test(`${obj[fn.aka.areaCode]}-${obj[rawKey]}`) ? obj.phone = [`${obj[fn.aka.areaCode]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn.aka.areaCode];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            // mobilePhone       
            case fn.aka.mobilePhone:
                validators().mobilePhone.test(`${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`) ? obj.mobilePhone = [`${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn.aka.areaCodeMobile];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            // dischargeDay
            case fn.aka.dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            // clearance 
            case fn.aka.clearance:
                obj.clearance = obj[rawKey];
                (rawKey === "clearance") ? null : delete obj[rawKey];
                break;
            // serviceType 
            case fn.aka.serviceType:
                obj.serviceType = obj[rawKey];
                (rawKey === "serviceType") ? null : delete obj[rawKey];
                break;
            // currentUnit
            case fn.aka.unitName:
                obj.currentUnit = obj[rawKey];
                (rawKey === "currentUnit") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];
        }
    });
}

const match_es = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //entityType
            case fn.es.entityType:
                obj.entityType = obj[rawKey];
                (rawKey === "entityType") ? null : delete obj[rawKey];
                break;
            //firstName
            case fn.es.firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.es.lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn.es.identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.es.personalNumber:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //rank
            case fn.es.rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn.es.phone:
                validators().phone.test(obj[rawKey]) ? obj.phone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            //mobilePhone       
            case fn.es.mobilePhone:
                validators().mobilePhone.test(obj[rawKey]) ? obj.mobilePhone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            //dischargeDay
            case fn.es.dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            //hierarchy 
            case fn.es.hierarchy:
                let hr = obj[rawKey].split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //mail 
            case fn.es.mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //address 
            case fn.es.address:
                obj.address = obj[rawKey];
                (rawKey === "address") ? null : delete obj[rawKey];
                break;
            //job 
            case fn.es.job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            // else
            default:
                delete obj[rawKey];
        };
    });
};

const match_ads = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn.ads.firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.ads.lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //job
            case fn.ads.job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            //mail
            case fn.ads.mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn.ads.hierarchy:
                let hr = obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //entityType,personalNumber/identityCard
            case fn.ads.upn:
                let re = /[a-z]_|[a-z]/;
                let upnPrefix = obj[rawKey].toLowerCase().match(re).toString();
                switch (upnPrefix) {
                    case fn.entityTypeValue.cPrefix:
                        obj.entityType = fn.entityTypeValue.c;
                        break;
                    case fn.entityTypeValue.sPrefix:
                        obj.entityType = fn.entityTypeValue.s;
                        break;
                    default:
                        logger.warn(`Not inserted entity type for the user with the upn ${obj[rawKey]} from ads`);
                }
                let identityCardCandidate = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0];
                (obj.entityType === fn.entityTypeValue.c && validators(identityCardCandidate).identityCard) ? obj.identityCard = identityCardCandidate.toString() : null;
                (obj.entityType === fn.entityTypeValue.s) ? obj.personalNumber = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0].toString() : null;
                (rawKey === "entityType" || rawKey === "identityCard" || rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};

const match_adNN = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn.adNN.firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.adNN.lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //mail
            case fn.adNN.mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy and job
            case fn.adNN.hierarchy:
                let hr = obj[rawKey].includes("\\") ? obj[rawKey].substring(0, obj[rawKey].lastIndexOf('\\')).trim().split('\\') : obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

                // Getting job
                if (obj[rawKey].includes("-")) {
                    if (obj[rawKey].includes("\\")) {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("\\") + 1).replace(/-/g, "").trim()
                    } else {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1).replace(/-/g, "").trim()
                    }
                    if (obj[rawKey].includes(obj[fn.adNN.fullName])) {
                        job = job.replace(obj[fn.adNN.fullName], "").trim()
                    }
                    obj.job = job
                }

                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber or identity card
            case fn.adNN.sAMAccountName:
                if (obj[rawKey].toLowerCase().includes(fn.adNN.extension)) {
                    uniqueNum = obj[rawKey].toLowerCase().replace(fn.adNN.extension, "")
                } else {
                    logger.warn(`User with id ${obj[rawKey]} is not ${fn.adNN.extension} extension`);
                    break;
                }
                if (validators(uniqueNum).identityCard) {
                    obj.identityCard = uniqueNum.toString();
                } else if (validators().personalNumber.test(uniqueNum)) {
                    obj.personalNumber = uniqueNum.toString();
                }

                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                (rawKey != "mail" && rawKey != fn.adNN.fullName) ? delete obj[rawKey] : null;

        }
    })
};

const match_nv_sql = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn.nv.firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.nv.lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn.nv.hierarchy:
                let hr = obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

                // Getting job
                obj.job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1);
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.nv.pn:
                validators().personalNumber.test(obj[rawKey]) ? obj.personalNumber = obj[rawKey].toString() : null;
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //identity vard
            case fn.nv.identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            default:
                (rawKey != "mail" && rawKey != fn.adNN.fullName) ? delete obj[rawKey] : null;

        }
    })
};

/**
 * This module accept person object and check if his hierarchy exit.
 * If yes- the module return the last hierarchy's objectID,
 * else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
 * 
 * @param {*} record Object of person after suitable to kartoffel structure
 * @returns objectID of the last hierarchy
 */
directGroupHandler = async (record) => {
    hr = encodeURIComponent(record.hierarchy)
    let directGroup;
    await axios.get(p(hr).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API)
        .then(async (result) => {
            let directGroupID = await hierarchyHandler(result.data, record.hierarchy);
            directGroup = directGroupID;
        })
        .catch((err) => {
            let identifier = record.identityCard || record.uniqueId;
            let errorMessage = (err.response) ? err.response.data : err.message;
            logger.error(`Faild to add directGroup to the person with the identityCard: ${identifier}. The error message:"${errorMessage}"`);
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
module.exports = async (origin_obj, dataSource) => {
    const obj = { ...origin_obj };
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null") ? delete obj[key] : null);
    switch (dataSource) {
        case "aka":
            match_aka(obj);
            break;
        case "es":
            match_es(obj);
            break;
        case "ads":
            match_ads(obj);
            if (!obj.entityType) {
                logger.warn(`To the person with the identifier: ${obj.mail} has not have "userPrincipalName" field at ads`);
            };
            break;
        case "adNN":
            match_adNN(obj);
            obj.entityType = fn.entityTypeValue.c // override the entitytype in completefromaka by checking if the object is exist in aka
            delete obj[fn.adNN.fullName];
            break;
        case "nvSQL":
            match_nv_sql(obj);
            obj.entityType = fn.entityTypeValue.c // override the entitytype in completefromaka by checking if the object is exist in aka
            break;
        default:
            logger.error("'dataSource' variable must be attached to 'matchToKartoffel' function");
    }


    if (obj.hierarchy && dataSource !== "aka") {
        obj.directGroup = await directGroupHandler(obj);
        delete obj.hierarchy;
    }

    return obj;
};
