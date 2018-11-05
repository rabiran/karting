const fn = require('../config/fieldNames');
const logger = require('./logger');
/*
This module add fields from aka to given object.
*/

const complete_nv = (obj, akaData) => {
    akaData.map((akaRecord)=>{
        let ifExist = Object.values(akaRecord).indexOf(obj.personalNumber);
        if (ifExist != -1 && obj.personalNumber){
            // add fields from aka
            obj.identityCard = akaRecord[fn.aka.identityCard];
            obj.firstName = akaRecord[fn.aka.firstName];
            obj.lastName = akaRecord[fn.aka.lastName];
            obj.currentUnit = akaRecord[fn.aka.unitName];
            obj.rank = akaRecord[fn.aka.rank];
            obj.phone = [`${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`];
            obj.mobilePhone = [`${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`];
            obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
            obj.clearance = akaRecord[fn.aka.clearance];
            obj.serviceType = fn.serviceTypeValue.s;
        }
    }) 
};

const complete_es = (obj,akaData) => {
    akaData.map((akaRecord)=>{
        let ifExist = Object.values(akaRecord).indexOf(obj.identityCard);
        if (ifExist != -1){
            // add the clearance from aka
            obj.clearance = akaRecord.clearance;
        }
    })    
};


module.exports = (obj, akaData, dataSource) => {
        
    switch(dataSource){
        case "es":
            complete_es(obj,akaData);
            break;
        case "nv":
            complete_nv(obj,akaData);
            break;
        default:
            logger.error(`'dataSource' variable must be attached to 'completeFromAka' function`);
    }

        return obj;
};

