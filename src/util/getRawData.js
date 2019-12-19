const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const akaDataManipulate = require('./akaDataManipulate');
const {sendLog, logLevel} = require('./logger');
const logDetails = require('./logDetails');

module.exports = async (dataSource) => {
    let data;
    if (dataSource === fn.dataSources.aka) {
        // get the update data from the remote server
        let aka_telephones_data = await axios.get(p().AKA_TELEPHONES_API).catch(err => {
            console.log(err);
        });
        let aka_employees_data = await axios.get(p().AKA_EMPLOYEES_API).catch(err => {
            console.log(err);
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

    return data;
}