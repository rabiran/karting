const fn = require('../config/fieldNames');
const PromiseAllWithFails = require('./generalUtils/promiseAllWithFails');
const connectToRedis = require('./generalUtils/connectToRedis');
const authHierarchyExistence = require('./generalUtils/authHierarchyExistence');
const moment = require('moment');
const getRawData = require('./getRawData');

module.exports = async (runningType, dataSources) => {
    const redis = await connectToRedis();

    // check if the root hierarchy exist and adding it if not
    await authHierarchyExistence();
    
    const date = moment(new Date()).format("DD.MM.YYYY__HH.mm");
    const rawData = await PromiseAllWithFails(
        dataSources.map(
            async dataSource => {
                let { data, fileName } = await getRawData(dataSource, runningType , date);
                return { dataSource, data , fileName };
            })
    );
    
    let dataObj = {};
    rawData.forEach(dataSourceElem => {
        dataObj[dataSourceElem.dataSource] = { data: dataSourceElem.data, fileName: dataSourceElem.fileName } 
    })
    

    return { redis, dataObj }
}