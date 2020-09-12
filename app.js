var express = require ("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
// HTTP Logging
var morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));

//PUBLIC --> static files (css) & VIEWS --> ejs VIEWS/PARTIAL --> HEADER & FOOTER
app.get("/", (req, res) => {
    res.send("Hello !");
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});