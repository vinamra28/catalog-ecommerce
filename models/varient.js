
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;


const varientSchema = new Schema({
	autoId:{
		type: Number
	},
	name:{
		type: String,
		trim: true
	},
	active:{
		type: Boolean,
		default: false
	},
	categoryId:
	{ 
		type: Schema.Types.ObjectId, 
		ref: 'category' 
    },
    attributeId: {
        type: Schema.Types.ObjectId,
        ref: 'categoryattributes'
    }
},{timeStamps: true})


varientSchema.plugin(autoIncrement.plugin,
    { model: 'varient',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const Varient = mongoose.model('varient', varientSchema);

module.exports = Varient;


