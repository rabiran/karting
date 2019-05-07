const fs = require('fs');
const diff = require("diff-arrays-of-objects");
const logger = require('./logger');

/**
 * Finds the differences between two files of dataSources (array of objects)
 *
 * @param {*} updateData The new dataSource file
 * @param {*} path The location of the previous dataSource file (without "/" at the end of the path)
 * @param {*} previous_data_file_name The previous dataSource file's name
 * @param {*} comparison_field The name of the filed by which the comparison will be made
 * @returns Array of 4 arrays that present the results of the comparison: [added,updated,same,removed] 
 */
module.exports = (updateData, path, previous_data_file_name, comparison_field) => {

    // read the data from the previous_data_file
    try {
        previous_data_file = fs.readFileSync(`${path}/${previous_data_file_name}`, 'utf8');
        previous_data = JSON.parse(previous_data_file);
    } catch (err) {
        if (err) {
            if (previous_data_file_name === undefined) {
                previous_data = [];
            } else {
                logger.error(`Reading the previous data file:"${previous_data_file_name}" failed. The error message: "${err.message}"`);
            }
        }
    }

    // Finds the differences between the last two " data" files 
    const data_diff = diff(previous_data, updateData, comparison_field, { updatedValues: 4 });

    return {
        added: data_diff.added,
        updated: data_diff.updated,
        same: data_diff.same,
        removed: data_diff.removed,
    };

}