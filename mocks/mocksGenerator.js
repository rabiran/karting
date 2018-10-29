let express = require("express")
let app = express()
let port = 3001

app.get("/getEightSocks", (req, res) => {
    res.json(require("./mocksFiles/eightsocks.json"))
})

app.get("/getAkaPhones", (req, res) => {
    res.json(require("./mocksFiles/getAkaPhones.json"))
})

app.get("/getAkaTelephone", (req, res) => {
    res.json(require("./mocksFiles/getAkaTelephone.json"))
})

app.get("/getAkaEmployees", (req, res) => {
    res.json(require("./mocksFiles/getAkaEmployees.json"))
})

app.get("/getNva", (req, res) => {
    res.json(require("./mocksFiles/nVa.json"))
})

app.listen(port, () => console.log("mocksGenerator server run on port:" + port))