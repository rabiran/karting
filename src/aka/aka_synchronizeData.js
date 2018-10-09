const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
require('dotenv').config()

module.exports = async()=>{
    // get the update data from the remote server
    let aka_data = await axios.get(process.env.AKA_API);
    // save the new json as file in the server
    let previous_aka_data_file_name = saveAsFile(aka_data.data,'./data/aka','aka_raw_data');
    
    akaDiff = dataComparison(aka_data.data,"./data/aka/archive", previous_aka_data_file_name, "mi");
    
    return akaDiff;
};