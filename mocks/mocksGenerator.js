let express = require("express")
let app = express()
let port = 3001

app.get("/getEightSocks", (req, res) => {
    res.json(require("./mocksFiles/eightsocks.json"))
})

app.get("/getAkaTelephone", (req, res) => {
    res.json(require("./mocksFiles/getAkaTelephone.json"))
})

app.get("/getAkaEmployees", (req, res) => {
    res.json(require("./mocksFiles/getAkaEmployees.json"))
})

app.get("/getAD", (req, res) => {
    res.json(require("./mocksFiles/AD.json"))
})

app.listen(port, () => console.log("mocksGenerator server run on port:" + port))