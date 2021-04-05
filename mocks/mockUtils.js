const faker = require('faker');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max-min+1) + min );
}

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
    randomArrFromArr: (array) => {
        const n = getRandomInt(1, array.length)
        return array.sort(() => Math.random() - Math.random()).slice(0, n)
    },
    generateID: () => {
        const tz = faker.random.number({'min': 10000000,'max': 99999999}).toString();
        return tz + utils.createCheckDigit(tz);
    },
    generateNumberBody: () => {
        return faker.random.number({'min': 1000000,'max': 9999999}).toString();
    },
    generateNumberPrefix: () => {
        return faker.random.number({'min': 50,'max': 59}).toString();
    }
}

module.exports = utils;