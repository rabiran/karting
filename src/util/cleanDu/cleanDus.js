const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');
const AuthClass = require('../../auth/auth');

async function cleanDu(dataSource, records, query, sendLog, Auth) {

    const dataSourcePersons = await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU , dataSource, err.message);
        });
    
    const irrelevantDus = getIrrelevantDus(records, dataSourcePersons.data, dataSource, sendLog, Auth);
    await deleteDus(irrelevantDus, dataSourcePersons.data, dataSource, sendLog, Auth);
}

module.exports = cleanDu;