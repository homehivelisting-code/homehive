# HomeHive — Property Management Dashboard

A collaborative real estate property management dashboard built with React + Vite. Manage sale, lease, and off-the-plan development listings with agent collaboration, passcode-protected access, and Supabase persistence.

**Live:** [https://homehive-two.vercel.app](https://homehive-two.vercel.app)
**Repo:** [https://github.com/homehivelisting-code/homehive](https://github.com/homehivelisting-code/homehive)

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # Production build → dist/
```

---

## Access

1. **Passcode gate** — enter `5555` (persisted in localStorage per browser)
2. **Agent login** — select your profile (Mahadev Dhanuk, Sajjan Sharma, Laxman Sanjyal, Babbu Yadhav, Nilam Acharya)
3. **Dashboard** — browse listings across three tabs

---

## Features

| Feature | Description |
|---------|-------------|
| **Three listing categories** | For Sale, For Lease, For Development (off-the-plan with suburb, estate, loan agreement, completion date, land/house size, rental yield, brochure) |
| **Table & Grid views** | Sortable table with 16+ columns or responsive card grid |
| **Inline editing** | Edit price and status directly in table cells |
| **Filters** | Status, property type, agent, listing style |
| **Search** | Full-text across address, type, aspect, status, and more |
| **CRUD** | Add, edit, delete listings with a modal form |
| **Brand New / Updated badges** | Manually toggle via the Add/Edit form (checkboxes) |
| **Supabase persistence** | All data stored in PostgreSQL, survives page refresh |
| **Passcode protection** | 4-digit gate (`5555`) before agent selection |
| **Responsive** | Mobile-first with hamburger menu, stacked cards, full-width modals on small screens |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 8 |
| Styling | CSS with glassmorphism design system (gold-dark luxury theme) |
| Icons | Lucide React |
| Persistence | Supabase (PostgreSQL) |
| Deployment | Vercel (auto-deploys from `main` branch) |

---

## Environment

No `.env` file required. Supabase credentials are hardcoded in `src/supabase.js` (anon key is safe to expose — RLS policies protect the data).

---

## Project Structure

```
src/
├── App.jsx                        # Main app: passcode gate, agent login, tabs, CRUD
├── App.css                        # All component styles (gold-dark glassmorphism)
├── index.css                      # CSS variables, global styles, design tokens
├── data.js                        # Agents, CRUD functions, badge logic, colour schemes
├── supabase.js                    # Supabase client config
└── components/
    ├── ListingsTable.jsx          # Table view (sortable, filters, status badges)
    ├── ListingsGrid.jsx           # Card grid view
    ├── AddEditPropertyModal.jsx   # Add/Edit form with all fields
    ├── MetricsCards.jsx           # Dashboard metric cards
    └── ColourSchemeModal.jsx      # Colour scheme picker (WIP)
```

---

## Supabase

**Project:** `vtokwwzrfanbuzfbswbg` (ap-southeast-2)
**URL:** `https://vtokwwzrfanbuzfbswbg.supabase.co`

### Tables

**`listings`** — All property listings with columns for Sale, Lease, and Development fields including `is_new`, `is_updated` flags, and `created_at`/`updated_at` timestamps.

**`agents`** — Agent profiles (id, name, avatar, color).

### RLS

Both tables have public access policies enabled (no auth required for this internal tool).

---

## Design System

See [`design.md`](./design.md) for the full design token reference, component patterns, and schema documentation.
