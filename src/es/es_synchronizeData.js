var fs = require('fs');
const axios = require("axios");
const moment = require("moment");
require('dotenv').config()

module.exports = async()=>{
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    // get the update data from the remote server
    let es_Data = await axios.get(process.env.ES_API);
    // save the new json as file in the server
    try{
        fs.writeFileSync(`./data/es/es_${dateAndTime}.txt`,JSON.stringify(es_Data.data));
        console.log(`the es data from ${dateAndTime} successfully saved`);
        // move the old data files to the archive
        let files = fs.readdirSync('./data/es/')
        files.map(file=>{
            if (file != `es_${dateAndTime}.txt` && file != 'archive' && file != 'completeData'){
                fs.renameSync(`./data/es/${file}`, `./data/es/archive/${file}`);
                console.log(`${file} successfully moved to es archive`);   
            } 
        })
        return es_Data.data;
    }     
    catch(err){
        return err.message; 
    };
};