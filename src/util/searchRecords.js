const fn = require('../config/fieldNames');
const getDataSourceFromFile = require('./getDataSourceFromFile');

module.exports = async (identifiersArray, dataSources) => {
  const sourceResults = {};
  for (const dataSource of dataSources) {
    const sourceData = await getDataSourceFromFile(dataSource);
    let results = [];
    try {
      for (record of sourceData) {
        const recordString = JSON.stringify(record);
        const foundID = identifiersArray.find(id => recordString.includes(id));
        if (foundID) {
          results.push({ id: foundID, record });
        }
      }
      sourceResults[dataSource] = results;
    } catch (err) {
      console.log(err);
    }
  }
  return sourceResults;
};

