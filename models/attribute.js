
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
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

const attributeSchema = new Schema({
	autoId:{
		type: Number
	},
	active:{
		type: Boolean,
		default: false
	},
	attributeSet: [attributeSetSchema]
},{timeStamps: true})


attributeSchema.plugin(autoIncrement.plugin,
    { model: 'attribute',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
	});
	
attributeSchema.plugin(patcher);

const AttributesModel = mongoose.model('attribute', attributeSchema);

module.exports = AttributesModel;


