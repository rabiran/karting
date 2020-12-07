const fn = require('../../config/fieldNames')
const getIrrelevantDus = require('./getIrrelevantDus');
const deleteDus = require('./deleteDus');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');
const p =  require('../../config/paths');
const getRawData = require('../getRawData');
const moment = require('moment');
//const Set = require("./collections/set");
const preRun = require('../preRun');
//receives dataSource,identifiers an object with 3 possible fields, ...
//fetches all possible people with the received identifiers from kartoffel, then for each person
//iterates over all of their domainUsers and checks if it is consistent with the databases (pncy)
//if the person is still in the database of that datasource then we continue with no action.
//otherwise we remove the domainUser from the person in kartoffel
async function cleanImmediateDus(dataSource, identifiers, sendLog, Auth) {

    //first: get the dataSourcePersons from kartoffel
    let dataSourcePersons = new Set();
    if (identifiers.identityCard){
        const resPersonByID = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/identifier/${identifiers.identityCard}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_ID , dataSource, err.message);
        });
        if(resPersonByID)
            dataSourcePersons.add(resPersonByID.data);
    }
    if (identifiers.personalNumber){
        const resPersonByPN = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/identifier/${identifiers.personalNumber}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_ID , dataSource, err.message);
        });
        if(resPersonByPN)
            dataSourcePersons.add(resPersonByPN.data);
    }
    if (identifiers.domainUser){
        const resPersonByDU = await Auth.axiosKartoffel.get(`${p().KARTOFFEL_PERSON_API}/domainUser/${identifiers.domainUser}`).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_GET_PERSONS_BY_DU , dataSource, err.message);
        }); 
        if(resPersonByDU)
            dataSourcePersons.add(resPersonByDU.data);
    }
    let domainUsers = new Set();
    for(person of dataSourcePersons){
        for(domainUser of person.domainUsers){
            if(domainUsers.has(domainUser.uniqueID)) //already iterated over the domainUser
                continue;
            else
                domainUsers.add(domainUser.uniqueID)

            const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");
            const ds = domainUser.dataSource;
            const du = domainUser.uniqueID.split("@")[0];
            const idObj = {domainUser : du}
            const { data, fileName } = await getRawData(ds, fn.runnigTypes.immediateRun, date, sendLog, idObj);
            if(!data||data.length == 0){
                await deleteDus([domainUser.uniqueID], Array.from(dataSourcePersons), ds, sendLog, Auth);
            }
        }
    }

}

module.exports = cleanImmediateDus;