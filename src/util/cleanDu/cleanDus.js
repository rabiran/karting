const getIrrelevantDus = require('./getIrrelevantDus')

async function cleanDu(dataSource, data, sendLog, Auth) {
    const irrelevantDus = getIrrelevantDus(data, dataSource, sendLog);
    await deleteDus(irrelevantDus);
}

module.exports = cleanDu;