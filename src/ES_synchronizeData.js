var fs = require('fs-extra');
const axios = require("axios");
const moment = require("moment");
const util = require('util');
require('dotenv').config()

module.exports = ()=>{
    let es_updateData = {};
    // get the new json from the remote server
    axios.get(process.env.EIGHTSOCKS_API)
        // save the new json as file in the server
        .then((response)=>{
            const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
            try
            {
                fs.writeFileSync(`./data/es/es_${dateAndTime}.txt`,util.inspect(response.data,{depth: null}));
                this.es_updateData = response.data;
                // move the old data files to the archive
                fs.readdir('./data/es/',(err, files)=> {
                    if (err) throw err;
                    let filenames = [];
                    for (let index in files) {
                        if (files[index] != `es_${dateAndTime}.txt` && files[index] !='archive'){
                            fs.move(`./data/es/${files[index]}/`, `./data/es/archive/${files[index]}/`, err => {
                                if (err) return console.error(err);
                            });
                            console.log(`${files[index]} successfully moved to es archive`);
                        } 
                    };
                });
                return; 
            } 
            catch(err){
                this.es_data = `ERROR in save the json from ES as file: ${err.message}`;
                return; 
                
            }
        });
    return es_updateData;
    }