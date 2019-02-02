
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;


const attributeSetSchema = new Schema({
	name:{
		type: String,
		enum: ['Text', 'Image', 'Dropdown', 'Price', 'Boolean', 'Date'],
		trim: true,
		required: true
	},
	value : {
		type : String,
		trim: true,
		required : true
	},
	active:{
		type: Boolean,
		default: false
    }
},{timeStamps: true});


attributeSetSchema.plugin(autoIncrement.plugin,
    { model: 'attributeset',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const AttributesSetModel = mongoose.model('attributeset', attributeSetSchema);

module.exports = AttributesSetModel;


