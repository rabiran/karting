const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const akaDataManipulate = require('./akaDataManipulate.js');
const fn = require('../config/fieldNames');
const p = require('../config/paths');

module.exports = async()=>{ 
   
    // get the update data from the remote server
    let aka_telephones_data = await axios.get(p().AKA_TELEPHONES_API);

    // get the update data from the remote server
    let aka_employees_data = await axios.get(p().AKA_EMPLOYEES_API);

    // editing the aka data and squishing it to one object
    let aka_data = akaDataManipulate(aka_telephones_data, aka_employees_data);

    // save the new json as file in the server
    let previous_aka_data_file_name = saveAsFile(aka_data,'./data/aka','aka_raw_data');

    // get the delta between the two last JSONs
    akaDiff = dataComparison(aka_data,"./data/aka/archive", previous_aka_data_file_name, fn.aka.personalNumber);
    akaDiff.all = aka_data;
    return akaDiff;
};