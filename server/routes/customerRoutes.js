const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById)
router.get('/:id/orderhistory', customerController.getCustomerPurchaseHistory);

module.exports = router;
