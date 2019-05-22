const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');

module.exports = async () => {
    // get the update data from the remote server
    let ads_data = await axios.get(p().ADS_API);
    // save the new json as file in the server
    let previous_ads_data_file_name = saveAsFile(ads_data.data, `./data/${fn.dataSources.ads}`, `${fn.dataSources.ads}_raw_data`);
    // get the delta between the two last JSONs
    adsDiff = dataComparison(ads_data.data, `./data/${fn.dataSources.ads}/archive`, previous_ads_data_file_name, fn.ads.sAMAccountName);

    return adsDiff;
}