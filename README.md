# CodeClarify

CodeClarify is an AI-powered code explanation and review tool that helps developers understand source code quickly. Users can paste code snippets and receive structured insights including summaries, step-by-step explanations, identified concepts, potential issues, and improvement suggestions.

The application uses a React frontend and a Flask backend integrated with Google's Gemini AI model.

---

## Features

### AI-Powered Code Analysis
- Generate detailed explanations of source code.
- Understand program flow and logic.
- Identify important programming concepts.

### Multiple Analysis Modes
- Full Analysis
- Bugs Only
- Quick Summary
- Code Review

### Language Detection
Automatically detects:
- Python
- JavaScript
- JSX / React
- Java
- C/C++

### Structured Results
Results are organized into:
- Overview
- Steps
- Concepts
- Issues
- Suggestions

### User-Friendly Interface
- Dark modern UI
- Copy results to clipboard
- Example code snippets
- Real-time language detection
- Loading indicators

---

# System Architecture

```text
+----------------------+
|   React Frontend     |
+----------+-----------+
           |
           | HTTP Requests
           |
           v
+----------------------+
|    Flask Backend     |
+----------+-----------+
           |
           |
           v
+----------------------+
| CodeClarify Agent    |
| - Language Detection |
| - Prompt Generation  |
+----------+-----------+
           |
           |
           v
+----------------------+
| Gemini 2.5 Flash API |
+----------------------+
```

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React Icons

## Backend

- Flask
- Flask-CORS
- Python Dotenv
- Google GenAI SDK
- Pygments

## AI Model

- Gemini 2.5 Flash

---

# Project Structure

```text
CODECLARIFY
│
├── backend
│   ├── agent.py
│   ├── app.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── pages
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── README.md
```

---

# Backend Setup

## Prerequisites

- Python 3.11+ recommended
- Gemini API Key

---

## Create Virtual Environment

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_api_key_here
```

Get an API key from:

https://aistudio.google.com/app/apikey

---

## Run Backend

```bash
python app.py
```

Backend will run at:

```text
http://127.0.0.1:5000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# API Endpoints

## Health Check

### GET /

Returns:

```json
"CodeClarify Backend Running"
```

---

## Analyze Code

### POST /summarize

Request:

```json
{
  "code": "def add(a,b): return a+b",
  "instruction": "Explain this code"
}
```

Response:

```json
{
  "success": true,
  "summary": {
    "overview": "...",
    "steps": [],
    "concepts": [],
    "issues": [],
    "suggestions": []
  }
}
```


---

# Analysis Workflow

## 1. User Input

The user pastes source code into the editor.

## 2. Language Detection

The frontend sends the code to:

```text
POST /detect-language
```

The backend identifies the programming language.

## 3. AI Processing

The backend:

- Detects language
- Builds a prompt
- Sends the prompt to Gemini

## 4. Structured Response

Gemini returns structured JSON containing:

- Overview
- Steps
- Concepts
- Issues
- Suggestions

## 5. Display Results

The frontend renders the response in separate tabs.

---

# Supported Languages

Current support includes:

- Python
- JavaScript
- React JSX
- Java
- C/C++

Additional languages may be detected through Pygments.
