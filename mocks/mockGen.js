const fs = require("fs");
const faker = require('faker');
const mi = require("./lists/miList.json");
const tz = require("./lists/tzList.json");
const utils = require("./mockUtils");
const dataTypes = require("./lists/dataTypesList");
let mis = [];
let tzs = [];
let employees = [];
let telephones = [];
let adUsers = [];
let esUsers = [];

// Generating mi and tz lists
for (let i = 0; i < 300; i++) {
    let tz = faker.random.number({'min': 10000000,'max': 99999999});
    tzs.push(utils.generateID());

    mis.push(faker.random.number({'min': 100000,'max': 999999999}));
}

fs.writeFileSync("./lists/miList.json", JSON.stringify(mis))
fs.writeFileSync("./lists/tzList.json", JSON.stringify(tzs))


// Generating employee and telephones objects for aka
for (let i = 0; i < 300; i++) {
    employees.push({
    "firstName": faker.name.firstName(),
    "lastName": faker.name.lastName(),
    "tz": tz[i],
    "mi": mi[i],
    "clearance": faker.random.number({'min': 0,'max': 10}),
    "rnk": utils.randomElement(dataTypes.RANK),
    "nstype": utils.randomElement(dataTypes.SERVICE_TYPE),
    "rld": faker.date.between(faker.date.future(10),
                              faker.date.past(10)).toISOString().split('T')[0] + " 00:00:00.0",
    "hr": utils.randomElement(dataTypes.UNIT)
    })
    telephones.push({
        "mi": mi[i],
        "telephone": faker.random.number({'min': 1000000,'max': 9999999}),
        "ktelephone": faker.random.number({'min': 10,'max': 59}),
        "telephoneType": faker.random.number({'min': 1,'max': 2})
    })
}

// Generating AD employees objects
for (let i = 0; i < 150; i++) {
    let ad = {}
    ad.KfirstName = employees[i].firstName;
    ad.KlastName = employees[i].lastName;
    const job = faker.name.jobTitle();
    ad.userPrincipalName = "M" + employees[i].mi;
    ad.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                   job + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" + dataTypes.DOMAIN_MAP[0][0];
    adUsers.push(ad);
  }

// Generating AD unemployee objects
for (let i = 0; i < 100; i++) {
    let ad = {}
    ad.KfirstName = faker.name.firstName();
    ad.KlastName = faker.name.lastName();
    const job = faker.name.jobTitle();

    const tz = faker.random.number({'min': 10000000,'max': 99999999});
    ad.userPrincipalName = "D" + utils.generateID();
    ad.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                   job + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" + dataTypes.DOMAIN_MAP[0][0];
    adUsers.push(ad)
}

// Generating es employee objects
for (let i = 0; i < 50; i++) {
    let user = {};
    user.stype = utils.randomElement(dataTypes.SERVICE_TYPE);
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.tz = utils.randomElement([utils.generateID(), tzs[250 + i]]);

    if (user.tz === tzs[250 + i]) {
        user.mi = mis[250 + i];
        user.entity = dataTypes.ENTITY_TYPE[1];
        user.rnk = utils.randomElement(dataTypes.RANK);
        user.rld = employees[250 + i].rld;
    } else {
        user.mi = user.tz;
        user.entity = dataTypes.ENTITY_TYPE[0];
        user.rnk = null;
        user.rld = null;
    }

    user.vphone = faker.random.number({'min': 1000, "max": 9999}).toString();
    user.cphone = faker.random.number({'min': 50, 'max': 59}) + "-" +
                  faker.random.number({'min': 1000000, 'max': 9999999});
                  user.hr = faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word();
    user.tf = faker.name.jobType();
    user.userName = faker.internet.userName(user.firstName, user.lastName);
    user.mail = user.userName + '@' + dataTypes.DOMAIN_MAP[2][0];

    esUsers.push(user);
}

fs.writeFileSync("./mocksFiles/getAkaEmployees.json", JSON.stringify(employees));
fs.writeFileSync("./mocksFiles/getAkaTelephone.json", JSON.stringify(telephones));
fs.writeFileSync("./mocksFiles/AD.json", JSON.stringify(adUsers));
fs.writeFileSync("./mocksFiles/eightsocks.json", JSON.stringify(esUsers));
