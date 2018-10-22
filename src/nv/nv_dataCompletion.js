const axios = require('axios');
const hierarchyHandler = require('../util/hierarchyHandler');
const saveAsFile = require('../util/saveAsFile');


module.exports = async(nv_data,aka_data)=>{    
    let nv_copmleteData = [];
    // complete the field for each person at nv from AKA
    for (nv_record of nv_data){
        // complete the uniqe fields from ad
        
        /*
         * 
         * need to complete this field from our enviroments
         * 
         */
        //temporary workaround tp generate 'mi':
        // send array of users and get the users with mi and email address
        if (nv_record.uniqueId == "fshallcroff0@phpbb.com"){
            nv_record.personalNumber = 55579169;
            nv_record.primaryDomainUser = "primary@phpbb.com";

        }else{
            nv_record.mi = Math.floor(10000000 + Math.random() * 900000);
        }
        
         // check if the person exist at aka and if so then adds the relevant fields
        for (aka_record of aka_data){
        // aka_data.map((aka_record) => {
            let ifExist = Object.values(aka_record).indexOf(nv_record.personalNumber);
            if (ifExist != -1){
                // add the fields from aka
                // nv_record.identityCard = aka_record.tz;
                // nv_record.firstName = aka_record.firstName;
                // nv_record.lastName = aka_record.lastName;
                // nv_record.currentUnit = aka_record.hr;
                // nv_record.rank = aka_record.nrnk;
                // nv_record.phone = `${aka_record.ktelephone}-${aka_record.telephone}`;
                // nv_record.mobilePhone = `${aka_record.kmobile}-${aka_record.mobile}`;
                // nv_record.dischargeDay = aka_record.rld;
                // nv_record.clearance = aka_record.clearance;
                // nv_record.serviceType = (aka_record.nstype === "אעב" || aka_record.nstype === "אעצ")?"Civilian":"Soldier";

                //edit field's name on nv to match them to kartoffel API
                nv_record.hierarchy = nv_record.hr;
                delete nv_record.hr;
                nv_record.primaryDomainUser  = nv_record.uniqueId;
                nv_record.secondaryDomainUsers = nv_record.uniqueId;
                delete nv_record.uniqueId;
                let job = nv_record.hierarchy.split('/');
                nv_record.job = job[job.length-1];
                nv_record.directGroup =await axios.get(process.env.KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API,nv_record.hierarchy)
                .then((result)=>{
                    // This module accept person hierarchy and check if the hierarchy exit.
                    // If yes- the modue return the last hierarchy's objectID,
                    // else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
                    let directGroupID = hierarchyHandler(result.data);
                    return directGroupID
                    }
                );
                              
                // add the update record to new array that will returm from this module
                nv_copmleteData.push(nv_record);          
            }   
        } 
    };

    // save the complete data on the server
    let lastJsonName = saveAsFile(nv_copmleteData,'./data/nv/completeData','nv_completeData');

    return {
        copmleteData:nv_copmleteData,
        lastJsonName:lastJsonName
    };
};