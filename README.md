# DotCalendar

<img src="public/logo.webp" width="1024" alt="DotCalendar Logo" style="width: 80px">

---

## About

DotCalendar is a single-page web app that visualizes life in weeks.
Each dot is one week. You can set your date of birth, see lived vs remaining weeks,
and keep notes per week.

## What's New in v0.7.0

- ES2025 target with Bun build splitting
- Accessibility and motion improvements (skip link, reduced-motion support, improved keyboard behavior)
- Required DOB onboarding with `inert` protection against UI bypass
- OpenGraph and Twitter/X metadata
- Focus View: split layout with current-year weeks, live clock, and year notes panel
- Full Playwright E2E coverage (`57` tests)

## Requirements

- Bun `>= 1.3.14`

## Install

```bash
bun install
```

## Development

```bash
bun run dev
```

## Production

```bash
bun run build
bun run preview
```

## Quality Checks

```bash
bun test src/
bun run lint
bun run build
bun run test:e2e
```

### Test Scripts

- `bun test src/` — unit tests (`bun:test`)
- `bun run test:e2e` — Playwright E2E (headless)
- `bun run test:e2e:headed` — Playwright E2E (headed)
- `bun run test:e2e:ui` — Playwright UI mode
- `bun run test:e2e:report` — open Playwright HTML report

## Tech Stack

- TypeScript (strict)
- Bun (build/dev/test runtime)
- Tailwind CSS v4
- date-fns v4
- oxlint + oxfmt
- Playwright (`@playwright/test`)

## Versioning

The project follows [SemVer](https://semver.org/).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
