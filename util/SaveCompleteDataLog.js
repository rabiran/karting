const fs = require('fs');
const moment = require("moment");
const colors = require('./colorsForLogs');

module.exports = (domainName,copmleteData) => {
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    const files = fs.readdirSync(`./data/${domainName}/completeData/`);
    try{
        fs.writeFileSync(`./data/${domainName}/completeData/${domainName}_completeData_${dateAndTime}.txt`,JSON.stringify(copmleteData))
        console.log(`${colors.green}the ${domainName} complete data from ${dateAndTime} successfully saved`);
        files.map(file=>{
            if (file != `${domainName}_completeData_${dateAndTime}.txt` && file != 'archive'){
                fs.renameSync(`./data/${domainName}/completeData/${file}`, `./data/${domainName}/completeData/archive/${file}`);
                console.log(`${colors.green}${file} successfully moved to ${domainName} complete data archive`); 
            } 
        })
    }
    catch(err){
        return err.message; 
    }; 
    
    // solve the problem that if runnig the module twice at same time on the clock
    let lastJsonName = files[files.length-1]
    if(files[files.length-1] === `${domainName}_completeData_${dateAndTime}.txt` || files[files.length-1] === 'archive'){
   
        const completeFiles = fs.readdirSync(`./data/${domainName}/completeData/archive/`);
        lastJsonName = completeFiles[completeFiles.length-1]
    }

    return lastJsonName;
}
