const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const generateLoginLink = (userId) => {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1m' }); // Expires in 1 minute
    return token;
  };

  module.exports = generateLoginLink;