/**
* Category Schema :: Define category schema for various tasks like CRUD
*
**/
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const patcher = require('mongoose-json-patch');
const Schema = mongoose.Schema;


let categorySchema = new Schema({
  autoId: {
    type: Number
  },
  parentCategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    default: null
  },
  hasChild: {
    type: Boolean,
    default: false
  },
  // slug:{
  //   type:String,
  //   trim:true
  // },
  title: {
    type: String,
    trim: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  featuredImage: {
    type: String,
  },
  categorySectionImage: {
    type: String,
  },
  megaMenuImage: {
    type: String,
  },
  categoryDetailImage: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
    // required: true
  },
  metaTitle: {
    type: String
  },
  metaKeyword: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
  }
}, {
    timestamps: true
  });

categorySchema.plugin(autoIncrement.plugin,
  {
    model: 'category',
    field: 'autoId',
    startAt: 1,
    incrementBy: 1
  });

categorySchema.plugin(patcher);

const CategoryModel = mongoose.model('category', categorySchema);

module.exports = CategoryModel;
