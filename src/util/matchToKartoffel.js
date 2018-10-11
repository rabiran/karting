const fn = require("../config/fieldNames");

/*
This module match the fields of given object to Kartoffel fields.

!!!
This version not include the fields:
    nv:
        fn.nv.uniqueId
        fn.nv.fullName
    aka:
        fn.aka.unitName
!!!
*/


module.exports = (obj) => {
    const objKeys = Object.keys(obj);
    objKeys.keys.map((rawKey)=>{
        switch(rawKey){
            //serviceType
            case fn.es.serviceType:
                obj.serviceType = obj[rawKey];
                delete obj[rawKey];
                break;
            case fn.aka.serviceType:
                obj.serviceType = (obj[rawKey] === "אעב" || obj[rawKey] === "אעצ")?"Civilian":"Soldier";
                delete obj[rawKey];
                break;
            //firstName
            case fn.aka.firstName || fn.es.firstName:
                obj.firstName = obj[rawKey];
                delete obj[rawKey];
                break;
            //lastName
            case fn.aka.lastName || fn.es.lastName:
                obj.lastName = obj[rawKey];
                delete obj[rawKey];
                break;
            //identityCard
            case fn.aka.identityCard || fn.es.identityCard:
                obj.identityCard =  obj[rawKey];
                delete obj[rawKey];
                break;
            //personalNumber
            case fn.aka.personalNumber || fn.es.personalNumber:
                obj.personalNumber = obj[rawKey];
                delete obj[rawKey];
                break;
            //rank
            case fn.aka.rank || fn.es.rank:
                obj.rank = obj[rawKey];
                delete obj[rawKey];  
                break;
            //phone
            case fn.es.phone:
                obj.phone = obj[rawKey];                
                delete obj[rawKey];
                break;
            case fn.aka.phone:
                obj.phone = `${obj[areaCode]}-${obj[rawKey]}`;                
                delete obj[rawKey];
                delete obj[areaCode];
                break;  
            // mobilePhone       
            case fn.aka.mobilePhone:
                obj.phone = `${obj[areaCodeMobile]}-${obj[rawKey]}`;                
                delete obj[rawKey];
                delete obj[areaCodeMobile];
                break;
            case fn.es.mobilePhone:
                obj.mobilePhone = obj[rawKey];
                delete obj[rawKey];
                break;
            // dischargeDay
            case fn.aka.dischargeDay || fn.es.dischargeDay:
                obj.dischargeDay = obj[rawKey];
                delete obj[rawKey];
                break;
            // hierarchy 
            case fn.nv.hierarchy || fn.es.hierarchy:
                obj.hierarchy = obj[rawKey];
                delete obj[rawKey];
                break;
            // clearance 
            case fn.aka.clearance:
                obj.clearance = obj[rawKey];
                delete obj[rawKey];
                break;
            // mail 
            case fn.es.mail:
                obj.mail = obj[rawKey];
                delete obj[rawKey];
                break;         
            // address 
            case fn.es.address:
                obj.address = obj[rawKey];
                delete obj[rawKey];
                break;       
            // job 
            case fn.es.job:
                obj.job = obj[rawKey];
                delete obj[rawKey];
                break;
            case fn.nv.uniqueId:
                let job = obj[fn.nv.hierarchy];
                obj.job = job[job.length-1];
                break;
            default:
                console.log("!! matchToKartoffel failed !!");
                console.log(obj);
        };
    });

    return obj;
};