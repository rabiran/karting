const faker = require('faker')
const ad = require("./AD.json")
const ae = require("./getAkaEmployees.json")
// const at = require("./getAkaTelephone.json")
// const es = require("./mocksFiles/eightsocks.json")
const fs = require("fs")
let adUsers = [];

// sync between ad and akaemployeess for first and last name
for (let i = 0; i < 250; i++) {
  for (let j = 0; j < 250; j++) {
    if(ae[j].mi == ad[i].userPrincipalName.split('M')[1]) {
      ae[j].firstName = ad[i].KfirstName;
      ae[j].lastName = ad[i].KlastName;
    }
  }
}

fs.writeFileSync("getAkaEmployees.json", JSON.stringify(ae))