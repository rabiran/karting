const fn = require("../config/fieldNames");
const p = require("../config/paths");
const axios = require('axios');
const hierarchyHandler = require('./hierarchyHandler');
const logger = require('./logger');
require('dotenv').config();
/*
This module match the fields of given object (raw_data) to Kartoffel fields structure.
*/

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
                obj.identityCard = obj[rawKey];
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.aka.personalNumber:
                obj.personalNumber = obj[rawKey];
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //rank
            case fn.aka.rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn.aka.phone:
                obj.phone = [`${obj[fn.aka.areaCode]}-${obj[rawKey]}`];
                delete obj[fn.aka.areaCode];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            // mobilePhone       
            case fn.aka.mobilePhone:
                obj.mobilePhone = [`${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`];
                delete obj[fn.aka.areaCodeMobile];
                (rawKey === "mobileuniqueIdhone") ? null : delete obj[rawKey];
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
            default:
                delete obj[rawKey];
        }
    });
}

const match_nv = (obj) => {
    const objKeys = Object.keys(obj);
    let source_hierarchy = obj[fn.nv.hierarchy];
    objKeys.map((rawKey) => {
        switch (rawKey) {
            // hierarchy 
            case fn.nv.hierarchy:
                let hr = source_hierarchy.split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                hr.splice((hr.length - 1), 1);
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            // job
            case fn.nv.uniqueId:
                let hrForJob;
                obj[fn.nv.hierarchy] ? hrForJob = obj[fn.nv.hierarchy] : hrForJob = source_hierarchy;
                let job = hrForJob.split('/');
                obj.job = job[job.length - 1];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            default:
                if (rawKey != "personalNumber" && rawKey != "mail") {
                    delete obj[rawKey];
                };
        };
    });
};

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
                obj.identityCard = obj[rawKey];
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.es.personalNumber:
                obj.personalNumber = obj[rawKey];
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //rank
            case fn.es.rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn.es.phone:
                obj.phone = [obj[rawKey]];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            //mobilePhone       
            case fn.es.mobilePhone:
                obj.mobilePhone = [obj[rawKey]];
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
                let hr = obj[rawKey].substring(0, obj[rawKey].indexOf('-')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                hr.splice((hr.length - 1), 1);
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
                (obj.entityType === fn.entityTypeValue.c) ? obj.identityCard = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0] : null;
                (obj.entityType === fn.entityTypeValue.s) ? obj.personalNumber = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0] : null;
                (rawKey === "entityType" || rawKey === "identityCard" || rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};

directGroupHandler = async (record, dataSource) => {
    hr = encodeURIComponent(record.hierarchy)
    let directGroup;
    await axios.get(p(hr).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API)
        .then(async (result) => {
            // This module accept person hierarchy and check if the hierarchy exit.
            // If yes- the modue return the last hierarchy's objectID,
            // else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
            let directGroupID = await hierarchyHandler(result.data, record.hierarchy);
            directGroup = directGroupID;

        })
        .catch((err) => {
            let identifyer = (dataSource === "nv") ? record.uniqueId : record.identityCard;
            let errorMessage = (err.response) ? err.response.data : err.message;
            logger.error(`Faild to add directGroup to the person with the identityCard: ${identifyer}. The error message:"${errorMessage}"`);
        });
    return directGroup;
};


module.exports = async (origin_obj, dataSource) => {
    const obj = {...origin_obj};
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => !obj[key] ? delete obj[key] : null);
    switch (dataSource) {
        case "aka":
            match_aka(obj);
            break;
        case "es":
            match_es(obj);
            break;
        case "nv":
            match_nv(obj);
            break;
        case "ads":
            match_ads(obj);
            break;
        default:
            logger.error("'dataSource' variable must be attached to 'matchToKartoffel' function");
    }


    if (obj.hierarchy && dataSource !== "aka") {
        obj.directGroup = await directGroupHandler(obj, dataSource);
        delete obj.hierarchy;
    }
    else {
        (dataSource !== "aka") ? logger.warn(`There is no hierarchy to the person: ${JSON.stringify(obj)}`) : null;
    }

    return obj;
};
