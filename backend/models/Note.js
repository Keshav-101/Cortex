const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const QuizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correct: String
});

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  originalText: { type: String, required: true },
  summary: { type: String },
  flashcards: [FlashcardSchema],
  quiz: [QuizSchema],
  chatHistory: [{
    role: String,    // 'user' or 'assistant'
    content: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);