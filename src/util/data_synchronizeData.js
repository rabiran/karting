const p = require('../config/paths');
const fn = require('../config/fieldNames');
const axios = require("axios");
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const akaDataManipulate = require('./akaDataManipulate');
const logger = require('./logger');

axios.defaults.headers.common['authorization'] = process.env.SOURCES_TOKEN;

module.exports = async (dataSource) => {
    let data;
    if (dataSource === fn.dataSources.aka) {
        // get the update data from the remote server
        let aka_telephones_data = await axios.get(p().AKA_TELEPHONES_API);
        let aka_employees_data = await axios.get(p().AKA_EMPLOYEES_API);
        // editing the aka data and squishing it to one object
        data = akaDataManipulate(aka_telephones_data.data, aka_employees_data.data);
    }
    // get the update data from the remote server
    else {
        data = await axios.get(p()[`${dataSource}_API`]).catch(err=>{
            logger.error(`Failed to get data from '${dataSource}' API. The error is: ${err.message}`);
        });
        data = data.data;
    }
    // save the new json as file in the server and get the name of the kast file
    let previous_data_file_name = saveAsFile(data, `./data/${dataSource}`, `${dataSource}_raw_data`);
    // get the diffs between the two last JSONs
    dataDiff = dataComparison(data, `./data/${dataSource}/archive`, previous_data_file_name, fn[dataSource].uniqeFieldForDeepDiff);
    dataSource === fn.dataSources.aka ? dataDiff.all = data : null;

    // if (process.env.NEW_FEAT_MODE) {
    //     dataDiff.added = [ ...dataDiff.added, ...dataDiff.updated, ...dataDiff.same];
    //     dataDiff.same = [];
    //     dataDiff.updated = [];
    // }

    return dataDiff;
}
