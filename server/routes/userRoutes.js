const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile_images'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  router.patch(
    '/update-profile/:id',
    upload.single('profileImage'), 
    userController.updateUserProfile
  );
router.get('/', userController.getUserList);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/verify', userController.verifyToken);
router.get('/link', userController.redirectToClient);
router.get('/current-user',userController.getUser)
router.put('/change-password/:id', userController.changePassword);
router.put('/toggle-lock/:userId', userController.toggleLock);
router.post('/resend-email/:userId', userController.resendEmail);

module.exports = router;
