# HomeHive Design System

## Overview

HomeHive is a real estate property management dashboard built with React + Vite. It provides listing management for sale and lease properties, agent collaboration, activity tracking, and visual floorplan generation.

---

## Color Scheme — Gold-Dark Luxury

The HomeHive dashboard uses a premium gold and charcoal palette inspired by the brand logo (a gold/amber 3D "HH" icon on a dark background).

### Primary Colors

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| **Gold** | `--accent-gold` | `#e5c158` | Primary accent — headers, active states, hover highlights, scrollbar thumbs |
| **Amber** | `--accent-amber` | `#d4af37` | Secondary accent — button gradients, type labels, secondary highlights |
| **Gold Light** | `--accent-gold-light` | `#f0d476` | Tertiary accent — hover states, chart lines, light glow |
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
| **Green** | `--accent-green` | `#34d399` | "Available" status, positive changes, prices |
| **Amber Warm** | `--accent-amber-warm` | `#fbbf24` | "Hold" status, warning states |
| **Red** | (inline) | `#ef4444` | "Sold" status, delete actions, negative changes |

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
- **Headings**: 800 weight, gold gradient fill (`linear-gradient(135deg, #e5c158, #f0d476)`)
- **Body**: 400–500 weight, neutral text colors
- **Labels**: 600 weight, uppercase, `0.05em` letter-spacing
- **Table Headers**: 600 weight, uppercase, `0.08em` letter-spacing
- **Status/Badge Text**: 600–700 weight, uppercase, `0.04em`–`0.06em` letter-spacing

---

## Listing Schema

### Listing Fields

All listing data is defined in `src/data.js` with the following fields:

| Field | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | number | auto | no | Auto-generated as `Math.max(...ids) + 1` on save |
| `category` | string | `'Sale'` | yes | Enum: `'Sale'`, `'Lease'` |
| `title` | string | `''` | yes | Property name (e.g., "The Meridian") |
| `address` | string | `''` | yes | Full property address |
| `type` | string | `'House'` | yes | Enum: `'House'`, `'Unit'`, `'Apartment'` |
| `beds` | number | `2` | no | Bedrooms (0–20) |
| `baths` | number | `2` | no | Bathrooms (0–15) |
| `cars` | number | `1` | no | Car spaces (0–10) |
| `livingSize` | number | `80` | no | Living area in m² (0–2000) |
| `landSize` | number \| null | `null` | no | Land area in m² (0–10000). Only applicable for Houses |
| `houseArea` | number | `80` | no | House area in m² (0–2000) |
| `aspect` | string | `'North'` | no | Enum: `'North'`, `'South'`, `'East'`, `'West'` |
| `price` | number | `0` | yes | Absolute dollars (Sale); weekly rate (Lease) |
| `status` | string | `'Available'` | no | Enum: `'Available'`, `'Hold'`, `'Sold'` |
| `listedBy` | string | `'Sarah Jenkins'` | no | Agent name (must match an agent in the agents array) |
| `notes` | string | `''` | no | Free-text notes about the listing |
| `documents` | string | `''` | no | URL (typically Google Drive links) |
| `listingStyle` | string | `'Exclusive'` | no | Enum: `'Off-Market'`, `'Exclusive'` |

### Enum Values

```
categories:  ['Sale', 'Lease']
types:       ['House', 'Unit', 'Apartment']
aspects:     ['North', 'South', 'East', 'West']
statuses:    ['Available', 'Hold', 'Sold']
styles:      ['Off-Market', 'Exclusive']
```

### Price Ranges

| Category | Range | Step Increment | Display Format |
|---|---|---|---|
| **Sale** | $750,000 – $3,300,000 | $5,000 | `$X,XXX,XXX` |
| **Lease** | $550/week – $1,250/week | $10 | `$XXX/wk` |

### Status Values

| Status | Description | Badge Color |
|---|---|---|
| **Available** | Listing is active and available | Green (`#34d399`) |
| **Hold** | Listing is temporarily on hold | Amber (`#fbbf24`) |
| **Sold** | Listing has been sold/leased | Red (`#ef4444`) |

> Note: The CSS also defines `.status-under-offer` and `.status-reserved` classes, but these are **not** used in the current data or form options.

### Listing Styles

| Style | Badge Color (Grid) | Badge Color (Table) | Description |
|---|---|---|---|
| **Off-Market** | Orange (`#f97316`) | Purple (`#8b5cf6`) | Not publicly listed |
| **Exclusive** | Cyan (`#06b6d4`) | Amber (`#f59e0b`) | Exclusive agency agreement |

