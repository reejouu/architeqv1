# Architeq

Architeq turns a plain-English product idea into a live, editable system architecture diagram — then lets a team design, version, and collaborate on it in real time.

> Type an idea → AI generates a visual architecture graph → your team edits, owns, and ships it.

## Features

- **AI-generated architecture** — describe a system in plain English and get back a structured graph of nodes (services, databases, queues, etc.) and edges (dependencies), streamed live as it's generated. Falls back across multiple LLM providers (Anthropic, Google Gemini, OpenAI).
- **Interactive canvas** — drag-and-drop node palette, custom node types, edge styles, multi-select, lock/lasso modes, and a brutalist-styled UI built on [React Flow](https://reactflow.dev).
- **Real-time collaboration** — multiplayer rooms with live cursors and presence avatars, powered by [Liveblocks](https://liveblocks.io).
- **Project persistence & versioning** — save a project, restore or delete prior versions, and pick up where you left off.
- **Auth** — email/password and Google OAuth sign-in, with JWT-based sessions.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack) + React 19 |
| Canvas / diagramming | [@xyflow/react](https://reactflow.dev), [dagre](https://github.com/dagrejs/dagre) for auto-layout |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via [Prisma](https://www.prisma.io) |
| Real-time collaboration | [Liveblocks](https://liveblocks.io) |
| AI generation | Anthropic, Google Generative AI, OpenAI SDKs |
| Auth | [jose](https://github.com/panva/jose) (JWT) + Google OAuth, bcrypt password hashing |

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database

### Setup

```bash
npm install
```

Create a `.env.local` file in `frontend/` with the following:

```bash
# Database (also picked up by the Prisma CLI via prisma.config.ts)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Session signing — generate with: openssl rand -base64 32
JWT_SECRET="..."

# AI generation (at least one is required; the pipeline falls back across providers)
ANTHROPIC_API_KEY="..."
GEMINI_API_KEY="..."
OPENAI_API_KEY="..."

# Real-time collaboration
LIVEBLOCKS_SECRET_KEY="..."

# Google OAuth sign-in
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

Apply the database schema:

```bash
npx prisma migrate dev
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run dev:agent` | Run the AI generation pipeline standalone (for testing prompts outside the UI) |

## Project structure

```
frontend/
├── prisma/                  # Schema & migrations
├── prisma.config.ts         # Loads .env.local for the Prisma CLI
└── src/
    ├── app/
    │   ├── api/              # Auth, projects, generation, collaboration routes
    │   ├── canvas/            # The editor page
    │   └── page.tsx           # Landing page
    ├── components/
    │   ├── canvas/            # Toolbar, sidebars, node/edge renderers, modals
    │   └── landing/            # Marketing page sections
    ├── lib/
    │   ├── agents/             # AI generation pipeline
    │   ├── auth/               # Session/JWT helpers
    │   └── repositories/       # Database access layer
    └── store/
        └── canvasStore.ts      # Zustand store for canvas state
```

## Deployment

This is a standard Next.js app and deploys to any Node-compatible host (Vercel, Railway, Render, etc.).

**Important:** `.env.local` is gitignored and never deployed. You must configure every environment variable listed above directly in your hosting platform's dashboard — including `DATABASE_URL`, since the Prisma CLI and the deployed app both need it set explicitly in production.
