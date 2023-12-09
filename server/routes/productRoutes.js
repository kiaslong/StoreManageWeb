const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/product_images'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });


  const upload = multer({ storage: storage});

router.get('/', productController.getProducts);

router.post('/add', upload.single('productImage'), productController.addProduct);

router.put('/:barcode',upload.single('productImage') ,productController.updateProduct);

router.delete('/:barcode', productController.deleteProduct);

module.exports = router;
