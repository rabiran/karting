const fn = require('../../config/fieldNames')
const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');

async function cleanImmediateDu(dataSource, identifiers, sendLog, Auth) {

    //first: get the dataSourcePersons from kartoffel
    let dataSourcePersons = [];
    let identifierObjs = []
    if (identifiers.identityCard){
        let IdentifierObjID;
        IdentifierObjID.identityCard = identifiers.identityCard;
        identifierObjs.push(IdentifierObjID)

        const resPersonByID = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/identifier/${identifiers.identityCard}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_ID , dataSource, err.message);
        });
        dataSourcePersons.push(resPersonByID.data);
    }
    if (identifiers.personalNumber){
        let IdentifierObjPN;
        IdentifierObjPN.personalNumber = identifiers.personalNumber;
        identifierObjs.push(IdentifierObjPN)

        const resPersonByPN = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/identifier/${identifiers.personalNumber}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_ID , dataSource, err.message);
        });
        dataSourcePersons.push(resPersonByPN.data);
    }
    if (identifiers.domainUser){
        let IdentifierObjDU;
        IdentifierObjDU.domainUser = identifiers.domainUser;
        identifierObjs.push(IdentifierObjDU)

        const resPersonByDU = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/domainUser/${identifiers.domainUser}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU , dataSource, err.message);
        }); 
        dataSourcePersons.push(resPersonByDU.data);
    }

    //second: get the records from the datasources using pncy
    let records = [];

    for (idObj of identifierObjs){
        const { dataObj, sendLog } = await preRun(fn.runnigTypes.immediateRun,
        [fn.dataSources.aka, dataSource],
        idObj, runUID);

        let akaRecords = dataObj[fn.dataSources.aka] ? dataObj[fn.dataSources.aka].data : [];
        let foundRecords = dataObj[dataSource] ? dataObj[dataSource].data : [];
        records = records.concat(foundRecords);
    }

    const irrelevantDus = getIrrelevantDus(records, dataSourcePersons, dataSource, sendLog, Auth);
    await deleteDus(irrelevantDus, dataSourcePersons, dataSource, sendLog, Auth);
}

module.exports = cleanDu;