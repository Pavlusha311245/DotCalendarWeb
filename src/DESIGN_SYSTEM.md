# DotCalendar Design System

## Color Palette

The project uses a carefully curated cool navy blue color palette designed for modern, accessible UI with a cold, professional aesthetic.

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Secondary (Almost Black)** | `#021024` | 2, 16, 36 | Dark backgrounds, borders, primary base |
| **Primary (Deep Navy)** | `#052659` | 5, 38, 89 | Main button backgrounds, links, primary actions |
| **Accent Blue (Muted Blue-Gray)** | `#5483B3` | 84, 131, 179 | Completed weeks, interactive elements |
| **Light Blue (Soft Light Blue)** | `#7DA0CA` | 125, 160, 202 | Input fields, lighter backgrounds, hover states |
| **Bright Blue (Very Light Cyan)** | `#C1E8FF` | 193, 232, 255 | Focus states, bright accents, remaining weeks |

### Text Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Text Light** | `#F5F5F5` | Primary text on dark backgrounds |
| **Text Dark** | `#1A1A1A` | Reserved for light backgrounds (future use) |

## CSS Variables

All colors are defined as CSS custom properties in `:root` scope for easy theming:

```css
:root {
    --color-primary: #052659;
    --color-secondary: #021024;
    --color-accent-blue: #5483B3;
    --color-light-blue: #7DA0CA;
    --color-bright-blue: #C1E8FF;
    --color-text-light: #F5F5F5;
    --color-text-dark: #1A1A1A;
}
```

## Animation Timing

Consistent animation timing across the application:

```css
--transition-duration: 0.3s;
--transition-ease: ease;
```

## Component Styling Guide

### Buttons

#### Primary Button (`.btn`)
- **Background**: `--color-primary`
- **Text**: `--color-text-light`
- **Border**: `--color-secondary`
- **Hover**: Background changes to `--color-light-blue`, text to `--color-secondary`
- **Animation**: Subtle translate up (2px) on hover

#### Glass Button (`.btn-glass`)
- **Background**: Semi-transparent primary (rgba)
- **Border**: Light blue with reduced opacity
- **Backdrop**: Blur effect (8px)
- **Hover**: Increased opacity and background intensity
- **Animation**: 0.3s ease transition

#### Danger Button (`.btn-danger`)
- **Background**: Semi-transparent coral
- **Border**: Coral with opacity
- **Hover**: Increased coral intensity

#### Success Button (`.btn-success`)
- **Background**: Semi-transparent purple
- **Border**: Lilac with opacity
- **Hover**: Increased purple intensity

### Inputs & Text Areas

#### Date Input
- **Background**: `--color-light-blue`
- **Border**: 2px solid `--color-primary`
- **Focus**: Border changes to `--color-coral`, background to `--color-primary`
- **Animation**: 0.3s ease on all properties

#### Textarea (Note Dialog)
- **Background**: `--color-light-blue`
- **Border**: 2px solid `--color-primary`
- **Focus**: Background to `--color-primary`, border to `--color-coral`

### Calendar Dots

#### Completed Week (`.dot-red`)
- **Color**: `--color-coral`
- **Border**: `--color-secondary`
- **Hover**: Changes to `--color-lilac`, border to `--color-coral`
- **Effect**: Scale up 1.2x on hover, subtle shadow

#### Remaining Week (`.dot-green`)
- **Color**: `--color-purple`
- **Border**: `--color-primary`
- **Hover**: Changes to `--color-light-blue`, border to `--color-coral`
- **Effect**: Scale up 1.2x on hover, subtle shadow
- **Interactive**: Clickable for notes

#### Inactive Week (`.dot-gray`)
- **Color**: `--color-light-blue`
- **Opacity**: 50%
- **Cursor**: not-allowed
- **State**: Non-interactive

### Glass Morphism Effect (`.glass`)
- **Background**: Semi-transparent primary (15%)
- **Border**: Light blue (30% opacity)
- **Backdrop**: 8px blur
- **Shadow**: Subtle drop shadow
- **Hover**: Increased background opacity to 25%

### Progress Bar
- **Background**: `--color-coral`
- **Border**: `--color-purple`
- **Animation**: Grows from 0% to 100% based on scroll position

## Responsive Breakpoints

- **Mobile**: Default styles (< 768px)
- **Tablet**: 768px and above
- **Desktop**: 1024px and above

### Mobile-First Adjustments
- Larger touch targets for dots
- Adjusted padding and spacing
- Responsive font sizes

## Accessibility

- All text colors have sufficient contrast ratios with backgrounds
- Focus states are clearly visible with colored borders and shadows
- Interactive elements have hover and focus states
- Color is not the only means of conveying information (e.g., dots have different sizes and positions)

## Using the Design System

### Adding a New Component
1. Use existing CSS variables for colors
2. Apply consistent animation timing (0.3s ease)
3. Follow the glass morphism pattern for overlay elements
4. Ensure dark mode compatibility
5. Test with both mobile and desktop viewports

### Modifying Colors
To change the entire color scheme, update only the `:root` CSS variables. All components will automatically adapt.

### Creating Variants
Use the existing button and dot variants as templates:
- `.btn-glass.btn-danger`
- `.btn-glass.btn-success`
- `.dot.dot-red`, `.dot.dot-green`, `.dot.dot-gray`

---

**Last Updated**: January 25, 2026
**Design System Version**: 1.0
