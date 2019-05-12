const fs = require('fs');
const moment = require("moment");
const logger = require('./logger');
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
module.exports = (data, path, actionDescription) => {
    pathHandler(path);
    pathHandler(`${path}/archive/`);
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    const files = fs.readdirSync(`${path}/`);
    try {
        fs.writeFileSync(`${path}/${actionDescription}_${dateAndTime}.log`, JSON.stringify(data))
        logger.info(`The ${actionDescription} from ${dateAndTime} successfully saved`);
        files.map(file => {
            if (file != `${actionDescription}_${dateAndTime}.log` && file != 'archive' && file != 'completeData') {
                fs.renameSync(`${path}/${file}`, `${path}/archive/${file}`);
                logger.info(`${file} successfully moved to the archive`);
            }
        })
    }
    catch (err) {
        logger.error(`Error at save ${actionDescription}_${dateAndTime}.log file. The error message:${err.message}`);
        return err.message;
    };

    // solve the problem that if runnig the module twice at same time on the clock
    let lastJsonName = files[files.length - 1]
    if (files[files.length - 1] === `${actionDescription}_${dateAndTime}.log` || files[files.length - 1] === 'archive') {
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = (completeFiles[completeFiles.length - 1]);
    }

    return lastJsonName;
}
