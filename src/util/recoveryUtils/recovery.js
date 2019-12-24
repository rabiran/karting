const moment = require('moment');
const getRawData = require('../getRawData');
const compareToKartoffel = require('./compareToKartoffel');
const matchToKartoffel = require('../matchToKartoffel');
const fn = require('../../config/fieldNames');

module.exports = async (akaData, dataSource) => {
    const dataFromDataSource = await getRawData(dataSource, fn.runnigTypes.recoveryRun, moment(new Date()).format("DD.MM.YYYY__HH.mm"));
    const adjustData = await Promise.all(dataFromDataSource.map(async person => await matchToKartoffel(person, dataSource)));
    await compareToKartoffel(adjustData, dataSource, akaData);
}