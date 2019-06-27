// var fs = require('fs');
var http = require('http')
// var privateKey  = fs.readFileSync('./sslcert/key_uz.key');
// var certificate = fs.readFileSync('./sslcert/key_uz.pem');

// var credentials = {key: privateKey, cert: certificate};

const express = require("express")
const path = require("path")
const app = express()

app.use(express.static(path.join(__dirname, "dist")))

app.all("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
})

var httpServer = http.createServer(app)

// httpServer.listen(8080)

httpServer.listen(8080, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log("server is listening on 8080")
})
