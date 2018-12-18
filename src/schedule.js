const schedule = require("node-schedule");
const axios = require('axios');
const aka = require('./aka/aka_synchronizeData');
const es = require('./es/es_synchronizeData');
const nv = require('./nv/nv_synchronizeData');
const matchToKartoffel = require('./util/matchToKartoffel');
const fn = require('./config/fieldNames');
const p = require('./config/paths');
const diffsHandler = require('./util/diffsHandler');
const logger = require('./util/logger');
require('dotenv').config();


// const trialLog = schedule.scheduleJob(fn.runningTime,async()=>{
//////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
const devSchedual = async () => {
    /////////////////////////////////////////////////////////////////////////////

    // check if the root hierarchy exist and adding it if not
    await axios.get(p(encodeURIComponent(fn.rootHierarchy)).KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API)
        .then((result) => {
            logger.info(`The root hierarchy "${result.data.name}" already exist in Kartoffel`);
        })
        .catch(async () => {
            await axios.post(p().KARTOFFEL_ADDGROUP_API, { name: fn.rootHierarchy })
                .then((result) => {
                    logger.info(`Success to add the root hierarchy "${result.data.name}" to Kartoffel`);
                })
                .catch((err) => {
                    let errorMessage = (err.response) ? err.response.data : err.message;
                    logger.error(`Failed to add the root hierarchy to Kartoffel. the error message: "${errorMessage}"`);
                })
        });

    // get the new json from aka & save him on the server
    let aka_data = await aka();

    // get the new json from es & save him on the server
    let es_Data = es().then((esDiffs) => {
        diffsHandler(esDiffs, "es", aka_data.all);
    });
    // get the new json from nv & save him on the server
    let nv_Data = nv().then((nvDiff)=>{
        diffsHandler(nvDiff, "nv", aka_data.all);
    });

    if (process.env.NODE_ENV !== "production") {
        //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
        aka_data.updated = [
            {
                "drg": 61,
                "stype": 41,
                "nstype": "Quality Engineer",
                "firstName": "Trcie",
                "lastName": "Butterick",
                "tz": 123456,
                "mi": 95579169,
                "rnk": 70,
                "nrnk": "Account Representative IV",
                "telephone": "7408765",
                "ktelephone": "08",
                "mobile": "7086935",
                "kmobile": "050",
                "rld": "2017-12-07",
                "clearance": 4,
                "hr": "Pine View",
                "khr": 521
            }]
        /////////////////////////////////////////////////////////////////////////////
    }
    // update the person's fields that update in the last iteration of Karting
    for (aka_record of aka_data.updated) {
        // Checking if the person already exist and accept his object from Kartoffel
        await axios.get(`${p().KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}${aka_record[fn.aka.identityCard]}`)
            // if the person already exist in Kartoffel => only update the person.
            .then(async (person) => {
                let person_ready_for_kartoffel = matchToKartoffel(aka_record, "aka");
                await axios.put(`${p(person.data.id).KARTOFFEL_UPDATE_PERSON_API}`, person_ready_for_kartoffel)
                    .then(() => {
                        logger.info(`The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data successfully update in Kartoffel`);
                    })
                    .catch(err => {
                        logger.warn(`The person with identityCard: ${person_ready_for_kartoffel.identityCard} from aka_raw_data not exist in Kartoffel. The Kartoffel message:"${err.response.data}"`);
                    })
            })

            // if the person does not exist in Kartoffel => ignore from the record
            .catch(err => {
                let errorMessage = (err.response) ? err.response.data : err.message;
                logger.warn(`Not update the person with identityCard: ${aka_record[fn.aka.identityCard]} from aka_raw_data. The error message:"${errorMessage}"`);
            });
    }


    //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
};
devSchedual();
/////////////////////////////////////////////////////////////////////////////
// });