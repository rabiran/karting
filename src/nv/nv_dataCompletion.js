var fs = require('fs');
const moment = require("moment");
const util = require('util');

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
        if (nv_record.uniqueId == 'dezzy4@wufoo.com'){
            nv_record.mi = '55579169';
        }else{
            nv_record.mi = Math.floor(10000000 + Math.random() * 900000);
        }
        
         // check if the person exist at aka and if so then adds the relevant fields
        aka_data.map(aka_record => {
            // !!!!!!need to remove (Number()) after regenerate the json!!!!!
            let ifExist = Object.values(aka_record).indexOf(Number(nv_record.mi));
            if (ifExist != -1){
                // add the fields from aka
                nv_record.stype = aka_record.stype;
                nv_record.nstype = aka_record.nstype;
                nv_record.rnk = aka_record.rnk;
                nv_record.nrnk = aka_record.nrnk;
                nv_record.telephone = aka_record.telephone;
                nv_record.ktelephone = aka_record.ktelephone;
                nv_record.mobile = aka_record.mobile;
                nv_record.kmobile = aka_record.kmobile;
                nv_record.rld = aka_record.rld;
                nv_record.clearance = aka_record.clearance;

                // add the update record to new array that will returm from this module
                nv_copmleteData.push(nv_record);          
            }   
        }) 
    });

    // save the complete data on the server
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    try{
        fs.writeFileSync(`./data/nv/completeData/nv_completeData_${dateAndTime}.txt`,util.inspect(nv_copmleteData,{depth: null}))
        console.log(`the nv complete data from ${dateAndTime} successfully saved`);
        // move the old data files to the archive
        let files = fs.readdirSync('./data/nv/completeData/')
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
    return nv_copmleteData;
};
