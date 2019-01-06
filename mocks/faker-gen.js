const faker = require('faker')
const ad = require("./mocksFiles/AD.json")
const ae = require("./mocksFiles/getAkaEmployees.json")
const at = require("./mocksFiles/getAkaTelephone.json")
const es = require("./mocksFiles/eightsocks.json")
const fs = require("fs")
let adUsers = [];
console.log(at.length + " " + ad.length + " " +ae.length + " " +es.length)
for (let i = 0; i < ad.length; i++) {
  at[i].mi = ad[i].userPrincipalName;
  ae[i].mi = ad[i].userPrincipalName;
  es[i].tz = ae[i].tz;
  es[i].mi = ae[i].mi;
}

fs.writeFileSync("getAkaTelephone.json", JSON.stringify(at))
fs.writeFileSync("getAkaEmployees.json", JSON.stringify(ae))
fs.writeFileSync("eightsocks.json", JSON.stringify(es))