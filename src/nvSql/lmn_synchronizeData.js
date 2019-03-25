const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const p = require('../config/paths');
const fn = require('../config/fieldNames');

module.exports = async () => {
    // get the update data from the remote server
    let lmn_data = await axios.get(p().LMN_API);
    // save the new json as file in the server
    let previous_lmn_data_file_name = saveAsFile(lmn_data.data, './data/lmn', 'lmn_raw_data');
    // get the delta between the two last JSONs
    lmnDiff = dataComparison(lmn_data.data, "./data/lmn/archive", previous_lmn_data_file_name, fn.nv.uniqeID);

    return lmnDiff;
}
