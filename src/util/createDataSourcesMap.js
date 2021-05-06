const excelToJson = require('convert-excel-to-json');
const fn = require('../config/fieldNames');

const result = excelToJson({
    sourceFile: 'src/config/dataSourcesMap.xlsx',
    columnToKey: {
        A: fn.dataSources.es,
        B: fn.dataSources.adNN,
        C: fn.dataSources.nvSQL,
        D: fn.dataSources.ads,
        E: fn.dataSources.city,
        F: fn.dataSources.mm,
    }
});

const dataSourcesMap = new Map();
result.dataSources.map((obj) => {
    obj[fn.dataSources.es] ? dataSourcesMap.set(obj[fn.dataSources.es].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.es) : null;
    obj[fn.dataSources.adNN] ? dataSourcesMap.set(obj[fn.dataSources.adNN].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.adNN) : null;
    obj[fn.dataSources.nvSQL] ? dataSourcesMap.set(obj[fn.dataSources.nvSQL].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.nvSQL) : null;
    obj[fn.dataSources.ads] ? dataSourcesMap.set(obj[fn.dataSources.ads].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.ads) : null;
    obj[fn.dataSources.city] ? dataSourcesMap.set(obj[fn.dataSources.city].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.city) : null;
    obj[fn.dataSources.mm] ? dataSourcesMap.set(obj[fn.dataSources.mm].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.mm) : null;
})

module.exports = dataSourcesMap;

