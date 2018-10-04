const axios = require('axios');
const hierarchyHandler = require('../../util/hierarchyHandler');
const SaveCompleteDataLog = require('../../util/SaveCompleteDataLog');

module.exports = (es_data,aka_data)=>{
    // check if the person exist at aka and if so then adds the relevant fields
    let es_copmleteData = [];
    es_data.map((es_record) => {
        aka_data.map(async(aka_record)=>{
            let ifExist = Object.values(aka_record).indexOf(es_record.mi);
            if (ifExist != -1){
                // add the clearance from aka
                es_record.clearance = aka_record.clearance
                //edit field's name on es to match them to kartoffel API
                es_record.identityCard = es_record.tz;
                delete es_record.tz;
                es_record.personalNumber = es_record.mi;
                delete es_record.mi;               
                es_record.hierarchy = es_record.hr;
                delete es_record.hr;
                es_record.mobilePhone = es_record.cphone;
                delete es_record.cphone;
                es_record.phone = es_record.vphone;
                delete es_record.vphone;
                es_record.rank = es_record.rnk;
                delete es_record.rnk;
                es_record.dischargeDay = es_record.rld;
                delete es_record.rld;
                es_record.serviceType = es_record.stype;
                delete es_record.stype;
                es_record.job = es_record.tf;
                delete es_record.tf;
                es_record.primaryDomainUser = es_record.mail;
                delete es_record.mail;
                es_record.directGroup = await axios.get(process.env.KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API,es_record.hierarchy)
                .then((result)=>{
                    // This module accept person hierarchy and check if the hierarchy exit.
                    // If yes- the modue return the last hierarchy's objectID,
                    // else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
                    es_record.directGroup = hierarchyHandler(result.data);
                    }
                );

            }   
        })  
    });

    // save the complete data on the server
    let lastJsonName = SaveCompleteDataLog("es",es_copmleteData);

    return {
        copmleteData: es_copmleteData,
        lastJsonName:lastJsonName
    };
};