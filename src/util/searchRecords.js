const fn = require('../config/fieldNames');
const getDataSourceFromFile = require('./getDataSourceFromFile');

module.exports = async (identifiersArray, dataSources) => {

    let sourceResults = [];
    for (let dataSource of dataSources) {
        sourceData = await getDataSourceFromFile(dataSource);
        try {
            let results = sourceData.reduce((res, record) => {
                const foundID = identifiersArray.find(id => {
                    return record[fn[dataSource].personalNumber] == id ||
                    record[fn[dataSource].identityCard] == id;
                })
                if(foundID) {
                    res.push({id: foundID, record: record});
                }
                return res;
            }, [])
            sourceResults.push({"dataSource": dataSource, "results": results})
        } catch (err) {
            console.log(err);
        }
    }
    return sourceResults;

}


// async function findrecord(record, flatIDs, dataSource, Auth, sendLog) {
//     const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, Auth, sendLog);
//     return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
// }