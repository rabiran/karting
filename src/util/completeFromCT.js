const fn = require('../config/fieldNames');

/**
 * This module add fields from city dataSource to given object
 *
 * @param {*} obj Object of person
 * @param {*} CTRecord city dataSource
 * @returns Object of person with the data from city
 */
module.exports =  (obj, CTRecord) => {
    
    obj.rank = CTRecord[fn.city.rank];
    obj.currentUnit = CTRecord[fn.city.unitName];

    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null") ? delete obj[key] : null);
    return obj;
};