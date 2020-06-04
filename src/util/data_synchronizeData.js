const fn = require('../config/fieldNames');
const axios = require("axios");
const moment = require('moment');
const dataComparison = require('../util/dataComparison');
const fs = require('fs');

axios.defaults.headers.common['authorization'] = process.env.SOURCES_TOKEN;

module.exports = async (dataSource, data) => {
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY__HH.mm");

    const path = `./data/${fn.runnigTypes.dailyRun}/${dataSource}`;
    const files = fs.readdirSync(`${path}/`);
    const actionDescription = `${fn.runnigTypes.dailyRun}_${dataSource}_raw_data`;
    let lastJsonName = files[files.length - 1];

    if (files[files.length - 1] === `${actionDescription}_${dateAndTime}.log` || files[files.length - 1] === 'archive') {
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = (completeFiles[completeFiles.length - 1]);
    }

    // get the diffs between the two last JSONs
    dataDiff = dataComparison(data, `${path}/archive`, lastJsonName, fn[dataSource].uniqeFieldForDeepDiff);
    dataSource === fn.dataSources.aka ? dataDiff.all = data : null;

    return dataDiff;
}
