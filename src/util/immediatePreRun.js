const fn = require('../config/fieldNames');
const authHierarchyExistence = require('./generalUtils/authHierarchyExistence');
const getDataSourceFromFile = require('./getDataSourceFromFile');
const p = require('../config/paths');
const axios = require("axios");
const akaDataManipulate = require('./akaDataManipulate');
const { wrapSendLog } = require('./logger');


function searchInData(data, query) {
    let foundRecord = data.find(record => {
        return JSON.stringify(record).includes(query);
    })
    return foundRecord;
}

module.exports = async (runningType, dataSource, idObj, runUID) => {

    let foundRecord;
    let akaRecord;
    let dataObj = {};

    let sendLog = wrapSendLog(runningType, idObj.identitycard, runUID)

    // check if the root hierarchy exist and adding it if not
    await authHierarchyExistence(sendLog);

    // get Aka Data
        let aka_telephones_data = await axios.get(p().AKA_TELEPHONES_API.concat(`?personalNumber=${idObj.personalNumber}`)).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA , fn.dataSources.aka, err.message);
        });
        let aka_employees_data = await axios.get(p().AKA_EMPLOYEES_API.concat(`?identityCard=${idObj.identityCard}`)).catch(err => {
            sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA , fn.dataSources.aka, err.message);
        });

        akaRecord = akaDataManipulate(aka_telephones_data.data, aka_employees_data.data);

        let urlToSearch = p()[`${dataSource}_API`];
        
    // iterate through identifiers to get record
        switch(dataSource) {
            case fn.dataSources.es:
                urlToSearch = urlToSearch.concat(`?domainUser=${idObj.domainUser}`)
                break;
            case fn.dataSources.ads:
                urlToSearch = urlToSearch.concat(`?domainUser=${idObj.domainUser}`)     
                break;           
            case fn.dataSources.adNN:
                urlToSearch = urlToSearch.concat(`?domainUser=${idObj.domainUser}`)
                break;
            case fn.dataSources.city:
                urlToSearch = urlToSearch.concat(`?domainUser=${idObj.domainUser}`)               
                break;
            default:
                let data = getDataSourceFromFile(dataSource);
                foundRecord = searchInData(data, idObj.personalNumber)   
        }

        if(!foundRecord) {
            data = await axios.get(urlToSearch).catch(err=>{
                sendLog(logLevel.error, logDetails.error.ERR_NOT_FOUND_IN_RAW_DATA , dataSource, err.message);
            });
        }

        if(data.data) {
            foundRecord = data.data;
        }
    
    dataObj[dataSource] = [foundRecord];
    return { foundRecord, akaRecord, sendLog }
}