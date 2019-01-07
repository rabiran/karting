const faker = require('faker')
const fs = require("fs")
const ad = require("./AD.json")
const nvUsers = require("./mocksFiles/nVa.json")

// connecting between nva and ad
for (let i = 0; i < 250; i++) {
  nvUsers[i].fullName = ad[i].KfirstName + " " + ad[i].KlastName;
  nvUsers[i].uniqueId = ad[i].mail;
}

fs.writeFileSync("nVa.json", JSON.stringify(nvUsers))