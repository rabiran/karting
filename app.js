let express = require("express")
let app = express()
let port = 3001

app.get("/getEightSocks", (req, res) => {
    res.json(require("./mocks/eightsocks.json"))
})

app.get("/getAka", (req, res) => {
    res.json(require("./mocks/AKA.json"))
})

app.get("/getNva", (req, res) => {
    res.json(require("./mocks/nVa.json"))
})

app.listen(port, () => console.log("Server run on " + port))