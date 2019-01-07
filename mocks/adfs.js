const faker = require('faker')
const fs = require("fs")
const ae = require("./mocksFiles/getAkaEmployees.json")

adUsers = [];

// Creating ad objects

for (let i = 0; i < 150; i++) {
  bla = {}
  bla.KfirstName = faker.name.firstName();
  bla.KlastName = faker.name.lastName();
  bla.Kjob = faker.name.jobTitle();
  bla.userPrincipalName = "M" + ae[i].mi
  bla.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                    bla.Kjob + " - " + bla.KfirstName + " " + bla.KlastName;
  bla.sAMAccountName = faker.internet.email().split('@')[0];
  bla.mail = bla.sAMAccountName + "@" +faker.internet.email().split('@')[1];
  adUsers.push(bla)
}

for (let i = 0; i < 100; i++) {
    bla = {}
    bla.KfirstName = faker.name.firstName();
    bla.KlastName = faker.name.lastName();
    bla.Kjob = faker.name.jobTitle();
    bla.userPrincipalName = "D" + faker.random.number();
    bla.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                      bla.Kjob + " - " + bla.KfirstName + " " + bla.KlastName;
    bla.sAMAccountName = faker.internet.email().split('@')[0];
    bla.mail = bla.sAMAccountName + "@" +faker.internet.email().split('@')[1];
    adUsers.push(bla)
  }

fs.writeFileSync("AD.json", JSON.stringify(adUsers))