let express = require("express")
let app = express()
let port = 3001

app.use((req, res, next) => {
    // if (req.headers['authorization'] === "123") {
    //     next()
    // }
    // else{
    //     throw "unauthorized";
    // }
    next()
})

app.get("/getEightSocks", (req, res) => {
    let data = require("./mocksFiles/eightsocks.json");
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAkaTelephone", (req, res) => {
    let data = require("./mocksFiles/getAkaTelephone.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAkaEmployees", (req, res) => {
    let data = require("./mocksFiles/getAkaEmployees.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAD/s", (req, res) => {
    let data = require("./mocksFiles/AD.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getAD/NN", (req, res) => {
    let data = require("./mocksFiles/AD.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

app.get("/getCity", (req, res) => {
    let data = require("./mocksFiles/city.json")
    if(Object.keys(req.query).length > 0) {
        data = searchInData(data, Object.values(req.query));
    }
    res.json(data)
})

function searchInData(data, queries) {
    let foundRecord;
    for (query of queries) {
        foundRecord = data.filter(record => {
            return JSON.stringify(record).includes(query);
        })
        if (foundRecord.length) break;
    }

    return foundRecord;
}




app.listen(port, () => console.log("mocksGenerator server run on port:" + port))
