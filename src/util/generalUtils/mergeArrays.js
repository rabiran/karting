/**
 * Combine two arrays into one with no duplicates.
 * @param {Array} arr1
 * @param {Array} arr2
 */
module.exports = (arr1, arr2) => {
        return [...new Set([...arr1,...arr2])];
}