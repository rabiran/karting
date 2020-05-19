const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const akaDataManipulate = require('./akaDataManipulate');
const { sendLog, logLevel } = require('./logger');
const logDetails = require('./logDetails');
const saveAsFile = require('./saveAsFile');

/**
 * Get data raw data from data source
 *
 * @param {string} dataSource = which data source to get data from
 * @param {string} runType - the current runnig type
 * @param {Date} dateAndTime - when the data was called
 */
module.exports = async (dataSource, runType, dateAndTime, personIDs) => {

    let data;

    // TODO implement a search for objects in datasource that match the personIDs
    
    if (dataSource === fn.dataSources.aka) {
        // get the update data from the remote server
        let aka_telephones_data = await axios.get(p().AKA_TELEPHONES_API).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        let aka_employees_data = await axios.get(p().AKA_EMPLOYEES_API).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });

        // editing the aka data and squishing it to one object
        data = akaDataManipulate(aka_telephones_data.data, aka_employees_data.data);
    }
    // get the update data from the remote server
    else {
        data = await axios.get(p()[`${dataSource}_API`]).catch(err=>{
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        data = data.data;
    }

    // save the new json as file in the server and get the name of the kast file
    saveAsFile(data, `./data/${dataSource}`, `${runType}_${dataSource}_raw_data`, dateAndTime);

    return data;
}