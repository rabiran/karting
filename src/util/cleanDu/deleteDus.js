const p =  require('../../config/paths');
const axios = require("axios");
const fn = require('../../config/fieldNames')

module.exports = async (domainUsers, dataSourcePersons, Auth, sendLog) =>{
    if(domainUsers.length < dataSourcePersons.length / 2) {
        for (const domainUser of domainUsers) {
            let person = dataSourcePersons.find(personObj => personObj.domainUsers.find(domainUserObj => domainUserObj.uniqueID == domainUser))
            let id = person._id;
            try{
                await Auth.axiosKartoffel.delete(p(id , domainUser).KARTOFFEL_DELETE_DOMAIN_USER_API);
            } catch (err){
                console.log(err)
            }
        }
    }
}