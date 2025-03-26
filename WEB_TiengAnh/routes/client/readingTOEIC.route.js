const express = require('express');
const router = express.Router();
const readingTOEICController = require('../../controllers/client/readingTOEIC.controller.js');

// Lấy tất cả câu hỏi TOEIC
router.get('/', readingTOEICController.getQuestions);

// Lấy câu hỏi theo phần (part)
router.get('/:part', readingTOEICController.getQuestionsByPart);

// Thêm câu hỏi mới
router.post('/', readingTOEICController.addQuestion);

// Cập nhật câu hỏi (theo ID)
router.put('/:id', readingTOEICController.updateQuestion);

// Xóa câu hỏi (theo ID)
router.delete('/:id', readingTOEICController.deleteQuestion);

module.exports = router;
