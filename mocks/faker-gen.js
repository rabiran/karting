const faker = require('faker')
const nv = require("./mocksFiles/nVa.json")
const fs = require("fs")
let adUsers =[];

for (let i =0; i < nv.length; i++) {
    adUser = {
        uniqueId: nv[i].uniqueId,
        email: faker.internet.email(),
        mi: faker.random.number(),
      }
    adUsers.push(adUser)
}

fs.writeFileSync("AD.json", JSON.stringify(adUsers))