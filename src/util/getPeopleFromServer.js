const express = require('express');
const fn = require('../config/fieldNames');
const p = require('../config/paths');
const axios = require("axios");
const searchRecordInData = require('./searchRecordInData');

module.exports = async() => {
    
    //get IDs from immediateServer
    const receivedIDsData = await axios.get(p().immediateServer_API);
    const personIDsArray = receivedIDsData.data.personIDsArray;
    const dataSource = receivedIDsData.data.dataSource;

    //search records for id in data file
    let foundRecordInData = searchRecordInData(dataSource, fn.runnigTypes.ImmediateRun, personIDsArray)

    //get recent data from mocks
    // data = await axios.get(p()[`${dataSource}_API`]).catch(err=>{
    //     sendLog(logLevel.error, logDetails.error.ERR_GET_RAW_DATA , dataSource, err.message);
    // });
    // curr_data = data.data;
    // let dataSourceFields = fn[dataSource];
    // let foundRecordInMocks = curr_data.filter(record => (findrecord(record, personIDsArray)))

    return foundPersonInData;

}