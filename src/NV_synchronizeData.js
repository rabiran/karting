var fs = require('fs-extra');
const axios = require("axios");
const moment = require("moment");
const util = require('util');
require('dotenv').config()

module.exports = ()=>{
    let nv_updateData = {};
    // get the new json from the remote server
    axios.get(process.env.NVA_API)
        // save the new json as file in the server
        .then((response)=>{
            const dateAndTime = moment(new Date()).format("DD.MM.YYYY_HH:mm");
            try
            {
                fs.writeFileSync(`./data/nv/nv_${dateAndTime}.txt`,util.inspect(response.data,{depth: null}));
                this.nv_updateData = response.data;
                // move the old data files to the archive
                fs.readdir('./data/nv/',(err, files)=> {
                    if (err){
                        err.message = 'ERROR at reding the files that exist at ./data/nv/';
                        throw err;
                    } 
                    let filenames = [];
                    for (let index in files) {
                        if (files[index] != `nv_${dateAndTime}.txt` && files[index] !='archive'){
                            fs.move(`./data/nv/${files[index]}/`, `./data/nv/archive/${files[index]}/`, err => {
                                if (err){
                                  err.message = `ERROR at move ${files[index]} to the archive`;
                                  throw err;  
                                } 
                            });
                            console.log(`${files[index]} successfully moved to nv archive`);
                        } 
                    };
                });
                return; 
            } 
            catch(err){
                this.nv_updateData = err.message;
                return; 
                
            }
        });
    return nv_updateData;
    }