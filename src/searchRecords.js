const fn = require('./config/fieldNames');
const getDataSourceFromFile = require('./util/getDataSourceFromFile');

module.exports = async (identifiersArray) => {

    let sourceResults = [];
    for (let dataSource of Object.values(fn.dataSources)) {
        sourceData = await getDataSourceFromFile(dataSource);
        try {
            let results = sourceData.reduce((res, record) => {
                const recordString = JSON.stringify(record);
                const foundID = identifiersArray.find(id => recordString.includes(id));
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

}

// async function findrecord(record, flatIDs, dataSource, Auth, sendLog) {
//     const { identityCard, personalNumber, domainUser } = await getIdentifiers(record, dataSource, Auth, sendLog);
//     return (flatIDs.includes(identityCard) || flatIDs.includes(personalNumber) || flatIDs.includes(domainUser));
// }