const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/Note');

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ── Helper: call Groq AI ──
const callGroq = async (prompt) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  const data = await response.json();
  console.log('Groq response status:', response.status);
  if (!data.choices || !data.choices[0]) {
    console.log('Groq error:', JSON.stringify(data));
    throw new Error('Groq API error');
  }
  return data.choices[0].message.content;
};

// ── CREATE NOTE ──
router.post('/', auth, async (req, res) => {
  try {
    const { title, originalText } = req.body;

    const aiPrompt = `
      Analyze these study notes and respond ONLY with valid JSON (no extra text, no markdown, no backticks):
      
      Notes: "${originalText}"
      
      Return this exact JSON structure:
      {
        "summary": "5-6 sentence summary of the notes",
        "flashcards": [
          { "question": "...", "answer": "..." },
          { "question": "...", "answer": "..." },
          { "question": "...", "answer": "..." },
          { "question": "...", "answer": "..." },
          { "question": "...", "answer": "..." }
        ],
        "quiz": [
          {
            "question": "...",
            "options": ["option A", "option B", "option C", "option D"],
            "correct": "option A"
          },
          {
            "question": "...",
            "options": ["option A", "option B", "option C", "option D"],
            "correct": "option B"
          },
          {
            "question": "...",
            "options": ["option A", "option B", "option C", "option D"],
            "correct": "option C"
          }
        ]
      }
    `;

    const aiResponse = await callGroq(aiPrompt);
    const clean = aiResponse.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    const note = await Note.create({
      userId: req.userId,
      title,
      originalText,
      summary: parsed.summary,
      flashcards: parsed.flashcards,
      quiz: parsed.quiz,
      chatHistory: []
    });

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating note' });
  }
});

// ── GET ALL NOTES ──
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).select('title summary createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// ── GET SINGLE NOTE ──
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// ── CHAT ──
router.post('/:id/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const prompt = `
      Here are the study notes for context:
      ${note.originalText}
      
      Chat history:
      ${note.chatHistory.map(h => `${h.role}: ${h.content}`).join('\n')}
      
      User question: ${message}
      
      Answer helpfully based on the notes above.
    `;

    const aiReply = await callGroq(prompt);

    note.chatHistory.push({ role: 'user', content: message });
    note.chatHistory.push({ role: 'assistant', content: aiReply });
    await note.save();

    res.json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ message: 'Chat error' });
  }
});

// ── DELETE ──
router.delete('/:id', auth, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting' });
  }
});

module.exports = router;