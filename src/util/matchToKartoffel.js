const fn = require("../config/fieldNames");
const validators = require('../config/validators');
const p = require("../config/paths");
const hierarchyHandler = require('./fieldsUtils/hierarchyHandler');
const { sendLog, logLevel } = require('./logger');
const logDetails = require('../util/logDetails');
const Auth = require('../auth/auth');
const formatAkaDateToKartoffel = require('./fieldsUtils/formatAkaDateToKartoffel');
const isNumeric = require('./generalUtils/isNumeric');
const isStrContains = require('./generalUtils/strignContains');
const trycatch = require('./generalUtils/trycatch');
require('dotenv').config();


const match_aka = async (obj, dataSource, flowType) => {
    const objKeys = Object.keys(obj);
    await Promise.all(objKeys.map(async rawKey => {
        switch (rawKey) {
            //entityType
            case fn[dataSource].entityType:
                obj.entityType = fn.entityTypeValue.s;
                (rawKey === "entityType") ? null : delete obj[rawKey];
                break;
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].personalNumber:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //rank
            case fn[dataSource].rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn[dataSource].phone:
                validators().phone.test(`${obj[fn[dataSource].areaCode]}-${obj[rawKey]}`) ? obj.phone = [`${obj[fn[dataSource].areaCode]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn[dataSource].areaCode];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            // mobilePhone
            case fn[dataSource].mobilePhone:
                validators().mobilePhone.test(`${obj[fn[dataSource].areaCodeMobile]}-${obj[rawKey]}`) ? obj.mobilePhone = [`${obj[fn[dataSource].areaCodeMobile]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn[dataSource].areaCodeMobile];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            // dischargeDay
            case fn[dataSource].dischargeDay:
                obj.dischargeDay = formatAkaDateToKartoffel(obj[rawKey]);
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            // clearance
            case fn[dataSource].clearance:
                obj.clearance = obj[rawKey];
                (rawKey === "clearance") ? null : delete obj[rawKey];
                break;
            // serviceType
            case fn[dataSource].serviceType:
                obj.serviceType = obj[rawKey];
                (rawKey === "serviceType") ? null : delete obj[rawKey];
                break;
            // currentUnit
            case fn[dataSource].unitName:
                obj.currentUnit = obj[rawKey];

                if (flowType === fn.flowTypes.add) {
                    const tryFindGroupByUnit = await trycatch(
                        Auth.axiosKartoffel.get,
                        p(encodeURIComponent(obj[rawKey])).KARTOFFEL_GROUP_BY_AKA_UNIT
                    );

                    if (tryFindGroupByUnit.err) {
                        sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_FIND_GROUP_BY_AKA_UNIT,
                            obj[rawKey]
                        );
                        break;
                    }

                    const groupByAka = tryFindGroupByUnit.result.data;

                    obj.hierarchy = [
                        ...groupByAka.hierarchy,
                        groupByAka.name,
                        fn.organizationGroups.incompletes_name,
                    ].join('/');
                }

                (rawKey === "currentUnit") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];
        }
    }));

    obj.entityType = fn.entityTypeValue.s;
}

const match_es = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //entityType
            case fn[dataSource].entityType:
                obj.entityType = obj[rawKey];
                (rawKey === "entityType") ? null : delete obj[rawKey];
                break;
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //identityCard
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].personalNumber:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            // rank
            case fn[dataSource].rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn[dataSource].phone:
                validators().phone.test(obj[rawKey]) ? obj.phone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            //mobilePhone
            case fn[dataSource].mobilePhone:
                validators().mobilePhone.test(obj[rawKey]) ? obj.mobilePhone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            //dischargeDay
            case fn[dataSource].dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //address
            case fn[dataSource].address:
                obj.address = obj[rawKey];
                (rawKey === "address") ? null : delete obj[rawKey];
                break;
            //job
            case fn[dataSource].job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            // else
            default:
                delete obj[rawKey];
        };
    });
};

