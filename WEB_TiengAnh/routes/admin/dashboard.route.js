const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/admin/CRUD_readingTOEIC.controller"); // Đảm bảo đường dẫn đúng!

router.get("/dashboard", questionController.getDashboard);

module.exports = router;
