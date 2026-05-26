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
  - oxlint + oxfmt replace ESLint/Prettier
  - Cool Navy Blue color palette implementation (v1.0)
  - Glass morphism input field for date of birth
  - Full-width button styling for top navigation
  - Dark/Light theme toggle (dual theme support)
  - Mobile optimization with safe-area-inset support for notch/Dynamic Island

---

## Project Structure

```
src/
├── main.ts                    # Application entry point - handles DOB input, year rendering
├── style.css                  # Global styles (imports Inter fonts and Tailwind)
├── components/
│   ├── calendar-dot.ts        # Web Component for individual week dots
│   ├── note-dialog.ts         # Modal dialog for week notes
│   └── onboarding/
│       ├── screen1.ts         # First onboarding screen
│       └── screen2.ts         # Second onboarding screen
├── css/
│   └── inter.css              # Inter font imports
├── fonts/
│   └── Inter/                 # Web font files (woff2)
└── utils/
    ├── date-calculation.ts    # Date math and week calculations
    ├── render.ts              # DOM rendering functions
    ├── storage.ts             # localStorage API wrapper
    └── onboarding.ts          # Onboarding flow logic

index.html                      # HTML entry point (processed by Bun build)
public/                         # Static assets (copied to dist/)
├── banner.webp
├── logo.webp
└── robots.txt
favicon/                        # Favicon files (various sizes)
```

### Root Configuration Files
- **package.json**: Scripts and dependencies (`dev`, `build`, `preview`, `lint`, `lint:fix`, `fmt`, `fmt:check`, `test`)
- **tsconfig.json**: TypeScript strict mode, `lib: ES2025`, DOM library included
- **bunfig.toml**: Bun configuration (enables bun-plugin-tailwind for serve.static)
- **wrangler.jsonc**: Cloudflare Workers deployment config
- **build.ts**: Bun build script that bundles, minifies, splits, and copies static files
- **site.webmanifest**: PWA manifest
- **.gitignore**: Ignores dist/, node_modules/, .wrangler/

### Documentation Files
- **.github/copilot-instructions.md**: This file - AI agent instructions
- **src/DESIGN_SYSTEM.md**: Design system documentation with color palette, component styles, accessibility notes
- **COLOR_PALETTE_REFERENCE.md**: Quick visual color reference guide
- **COLOR_PALETTE_IMPLEMENTATION.md**: Detailed color palette implementation report
- **COLOR_PALETTE_UPDATE_REPORT.md**: Complete update summary with diff details
- **COLOR_PALETTE_SUMMARY.md**: Overview of palette replacement
- **COLOR_PALETTE_CHECKLIST.md**: Implementation checklist
- **UI_LAYOUT_UPDATE.md**: Changes to UI layout (full-width buttons, glass input)

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
- Steps:
  1. Checks if dist/ directory exists before removing
  2. Removes dist/ directory if it exists (using Bun.file API)
  3. Bundles entry point (index.html) with Tailwind CSS plugin
  4. Sets target to "browser", minifies, includes source maps
  5. Copies all files from public/ to dist/
- Output: Optimized, minified JavaScript and CSS in dist/
- Build time: ~1-2 seconds
- Creates source maps for debugging (sourcemap: "linked")
- Safe handling: doesn't fail if dist folder doesn't exist on first build
- Creates source maps for debugging (sourcemap: "linked")

### Preview Production Build
```bash
bun run preview
```
- Command: `bun ./build.ts && bun run ./dist/index.html`
- Runs build first, then serves the compiled output
- Useful for testing production build locally

### Linting
```bash
bun run lint
```
- Command: `oxlint`
- Checks TypeScript and JavaScript files via oxlint (Rust-based, fast)
- Zero warnings and zero errors expected before committing
- Config: rules defined in package.json or `.oxlintrc.json` (if present)

### Fix Linting Issues
```bash
bun run lint:fix
```
- Automatically fixes fixable linting issues

