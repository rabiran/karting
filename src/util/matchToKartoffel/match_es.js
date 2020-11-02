const fn = require("../../config/fieldNames");
const validators = require('../../config/validators');

module.exports = (obj, dataSource) => {
    const objKeys = Object.keys(obj);
    objKeys.map((rawKey) => {
        switch (rawKey) {
            //entityType
            case fn[dataSource].entityType:
                obj.entityType = obj[rawKey];
                (rawKey === "entityType") ? null : delete obj[rawKey];
                break;
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
            //identityCard
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].personalNumber:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            // rank
            case fn[dataSource].rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn[dataSource].phone:
                validators().phone.test(obj[rawKey]) ? obj.phone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            //mobilePhone
            case fn[dataSource].mobilePhone:
                validators().mobilePhone.test(obj[rawKey]) ? obj.mobilePhone = [obj[rawKey]] : delete obj[rawKey];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            //dischargeDay
            case fn[dataSource].dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            //hierarchy
            case fn[dataSource].hierarchy:
                let hr = obj[rawKey].split('/');
                if (hr[0] == "") {
                    delete obj[rawKey];
                    break;
                }
                hr[0] === fn.rootHierarchy.ourCompany ? null : hr.unshift(fn.rootHierarchy.ourCompany);
                hr = hr.map((organizationName) => { return organizationName.trim() });
                obj.hierarchy = hr.join("/");
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //mail
            case fn[dataSource].mail:
                obj.mail = obj[rawKey];
                (rawKey === "mail") ? null : delete obj[rawKey];
                break;
            //address
            case fn[dataSource].address:
                obj.address = obj[rawKey];
                (rawKey === "address") ? null : delete obj[rawKey];
                break;
            //job
            case fn[dataSource].job:
                obj.job = obj[rawKey];
                (rawKey === "job") ? null : delete obj[rawKey];
                break;
            // else
            default:
                delete obj[rawKey];
        };
    });
};