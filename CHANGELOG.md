# CHANGELOG

## v0.7.0 - [2026/05/26]

- **Platform & Build**
  - TypeScript `target` and `lib` set to `ES2025`
  - Bun build enabled `splitting: true`
  - Tooling updated: `typescript ^6.0.2`, Bun `1.3.14`
- **Performance**
  - Scroll progress bar uses compositor-thread `transform: scaleX()` (instead of `width`)
  - Added Firefox fallback for progress updates when scroll timelines are unavailable
  - Added `content-visibility: auto` for off-screen year groups
- **Accessibility & UX**
  - Skip link and improved keyboard flow to main content
  - Decorative progress bar marked `aria-hidden="true"`
  - Global reduced-motion handling via `prefers-reduced-motion`
  - `CalendarDot` keyboard behavior aligned with ARIA spec (Enter on `keydown`, Space on `keyup`)
  - Note dialog supports light-dismiss and smooth entry/exit transitions
- **Onboarding & Security**
  - DOB in onboarding is required to continue
  - Added guard for manipulated localStorage state (`onboardingComplete=true` with empty DOB)
  - Added `inert` lock on main content while onboarding is active
  - Main content unlocks only after validated DOB is saved
- **Focus View (new mode)**
  - New split layout: current-year weeks (right), live clock (left top), notes list (left bottom)
  - Supports note editing through existing week dot interactions
  - Focus notes auto-refresh after dialog close/save
  - Improved note-dot highlight rendering (no broken grid) and boosted light-theme contrast
- **SEO & Sharing**
  - Added full OpenGraph metadata
  - Added Twitter/X card metadata
  - Added/updated meta description
- **Testing & Quality**
  - Migrated lint/format workflow to `oxlint` + `oxfmt`
  - Added Playwright E2E suite (`57` passing tests)
  - Added scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`

## v0.6.0 - [2026/02/15]

- **Build System**: Migrate from Vite to Bun v1.3.6+
- **Styling**: Implement dual theme support (Dark/Light)
- **Theme Toggle**: Add theme switcher button in navigation
- **Design System**: Cool Navy Blue color palette with light theme variant
- **UI/UX**:
  - Glass morphism effects for inputs and buttons
  - Improved mobile responsiveness with safe-area-inset support
  - Reduced padding for compact block design
  - Full-width input field with integrated delete button
  - Semantic HTML5 structure with ARIA labels
  - Week notes indicator (dots with pulse animation)
- **Mobile Optimization**:
  - Support for notch/Dynamic Island (viewport-fit=cover)
  - Safe area inset support for devices with curved edges
  - Responsive text sizes and icon sizing
- **SEO**: Remove SEO metatags and add robots.txt blocking
- **Code Quality**:
  - Strict TypeScript mode enforced
  - ESLint configuration updated
  - Remove author metadata from SEO
  - Fixed TypeScript any usage in note-dialog component

# v0.5.0 - [2025/12/21]

- Update ui/ux design
- Update images and icons

# v0.4.1 - [2025/12/21]

- Fix issue with glass effect
- Fix max date calculation

## v0.4.0 - [2025/12/21]

- Update UI design for better user experience
- Add possibility to write notes for each week

## v0.3.0 - [2025/12/07]

- Add ESLint for code quality and consistency
- Change runtime from NodeJS to Bun
- Render dots using document fragments for better performance
- Update dependencies to latest versions
- Add favicon

## v0.2.0 - [2025/11/07]

- Release version 0.2.0