
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;


const brandSchema = new Schema({
	autoId:{
		type: Number
	},
	name:{
		type: String,
		trim: true
	},
	image:{
		type: Schema.Types.ObjectId,
		ref:'image'
	},
	description:
	{ 
		type: String
	},
},{timeStamps: true})


brandSchema.plugin(autoIncrement.plugin,
    { model: 'brand',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const Brand = mongoose.model('brand', brandSchema);

module.exports = Brand;


