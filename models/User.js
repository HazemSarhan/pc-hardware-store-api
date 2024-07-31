const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'must provide a valid username'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'must provide a valid email'],
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  /*
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
  */
});

// Hashing User Password
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // While no password changes, don't generate a new hash for password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparing Hash Password With Plain Text User Password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
