const faker = require('faker')
// const ad = require("./AD.json")
const ae = require("./getAkaEmployees.json")
const at = require("./getAkaTelephone.json")
// const es = require("./mocksFiles/eightsocks.json")
const fs = require("fs")
let adUsers = [];

// sync between ad and akaemployeess for first and last name
for (let i = 0; i < 250; i++) {
    at[i].mi  = ae[i].mi;
    at[i].mi = ae[i].mi;
    at[i].ktelephone = faker.random.number({'min': 10,'max': 99});
    at[i].telephone = faker.random.number({'min': 1000000,'max': 9999999});
}

fs.writeFileSync("getAkaTelephone.json", JSON.stringify(at))