### Code Formatting
```bash
bun run fmt
```
- Command: `oxfmt` — formats all TypeScript/JavaScript files
- Run `bun run fmt:check` to verify formatting without writing changes

### Run Tests
```bash
bun test
```
- Uses the built-in Bun test runner (`bun:test`)
- Test files: `src/utils/date-calculation.test.ts` (13 tests)
- All 13 tests must pass before committing logic changes to utilities

---

## Important Build Notes

### Key Dependencies
1. **date-fns (^4.1.0)**: Date manipulation and calculations
   - Used in: utils/date-calculation.ts, main.ts
   - Specific function: `addYears()` for calculating end-of-life date

2. **tailwindcss (^4.2.2)**: Utility-first CSS framework
   - Imported in src/style.css as `@import 'tailwindcss'`
   - Build time processing via bun-plugin-tailwind
   - Glass morphism classes (.glass, .glass.overlay)
   - Custom classes: .btn, .btn-glass with variants

3. **wrangler (4.59.1)**: Cloudflare Workers CLI
   - For deployment, not required for local dev
   - Config: wrangler.jsonc

4. **bun-plugin-tailwind (^0.1.2)**: Bun build plugin for Tailwind
   - Required for bundling Tailwind CSS
   - Configured in bunfig.toml

5. **typescript (^6.0.2)**: With strict mode enabled
   - noUnusedLocals and noUnusedParameters enforced

6. **oxlint (^1.57.0)**: Rust-based linter (replaces ESLint)
   - Fast, no config required, run via `bun run lint` / `bun run lint:fix`

7. **oxfmt (^0.42.0)**: Formatter (replaces Prettier)
   - Run via `bun run fmt` / `bun run fmt:check`

8. **@types/bun (^1.3.11)**: Bun type definitions
   - Needed for `Bun.build`, `Bun.file`, `Bun.$` shell used in build.ts and tests

### TypeScript Configuration
- **Target**: ES2025 (explicit — not ESNext)
- **Lib**: `["DOM", "DOM.Iterable", "WebWorker", "ES2025"]`
- **Module**: Preserve (Bun native ESM)
- **Strict**: true (all strict checks enabled)
- **No emit**: true (compilation only, Bun handles transpilation)
- Build system (Bun) handles actual transpilation and bundling

### CSS and Styling
- Tailwind v4 uses @starting-style for transitions (modern CSS)
- Custom fonts: Inter (5 weights: Thin, Regular, Medium, SemiBold, Bold)
- Glass effect classes use backdrop-blur and rgba colors
- Dialog styling uses CSS custom properties and Tailwind
- **Dual Theme Support** (Dark/Light):
  - Switch controlled by `data-theme="dark"` or `data-theme="light"` on `<html>`
  - User preference saved to localStorage as `theme`
  - Theme toggle button in navigation bar (sun/moon icon)
  - Smooth 0.3s transitions between themes

- **Color Palette - Dark Theme** (default):
  - Primary: #052659 (Deep Navy)
  - Secondary: #021024 (Almost Black Navy)
  - Accent Blue: #5483B3 (Muted Blue-Gray)
  - Light Blue: #7DA0CA (Soft Light Blue)
  - Bright Blue: #C1E8FF (Very Light Cyan)
  - Text Light: #F5F5F5

- **Color Palette - Light Theme**:
  - Primary: #D4E4F0 (Soft Blue-Gray)
  - Secondary: #E8F0F5 (Very Light Blue)
  - Accent Blue: #5483B3 (Muted Blue-Gray) - shared
  - Light Blue: #7DA0CA (Soft Light Blue) - shared
  - Bright Blue: #052659 (Deep Navy)
  - Text Light: #1A1A1A (Dark)
- CSS Variables defined in `:root` for easy theme customization
- Custom CSS classes: `.glass`, `.glass.overlay`, `.btn`, `.btn-glass`, `.btn-glass.btn-success`, `.btn-glass.btn-danger`, `.input-glass`
- Input glass effect: Semi-transparent background with 8px backdrop blur

