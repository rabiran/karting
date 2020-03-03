/**
 * Wrapper function with try catch
 *
 * @param {Function} func
 * @param  {...any} args
 * @returns {{result , err}}
 */
module.exports = async (func, ...args) => {
    let tryResult = {};

    try {
        tryResult.result = await func(...args);
    } catch (err) {
        tryResult.err = err;
    }

    return tryResult;
}
