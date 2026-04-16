# CHANGELOG

## v0.7.0 - [2026/xx/xx]

- **Code Quality**:
  - Replaces eslint with oxclint for improved linting performance and accuracy

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