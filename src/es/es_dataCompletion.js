const axios = require('axios');
const hierarchyHandler = require('../util/hierarchyHandler');
const saveAsFile = require('../util/saveAsFile');

module.exports = async(es_data,aka_data)=>{
    // check if the person exist at aka and if so then adds the relevant fields
    let es_completeData = [];
    for (es_record of es_data){
    // es_data.map((es_record) => {
        for (aka_record of aka_data){
        // aka_data.map(async(aka_record)=>{
            let ifExist = Object.values(aka_record).indexOf(es_record.mi);
            if (ifExist != -1){
                // add the clearance from aka
                es_record.clearance = aka_record.clearance
             
                // es_record.primaryDomainUser = es_record.mail;
                // delete es_record.mail;


                // es_record.directGroup = await axios.get(process.env.KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API,es_record.hierarchy)
                // .then((result)=>{
                //     // This module accept person hierarchy and check if the hierarchy exit.
                //     // If yes- the modue return the last hierarchy's objectID,
                //     // else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
                //     let directGroupID = hierarchyHandler(result.data);
                //     return directGroupID
                //     }
                // );


                
                // add the update record to new array that will returm from this module
                es_completeData.push(es_record); 
            }   
        }  
    };

    // save the complete data on the server
    let lastJsonName = saveAsFile(es_completeData,'./data/es/completeData','es_completeData');

    return {
        completeData: es_completeData,
        lastJsonName: lastJsonName
    };
};
