const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment-fix');
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
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
  prefix: {
    type: String,
    lowercase:true
  },
  firstName: {
    type: String,
    trim: true,
    lowercase:true
  },
  middleName: {
    type: String,
    trim: true,
    lowercase:true
  },
  lastName: {
    type: String,
    trim: true,
    lowercase:true
  },
  dob: {
    type: String
  },
  anniversaryDob: {
    type: String
  },
  gender: {
    type: String,
    required: true,
    lowercase:true
  },
  welcomeEmail: {
    type: Boolean,
    default: false
  },
  newsLetter: {
    type: Boolean,
    default: false
  },
  alternateMobileNo: {
    type: String,
    trim: true
  },
  address: [{
    prefix: {
      type: String
    },
    firstName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true
    },
    company: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    landMark: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    mobileNo: {
      type: Number,
      trim: true
    },
    alternateMobileNo: {
      type: Number,
      trim: true
    },
    isBilling: {
      type: Boolean,
      default: false
    },
    isShipping: {
      type: Boolean,
      default: false
    }
  }],
}, {
    timestamps: true
  });

CustomerSchema.plugin(autoIncrement.plugin,
  {
    model: 'customer',
    field: 'autoId',
    startAt: 1,
    incrementBy: 1
  });
const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;