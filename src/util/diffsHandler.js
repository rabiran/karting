const p = require('../config/paths');
const matchToKartoffel = require('./matchToKartoffel');
const axios = require('axios');
const completeFromAka = require('./completeFromAka');
const fn = require('../config/fieldNames');
const logger = require('./logger');
const getAData = require("./getActiveDirectoryData")
require('dotenv').config();
/*
 * diffsObj - object that contain the results of diffs checking (added,updated,same,removed & all)
 * dataSource - string the express the name of the data source
 * aka_all_data - object that contain all the recent data from aka
 */

const added = async (diffsObj, dataSource, aka_all_data) => {
    if (dataSource === "nv") {
        diffsObj = await getAData(diffsObj);
    };
    for (record of diffsObj) {
        // Define the unique changes for each "dataSource"
        let person_existence_checking;
        if (dataSource === "es") {
            person_existence_checking = `${p(record[fn.es.identityCard]).KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API}`;
        }
        else if (dataSource === "nv") {
            person_existence_checking = `${p(record.personalNumber).KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_PN_API}`;
        };

        let person_ready_for_kartoffel = await matchToKartoffel(record, dataSource);
        // Checking if the person is already exist in Kartoffel and accept his object from Kartoffel
        await axios.get(person_existence_checking)
            // if the person is already exist in Kartoffel => only add secodary user.
            .then((person) => {
                let user_object = {
                    personId: person.data.id,
                    fullString: person.data.mail,
                    isPrimary: false,
                };
                axios.post(p().KARTOFFEL_DOMAIN_USER_API, user_object)
                    .then((user) => {
                        logger.info(`Create the user ${user.data.secondaryDomainUsers} to the person with personalNumber: ${user.data.personalNumber} from ${dataSource}_complete_data successfully`);
                    })
                    .catch((err) => {
                        logger.error(`Not create user to person with the identifyer: ${user_object.personId} from ${dataSource}_complete_data. The error message:"${err.response.data}"`);
                    })
            })



            // if the person does not exist in Kartoffel => complete the data from aka (if exist), add him to specific hierarchy & adding primary user    
            .catch((err) => {
                // check if the perosn not exist in Kartoffel (404 status), or if there is another error
                if (err.response.status === 404) {
                    // complete the data from aka (if exist):
                    person_ready_for_kartoffel = completeFromAka(person_ready_for_kartoffel, aka_all_data, dataSource);
                    // Add the complete person object to Kartoffel
                    axios.post(p().KARTOFFEL_PERSON_API, person_ready_for_kartoffel)
                        .then((person) => {
                            logger.info(`The person with personalNumber: ${person_ready_for_kartoffel.personalNumber} from ${dataSource}_complete_data successfully insert to Kartoffel`);
                            // add primary user to the new person
                            let user_object = {
                                personId: person.data.id,
                                fullString: person.data.mail,
                                isPrimary: true,
                            };
                            axios.post(p().KARTOFFEL_DOMAIN_USER_API, user_object)
                                .then((user) => {
                                    logger.info(`Create the user ${user.data.primaryDomainUser} to the person with personalNumber: ${user.data.personalNumber} from ${dataSource}_complete_data successfully.`);
                                })
                                .catch((err) => {
                                    logger.error(`Not create user to person with the identifyer: ${user_object.personId} from ${dataSource}_complete_data. The error message:"${err.response.data}"`);
                                })
                        })
                        .catch(err => {
                            person_ready_for_kartoffel.personalNumber;
                            let identifyer = person_ready_for_kartoffel.personalNumber;
                            logger.error(`Not insert the person with the identifyer: ${identifyer} from ${dataSource}_complete_data to Kartoffel. The error message:"${err.response.data}"`);
                        })

                } else {
                    let identifyer = (dataSource === "nv") ? record.uniqueId : record.personalNumber;
                    logger.error(`The person with the identifyer: ${identifyer} from ${dataSource}_raw_data not found in Kartoffel. The error message:"${err.response.data}"`);
                };
            })
    }
}

