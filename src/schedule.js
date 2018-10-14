const schedule = require("node-schedule");
const axios = require('axios');
const fs = require('fs');
const diff = require("diff-arrays-of-objects");
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const nv = require('./nv/nv_synchronizeData');
const es_DataCompletion = require('./es/es_dataCompletion');
const nv_DataCompletion = require('./nv/nv_dataCompletion');
const colors = require('./util/colorsForLogs');
const matchToKartoffel = require('./util/matchToKartoffel');
const  fn = require('./config/fieldNames');
//load the environment variables from '.env' file into process.env
require('dotenv').config()

// const trialLog = schedule.scheduleJob('30 * * * *',async()=>{

    // get the new json from aka & save him on the server
    let aka_data = aka();
    // get the new json from es & save him on the server
    let es_Data = es();
    // get the new json from nv & save him on the server
    let nv_Data = nv();

    aka_data.then(async(aka_result)=>{
        //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
        aka_result.updated = [
            {
            "drg": 61,
            "stype": 41,
            "nstype": "Quality Engineer",
            "firstName": "Trcie",
            "lastName": "Butterick",
            "tz": 123456,
            "mi": 55579169,
            "rnk": 70,
            "nrnk": "Account Representative IV",
            "telephone": "7408765",
            "ktelephone": "08",
            "mobile":"8986935",
            "kmobile": "050",
            "rld": "2017-12-07",
            "clearance": 4,
            "hr": "Pine View",
            "khr": 521
            },
            {
            "drg": 94,
            "stype": 55,
            "nstype": "Compensation Analyst",
            "firstName": "Aloise",
            "lastName": "Lissandrini",
            "tz": 420128795,
            "mi": 99508267,
            "rnk": 4,
            "nrnk": "Software Consultant",
            "telephone": "2554334779",
            "ktelephone": 5,
            "mobile": "6125215533",
            "kmobile": 10,
            "rld": "2018-03-01",
            "clearance": 1,
            "hr": "Talisman",
            "khr": 910
            }]
        /////////////////////////////////////////////////////////////////////////////

        // update the person's fields the update at the last iteration of Karting
        for (aka_record of aka_result.updated){
            // Checking if the user already exist and accept his object from Kartoffel
            await axios.get(`${process.env.KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}${aka_record[fn.aka.identityCard]}`)
            // if the person already exist in Kartoffel => only update the person.
            .then(async(person) => {
                let person_ready_for_kartoffel = matchToKartoffel(aka_record,"aka");
                await axios.put(`${process.env.KARTOFFEL_PERSON_API}${person.data.id}/personal`, person_ready_for_kartoffel)
                .then(()=>{
                    console.log(`${colors.green}The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data successfully update in Kartoffel`);
                })   
                .catch(err=>{
                    console.log(`${colors.red}Not update the person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data. The error message:"${err.response.data}"`);
                })
            })
            // if the person does not exist in Kartoffel => ignore from the record
            .catch(err=>{
                console.log(`${colors.red}Not update the person with identityCard: ${aka_record[fn.aka.identityCard]} from aka_raw_data. The error message:"${err.response.data}"`);
            });
        }
    });

    // nv_Data.then(async(nv_result) => {
    //     // integration of the data from the various sources and save the complete data on the server
    //     const nv_completeData = await nv_DataCompletion(nv_result,aka_result);
    //     // compare the new json with the oldest
    //     let last_nv_Json_name;
    //     try {
    //         last_nv_Json_name = fs.readFileSync(`./data/nv/completeData/archive/${nv_completeData.lastJsonName}`,'utf8'); 
    //         last_nv_Json_name =  JSON.parse(last_nv_Json_name);
    //     } catch(err) {
    //         if (err.code === 'ENOENT') {
    //             console.log(`${colors.yellow}this is the first running of nv and therefore there is no comparison!`);
    //         }
    //     }
        
    //     // extarct the new data of new & exist persons
    //     // const nv_diff = diff(last_nv_Json_name,nv_completeData.copmleteData,"personalNumber",{updateValues: 2 });
       
    //     // add the new persons to Kartoffel

    //     // /*only for TEST needs*/
    //     const update_nv_json = fs.readFileSync('/home/me/Desktop/nvcomp_UPDATE.txt','utf8');
    //     const nv_diff = diff(last_nv_Json_name,JSON.parse(update_nv_json),"personalNumber",{updateValues: 2 });
    //     // /*REMOVE UNTIL HERE*/

    //     // add the new persons to Kartoffel
    //     nv_diff.added.map((nv_person) => {
    //         axios.post(process.env.KARTOFFEL_ADDPERSON_API,nv_person)
    //         .then(()=>{
    //             console.log(`${colors.green}success to post ${nv_person.personalNumber} from nv`); 
    //         })
    //         .catch((error)=>{
    //             console.log(`${colors.red}failed to post ${nv_person.personalNumber} from nv. The error message: "${error.response.data}"`);
    //         })                
    //     })
    // });
    
    // es_Data.then(async(es_result) => {
    //     // integration of the data from the various sources and save the complete data on the server
    //     const es_completeData = await es_DataCompletion(es_result,aka_result)
    //     // compare the new json with the oldest
    //     let last_es_Json_name;
    //     try {
    //         last_es_Json_name = fs.readFileSync(`./data/es/completeData/archive/${es_completeData.lastJsonName}`,'utf8'); 
    //         last_es_Json_name =  JSON.parse(last_es_Json_name);
    //         // console.log(`888888888888888888888888888888es_completeData.lastJsonName: ${es_completeData.lastJsonName}`)
    //         // console.log(`888888888888888888888888888888last_es_Json_name: ${last_es_Json_name}`)
    //         // console.log(`888888888888888888888888888888completeData: ${es_completeData.completeData}`)
    //     } catch(err) {
    //         if (err.code === 'ENOENT') {
    //             console.log(`${colors.yellow}this is the first running of es and therefore there is no comparison!`);
    //         }
    //     }
     
    //     // extarct the new data of new & exist persons
    //     // const es_diff = diff(last_es_Json_name,es_completeData.copmleteData,"personalNumber",{updateValues: 2 });          
        
    //     // /*ONLY for TEST needs*/
    //     const update_es_json = fs.readFileSync('/home/me/Desktop/escomp_UPDATE.txt','utf8');
    //     const es_diff = diff(last_es_Json_name,JSON.parse(update_es_json),"personalNumber",{updateValues: 2 });
    //     // /*REMOVE UNTIL HERE*/
        
        
    //     // add the new persons to Kartoffel
    //     es_diff.added.map(es_person => {
    //         axios.post(process.env.KARTOFFEL_ADDPERSON_API,es_person)
    //         .then(()=>{
    //             console.log(`${colors.green}success to post ${es_person.personalNumber} from es`); 
    //         })
    //         .catch((error)=>{
    //             console.log(`${colors.red}failed to post ${es_person.personalNumber} from es. The error message: "${error.response.data}"`);               
    //         })                
    //     })
    // });
// });