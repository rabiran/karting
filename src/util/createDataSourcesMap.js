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
    obj[fn.dataSources.es] ? dataSourcesMap.set(obj[fn.dataSources.es].replace(new RegExp("\"", 'g')," "), fn.dataSources.es) : null;
    obj[fn.dataSources.nn] ? dataSourcesMap.set(obj[fn.dataSources.nn].replace(new RegExp("\"", 'g')," "), fn.dataSources.nn) : null;
    obj[fn.dataSources.nv] ? dataSourcesMap.set(obj[fn.dataSources.nv].replace(new RegExp("\"", 'g')," "), fn.dataSources.nv) : null;
    obj[fn.dataSources.ads] ? dataSourcesMap.set(obj[fn.dataSources.ads].replace(new RegExp("\"", 'g')," "), fn.dataSources.ads) : null;
    obj[fn.dataSources.city] ? dataSourcesMap.set(obj[fn.dataSources.city].replace(new RegExp("\"", 'g')," "), fn.dataSources.city) : null;
})

module.exports = dataSourcesMap;
