const fs = require("fs");
const faker = require('faker');
const utils = require("./mockUtils");
const dataTypes = require("./lists/dataTypesList");
const miriTypes = require("./lists/miriTypes");
const dataTypesList = require("./lists/dataTypesList");

const akaAmount = 400;
const ADAmount = 250;
const ADEmployeesAmount = ADAmount - 100;
const ADUnemployeesAmount = ADAmount - ADEmployeesAmount;
const esAmount = 50;
const miriAmount = 100;
const miriAkaStart = ADAmount + esAmount;
const picturesAmount = 400;
const MMAmount = 200;

let mis = [];
let tzs = [];
let employees = [];
let telephones = [];
let adUsers = [];
let esUsers = [];
let miriUsers = [];
let sfUsers = [];
let pictures = [];

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
                              faker.date.past(10)).toISOString(),
    hr: utils.randomElement(dataTypes.UNIT),
    birthday: faker.date.between(faker.date.past(18),
    faker.date.past(40)).toISOString(),
    sex: utils.randomElement(["m","f"])
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
    ad.guName = employees[i].firstName;
    ad.KlastName = employees[i].lastName;
    ad.userPrincipalName = "M" + employees[i].mi;
    const job = faker.name.jobTitle();
    ad.Kjob = job;
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
    ad.Kjob = job;
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
    user.location = faker.name.jobTitle();
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
    miriUser.rld = utils.randomElement(
      [
        faker.date
          .between(faker.date.future(10), faker.date.past(10))
          .toISOString()
      ,
      null,
      "",
      "לא ידוע"]
    );
    miriUser.job = faker.name.jobTitle();
    miriUser.profession = utils.randomElement([
      faker.name.jobType(),
      faker.name.jobType(),
      "",
      "לא ידוע",
      "null"
    ]);
    miriUser.department = utils.randomElement(dataTypes.CITY_UNIT);
    miriUser.stype = '';
    miriUser.hr = utils.randomElement([faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word() + "/" +
                  faker.lorem.word(), `${miriUser.firstName} ${miriUser.lastName}`, null, ""]);
    miriUser.company = utils.randomElement([...miriTypes.rootHierarchy, "", null, 'לא ידוע']);
    miriUser.isPortalUser = utils.randomElement([true, false]);
    miriUser.tags = []
    for (let i = 0; i < faker.random.number({'min': 0, 'max': 2}); i++) {
        miriUser.tags.push(utils.randomElement(dataTypes.MIRI_TAGS));
        console.log(i)
    }
    miriUser.domains = utils.randomArrFromArr(dataTypesList.MIRI_DOMAINS);
    miriUsers.push(miriUser);
}

// Generating SF employee/unemployee objects
for (let i = 0; i < MMAmount; i++) {
    let sf = {}

    sf.firstName = employees[i].firstName;
    sf.lastName = employees[i].lastName;
    sf.userName = faker.internet.userName(sf.firstName, sf.lastName);
    sf.fullName = sf.firstName.concat(' ',sf.lastName);
    sf.sex = utils.randomElement(["m","f"])
    sf.personalNumber = employees[i].mi;
    sf.tz = employees[i].tz;
    sf.stype = utils.randomElement(dataTypes.SERVICE_TYPE);
    sf.hierarchy = [faker.lorem.word(),
                   faker.lorem.word(),
                   faker.lorem.word(),
                   faker.lorem.word(),
                   faker.lorem.word()]
    let unique_id = faker.internet.email().split('@')[0]
    sf.mail = unique_id + "@" + dataTypes.DOMAIN_MAP[7][0];
    sf.rank = utils.randomElement(dataTypes.RANK);
    sf.status = utils.randomElement(dataTypes.STATUS);
    sf.address = faker.address.streetAddress("###");
    sf.telephone = '0' + utils.generateNumberPrefix() + utils.generateNumberBody();
    sf.entity = "soldier";
    sf.discharge = faker.date.between(faker.date.future(20),faker.date.future(10)).toISOString();
    sf.primaryDU = {uniqueID: unique_id, adfsUID: unique_id + "@ddd"}
    sfUsers.push(sf);
}


// Generating pictures
for (let i = 0; i < picturesAmount; i++) {
    let picture = {}
    picture.personalNumber = mis[i];
    picture.path = utils.generateNumberBody();
    picture.format = utils.randomElement(["jpg"])
    const takenAt = faker.date
        .between(faker.date.past(10), faker.date.past(40))
        .toISOString()
    picture.takenAt = takenAt
    const createdAt = faker.date
        .between(faker.date.past(1), takenAt)
        .toISOString()
    picture.createdAt = createdAt
    const updatedAt = faker.date
            .between(faker.date.past(1), createdAt)
            .toISOString()
    picture.updatedAt = updatedAt
    pictures.push(picture)
}

fs.writeFileSync("./mocks/mocksFiles/getAkaEmployees.json", JSON.stringify(employees));
fs.writeFileSync("./mocks/mocksFiles/getAkaTelephone.json", JSON.stringify(telephones));
fs.writeFileSync("./mocks/mocksFiles/AD.json", JSON.stringify(adUsers));
fs.writeFileSync("./mocks/mocksFiles/eightsocks.json", JSON.stringify(esUsers));
fs.writeFileSync("./mocks/mocksFiles/city.json", JSON.stringify(miriUsers));
fs.writeFileSync("./mocks/mocksFiles/sf.json", JSON.stringify(sfUsers));
fs.writeFileSync("./mocks/mocksFiles/pictures.json", JSON.stringify(pictures));
