// var fs = require('fs');
var https = require('https')
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

var httpsServer = https.createServer(credentials, app)

httpsServer.listen(8080)
