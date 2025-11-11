# PokeStory Guide - Project Structure

## Overview
A complete rewrite of the PokeStory Guide from a single 850-line JSX file to a fully structured, database-driven TypeScript React application.

## Project Statistics
- **Source Files:** 19 modular TypeScript/TSX files
- **Average File Size:** 50-80 lines
- **Build Size:** 340KB (gzipped: ~95KB)
- **Build Time:** ~4 seconds
- **Dependencies:** 184 packages
- **TypeScript Errors:** 0
- **Database Tables:** 5 (fully normalized)

## Directory Structure

```
project/
├── dist/                      # Production build output
├── scripts/
│   └── seed-full-kanto.ts    # Database seeding utility
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI primitives
│   │   │   ├── FallbackImg.tsx    # Image with fallback
│   │   │   ├── PixelImg.tsx       # Pixelated sprites
│   │   │   └── TypeBadge.tsx      # Pokemon type badges
│   │   ├── CounterTiers.tsx       # Strategy recommendations
│   │   ├── RegionPicker.tsx       # Region selection UI
│   │   ├── TeamList.tsx           # Pokemon party display
│   │   ├── TrainerGrid.tsx        # Trainer list grid
│   │   └── TrainerView.tsx        # Detailed trainer view
│   ├── hooks/
│   │   └── useMultiSrc.ts         # Multi-source image hook
│   ├── lib/
│   │   ├── database.ts            # Database query functions
│   │   ├── seed-data.ts           # Basic seed utility
│   │   └── supabase.ts            # Supabase client
│   ├── utils/
│   │   ├── cn.ts                  # Class name utility
│   │   └── placeholder.ts         # Placeholder SVG
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # App entry point
│   ├── types.ts                   # TypeScript definitions
│   └── vite-env.d.ts             # Vite type definitions
├── .env                       # Environment variables
├── .gitignore
├── index.html                 # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── IMPROVEMENTS.md           # Detailed changelog
└── PROJECT_STRUCTURE.md      # This file
```

## Database Schema

### Tables
1. **regions** - Pokemon game regions (Kanto, Johto, etc.)
2. **trainers** - Gym Leaders, Elite Four, Champions, Rivals
3. **trainer_teams** - Different team compositions per trainer
4. **party_members** - Individual Pokemon in each team
5. **counter_strategies** - Recommended counters with rationale

### Relationships
```
regions (1) ──→ (N) trainers
trainers (1) ──→ (N) trainer_teams
trainer_teams (1) ──→ (N) party_members
trainer_teams (1) ──→ (N) counter_strategies
```

## Key Features

### Architecture
- **Component-Based:** Small, focused React components
- **Type-Safe:** Full TypeScript coverage
- **Database-Driven:** All data in Supabase
- **Modular:** Clear separation of concerns
- **Extensible:** Easy to add new regions/trainers

### User Experience
- **Responsive Design:** Mobile-first, works on all devices
- **Image Fallbacks:** Multiple sources with automatic fallback
- **Loading States:** Proper feedback during data fetching
- **Pixel-Perfect Sprites:** Proper rendering for retro sprites
- **Smooth Transitions:** Hover effects and state changes

### Developer Experience
- **Hot Module Replacement:** Instant feedback during development
- **Type Checking:** Catch errors before runtime
- **Build Optimization:** Automatic code splitting and minification
- **ESLint Ready:** Code quality enforcement
- **Git Hooks Ready:** Pre-commit checks support

## Technology Stack

### Core
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool and dev server

### Database
- **Supabase** - PostgreSQL database + Auth + Storage
- **@supabase/supabase-js 2.39** - Database client

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **PostCSS 8.4** - CSS processing
- **Autoprefixer 10.4** - Browser compatibility

### Development
- **TypeScript ESLint** - Code quality
- **Vite React Plugin** - Fast refresh

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Opens on http://localhost:5173

### Production Build
```bash
npm run build
```
Outputs to `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Seed Database
```bash
# Edit scripts/seed-full-kanto.ts with your data
npx tsx scripts/seed-full-kanto.ts
```

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Design Decisions

### Why Supabase?
- Built-in PostgreSQL database
- Row Level Security for access control
- Real-time subscriptions (future feature)
- Auto-generated REST API
- Built-in authentication (future feature)

### Why Vite?
- Fastest build tool available
- Native ES modules in development
- Optimized production builds
- Excellent TypeScript support
- Rich plugin ecosystem

### Why Component Separation?
- **Maintainability:** Easy to find and fix bugs
- **Testability:** Each component can be tested in isolation
- **Reusability:** UI components used across the app
- **Scalability:** Easy to add new features
- **Collaboration:** Multiple developers can work simultaneously

### Why TypeScript?
- **Safety:** Catch errors at compile time
- **IntelliSense:** Better IDE autocomplete
- **Refactoring:** Rename/restructure with confidence
- **Documentation:** Types serve as documentation
- **Scalability:** Easier to maintain large codebases

## Performance Optimizations

1. **Lazy Loading:** Images load only when needed
2. **Code Splitting:** Vite automatically splits vendor code
3. **Tree Shaking:** Unused code removed from bundle
4. **Gzip Compression:** ~95KB compressed bundle
5. **Parallel Queries:** Multiple database calls run simultaneously
6. **Optimized Images:** Proper sizing and formats

## Accessibility

- Semantic HTML elements
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## Future Roadmap

See IMPROVEMENTS.md for detailed enhancement plans.

## Contributing

1. Keep components small (under 100 lines)
2. Follow existing naming conventions
3. Add TypeScript types for everything
4. Test on multiple screen sizes
5. Ensure accessibility standards
6. Run build before committing

## License

This is a reference implementation for educational purposes.