---

## Design System & Color Palette

### Theme System
- **Dual Theme Support**: Dark (default) and Light themes
- Theme controlled via `html[data-theme="dark"]` or `html[data-theme="light"]`
- User preference persisted in localStorage as `theme` key
- Theme toggle button located in navigation (sun/moon icon)
- Smooth 0.3s color transitions between themes using CSS variables
- **Init function**: `initTheme()` called on page load to restore user's preference

### Color Variables (CSS Custom Properties)
All colors are defined in `src/style.css` `:root` scope and overridden for light theme:

**Dark Theme** (`:root`):
```css
--color-primary: #052659;          /* Deep Navy - buttons, primary actions */
--color-secondary: #021024;        /* Almost Black Navy - backgrounds, borders */
--color-accent-blue: #5483B3;      /* Muted Blue-Gray - completed weeks, accents */
--color-light-blue: #7DA0CA;       /* Soft Light Blue - inputs, hover states */
--color-bright-blue: #C1E8FF;      /* Very Light Cyan - focus states, bright accents */
--color-text-light: #F5F5F5;       /* Light Text - primary text on dark backgrounds */
--color-text-dark: #1A1A1A;        /* Dark Text - reserved for light backgrounds */
```

**Light Theme** (`html[data-theme="light"]`):
```css
--color-primary: #D4E4F0;          /* Soft Blue-Gray - buttons, primary actions */
--color-secondary: #E8F0F5;        /* Very Light Blue - backgrounds, borders */
--color-accent-blue: #5483B3;      /* Muted Blue-Gray - completed weeks (shared) */
--color-light-blue: #7DA0CA;       /* Soft Light Blue - inputs (shared) */
--color-bright-blue: #052659;      /* Deep Navy - focus states, bright accents */
--color-text-light: #1A1A1A;       /* Dark Text - primary text on light backgrounds */
--color-text-dark: #F5F5F5;        /* Light Text - reserved for dark backgrounds */
```

**Shared Properties**:
```css
--transition-duration: 0.3s;       /* Animation timing */
--transition-ease: ease;           /* Animation easing */
```

### Glass Morphism Classes
- **.glass**: Semi-transparent background with 8px blur, used for containers
- **.glass.overlay**: Alternative glass style for overlays
- **.input-glass**: Glass effect for input fields (date of birth)
  - Semi-transparent navy background (5% opacity)
  - Light blue border with reduced opacity
  - Full backdrop blur effect
  - Focus state: increased opacity, bright blue border

### Button Variants
- **.btn**: Primary button with navy background, light blue hover state
- **.btn-glass**: Glass button with semi-transparent navy
- **.btn-glass.btn-success**: Purple/accent blue variant
- **.btn-glass.btn-danger**: Bright cyan variant

