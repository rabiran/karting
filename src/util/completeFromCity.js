const fn = require('../config/fieldNames');

/**
 * This module add fields from city dataSource to given object
 *
 * @param {*} obj Object of person
 * @param {*} CityRecord city dataSource
 * @returns Object of person with the data from city
 */
module.exports =  (obj, CityRecord) => {
    
    obj.rank = CityRecord[fn.city_name.rank];
    obj.currentUnit = CityRecord[fn.city_name.unitName];

    // delete the empty fields from the returned object
    Object.keys(obj).forEach(key => (!obj[key] || obj[key] === "null") ? delete obj[key] : null);
    return obj;
};