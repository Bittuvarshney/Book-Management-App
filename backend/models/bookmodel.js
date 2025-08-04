const mongoose = require("mongoose");

const bookschema = new mongoose.Schema({
    BookName:{
        type:String,
        require:true
    },
    Tittle:{
        type:String,
        require:true
    },
    Author:{
        type:String,
        require:true
    },
    SellingPrice:{
        type:String,
        require:true
    },
    PublishedDate:{
        type:String,
        
    }
},{timestamps:true});

const book = mongoose.model("Books",bookschema);

module.exports = {book};