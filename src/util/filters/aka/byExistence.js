const fn = require('../../../config/fieldNames');
const isExistInKartoffel = require('../../isExistInKartoffel');

module.exports = async (record, flowType) => {
    return flowType === fn.flowTypes.update || !(await isExistInKartoffel(record));
}
