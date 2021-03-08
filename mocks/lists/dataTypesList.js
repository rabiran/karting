const fn = require('../../src/config/fieldNames')

module.exports = {
  RANK: ["unknown", "rookie", "champion", "ultimate", "mega"],

  CURRENT_UNIT: ["nitro unit", "jelly unit"],
  ENTITY_TYPE: ["digimon", "agumon", "tamar"],
  RESPONSIBILITY: ["none", "HR", "SO"],
  STATUS: ["active","inactive"],

  DOMAIN_MAP: [
    ["rabiran.com", "rabiranuid"],
    ["somedomain.com", "somedomainuid"],
    ["jello.com", "jellouid"],
    ["jello2.com", "jellouid"],
    ["turtle.com", "turtle"],
    ["donatelo.turtle.com", "turtle"],
    ["rafael.turtle.com", "turtle"],
    ["leonardo.com","ddd"]
  ],

  SERVICE_TYPE: ["A", "B", "C", "D", "E", "F", "G", "H"],
  UNIT: ["gondor", "mordor", "wallmart", "valhalla"],
  ES_UNIT: ["es1", "es2", "es3", "es4", "es5", "es6"],
  ADS_UNIT: ["ads1", "ads2", "ads3", "ads4", "ads5", "ads6"],
  CITY_UNIT: ["city1", "city2", "city3", "city4", "city5", "city6"],
  MM_UNIT: ["mm1","mm2","mm3","mm4","mm5","mm6"],
  MIRI_TAGS: [
    {
      name: fn[fn.dataSources.city].userTags.transportable
    },
    {
      name: fn[fn.dataSources.city].userTags.information
    },
  ]
};
