const p =  require('../../config/paths');
const axios = require("axios");
const fn = require('../../config/fieldNames')
const { logLevel } = require('../logger');
const logDetails = require('../logDetails');

module.exports = async (domainUsers, dataSourcePersons, dataSource, sendLog, Auth) =>{
    for (const domainUser of domainUsers) {
        let person = dataSourcePersons.find(personObj => personObj.domainUsers.find(domainUserObj => domainUserObj.uniqueID == domainUser))
        if (person) {
            let id = person._id;
            try{
                await Auth.axiosKartoffel.delete(p(id , domainUser).KARTOFFEL_DELETE_DOMAIN_USER_API);
                sendLog(logLevel.info, logDetails.info.INF_DELETE_DOMAIN_USER, domainUser, dataSource, person.personalNumber || person.identityCard)
            } catch (err){
                sendLog(logLevel.error, logDetails.error.ERR_DELETE_DOMAIN_USER , domainUser, id, dataSource, err.message);
            }
        }
    }
}