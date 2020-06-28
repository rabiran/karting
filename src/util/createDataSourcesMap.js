const excelToJson = require('convert-excel-to-json');
const fn = require('../config/fieldNames');

const result = excelToJson({
    sourceFile: 'src/config/dataSourcesMap.xlsx',
    columnToKey: {
        A: fn.dataSources.es,
        B: fn.dataSources.nn,
        C: fn.dataSources.nv,
        D: fn.dataSources.ads,
        E: fn.dataSources.city,
    }
});

const dataSourcesMap = new Map();
result.dataSources.map((obj) => {
    obj[fn.dataSources.es] ? dataSourcesMap.set(obj[fn.dataSources.es].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.es) : null;
    obj[fn.dataSources.adNN] ? dataSourcesMap.set(obj[fn.dataSources.nn].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.nn) : null;
    obj[fn.dataSources.nvSQL] ? dataSourcesMap.set(obj[fn.dataSources.nv].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.nv) : null;
    obj[fn.dataSources.ads] ? dataSourcesMap.set(obj[fn.dataSources.ads].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.ads) : null;
    obj[fn.dataSources.city] ? dataSourcesMap.set(obj[fn.dataSources.city].toString().replace(new RegExp("\"", 'g')," "), fn.dataSources.city) : null;
})

module.exports = dataSourcesMap;

