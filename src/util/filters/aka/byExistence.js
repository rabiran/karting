const fn = require('../../../config/fieldNames');
const isExistInKartoffel = require('../../isExistInKartoffel');

module.exports = async DataModel => {
    return DataModel.flowType !== fn.flowTypes.add || !(await isExistInKartoffel(DataModel));
}