---

## Agent Structure

Four agents are defined in `src/data.js`:

| ID | Name | Avatar (Initials) | Brand Color |
|---|---|---|---|
| 1 | Sarah Jenkins | SJ | `#d4af37` (Amber) |
| 2 | Michael Chang | MC | `#e5c158` (Gold) |
| 3 | Emily Rodriguez | ER | `#f0d476` (Gold Light) |
| 4 | David Kim | DK | `#c9a52a` (Dark Gold) |

### Agent Schema

```js
{
  id: number,        // Unique identifier
  name: string,      // Full name
  avatar: string,    // 2-letter initials for avatar display
  color: string      // Hex color for avatar background
}
```

Agents are also defined as a string array in `AddEditPropertyModal.jsx` for the "Listed By" dropdown:
```js
const AGENTS = ['Sarah Jenkins', 'Michael Chang', 'Emily Rodriguez', 'David Kim'];
```

---

## Features

### Login Screen

- Agent profile selection grid (no password authentication)
- 2×2 grid of agent cards showing avatar (colored circle with initials) and name
- Card hover: translateY(-4px) with intensified gold border and shadow
- Selection sets `currentAgent` in `localStorage`
- Staggered fade-in animation on page load

### Session Management

- **Storage Key**: `localStorage` key `'currentAgent'`
- **Sign In**: Clicking an agent card stores the agent name
- **Sign Out**: Clears `currentAgent` from localStorage, returns to login
- **Persistence**: Session survives page refresh until explicitly signed out

### Tab Navigation

Two tabs filter listings by category:

| Tab | Filter | Description |
|---|---|---|
| **Sale** | `category === 'Sale'` | Sale listings only |
| **Lease** | `category === 'Lease'` | Lease listings only |

- Active tab: gold background tint (`rgba(229, 193, 88, 0.15)`), gold text
- Tab bar uses glassmorphic styling with `backdrop-filter: blur(20px)`

### View Modes

| Mode | Description |
|---|---|
| **Table** | Full-width sortable table with 16 columns |
| **Grid** | Responsive card grid (1/2/3 columns based on viewport) |

### Table Columns

| # | Column | Description |
|---|---|---|
| 1 | S/N | Sequential listing number |
| 2 | Type | Property type badge (House/Unit/Apartment) |
| 3 | Beds | Number of bedrooms |
| 4 | Baths | Number of bathrooms |
| 5 | Cars | Number of car spaces |
| 6 | Living Size | Living area in m² |
| 7 | Land Size | Land area in m² (Houses only) |
| 8 | Address | Full address (truncated with ellipsis) |
| 9 | Aspect | Compass direction |
| 10 | Price | Formatted price (inline editable) |
| 11 | Status | Status badge (inline editable select) |
| 12 | Listed By | Agent name |
| 13 | Notes | Listing notes |
| 14 | Documents | Document link icon |
| 15 | Listing Style | Style badge (Off-Market/Exclusive) |
| 16 | Actions | View / Edit / Delete buttons |

### Metrics Dashboard

Dynamic metric cards that update based on the active tab (Sale/Lease):

- **Total Listings**: Count of listings in current category
- **Total Value**: Sum of all prices in current category
- **Available**: Count of "Available" status listings
- **Under Offer**: Count of "Hold" status listings
- Mini SVG sparkline charts with gold gradient fills

### Filtering

| Filter | Type | Values |
|---|---|---|
| `beds` | Select | Exact match (0, 1, 2, 3, 4, 5, 6) |
| `aspect` | Select | North, South, East, West |
| `status` | Select | Available, Hold, Sold |
| `priceRange` | Select | Format `"min-max"` |

### Search

- Searches across: address, type, aspect, status, exclusiveNumber, contactPerson
- Table view also searches: notes, listingStyle, price, beds, baths
- Max width: 320px with gold focus border

### Sorting

- Click any column header to sort
- Toggles between ascending and descending
- Sorted column shows gold highlight and arrow indicator

### Add/Edit Modal

Three-section form with 2-column grid layout:

**Section 1 — Basic Info:**
- Category (select)
- Type (select)
- Aspect (select)
- Status (select)

**Section 2 — Property Details:**
- Beds (number)
- Baths (number)
- Cars (number)
- Living Size (number, m²)
- Land Size (number, m²) — conditionally shown for Houses only
- House Area (number, m²)

