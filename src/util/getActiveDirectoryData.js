const axios = require("axios");
const p = require('../config/paths');
const fn = require('../config/fieldNames');
const logger = require('./util/logger');
const rExpAD = /^t{1}[0-9]{1}[a-zA-Z\d]+$/i
const rExpPN = /^t{2}\d{7}$/i
const rExpUPN = /^s{1}\d{7}$/i
let adUsers = []

function getPrincipalName(userId) {
  let data = null
  adUsers.forEach((adUser, index) => {
    if (adUser.sAMAccountName == userId) {
      mi = adUser.userPrincipalName != null ? adUser.userPrincipalName : ""
      mail = adUser.mail != null ? adUser.mail : ""
      adUser.splice(index, 1)
      data = [mi, mail]
      return
    }
  })

  return data
}

module.exports = async (user) => {
  adUsers = await axios.get(p().AD_API)
  adUsers = adUsers.data
  let UPN
  let userId = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[0] : ""
  let userDomain = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[1] : ""
  if (rExpAD.test(userId) && userDomain == fn.mailExtension) {
    if (userData = getPrincipalName(userId.toUpperCase())) {
      UPN = userData[0]
      UPN = UPN.split('@')[0]
      user[fn.nv.personalNumber] = rExpUPN.test(UPN) ? UPN.substr(1) : ""
      user[fn.nv.mail] = userData[1]
    }
  }
  else if (rExpPN.test(userId)) {
    user[fn.nv.personalNumber] = userId.substr(2)
  }
  
  if(user[fn.nv.personalNumber] == "" | user[fn.nv.personalNumber] == undefined) {
     logger.error("user didnt get personal number from ad, inside getActiveDirectoryData module. user info: " + JSON.stringfy(user))
   }

  return user;
}
