const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/CRUD_readingTOEIC.controller"); // Đảm bảo đường dẫn đúng!

router.get("/dashboard", questionController.getDashboard);

router.get("/dashboard_TOEIC", questionController.getDashboard_TOEIC);

module.exports = router;
