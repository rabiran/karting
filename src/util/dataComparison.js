const fs = require('fs');
const diff = require("diff-arrays-of-objects");
const colors = require('../util/colorsForLogs');

/*
    the argument meanning:
    updateData: the data that will compared
    path: the location of the previous_data_file, without "/" at the end of the path
    previous_data_file_name: the previous data file's name
    comparison_field: The field by which the comparison will be made
*/

module.exports = (updateData, path, previous_data_file_name, comparison_field) => {

    // read the data from the previous_data_file
    try {
        previous_data_file = fs.readFileSync(`${path}/${previous_data_file_name}`,'utf8'); 
        previous_data =  JSON.parse(previous_data_file);
    } catch(err) {
        if (err) {
            console.log(`${colors.red} Reading the previous data file:"${previous_data_file_name}" failed. The error message: "${err.message}"`);
        }
    }

    // Finds the differences between the last two " data" files 
    const data_diff = diff(previous_data, updateData, comparison_field,{updateValues: 2 });
        
    return {
        added: data_diff.added,
        updated: data_diff.updated,
        same: data_diff.same,
        removed: data_diff.removed,
    };

}