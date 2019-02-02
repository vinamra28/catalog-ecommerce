/**
* Cart Schema :: Define cart schema for various tasks like CRUD
*
**/
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;

let productSchema = new Schema(
    {
        productId:
        {
            type:Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:
        {
            type:Number,
            default:1
        },
        total:
        {
            type:Number
        },
        createdAt:
        {
            type:Date,
            default:Date.now,
            expires:360
        }
    },{timestamps: true});

let cartSchema = new Schema(
    {
        autoId:
        {
            type:Number
        },
        userId:
        {
            type:Schema.Types.ObjectId,
            ref:'user',
            unique:true
        },
        subTotal:
        {
            type:Number,
            default:0
        },
        totalItems:
        {
            type:Number,
            default:0
        },
        products: [productSchema]
    });    
    cartSchema.plugin(autoIncrement.plugin,
        {
            model: 'cart',
            field: 'autoId',
            startAt: 1,
            incrementBy: 1
        });
    
    cartSchema.plugin(patcher);
    
    CartModel = mongoose.model('cart',cartSchema);
    
    module.exports = {
        CartModel : CartModel,
        productSchema : productSchema
    };