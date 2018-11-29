const axios = require("axios");
const p = require('../config/paths');
const fn = require('../config/fieldNames');
const logger = require('./logger');
const rExpAD = /^t{1}[0-9]{1}[a-zA-Z\d]+$/i
const rExpPN = /^t{2}\d{7}$/i
const rExpUPN = /^s{1}\d{7}$/i
let adUsers = []
require('dotenv').config();

function getPrincipalName(userId) {
  let data = null
  adUsers.forEach((adUser, index) => {
    if (adUser.sAMAccountName == userId) {
      mi = adUser.userPrincipalName != null ? adUser.userPrincipalName : ""
      mail = adUser.mail != null ? adUser.mail : ""
      adUsers.splice(index, 1)
      data = [mi, mail]
      return
    }
  })

  return data
}

module.exports = async (users) => {
  adUsers = await axios.get(p().AD_API)
  adUsers = adUsers.data
  users.map((user) => {
    if(process.env.NODE_ENV !== "production"){
      let a = getPrincipalName(user[fn.nv.uniqueId].split('@')[0].toUpperCase())
      user.personalNumber = a[0]
      user.mail = a[1]
    } else {
      let UPN
      let userId = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[0] : ""
      let userDomain = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[1] : ""
      if (rExpAD.test(userId) && userDomain == fn.mailExtension) {
        if (userData = getPrincipalName(userId.toUpperCase())) {
          UPN = userData[0]
          UPN = UPN.split('@')[0]
          user.personalNumber = rExpUPN.test(UPN) ? UPN.substr(1) : ""
          user.mail = userData[1]
        }
      }
      else if (rExpPN.test(userId)) {
        user.personalNumber = userId.substr(2)
        user.mail = `${userId}@${userDomain}`
      }
      
      if(user.personalNumber == "" | user.personalNumber == undefined) {
        users = users.filter(bla => bla != user)
         logger.error("user didnt get personal number from ad, inside getActiveDirectoryData module. user info: " + JSON.stringify(user));
       }
    }
  })

  return users;
}
