# Copilot Instructions for DotCalendarWeb

## Repository Overview

**DotCalendar** is a modern, single-page web application (SPA) that visualizes a person's life in weeks. The application displays 52 weeks for each year of a 100-year lifespan, helping users conceptualize the transience of life and make long-term plans.

### Key Information
- **Type**: Frontend Web Application (SPA)
- **Languages**: TypeScript, HTML, CSS
- **Primary Frameworks**: Tailwind CSS v4, date-fns v4
- **Build System**: Bun v1.3.14+ (replaces Vite as of v0.6.0)
- **Runtime**: Modern browsers (ES2025 target)
- **Deployment**: Static site hosting or Cloudflare Workers (wrangler)
- **License**: MIT (Open Source)
- **Status**: Open Source Project - Community contributions welcome
- **Repository Size**: Small (~25MB with node_modules)

### Current Version
- **v0.7.0** (released May 26, 2026)
- **Latest Updates** (May 26, 2026):
  - ES2025 target — `tsconfig.json` lib set to `ES2025`, Bun build uses `splitting: true`
  - `calculatePassedAndRemainingWeeks` refactored to pure `reduce` (no mutable state)
  - Modern web improvements: `content-visibility`, `prefers-reduced-motion`, skip link, light-dismiss dialog
  - Proper dialog exit animations: `overlay` + `transition-behavior: allow-discrete`
  - Scroll progress bar: compositor-thread `scaleX` + Firefox fallback
  - Keyboard fix in `CalendarDot`: Enter on `keydown`, Space on `keyup` (ARIA spec)
  - Required onboarding DOB + `inert` protection for main content
  - Focus View mode: current-year weeks + live clock + notes panel
  - Light-theme contrast improvements in Focus View
  - OpenGraph + Twitter/X metadata added
  - oxlint + oxfmt replace ESLint/Prettier
  - Playwright E2E suite added (`57` tests)

---

## Project Structure

```
src/
├── main.ts                    # Application entry point - handles DOB input, rendering, focus mode toggle
├── style.css                  # Global styles (imports Inter fonts and Tailwind)
├── components/
│   ├── calendar-dot.ts        # Web Component for individual week dots
│   ├── dob-input.ts           # Web Component for DOB field + clear button
│   ├── focus-view.ts          # Focus mode overlay (clock + notes + current-year dots)
│   ├── note-dialog.ts         # Modal dialog for week notes
│   └── onboarding/
│       ├── screen1.ts         # First onboarding screen
│       └── screen2.ts         # Second onboarding screen (required DOB)
├── css/
│   └── inter.css              # Inter font imports
├── fonts/
│   └── Inter/                 # Web font files (woff2)
└── utils/
    ├── date-calculation.ts    # Date math and week calculations
    ├── render.ts              # DOM rendering functions
    ├── state.ts               # In-memory app state container
    ├── storage.ts             # localStorage API wrapper
    └── onboarding.ts          # Onboarding flow logic

tests/
└── e2e/                       # Playwright E2E tests + helpers

index.html                      # HTML entry point (processed by Bun build)
playwright.config.ts            # Playwright test config + Bun webServer
public/                         # Static assets (copied to dist/)
├── banner.webp
├── logo.webp
└── robots.txt
favicon/                        # Favicon files (various sizes)
```

### Root Configuration Files
- **package.json**: Scripts and dependencies (`dev`, `build`, `preview`, `lint`, `lint:fix`, `fmt`, `fmt:check`, `test`, `test:e2e`)
- **tsconfig.json**: TypeScript strict mode, `lib: ES2025`, DOM library included
- **bunfig.toml**: Bun configuration (enables bun-plugin-tailwind for serve.static)
- **playwright.config.ts**: E2E runner config and local webServer command (`bun index.html`)
- **wrangler.jsonc**: Cloudflare Workers deployment config
- **build.ts**: Bun build script that bundles, minifies, splits, and copies static files
- **site.webmanifest**: PWA manifest
- **.gitignore**: Ignores dist/, node_modules/, .wrangler/, Playwright output

---

## Build and Development Workflow

### Prerequisites
- **Bun v1.3.14 or higher** (currently using v1.3.14)
  - Install: `curl -fsSL https://bun.sh/install | bash`
  - Verify: `bun --version` should output version ≥ 1.3.14

