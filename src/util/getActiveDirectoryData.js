const ActiveDirectory = require('activedirectory');
const fn = require('../config/fieldNames');
const config = {
  url:fn.ldapURL,
  username: fn.LDAP_USER,
  password: fn.LDAP_PASSWORD
}
const ad = new ActiveDirectory(config)
const rExpAD = /^t{1}[0-9]{1}[a-zA-Z\d]+$/i
const rExpPN = /^t{2}\d{7}$/i
const rExpUPN = /^s{1}\d{7}$/i
const usersQuery="(&(objectCategory=person)(objectClass=user))"
const ousQuery = "(ou>='')"
const BASE_LDAP_DN = fn.baseDN;
const ouOpts = {
  filter: ousQuery,
  scope: "one",
  baseDN: BASE_LDAP_DN
}

let adUsers = []
let ous = []

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

async function getAllADOus(query) {
  return new Promise((resolve, reject) => {
    ad.find(query, (err, ous) => {
      if(err) {
        reject(err)
      } else {
        resolve(ous.other)
      }
    })
  })
}

async function getAllADUsers(query) {
  return new Promise((resolve, reject) => {
    ad.find(query, (err, users) => {
      if(err) {
        reject(err)
      } else {
        resolve(users)
      }
    })
  })
}

module.export = async (user) => {
    ous = await getAllADOus(ouOpts)
    for(const ou of ous) {
      let usersOpts ={
        filter: usersQuery,
        baseDn: ou.dn
      }
      users = await getAllADUsers(usersOpts)
      if(users != null) {
        adUsers = adUsers.concat(users)
      }
    }
    let UPN
    let userId = user[uniqueId] ? user[uniqueId].split('@')[0] : ""
    userData = getPrincipalName(userId.toUpperCase())
    if(rExpAD.test(userId)) {
      UPN = userData[0]
      UPN = UPN.split('@')[0]
      user[mi] = rExpUPN.test(UPN) ? UPN.substr(1) : ""
    }
    else if(rExpPN.test(userId)) {
        user[mi] =userId.subStr(2)
    } else {
        user[mi] =""
    }
    user[mail] = userData[1]

    return user;
}