const axios = require("axios");
const p = require('../config/paths');
const fn = require('../config/fieldNames');
const rExpAD = /^t{1}[0-9]{1}[a-zA-Z\d]+$/i
const rExpPN = /^t{2}\d{7}$/i
const rExpUPN = /^s{1}\d{7}$/i
let adUsers = []

function getPrincipalName(userId) {
  let mi
  let mail
  adUsers.forEach((adUser, index) => {
    if(adUser.sAMAccountName == userId) {
      mi = adUser.userPrincipalName != null ? adUser.userPrincipalName : ""
      mail = adUser.mail != null ? adUser.mail : ""
      adUser.splice(index, 1)
      return
    }
  })
  
  return [mi, mail]
}

module.export = async (user) => {
    let UPN
    adUsers = await axios.get(p().AD_API);
    let userId = user[fn.nv.uniqueId] ? user[fn.nv.uniqueId].split('@')[0] : ""
    userData = getPrincipalName(userId.toUpperCase())
    if(rExpAD.test(userId)) {
      UPN = userData[0]
      UPN = UPN.split('@')[0]
      user[mi] = rExpUPN.test(UPN) ? UPN.substr(1) : ""
    }
    else if(rExpPN.test(userId)) {
        user[fn.aka.personalNumber] =userId.subStr(2)
    } else {
        user[fn.aka.personalNumber] =""
    }
    user[fn.aka.mail] = userData[1]

    return user;
}