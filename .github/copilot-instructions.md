# Copilot Instructions for DotCalendarWeb

## Repository Overview

**DotCalendar** is a modern, single-page web application (SPA) that visualizes a person's life in weeks. The application displays 52 weeks for each year of a 100-year lifespan, helping users conceptualize the transience of life and make long-term plans.

### Key Information
- **Type**: Frontend Web Application (SPA)
- **Languages**: TypeScript, HTML, CSS
- **Primary Frameworks**: Tailwind CSS v4, date-fns v4
- **Build System**: Bun v1.3.6+ (replaces Vite as of v0.6.0)
- **Runtime**: Modern browsers (ESNext target)
- **Deployment**: Static site hosting or Cloudflare Workers (wrangler)
- **License**: MIT
- **Repository Size**: Small (~25MB with node_modules)

### Current Version
- **v0.6.0** (in development, updated from Vite to Bun)

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
- **package.json**: Scripts and dependencies
- **tsconfig.json**: TypeScript strict mode enabled, DOM library included
- **eslint.config.ts**: ESLint with JS, TypeScript, and CSS rules
- **bunfig.toml**: Bun configuration (enables bun-plugin-tailwind for serve.static)
- **wrangler.jsonc**: Cloudflare Workers deployment config
- **build.ts**: Bun build script that bundles, minifies, and copies static files
- **site.webmanifest**: PWA manifest
- **.gitignore**: Ignores dist/, node_modules/, .wrangler/

---

## Build and Development Workflow

### Prerequisites
- **Bun v1.3.0 or higher** (currently using v1.3.6)
  - Install: `curl -fsSL https://bun.sh/install | bash`
  - Verify: `bun --version` should output version ≥ 1.3.0

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
  1. Removes existing dist/ directory
  2. Bundles entry point (index.html) with Tailwind CSS plugin
  3. Sets target to "browser", minifies, includes source maps
  4. Copies all files from public/ to dist/
- Output: Optimized, minified JavaScript and CSS in dist/
- Build time: ~1-2 seconds
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
- Command: `eslint .`
- Checks TypeScript, JavaScript, and CSS files
- Ignores: dist/, node_modules/, *.css (CSS files only checked for syntax)
- No errors expected if code follows ESLint config

### Fix Linting Issues
```bash
bun run lint:fix
```
- Automatically fixes fixable linting issues

---

## Important Build Notes

### Key Dependencies
1. **date-fns (^4.1.0)**: Date manipulation and calculations
   - Used in: utils/date-calculation.ts, main.ts
   - Specific function: `addYears()` for calculating end-of-life date

2. **tailwindcss (^4.1.18)**: Utility-first CSS framework
   - Imported in src/style.css as `@import 'tailwindcss'`
   - Build time processing via bun-plugin-tailwind
   - Glass morphism classes (.glass, .glass.overlay)
   - Custom classes: .btn, .btn-glass with variants

3. **wrangler (^4.56.0)**: Cloudflare Workers CLI
   - For deployment, not required for local dev
   - Config: wrangler.jsonc

4. **bun-plugin-tailwind (^0.1.2)**: Bun build plugin for Tailwind
   - Required for bundling Tailwind CSS
   - Configured in bunfig.toml

5. **typescript (^5.9.3)**: With strict mode enabled
   - noUnusedLocals and noUnusedParameters enforced

### TypeScript Configuration
- **Target**: ESNext
- **Module**: Preserve (Bun native ESM)
- **Strict**: true (all strict checks enabled)
- **No emit**: true (compilation only, no output generation)
- Build system (Bun) handles actual transpilation

### CSS and Styling
- Tailwind v4 uses @starting-style for transitions (modern CSS)
- Custom fonts: Inter (5 weights: Thin, Regular, Medium, SemiBold, Bold)
- Glass effect classes use backdrop-blur and rgba colors
- Dialog styling uses CSS custom properties and Tailwind

---

## Testing and Validation

### Pre-commit Checks
No automated CI/CD workflows currently configured. Before committing:

1. **Always run linting**:
   ```bash
   bun run lint
   ```
   Ensure zero errors and warnings

2. **Always build and verify**:
   ```bash
   bun run build
   ```
   Ensure successful build with no errors

3. **Optional: Test in browser**:
   ```bash
   bun run dev
   ```
   Manually test in browser if making UI/UX changes

### Error Handling
- No tests in codebase (none configured)
- Validation is lint-pass and build-success only
- DOM selectors use type assertions with `as HTMLElement` pattern
- LocalStorage API assumes available (no fallback)

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
- Assumes 52 weeks per year (no leap week handling)
- Life expectancy: 100 years from date of birth
- Current year derived from system date

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
1. Use Tailwind utilities first (@apply in CSS)
2. Create custom classes in .glass, .btn style sections
3. Ensure dark mode compatibility (classes use gray-200 for text, dark backgrounds)
4. Test glass effects with backdrop-blur in dev server
5. Verify Inter font loads correctly

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

**Issue**: ESLint errors for unused variables
- **Solution**: This is enforced by tsconfig.json. Fix by removing unused vars or using them
- **Exception**: Add `// eslint-disable-next-line` if intentional (rare)

**Issue**: localStorage is empty/not persisting
- **Solution**: App uses localStorage; browser must support it (all modern browsers do)
- **Note**: This is expected in private/incognito windows (limited storage)

**Issue**: Date calculations seem incorrect
- **Solution**: Verify date-fns version is ^4.1.0 in package.json
- **Check**: addYears() behavior and week numbering in date-calculation.ts

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

| Task              | Command                       |
|-------------------|-------------------------------|
| Install deps      | `bun install`                 |
| Dev server        | `bun run dev`                 |
| Build             | `bun run build`               |
| Preview build     | `bun run preview`             |
| Lint code         | `bun run lint`                |
| Fix lint issues   | `bun run lint:fix`            |
| Check Bun version | `bun --version` (need ≥1.3.0) |

---

**Last Updated**: January 24, 2026
**Maintained by**: Pavel Zavadski (pavel.zavadski@pavlusha.me)
