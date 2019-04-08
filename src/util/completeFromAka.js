const fn = require('../config/fieldNames');
const validators = require('../config/validators');
const logger = require('./logger');
/*
This module add fields from aka to given object.
*/

const complete_es = (obj, akaRecord) => {
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.currentUnit = akaRecord[fn.aka.unitName];
}

const complete_ads = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    validators().phone.test(`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`) ? obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`] : null;
    validators().mobilePhone.test(`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`) ? obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`] : null;
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
}

const complete_adNN = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    validators().phone.test(`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`) ? obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`] : null;
    validators().mobilePhone.test(`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`) ? obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`] : null;
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.entityType = fn.entityTypeValue.s;
}

const complete_nv = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    validators().phone.test(`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`) ? obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`] : null;
    validators().mobilePhone.test(`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`) ? obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`] : null;
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.entityType = fn.entityTypeValue.s;
}


module.exports = (obj, akaData, dataSource) => {
    let identifier = obj.personalNumber || obj.identityCard;
    if (identifier) {
        let akaRecord = akaData.find(person => ((person[fn.aka.personalNumber] == identifier) || (person[fn.aka.identityCard] == identifier)));
        if (akaRecord) {
            switch (dataSource) {
                case "es":
                    complete_es(obj, akaRecord);
                    break;
                case "ads":
                    if (obj.entityType === fn.entityTypeValue.c) { break; };
                    complete_ads(obj, akaRecord);
                    break;
                case "adNN":
                    if (obj.entityType === fn.entityTypeValue.c) { break; };
                    complete_adNN(obj, akaRecord);
                    break;
                case "nvSQL":
                    complete_nv(obj, akaRecord);
                    break;
                default:
                    logger.error(`'dataSource' variable must be attached to 'completeFromAka' function`);
            }
        }
        else {
            logger.warn(`The person with the identifier ${identifier} from ${dataSource} not complete from aka`);
        }
    }

    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null") ? delete obj[key] : null);
    return obj;
};