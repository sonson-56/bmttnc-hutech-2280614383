const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/client/home.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// --- Route chính ---
router.get('/', homeController.renderHomePage);       // Trang chủ không cần auth


// --- Route bảo mật ---
router.get('/dashboard', 
  authMiddleware.verifyToken, 
  homeController.renderDashboard
);

// // --- API endpoints ---
// router.get('/api/home/stats', homeController.getHomeStats); // API lấy thống kê

module.exports = router;