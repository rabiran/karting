let express = require("express")
let app = express()
let port = 3001

app.use((req, res, next) => {
    // if (req.headers['Authorization'] === process.env.SOURCES_TOKEN) {
    if (req.headers['authorization'] === "123") {
        next()
    }
    else{
        throw "unauthorized";
    }
})

app.get("/getEightSocks", (req, res) => {
    res.json(require("./mocksFiles/eightsocks.json"))
})

app.get("/getAkaTelephone", (req, res) => {
    res.json(require("./mocksFiles/getAkaTelephone.json"))
})

app.get("/getAkaEmployees", (req, res) => {
    res.json(require("./mocksFiles/getAkaEmployees.json"))
})

app.get("/getAD/s", (req, res) => {
    res.json(require("./mocksFiles/AD.json"))
})

app.get("/getAD/NN", (req, res) => {
    res.json(require("./mocksFiles/AD.json"))
})

app.listen(port, () => console.log("mocksGenerator server run on port:" + port))