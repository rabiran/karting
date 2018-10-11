const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');

require('dotenv').config()

module.exports = async()=>{
    // get the update data from the remote server
    let nv_data = await axios.get(process.env.NV_API);
    // save the new json as file in the server
    let previous_nv_data_file_name = saveAsFile(nv_data.data,'./data/nv','nv_raw_data');
    // get the delta between the two last JSONs
    nvDiff = dataComparison(nv_data.data,"./data/nv/archive", previous_nv_data_file_name, "uniqueId");
    
    return nvDiff;

};