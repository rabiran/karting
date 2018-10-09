const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
require('dotenv').config()

module.exports = async()=>{
    // get the update data from the remote server
    let nv_Data = await axios.get(process.env.NV_API);
    // save the new json as file in the server
    saveAsFile(nv_Data.data,'./data/nv','nv_raw_data');

    return nv_Data.data;
};
