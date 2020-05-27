const fs = require('fs');
const fn = require('../config/fieldNames');
const { sendLog, logLevel } = require('./logger');
const logDetails = require('./logDetails');
const getIdentifiers = require('./getIdentifiers')

/**
 * Get data raw data from data source
 *
 * @param {string} dataSource = which data source to get data from
 * @param {string} runnigType - the current runnig type
 */
module.exports = async (dataSource, runnigType, personIDsArray) => {

    const path = `./data/${dataSource}`;
    const files = fs.readdirSync(`${path}/`);
    const actionDescription = `${runnigType}_${dataSource}_raw_data`;
    let lastJsonName = runnigType === fn.runnigTypes.recoveryRun ? null : files[files.length - 1];

    try {
        previous_data_file = fs.readFileSync(`${path}/${lastJsonName}`, 'utf8');
        previous_data = JSON.parse(previous_data_file);
    } catch (err) {
        if (err) {
            if (!lastJsonName) {
                lastJsonName = [];
            } else {
                sendLog(logLevel.error, logDetails.error.ERR_READ_PREVIOUS_DATA_FILE, previous_data_file_name, err.message);                
            }
        }
    }

    flatIDs = personIDsArray.map(obj => [obj.id, obj.mi]).flat();
    let foundRecord = await previous_data.filter(async record => (await findrecord(record, flatIDs)))
    return foundRecord;

    async function findrecord(record, flatIDs) {
        const { identityCard, personalNumber } = await getIdentifiers(record, dataSource, true);
        return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber));
    }
}