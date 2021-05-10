
module.exports = dateString => {
    let date = dateString ? new Date(dateString) : null;
    if (!date) {
        return null;
    }
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    date = (new Date(date.getTime() - userTimezoneOffset)).toISOString()
    return date;
}