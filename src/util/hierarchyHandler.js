const axios = require('axios');
const _ = require('lodash');
const p = require('../config/paths');
const logger = require('./logger');

// This module accept person hierarchy and check if the hierarchy exit.
// If yes- the modue return the last hierarchy's objectID,
// else- the module create the relevant hierarchies and return the objectID of the last hierarchy.

module.exports = async (hierarchy_obj)=>{
    let hierarchy_arr = Object.values(hierarchy_obj);
    hierarchy_obj_length = Object.keys(hierarchy_obj).length;
    hierarchy_obj_name = Object.keys(hierarchy_obj).join("/");
    // This loop create array with the names of the new hierarchy that need to be created
    hierarchy_to_add = [];
    while (hierarchy_arr[hierarchy_arr.length-1] == null) {
        //  prevent infinity loop if the root hierarchy not exist in Kartoffel
        if (hierarchy_to_add.length > hierarchy_obj_length){
            logger.error(`failed to add the hierarchy "${hierarchy_obj_name}" to Kartoffel. check if the root hierarchy exist in Kartoffel`);
            return
        }
        let nullKey = _.findKey(hierarchy_obj,(obID) => {
            return obID === hierarchy_arr[hierarchy_arr.length-1]
        })
        hierarchy_to_add.push(nullKey);
        delete hierarchy_obj[nullKey];
        hierarchy_arr = hierarchy_arr.splice(0,hierarchy_arr.length-1);
    }

    // Add the missing hierarchies to Kartoffel
    if (hierarchy_to_add.length != 0){
        for (let new_hierarchy_name of hierarchy_to_add){
            let new_group = {
                name: new_hierarchy_name,
                parentId: hierarchy_arr[hierarchy_arr.length-1],
            }
            
            await axios.post(p().KARTOFFEL_ADDGROUP_API,new_group)
                .then((result)=>{ 
                    hierarchy_obj[new_hierarchy_name] = result.data._id;
                    hierarchy_arr = Object.values(hierarchy_obj);
                    logger.info(`success to add the hierarchy "${new_hierarchy_name}" to Kartoffel`);
                })
                .catch((error)=>{
                    logger.error(`failed to add the hierarchy "${new_hierarchy_name}" to Kartoffel. the error message: "${error.response.data}"`);
                })
        }
    }   

    let groupID = hierarchy_arr[hierarchy_arr.length-1]
    return groupID;
};
