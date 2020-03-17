const Auth = require('../../auth/auth');
const p = require('../../config/paths')
const fn = require('../../config/fieldNames');
const matchToKartoffel = require('../matchToKartoffel');
const diff = require("diff-arrays-of-objects");
const updateSpecificFields = require('../updateSpecificFields');
const { sendLog, logLevel } = require('../logger')
const logDetails = require('../logDetails');

/**
 * A diffrent flow of recovery for aka,
 * the diffrence due is the fact that aka use is only
 * for updating the data and not for creating,
 * there for we use a diffrent flow
 *
 * @param {Object} akaData - the raw data of aka data
 */
module.exports = async (akaData) => {
    let allKartoffelData;

    try {
        allKartoffelData = (await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API)).data;
    } catch (error) {
        sendLog(logLevel.error,
                logDetails.error.ERR_GET_ALL_FROM_KARTOFFEL,
                fn.runnigTypes.recoveryRun,
                error.message);
    }

    allKartoffelData.forEach((person) => {
        const personKeys = Object.keys(person);

        personKeys.forEach((key) => {
            fn.fieldsForRmoveFromKartoffel.includes(key) && key != 'id' ? delete person[key] : null;
        });
    });

    allKartoffelData.forEach(async (person) => {
        let diffsObject;
        let identifier = person.personalNumber || person.identityCard;
        let akaRecord = akaData.find(record => (identifier === record[fn.aka.personalNumber] || identifier === record[fn.aka.identityCard]));
        let comparisonField = Object.keys(person).find(key => person[key] === identifier);
        let matchedAka;

        if (akaRecord) {
            matchedAka = await matchToKartoffel(akaRecord, fn.dataSources.aka);
            diffsObject = diff([person], [matchedAka], comparisonField, { updatedValues: 4 });
            if (diffsObject.updated.length) {
                await updateSpecificFields(diffsObject.updated[0][2], fn.dataSources.aka, person, akaRecord, false);
            }
        }
    });
}
