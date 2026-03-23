# The Way of Kaizen

An interactive storytelling web app exploring the Japanese philosophy of continuous improvement through a cinematic, Samurai ink-wash aesthetic.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)

## Overview

"The Way of Kaizen" guides users through four symbolic phases of growth—from seed to canopy—each representing a pillar of kaizen: intent, habits, discipline, and growth. The experience blends minimalist Japanese design with smooth animations and thoughtful interactions.

## Features

- **Phase 1: The Seed** — Hold the Hanko seal to "water" the seed. Red ink fills the rising sun as you commit.
- **Phase 2: The Roots** — Ink-stroke roots animate into view. Falling sakura petals react to scroll.
- **Phase 3: The Trunk** — Prune distractions by slicing them. A brush-stroke slash animates across the screen.
- **Phase 4: The Canopy** — Record your 1% change for the day. Saves to `localStorage` and displays as a spirit seal (魂).

### Visual Design

- **Color palette:** Deep charcoal (#121212), paper white (#F2F2F2), blood red (#BC002D)
- **Typography:** Serif (Playfair Display) for titles, monospace (JetBrains Mono) for wisdom text
- **Atmosphere:** Film grain, dust particles, parchment texture, vertical sword-stroke progress bar

## Tech Stack

| Layer        | Technology              |
| ------------ | ----------------------- |
| Framework    | React 19                |
| Build        | Vite 8                  |
| Styling      | Tailwind CSS 4          |
| Animations   | Framer Motion           |
| Icons        | Lucide React            |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone or navigate to the project
cd kaizen-way

# Install dependencies
npm install

# If you hit peer dependency conflicts:
npm install --legacy-peer-deps
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Preview it with:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx    # Film grain, dust, progress bar
│   ├── Seed.jsx      # Sun, Hanko seal, ink splatter
│   ├── Roots.jsx     # Ink roots, sakura petals
│   ├── Trunk.jsx     # Jagged trunk, slice animation
│   └── Canopy.jsx    # Ink dots, input, spirit seal
├── App.jsx           # Phase routing, ink-bleed transitions
├── main.jsx
└── index.css         # Theme, typography, background
```

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start dev server               |
| `npm run build`| Build for production           |
| `npm run preview` | Preview production build    |
| `npm run lint` | Run ESLint                     |

## License

Private project.
