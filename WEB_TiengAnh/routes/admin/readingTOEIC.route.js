const express = require('express');
const router = express.Router();
const readingTOEICController = require('../../controllers/admin/readingTOEIC.controller.js');

router.get('/', readingTOEICController.getQuestions);

router.get('/:part', readingTOEICController.getQuestionsByPart);

router.post('/', readingTOEICController.addQuestion);

router.put('/:id', readingTOEICController.updateQuestion);

router.delete('/:id', readingTOEICController.deleteQuestion);

module.exports = router;
