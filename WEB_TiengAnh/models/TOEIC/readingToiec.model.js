const mongoose = require("mongoose");

const readingToiecSchema = new mongoose.Schema({
  MaCC: {
    type: String,
    required: true,
  },
  TopicN: {
    type: Number,
    required: true,
  },
  part: {
    type: Number,
    required: true,
  },
  questionN: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], 
    required: true,
  },
  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
  explanation: {
    type: String,
  },
  Img: {
    type: String, // Đường dẫn tới ảnh (upload)
  },
  difficulty: {
    type: Number,
    enum: [0, 1, 2], // 0: Dễ, 1: Trung bình, 2: Khó
    default: 0
}
}, { timestamps: true });

module.exports = mongoose.model("Question", readingToiecSchema,"Reading_TOEIC");
