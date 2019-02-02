const mongoose   = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
var uniqueValidator = require('mongoose-unique-validator');
const Schema     = mongoose.Schema;

let adminSchema = new Schema({
  autoId: {
    type: Number,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String
  },
  mobileNo: {
    type: Number,
    trim: true
  },
  password: {
    type: String
  },
  role:{
    type: String,
    default: 'ADMIN',
    enum: [
      'ADMIN',
      'USER',
      'VENDOR'
    ]
  }
},{
  timestamps:true
});
adminSchema.plugin(autoIncrement.plugin,
    { model: 'admin',
      field: 'autoId',
      startAt: 1,
      incrementBy: 1
    });
const adminUser = mongoose.model('admin', adminSchema);

module.exports = adminUser;
