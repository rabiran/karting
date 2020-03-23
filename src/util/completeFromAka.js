const fn = require('../config/fieldNames');
const validators = require('../config/validators');
const { sendLog, logLevel } = require('./logger');
const logDetails = require('../util/logDetails');
const mergeArrays = require('./generalUtils/mergeArrays');

const complete_es = (obj, akaRecord) => {
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    obj.entityType = fn.entityTypeValue.s;
    obj.personalNumber = akaRecord[fn.aka.personalNumber];
    const akaRecordPhone = `${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`;
    const akaRecordMobilePhone = `${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`;
    phonesValueHandler(obj, akaRecordPhone, "phone");
    phonesValueHandler(obj, akaRecordMobilePhone, "mobilePhone");
}

const complete_ads = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    obj.entityType = fn.entityTypeValue.s;
    obj.personalNumber = akaRecord[fn.aka.personalNumber];
    const akaRecordPhone = `${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`;
    const akaRecordMobilePhone = `${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`;
    phonesValueHandler(obj, akaRecordPhone, "phone");
    phonesValueHandler(obj, akaRecordMobilePhone, "mobilePhone");

}

const complete_adNN = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.entityType = fn.entityTypeValue.s;
    obj.personalNumber = akaRecord[fn.aka.personalNumber];
    const akaRecordPhone = `${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`;
    const akaRecordMobilePhone = `${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`;
    phonesValueHandler(obj, akaRecordPhone, "phone");
    phonesValueHandler(obj, akaRecordMobilePhone, "mobilePhone");
}

const complete_nv = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.entityType = fn.entityTypeValue.s;
    obj.personalNumber = akaRecord[fn.aka.personalNumber];
    const akaRecordPhone = `${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`;
    const akaRecordMobilePhone = `${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`;
    phonesValueHandler(obj, akaRecordPhone, "phone");
    phonesValueHandler(obj, akaRecordMobilePhone, "mobilePhone");
}

const complete_city = (obj, akaRecord) => {
    validators(akaRecord[fn.aka.identityCard]).identityCard ? obj.identityCard = akaRecord[fn.aka.identityCard] : null;
    obj.firstName = akaRecord[fn.aka.firstName];
    obj.lastName = akaRecord[fn.aka.lastName];
    obj.rank = akaRecord[fn.aka.rank];
    obj.dischargeDay = akaRecord[fn.aka.dischargeDay];
    obj.clearance = akaRecord[fn.aka.clearance];
    obj.currentUnit = akaRecord[fn.aka.unitName];
    obj.serviceType = akaRecord[fn.aka.serviceType];
    obj.personalNumber = akaRecord[fn.aka.personalNumber];
    obj.entityType = fn.entityTypeValue.s;
    const akaRecordPhone = `${akaRecord[fn.aka.areaCode]}-${akaRecord[fn.aka.phone]}`;
    const akaRecordMobilePhone = `${akaRecord[fn.aka.areaCodeMobile]}-${akaRecord[fn.aka.mobilePhone]}`;
    phonesValueHandler(obj, akaRecordPhone, "phone");
    phonesValueHandler(obj, akaRecordMobilePhone, "mobilePhone");
}

/**
 * Assigns to person, either phone or mobile phone as an array, if they are valid.
 *
 * @param {Object : Person} person - the person object (the obj)
 * @param {String} phone - akarecord[mobilephone / phone]
 * @param {RegExp} validator - validators().[mobilephone / phone]
 * @param {String} phoneType - "phone" / "mobilePhone"
 */
function phonesValueHandler(person, phone, phoneType) {
    if (validators()[phoneType].test(phone))
        person[phoneType] ? person[phoneType] = mergeArrays([phone], person[phoneType]) : person[phoneType] = [phone];
}

/**
 * This module add fields from aka dataSource to given object
 *
 * @param {*} obj Object of person
 * @param {*} akaData Aka dataSource
 * @param {*} dataSource The dataSource of the person object
 * @returns Object of person with the data from aka
 */
module.exports = (obj, akaData, dataSource) => {
    let identifier = obj.personalNumber || obj.identityCard;
    if (identifier) {
        let akaRecord = akaData.find(person => ((person[fn.aka.personalNumber] == identifier) || (person[fn.aka.identityCard] == identifier)));
        if (akaRecord) {
            switch (dataSource) {
                case fn.dataSources.aka:
                    break;
                case fn.dataSources.es:
                    complete_es(obj, akaRecord);
                    break;
                case fn.dataSources.ads:
                    if (obj.entityType === fn.entityTypeValue.c) { break; };
                    complete_ads(obj, akaRecord);
                    break;
                case fn.dataSources.adNN:
                    complete_adNN(obj, akaRecord);
                    break;
                case fn.dataSources.city:
                    if (obj.entityType === fn.entityTypeValue.gu) { break; };
                    complete_city(obj, akaRecord);
                    break;
                case fn.dataSources.mdn:
                case fn.dataSources.mm:
                case fn.dataSources.lmn:
                    complete_nv(obj, akaRecord);
                    break;
                default:
                    sendLog(logLevel.error, logDetails.error.ERR_DATA_SOURCE);
            }
        }
        else {
            sendLog(logLevel.warn, logDetails.warn.WRN_COMPLETE_AKA, identifier, dataSource);
        }
    }

    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null") ? delete obj[key] : null);
    return obj;
};