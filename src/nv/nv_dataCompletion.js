var fs = require('fs');
const moment = require("moment");

module.exports = (nv_data,aka_data)=>{    
    let nv_copmleteData = [];
    nv_data.map(nv_record => {
        // complete the uniqe fields from ad
        
        /*
         * 
         * need to complete this field from our enviroments
         * 
         */
        //temporary workaround tp generate 'mi':
        if (nv_record.uniqueId == "fshallcroff0@phpbb.com"){
            nv_record.personalNumber = 55579169;
            nv_record.primaryDomainUser = "primary@phpbb.com";

        }else{
            nv_record.mi = Math.floor(10000000 + Math.random() * 900000);
        }
        
         // check if the person exist at aka and if so then adds the relevant fields
        aka_data.map(aka_record => {
            let ifExist = Object.values(aka_record).indexOf(nv_record.personalNumber);
            if (ifExist != -1){
                // add the fields from aka
                nv_record.identityCard = aka_record.tz;
                nv_record.firstName = aka_record.firstName;
                nv_record.lastName = aka_record.lastName;
                nv_record.currentUnit = aka_record.hr;
                nv_record.rank = aka_record.nrnk;
                nv_record.phone = `${aka_record.ktelephone}-${aka_record.telephone}`;
                nv_record.mobilePhone = `${aka_record.kmobile}-${aka_record.mobile}`;
                nv_record.dischargeDay = aka_record.rld;
                nv_record.clearance = aka_record.clearance;
                nv_record.serviceType = (aka_record.nstype === "אעב" || aka_record.nstype === "אעצ")?"Civilian":"Soldier";

                //edit field's name on nv to match them to kartoffel API
                nv_record.hierarchy = nv_record.hr;
                delete nv_record.hr;
                nv_record.secondaryDomainUsers = nv_record.uniqueId;
                delete nv_record.uniqueId;
                let job = nv_record.hierarchy.split('/');
                nv_record.job = job[job.length-1];
                
                
                // add the update record to new array that will returm from this module
                nv_copmleteData.push(nv_record);          
            }   
        }) 
    });

   // save the complete data on the server
   const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
   const files = fs.readdirSync('./data/nv/completeData/')
   try{
       fs.writeFileSync(`./data/nv/completeData/nv_completeData_${dateAndTime}.txt`,JSON.stringify(nv_copmleteData))
       console.log(`the nv complete data from ${dateAndTime} successfully saved`);
       // move the old data files to the archive
       files.map(file=>{
           if (file != `nv_completeData_${dateAndTime}.txt` && file != 'archive'){
               fs.renameSync(`./data/nv/completeData/${file}`, `./data/nv/completeData/archive/${file}`);
               console.log(`${file} successfully moved to nv complete data archive`);   
           } 
       })
   }
   catch(err){
       return err.message; 
   }; 
   
   // solve the problem that if runnig the module twice at same time on the clock
   let lastJsonName = files[files.length-1];
   if(files[files.length-1] === `nv_completeData_${dateAndTime}.txt` || files[files.length-1] === 'archive'){
       const completeFiles = fs.readdirSync('./data/nv/completeData/archive/');
       lastJsonName = completeFiles[completeFiles.length-1]
   }


   return {
       copmleteData:nv_copmleteData,
       lastJsonName:lastJsonName
   };
};