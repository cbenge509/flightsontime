# Flight Delay Prediction - Documentation Site

A data journalism-style scrollytelling website showcasing the flight delay prediction project. Built with Astro, Tailwind CSS v4, and TypeScript.

**Live Site:** [cbenge509.github.io/flightsontime](https://cbenge509.github.io/flightsontime)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Astro](https://astro.build) | 5.x | Static site generator |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Styling via `@tailwindcss/vite` plugin |
| TypeScript | Strict mode | Type safety |
| [Vitest](https://vitest.dev) | Latest | Unit testing |
| [Playwright](https://playwright.dev) | Latest | E2E testing (Chromium, Firefox, WebKit) |
| [gts](https://github.com/google/gts) | Latest | Google TypeScript Style (linting/formatting) |

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
docs-site/
├── src/
│   ├── components/
│   │   ├── sections/       # Page sections (Hero, Problem, Data, etc.)
│   │   ├── ui/             # Reusable UI components (Section, Container)
│   │   └── interactive/    # Hydrated interactive components (Counter, FlightMap, ModelSlider)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro     # Main page
│   ├── styles/
│   │   └── app.css         # Global styles and design tokens
│   ├── lib/
│   │   ├── animations.ts   # Animation utilities
│   │   ├── data.ts         # Static data/metrics
│   │   ├── images.ts       # Image imports
│   │   └── utils.ts        # Helper functions
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── assets/
│       └── images/         # Optimized images (auto-converted to WebP)
├── tests/
│   └── e2e/
│       └── home.spec.ts    # E2E tests
├── public/
│   └── favicon.svg
└── [config files]
```

## Page Sections

The site is a single-page scrollytelling experience with 7 sections:

1. **Hero** - Animated flight map, headline, key metric counters
2. **Problem** - Cost of delays, industry context ($28B annual cost)
3. **Data** - Dataset overview (31M flights, 630 weather stations)
4. **Discovery** - EDA visualizations with scroll-reveal animations
5. **Approach** - Pipeline diagram, feature engineering, model selection
6. **Results** - Interactive model comparison slider, metrics visualization
7. **Footer** - Team credits, GitHub link, UC Berkeley attribution

## Interactive Features

- **Flight Map Animation** - Canvas-based animated flight paths between 12 major US airports
- **Animated Counters** - Number counters with easing animations
- **Model Comparison Slider** - Interactive slider to compare LR, RF, and NN models
- **Scroll Animations** - Fade-up, scale, and stagger animations on scroll

## Testing

### Unit Tests (Vitest)

Unit tests are co-located with source files (`*.test.ts`):

- `src/lib/utils.test.ts` - Utility function tests
- `src/lib/animations.test.ts` - Animation utility tests
- `src/components/interactive/*.test.ts` - Interactive component tests

Run with: `npm test`

### E2E Tests (Playwright)

E2E tests cover:

- Section visibility and content
- Interactive feature functionality
- Accessibility requirements
- Responsive design across breakpoints
- Console error detection
- Visual regression snapshots

Run with: `npm run test:e2e`

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` or `master` branch.

### CI/CD Pipeline

1. **Lint & Type Check** - gts lint + astro check
2. **Unit Tests** - Vitest
3. **Build** - Astro build with image optimization
4. **E2E Tests** - Playwright across Chromium, Firefox, WebKit
5. **Deploy** - GitHub Pages

### Manual Deployment

```bash
# Run full CI pipeline locally
npm run lint && npm run build && npm test -- --run && npm run test:e2e

# Build output is in ./dist
```

## Accessibility

- Skip-to-content link for keyboard navigation
- Proper heading hierarchy (h1 -> h2 -> h3)
- aria-hidden on decorative elements
- aria-labels on interactive components
- prefers-reduced-motion support
- Minimum 44px touch targets
- WCAG AA color contrast

## Performance

- Lazy loading for images
- Astro automatic image optimization (WebP conversion)
- Font loading with `display=swap` and async loading
- Preconnect hints for Google Fonts
- Critical CSS inlining (Astro default)
- Minimal JavaScript bundle

## License

MIT - See [LICENSE](../LICENSE) for details.
