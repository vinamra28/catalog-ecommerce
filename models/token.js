/**
 * Token Schema
 * This file is responsible for defining fields of token entity.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  token: {
    type: String
  },
  time: {
    type: Number
  },
  expired: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

let tokenModel = mongoose.model('token', tokenSchema);

module.exports = tokenModel;
