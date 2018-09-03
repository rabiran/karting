var fs = require('fs');
const moment = require("moment");

module.exports = (es_data,aka_data)=>{
    // check if the person exist at aka and if so then adds the relevant fields
    let es_copmleteData = [];
    es_data.map(es_record => {
        aka_data.map(aka_record=>{
            let ifExist = Object.values(aka_record).indexOf(es_record.mi) 
            if (ifExist != -1){
                // add the clearance from aka
                es_record.clearance = aka_record.clearance

                // add the update record to new array that will returm from this module
                es_copmleteData.push(es_record);
            }   
        }) 
    });

    // save the complete data on the server
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    const files = fs.readdirSync('./data/es/completeData/')
    try{
        fs.writeFileSync(`./data/es/completeData/es_completeData_${dateAndTime}.txt`,JSON.stringify(es_copmleteData))
        console.log(`the es complete data from ${dateAndTime} successfully saved`);
        // move the old data files to the archive
        files.map(file=>{
            if (file != `es_completeData_${dateAndTime}.txt` && file != 'archive'){
                fs.renameSync(`./data/es/completeData/${file}`, `./data/es/completeData/archive/${file}`);
                console.log(`${file} successfully moved to es complete data archive`);   
            } 
        })
    }
    catch(err){
        return err.message; 
    }; 
    
    // solve the problem that if runnig the module twice at same time on the clock
    let lastJsonName = files[files.length-1]
    if(files[files.length-1] === `es_completeData_${dateAndTime}.txt`){
        const completeFiles = fs.readdirSync('./data/es/completeData/archive/');
        lastJsonName = completeFiles[completeFiles.length-1]
    }


    return {
        copmleteData:es_copmleteData,
        lastJsonName:lastJsonName
    };
};