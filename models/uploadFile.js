const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const uploadeFile = new Schema({
    fileName:{type:String,require:true,unique:true},
    orignalName:{type:String,require:true},
    size:{type:String,require:true},
},{timestamps:true}) 


module.exports = mongoose.model("File",uploadeFile);