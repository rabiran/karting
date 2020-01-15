const fs = require("fs");
const faker = require('faker');
const utils = require("./mockUtils");
const dataTypes = require("./lists/dataTypesList");
const miriTypes = require("./lists/miriTypes");

const akaAmount = 400;
const ADAmount = 250;
const ADEmployeesAmount = ADAmount - 100;
const ADUnemployeesAmount = ADAmount - ADEmployeesAmount;
const esAmount = 50;
const miriAmount = 100;
const miriAkaStart = ADAmount + esAmount;

let mis = [];
let tzs = [];
let employees = [];
let telephones = [];
let adUsers = [];
let esUsers = [];
let miriUsers = [];

// Generating mi and tz lists
for (let i = 0; i < akaAmount; i++) {
    tzs.push(utils.generateID());
    mis.push(faker.random.number({'min': 100000,'max': 999999999}).toString());
}

// Generating employee and telephones objects for aka
for (let i = 0; i < akaAmount; i++) {
    employees.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    tz: tzs[i],
    mi: mis[i],
    clearance: faker.random.number({'min': 0,'max': 10}).toString(),
    rnk: utils.randomElement(dataTypes.RANK),
    nstype: utils.randomElement(dataTypes.SERVICE_TYPE),
    rld: faker.date.between(faker.date.future(10),
                              faker.date.past(10)).toISOString().split('T')[0] +
                              " 00:00:00.0",
    hr: utils.randomElement(dataTypes.UNIT)
    })
    telephones.push({
        mi: mis[i],
        telephone: utils.generateNumberBody(),
        ktelephone: utils.generateNumberPrefix(),
        telephoneType: faker.random.number({'min': 1,'max': 2})
    });
}

// Generating AD employees objects
for (let i = 0; i < ADEmployeesAmount; i++) {
    let ad = {}
    ad.KfirstName = employees[i].firstName;
    ad.KlastName = employees[i].lastName;
    ad.userPrincipalName = "M" + employees[i].mi;
    const job = faker.name.jobTitle();
    ad.hierarchy = faker.lorem.word() + "/" +
                   faker.lorem.word() + "/" +
                   faker.lorem.word() + "/" +
                   job + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" + dataTypes.DOMAIN_MAP[0][0];
    adUsers.push(ad);
    // change the matched aka record's hr to ads unit type
    employees[i].hr = utils.randomElement(dataTypes.ADS_UNIT);
  }

// Generating AD unemployee objects
for (let i = 0; i < ADUnemployeesAmount; i++) {
    let ad = {}
    ad.KfirstName = faker.name.firstName();
    ad.KlastName = faker.name.lastName();
    const job = faker.name.jobTitle();
    ad.userPrincipalName = "D" + utils.generateID();
    ad.hierarchy = faker.lorem.word() + "/" +
                   faker.lorem.word() + "/" +
                   faker.lorem.word() + "/" +
                   job + " - " + ad.KfirstName + " " + ad.KlastName;
    ad.sAMAccountName = faker.internet.email().split('@')[0];
    ad.mail = ad.sAMAccountName + "@" + dataTypes.DOMAIN_MAP[0][0];
    adUsers.push(ad)
}

// Generating es employee/unemployee objects
for (let i = 0; i < esAmount; i++) {
    let user = {};
    user.tz = utils.randomElement([utils.generateID(), tzs[250 + i]]);

    // employee
    if (user.tz === tzs[ADAmount + i]) {
        user.stype = employees[ADAmount + i].nstype;
        user.firstName = employees[ADAmount + i].firstName;
        user.lastName = employees[ADAmount + i].lastName;
        user.mi = mis[ADAmount + i];
        user.entity = dataTypes.ENTITY_TYPE[1];
        user.rnk = utils.randomElement(dataTypes.RANK);
        user.rld = employees[250 + i].rld;
        // change the matched aka record's hr to es unit type
        employees[250 + i].hr = utils.randomElement(dataTypes.ES_UNIT);
    // unemployee
    } else {
        user.stype = utils.randomElement(dataTypes.SERVICE_TYPE);
        user.mi = user.tz;
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.entity = dataTypes.ENTITY_TYPE[0];
        user.rnk = null;
        user.rld = null;
    }

    user.vphone = faker.random.number({'min': 1000, "max": 9999}).toString();
    user.cphone = utils.generateNumberPrefix() + "-" + utils.generateNumberBody();
                  user.hr = faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word();
    user.tf = faker.name.jobType();
    user.userName = faker.internet.userName(user.firstName, user.lastName);
    user.mail = user.userName + '@' + dataTypes.DOMAIN_MAP[2][0];

    esUsers.push(user);
}

for (let i = 0; i < miriAmount; i++) {
    let miriUser = {};
    miriUser.domUser = utils.randomElement(miriTypes.idPrefixes) +
                  faker.random.number({'min': 100000,'max': 999999999}).toString() +
                  '@' + utils.randomElement([dataTypes.DOMAIN_MAP[4][0],
                                         dataTypes.DOMAIN_MAP[4][0],
                                         dataTypes.DOMAIN_MAP[4][0],
                                         dataTypes.DOMAIN_MAP[5][0],
                                         dataTypes.DOMAIN_MAP[6][0]]);
    miriUser.telephone = '0' + utils.generateNumberPrefix() + utils.generateNumberBody();
    miriUser.clearance = faker.random.number({'min': 1, 'max': 5});
    miriUser.firstName = faker.name.firstName();
    miriUser.lastName = faker.name.firstName();
    miriUser.mail = utils.randomElement(['לא ידוע',
                                   'לא ידוע',
                                   null,
                                   null,
                                   "",
                                   "",
                                   faker.internet.email().split('@')[0] + '@' + miriTypes.miriMail]);
    miriUser.tz = utils.randomElement([utils.generateID(), '', 'לא ידוע', null]);
    miriUser.personalNumber = utils.randomElement([mis[miriAkaStart + i], '', 'לא ידוע', null]);
    miriUser.rank = utils.randomElement(dataTypes.RANK);
    miriUser.rls = utils.randomElement([faker.date.between(faker.date.future(10), faker.date.past(10)).toISOString().split('T')[0] + " 00:00:00.0"], null, "", 'לא ידוע');
    miriUser.job = faker.name.jobTitle();
    miriUser.department = faker.commerce.department();
    miriUser.stype = '';
    miriUser.hr = utils.randomElement([faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word(), `${miriUser.firstName} ${miriUser.lastName}`, null, ""]);
    miriUser.company = utils.randomElement([...miriTypes.rootHierarchy, "", null, 'לא ידוע']);
    miriUser.isPortalUser = utils.randomElement([true, false]);
    miriUsers.push(miriUser);
}

fs.writeFileSync("./mocksFiles/getAkaEmployees.json", JSON.stringify(employees));
fs.writeFileSync("./mocksFiles/getAkaTelephone.json", JSON.stringify(telephones));
fs.writeFileSync("./mocksFiles/AD.json", JSON.stringify(adUsers));
fs.writeFileSync("./mocksFiles/eightsocks.json", JSON.stringify(esUsers));
fs.writeFileSync("./mocksFiles/city.json", JSON.stringify(miriUsers));
