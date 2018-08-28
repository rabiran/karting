const shell = require('shelljs');
let express = require("express")
let app = express()
let port = 3001

// shell.exec(`{kill $(lsof -t -i:${port})} &> /dev/null`)
// shell.exec('kill $(lsof -t -i:3001) &>/dev/null',{silent:true});

app.get("/getEightSocks", (req, res) => {
    res.json(require("./mocksFiles/eightsocks.json"))
})

app.get("/getAka", (req, res) => {
    res.json(require("./mocksFiles/AKA.json"))
})

app.get("/getNva", (req, res) => {
    res.json(require("./mocksFiles/nVa.json"))
})

app.listen(port, () => console.log("mocksGenerator server run on port:" + port))