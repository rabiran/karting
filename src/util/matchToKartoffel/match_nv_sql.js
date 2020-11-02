const fn = require("../../config/fieldNames");
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

                // Getting job
                obj.job = obj[rawKey].substring(obj[rawKey].lastIndexOf("/") + 1);
                (rawKey === "hierarchy") ? null : delete obj[rawKey];
                break;
            //personalNumber
            case fn[dataSource].pn:
                obj.personalNumber = obj[rawKey].toString();
                (rawKey === "personalNumber") ? null : delete obj[rawKey];
                break;
            //identity card
            case fn[dataSource].identityCard:
                validators(obj[rawKey]).identityCard ? obj.identityCard = obj[rawKey].toString() : null;
                (rawKey === "identityCard") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];

        }
    })
};