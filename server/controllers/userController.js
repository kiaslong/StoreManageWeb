const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
require('dotenv').config();
const sendEmail = require('../services/sendMail')
const generateLoginLink =require('../services/loginLink')

const secretKey = process.env.SECRET_KEY;


const getUserList = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 ,token:0}); // Exclude the password field from the response
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyToken = async (req, res) => {
    try {
      const { token } = req.body;
      
      const user = await User.findOne({ token });
  
      if (!user) {
        return res.status(404).json({ message: 'Token not found' });
      }
  
      res.status(200).json({ message: 'Token found', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const usernameFromEmail = email.split('@')[0];
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const uuid = uuidv4();
    const hashed = crypto.createHash('sha256').update(uuid).digest('hex');
    const token = hashed.substring(0, 9);

    const hashedPassword = await bcrypt.hash(usernameFromEmail, 10);

    const newUser = new User({
      username: usernameFromEmail,
      fullname: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    await newUser.save();

    const loginLink = generateLoginLink(newUser._id); 

    const emailContent = `
    <p>Hello ${name},</p>
    <p>Your login token is: ${token}</p>
    <p>Use this token to login within 1 minute.</p>
    <p>Click the link below to login:</p>
    <a href=http://localhost:3001/verify/${loginLink}">${loginLink}</a>
    <p>Note: This link will expire in 1 minute.</p>
  `;

  // Send email to the user
  await sendEmail({
    to: email,
    subject: 'Your Login Token',
    html: emailContent,
  });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' }); 
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserList, registerUser, updateUser, deleteUser,verifyToken };
