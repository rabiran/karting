const fn = require('../../../config/fieldNames');
const isExistInKartoffel = require('../../isExistInKartoffel');

module.exports = async DataModel => {
    // check specificly that isExistInKartoffel returns "false" - meaninig that we know for sure
    // that the person does not exists in kartoffel
    return DataModel.flowType !== fn.flowTypes.add || (await isExistInKartoffel(DataModel)) === false;
}
