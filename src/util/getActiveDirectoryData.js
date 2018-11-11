const axios = require("axios");
const p = require('../config/paths');
const fn = require('../config/fieldNames');
const rExpAD = /^t{1}[0-9]{1}[a-zA-Z\d]+$/i
const rExpPN = /^t{2}\d{7}$/i
const rExpUPN = /^s{1}\d{7}$/i
let adUsers = []

function getPrincipalName(userId) {
  let data = null
  adUsers.forEach((adUser, index) => {
    if(adUser.sAMAccountName == userId) {
      mi = adUser.userPrincipalName != null ? adUser.userPrincipalName : ""
      mail = adUser.mail != null ? adUser.mail : ""
      adUser.splice(index, 1)
      data = [mi , mail]
      return
    }
  })
  
  return data
}

module.export = async (user) => {
    adUsers = await axios.get(p().AD_API)
    adUsers = adUsers.data
    let UPN
    let userId = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[0] : ""
    let userDomain = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[1] : ""
    if(rExpAD.test(userId) && userDomain == "bla" ) {
      userData = getPrincipalName(userId.toUpperCase())
      UPN = userData[0]
      UPN = UPN.split('@')[0]
      user[fn.aka.personalNumber] = rExpUPN.test(UPN) ? UPN.substr(1) : ""
      user[fn.aka.mail] = userData[1]
    }
    else if(rExpPN.test(userId)) {
        user[fn.aka.personalNumber] =userId.substr(2)
    } else {
        user[fn.aka.personalNumber] =""
    }

    return user;
}
