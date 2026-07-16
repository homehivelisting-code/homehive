# HomeHive Design System

## Overview

HomeHive is a real estate property management dashboard built with React + Vite. It provides listing management for sale, lease, and off-the-plan development properties, agent collaboration, passcode-protected access, and Supabase persistence.

---

## Color Scheme — Gold-Dark Luxury

Gold and charcoal palette inspired by the brand logo (gold/amber "HH" icon on a dark background).

### Primary Colors

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Gold** | `--accent-gold` | `#e5c158` | Primary accent — headers, active states, hover highlights, scrollbar thumbs |
| **Amber** | `--accent-amber` | `#d4af37` | Secondary accent — button gradients, type labels |
| **Gold Light** | `--accent-gold-light` | `#f0d476` | Tertiary accent — hover states, chart lines |
| **Charcoal Black** | `--bg-primary` | `#0a0a0d` | Page background base |
| **Charcoal Dark** | `--bg-secondary` | `#121216` | Secondary background, glass panels |
| **Charcoal Medium** | `--bg-tertiary` | `#1c1c22` | Tertiary background, modal panels |

### Neutral / Text

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Text Primary** | `--text-primary` | `#f1f0ec` | Headings, primary content |
| **Text Secondary** | `--text-secondary` | `#9a958c` | Body text, descriptions |
| **Text Muted** | `--text-muted` | `#5c584f` | Labels, timestamps, subtle elements |

### Semantic Colors

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Green** | `--accent-green` | `#34d399` | "Available" status, prices, positive metrics |
| **Amber Warm** | `--accent-amber-warm` | `#fbbf24` | "Hold" status, warning states |
| **Blue** | (inline) | `#3b82f6` | "Under Contract" status, "Updated" badge |
| **Red** | (inline) | `#ef4444` | "Sold" status, delete actions |
| **Orange** | (inline) | `#f97316` | "Off-Market" listing style, Development category |

### Glass Effects

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| **Glass BG** | `--glass-bg` | `rgba(255, 255, 255, 0.03)` | Semi-transparent panel backgrounds |
| **Glass Border** | `--glass-border` | `rgba(229, 193, 88, 0.1)` | Subtle gold panel borders |
| **Glass Hover** | `--glass-hover` | `rgba(229, 193, 88, 0.06)` | Hover state for glass elements |
| **Glow Gold** | `--glow-gold` | `rgba(229, 193, 88, 0.25)` | Scrollbar thumb, glow effects |
| **Glow Amber** | `--glow-amber` | `rgba(251, 191, 36, 0.2)` | Ambient glow effects |
| **Border Subtle** | `--border-subtle` | `rgba(229, 193, 88, 0.06)` | Table borders, dividers |
| **Shadow Glow** | `--shadow-glow` | `0 0 40px rgba(229, 193, 88, 0.06)` | Ambient gold glow on panels |

### Border Radii

| Token | CSS Variable | Value |
|---|---|---|
| **Radius SM** | `--radius-sm` | `8px` |
| **Radius MD** | `--radius-md` | `12px` |
| **Radius LG** | `--radius-lg` | `16px` |
| **Radius XL** | `--radius-xl` | `20px` |

---

## Typography

- **Font Family**: Inter (Google Fonts) — weights 300–800
- **Headings**: 800 weight, gold gradient fill
- **Body**: 400–500 weight, neutral text colors
- **Labels**: 600 weight, uppercase, `0.05em` letter-spacing
- **Table Headers**: 600 weight, uppercase, `0.08em` letter-spacing
- **Status/Badge Text**: 600–700 weight, uppercase, `0.04em`–`0.06em` letter-spacing

---

## Listing Schema

### Database Columns (`public.listings`)

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `bigint` | auto | Primary key, auto-increment |
| `category` | `text` | `'Sale'` | `Sale`, `Lease`, or `Development` |
| `title` | `text` | — | Auto-generated from address on save |
| `address` | `text` | — | Full property address (required) |
| `type` | `text` | `'House'` | `House`, `Unit`, or `Apartment` |
| `beds` | `int` | `0` | Bedrooms |
| `baths` | `int` | `0` | Bathrooms |
| `cars` | `int` | `0` | Car spaces |
| `living_size` | `int` | `0` | Living area in m² |
| `land_size` | `numeric(6,1)` | — | Land area in m² (Houses, Development) |
| `house_area` | `int` | — | House area in m² |
| `house_size` | `numeric(6,1)` | — | House size in SQ (Development only) |
| `aspect` | `text` | `'North'` | `North`, `South`, `East`, `West` |
| `price` | `text` | — | Text field — supports `700-800k`, `1.2M`, etc. |
| `status` | `text` | `'Available'` | `Available`, `Hold`, `Sold`, `Under Contract` |
| `listed_by` | `text` | — | Agent name |
| `notes` | `text` | — | Free-text notes |
| `links` | `jsonb` | `[]` | Array of `{title, url}` objects |
| `listing_style` | `text` | `'Exclusive'` | `Off-Market` or `Exclusive` |
| `suburb` | `text` | — | Development — suburb |
| `estate` | `text` | — | Development — estate name |
| `loan_agreement_required` | `bool` | `false` | Development — loan agreement flag |
| `estimated_completion_date` | `text` | — | Development — e.g. `qtr 4 - 26` |
| `rental_yield` | `text` | — | Development — e.g. `4.45%` |
| `brochure` | `text` | — | Development — e.g. `FLYER` |
| `is_new` | `bool` | `false` | Manual "Brand New" badge flag |
| `is_updated` | `bool` | `false` | Manual "Updated" badge flag |
| `created_at` | `timestamptz` | `now()` | Auto-set on insert |
| `updated_at` | `timestamptz` | `now()` | Updated on each edit |

