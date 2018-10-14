const fn = require("../config/fieldNames");

/*
This module match the fields of given object to Kartoffel fields structure.

*/

const match_aka = (objKeys,obj) => {
    objKeys.map((rawKey)=>{
        switch(rawKey){
            //serviceType
            case fn.aka.serviceType:
                if(obj.hasOwnProperty("serviceType")){
                    (obj[rawKey] === "אעב" || obj[rawKey] === "אעצ") ? obj.serviceType = fn.serviceTypeValue.c : obj.serviceType = fn.serviceTypeValue.s;
                }else{
                    (obj[rawKey] === "אעב" || obj[rawKey] === "אעצ") ? obj.serviceType = fn.serviceTypeValue.c : obj.serviceType = fn.serviceTypeValue.s;
                    delete obj[rawKey];
                };
                break;
            //firstName
            case fn.aka.firstName:
                if(obj.hasOwnProperty("firstName")){
                    obj.firstName = obj[rawKey];
                }else{
                    obj.firstName = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //lastName
            case fn.aka.lastName:   
                if(obj.hasOwnProperty("lastName")){
                    obj.lastName = obj[rawKey];
                }else{
                    obj.lastName = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //identityCard
            case fn.aka.identityCard:
                if(obj.hasOwnProperty("identityCard")){
                    obj.identityCard = obj[rawKey];
                }else{
                    obj.identityCard = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //personalNumber
            case fn.aka.personalNumber:
                if(obj.hasOwnProperty("personalNumber")){
                    obj.personalNumber = obj[rawKey];
                }else{
                    obj.personalNumber = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //rank
            case fn.aka.rank:
                if(obj.hasOwnProperty("rank")){
                    obj.rank = obj[rawKey];
                }else{
                    obj.rank = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //phone
            case fn.aka.phone:
                if(obj.hasOwnProperty("phone")){                   
                    obj.phone = `${obj[fn.aka.areaCode]}-${obj[rawKey]}`;                
                    delete obj[fn.aka.areaCode];
                }else{
                    obj.phone = `${obj[fn.aka.areaCode]}-${obj[rawKey]}`;                
                    delete obj[rawKey];
                    delete obj[fn.aka.areaCode];
                };
                break;
            // mobilePhone       
            case fn.aka.mobilePhone:
                if(obj.hasOwnProperty("mobilePhone")){                   
                    obj.mobilePhone = `${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`;                
                    delete obj[fn.aka.areaCodeMobile];
                }else{
                    obj.mobilePhone = `${obj[fn.aka.areaCodeMobile]}-${obj[rawKey]}`;                
                    delete obj[rawKey];
                    delete obj[fn.aka.areaCodeMobile];
                };
                break;
            // dischargeDay
            case fn.aka.dischargeDay:
                if(obj.hasOwnProperty("dischargeDay")){
                    obj.dischargeDay = obj[rawKey];
                }else{
                    obj.dischargeDay = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            // clearance 
            case fn.aka.clearance:
                if(obj.hasOwnProperty("clearance")){
                    obj.clearance = obj[rawKey];
                }else{
                    obj.clearance = obj[rawKey];
                    delete obj[rawKey];
                };
                break;  
            default:
                delete obj[rawKey]; 
        }
    });
}

const match_nv = (objKeys,obj) => {
    objKeys.map((rawKey)=>{
        switch(rawKey){   
            // hierarchy 
            case fn.nv.hierarchy:
                if(obj.hasOwnProperty("hierarchy")){
                    obj.hierarchy = obj[rawKey];
                }else{
                    obj.hierarchy = obj[rawKey];
                    delete obj[rawKey];
                };    
            break;
            // job
            case fn.nv.uniqueId:
                if(obj.hasOwnProperty("uniqueId")){
                    let job = obj[fn.nv.hierarchy].split('/');
                    obj.job = job[job.length-1];
                }else{
                    let job = obj[fn.nv.hierarchy].split('/');
                    obj.job = job[job.length-1];
                    delete obj[rawKey];
                };  
                break;
            default:
                delete obj[rawKey];
        };
    });
};

const match_es = (objKeys,obj) => {
    objKeys.map((rawKey)=>{
        switch(rawKey){
           
            //serviceType
            case fn.es.serviceType:
                if(obj.hasOwnProperty("serviceType")){
                    obj.serviceType = obj[rawKey];
                }else{
                    obj.serviceType = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //firstName
            case fn.es.firstName:
                if(obj.hasOwnProperty("firstName")){
                    obj.firstName = obj[rawKey];
                }else{
                    obj.firstName = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //lastName
            case fn.es.lastName:
                if(obj.hasOwnProperty("lastName")){
                    obj.lastName = obj[rawKey];
                }else{
                    obj.lastName = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //identityCard
            case fn.es.identityCard:
                if(obj.hasOwnProperty("identityCard")){
                    obj.identityCard = obj[rawKey];
                }else{
                    obj.identityCard = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //personalNumber
            case fn.es.personalNumber:
                if(obj.hasOwnProperty("personalNumber")){
                    obj.personalNumber = obj[rawKey];
                }else{
                    obj.personalNumber = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //rank
            case fn.es.rank:
                if(obj.hasOwnProperty("rank")){
                    obj.personalNumber = obj[rawKey];
                }else{
                    obj.personalNumber = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //phone
            case fn.es.phone:
                if(obj.hasOwnProperty("phone")){
                    obj.phone = obj[rawKey];
                }else{
                    obj.phone = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //mobilePhone       
            case fn.es.mobilePhone:
                if(obj.hasOwnProperty("mobilePhone")){
                    obj.mobilePhone = obj[rawKey];
                }else{
                    obj.mobilePhone = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //dischargeDay
            case fn.es.dischargeDay:
                if(obj.hasOwnProperty("dischargeDay")){
                    obj.dischargeDay = obj[rawKey];
                }else{
                    obj.dischargeDay = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //hierarchy 
            case fn.es.hierarchy:
                if(obj.hasOwnProperty("hierarchy")){
                    obj.hierarchy = obj[rawKey];
                }else{
                    obj.hierarchy = obj[rawKey];
                    delete obj[rawKey];
                };
                break;
            //mail 
            case fn.es.mail:
                if(obj.hasOwnProperty("mail")){
                    obj.hierarchy = obj[rawKey];
                }else{
                    obj.hierarchy = obj[rawKey];
                    delete obj[rawKey];
                };
                break;       
            //address 
            case fn.es.address:
                if(obj.hasOwnProperty("address")){
                    obj.address = obj[rawKey];
                }else{
                    obj.address = obj[rawKey];
                    delete obj[rawKey];
                };
                break;      
            //job 
            case fn.es.job:
                if(obj.hasOwnProperty("job")){
                    obj.address = obj[rawKey];
                }else{
                    obj.address = obj[rawKey];
                    delete obj[rawKey];
                };
                break;  
            default:
                delete obj[rawKey]; 
        };
    });
};


module.exports = (obj, dataSource) => {
    
    const objKeys = Object.keys(obj);
    
    switch(dataSource){
        case "aka":
            match_aka(objKeys,obj);
            break;
        case "es":
            match_es(objKeys,obj);
            break;
        case "nv":
            match_nv(objKeys,obj);
            break;
        default:
            console.log("'dataSource' variable must be attached to 'matchToKartoffel' function");
    }

        return obj;
};

