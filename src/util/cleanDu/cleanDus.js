const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');
const AuthClass = require('../../auth/auth');

async function cleanDu(dataSource, records, sendLog, recivedAuth) {
    const Auth = recivedAuth ? recivedAuth : new AuthClass(sendLog);
    const query = {
        params: {
            ['domainUsers.dataSource']: dataSource
        }
    }
    const dataSourcePersons = await Auth.axiosKartoffel.get(
        p().KARTOFFEL_PERSON_API, query).catch(err => {
        sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
    });

    const irrelevantDus = getIrrelevantDus(records, dataSourcePersons.data, dataSource, sendLog, Auth);
    await deleteDus(irrelevantDus, dataSourcePersons.data, Auth, sendLog);
}

module.exports = cleanDu;