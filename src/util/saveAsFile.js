const fs = require('fs');
const {sendLog, logLevel} = require('./logger');
const logDetails = require('../util/logDetails');
const shell = require('shelljs');

// Create the log directory if it does not exist
const pathHandler = (path) => {
    if (!fs.existsSync(path)) {
        shell.mkdir('-p', path);
    }
};

/**
 * This module save data as file with formt of description_date_time and returned the name of the last file that stored
 *
 * @param {*} data The data will be saved as file
 * @param {*} path The location where the data will be stored (without "/" at the end of the path)
 * @param {*} actionDescription Data description for the logs and the file's name
 * @returns The name of the last file that stored
 */
module.exports = (data, path, actionDescription, dateAndTime) => {
    pathHandler(path);
    pathHandler(`${path}/archive/`);

    const files = fs.readdirSync(`${path}/`);

    try {
        fs.writeFileSync(`${path}/${actionDescription}_${dateAndTime}.log`, JSON.stringify(data))
        sendLog(logLevel.info, logDetails.info.INF_SAVE_NEW_DATA_FILE, actionDescription, dateAndTime);
        files.map(file => {
            if (file != `${actionDescription}_${dateAndTime}.log` && file != 'archive') {
                fs.renameSync(`${path}/${file}`, `${path}/archive/${file}`);
                sendLog(logLevel.info, logDetails.info.INF_MOVE_FILE_TO_ARCHIVE, file);
            }
        })
    }
    catch (err) {
        sendLog(logLevel.error, logDetails.error.ERR_SAVE_DATA_FILE, actionDescription, dateAndTime, err.message);
        return err.message;
    };
    // let lastJsonName = files[files.length - 1]
    // // solve the problem that if runnig the module twice at same time on the clock
    // if (files[files.length - 1] === `${actionDescription}_${dateAndTime}.log` || files[files.length - 1] === 'archive') {
    //     const completeFiles = fs.readdirSync(`${path}/archive/`);
    //     lastJsonName = (completeFiles[completeFiles.length - 1]);
    // }

    // return lastJsonName;
}
