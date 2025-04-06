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
  }
}, { timestamps: true });

module.exports = mongoose.model("Question", readingToiecSchema,"Reading_TOEIC");
