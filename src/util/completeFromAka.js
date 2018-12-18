const fn = require('../config/fieldNames');
const logger = require('./logger');
/*
This module add fields from aka to given object.
*/

const complete_nv = (obj, akaData, dataSource) => {
    complete = false;
    let akaRecord = akaData.find(person => person[fn.aka.personalNumber] === obj.personalNumber.toString());
    if (akaRecord) {
        complete = true;
        obj.identityCard = akaRecord[fn.aka.identityCard];
        obj.firstName = akaRecord[fn.aka.firstName];
        obj.lastName = akaRecord[fn.aka.lastName];
        obj.currentUnit = akaRecord[fn.aka.unitName];
        obj.rank = akaRecord[fn.aka.rank];
        obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`];
        obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`];
        obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
        obj.clearance = akaRecord[fn.aka.clearance];
        obj.entityType = fn.entityTypeValue.s;
    }
    if (!complete) { logger.warn(`The person with the personalNumber ${obj.personalNumber} from ${dataSource} not complete from aka`) };
};

const complete_es = (obj, akaData, dataSource) => {
    complete = false;
    let akaRecord = akaData.find(person => person[fn.aka.identityCard] === obj.identityCard.toString());
    if (akaRecord) {
        complete = true;
        obj.clearance = akaRecord[fn.aka.clearance];
    }
    if (!complete) { logger.warn(`The person with the identityCard ${obj.identityCard} from ${dataSource} not complete from aka`) };
};




module.exports = (obj, akaData, dataSource) => {
    switch (dataSource) {
        case "es":
            complete_es(obj, akaData, dataSource);
            break;
        case "nv":
            complete_nv(obj, akaData, dataSource);
            break;
        default:
            logger.error(`'dataSource' variable must be attached to 'completeFromAka' function`);
    }
    return obj;
};
