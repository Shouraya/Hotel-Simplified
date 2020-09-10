var express = require ("express");
var app = express();

app.get("/", (req, res) => {
    res.send("Hello !")
});
app.get("/bye", (req, res) => {
    res.send("Bye !")
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});