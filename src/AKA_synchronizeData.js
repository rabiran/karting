var fs = require('fs-extra');
const axios = require("axios");
const moment = require("moment");
const util = require('util');
require('dotenv').config()

module.exports = ()=>{
    let aka_updateData = {};
    // get the new json from the remote server
    axios.get(process.env.AKA_API)
        // save the new json as file in the server
        .then((response)=>{
            const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
            try
            {
                fs.writeFileSync(`./data/aka/aka_${dateAndTime}.txt`,util.inspect(response.data,{depth: null}));
                this.aka_updateData = response.data;
                // move the old data files to the archive
                fs.readdir('./data/aka/',(err, files)=> {
                    if (err){
                        err.message = 'ERROR at reding the files that exist at ./data/aka/';
                        throw err;
                    } 
                    let filenames = [];
                    for (let index in files) {
                        if (files[index] != `aka_${dateAndTime}.txt` && files[index] !='archive'){
                            fs.move(`./data/aka/${files[index]}/`, `./data/aka/archive/${files[index]}/`, err => {
                                if (err){
                                    err.message = `ERROR at move ${files[index]} to the archive`;
                                    throw err;  
                                } 
                            });
                            console.log(`${files[index]} successfully moved to aka archive`);
                        } 
                    };
                });
                return; 
            } 
            catch(err){
                this.aka_updateData = err.message;
                return; 
                
            }
        });
    return aka_updateData;
    }