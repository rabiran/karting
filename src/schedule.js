const schedule = require("node-schedule");
const diff = require("diff-arrays-of-objects");
const aka = require('./AKA_synchronizeData');
const es = require('./ES_synchronizeData');
const nv = require('./NV_synchronizeData');

//loads the environment variables from '.env' file into process.env
require('dotenv').config()

const trialLog = schedule.scheduleJob('01 * * * *',async()=>{
    // get the new json from aka & save him on the server
    aka();
    es();
    nv();
    
    // compare the new json with the oldest          
    // let result = diff(oldJson,API_Json,"id",{updateValues: 2 });

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

