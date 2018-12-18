const faker = require('faker')
const nv = require("./mocksFiles/nVa.json")
const fs = require("fs")
let adUsers = [];

for (let i = 0; i < nv.length; i++) {
  adUser = {
    sAMAccountName: nv[i].uniqueId.split('@')[0].toUpperCase(),
    mail: faker.internet.email(),
    userPrincipalName: faker.random.number(),
  }
  adUsers.push(adUser)
}

fs.writeFileSync("AD.json", JSON.stringify(adUsers))