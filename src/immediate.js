const fn = require('./config/fieldNames');
const diffsHandler = require('./util/diffsHandler');
const logDetails = require('./util/logDetails');
const preRun = require('./util/preRun');
const searchRecords = require('./util/searchRecords');
const AuthClass = require('./auth/auth');

const { logLevel } = require('./util/logger');

module.exports = async (dataSource, identifiersArray, runUID) => {
  for (const identifierObj of identifiersArray) {
    try {
      const { dataObj, sendLog } = await preRun(fn.runnigTypes.immediateRun,
        [fn.dataSources.aka, dataSource],
        identifierObj, runUID);

      let akaRecords = dataObj[fn.dataSources.aka].data;
      let foundRecords = dataObj[dataSource].data;

      akaRecords = [];
      foundRecords = [];
      
      const missingSources = [];

      akaRecords.length ? null : missingSources.push(fn.dataSources.aka);
      foundRecords.length ? null : missingSources.push(dataSource);

      const sourceResults = await searchRecords([identifierObj.identityCard, identifierObj.personalNumber], missingSources);

      akaRecords = akaRecords.length ? akaRecords : sourceResults[fn.dataSources.aka].map(elem => elem.record);
      foundRecords = foundRecords.length ? foundRecords : sourceResults[dataSource].map(elem => elem.record);

      const Auth = new AuthClass(sendLog);

      await diffsHandler({ added: foundRecords }, dataSource, akaRecords, fn.runnigTypes.immediateRun, sendLog, Auth);
    } catch (err) {
      sendLog(logLevel.error, logDetails.error.ERR_UN_HANDLED_ERROR, fn.runnigTypes.immediateRun, JSON.stringify(err));
    }
  }
};
