const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  token: {
    type: String,
    default: null, 
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