**Section 3 — Listing Information:**
- Title (text)
- Address (text, full-width)
- Price (number — step $5,000 for Sale, $10 for Lease)
- Listed By (select)
- Listing Style (select)
- Notes (textarea, full-width)
- Documents URL (text, full-width)

### Activity Log

- Timeline of recent actions (add, update, status change, etc.)
- Avatar with agent color, action text with gold-highlighted action verb
- Timestamp display
- Scrollable (max-height: 360px)
- Staggered fade-in animation for new entries

### Colour Scheme Picker

Four built-in colour schemes for property presentation:

| Scheme | Colors | Description |
|---|---|---|
| **Warm Wood** | `#8B4513 → #D2691E → #DEB887 → #F5DEB3 → #FFFAF0` | Rich timber tones with warm earth accents |
| **Modern Concrete** | `#2C3E50 → #5D6D7E → #ABB2B9 → #E5E8E8 → #F8F9F9` | Sleek industrial palette |
| **Minimalist White** | `#2C3E50 → #7F8C8D → #ECF0F1 → #FDFEFE → #FFFFFF` | Clean, bright whites |
| **Industrial Dark** | `#1A1A2E → #16213E → #0F3460 → #533483 → #E94560` | Bold charcoal and matte black |

### Floorplan Generator

- SVG-based floorplan visualization
- Dynamically generated based on listing property details
- Shows room dimensions, bed/bath counts, and total area
- Displayed in a modal with stats footer

---

## Data Persistence

| Key | Type | Description |
|---|---|---|
| `hh_listings` | JSON array | All listing data (created/updated/deleted) |
| `hh_logs` | JSON array | Activity log entries |
| `currentAgent` | string | Currently signed-in agent name |

All data is stored in `localStorage` and persists across page refreshes.

---

## Layout Components

### Glassmorphic Panels

All major UI sections use frosted glass panels:

```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glow);
}
```

- Hover state intensifies border to `rgba(229, 193, 88, 0.15)` and shadow to `0 0 60px rgba(229, 193, 88, 0.08)`

### Radial Background Glows

The body has fixed-position radial gradients:
- Gold glow at 20% left
- Amber glow at 80% top
- Warm amber glow at 50% bottom

### Custom Scrollbars

- 6px width, gold-tinted thumb (`rgba(229, 193, 88, 0.25)`)
- Hover state brightens to 0.45 opacity

---

## Logo

The HomeHive logo is loaded from `/logo.png` and displayed at 36px height in the header with a gold drop-shadow filter:

```css
.header-logo {
  height: 36px;
  filter: drop-shadow(0 0 12px rgba(229, 193, 88, 0.35));
}
```

Login screen uses a larger 64px version with 24px glow radius.

---

## Component Patterns

### Buttons

| Class | Style | Usage |
|---|---|---|
| `.btn` | Base button (flex, gap, padding, transition) | All buttons |
| `.btn-primary` | Gold-to-amber gradient (`#b8941e → #d4af37`), dark text | Primary actions (Add, Save) |
| `.btn-secondary` | Glass/transparent with gold border | Secondary actions |
| `.btn-ghost` | Transparent, hover adds gold-tinted background | Tertiary actions |
| `.btn-sm` | Smaller padding (6px 14px) | Compact buttons |
| `.btn-danger` | Red gradient (`#dc2626 → #ef4444`) | Delete actions |

### Status Badges

| Class | Background | Text | Border |
|---|---|---|---|
| `.status-available` | `rgba(52, 211, 153, 0.12)` | `#34d399` | `rgba(52, 211, 153, 0.2)` |
| `.status-hold` | `rgba(251, 191, 36, 0.12)` | `#fbbf24` | `rgba(251, 191, 36, 0.2)` |
| `.status-sold` | `rgba(239, 68, 68, 0.12)` | `#ef4444` | `rgba(239, 68, 68, 0.2)` |

### Listing Style Badges

| Class | Background | Text | Border |
|---|---|---|---|
| `.style-off-market` | `rgba(249, 115, 22, 0.12)` | `#f97316` | `rgba(249, 115, 22, 0.2)` |
| `.style-exclusive` | `rgba(6, 182, 212, 0.12)` | `#06b6d4` | `rgba(6, 182, 212, 0.2)` |

### Type Badges

| Class | Background | Text | Border |
|---|---|---|---|
| `.type-house` | `rgba(251, 191, 36, 0.08)` | `#fbbf24` | `rgba(251, 191, 36, 0.15)` |
| `.type-unit` | `rgba(96, 165, 250, 0.08)` | `#60a5fa` | `rgba(96, 165, 250, 0.15)` |
| `.type-apartment` | `rgba(167, 139, 250, 0.08)` | `#a78bfa` | `rgba(167, 139, 250, 0.15)` |