module.exports = (diffsObj, dataSource, aka_all_data) => {
    if (process.env.NODE_ENV !== "production") {
        //////////////////////MOCK-DELETE AT PRODACTION//////////////////////////////
        switch (dataSource) {
            case "es":
                diffsObj.updated = [{
                    "entity": 68,
                    "stype": 54,
                    "firstName": "Hasheem",
                    "lastName": "Derricoat",
                    "tz": 641939790,
                    "mi": 60254221,
                    "rnk": "אאא",
                    "vphone": "1986624807",
                    "cphone": "4312832987",
                    "mail": undefined,
                    "rld": "2018-08-15",
                    "adr": "3647 Del Mar Place",
                    "hr": "lamba/משרד רואה חשבון/gamba",
                    "tf": "Librarian",
                    "su": "hderricoat0@ucoz.com"
                },
                {
                    "entity": 58,
                    "stype": 54,
                    "firstName": "Ruthy",
                    "lastName": "Sivyer",
                    "tz": 797623584,
                    "mi": 42923825,
                    "rnk": "Product Engineer",
                    "vphone": "3547388848",
                    "cphone": "6062384437",
                    "mail": undefined,
                    "rld": "2018-05-08",
                    "adr": "913 Union Parkway",
                    "hr": "lamba/sabmba/gamba",
                    "tf": "Internal Auditor",
                    "su": "rsivyer1@marketwatch.com"
                }]
                diffsObj.added = [
                    {
                        "entity": 68,
                        "stype": "tamar",
                        "firstName": "Hasheem",
                        "lastName": "Derricoat",
                        "tz": 641939790,
                        "mi": 60254221,
                        "rnk": "rookie",
                        "vphone": null,
                        "cphone": "4312832987",
                        "mail": "hderricoat0@cnet.com",
                        "rld": "2018-08-15",
                        "adr": "3647 Del Mar Place",
                        "hr": "afeka/pikus/lab101",
                        "tf": "Librarian",
                        "su": "hderricoat0@ucoz.com"
                    },
                    {
                        "entity": 58,
                        "stype": "tamar",
                        "firstName": "Ruthy",
                        "lastName": "Sivyer",
                        "tz": 797623584,
                        "mi": 42923825,
                        "rnk": "rookie",
                        "vphone": "023487226",
                        "cphone": "6062384437",
                        "mail": null,
                        "rld": "2018-05-08",
                        "adr": "913 Union Parkway",
                        "hr": "מכללה/פקולטה/כיתה",
                        "tf": "Internal Auditor",
                        "su": null
                    }
                ]
                break;
            case "nv":
                diffsObj.added = [
                    {
                        "fullName": "Flint Shallcroff",
                        "uniqueId": "fshallcroff0@phpbb.com",
                        "hr": "shnizel/bamba/bisli60"
                    },
                    {
                        "fullName": "Fionna Shinfield",
                        "uniqueId": "fshinfield1@paginegialle.it",
                        "hr": "shnizel/bamba/bisli60"
                    }
                ]
                diffsObj.updated = [
                    {
                        "fullName": "Flint Shallcroff",
                        "uniqueId": "fshallcroff0@phpbb.com",
                        "hr": "shnizel/bamba/bisli60"
                    },
                    {
                        "fullName": "Fionna Shinfield",
                        "uniqueId": "fshinfield1@paginegialle.it",
                        "hr": "shnizel/bamba/bisli60"
                    }
                ]
                break;
            case "aka":
                diffsObj.updated = [
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
                        "telephone": "9554334779",
                        "ktelephone": 5,
                        "mobile": "6125215533",
                        "kmobile": 10,
                        "rld": "2018-03-01",
                        "clearance": 1,
                        "hr": "Talisman",
                        "khr": 910
                    }]
                break;
            default:
                logger.error("'dataSource' variable must be attached to 'diffsHandler - MOCK' function");
        }
        /////////////////////////////////////////////////////////////////////////////
    }
    //added the new person from es to Kartoffel
    added(diffsObj.added, dataSource, aka_all_data);


};
