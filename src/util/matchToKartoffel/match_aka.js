const fn = require("../../config/fieldNames");
const { logLevel } = require('../logger');
const logDetails = require('../../util/logDetails');
const trycatch = require('../generalUtils/trycatch');
const formatAkaDateToKartoffel = require('../fieldsUtils/formatAkaDateToKartoffel');
const p = require("../../config/paths");
const validators = require('../../config/validators');

module.exports = async (obj, dataSource, flowType, Auth) => {
    const objKeys = Object.keys(obj);
    await Promise.all(objKeys.map(async rawKey => {
        switch (rawKey) {
            //entityType
            case fn[dataSource].entityType:
                obj.entityType = fn.entityTypeValue.s;
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
            //rank
            case fn[dataSource].rank:
                obj.rank = obj[rawKey];
                (rawKey === "rank") ? null : delete obj[rawKey];
                break;
            //phone
            case fn[dataSource].phone:
                validators().phone.test(`${obj[fn[dataSource].areaCode]}-${obj[rawKey]}`) ? obj.phone = [`${obj[fn[dataSource].areaCode]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn[dataSource].areaCode];
                (rawKey === "phone") ? null : delete obj[rawKey];
                break;
            // mobilePhone
            case fn[dataSource].mobilePhone:
                validators().mobilePhone.test(`${obj[fn[dataSource].areaCodeMobile]}-${obj[rawKey]}`) ? obj.mobilePhone = [`${obj[fn[dataSource].areaCodeMobile]}-${obj[rawKey]}`] : delete obj[rawKey];
                delete obj[fn[dataSource].areaCodeMobile];
                (rawKey === "mobilePhone") ? null : delete obj[rawKey];
                break;
            // dischargeDay
            case fn[dataSource].dischargeDay:
                obj.dischargeDay = obj[rawKey];
                (rawKey === "dischargeDay") ? null : delete obj[rawKey];
                break;
            // clearance
            case fn[dataSource].clearance:
                obj.clearance = obj[rawKey];
                (rawKey === "clearance") ? null : delete obj[rawKey];
                break;
            // serviceType
            case fn[dataSource].serviceType:
                obj.serviceType = obj[rawKey];
                (rawKey === "serviceType") ? null : delete obj[rawKey];
                break;
            // currentUnit
            case fn[dataSource].unitName:
                obj.currentUnit = obj[rawKey];

                if (flowType === fn.flowTypes.add) {
                    const tryFindGroupByUnit = await trycatch(
                        Auth.axiosKartoffel.get,
                        p(encodeURIComponent(obj[rawKey])).KARTOFFEL_GROUP_BY_AKA_UNIT
                    );

                    if (tryFindGroupByUnit.err) {
                        sendLog(
                            logLevel.warn,
                            logDetails.warn.WRN_FIND_GROUP_BY_AKA_UNIT,
                            obj[rawKey]
                        );
                        (rawKey === "currentUnit") ? null : delete obj[rawKey];
                        break;
                    }

                    const groupByAka = tryFindGroupByUnit.result.data;

                    obj.hierarchy = [
                        ...groupByAka.hierarchy,
                        groupByAka.name,
                        fn.organizationGroups.incompletes_name,
                    ].join('/');
                }

                (rawKey === "currentUnit") ? null : delete obj[rawKey];
                break;
            default:
                delete obj[rawKey];
        }
    }));

    obj.entityType = fn.entityTypeValue.s;
}