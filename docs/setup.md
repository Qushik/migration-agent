# Setup Guide

## Requirements

- Node.js 20+
- npm 10+
- An OpenAI API key (or any OpenAI-compatible provider)

## Installation

```bash
git clone https://github.com/Qushik/migration-agent.git
cd migration-agent
npm install
```

## Environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and fill in:

```
OPENAI_API_KEY=sk-your-key-here
```

## Development

```bash
# Run API + web concurrently
npm run dev

# API only
npm run dev:api

# Web only
npm run dev:web
```

API starts on `http://localhost:3001`  
Web starts on `http://localhost:5173`

## Test the API

```bash
# Health check
curl http://localhost:3001/api/health

# Ask the supervisor
curl -X POST http://localhost:3001/api/query \
  -H 'Content-Type: application/json' \
  -d '{"query": "What are the pros and cons of the 482 visa?", "visaSubclass": "482"}'

# List all visas
curl http://localhost:3001/api/visas

# Policy changes
curl http://localhost:3001/api/policy/changes
```

## Production Build

```bash
npm run build
```

## Deployment

The API (`apps/api`) can be deployed to any Node.js host (Railway, Render, Fly.io, AWS, etc.).

The web frontend (`apps/web`) builds to a static site and can be deployed to Vercel, Netlify, or any static host.
