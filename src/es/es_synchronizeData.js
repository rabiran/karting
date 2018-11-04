const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const p = require('../config/paths');
const fn = require('../config/fieldNames');

module.exports = async()=>{
    // get the update data from the remote server
    let es_data = await axios.get(p().ES_API);
    // save the new json as file in the server
    let previous_es_data_file_name = saveAsFile(es_data.data,'./data/es','es_raw_data');
   // get the delta between the two last JSONs
    esDiff = dataComparison(es_data.data,"./data/es/archive", previous_es_data_file_name, fn.es.identityCard);
    
    return esDiff;

};