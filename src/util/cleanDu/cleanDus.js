const fn = require('../../config/fieldNames')
const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');

async function cleanDu(runningType, dataSource, records, query, sendLog, Auth) {

    let dataSourcePersons = [];
    if (runningType === fn.runnigTypes.immediateRun) {


        const resPerson = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/domainUser/${query}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU , query, dataSource, err.message);
        }); 
        dataSourcePersons.push(resPerson.data);
    }
    else {
        const resPersons = await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API, query).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU , query, dataSource, err.message);
        });
        if(resPersons){
            dataSourcePersons = resPersons.data;
        }
    }
    const irrelevantDus = getIrrelevantDus(records, dataSourcePersons, dataSource, sendLog, Auth);
    await deleteDus(irrelevantDus, dataSourcePersons, dataSource, sendLog, Auth);
}

module.exports = cleanDu;