// models/exam.model.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  MaCC: {
    type: String,
    required: true // Ví dụ: "TOEIC"
  },
  TopicN: {
    type: Number,
    required: true // Ví dụ: đề số 1
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    default: 'admin' // người tạo (có thể sau này dùng account admin)
  }
}, {
  timestamps: true
});

// mỗi MaCC chỉ có 1 TopicN duy nhất
examSchema.index({ MaCC: 1, TopicN: 1 }, { unique: true });

module.exports = mongoose.model('Exam', examSchema);
