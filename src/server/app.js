// A simple express web server for running the site locally

var express = require("express");
var app = express();
app.use(express.logger());
var fs = require('fs');

var Note = require(__dirname + '/Note.js');

app.get('/', function(req, res) {
    console.log("foo " + __dirname);
    fs.readFile(__dirname + '/public/html/index.html', 'utf8', function(err, text) {
        console.log('text ' + text);
        res.send(text);
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Chordgrids listening on " + port);
});