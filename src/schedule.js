const schedule = require("node-schedule");
const diff = require("diff-arrays-of-objects");
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const nv = require('./nv/nv_synchronizeData');

//loads the environment variables from '.env' file into process.env
require('dotenv').config()

// const trialLog = schedule.scheduleJob('02 * * * *',async()=>{
    // get the new json from aka & save him on the server
    let aka_updateData = aka();
    aka_updateData.then(data=>console.log(data));
    // get the new json from es & save him on the server
    let es_updateData = es();
    es_updateData.then(data=>console.log(data));
    // get the newrs json from nv & save him on the server
    let nv_updateData = nv();
    nv_updateData.then(data=>console.log(data));
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
// });