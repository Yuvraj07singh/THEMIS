<p align="center">
  <h1 align="center">⚖️ THEMIS</h1>
  <p align="center"><strong>Enterprise Legal & Compliance OS</strong></p>
  <p align="center">
    A premium B2B SaaS platform that transforms mid-market law firms, CA practices, and corporate legal departments into scalable, tech-enabled enterprises.
  </p>
</p>

---

## The Problem

The top 1% of law firms use multi-million dollar tools and custom trackers. The remaining 99% of mid-market firms rely on Microsoft Word, chaotic WhatsApp threads, and massive Excel spreadsheets — losing clients to tech-first startups because they cannot offer a modern, transparent client experience.

**THEMIS bridges that gap.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Styling** | Vanilla CSS (Glassmorphism, fluid typography) |
| **Animations** | GSAP, Lenis (smooth scroll) |
| **Backend** | Node.js, Express 4 |
| **Database** | SQLite (via Prisma ORM) |
| **AI** | Anthropic Claude API |
| **Auth** | JWT + bcrypt |
| **File Export** | DOCX generation |

---

## Project Structure

```
THEMIS/
├── public/                     # Static assets (favicon, icons)
├── server/                     # Backend API
│   ├── prisma/
│   │   ├── migrations/         # Database migrations
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── data/               # Static data (templates, playbooks)
│       ├── middleware/          # Auth, error handling, file upload
│       ├── routes/             # API route handlers
│       ├── services/           # Business logic (AI, audit, deadlines)
│       ├── db.js               # Prisma client instance
│       └── index.js            # Express server entry point
├── src/                        # Frontend React app
│   ├── assets/                 # Images and SVGs
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Sidebar, SmoothScroll
│   │   ├── sections/           # Landing page sections
│   │   └── ui/                 # Reusable UI (Button, Card, StatusBadge, etc.)
│   ├── contexts/               # React contexts (Auth, Theme, Country)
│   ├── data/                   # Static frontend data (country rules)
│   ├── hooks/                  # Custom hooks (useScrollReveal)
│   ├── lib/                    # API client utilities
│   ├── pages/                  # Page-level components
│   ├── styles/                 # Global CSS (variables, reset, typography)
│   ├── App.jsx                 # Root app component with routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── .gitignore
├── index.html                  # Vite HTML entry point
├── package.json
├── vite.config.js              # Vite config with API proxy
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/THEMIS.git
cd THEMIS
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the dev server (runs on http://localhost:5173)
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values (JWT_SECRET, ANTHROPIC_API_KEY, etc.)

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start the server (runs on http://localhost:4000)
npm run dev
```

> **Note:** The Vite dev server is configured to proxy `/api` requests to `localhost:4000`, so both servers work together seamlessly during development.

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma database connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `ANTHROPIC_API_KEY` | API key for Claude AI features | Optional |
| `PORT` | Server port (default: `4000`) | Optional |

See [`server/.env.example`](server/.env.example) for a template.

---

## Features

### ✅ Built & Working

- **Landing Page** — Premium marketing site with glassmorphic design and GSAP animations
- **Authentication** — Full signup/login flow with JWT-based sessions
- **Dashboard** — Overview panel with health scores and activity metrics
- **IP Watch Registry** — Interactive trademark tracking with search and status filters
- **Compliance Calendar** — Dynamic deadline timeline for GST, MCA, and tax filings
- **Contract Review** — AI-powered clause analysis with risk scoring
- **Notice Agent** — Upload GST/tax notices → AI extracts data → generates draft replies with citations
- **Document Generator** — Wizard-based legal document creation (NDA, Employment Agreements, etc.)
- **Client Management** — Full CRUD for managing firm clients
- **Multi-Jurisdiction Support** — Dynamic compliance rules based on region (India, US, etc.)
- **Dark / Light Mode** — Seamless theme switching with CSS variables

### 🗺️ Roadmap

- [ ] AI Contract Review enhancements (RAG with vector databases)
- [ ] Live IP Registry Watch (API integration with IP India & WIPO)
- [ ] Automated Compliance Sync (MCA V3 & GSTN portal APIs)
- [ ] Multi-tenant firm portals (`firmname.themis-legal.com`)
- [ ] Role-based access control (Admin, Partner, Associate)
- [ ] Notification system (email + in-app alerts)

---

## Scripts

### Frontend (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with auto-reload |
| `npm start` | Start server (production) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:seed` | Seed the database |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is proprietary. All rights reserved.
