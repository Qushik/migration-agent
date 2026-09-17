# 🇦🇺 Migration Intelligence Agent

> AI-powered Australian migration policy platform with a **supervisor + subagent** architecture.

[![CI](https://github.com/Qushik/migration-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/Qushik/migration-agent/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

This monorepo contains a multi-agent system designed to:

- 📋 **Monitor** Australian migration policy changes in real-time
- 🗺️ **Compare** visa pathways with pros/cons analysis
- 📄 **Generate** evidence checklists for each visa subclass
- ⚠️ **Assess risk** and flag cases requiring human review
- 📎 **Validate citations** against official Home Affairs sources

> **Disclaimer**: This tool provides information only. It is not legal advice and does not replace a registered migration agent (MARA). Always consult a registered professional for complex cases.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Supervisor Agent                   │
│         (orchestrates all subagents below)           │
└────────┬──────────┬───────────┬──────────┬──────────┘
         │          │           │          │
    ┌────▼───┐ ┌────▼───┐ ┌────▼───┐ ┌───▼────┐
    │Policy  │ │Pathway │ │Evidence│ │  Risk  │
    │Monitor │ │Compare │ │Checker │ │ Agent  │
    └────────┘ └────────┘ └────────┘ └────────┘
                                          │
                                    ┌─────▼──────┐
                                    │ Citation   │
                                    │ Validator  │
                                    └────────────┘
```

---

## Monorepo Structure

```
migration-agent/
├── apps/
│   ├── api/                  # Express orchestration API
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                  # React frontend (Vite)
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   └── components/
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   ├── agents/               # Supervisor + all subagents
│   │   ├── src/
│   │   │   ├── supervisor.ts
│   │   │   ├── subagents/
│   │   │   │   ├── policyMonitor.ts
│   │   │   │   ├── pathwayCompare.ts
│   │   │   │   ├── evidenceChecker.ts
│   │   │   │   ├── riskAgent.ts
│   │   │   │   └── citationValidator.ts
│   │   │   └── types.ts
│   │   └── package.json
│   └── shared/               # Shared schemas, constants, utils
│       ├── src/
│       │   ├── visaTypes.ts
│       │   ├── policySchema.ts
│       │   └── constants.ts
│       └── package.json
├── docs/
│   ├── architecture.md
│   ├── agents.md
│   └── setup.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── package.json              # Root workspace
└── tsconfig.base.json
```

---

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10
- OpenAI API key (or compatible LLM provider)

### Installation

```bash
git clone https://github.com/Qushik/migration-agent.git
cd migration-agent
npm install
```

### Environment Setup

```bash
cp apps/api/.env.example apps/api/.env
# Edit .env and add your API keys
```

### Run Development

```bash
# Start API server
npm run dev:api

# Start web frontend (in another terminal)
npm run dev:web

# Run both concurrently
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

---

## Key Features

### Supervisor Agent
Orchestrates task routing — receives a user query, decides which subagents to invoke, aggregates their outputs, and returns a structured response with citations.

### Policy Monitor Subagent
Tracks changes to Australian Home Affairs policy, MARA regulatory instruments, visa application charges, and threshold changes (e.g. TSMIT at $79,423 from 1 July 2026).

### Pathway Compare Subagent
Analyses and compares visa subclasses based on the user's profile — skilled, employer-sponsored, partner, student, visitor. Produces a structured pros/cons matrix.

### Evidence Checker Subagent
Generates a checklist of required documents and evidence for a nominated visa subclass, including common pitfalls and refusal triggers.

### Risk Agent Subagent
Assesses case-level risk factors — character issues, overstay history, no-further-stay conditions, student restrictions (from September 2026), and flags cases for human escalation.

### Citation Validator Subagent
Ensures all policy claims are backed by a dated official source. Flags stale information (>90 days old for rapidly changing policy areas).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/query` | Main query endpoint — supervisor routes to subagents |
| `GET` | `/api/visas` | List all supported visa subclasses |
| `GET` | `/api/visas/:subclass` | Get details + pros/cons for a visa subclass |
| `POST` | `/api/checklist` | Generate evidence checklist |
| `POST` | `/api/risk` | Assess risk for a given profile |
| `GET` | `/api/policy/changes` | Recent policy change digest |
| `GET` | `/api/health` | Health check |

---

## Policy Coverage (Australia, 2026)

- 2026–27 Permanent Migration Program: 185,000 places
- Skilled stream: 132,200 places (70.4%)
- Employer Sponsored: 58,040 places
- TSMIT: $79,423 (from 1 July 2026)
- Student visa base charge: $2,500 (from 1 July 2026)
- MARA regulatory framework updated 1 April 2026
- Student dependant restrictions (announced September 2026)
- Overstayer enforcement strengthened (September 2026)
- Visitor visa "no further stay" conditions expanded

---

## Roadmap

- [ ] Vector database integration (pgvector / Pinecone) for policy retrieval
- [ ] Automated daily policy diff from Home Affairs RSS and legislation.gov.au
- [ ] MARA-registered agent handoff workflow
- [ ] Occupation-specific ANZSCO scoring
- [ ] State nomination tracking (190/491)
- [ ] Processing time estimator
- [ ] Multi-language support

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

MIT © 2026 Qushik Ahmed Apu
