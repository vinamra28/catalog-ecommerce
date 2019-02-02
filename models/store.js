const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

let storeSchema = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'vendor',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    autoId: {
        type: Number,
        trim: true
    },
    created_at: { type: String },
    companyName: {
        type: String,
        trim: true
    },
    about: {
        type: String,
    },
    companyLogo: {
        type: String,
        trim: true
    },
    companyBanner: {
        type: String,
        trim: true
    },
    multipleImage: [{
        type: String,
        trim: true
    }],
    mobileNo: {
        type: String,
        trim: true
    },
    alternateMobileNo: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    Fax: {
        type: Number,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    operationHours: {
        type: Number,
    },
    addressProof: {
        type: String,
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
    bankAccountNo: {
        type: Number,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    ifsc: {
        type: String,
        trim: true
    },
    productCategory: {
        type: String,
        trim: true
    },
    gstNo: {
        type: String,
        trim: true
    },
    Website: {
        type: String,
        trim: true
    },
    supportNumber: {
        type: String,
        trim: true
    },
    supportEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    facebookId: {
        type: String,
        trim: true
    },
    twitterId: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    lat: {
        type: Number,
    },
    long: {
        type: Number,
    },
    status: {
        type: String,
        default: 'open',
        enum: [
            'open',
            'close'
        ]
    }


}, {
        timestamps: true
    });

storeSchema.plugin(autoIncrement.plugin,
    {
        model: 'store',
        field: 'autoId',
        startAt: 1,
        incrementBy: 1
    });
const Store = mongoose.model('store', storeSchema);

module.exports = Store;