### Installation
```bash
bun install
```
- Installs all dependencies from package.json
- Always run this first before any other command
- Creates node_modules/ and updates bun.lock

### Development Server
```bash
bun run dev
```
- Starts dev server with hot reloading
- Command: `bun run index.html --watch`
- Configured in bunfig.toml to use bun-plugin-tailwind
- Accessible via browser on localhost (port varies)
- Watches for TypeScript and CSS changes

### Production Build
```bash
bun run build
```
- Command: `bun ./build.ts`
- Bundles `index.html` with Tailwind plugin, minifies output, emits source maps
- Copies assets from `public/` to `dist/`

### Preview Production Build
```bash
bun run preview
```
- Command: `bun ./build.ts && bun run ./dist/index.html`
- Runs build first, then serves the compiled output

### Linting
```bash
bun run lint
```
- Command: `oxlint`
- Zero warnings and zero errors expected before committing

### Formatting
```bash
bun run fmt
bun run fmt:check
```

### Unit Tests
```bash
bun test src/
```
- Uses Bun built-in test runner (`bun:test`)
- Test file: `src/utils/date-calculation.test.ts` (13 tests)

### E2E Tests (Playwright)
```bash
bun run test:e2e
```
- Uses Playwright (`@playwright/test`)
- Runs against Bun web server (`bun index.html`) configured in `playwright.config.ts`
- Current baseline: `57` passing tests

Optional variants:
```bash
bun run test:e2e:headed
bun run test:e2e:ui
bun run test:e2e:report
```

---

## Important Build Notes

### Key Dependencies
1. **date-fns (^4.1.0)**: Date manipulation and calculations
2. **tailwindcss (^4.2.2)**: Utility-first CSS framework
3. **wrangler (4.59.1)**: Cloudflare Workers CLI
4. **bun-plugin-tailwind (^0.1.2)**: Bun build plugin for Tailwind
5. **typescript (^6.0.2)**: strict TypeScript checks
6. **oxlint (^1.57.0)**: linting
7. **oxfmt (^0.42.0)**: formatting
8. **@playwright/test (^1.60.0)**: E2E testing framework
9. **@types/bun (^1.3.11)** and **@types/node (^22.x)**: type support for build/test tooling

### TypeScript Configuration
- **Target**: ES2025
- **Lib**: `['DOM', 'DOM.Iterable', 'WebWorker', 'ES2025']`
- **Module**: Preserve
- **Strict**: true
- **No emit**: true

---

## Pre-commit Checks

Before committing, run:

1. ```bash
   bun test src/
   ```
2. ```bash
   bun run lint
   ```
3. ```bash
   bun run build
   ```
4. ```bash
   bun run test:e2e
   ```

Optional:
```bash
bun run fmt
```

---

## Testing

- **Unit tests**: `bun test src/` (`bun:test`)
- **E2E tests**: `bun run test:e2e` (Playwright)
- E2E coverage includes:
  - onboarding (required DOB + security guard)
  - calendar rendering and DOB behaviors
  - note dialog + persistence
  - focus view mode
  - theme toggle persistence

---

## ⚠️ DO NOT CREATE NEW INSTRUCTION/DOCUMENTATION FILES

**STRICT RULE**: Do NOT create new markdown files with instructions, guidelines, reports, or documentation unless explicitly requested by the user.

- ✅ Modify existing docs when requested
- ❌ Do not add extra instruction/report markdown files by default

---

## Trust the Instructions

When working on this repository:
1. **Trust these instructions first** before searching the codebase
2. **Only search** if you need details not covered here
3. **Use commands exactly as documented**
4. **Run unit + lint + build + e2e checks before release commits**

---

## Quick Reference

| Task              | Command                          |
|-------------------|----------------------------------|
| Install deps      | `bun install`                    |
| Dev server        | `bun run dev`                    |
| Build             | `bun run build`                  |
| Preview build     | `bun run preview`                |
| Unit tests        | `bun test src/`                  |
| E2E tests         | `bun run test:e2e`               |
| Lint code         | `bun run lint`                   |
| Fix lint issues   | `bun run lint:fix`               |
| Format code       | `bun run fmt`                    |
| Check formatting  | `bun run fmt:check`              |
| Check Bun version | `bun --version` (need ≥1.3.14)   |

---

**Last Updated**: May 26, 2026
**Maintained by**: Pavel Zavadski (pavel.zavadski@pavlusha.me)
