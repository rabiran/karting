module.exports = {
    createCheckDigit: (param) => {
        const rawCheckDigit = param.toString().split('').reduce((accumulator, currChar, currIndex) => {
            let digitWeight = Number(currChar) * ((currIndex % 2) + 1);

            return accumulator += digitWeight > 9 ? digitWeight - 9 : digitWeight;
        }, 0);

        return 10 - (rawCheckDigit % 10);
    },
    randomElement: (array) => {
        return array[Math.floor(Math.random() * array.length)]
    }
}
