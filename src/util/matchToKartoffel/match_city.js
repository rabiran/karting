const fn = require("../../config/fieldNames");
const isStrContains = require('../generalUtils/strignContains');
const isNumeric = require('../generalUtils/isNumeric');
const validators = require('../../config/validators');

module.exports = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    // initialize variables for hierarchy matching and define default hierarchy
    const defaultHierarchy = `${fn.rootHierarchy.city}${obj[fn[dataSource].company] ? '/' + obj[fn[dataSource].company] : ''}`;
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
                    let fullNameRegex = new RegExp(`${obj[fn[dataSource].firstName]}( |\t)+${obj[fn[dataSource].lastName]}`);
                    for (const [index, value] of hr.entries()) {
                        if (isStrContains(value, ['-']) || fullNameRegex.test(value) || !value) {
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