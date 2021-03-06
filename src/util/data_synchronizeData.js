const fn = require('../config/fieldNames');
const axios = require("axios");
const moment = require('moment');
const dataComparison = require('../util/dataComparison');
const fs = require('fs');

axios.defaults.headers.common['Authorization'] = process.env.SOURCES_TOKEN;

module.exports = async (dataSource, data, fileName, sendLog) => {
    const path = `./data/${fn.runnigTypes.dailyRun}/${dataSource}`;
    const files = fs.readdirSync(`${path}/`);
    let lastJsonName = files[files.length - 1];

    if (`${path}/${files[files.length - 1]}` === fileName || files[files.length - 1] === 'archive') {
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = (completeFiles[completeFiles.length - 1]);
    }

    // get the diffs between the two last JSONs
    dataDiff = dataComparison(data, `${path}/archive`, lastJsonName, fn[dataSource].uniqeFieldForDeepDiff, sendLog);
    dataSource === fn.dataSources.aka ? dataDiff.all = data : null;

    return dataDiff;
}
