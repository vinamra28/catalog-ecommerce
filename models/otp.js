/**
 * OTP Schema
 * This file is responsible for defining fields of otp entity.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  otp: {
    type: Number
  },
  time: {
    type: Number
  },
  expired: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

let otpModel = mongoose.model('otp', otpSchema);

module.exports = otpModel;