### Category Badges

| Class | Background | Text | Border |
|---|---|---|---|
| `.category-sale` | `rgba(59, 130, 246, 0.12)` | `#3b82f6` | `rgba(59, 130, 246, 0.2)` |
| `.category-lease` | `rgba(139, 92, 246, 0.12)` | `#8b5cf6` | `rgba(139, 92, 246, 0.2)` |

### Metric Cards

- Gold top-border appears on hover (via `::before` pseudo-element)
- Icon containers use gold-tinted backgrounds
- Mini SVG charts with gold gradient fills
- Grid layout: `repeat(auto-fit, minmax(220px, 1fr))`

### Table

- Sortable columns with gold highlight on active sort (`.sorted` class)
- Inline price editing with gold border focus (`.price-input`)
- Row hover adds subtle gold background tint (`rgba(229, 193, 88, 0.02)`)
- Column groupings via `<thead>` with colspan for logical sections

### Modals

- Dark charcoal gradient background (`linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))`)
- Gold border on focused inputs
- Smooth slide-up animation (`@keyframes slideUp`)
- Fixed overlay with blur backdrop (`backdrop-filter: blur(8px)`)
- Max width: 600px, max height: 90vh with scroll

### Forms

- 2-column CSS grid (`.form-grid`)
- Full-width fields span 2 columns (`.form-group.full-width`)
- Focus state: gold border + subtle glow (`box-shadow: 0 0 12px rgba(229, 193, 88, 0.1)`)
- Select dropdowns use custom SVG chevron arrow

### Tab Bar

```css
.tab-bar {
  display: flex;
  gap: 4px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 4px;
  width: fit-content;
}
```

### Login Screen

- Centered layout with large logo (64px), title with gold gradient
- 2×2 agent card grid
- Cards: glassmorphic with avatar circles, hover lift effect
- Staggered `fadeIn` animations (0.1s increments)

### Header Agent Info

- Compact agent display in header: avatar circle + name
- Glassmorphic pill container

### Activity Log

- Vertical timeline with avatar, action text, and timestamp
- Action verbs highlighted in gold
- Max height: 360px with scroll
- `fadeInItem` animation for new entries

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `≤640px` | Single-column grid, stacked card actions |
| `641–1024px` | 2-column listing grid |
| `≥1025px` | 3-column listing grid |
| `≤768px` | Stacked header, 2-column metrics, single-column forms, full-width search |

---

## Animations

| Name | Trigger | Effect |
|---|---|---|
| `fadeIn` | Page load, modal open | Opacity 0 → 1 |
| `slideUp` | Modal content | translateY(20px) + opacity 0 → translateY(0) + opacity 1 |
| `fadeInItem` | Activity log entry | Opacity 0 + translateX(-10px) → opacity 1 + translateX(0) |

---

## Component Architecture

```
src/
├── App.jsx                    # Main app: session, tabs, filters, sorting, modals
├── App.css                    # All component styles (1446 lines)
├── index.css                  # CSS variables, global styles, design tokens
├── data.js                    # Agents, listings, activityLogs, colourSchemes
└── components/
    ├── ListingsTable.jsx      # Table view with status/style configs
    ├── ListingsGrid.jsx       # Grid/card view with configs
    ├── AddEditPropertyModal.jsx  # Form with all field constants
    ├── MetricsCards.jsx        # Dashboard metrics calculation
    ├── FloorplanModal.jsx      # SVG floorplan generator
    ├── AgentSelector.jsx       # Agent selection component
    ├── ActivityLog.jsx         # Activity timeline
    └── ColourSchemeModal.jsx   # Colour scheme picker
```

---

## Seed Data

### Listings Distribution

| Category | Count | Price Range |
|---|---|---|
| Sale | 14 | $750,000 – $3,300,000 |
| Lease | 6 | $550/wk – $1,250/wk |

### Status Distribution

| Status | Count |
|---|---|
| Available | 15 |
| Hold | 3 |
| Sold | 2 |

### Listing Style Distribution

| Style | Count |
|---|---|
| Exclusive | 13 |
| Off-Market | 7 |

### Agent Distribution

| Agent | Listings |
|---|---|
| Sarah Jenkins | 5 |
| Michael Chang | 4 |
| Emily Rodriguez | 4 |
| David Kim | 4 |
