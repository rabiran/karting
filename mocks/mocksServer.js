const express = require("express")
const app = express()
const {exec} = require('child_process');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let port = 3001

app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.headers['authorization'] === "123") {
        next()
    }
    else{
        throw "unauthorized";
    }
})
let data;

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

app.get("/getCity", (req, res) => {
    res.json(require("./mocksFiles/city.json"))
})

app.post("/immediateRun", (req, res) => {
    console.log(req.body);
    data = req.body;
    exec('npm start');
    res.json('yes');
})

app.get("/immediateRun", (req, res) => {
    res.json(data);
})

app.listen(port, () => console.log("mocksGenerator server run on port:" + port))
