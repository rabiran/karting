const express = require('express');
const fn = require('../config/fieldNames');
const p = require('../config/paths');
const axios = require("axios");
const searchRecordInData = require('./searchRecordInData');

module.exports = async() => {
    
    //get IDs from immediateServer
    const receivedIDsData = await axios.get(p().immediateServer_API);
    const PersonalNumbersArray = receivedIDsData.data.personalNumbersArray;
    const dataSource = receivedIDsData.data.dataSource;

    //search records for id in data file
    let foundPersonInData = searchRecordInData(dataSource, fn.runnigTypes.ImmediateRun, PersonalNumbersArray)

    //get recent data from mocks
    data = await axios.get(p()[`${dataSource}_API`]).catch(err=>{
        sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
    });
    curr_data = data.data;
    let dataSourceFields = fn[dataSource];
    let foundPersonInMocks = curr_data.filter(person => (PersonalNumbersArray.includes((person[dataSourceFields.personalNumber]))))

    return foundPersonInMocks || foundPersonInData;

    function findrecord(record) {
        const { identityCard, personalNumber } = await getIdentifiers(record, dataSource, true);
        return (PersonalNumbersArray.includes(identityCard) || PersonalNumbersArray.includes(personalNumber));
    }
}