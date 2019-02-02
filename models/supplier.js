/**
 * Supplier Schema
 * This schema is designed to define the attributes of supplier entity.
 */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  autoId: {
    type: Number
  },
  companyName: {
    type: String,
    trim: true,
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  state: {
    type: String,
    trim: true,
    required: true
  },
  postalCode: {
    type: String,
    trim: true,
    required: true
  },
  country: {
    type: String,
    trim: true,
    required: true
  },
  contactNo: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
},{timeStamps: true})

supplierSchema.plugin(autoIncrement.plugin,
    { model: 'supplier',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const SupplierModel = mongoose.model('supplier', supplierSchema);

module.exports = SupplierModel;
