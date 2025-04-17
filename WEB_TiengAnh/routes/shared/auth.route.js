const express = require('express');
const router = express.Router();
const authController = require('../../controllers/shared/auth.controller');
const { verifyToken, isAdmin, noCache } = require('../../middlewares/auth.middleware');


// Đăng ký
router.get('/register', authController.showRegister); // Hiển thị trang đăng ký (GET)
router.post('/register', authController.register);   // Xử lý đăng ký (POST)

// Đăng nhập
router.get('/login', authController.showLogin);      // Hiển thị trang đăng nhập (GET)
router.post('/login', authController.login);  


// Xử lý đăng nhập (POST)
// Đăng xuất
router.get('/logout', noCache, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.redirect('login');
});

// Các route được bảo vệ
router.get('/dashboard', noCache, verifyToken, (req, res) => {
  res.render('dashboard');
});
// Protected routes (cần xác thực)
router.get('/dashboard', verifyToken, (req, res) => {
    res.render('client/pages/dashboard', { user: req.user });
  });
  
  // Admin-only routes
  router.get('/admin', verifyToken, isAdmin, (req, res) => {
    res.render('admin/pages/dashboard', { user: req.user });
  });
  
module.exports = router;