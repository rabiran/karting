const fn = require('../config/fieldNames');
const axios = require("axios");
const moment = require('moment');
const saveAsFile = require('../util/saveAsFile');
const dataComparison = require('../util/dataComparison');
const getRawData = require('./getRawData');
const fs = require('fs');

axios.defaults.headers.common['authorization'] = process.env.SOURCES_TOKEN;

module.exports = async (dataSource, runnigType) => {
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    const data = await getRawData(dataSource, runnigType, dateAndTime);

    const path = `./data/${dataSource}`;
    const files = fs.readdirSync(`${path}/`);
    const actionDescription = `${runnigType}_${dataSource}_raw_data`;
    let lastJsonName = files[files.length - 1];

    // solve the problem that if runnig the module twice at same time on the clock
    if (files[files.length - 1] === `${actionDescription}_${dateAndTime}.log` || files[files.length - 1] === 'archive') {
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = (completeFiles[completeFiles.length - 1]);
    }


    // save the new json as file in the server and get the name of the kast file
    // saveAsFile(data, path, actionDescription);
    // get the diffs between the two last JSONs
    dataDiff = dataComparison(data, `./data/${dataSource}/archive`, lastJsonName, fn[dataSource].uniqeFieldForDeepDiff);
    dataSource === fn.dataSources.aka ? dataDiff.all = data : null;

    return dataDiff;
}