const match_ads = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //job
            case fn[dataSource].job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //entityType,personalNumber/identityCard
            case fn[dataSource].upn:
                let upnPrefix = '';
                for (let char of obj[fn[dataSource].upn].toLowerCase().trim()) {
                    if (isNumeric(char) === false) {
                        upnPrefix = upnPrefix + char;
                    } else {
                        break;
                    }
                }
                switch (upnPrefix) {
                    case fn[dataSource].cPrefix:
                        obj.entityType = fn.entityTypeValue.c;
                        break;
                    case fn[dataSource].sPrefix:
                        obj.entityType = fn.entityTypeValue.s;
                        break;
                    case fn[dataSource].guPrefix:
                        obj.entityType = fn.entityTypeValue.gu;
                        obj.domainUsers = [
                            {
                                uniqueID: `${obj[fn[dataSource].domainPrefixField].toLowerCase()}${fn[dataSource].domainSuffix}`,
                                dataSource
                            }
                        ];
                        obj.firstName = fn[dataSource].guName;
                        break;
                    default:
                        sendLog(logLevel.warn, logDetails.warn.WRN_NOT_INSERTED_ENTITY_TYPE, obj[rawKey]);
                }
                let identityCardCandidate = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0].toString();
                (obj.entityType === fn.entityTypeValue.c && validators(identityCardCandidate).identityCard) ? obj.identityCard = identityCardCandidate : null;
                (obj.entityType === fn.entityTypeValue.s) ? obj.personalNumber = identityCardCandidate : null;
                (rawKey === "entityType" || rawKey === "identityCard" || rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};

const match_adNN = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy and job
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].includes("\\") ? obj[rawKey].substring(0, obj[rawKey].lastIndexOf('\\')).trim().split('\\') : obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

                // Getting job
                if (obj[rawKey].includes("-")) {
                    if (obj[rawKey].includes("\\")) {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("\\") + 1).replace(/-/g, "").trim()
                    } else {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1).replace(/-/g, "").trim()
                    }
                    if (obj[rawKey].includes(obj[fn[dataSource].fullName])) {
                        job = job.replace(obj[fn[dataSource].fullName], "").trim()
                    }
                    obj.job = job
                }

                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber or identity card
            case fn[dataSource].sAMAccountName:
                if (obj[rawKey].toLowerCase().includes(fn[dataSource].extension)) {
                    uniqueNum = obj[rawKey].toLowerCase().replace(fn[dataSource].extension, "")
                } else {
                    sendLog(logLevel.warn, logDetails.warn.WRN_USER_NOT_EXTENTION, obj[rawKey], fn[dataSource].extension);
                    break;
                }
                if (validators(uniqueNum).identityCard) {
                    obj.identityCard = uniqueNum.toString();
                } else {
                    obj.personalNumber = uniqueNum.toString();
                }

                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                (rawKey != "mail" && rawKey != fn[dataSource].fullName) ? delete obj[rawKey] : null;

        }
    })
};

const match_nv_sql = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

                // Getting job
                obj.job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1);
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].pn:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //identity card
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};

