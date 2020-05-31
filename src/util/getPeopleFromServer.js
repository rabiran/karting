const express = require('express');
const fn = require('../config/fieldNames');
const p = require('../config/paths');
const axios = require("axios");
const filterAsync = require('./generalUtils/filterAsync');
const getIdentifiers = require('./getIdentifiers')

module.exports = async() => {
    
    //get IDs from immediateServer
    const receivedIDsData = await axios.get(p().immediateServer_API);
    const personIDsArray = receivedIDsData.data.personIDsArray;
    const dataSource = receivedIDsData.data.dataSource;

    //search records for id in data file
    // let foundRecordInData = searchRecordInData(dataSource, fn.runnigTypes.ImmediateRun, personIDsArray)

    // get recent data from mocks
    data = await axios.get(p()[`${dataSource}_API`]).catch(err=>{
        sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
    });
    curr_data = data.data;
    
    let flatIDs = personIDsArray.map(obj => [obj.id, obj.mi, obj.domuser]).flat();
    // let foundRecord = await previous_data.filter(async record => (await findrecord(record, flatIDs)))
    let foundRecordInMocks = await filterAsync(curr_data, async (record) => (await findrecord(record)))
    return foundRecordInMocks;

    async function findrecord(record) {
        const { identityCard, personalNumber, domuser  } = await getIdentifiers(record, dataSource, true);
        return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domuser));
    }
}