const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');

module.exports = async () => {
    // get the update data from the remote server
    let adNN_data = await axios.get(p().ADNN_API);
    // save the new json as file in the server
    let previous_adNN_data_file_name = saveAsFile(adNN_data.data, './data/adNN', 'adNN_raw_data');
    // get the delta between the two last JSONs
    adNNDiff = dataComparison(adNN_data.data, "./data/adnn/archive", previous_adNN_data_file_name, fn.adNN.upn);

    return adNNDiff;
}
