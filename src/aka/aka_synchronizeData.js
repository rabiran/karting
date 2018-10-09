const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');

require('dotenv').config()

module.exports = async()=>{
    // get the update data from the remote server
    let aka_Data = await axios.get(process.env.AKA_API);
        
    // save the new json as file in the server
    saveAsFile(aka_Data.data,'./data/aka','aka_raw_data');

    return aka_Data.data;
};
