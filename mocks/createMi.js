// const faker = require('faker')
// const fs = require("fs")
// let mis = [];

// for (let i = 0; i < 250; i++) {
//     mis.push(faker.random.number({'min': 100000,'max': 999999999}))
// }

// fs.writeFileSync("miList.json", JSON.stringify(mis))

// fs.writeFileSync("tzList.json", JSON.stringify(mis))

const mi = require("./lists/miList.json")
const tz = require("./lists/tzList.json")
const fs = require("fs")
const ae = require("./getAkaEmployees.json")

// sync between ad and akaemployeess for first and last name
for (let i = 0; i < 250; i++) {
  ae[i].mi = mi[i]
  ae[i].tz = tz[i]
}

fs.writeFileSync("getAkaEmployees.json", JSON.stringify(ae))