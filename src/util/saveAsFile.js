const fs = require('fs');
const moment = require("moment");
const colors = require('./colorsForLogs');

/*
    This module save log to file with formt of date and time.

    the argument meanning:
    data:the data will be saved as file
    path: the location of the data (archive folder need to be exist at this path), without "/" at the end of the path
    actionDescription: descripton about the meanning of the logs, show at the log.
*/


module.exports = (data, path, actionDescription) => {
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    const files = fs.readdirSync(`${path}/`);
    try{
        fs.writeFileSync(`${path}/${actionDescription}_${dateAndTime}.log`,JSON.stringify(data))
        console.log(`${colors.green}the ${actionDescription} from ${dateAndTime} successfully saved`);
        files.map(file=>{
            if (file != `${actionDescription}_${dateAndTime}.log` && file != 'archive' && file != 'completeData'){
                fs.renameSync(`${path}/${file}`, `${path}/archive/${file}`);
                console.log(`${colors.green}${file} successfully moved to the archive`); 
            } 
        })
    }
    catch(err){
        console.log(`${colors.red} Error at save ${actionDescription}_${dateAndTime}.log file. The error message:${err.message}`);
        return err.message; 
    }; 
    
    // solve the problem that if runnig the module twice at same time on the clock
    let lastJsonName = files[files.length-1]
    if(files[files.length-1] === `${actionDescription}_${dateAndTime}.log` || files[files.length-1] === 'archive'){
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = completeFiles[completeFiles.length-1]
    }

    return lastJsonName;
}
