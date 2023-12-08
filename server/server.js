const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoutes')
const cors = require('cors');
const path = require('path');

mongoose.connect('mongodb+srv://kiraslong:longprobi1@datagrid.jgjusuw.mongodb.net/?retryWrites=true&w=majority', {

});
const corsOptions = {
    origin: '*', // Allow requests from this origin
  };
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(cors(corsOptions));
app.use('/users',userRoute)

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});