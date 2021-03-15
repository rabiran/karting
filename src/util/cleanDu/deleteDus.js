const p =  require('../../config/paths');
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');

module.exports = async (domainUsers, dataSourcePersons, dataSource, sendLog, Auth) =>{
    for (const domainUser of domainUsers) {
        let person = dataSourcePersons.find(personObj => personObj.domainUsers.find(domainUserObj => domainUserObj.uniqueID == domainUser))
        if (person) {
            let id = person._id;
            try{
                const encodedDomainUser = encodeURIComponent(domainUser)
                await Auth.axiosKartoffel.delete(p(id , encodedDomainUser).KARTOFFEL_DELETE_DOMAIN_USER_API);
                sendLog(logLevel.info, logDetails.info.INF_DELETE_DOMAIN_USER, domainUser, person.personalNumber || person.identityCard, dataSource)
            } catch (err){
                sendLog(logLevel.error, logDetails.error.ERR_DELETE_DOMAIN_USER , domainUser, id, dataSource, err.message);
            }
        }
    }
}