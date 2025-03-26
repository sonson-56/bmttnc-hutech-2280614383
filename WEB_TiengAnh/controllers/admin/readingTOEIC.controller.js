const Question = require('../../models/question.model.js'); 

// Lấy tất cả câu hỏi TOEIC
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ MaCC: "TOEIC" });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm câu hỏi mới
exports.addQuestion = async (req, res) => {
  try {
    const { part, question, options, correctAnswer } = req.body;
    const newQuestion = new Question({ MaCC: "TOEIC", part, question, options, correctAnswer });
    await newQuestion.save();
    res.json({ message: "Thêm câu hỏi thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy câu hỏi theo part
exports.getQuestionsByPart = async (req, res) => {
  try {
    const part = parseInt(req.params.part);
    const questions = await Question.find({ MaCC: "TOEIC", part });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
