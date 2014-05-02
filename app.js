// A simple express web server for running the site locally

var express = require("express");
var app = express();
app.use(express.logger());
var fs = require('fs');

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Chordgrids listening on " + port);
});