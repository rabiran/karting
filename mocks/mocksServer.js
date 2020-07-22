let express = require("express")
let app = express()
let port = 3001
let data = [];

app.use((req, res, next) => {
    if (req.headers['authorization'] === "123") {
        next()
    }
    else{
        throw "unauthorized";
    }
})

app.get("/getEightSocks", (req, res) => {
    data = require("./mocksFiles/eightsocks.json");
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAkaTelephone", (req, res) => {
    data = require("./mocksFiles/getAkaTelephone.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAkaEmployees", (req, res) => {
    data = require("./mocksFiles/getAkaEmployees.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAD/s", (req, res) => {
    data = require("./mocksFiles/AD.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAD/NN", (req, res) => {
    data = require("./mocksFiles/AD.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getCity", (req, res) => {
    data = require("./mocksFiles/city.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

function searchInData(data, query) {
    let foundRecord = data.find(record => {
        return JSON.stringify(record).includes(query);
    })
    return foundRecord;
}




app.listen(port, () => console.log("mocksGenerator server run on port:" + port))
