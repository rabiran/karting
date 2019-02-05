const fn = require('../config/fieldNames');
const logger = require('./logger');
/*
This module add fields from aka to given object.
*/

const complete_nv = (obj, akaData, dataSource) => {
    let complete = false;
    let akaRecord = akaData.find(person => person[fn.aka.personalNumber] == obj.personalNumber.toString());
    if (akaRecord) {
        complete = true;
        obj.identityCard = akaRecord[fn.aka.identityCard];
        obj.firstName = akaRecord[fn.aka.firstName];
        obj.lastName = akaRecord[fn.aka.lastName];
        obj.currentUnit = akaRecord[fn.aka.unitName];
        obj.rank = akaRecord[fn.aka.rank];
        akaRecord[fn.aka.phone] ? obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`] : null;
        akaRecord[fn.aka.mobilePhone] ? obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`] : null;
        obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
        obj.clearance = akaRecord[fn.aka.clearance];
        obj.entityType = fn.entityTypeValue.s;
    }
    if (!complete) { logger.warn(`The person with the personalNumber ${obj.personalNumber} from ${dataSource} not complete from aka`) };
};

const complete_es = (obj, akaData, dataSource) => {
    let complete = false;
    let akaRecord = akaData.find(person => person[fn.aka.identityCard] == obj.identityCard.toString());
    if (akaRecord) {
        complete = true;
        obj.clearance = akaRecord[fn.aka.clearance];
    }
    if (!complete) { logger.warn(`The person with the identityCard ${obj.identityCard} from ${dataSource} not complete from aka`) };
};

const complete_ads = (obj, akaData, dataSource) => {
    let complete = false;
    let akaRecord = akaData.find(person => person[fn.aka.personalNumber] == obj.personalNumber.toString());
    if (akaRecord) {
        complete = true;
        obj.identityCard = akaRecord[fn.aka.identityCard];
        obj.firstName = akaRecord[fn.aka.firstName];
        obj.lastName = akaRecord[fn.aka.lastName];
        obj.rank = akaRecord[fn.aka.rank];
        akaRecord[fn.aka.phone] ? obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`] : null;
        akaRecord[fn.aka.mobilePhone] ? obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`] : null;
        obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
        obj.clearance = akaRecord[fn.aka.clearance];
        obj.currentUnit = akaRecord[fn.aka.unitName];
    }
    if (!complete) { logger.warn(`The person with the identityCard ${obj.identityCard} from ${dataSource} not complete from aka`) };
}


module.exports = (obj, akaData, dataSource) => {
    switch (dataSource) {
        case "es":
            complete_es(obj, akaData, dataSource);
            break;
        case "nv":
            complete_nv(obj, akaData, dataSource);
            break;
        case "ads":
            if (obj.entityType === fn.entityTypeValue.c){break;};
            complete_ads(obj, akaData, dataSource);
            break;
        default:
            logger.error(`'dataSource' variable must be attached to 'completeFromAka' function`);
    }
    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key]==="null") ? delete obj[key] : null);
    return obj;
};
