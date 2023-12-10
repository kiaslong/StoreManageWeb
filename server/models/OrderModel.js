const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  phoneNum: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  payMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Card'], // Add more payment methods if needed
  },
  products: [
    {
      value: {
        barcode: String,
        productName: String,
        importPrice: String,
        retailPrice: String,
        quantity: String,
        category: String,
        imageUrl: String,
        creationDate: {
          type: Date,
        },
      },
      label: String,
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  cashBack: {
    type: Number,
    default: 0,
  },
  cashAmount: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  totalQuantity: {
    type: Number, // Add this property for the total quantity of all products
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
