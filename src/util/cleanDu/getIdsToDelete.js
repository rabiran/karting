const fn = require('../../config/fieldNames')
const assembleDomainUser = require('../fieldsUtils/assembleDomainUser')

module.exports = (dataSource, sourceRecordsList, kartoffelPersonList, sendLog) =>{
    const sourceRecordsDUs = sourceRecordsList.map(record => assembleDomainUser(dataSource, record, sendLog));
    const kartoffelPersonsDUs = kartoffelPersonList.map(person => person.domainUsers.filter(obj => obj.dataSource == dataSource)).flat().map(obj => obj.uniqueID);
    const idsToRemove = kartoffelPersonsDUs.filter(x => !sourceRecordsDUs.includes(x));
    return idsToRemove;
}