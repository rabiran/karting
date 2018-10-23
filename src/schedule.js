const schedule = require("node-schedule");
const axios = require('axios');
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const nv = require('./nv/nv_synchronizeData');
const colors = require('./util/colorsForLogs');
const matchToKartoffel = require('./util/matchToKartoffel');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');

// const trialLog = schedule.scheduleJob('22 * * * *',async()=>{
//////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
const devSchedual = async()=>{
/////////////////////////////////////////////////////////////////////////////

    
    // get the new json from aka & save him on the server
    let aka_data = await aka();
    
    // get the new json from es & save him on the server
    let es_Data = es().then((esDiffs)=>{
        diffsHandler(esDiffs, "es", aka_data.all);
    });
    // get the new json from nv & save him on the server
    let nv_Data = nv().then((nvDiff)=>{
        diffsHandler(nvDiff, "nv", aka_data.all);
    });


    // update the person's fields the update at the last iteration of Karting
    for (aka_record of aka_data.updated){
        // Checking if the person already exist and accept his object from Kartoffel
        await axios.get(`${p().KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}${aka_record[fn.aka.identityCard]}`)
        // if the person already exist in Kartoffel => only update the person.
        
        
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^uncomment after Kartoffel update^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // .then(async(person) => {
        //     let person_ready_for_kartoffel = matchToKartoffel(aka_record,"aka");
            
        //     await axios.put(`${p().KARTOFFEL_PERSON_API}:${person.data.id}`, person_ready_for_kartoffel)
        //     .then(()=>{
        //         console.log(`${colors.green}The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data successfully update in Kartoffel`);
        //     })   
        //     .catch(err=>{
        //         console.log(`${colors.red}Not update the person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data. The error message:"${err.response.data}"`);
        //     })
        // })
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^uncomment after Kartoffel update^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


        // if the person does not exist in Kartoffel => ignore from the record
        .catch(err=>{
            console.log(`${colors.red}Not update the person with identityCard: ${aka_record[fn.aka.identityCard]} from aka_raw_data. The error message:"${err.response.data}"`);
        });
    }




//////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
};
devSchedual();
/////////////////////////////////////////////////////////////////////////////
// });




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
        
   