module.exports = (param) => {
    return {
        phone: /^\d{1,2}-?\d{6,7}$|^\*\d{3}$|^\d{4,5}$/,
        mobilePhone: /^\d{2,3}-?\d{7}$/,
        identityCard: (() => {
            idNumber = param.toString();
            if (!idNumber.match(/^\d{5,9}$/g)) return false;
            // The number is too short - add leading zeroes
            idNumber = idNumber.padStart(9, '0');
            //ID Validation
            const accumulator = idNumber.split('').reduce((count, currChar, currIndex) => {
                const num = Number(currChar) * ((currIndex % 2) + 1);
                return count += num > 9 ? num - 9 : num;
            }, 0);
            return (accumulator % 10 === 0);
        })(param),
    }
}