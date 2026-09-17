# Deployment Guide

## Local Development

```bash
# Clone the repo
git clone https://github.com/Qushik/migration-agent.git
cd migration-agent

# Install all workspace dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your keys

# Start API (port 3001)
npm run dev:api

# Start web UI (port 3000) — separate terminal
npm run dev:web
```

## Production Deployment — Railway (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy API
cd apps/api
railway up

# Set environment variables in Railway dashboard
# OPENAI_API_KEY, PORT, CORS_ORIGIN, DATABASE_URL
```

## Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:api
EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
```

```bash
docker build -t migration-agent .
docker run -p 3001:3001 --env-file .env migration-agent
```

## Environment Variables Required for Production

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | GPT-4o for dynamic responses |
| `PORT` | Yes | API server port |
| `CORS_ORIGIN` | Yes | Frontend URL |
| `DATABASE_URL` | Recommended | Postgres for audit trail |
| `ANTHROPIC_API_KEY` | Optional | Claude fallback |
| `SERPAPI_KEY` | Optional | Live web search |
