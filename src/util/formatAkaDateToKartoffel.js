module.exports = (date) => {
    let dateArray;

    if (date) {
        dateArray = date.split(' ');
    }

    return dateArray[0] + 'T' + dateArray[1] + '00Z';
}
