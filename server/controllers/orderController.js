const Order = require('../models/OrderModel');
const Customer= require('../models/CustomerModel')
const Product= require('../models/ProductModel')

const createOrder = async (req, res) => {
    try {
    
      const orderData = req.body;
     
      let customer = await Customer.findOne({ phoneNum: orderData.phoneNum });
  
      if (!customer) {
        customer = new Customer({
          phoneNum: orderData.phoneNum,
          fullName: orderData.fullName,
          address: orderData.address,
        });
  
        await customer.save();
      }
  
      const order = new Order(orderData);
  
      
      for (const product of orderData.products) {
        const existingProduct = await Product.findOne({barcode:product.value.barcode});
  
        if (existingProduct) {
          existingProduct.quantity -= product.quantity;
          await existingProduct.save();
        }
      }
  
      await order.save();
  
      customer.orderIds.push(order._id);
      await customer.save();
  
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAnalyticsData = async (req, res) => {
  try {
    const { timeline } = req.query;
    let startDate;
    let endDate;

    switch (timeline) {
      case 'today':
        startDate = new Date();
        endDate = new Date();
        break;
      case 'yesterday':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);
        break;
      case 'last7days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        endDate = new Date();
        break;
      case 'thismonth':
        startDate = new Date();
        startDate.setDate(1);
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        break;
        case 'custom':
          const { start, end } = req.query;
          if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
            res.status(400).json({ error: 'Invalid start or end date' });
            return;
          }
          startDate = new Date(start);
          endDate = new Date(end);
          break;
          
      default:
        res.status(400).json({ error: 'Invalid timeline selected' });
        return;
    }

    // Fetch analytics data from the database
    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalAmount = orders.reduce((total, order) => total + order.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = orders.reduce((total, order) => total + order.totalQuantity, 0);

    res.status(200).json({ totalAmount, totalOrders, totalProducts, orders });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getAnalyticsData,
};
