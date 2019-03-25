const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const p = require('../config/paths');
const fn = require('../config/fieldNames');

module.exports = async () => {
    // get the update data from the remote server
    let mdn_data = await axios.get(p().MDN_API);
    // save the new json as file in the server
    let previous_mdn_data_file_name = saveAsFile(mdn_data.data, './data/mdn', 'mdn_raw_data');
    // get the delta between the two last JSONs
    mdnDiff = dataComparison(mdn_data.data, "./data/mdn/archive", previous_mdn_data_file_name, fn.nv.uniqeID);

    return mdnDiff;
}