### Status Values

| Status | Badge Color | Description |
|--------|-------------|-------------|
| **Available** | Green (`#34d399`) | Listing is active |
| **Hold** | Amber (`#fbbf24`) | Temporarily on hold |
| **Sold** | Red (`#ef4444`) | Sold/leased |
| **Under Contract** | Blue (`#3b82f6`) | Under negotiation |

### Listing Styles

| Style | Badge Color (Table) | Badge Color (Grid) |
|-------|---------------------|--------------------|
| **Off-Market** | Purple (`#8b5cf6`) | Orange (`#f97316`) |
| **Exclusive** | Amber (`#f59e0b`) | Cyan (`#06b6d4`) |

---

## Agent Structure

Five agents defined in `src/data.js`:

| ID | Name | Avatar | Color |
|----|------|--------|-------|
| 1 | Mahadev Dhanuk | MD | `#d4af37` |
| 2 | Sajjan Sharma | SS | `#e5c158` |
| 3 | Laxman Sanjyal | LS | `#f0d476` |
| 4 | Babbu Yadhav | BY | `#c9a52a` |
| 5 | Nilam Acharya | NA | `#b8941e` |

Agents are duplicated as a string array in `AddEditPropertyModal.jsx` for the "Listed By" dropdown.

---

## Features

### Passcode Gate

- 4-digit numeric keypad before agent selection
- Password: `5555`
- On-screen number pad (no physical keyboard required)
- Persisted in `localStorage` per browser
- Sign Out clears both passcode and agent state

### Login Screen

- Agent profile selection grid (2×3 on desktop, 2×2 on mobile)
- Cards with avatar (colored circle + initials) and name
- Selection stores agent in `localStorage`
- Staggered fade-in animation

### Tab Navigation

| Tab | Filter |
|-----|--------|
| **For Sale** | `category === 'Sale'` |
| **For Lease** | `category === 'Lease'` |
| **For Development** | `category === 'Development'` |

### Table View Columns (Sale / Lease)

S/N, Address, Description (Type, Beds, Baths, Cars, Living Size, Land Size), Aspect, Price, Status, Listed By, Notes, Links, Listing Style, Actions

### Table View Columns (Development)

S/N, Address, SUBURB, Estate, Loan Agreement, Est. Completion, Land Size, House Size (SQ), Bed, Bath, Car, Price, Rental Yield, STATUS, BROCHURE, Actions

### Brand New / Updated Badges

Manually controlled via checkboxes in the Add/Edit form:
- **Brand New** — green badge with ✨ icon
- **Updated** — blue badge with ↻ icon

### Metrics Dashboard

Dynamic cards for the active tab:
- **Total Listings** — count
- **Available** — count + percentage
- **On Hold / Sold** — count + percentage

### Add/Edit Modal

Four-section form (2-column grid):

**Section 1 — Basic Info:** Category, Type, Aspect, Status
**Section 2 — Property Details:** Beds, Baths, Cars, Living Size, Land Size (conditional: Houses only), House Area
**Section 3 — Listing Information:** Address, Price, Listed By, Listing Style
**Section 4 (Development only):** Suburb, Estate, Estimated Completion Date, House Size (SQ), Rental Yield, Brochure, Loan Agreement Required
**Section 5 — Additional:** Notes, Brand New / Updated checkboxes, Document Links

### Sortable Columns

Click any column header to sort ascending/descending. Active sort highlighted in gold.

### Filters

Status, Property Type, Agent, Listing Style — collapsible on mobile.

### Search

Full-text across address, type, aspect, status, exclusiveNumber, contactPerson.

---

## Data Persistence

All listing data is stored in **Supabase** (PostgreSQL). No localStorage used for listing data. `localStorage` is only used for:
- `currentAgent` — selected agent profile
- `passwordEntered` — passcode gate bypass

---

## Component Architecture

```
src/
├── App.jsx                        # Main orchestration — state, routing, CRUD handlers
├── App.css                        # All component styles (~1716 lines)
├── index.css                      # CSS variables, global resets, design tokens
├── data.js                        # Agents, CRUD functions, badge logic, colour schemes
├── supabase.js                    # Supabase client (URL + anon key)
└── components/
    ├── ListingsTable.jsx          # Sortable table with status/style configs + badges
    ├── ListingsGrid.jsx           # Card grid view with badges
    ├── AddEditPropertyModal.jsx   # Form with all field constants + badge toggles
    ├── MetricsCards.jsx           # Dashboard metrics calculation
    └── ColourSchemeModal.jsx      # Colour scheme picker (functionality TBD)
```

---

## Seed Data

Current state (as of latest seed):

| Category | Count |
|----------|-------|
| Sale | 6 |
| Lease | 6 |
| Development | 14 |
| **Total** | **26** |

### Badge Flags

| Flag | Listings (IDs) |
|------|----------------|
| `is_new = true` | 31–35 |
| `is_updated = true` | 26–30 |

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `≤640px` | 1-column grid, stacked card actions |
| `641–1024px` | 2-column listing grid |
| `≥1025px` | 3-column listing grid |
| `≤768px` | Stacked header, 2-column metrics, single-column forms, hamburger menu, full-width bottom-sheet modals |

---

## URLs

- **Live app:** [https://homehive-two.vercel.app](https://homehive-two.vercel.app)
- **GitHub:** [https://github.com/homehivelisting-code/homehive](https://github.com/homehivelisting-code/homehive)
- **Supabase:** [https://vtokwwzrfanbuzfbswbg.supabase.co](https://vtokwwzrfanbuzfbswbg.supabase.co)
