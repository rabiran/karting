const fs = require('fs');
const fn = require('../config/fieldNames');

module.exports = async (dataSource) => {
  let path = `./data/${fn.runnigTypes.recoveryRun}/${dataSource}`;
  const files = fs.readdirSync(`${path}/`);
  let lastJsonName = files[files.length - 1];

  if (files[files.length - 1] === 'archive') {
    path = `${path}/archive`;
    const completeFiles = fs.readdirSync(path);
    lastJsonName = (completeFiles[completeFiles.length - 1]);
  }

  const lastData = fs.readFileSync(`${path}/${lastJsonName}`, 'utf8');
  const data = JSON.parse(lastData);

  return data;
}
