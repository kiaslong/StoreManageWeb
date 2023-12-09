const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
require('dotenv').config();
const sendEmail = require('../services/sendMail')
const generateLoginLink =require('../services/loginLink');
const fs = require('fs/promises');

const secretKey = process.env.SECRET_KEY;


const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    let profileImagePath;

    // Check if a new file is uploaded in the request
    if (req.file) {
      profileImagePath = req.file.path;

      // Retrieve the existing profile photo URL from the database
      const existingUser = await User.findById(id);
      if (existingUser && existingUser.profilePhotoURL) {
        // Delete the old file (if it exists)
        await fs.unlink(existingUser.profilePhotoURL);
      }
    } else {
      // If no new file is uploaded, retrieve the existing profile photo URL from the database
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      profileImagePath = existingUser.profilePhotoURL;
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          fullname: name,
          email: email,
          profilePhotoURL: profileImagePath,
        },
      },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const resendEmail = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Assume you have a function in your User model to resend emails
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    
    const loginLink = generateLoginLink(user._id); 

    const emailContent = `
    <p>Hello ${user.fullname},</p>
    <p>Your login token is:${user.token}</p>
    <p>Your username and password is: ${user.username}.</p>
    <p>Please remember this token when login</p>
    <p>Click the link below to login:</p>
    <a href=http://localhost:8080/users/link?link=${loginLink}>${loginLink}</a>
    <p>Note: This link will expire in 1 minute.</p>
  `;

    await sendEmail({
      to: user.email,
      subject: 'Your Login Token',
      html: emailContent,
    });
  

    
    res.status(200).json({ message: 'Email resent successfully' });

  } catch (error) {
    console.error('Error resending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const  toggleLock = async (req, res) => {
    try {
      const userId = req.params.userId;

 
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

    
      user.isLock = !user.isLock;

      await user.save();
      res.status(200).json({message: 'Update Lock Status Successfully'});

    } catch (error) {
      console.error('Error toggling lock:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }



const getUserList = async (req, res) => {
  try {
    const users = await User.find(
      { email: { $ne: 'admin@gmail.com' } }, 
      { password: 0, token: 0 } 
    );
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
    <p>Your login token is:${token}</p>
    <p>Your username and password is: ${usernameFromEmail}.</p>
    <p>Please remember this token when login</p>
    <p>Click the link below to login:</p>
    <a href=http://localhost:8080/users/link?link=${loginLink}>${loginLink}</a>
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
      const { username, password } = req.body;
      const user = await User.findOne({ username});
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '8h' }); 
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


const redirectToClient = (req, res) => {
  const token = req.query.link;

  if (!token) {
    return res.status(400).json({ message: 'Invalid link' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Link expired or invalid' });
    }

 
    res.redirect('http://localhost:3000/login');

   
   
  });
};




const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];


    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, secretKey); 

    const userId = decoded.id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: error.message });
  }
};


const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword,passwordChange} = req.body;
    
  
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword; 
    user.passwordChangeRequired=passwordChange;

   
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getUserList, registerUser, updateUser, deleteUser,verifyToken,redirectToClient,loginUser,getUser, changePassword,toggleLock,resendEmail,updateUserProfile};
