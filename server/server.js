const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes')
const cors = require('cors');
const path = require('path');

mongoose.connect('mongodb+srv://kiraslong:longprobi1@datagrid.jgjusuw.mongodb.net/?retryWrites=true&w=majority', {

});

const corsOptions = {
    origin: '*', 
  };
app.use(cors(corsOptions));
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json({ limit: '1mb' }));


app.use('/users',userRoute)
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/customers', customerRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});