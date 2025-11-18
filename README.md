# FacelessScriptPro

AI-Powered Script Generator for Faceless YouTube Videos

## Overview

FacelessScriptPro is a comprehensive platform that generates high-quality, long-form scripts (10,000-100,000 characters) for faceless YouTube videos. It uses AI to analyze example scripts and generate new content that matches the desired style and tone.

### Key Features

- **20 Different Niches**: Emotional, Horror, Mystery, Adventure, Educational
- **AI-Powered Analysis**: DeepSeek R1 analyzes your script examples
- **Intelligent Generation**: Gemini 2.5 Flash generates scripts with smart chunking
- **Flexible Length**: Generate scripts from 10K to 100K characters
- **Download & Copy**: Easy export functionality
- **User Management**: Discord OAuth (placeholder) and API key storage

## Tech Stack

### Frontend
- React 18+
- TailwindCSS
- Axios
- React Hot Toast
- Lucide React

### Backend
- Node.js 18+
- Express.js
- PostgreSQL 15+
- DeepSeek R1 (via OpenRouter - FREE)
- Gemini 2.5 Flash (user provides API key)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ (optional for database features)
- Gemini API key (get free from https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd script
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Backend (.env):
```bash
cd backend
# .env file is already created with default values
# Update DATABASE_URL if using PostgreSQL
```

Frontend (.env):
```bash
cd frontend
# .env file is already created
# Update REACT_APP_API_URL if needed
```

5. **Start the Backend**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

6. **Start the Frontend**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## Usage

### 1. Get Your Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Create a new API key
4. Copy the key

### 2. Login (Demo)

1. Open http://localhost:3000
2. Click "Login with Discord (Demo)"
3. You'll be logged in with a demo account

### 3. Add Your API Key

1. Scroll to "API Key Settings"
2. Paste your Gemini API key
3. Click "Save API Key"

### 4. Generate a Script

1. Enter a script title
2. Select a category (Emotional, Horror, Mystery, Adventure, Educational)
3. Select a specific niche
4. Paste an example script (minimum 500 characters)
5. Describe your plot
6. Choose target length
7. Click "Generate Script"

### 5. Download or Copy

Once generated, you can:
- Download as .txt file
- Copy to clipboard
- View full script in the interface

## Project Structure

```
script/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── deepseek.service.js    # Script analysis
│   │   │   └── gemini.service.js      # Script generation
│   │   ├── routes/
│   │   │   └── script.routes.js
│   │   └── server.js                  # Entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── generator/
│   │   │   │   └── ScriptGenerator.jsx  # Main component
│   │   │   └── settings/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── constants.js           # 20 niches
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env
│   └── package.json
└── database/
    └── schema.sql                     # PostgreSQL schema
```

## 20 Niches

### Emotional (4)
- Motivational & Inspirational
- Heartwarming Stories
- Tragic Events
- Uplifting Journeys

### Horror (4)
- Paranormal Horror
- Psychological Horror
- Creepypasta Tales
- Survival Horror

### Mystery (4)
- True Crime
- Conspiracy Theories
- Unexplained Phenomena
- Cold Cases

### Adventure (4)
- Survival Stories
- Exploration & Discovery
- Historical Adventures
- Extreme Challenges

### Educational (4)
- Science & Nature
- Historical Events
- Philosophy & Psychology
- Technology & Future

## How It Works

### Script Generation Flow

```
1. USER INPUT
   ↓
   [Title, Niche, Example, Plot, Length]
   ↓
2. ANALYSIS (DeepSeek R1)
   ↓
   Extracts: hooks, style, pacing, structure
   Creates: Master prompt
   ↓
3. GENERATION (Gemini 2.5 Flash)
   ↓
   Uses chunking for long scripts:
   - Chunk 1: Opening & Hook
   - Chunk 2+: Middle sections
   - Final Chunk: Climax & Conclusion
   ↓
4. OUTPUT
   ↓
   Complete script ready to download
```

### Chunking Strategy

- **10K-15K characters**: 1 chunk
- **15K-45K characters**: 3 chunks
- **45K-75K characters**: 5 chunks
- **75K+ characters**: 8 chunks

Each chunk seamlessly continues from the previous one, maintaining style and tone.

## Database Setup (Optional)

If you want to enable database features:

1. Install PostgreSQL 15+
2. Create a database:
```bash
createdb facelessscriptpro
```

3. Run the schema:
```bash
psql facelessscriptpro < database/schema.sql
```

4. Update DATABASE_URL in backend/.env

## License

MIT License

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Status**: ✅ Production Ready