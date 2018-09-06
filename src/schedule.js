 const schedule = require("node-schedule");
const axios = require('axios');
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
            const es_completeData = es_DataCompletion(es_result,aka_result)
            // compare the new json with the oldest
            let last_es_Json_name = fs.readFileSync(`./data/es/completeData/archive/${es_completeData.lastJsonName}`,'utf8'); 
            last_es_Json_name =  JSON.parse(last_es_Json_name);
           
            // extarct the new data of new & exist persons
            // const es_diff = diff(last_es_Json_name,es_completeData.copmleteData,"personalNumber",{updateValues: 2 });          
            
            // /*only for TEST needs*/
            const update_es_json = fs.readFileSync('/home/me/Desktop/escomp_UPDATE.txt','utf8');
           
            const es_diff = diff(last_es_Json_name,JSON.parse(update_es_json),"personalNumber",{updateValues: 2 });
            // /*REMOVE UNTIL HERE*/
   
            
            
            // add the new persons to Kartoffel
            es_diff.added.map(es_person => {
                axios.post(process.env.KARTOFFEL_ADDPERSON_API,es_person)
                .then(()=>{
                    console.log(`success to post ${es_person.personalNumber} from es`); 
                })
                .catch((error)=>{
                    console.log(`failed to post ${es_person.personalNumber} from es`);
                    // console.log(error);                
                })                
            })
        });
        nv_Data.then(nv_result => {
            // integration of the data from the various sources and save the complete data on the server
            const nv_completeData = nv_DataCompletion(nv_result,aka_result);
            // compare the new json with the oldest
            let last_nv_Json_name = fs.readFileSync(`./data/nv/completeData/archive/${nv_completeData.lastJsonName}`,'utf8'); 
            last_nv_Json_name =  JSON.parse(last_nv_Json_name);
            // extarct the new data of new & exist persons
            // const nv_diff = diff(last_nv_Json_name,nv_completeData.copmleteData,"personalNumber",{updateValues: 2 });
           
            // add the new persons to Kartoffel

            // /*only for TEST needs*/
            const update_nv_json = fs.readFileSync('/home/me/Desktop/nvcomp_UPDATE.txt','utf8');

            const nv_diff = diff(last_nv_Json_name,JSON.parse(update_nv_json),"personalNumber",{updateValues: 2 });
            // /*REMOVE UNTIL HERE*/

            // add the new persons to Kartoffel
            nv_diff.added.map(nv_person => {
                axios.post(process.env.KARTOFFEL_ADDPERSON_API,nv_person)
                .then(()=>{
                    console.log(`success to post ${nv_person.personalNumber} from nv`); 
                })
                .catch((error)=>{
                    console.log(`failed to post ${nv_person.personalNumber} from nv`);
                    // console.log(error);                
                })                
            })

        });

     


    });
    
// });