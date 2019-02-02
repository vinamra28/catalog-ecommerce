
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
	autoId:{
		type: Number
	},
	userId:
	{ 
		type: Schema.Types.ObjectId, 
		ref: 'user' 
    },
    transactionNo: {
        type: Number
    },
    item: {
        type: String
    },
    amount: {
        type: String
    },
    quentity: {
        type: String
    }
},{timeStamps: true})


orderSchema.plugin(autoIncrement.plugin,
    { model: 'order',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const Order = mongoose.model('order', orderSchema);

module.exports = Order;


