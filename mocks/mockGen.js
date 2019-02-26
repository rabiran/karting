const fs = require("fs")
const faker = require('faker')
const mi = require("./lists/miList.json")
const tz = require("./lists/tzList.json")
let mis = [];
let tzs = [];
let employees = [];
let telephones = [];
let adUsers = [];

// Generating mi and tz lists
for (let i = 0; i < 250; i++) {
    mis.push(faker.random.number({'min': 100000,'max': 999999999}))
    tzs.push(faker.random.number({'min': 100000,'max': 999999999}))
}

fs.writeFileSync("./lists/miList.json", JSON.stringify(mis))
fs.writeFileSync("./lists/tzList.json", JSON.stringify(tzs))


// Generating employee and teelephones objects
for (let i = 0; i < 250; i++) {
    employees.push({
    "firstName":faker.name.firstName(),
    "lastName":faker.name.lastName(),
    "tz":tz[i],
    "mi":mi[i],
    "clearance":faker.random.number({'min': 0,'max': 10}),
    "rnk": "mega",
    "stype": "a",
    "rld":"2017-12-07",
    })
    telephones.push({
        "mi": mi[i],
        "telephone":faker.random.number({'min': 1000000,'max': 9999999}),
        "ktelephone":faker.random.number({'min': 10,'max': 99}),
        "telephoneType": faker.random.number({'min': 1,'max': 5})
    })
}

// Generating AD employees objects
for (let i = 0; i < 150; i++) {
    ad = {}
    ad.KfirstName = employees[i].firstName;
    ad.KlastName = employees[i].lastName;
    ad.Kjob = faker.name.jobTitle();
    ad.userPrincipalName = "M" + employees[i].mi;
    ad.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                      ad.Kjob + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" +faker.internet.email().split('@')[1];
    adUsers.push(ad)
  }

// Generating AD unemployee objects
for (let i = 0; i < 100; i++) {
    ad = {}
    ad.KfirstName = faker.name.firstName();
    ad.KlastName = faker.name.lastName();
    ad.Kjob = faker.name.jobTitle();
    ad.userPrincipalName = "D" + faker.random.number({'min': 100000,'max': 999999999});
    ad.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                      ad.Kjob + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" +faker.internet.email().split('@')[1];
    adUsers.push(ad)
}

fs.writeFileSync("./mocksFiles/getAkaEmployees.json", JSON.stringify(employees))
fs.writeFileSync("./mocksFiles/getAkaTelephone.json", JSON.stringify(telephones))
fs.writeFileSync("./mocksFiles/AD.json", JSON.stringify(adUsers))