const match_city = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    // initialize variables for hierarchy matching and define default hierarchy
    const defaultHierarchy = `${fn.rootHierarchy.city}${obj[fn[dataSources].company] ? '/' + obj[fn[dataSources].company] : ''}`;
    obj.hierarchy = defaultHierarchy;
    // suitable the structure of the fieds to kartoffel standart
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //rank
            case fn[dataSource].rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            // dischargeDay
            case fn[dataSource].dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            // clearance
            case fn[dataSource].clearance:
                obj.clearance = obj[rawKey];
                (rawKey === "clearance") ? null : delete obj[rawKey];
                break;
            // currentUnit
            case fn[dataSource].currentUnit:
                obj.currentUnit = obj[rawKey].toString().replace(new RegExp("\"", 'g'), " ");
                (rawKey === "currentUnit") ? null : delete obj[rawKey];
                break;
            // serviceType
            case fn[dataSource].serviceType:
                obj.serviceType = obj[rawKey];
                (rawKey === "serviceType") ? null : delete obj[rawKey];
                break;
            //mobilePhone
            case fn[dataSource].mobilePhone:
                validators().mobilePhone.test(obj[rawKey]) ? obj.mobilePhone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            //address
            case fn[dataSource].address:
                obj.address = obj[rawKey];
                (rawKey === "address") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //job
            case fn[dataSource].profession:
            case fn[dataSource].job:
                if (!obj.job) {
                    obj.job = obj[fn[dataSource].job] || obj[fn[dataSource].profession];
                }

                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].replace('\\', '/');
                if (hr.includes('/')) {
                    hr = hr.split('/').map(unit => unit.trim());

                    for (const [index, value] of hr.entries()) {
                        if (isStrContains(value, [`${obj[fn[dataSource].firstName]} ${obj[fn[dataSource].lastName]}`, '-']) || !value) {
                            hr.splice(index);
                            break;
                        }
                    }

                    // this condition come to fix insertion of "defaultHierarchy" to user that come from our "enviroment" to
                    // city "enviroment" and than return to us from city API. Can delete this code after stable the specific problem
                    // of "fn.rootHierarchy.city/fn.rootHierarchy.city/fn.rootHierarchy.city.."
                    if (hr[0] === fn.rootHierarchy.city) {
                        let tempCityCount = 0;
                        for (value of hr) {
                            if (value === fn.rootHierarchy.city) {
                                tempCityCount += 1;
                            } else {
                                break;
                            }
                        }
                        hr.splice(0, tempCityCount - 1);
                    }

                    hr = hr.join('/');
                }
                // this condition come to avoid insertion of "defaultHierarchy" to user that come from our "enviroment" to
                // city "enviroment" and than return to us from city API
                if (hr.includes(fn.rootHierarchy.city)) {
                    if (hr.includes(defaultHierarchy)) {
                        obj.hierarchy = hr;
                    } else {
                        if (hr.startsWith(fn.rootHierarchy.city)) {
                            obj.hierarchy = hr.replace(fn.rootHierarchy.city, defaultHierarchy);
                        }
                    }
                } else {
                    obj.hierarchy = `${defaultHierarchy}${hr.includes('/') ? '/' + hr : ''}`;
                }
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            // entityType & and default identityCard / personlNumber
            case fn[dataSource].domainUsers:
                // initialize values for identityCard & personalNumber
                let rawEntityType;
                let defaultIdentifier;
                for (const [index, char] of Array.from(obj[rawKey].toLowerCase().trim()).entries()) {
                    if ((index === 0 && isNumeric(char)) ||
                        (index === 1 && !isNumeric(char))) {
                        break;
                    }
                    if (index === 0) {
                        rawEntityType = char;
                    } else if (!isNumeric(char)) {
                        defaultIdentifier = obj[rawKey].substring(1, index);
                        break;
                    }
                }
                // set the entityType
                if (fn[dataSource].entityTypePrefix.s.includes(rawEntityType)) {
                    obj.entityType = fn.entityTypeValue.s;
                }
                else if (fn[dataSource].entityTypePrefix.c.includes(rawEntityType)) {
                    obj.entityType = fn.entityTypeValue.c;
                }
                else if (fn[dataSource].entityTypePrefix.gu.includes(rawEntityType)) {
                    obj.entityType = fn.entityTypeValue.gu;
                    obj.domainUsers = [
                        {
                            uniqueID: obj[fn[dataSource].domainUsers].toLowerCase(),
                            dataSource
                        }
                    ];
                }

                if (obj.entityType !== fn.entityTypeValue.gu) {
                    // set identityCard || personlNumber if needed
                    if (!obj.hasOwnProperty('identityCard') ||
                        !obj.hasOwnProperty('personalNumber') ||
                        !obj.hasOwnProperty(fn[dataSource].identityCard) ||
                        !obj.hasOwnProperty(fn[dataSource].personalNumber)) {
                        validators(defaultIdentifier).identityCard ? obj.identityCard = defaultIdentifier : obj.personalNumber = defaultIdentifier;
                    }
                }

                delete obj[rawKey];
                break;
            //identityCard
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].personalNumber:
                obj.personalNumber = obj[rawKey];
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};

/**
 * This module accept person object and check if his hierarchy exit.
 * If yes- the module return the last hierarchy's objectID,
 * else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
 *
 * @param {*} obj Object of person after suitable to kartoffel structure
 * @returns objectID of the last hierarchy
 */
directGroupHandler = async obj => {
    hr = encodeURIComponent(obj.hierarchy)
    let directGroup;
    await Auth.axiosKartoffel.get(p(hr).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API)
        .then(async (result) => {
            let directGroupID = await hierarchyHandler(result.data, obj.hierarchy);
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
module.exports = async (origin_obj, dataSource, flowType) => {
    const obj = { ...origin_obj };
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null" || obj[key] === "לא ידוע") ? delete obj[key] : null);
    switch (dataSource) {
        case fn.dataSources.aka:
            await match_aka(obj, dataSource, flowType);
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
        
        obj.directGroup = await directGroupHandler(obj);
        delete obj.hierarchy;
    }

    return obj;
};
