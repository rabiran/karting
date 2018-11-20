const fn = require("../config/fieldNames");
const p = require("../config/paths");
const axios = require('axios');
const hierarchyHandler = require('./hierarchyHandler');
const logger = require('./logger');

/*
This module match the fields of given object (raw_data) to Kartoffel fields structure.
*/

const match_aka = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //serviceType
            case fn.aka.serviceType:
                obj.serviceType = fn.serviceTypeValue.s;
                (obj.hasOwnProperty("serviceType")) ? null : delete obj[rawKey];
                break;
            //firstName
            case fn.aka.firstName:
                obj.firstName = obj[rawKey];
                (obj.hasOwnProperty("firstName")) ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.aka.lastName:
                obj.lastName = obj[rawKey];
                (obj.hasOwnProperty("lastName")) ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn.aka.identityCard:
                obj.identityCard = obj[rawKey];
                (obj.hasOwnProperty("identityCard")) ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.aka.personalNumber:
                obj.personalNumber = obj[rawKey];
                (obj.hasOwnProperty("personalNumber")) ? null : delete obj[rawKey];
                break;
            //rank
            case fn.aka.rank:
                obj.rank = obj[rawKey];
                (obj.hasOwnProperty("rank")) ? null : delete obj[rawKey];
                break;
            //phone
            case fn.aka.phone:
                obj.phone = [`${obj[fn.aka.areaCode]}-${obj[rawKey]}`];
                delete obj[fn.aka.areaCode];
                (obj.hasOwnProperty("phone")) ? null : delete obj[rawKey];
                break;
            // mobilePhone       
            case fn.aka.mobilePhone:
                obj.mobilePhone = [`${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`];
                delete obj[fn.aka.areaCodeMobile];
                (obj.hasOwnProperty("mobileuniqueIdhone")) ? null : delete obj[rawKey];
                break;
            // dischargeDay
            case fn.aka.dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (obj.hasOwnProperty("dischargeDay")) ? null : delete obj[rawKey];
                break;
            // clearance 
            case fn.aka.clearance:
                obj.clearance = obj[rawKey];
                (obj.hasOwnProperty("clearance")) ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];
        }
    });
}

const match_nv = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            // hierarchy 
            case fn.nv.hierarchy:
                let hr = obj[rawKey].split('/');
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');
                (obj.hasOwnProperty("hierarchy")) ? null : delete obj[rawKey];
                break;
            // job
            case fn.nv.uniqueId:
                let hr;
                obj[fn.nv.hierarchy] ? hr = obj[fn.nv.hierarchy] : hr = obj["hierarchy"];
                let job = hr.split('/');
                obj.job = job[job.length - 1];
                (obj.hasOwnProperty("job")) ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];
        };
    });
};

const match_es = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //serviceType
            case fn.es.serviceType:
                obj.serviceType = obj[rawKey];
                (obj.hasOwnProperty("serviceType")) ? null : delete obj[rawKey];
                break;
            //firstName
            case fn.es.firstName:
                obj.firstName = obj[rawKey];
                (obj.hasOwnProperty("firstName")) ? null : delete obj[rawKey];
                break;
            //lastName
            case fn.es.lastName:
                obj.lastName = obj[rawKey];
                (obj.hasOwnProperty("lastName")) ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn.es.identityCard:
                obj.identityCard = obj[rawKey];
                (obj.hasOwnProperty("identityCard")) ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn.es.personalNumber:
                obj.personalNumber = obj[rawKey];
                (obj.hasOwnProperty("personalNumber")) ? null : delete obj[rawKey];
                break;
            //rank
            case fn.es.rank:
                obj.rank = obj[rawKey];
                (obj.hasOwnProperty("rank")) ? null : delete obj[rawKey];
                break;
            //phone
            case fn.es.phone:
                obj.phone = [obj[rawKey]];
                (obj.hasOwnProperty("phone")) ? null : delete obj[rawKey];
                break;
            //mobilePhone       
            case fn.es.mobilePhone:
                obj.mobilePhone = [obj[rawKey]];
                (obj.hasOwnProperty("mobilePhone")) ? null : delete obj[rawKey];
                break;
            //dischargeDay
            case fn.es.dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (obj.hasOwnProperty("dischargeDay")) ? null : delete obj[rawKey];
                break;
            //hierarchy 
            case fn.es.hierarchy:
                let hr = obj[rawKey].split('/');
                hr[0] === fn.rootHierarchy ? null : hr.unshift(fn.rootHierarchy);
                obj.hierarchy = hr.join("/");
                (obj.hasOwnProperty("hierarchy")) ? null : delete obj[rawKey];
                break;
            //mail 
            case fn.es.mail:
                obj.mail = obj[rawKey];
                (obj.hasOwnProperty("mail")) ? null : delete obj[rawKey];
                break;
            //address 
            case fn.es.address:
                obj.address = obj[rawKey];
                (obj.hasOwnProperty("address")) ? null : delete obj[rawKey];
                break;
            //job 
            case fn.es.job:
                obj.job = obj[rawKey];
                (obj.hasOwnProperty("job")) ? null : delete obj[rawKey];
                break;
            // else
            default:
                delete obj[rawKey];
        };
    });
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



module.exports = async (obj, dataSource) => {
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => !obj[key] ? delete obj[key] : '');
    switch (dataSource) {
        case "aka":
            match_aka(obj);
            obj.directGroup = await directGroupHandler(obj, dataSource);
            break;
        case "es":
            match_es(obj);
            obj.directGroup = await directGroupHandler(obj, dataSource);
            delete obj.hierarchy;
            break;
        case "nv":
            match_nv(obj);
            obj.directGroup = await directGroupHandler(obj, dataSource);
            delete obj.hierarchy;
            break;
        default:
            logger.error("'dataSource' variable must be attached to 'matchToKartoffel' function");
    }

    return obj;
};

