const mongoose = require("mongoose"); 

var hotelSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Hotel", hotelSchema);

