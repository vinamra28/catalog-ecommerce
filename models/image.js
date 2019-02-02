/**
* Image Schema :: Define image schema for various tasks like CRUD
*
**/
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;

let imageSchema = new Schema({
    filename : {
        type : String,
        required : true
    },
    isPrimaryImage : {
        type : Boolean,
        default : false
    }
});
imageSchema.plugin(patcher);
  
const ImageModel = mongoose.model('image', imageSchema);
module.exports = ImageModel;