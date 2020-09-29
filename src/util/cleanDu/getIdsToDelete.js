const fn = require('../../config/fieldNames')

module.exports = (dataSource, sourcsRecordsList, kartoffelPersonList) =>{
    let uniqeId = fn[dataSource].uniqeFieldForDeepDiff;
    const sourceRecordsIds = sourcsRecordsList.map(record => record.uniqeId);
    const kartoffelPersonsIds = kartoffelPersonList.map(person => person.domainUsers.filter(obj => obj.dataSource == dataSource)).flat().map(obj => obj.uniqueID);
    const idsToRemove = kartoffelPersonsIds.filter(x => !sourceRecordsIds.includes(x));
    return idsToRemove;
}