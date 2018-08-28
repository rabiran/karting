var fs = require('fs');
const axios = require("axios");
const moment = require("moment");
const util = require('util');
require('dotenv').config()

module.exports = async()=>{
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    // get the update data from the remote server
    let nv_Data = await axios.get(process.env.NV_API);
    // save the new json as file in the server
    try{
        fs.writeFileSync(`./data/nv/nv_${dateAndTime}.txt`,util.inspect(nv_Data.data,{depth: null}));
        console.log(`the nv data from ${dateAndTime} successfully saved`);
        // move the old data files to the archive
        let files = fs.readdirSync('./data/nv/')
        files.map(file=>{
            if (file != `nv_${dateAndTime}.txt` && file != 'archive'){
                fs.renameSync(`./data/nv/${file}`, `./data/nv/archive/${file}`);
                console.log(`${file} successfully moved to nv archive`);   
            } 
        })
        return nv_Data.data;
    }     
    catch(err){
        return err.message; 
    };
};