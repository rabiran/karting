const fn = require("../../config/fieldNames");
const { logLevel } = require('../logger');
const logDetails = require('../../util/logDetails');
const isNumeric = require('../generalUtils/isNumeric');
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
            //job
            case fn[dataSource].job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].substring(0, obj[rawKey].lastIndexOf('/')).trim().split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                obj.hierarchy = obj.hierarchy.replace(new RegExp('\u{200f}', 'g'), '');
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //entityType,personalNumber/identityCard
            case fn[dataSource].upn:
                let upnPrefix = '';
                for (let char of obj[fn[dataSource].upn].toLowerCase().trim()) {
                    if (isNumeric(char) === false) {
                        upnPrefix = upnPrefix + char;
                    } else {
                        break;
                    }
                }
                switch (upnPrefix) {
                    case fn[dataSource].cPrefix:
                        obj.entityType = fn.entityTypeValue.c;
                        break;
                    case fn[dataSource].sPrefix:
                        obj.entityType = fn.entityTypeValue.s;
                        break;
                    case fn[dataSource].guPrefix:
                        obj.entityType = fn.entityTypeValue.gu;
                        obj.domainUsers = [
                            {
                                uniqueID: `${obj[fn[dataSource].domainPrefixField].toLowerCase()}${fn[dataSource].domainSuffix}`,
                                dataSource
                            }
                        ];
                        obj.firstName = fn[dataSource].guName;
                        break;
                    default:
                        sendLog(logLevel.warn, logDetails.warn.WRN_NOT_INSERTED_ENTITY_TYPE, obj[rawKey]);
                }
                let identityCardCandidate = obj[rawKey].toLowerCase().split(upnPrefix)[1].split("@")[0].toString();
                (obj.entityType === fn.entityTypeValue.c && validators(identityCardCandidate).identityCard) ? obj.identityCard = identityCardCandidate : null;
                (obj.entityType === fn.entityTypeValue.s) ? obj.personalNumber = identityCardCandidate : null;
                (rawKey === "entityType" || rawKey === "identityCard" || rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};