const fn = require('../config/fieldNames');
const getDataSourceFromFile = require('./getDataSourceFromFile');

module.exports = async (identifiersArray, dataSources) => {
  const sourceResults = {};
  for (const dataSource of dataSources) {
    const sourceData = await getDataSourceFromFile(dataSource);
    try {
      const results = sourceData.reduce((res, record) => {
        const recordString = JSON.stringify(record);
        const foundID = identifiersArray.find(id => recordString.includes(id));
        if (foundID) {
          res.push({ id: foundID, record });
        }
        return res;
      }, []);
      sourceResults[dataSource] = results;
    } catch (err) {
      console.log(err);
    }
  }
  return sourceResults;
};

