const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    unique: true,
    required: true,
  },
  importPrice: {
    type: String,
    required: true,
  },
  retailPrice: {
    type: String,
    required: true,
  },
  quantity:{
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
