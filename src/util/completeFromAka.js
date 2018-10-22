/*
This module add fields from aka to given object.
*/

const complete_nv = (obj) => {

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
            complete_es(obj,akaData.all);
            break;
        case "nv":
            complete_nv(obj,akaData.all);
            break;
        default:
            console.log("'dataSource' variable must be attached to 'completeFromAka' function");
    }

        return obj;
};

