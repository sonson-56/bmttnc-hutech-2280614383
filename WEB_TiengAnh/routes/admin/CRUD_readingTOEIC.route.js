const express = require("express");
const router = express.Router();

const questionController = require("../../controllers/admin/CRUD_readingTOEIC.controller");
const upload = require("../../middlewares/upload.middleware");


// Hiển thị trang dashboard chính với lựa chọn loại đề
router.post("/questions/add", upload.single("image"), questionController.createQuestion);

// Lấy danh sách câu hỏi
router.get("/questions", questionController.getAllQuestions);

// Hiển thị form thêm câu hỏi
router.get("/questions/create", questionController.showCreateForm);

// Xử lý thêm câu hỏi
router.post("/questions/add", questionController.createQuestion);


// Hiển thị form chỉnh sửa câu hỏi
router.get("/questions/edit/:id", questionController.showEditForm);

// Xử lý cập nhật câu hỏi
router.post("/questions/update/:id", upload.single("image"), questionController.updateQuestion);



// Hiển thị form tìm kiếm
router.get("/questions/search", questionController.showSearchForm);

// Xử lý tìm kiếm câu hỏi
router.get("/questions/search-results", questionController.searchQuestions);

// Xóa câu hỏi
router.get("/questions/delete/:id", questionController.deleteQuestion);

module.exports = router;
