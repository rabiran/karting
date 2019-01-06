const faker = require('faker')
const fs = require("fs")
const ae = require("./mocksFiles/getAkaEmployees.json")

ga = [];

for (let i = 0; i < 150; i++) {
  bla = {}
  bla.KfirstName = faker.name.firstName();
  bla.KlastName = faker.name.lastName();
  bla.Kjob = faker.name.jobTitle();
  bla.mail = faker.internet.email();
  bla.entity = "M" + ae[i].mi
  bla.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                    bla.Kjob + " - " + bla.KfirstName + " " + bla.KlastName;

  ga.push(bla)
}

for (let i = 0; i < 100; i++) {
    bla = {}
    bla.KfirstName = faker.name.firstName();
    bla.KlastName = faker.name.lastName();
    bla.Kjob = faker.name.jobTitle();
    bla.mail = faker.internet.email();
    bla.entity = "D" + faker.random.number();
    bla.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                      bla.Kjob + " - " + bla.KfirstName + " " + bla.KlastName;
  
    ga.push(bla)
  }

fs.writeFileSync("AD.json", JSON.stringify(ga))