const fs = require('fs');
const schedule = require("node-schedule");
const axios = require("axios");
const diff = require("diff-arrays-of-objects");

//loads the environment variables from '.env' file into process.env
require('dotenv').config()


const trialLog = schedule.scheduleJob('55 * * * *',async()=>{

    // get the jsons from the remote server
    API_Json_7 = await axios.get(process.env.UPDATE_JSON_API_7)
        .then((response)=>{
            return response.data;
        });
    
    // read the current json files
    let oldJson_7 = fs.readFileSync(process.env.OLD_JSON_LOCATION_7);
    oldJson_7 = JSON.parse(oldJson_7);
   
    // compare the new json with the oldest          
    let result = diff(oldJson_7,API_Json_7,"id",{updateValues: 2 });
    
    // add the new persons to Kartoffel
    axios.post(process.env.KARTOFFEL_ADDPERSON_API,result.added)
        .then(()=>{
            console.log('success to post :)');
        })
        .catch((error)=>{
            console.log('failed to post :(');
            console.log(error);                
        })

    //Update the persons that already exist in Kartoffel
    

});
