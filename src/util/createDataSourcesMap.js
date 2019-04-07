const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'src/config/extest.xlsx',
    columnToKey: {
        A: 'es',
        B: 'nn',
        C: "nv",
        D: "ads"
    }
});

const dataSourcesMap = new Map();
result.dataSources.map((obj) => {
    obj["es"] ? dataSourcesMap.set(obj["es"], "es") : null;
    obj["nn"] ? dataSourcesMap.set(obj["nn"], "nn") : null;
    obj["nv"] ? dataSourcesMap.set(obj["nv"], "nv") : null;
    obj["ads"] ? dataSourcesMap.set(obj["ads"], "ads") : null;
})

module.exports = dataSourcesMap;
