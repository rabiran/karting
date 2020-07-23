const fn = require('../config/fieldNames');
const fs = require('fs');

module.exports = async (dataSource) => {
    const path = `./data/${fn.runnigTypes.recoveryRun}/${dataSource}`;
    const files = fs.readdirSync(`${path}/`);
    let lastJsonName = files[files.length - 1];

    if (files[files.length - 1] === 'archive') {
        const completeFiles = fs.readdirSync(`${path}/archive/`);
        lastJsonName = (completeFiles[completeFiles.length - 1]);
    }

    previous_data_file = fs.readFileSync(`${path}/${lastJsonName}`, 'utf8');
    data = JSON.parse(previous_data_file);

    return data;
}
