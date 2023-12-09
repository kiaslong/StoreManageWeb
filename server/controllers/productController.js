const Product = require('../models/ProductModel');
const fs = require('fs');

const productController = {
    getProducts: async (req, res) => {
      try {
        const products = await Product.find();
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  
    addProduct: async (req, res) => {
      try {
        const { productName, importPrice, retailPrice, category, quantity } = req.body;
        const imageURL = req.file ? req.file.path : null;
    
        let barcode;
        let isBarcodeUnique = false;
        let isProductNameUnique = false;
    
        
        while (!isBarcodeUnique) {
          barcode = generateRandomInteger(100000, 999999);
    
          
          const existingProduct = await Product.findOne({ barcode });
    
          if (!existingProduct) {
            // Barcode is unique, exit the loop
            isBarcodeUnique = true;
          }
        }
    
        const existingProductName = await Product.findOne({ productName });
    
        if (!existingProductName) {
          isProductNameUnique = true;
        }
    
        if (!isProductNameUnique) {
          return res.status(400).json({ message: 'Product name already exists' });
        }
    
        const product = new Product({
          barcode: barcode,
          productName,
          importPrice,
          retailPrice,
          category,
          quantity,
          imageUrl: imageURL,
        });
    
        await product.save();
    
        res.status(201).json({ message: 'Product added successfully' });
      } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
      }
    },
    
    
      updateProduct: async (req, res) => {
        try {
          const barcode = req.params.barcode;
          const { productName, importPrice, retailPrice, category, quantity } = req.body;
          const newImageURL = req.file ? req.file.path : null;
      
         
          const existingProduct = await Product.findOne({ barcode });
      
       
          if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
      
          
          const currentImageURL = existingProduct.imageUrl;
      
         
          if (newImageURL && currentImageURL && currentImageURL !== newImageURL) {
            fs.unlinkSync(currentImageURL);
          }
      
        
          const updatedProduct = {
            barcode: barcode,
            productName,
            importPrice,
            retailPrice,
            category,
            quantity,
            imageUrl: newImageURL || currentImageURL, 
          };
      
       
          await Product.findOneAndUpdate({ barcode: barcode }, updatedProduct);
      
          
          res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },

      deleteProduct: async (req, res) => {
        try {
          const barcode = req.params.barcode;
    
          const existingProduct = await Product.findOne({ barcode });
    
          if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
          }
    
          const imageURL = existingProduct.imageUrl;
    
          await Product.findOneAndDelete({ barcode });
    
          if (imageURL) {
            fs.unlinkSync(imageURL);
          }
    
          res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },
    
      
  };





  function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  module.exports = productController;