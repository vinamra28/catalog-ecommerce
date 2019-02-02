const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

let vendorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        unique: true,
        dropDups: true,   // to drop dublicate
        required: true
    },
    created_at: { type: String },
    autoId: {
        type: Number,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        lowercase: true
    },
    profilePic: {
        type: String,
        trim: true
    },
    streetAddress: {
        type: String,
    },
    landMark: {
        type: String
    },
    city: {
        type: String,
        trim:true
    },
    state: {
        type: String,
        trim:true
    },
    country: {
        type: String,
        trim:true
    },
    pinCode: {
        type: Number,
        trim: true
    },
    alternateMobileNo: {
        type: String,
        trim: true
    },
    aadhaarCardNo: {
        type: Number,
        trim: true
    },
    panCard: {
        type: String,
        trim: true
    },
    panCardImage: {
        type: String,
        trim: true
    },
}, {
        timestamps: true
    });

vendorSchema.plugin(autoIncrement.plugin,
    {
        model: 'vendor',
        field: 'autoId',
        startAt: 1,
        incrementBy: 1
    });
const Vendor = mongoose.model('vendor', vendorSchema);

module.exports = Vendor;