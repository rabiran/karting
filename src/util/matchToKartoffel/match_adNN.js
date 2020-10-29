const fn = require("../../config/fieldNames");
const { logLevel } = require('../logger');
const logDetails = require('../../util/logDetails');
const validators = require('../../config/validators');

module.exports = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //firstName
            case fn[dataSource].firstName:
                obj.firstName = obj[rawKey];
                (rawKey === "firstName") ? null : delete obj[rawKey];
                break;
            //lastName
            case fn[dataSource].lastName:
                obj.lastName = obj[rawKey];
                (rawKey === "lastName") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy and job
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].includes("\\") ? obj[rawKey].substring(0, obj[rawKey].lastIndexOf('\\')).trim().split('\\') : obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');

                // Getting job
                if (obj[rawKey].includes("-")) {
                    if (obj[rawKey].includes("\\")) {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("\\") + 1).replace(/-/g, "").trim()
                    } else {
                        job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1).replace(/-/g, "").trim()
                    }
                    if (obj[rawKey].includes(obj[fn[dataSource].fullName])) {
                        job = job.replace(obj[fn[dataSource].fullName], "").trim()
                    }
                    obj.job = job
                }

                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber or identity card
            case fn[dataSource].sAMAccountName:
                if (obj[rawKey].toLowerCase().includes(fn[dataSource].extension)) {
                    uniqueNum = obj[rawKey].toLowerCase().replace(fn[dataSource].extension, "")
                } else {
                    sendLog(logLevel.warn, logDetails.warn.WRN_USER_NOT_EXTENTION, obj[rawKey], fn[dataSource].extension);
                    break;
                }
                if (validators(uniqueNum).identityCard) {
                    obj.identityCard = uniqueNum.toString();
                } else {
                    obj.personalNumber = uniqueNum.toString();
                }

                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                (rawKey != "mail" && rawKey != fn[dataSource].fullName) ? delete obj[rawKey] : null;

        }
    })
};