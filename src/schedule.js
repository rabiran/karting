const schedule = require("node-schedule");
const fs = require('fs');
const diff = require("diff-arrays-of-objects");
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const nv = require('./nv/nv_synchronizeData');
const es_DataCompletion = require('./es/es_dataCompletion');
const nv_DataCompletion = require('./nv/nv_dataCompletion');

//load the environment variables from '.env' file into process.env
require('dotenv').config()

// const trialLog = schedule.scheduleJob('02 * * * *',async()=>{
    // get the new json from aka & save him on the server
    let aka_data = aka();
    // get the new json from es & save him on the server
    let es_Data = es();
    // get the new json from nv & save him on the server
    let nv_Data = nv();

    aka_data.then(aka_result=>{
        es_Data.then(es_result => {
            // integration of the data from the various sources and save the complete data on the server
            let es_completeData = es_DataCompletion(es_result,aka_result)
            // compare the new json with the oldest
            let last_es_Json_name = fs.readFileSync(`./data/es/completeData/archive/${es_completeData.lastJsonName}`,'utf8'); 
            last_es_Json_name =  JSON.parse(last_es_Json_name);
            let es_diff = diff(last_es_Json_name,es_completeData.copmleteData,"mi",{updateValues: 2 });
        });
        nv_Data.then(nv_result => {
            // integration of the data from the various sources and save the complete data on the server
            let nv_completeData = nv_DataCompletion(nv_result,aka_result);
            // compare the new json with the oldest
            let last_nv_Json_name = fs.readFileSync(`./data/nv/completeData/archive/${nv_completeData.lastJsonName}`,'utf8'); 
            last_nv_Json_name =  JSON.parse(last_nv_Json_name);
            let nv_diff = diff(last_nv_Json_name,nv_completeData.copmleteData,"mi",{updateValues: 2 });
        });

     
    // add the new persons to Kartoffel
    // axios.post(process.env.KARTOFFEL_ADDPERSON_API,result.added)
    //     .then(()=>{
    //         console.log('success to post :)'); 
    //     })
    //     .catch((error)=>{
    //         console.log('failed to post :(');
    //         console.log(error);                
    //     })
    });
    
// });