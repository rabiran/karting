const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const p = require('../config/paths');
const fn = require('../config/fieldNames');

module.exports = async () => {
    // get the update data from the remote server
    let mm_data = await axios.get(p().MM_API);
    // save the new json as file in the server
    let previous_mm_data_file_name = saveAsFile(mm_data.data, `./data/${fn.dataSources.mm}`, `${fn.dataSources.mm}_raw_data`);
    // get the delta between the two last JSONs
    mmDiff = dataComparison(mm_data.data, `./data/${fn.dataSources.mm}/archive`, previous_mm_data_file_name, fn[fn.dataSources.nvSQL].uniqeID);

    return mmDiff;
}
