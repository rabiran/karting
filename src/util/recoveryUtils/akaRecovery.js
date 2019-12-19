const Auth = require('../../auth/auth');
const p = require('../../config/paths')
const fn = require('../../config/fieldNames');
const matchToKartoffel = require('../matchToKartoffel');
const diff = require("diff-arrays-of-objects");
const updateSpecificFields = require('../updateSpecificFields');

module.exports = async (akaData) => {
    let allKartoffelData = (await Auth.axiosKartoffel.get(p().KARTOFFEL_PERSON_API)).data;

    allKartoffelData.forEach((person) => {
        const personKeys = Object.keys(person);
        personKeys.map((key) => {
            (fn.akaRigid.includes(key) || key === 'id') ? null : delete person[key];
        });
    });

    allKartoffelData.forEach(async (person) => {
        try {
            let diffsObject;
            let identifier = person.personalNumber || person.identityCard;
            let akaRecord = akaData.find(record => (identifier === record[fn.aka.personalNumber] || identifier === record[fn.aka.identityCard]));
            let comparisonField = Object.keys(person).find(key => person[key] === identifier);
            let matchedAka;

            if (akaRecord) {
                akaRecord.rld = formatAkaDateToKartoffel(akaRecord.rld);

                matchedAka = await matchToKartoffel(akaRecord, fn.dataSources.aka);
                diffsObject = diff([person], [matchedAka], comparisonField, { updatedValues: 4 });
                if (diffsObject.updated[0]) {
                    await updateSpecificFields(diffsObject.updated[0][2], fn.dataSources.aka, person, akaRecord, false);
                }
            }
        } catch (error) {
            console.log('Hi!');
        }
    });
}


function formatAkaDateToKartoffel(date) {
    let dateArray;
    if (date) {
        dateArray = date.split(' ');
    }

    return dateArray[0] + 'T' + dateArray[1] + '00Z';
}
