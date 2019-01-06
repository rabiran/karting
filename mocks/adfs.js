const faker = require('faker')
const fs = require("fs")
const ae = require("./mocksFiles/getAkaEmployees.json")

ga = [];

for (let i = 0; i < 250; i++) {
  bla = {}
  bla.KfirstName = faker.name.firstName();
  bla.KlastName = faker.name.lastName();
  bla.Kjob = faker.name.jobTitle();
  bla.mail = faker.internet.email();
  if(ae[i].mi) {
    bla.entity = "M" + ae[i].mi
  } else {
    bla.entity = "D" + ae[i].tz
  }
  bla.hierarchy = faker.lorem.word() + "/" + faker.lorem.word() + "/" + faker.lorem.word() + "/" +
                    bla.Kjob + " - " + bla.KfirstName + " " + bla.KlastName;

  ga.push(bla)
}

fs.writeFileSync("AD.json", JSON.stringify(ga))