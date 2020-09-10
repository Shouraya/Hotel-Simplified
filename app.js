var express = require ("express");
var app = express();
// HTTP Logging
var morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));


app.get("/", (req, res) => {
    res.send("Hello !");
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});