# 🇦🇺 Migration Intelligence Agent

A production-grade multi-agent system for Australian migration policy analysis. One **supervisor agent** orchestrates five specialised **subagents** to answer complex migration questions with cited, up-to-date policy intelligence.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   SUPERVISOR AGENT                       │
│         Receives user query → plans tasks →             │
│         delegates to subagents → synthesises response   │
└────┬──────────┬──────────┬──────────┬──────────┬────────┘
     │          │          │          │          │
  POLICY    PATHWAY    EVIDENCE    RISK &    CITATION
  MONITOR   COMPARE   CHECKLIST  ESCALATE   VALIDATE
```

### Subagents

| Agent | Role |
|-------|------|
| `policy-monitor` | Watches Home Affairs, MARA, legislation for changes |
| `pathway-compare` | Compares visa subclasses, pros/cons, eligibility |
| `evidence-checklist` | Generates document checklists per visa/profile |
| `risk-escalate` | Flags refusal risks, red flags, escalates to human |
| `citation-validate` | Verifies every policy claim against official sources |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY

# 3. Run the API
npm run dev:api

# 4. Run the web UI (separate terminal)
npm run dev:web

# 5. Open http://localhost:3000
```

## Project Structure

```
migration-agent/
├── apps/
│   ├── api/                  # Express orchestration API
│   │   ├── src/
│   │   │   ├── index.ts      # Server entry point
│   │   │   ├── routes/       # API routes
│   │   │   └── middleware/   # Auth, logging, error handling
│   │   └── package.json
│   └── web/                  # Next.js web UI
│       ├── src/app/          # App router pages
│       └── package.json
├── packages/
│   ├── agents/               # All agent logic
│   │   ├── supervisor.ts     # Orchestrator
│   │   ├── policy-monitor.ts
│   │   ├── pathway-compare.ts
│   │   ├── evidence-checklist.ts
│   │   ├── risk-escalate.ts
│   │   └── citation-validate.ts
│   └── shared/               # Shared types, schemas, constants
│       ├── types.ts
│       ├── schemas.ts
│       ├── visa-data.ts      # Australian visa subclass data
│       └── policy-sources.ts # Official source registry
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AGENT-PROMPTS.md
│   └── DEPLOYMENT.md
├── .github/workflows/ci.yml
├── .env.example
└── package.json
```

## Environment Variables

```env
OPENAI_API_KEY=sk-...          # Required: OpenAI GPT-4o
ANTHROPIC_API_KEY=...          # Optional: Claude fallback
SERPAPI_KEY=...                # Optional: live web search
PORT=3001                      # API port
WEB_PORT=3000                  # Web UI port
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/query` | Send a migration question to the supervisor |
| GET | `/api/policy/updates` | Latest policy changes |
| POST | `/api/pathway/compare` | Compare visa pathways |
| POST | `/api/checklist` | Generate evidence checklist |
| GET | `/api/health` | Health check |

## Example Query

```bash
curl -X POST http://localhost:3001/api/query \
  -H 'Content-Type: application/json' \
  -d '{
    "question": "Can a 482 TSS holder transition to permanent residence in 2026?",
    "context": { "occupation": "Software Engineer", "years_in_australia": 3 }
  }'
```

## Legal Disclaimer

> This system provides **general migration information only** and is **not registered migration advice**. Always consult a MARA-registered migration agent for personalised advice. Policy information is sourced from official Australian Government publications and is subject to change.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md). PRs welcome.

## License

MIT — see [LICENSE](LICENSE)
