const faker = require('faker');

 const utils = {
    createCheckDigit: (param) => {
        const rawCheckDigit = param.toString().split('').reduce((accumulator, currChar, currIndex) => {
            let digitWeight = Number(currChar) * ((currIndex % 2) + 1);

            return accumulator += digitWeight > 9 ? digitWeight - 9 : digitWeight;
        }, 0);

        return rawCheckDigit % 10 ? 10 - (rawCheckDigit % 10) : 0;
    },

    randomElement: (array) => {
        return array[Math.floor(Math.random() * array.length)]
    },
    generateID: () => {
        const tz = faker.random.number({'min': 10000000,'max': 99999999}).toString();
        return tz + utils.createCheckDigit(tz);
    },
    generateNumberBody: () => {
        return faker.random.number({'min': 1000000,'max': 9999999});
    },
    generateNumberPrefix: () => {
        return faker.random.number({'min': 50,'max': 59});
    }
}

module.exports = utils;