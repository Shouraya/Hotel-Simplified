const express = require ("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END

//PUBLIC --> static files (css) & VIEWS/PARTIAL --> HEADER & FOOTER
//Landing Route
app.get("/", (req, res) => {
    res.render("landing");
});

//Display all Hotels that we have
app.get("/hotels", function(req, res){
    var hotels = [
        {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1600189020840-e9918c25269d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"},
        {name: "Granite Hill", image: "https://images.unsplash.com/photo-1600199712217-812672421f0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"},
        {name: "Mountain Goat", image: "https://images.unsplash.com/photo-1600223922079-314143a47b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"}
    ]
    res.render("hotels", {hotels:hotels});
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});