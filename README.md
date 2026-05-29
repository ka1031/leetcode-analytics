# 🚀 LeetCode AI Analyzer

An AI-powered LeetCode profile dashboard built using React, Express, Tailwind CSS, and Gemini AI.

This application fetches a user's LeetCode data using GraphQL, visualizes statistics, and generates intelligent AI-based insights about problem-solving patterns, weaknesses, strengths, and growth opportunities.

---
🌐 Live Demo
Frontend

https://leetcode-analytics-three.vercel.app/

Backend

https://leetcode-analytics-backend.onrender.com

# ✨ Features

## 📊 Dashboard Analytics

* Total solved problems
* Difficulty-wise breakdown
* Contest ratings and rankings
* Topic/tag coverage
* Language usage statistics
* Recent submissions

## 🤖 AI-Powered Insights

Using Gemini AI, the app analyzes:

* Problem-solving consistency
* Contest performance trends
* Weak areas
* Strengths
* Growth opportunities
* Recommended next steps

## 🎨 Modern UI

* Responsive dashboard
* Tailwind CSS styling
* Interactive components
* Clean card-based layout

---

# 🛠️ Tech Stack

## Frontend

* React
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* Axios

## APIs

* LeetCode GraphQL API
* Gemini AI API

---

# 📁 Project Structure

```bash
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ka1031/leetcode-analytics
cd project
```

---

# 🔧 Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create `.env`

```env
GEMINI_API_KEY=your_api_key_here
```

## Start backend server

```bash
npm run dev
```

or

```bash
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 Getting Gemini API Key

Get your API key from:

https://aistudio.google.com/app/apikey

---

# 📡 API Endpoints

## Get LeetCode User Data

```http
GET /user/:username
```

---

## Generate AI Insights

```http
POST /insights
```

### Request Body

```json
{
  "profileData": {}
}
```

---

# 🧠 AI Insights Example

```json
{
  "strengths": [
    "Strong consistency in medium difficulty problems"
  ],

  "weaknesses": [
    "Low hard problem exposure"
  ],

  "recommendations": [
    "Increase contest participation frequency"
  ]
}
```

# 🚀 Future Improvements

* Submission heatmaps
* Contest rating graphs
* AI-generated learning roadmap
* Topic mastery scores
* Authentication
* Compare multiple profiles
* Export profile reports
* Dark mode
* Deploy with Docker

---

# 🧑‍💻 Author

Aayush Kumar

---
