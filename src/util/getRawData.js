const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const akaDataManipulate = require('./akaDataManipulate');
const { logLevel } = require('./logger');
const logDetails = require('./logDetails');
const saveAsFile = require('./saveAsFile');
const { query } = require('express');

/**
 * Get data raw data from data source
 *
 * @param {string} dataSource = which data source to get data from
 * @param {string} runningType - the current runnig type
 * @param {Date} dateAndTime - when the data was called
 */
module.exports = async (dataSource, runningType, dateAndTime, sendLog, queries) => {
    let data;
    let res;

    const query = { 
        params: queries
    }

    if (dataSource === fn.dataSources.aka) {
        // get the update data from the remote server
        let aka_telephones_res = await axios.get(p().AKA_TELEPHONES_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        let aka_employees_res = await axios.get(p().AKA_EMPLOYEES_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        /*let pictures_meta_data = await axios.get(p().PICTURES_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });*/

        let pictures_meta_data = []
        // editing the aka data and squishing it to one object
        data = akaDataManipulate(aka_telephones_res.data, aka_employees_res.data,pictures_meta_data);
    }
    // get the update data from the remote server
    else {
        res = await axios.get(p()[`${dataSource}_API`], query).catch(err=>{
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        data = res.data;
    }
    
    // save the new json as file in the server and get the name of the kast file
    let savePath = `./data/${runningType}/${dataSource}`;
    saveAsFile(data, savePath, `${runningType}_${dataSource}_raw_data`, dateAndTime, sendLog);
    const fileName = `${savePath}/${runningType}_${dataSource}_raw_data_${dateAndTime}.log`
    return { data, fileName };
}
