const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  MaCC: { type: String, required: true }, 
  part: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
