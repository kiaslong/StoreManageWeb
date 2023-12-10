const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  phoneNum: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  orderIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
  
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
