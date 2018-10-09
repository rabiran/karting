// This module accept person hierarchy and check if the hierarchy exit.
// If yes- the modue return the last hierarchy's objectID,
// else- the module create the relevant hierarchies and return the objectID of the last hierarchy.
const axios = require('axios');
const _ = require('lodash');
const colors = require('./colorsForLogs');

module.exports = async (hierarchy_obj)=>{
    let hierarchy_arr = Object.values(hierarchy_obj);
    // This loop create array with the names of the new hierarchy that need to be created
    hierarchy_to_add = [];
    while (hierarchy_arr[hierarchy_arr.length-1] == null) {
        let nullKey = _.findKey(hierarchy_obj,(obID) => {
            return obID === hierarchy_arr[hierarchy_arr.length-1]
        })
        hierarchy_to_add.push(nullKey);
        delete hierarchy_obj[nullKey];
        hierarchy_arr = hierarchy_arr.splice(0,hierarchy_arr.length-1);
    }

    // Add the missing hierarchies to Kartoffel
    for (let new_hierarchy_name of hierarchy_to_add){
        let new_group = {
            name: new_hierarchy_name,
            parentID: hierarchy_arr[hierarchy_arr.length-1],
        }
        
        await axios.post(process.env.KARTOFFEL_ADDGROUP_API,new_group)
            .then((result)=>{ 
                hierarchy_obj[new_hierarchy_name] = result.data._id;
                hierarchy_arr = Object.values(hierarchy_obj);
                console.log(`${colors.green}success to add the hierarchy "${new_hierarchy_name}" to Kartoffel`);
            })
            .catch((error)=>{
                console.log(`${colors.red}failed to add the hierarchy "${new_hierarchy_name}" to Kartoffel. the error message: "${error.response.data}"`)
            })
    }
    let parentID = hierarchy_arr[hierarchy_arr.length-1]
    return parentID;
};