### Calendar Dot Styles
- **.dot.dot-red**: Completed weeks - bright blue background (#C1E8FF)
- **.dot.dot-green**: Remaining weeks - accent blue background (#5483B3)
- **.dot.dot-gray**: Inactive weeks - light blue with 50% opacity
- Hover effects: scale 1.2x, color shift, subtle shadow

### Design Principles
- **Monochromatic + Complementary**: Cool navy blues with light cyan accents
- **Professional Aesthetic**: Trustworthy, modern, calm
- **Accessibility**: WCAG AA+ contrast ratios, clear focus states
- **Responsive**: Mobile-first design with 768px breakpoint

---

## Recent UI Updates (January 25, 2026)

### Top Navigation Bar
- Three buttons in horizontal layout:
  1. **Current year** - navigates to current year section
  2. **Theme toggle** (middle) - sun/moon icon, switches between dark/light themes
  3. **To top** - icon with label, scrolls to top
- Buttons have small gap (gap-2) for compact appearance
- All buttons use `.btn-glass` styling with consistent padding

### Footer Panels
- Uniform vertical spacing (gap-2 between panels)
- Consistent border-radius (0.5rem) across all elements
- Thin padding for compact, modern appearance:
  - Buttons: 0.5rem vertical padding
  - Input field: 0.5rem padding
  - Article cards: 0.2rem padding
- Safe area support for notch/Dynamic Island on mobile:
  - Uses `env(safe-area-inset-*)` for proper spacing
  - Viewport-fit=cover meta tag for full-screen experience

### Input Glass Effect
- Date of birth input uses `.input-glass` class
- Styled as glass container matching other glass elements
- Focus state: increased opacity, bright blue border
- Smooth 0.3s transitions on all properties
- Delete button positioned inside input field (absolute positioning)

### Mobile Optimization
- Responsive text sizes (text-sm, text-xs)
- Reduced icon sizes (w-3 h-3, w-4 h-4)
- Safe area insets for devices with notches
- `max-w-sm` containers (384px) for optimal mobile width
- Touch-friendly padding and spacing

---



### Pre-commit Checks
No automated CI/CD workflows currently configured. Before committing:

1. **Always run tests**:
   ```bash
   bun test
   ```
   All 13 tests must pass (date-calculation.test.ts)

2. **Always run linting**:
   ```bash
   bun run lint
   ```
   Ensure zero warnings and zero errors

3. **Always build and verify**:
   ```bash
   bun run build
   ```
   Ensure successful build with no errors

4. **Optional: Format code**:
   ```bash
   bun run fmt
   ```

5. **Optional: Test in browser**:
   ```bash
   bun run dev
   ```
   Manually test in browser if making UI/UX changes

### Testing
- **Test runner**: Bun built-in (`bun test`)
- **Test file**: `src/utils/date-calculation.test.ts` — 13 tests
- **Import**: `import { describe, expect, test } from "bun:test"`
- Covers `getRangeOfYears`, `calculateWeeksInYears`, `calculatePassedAndRemainingWeeks`
- Run with `bun test` — output shows pass/fail per test

### Error Handling
- DOM selectors use type assertions with `as HTMLElement` pattern
- LocalStorage API assumes available (no fallback)
- Scroll-driven animation has a JS fallback for Firefox in `main.ts`

---

## Code Patterns and Conventions

### TypeScript Patterns
- Strict typing enforced (no implicit any)
- Function signatures include return type annotations
- Event listeners use arrow functions for `this` binding
- Custom Events dispatched with specific event names (e.g., 'dot:click')

### DOM Handling
- Web Components (custom elements) used for calendar-dot
- CSS class manipulation for styling state changes
- Element selection via `getElementById` or DOM queries
- Type assertions for HTML elements when needed

### Storage
- localStorage wrapper in utils/storage.ts
- Key: 'dob' for date of birth
- Week notes stored with weekId as key
- No error handling for quota exceeded or disabled storage

### Date Calculations
- Uses date-fns for all date operations
- Supports 52 and 53 ISO-week years (uses `getISOWeeksInYear`)
- Life expectancy: 100 years from date of birth
- Current year derived from system date
- `calculatePassedAndRemainingWeeks` uses pure `Array.reduce` (no mutable state)

---

## File Modification Guidelines

### When Adding Features
1. New components should be Web Components (custom elements)
2. Register custom elements with `customElements.define()`
3. Add styles to src/style.css using Tailwind @apply or CSS classes
4. Export utility functions from utils/ files
5. Import utilities into main.ts or other files as needed

### When Modifying Existing Code
1. Maintain TypeScript strict mode compliance
2. Use type annotations on all function parameters and returns
3. Follow existing naming conventions (camelCase for functions/variables)
4. Update related utility functions if changing data structures
5. Run `bun run lint:fix` before committing

### When Changing Styles
1. **Always use CSS variables** for colors - never hardcode hex values
2. Use glass morphism (`background: rgba(...), backdrop-filter: blur(8px)`) for overlay elements
3. Ensure consistent animation timing (0.3s ease for all transitions)
4. Create custom classes in designated sections (.glass, .btn, .input-glass, etc.)
5. Test glass effects and backdrop blur in dev server
6. Verify Inter font loads correctly
7. Test on both mobile (< 768px) and desktop (768px+) viewports
8. Check accessibility with WCAG contrast checkers
9. Document color usage in src/DESIGN_SYSTEM.md if adding new variants

### When Adding Dependencies
1. Use `bun add` or modify package.json and run `bun install`
2. Update bunfig.toml if adding build plugins (like bun-plugin-tailwind)
3. Verify build still succeeds with new dependencies
4. Run `bun run lint` with any new files
5. Document in this file if dependency is critical

---

## Troubleshooting

### Common Issues

**Issue**: `bun run build` fails with Tailwind errors
- **Solution**: Ensure bunfig.toml has `plugins = ["bun-plugin-tailwind"]` under `[serve.static]`
- **Check**: Run `bun install` again to reinstall bun-plugin-tailwind

**Issue**: `bun run dev` not updating on file change
- **Solution**: Ensure --watch flag is used: `bun run index.html --watch`
- **Alternative**: Restart dev server manually

**Issue**: oxlint errors for unused variables
- **Solution**: This is enforced by tsconfig.json (`noUnusedLocals`, `noUnusedParameters`). Remove unused vars or use them.
- **Note**: Do NOT add `// eslint-disable` comments — the project uses oxlint, not ESLint

**Issue**: localStorage is empty/not persisting
- **Solution**: App uses localStorage; browser must support it (all modern browsers do)
- **Note**: This is expected in private/incognito windows (limited storage)

**Issue**: Date calculations seem incorrect
- **Solution**: Verify date-fns version is ^4.1.0 in package.json
- **Check**: addYears() behavior and week numbering in date-calculation.ts

---

## ⚠️ DO NOT CREATE NEW INSTRUCTION/DOCUMENTATION FILES

**STRICT RULE**: Do NOT create new markdown files with instructions, guidelines, reports, or documentation unless explicitly requested by the user.

### What NOT to do:
- ❌ Do NOT create `*_REPORT.md` files
- ❌ Do NOT create `*_CHECKLIST.md` files
- ❌ Do NOT create `*_SUMMARY.md` files
- ❌ Do NOT create `*_UPDATE.md` files
- ❌ Do NOT create any new `.md` documentation files
- ❌ Do NOT create files in `.github/` directory without explicit request

### What TO do:
- ✅ Modify existing files (src/style.css, index.html, src/main.ts, etc.)
- ✅ Update existing documentation if needed (src/DESIGN_SYSTEM.md only)
- ✅ Only create new files if they are application code (not documentation)
- ✅ Ask user before creating any new files

### Exception:
Only create new files if the user specifically says "create a file called X" or similar explicit request.

---

## Trust the Instructions

When working on this repository:
1. **Trust these instructions first** before searching the codebase
2. **Only search** if you need implementation details not mentioned here
3. **For all commands**, use the exact syntax shown above
4. **For all paths**, use the directory structure as documented
5. **For dependencies**, refer to the "Key Dependencies" section
6. **For errors**, consult the "Troubleshooting" section first

This guide covers 95% of common tasks. Follow it to work efficiently without unnecessary exploration.

---

## Quick Reference

| Task              | Command                          |
|-------------------|----------------------------------|
| Install deps      | `bun install`                    |
| Dev server        | `bun run dev`                    |
| Build             | `bun run build`                  |
| Preview build     | `bun run preview`                |
| Run tests         | `bun test`                       |
| Lint code         | `bun run lint`                   |
| Fix lint issues   | `bun run lint:fix`               |
| Format code       | `bun run fmt`                    |
| Check formatting  | `bun run fmt:check`              |
| Check Bun version | `bun --version` (need ≥1.3.14)   |

---

**Last Updated**: May 26, 2026
**Maintained by**: Pavel Zavadski (pavel.zavadski@pavlusha.me)
