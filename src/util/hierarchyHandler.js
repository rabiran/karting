const axios = require('axios');
const p = require('../config/paths');
const logger = require('./logger');

// This module accept person's hierarchy and check if the hierarchy exist.
// If yes- the module return the last hierarchy's objectID,
// else- the module create the relevant hierarchies and return the objectID of the last hierarchy.

module.exports = async (hierarchy_obj, hierarchy)=>{
    let hierarchy_arr = hierarchy.split('/');
    let hierarchyAfterProcess;
    let lastGroupID 
    for (group of hierarchy_arr){
        (hierarchy_arr.indexOf(group) === 0) ? hierarchyAfterProcess=group : hierarchyAfterProcess = hierarchyAfterProcess.concat('/', group);
        if (!hierarchy_obj[hierarchyAfterProcess]){
            let new_group = {
                name: group,
                parentId: lastGroupID,
            }

            await axios.post(p().KARTOFFEL_ADDGROUP_API,new_group)
            .then((result)=>{ 
                hierarchy_obj[hierarchyAfterProcess] = result.data. id;
                logger.info(`success to add the hierarchy "${hierarchyAfterProcess}" to Kartoffel`);
            
            })
            .catch((error)=>{
                logger.error(`failed to add the hierarchy "${hierarchyAfterProcess}" to Kartoffel. the error message: "${error.response.data}"`);
            })
        }

        lastGroupID = hierarchy_obj[hierarchyAfterProcess]; 
    }
    return lastGroupID;
}