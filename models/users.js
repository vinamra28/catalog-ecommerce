const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  autoId: {
    type: Number,
    trim: true
  },
  name: {
    type: String,
    lowercase:true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  mobileNo: {
    type: String,
    trim: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'customer',
    enum: [
      'admin',
      'customer',
      'vendor'
    ]
  },
  mobileVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'unblock',
    enum: [
      'unblock',
      'block',
      'pending',
      'approve',
      'disapprove'
      ]
  },
  deleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: String,
    trim: true
  },
  createdOn: {
    type: String,
    trim: true
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: String,
    default: 'self',
    enum: [
      'self',
      'admin'
    ]
  },
  signupType: {
    type: String,
    default: 'normal',
    enum: [
      'normal',
      'facebook',
      'google',
      'twitter'
    ]
  }
}, {
    timestamps: true
  });

UserSchema.plugin(autoIncrement.plugin,
  {
    model: 'user',
    field: 'autoId',
    startAt: 1,
    incrementBy: 1
  });
const User = mongoose.model('user', UserSchema);

module.exports = User;