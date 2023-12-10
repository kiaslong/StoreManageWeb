const Customer = require('../models/CustomerModel'); 
const Order = require('../models/OrderModel');
const mongoose = require('mongoose');

 const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






const getCustomerById = async (req, res) => {
  const customerId = req.params.id; 

  try {
    // Convert the customer ID to ObjectId
    const customerIdObject = new mongoose.Types.ObjectId(customerId);

    const customer = await Customer.findById(customerIdObject);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);

  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getCustomerPurchaseHistory = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

  
    const orders = await Order.find({ _id: { $in: customer.orderIds } });

    res.json(orders);
    
  } catch (error) {
    console.error('Error fetching customer purchase history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






module.exports = { getCustomers,getCustomerById ,getCustomerPurchaseHistory};
