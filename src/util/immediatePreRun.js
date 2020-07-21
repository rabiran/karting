const fn = require('../config/fieldNames');
const authHierarchyExistence = require('./generalUtils/authHierarchyExistence');
const getDataSourceFromFile = require('./getDataSourceFromFile');
const { wrapSendLog } = require('./logger');


module.exports = async (runningType, dataSource, idObj, runUID) => {

    let sendLog = wrapSendLog(runningType, idObj.value, runUID)

    // check if the root hierarchy exist and adding it if not
    await authHierarchyExistence(sendLog);

    let foundRecord;
    let dataObj = {};

    idObjMock = {username: idObj.domainUser, pernum: idObj.personalNumber, identitycard: idObj.identityCard}; // match to mocks query routes
    idObjMock = JSON.parse(JSON.stringify(idObjMock)); // remove undefined fields

    // TODO get Raw data from last aka file, nova

    const akaData = getDataSourceFromFile(fn.dataSources.aka);

    // TODO search through these files for the certain record

    const akaRecord = akaData.find(person => ((person[fn.aka.personalNumber] == idObj.pernum) || (person[fn.aka.identityCard] == identifier)));
    dataObj[fn.dataSources.aka] = [akaRecord];

    // iterate through identifiers to get record

    for (const id in idObjMock) {
        let url = p()[`${dataSource}_API`].concat(`?${id}=${idObjMock[id]}`)
        data = await axios.get(url).catch(err=>{
            sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
        });
        if(data.data) {
            foundRecord = data.data;
            break;
        }
    }

    dataObj[dataSource] = [foundRecord];
    return { foundRecord, akaRecord, sendLog }
}