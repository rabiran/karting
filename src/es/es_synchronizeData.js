const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
require('dotenv').config()

module.exports = async()=>{
    // get the update data from the remote server
    let es_Data = await axios.get(process.env.ES_API);
    // save the new json as file in the server
    saveAsFile(es_Data.data,'./data/es','es_raw_data');
    
    return es_Data.data;
};