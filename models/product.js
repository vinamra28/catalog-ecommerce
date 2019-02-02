/**
* Product Schema :: Define category schema for various tasks like CRUD
*
**/
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
});

let variationSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    }
});

let sellingDetailSchema = new Schema({
    duration: {
        type: String,
        enum: ['> 7 days', '> 10 days', '> 30 days', 'Good till cancelled'],
        required: true
    },
    listingTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true
    },
    returnOption: {
        type: String,
        enum: ['Free', 'Charged']
    }
});


let productSchema = new Schema({
    autoId: {
        type: Number
    },
    sku : {
        type : String,
        trim : true
    },
    title: {
        type: String,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    displayOnHomeScreen: {
        type: Boolean,
        default: true
    },
    photos: [Schema.Types.ObjectId],
    categories: [categorySchema],
    variations: [variationSchema],
    attributes: {
        type: Schema.Types.ObjectId,
        ref: 'attribute'
    },
    description: {
        type: String,
        trim: true
    },
    sellingDetails: { sellingDetailSchema },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    }
});


productSchema.plugin(autoIncrement.plugin,
    {
        model: 'product',
        field: 'autoId',
        startAt: 1,
        incrementBy: 1
    });

productSchema.plugin(patcher);


const ProductModel = mongoose.model('product', productSchema);
module.exports = {
    ProductModel: ProductModel,
    SellingDetailSchema: sellingDetailSchema
};

