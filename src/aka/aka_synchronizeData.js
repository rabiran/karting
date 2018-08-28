var fs = require('fs');
const axios = require("axios");
const moment = require("moment");
const util = require('util');
require('dotenv').config()

module.exports = async()=>{
    const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
    // get the update data from the remote server
    let aka_Data = await axios.get(process.env.AKA_API);
    // save the new json as file in the server
    try{
        fs.writeFileSync(`./data/aka/aka_${dateAndTime}.txt`,util.inspect(aka_Data.data,{depth: null}));
        console.log(`the aka data from ${dateAndTime} successfully saved`);
        // move the old data files to the archive
        let files = fs.readdirSync('./data/aka/')
        files.map(file=>{
            if (file != `aka_${dateAndTime}.txt` && file != 'archive'){
                fs.renameSync(`./data/aka/${file}`, `./data/aka/archive/${file}`);
                console.log(`${file} successfully moved to aka archive`);   
            } 
        })
        return aka_Data.data;
    }     
    catch(err){
        return err.message; 
    };
};