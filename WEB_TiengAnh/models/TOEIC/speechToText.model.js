const mongoose = require('mongoose');

const speechToTextSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalAudio: { type: String, required: true }, // URL hoặc path đến file audio
    convertedText: { type: String, required: true },
    language: { type: String, default: 'en-US' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeechToText', speechToTextSchema);