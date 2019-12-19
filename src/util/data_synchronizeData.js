const fn = require('../config/fieldNames');
const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const getRawData = require('./getRawData');

axios.defaults.headers.common['authorization'] = process.env.SOURCES_TOKEN;

module.exports = async (dataSource) => {
    const data = await getRawData(dataSource);

    // save the new json as file in the server and get the name of the kast file
    let previous_data_file_name = saveAsFile(data, `./data/${dataSource}`, `${dataSource}_raw_data`);
    // get the diffs between the two last JSONs
    dataDiff = dataComparison(data, `./data/${dataSource}/archive`, previous_data_file_name, fn[dataSource].uniqeFieldForDeepDiff);
    dataSource === fn.dataSources.aka ? dataDiff.all = data : null;

    return dataDiff;
}
