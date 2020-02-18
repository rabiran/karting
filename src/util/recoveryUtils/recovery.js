const moment = require('moment');
const getRawData = require('../getRawData');
const compareToKartoffel = require('./compareToKartoffel');
const matchToKartoffel = require('../matchToKartoffel');
const fn = require('../../config/fieldNames');
const recordsFilter = require('../recordsFilter');

module.exports = async (akaData, dataSource) => {
    const dataFromDataSource = await getRawData(dataSource, fn.runnigTypes.recoveryRun, moment(new Date()).format("DD.MM.YYYY__HH.mm"));

    const filteredData = recordsFilter(dataFromDataSource, dataSource);

    let adjustData = [];
    for (let i = 0; i < filteredData.length; i++) {
        adjustData.push(await matchToKartoffel(filteredData[i], dataSource));
    }

    await compareToKartoffel(adjustData, dataSource, akaData);
}