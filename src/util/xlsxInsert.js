const bodyParser = require("body-parser");
      multer = require("multer");
      XLSX = require("xlsx");
      upload = multer();
      diffsHandler = require('./diffsHandler');
      express = require("express");
      fn = require('../config/fieldNames');
      router = express.Router();

router.use(bodyParser.urlencoded({extended:true}))

router.post("/excel", upload.single("file"), (req,res) => {
    try
    {
        if(req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            let workbook = XLSX.read(req.file.buffer, {type:"buffer"});
            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let range = XLSX.utils.decode_range(sheet['!ref']);
            let excelUsers =[];
            for(let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
                currUser = 
                {
                    "personalNumber": sheet[XLSX.utils.encode_cell({r:rowNum, c:0})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:0})].v : "",
                    "identityCard": sheet[XLSX.utils.encode_cell({r:rowNum, c:1})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:1})].v : "",
                    "firstName": sheet[XLSX.utils.encode_cell({r:rowNum, c:2})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:2})].v : "",
                    "lastName": sheet[XLSX.utils.encode_cell({r:rowNum, c:3})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:3})].v : "",
                    "mail": sheet[XLSX.utils.encode_cell({r:rowNum, c:4})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:4})].v : "",
                    "entityType": sheet[XLSX.utils.encode_cell({r:rowNum, c:5})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:5})].v : "",
                    "rank": sheet[XLSX.utils.encode_cell({r:rowNum, c:6})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:6})].v : "",
                    "clearance": sheet[XLSX.utils.encode_cell({r:rowNum, c:7})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:7})].v : "",
                    "hierarchy": sheet[XLSX.utils.encode_cell({r:rowNum, c:8})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:8})].v : "",
                    "phone": sheet[XLSX.utils.encode_cell({r:rowNum, c:9})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:9})].v : "",
                    "mobilePhone": sheet[XLSX.utils.encode_cell({r:rowNum, c:10})] ? sheet[XLSX.utils.encode_cell({r:rowNum, c:10})].v : "",
                }
                excelUsers.push(currUser);
            }
            diffsHandler({added: excelUsers}, fn.dataSources.excel , null);
    
            res.send("ok");
        } else {
            res.status(400).send("Wrong file type!");
        }
    }
    catch(err) {
        res.status(500).send("No file was send..")
    }
})

module.exports = router;