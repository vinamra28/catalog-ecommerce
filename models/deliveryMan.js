const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

let DeliveryManSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    autoId: {
        type: Number,
        trim: true
    },
    name: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
        trim: true
    },
    mobileNo: {
        type: String,
        trim: true
    },
    idProof: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    available: {
        type: Boolean,
        default: true,
        enum: [
            true,
            false
        ]
    },

}, {
        timestamps: true
    });

DeliveryManSchema.plugin(autoIncrement.plugin,
    {
        model: 'deliveryMan',
        field: 'autoId',
        startAt: 1,
        incrementBy: 1
    });
const DeliveryMan = mongoose.model('deliveryMan', DeliveryManSchema);

module.exports = DeliveryMan;