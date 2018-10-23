const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const fn = require('../config/fieldNames');
const p = require('../config/paths');

module.exports = async()=>{ 
    // get the update data from the remote server
    let aka_data = await axios.get(p().AKA_API);
    // save the new json as file in the server
    let previous_aka_data_file_name = saveAsFile(aka_data.data,'./data/aka','aka_raw_data');

    // get the delta between the two last JSONs
    akaDiff = dataComparison(aka_data.data,"./data/aka/archive", previous_aka_data_file_name, fn.aka.personalNumber);
    akaDiff.all = aka_data.data;
    return akaDiff;
};