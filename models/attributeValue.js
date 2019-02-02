
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;


const attrubuteValueSchema = new Schema({
	autoId: {
		type: Number
	},
	value: {
		type: String,
		trim: true
	},
	active: {
		type: Boolean,
		default: false
	},
	slug: {
		type: String
	},
	attributeId:
	{
		type: Schema.Types.ObjectId,
		ref: 'attribute'
	},
}, { timeStamps: true })


attrubuteValueSchema.plugin(autoIncrement.plugin,
	{
		model: 'attributevalue',
		field: 'autoId',
		startAt: 1,
		incrementBy: 1
	});
const AttributeValue = mongoose.model('attributevalue', attrubuteValueSchema);

module.exports = AttributeValue;


