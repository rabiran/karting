const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');
const AuthClass = require('../../auth/auth');

async function cleanDu(dataSource, records, sendLog, Auth) {
    const query = {
        params: {
            ['domainUsers.dataSource']: dataSource,
        }
    }
    const dataSourcePersons = await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU_DATA_SOURCE , dataSource, err.message);
        });
    
    const irrelevantDus = getIrrelevantDus(records, dataSourcePersons.data, dataSource, sendLog, Auth);
    await deleteDus(irrelevantDus, dataSourcePersons.data, sendLog, Auth);
}

module.exports = cleanDu;