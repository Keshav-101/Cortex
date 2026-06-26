# 🧠 Cortex — AI Knowledge Distillation Engine

> Transform raw notes into structured intelligence. Cortex uses AI to generate summaries, flashcards, quizzes, and a conversational interface from any text.

![Cortex](https://img.shields.io/badge/Cortex-AI%20Powered-6366f1?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- 🤖 **AI Summary** — Instant 5-6 sentence distillation of any notes
- 🃏 **Flashcards** — Auto-generated tap-to-flip study cards
- ❓ **Quiz** — Multiple choice questions with scoring
- 💬 **Chat** — Ask questions about your notes conversationally
- 🔐 **Auth** — Secure JWT-based login and signup
- 📦 **Per-user storage** — Every user's notes are private and persistent

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI | Groq LLaMA 3.1 8B |
| Auth | JWT + bcryptjs |

---

## 📁 Project Structure

```
cortex-app/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   └── routes/
│       ├── auth.js
│       └── notes.js
└── frontend/
    └── src/
        ├── App.jsx
        ├── api.js
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── NewNote.jsx
            └── ViewNote.jsx
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/cortex.git
cd cortex
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cortex
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=gsk_your_groq_key_here
```

Start backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🌐 Deployment Guide

### Step 1 — Deploy Backend on Render

1. Go to **render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo → select it
4. Fill in settings:
   - **Name:** `cortex-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Click **"Environment"** tab → add these variables:
   ```
   PORT = 5000
   MONGO_URI = your_mongodb_atlas_uri
   JWT_SECRET = your_secret_key
   GROQ_API_KEY = your_groq_key
   ```
6. Click **"Create Web Service"**
7. Wait 2-3 minutes → you get a URL like `https://cortex-backend.onrender.com`

> ⚠️ For deployment you need MongoDB Atlas (not local). Go to mongodb.com/cloud/atlas → free cluster → get URI.

---

### Step 2 — Update Frontend API URL

Before deploying frontend, update `frontend/src/api.js`:

```javascript
const API = axios.create({ 
  baseURL: 'https://cortex-backend.onrender.com/api'  // your Render URL
});
```

Commit and push this change.

---

### Step 3 — Deploy Frontend on Vercel

1. Go to **vercel.com** → Sign up with GitHub
2. Click **"New Project"**
3. Import your GitHub repo
4. Fill in settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**
6. Wait 1-2 minutes → you get a URL like `https://cortex-app.vercel.app`

---

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create account | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/notes` | Create note + AI generation | ✅ |
| GET | `/api/notes` | Get all user notes | ✅ |
| GET | `/api/notes/:id` | Get single note | ✅ |
| POST | `/api/notes/:id/chat` | Chat with note | ✅ |
| DELETE | `/api/notes/:id` | Delete note | ✅ |

---

## 💡 How the AI Works

1. User pastes raw notes
2. Backend sends a structured prompt to Groq's LLaMA model
3. LLaMA returns JSON with summary, flashcards, and quiz
4. Data is parsed and saved to MongoDB
5. User can also chat — their question + note context is sent to LLaMA

```javascript
// Example prompt structure
`Analyze these notes and return ONLY valid JSON:
{
  "summary": "...",
  "flashcards": [...],
  "quiz": [...]
}`
```

---

## 🎯 Interview Talking Points

- **"How does the AI work?"** → Prompt engineering with Groq's LLaMA API. I structure the prompt to return JSON, parse it, and store in MongoDB.
- **"What's your DB schema?"** → Users and Notes collections. Notes embed flashcards and quiz as sub-documents with chat history as an array.
- **"How is auth handled?"** → JWT tokens, bcrypt password hashing, protected routes via Express middleware.
- **"How did you handle AI errors?"** → Try/catch around API calls, strip markdown fences before JSON parsing, text trimming to stay within token limits.

---

## 👤 Author

**Keshav** — [github.com/Keshav-101](https://github.com/Keshav-101)

---

## 📄 License

MIT License — free to use and modify.
