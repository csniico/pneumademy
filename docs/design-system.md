# Pneumademy Color Scheme & Design System

> Official color palette and design tokens for the Pneumademy platform

---

## Brand Colors

### Primary: Soft Black / Near White

**OKLCH:** `oklch(0.18 0 0)` (light mode) / `oklch(0.93 0 0)` (dark mode)

A neutral, clean primary — near-black in light mode and near-white in dark mode — for maximum clarity and minimalism.

**Usage:**

- Primary buttons and CTAs
- Focus states and highlights
- Links and interactive elements
- Active navigation states

### Secondary: Medium Gray

**OKLCH:** `oklch(0.55 0 0)` (light mode) / `oklch(0.40 0 0)` (dark mode)

A neutral gray for supporting UI elements.

**Usage:**

- Secondary buttons
- Borders and dividers
- Subtle backgrounds
- Supporting visual elements

### Accent: Light Gray

**OKLCH:** `oklch(0.80 0 0)` (light mode) / `oklch(0.30 0 0)` (dark mode)

A lighter gray for subtle highlights and hover states.

**Usage:**

- Hover states and subtle backgrounds
- Icon containers
- Muted highlights

---

## Semantic Colors

### Background Colors

```
background          - Main page background (light/dark mode adaptive)
muted              - Secondary background for cards and sections
muted/20, muted/30  - Subtle background overlays and dividers
primary/5          - Very subtle primary tint for special sections
primary/10         - Light primary background for icon containers
```

### Text Colors

```
foreground          - Primary text color
muted-foreground   - Secondary/helper text
primary-foreground - Text on primary-colored backgrounds
```

### Interactive States

```
primary            - Main interactive color
primary/50         - Border highlights for special cards
primary/20         - Hover states for icon backgrounds
```

---

## Component-Specific Colors

### Navigation

- Background: `background` with `border-b`
- Logo/brand: `text-primary`
- Links: `text-foreground` default, hover changes per context

### Cards

- Default: `background` with `border`
- Highlighted (Disciple phase): `border-primary/50 bg-primary/5`
- Community cards: `background` with standard `border`

### Buttons

- Primary: `primary` background, `primary-foreground` text
- Secondary: `secondary` background
- Ghost: Transparent, hover reveals background
- Outline: Border only, fills on hover

### Sections

- Alternating: Use `bg-muted/30` for visual separation
- Hero: Subtle gradient `from-background to-muted/20`
- CTA sections: `bg-primary` with `text-primary-foreground`

---

## Icon Colors

All icons use contextual colors:

- In cards: `text-primary`
- In hero: `text-primary`
- In navigation: Follows parent text color
- Active states: `text-primary`

---

## Design Principles

### Spiritual & Contemplative

- Soft, muted palette (Mauve base)
- Clean, spacious layouts
- Gentle transitions
- Reverent, peaceful atmosphere

### Clarity & Hierarchy

- Clear visual hierarchy with size and weight
- Consistent spacing using Tailwind's scale
- Readable typography (Inter sans-serif)
- High contrast for accessibility

### No Distractions

- Minimal animations
- No emojis or overly casual elements
- Focus on content and community
- Professional yet warm tone

---

## Typography Scale

### Headings

```
h1: text-4xl sm:text-5xl md:text-6xl font-bold
h2: text-3xl font-bold
h3: text-xl font-semibold
```

### Body Text

```
Default: text-base (16px)
Large: text-lg
Small: text-sm
Muted: text-muted-foreground
```

---

## Spacing Conventions

### Section Padding

```
Standard: py-20
Reduced: py-12
Hero/Feature: py-20 md:py-32
```

### Container

```
Container: container mx-auto px-4
Max Width (centered): max-w-3xl, max-w-5xl
```

### Component Gaps

```
Card grids: gap-8
Icon + text: gap-2, gap-3, gap-4
Sections: Large vertical gaps (mb-8, mb-12)
```

---

## Sizing

### Input & Button Height

```
Input fields: 45px
Buttons: 45px min-height
```

### Border Radius

```
Base: 5px (--radius)
All components use this base or calc() multiples of it
```

---

## Border & Shadow

### Borders

```
Standard: border (1px solid)
Emphasized: border-2
Highlighted: border-2 border-primary/50
Section dividers: border-b, border-t
```

### Shadows

Default shadcn/ui shadows (subtle, from Radix):

- Cards have built-in shadow
- Minimal additional shadows
- Focus rings for accessibility

---

## Accessibility

### Contrast

- All text meets WCAG AA standards
- Primary color has sufficient contrast
- Muted text is readable but clearly secondary

### Interactive Elements

- All buttons have visible focus states
- Links are underlined or clearly differentiated
- Icon-only buttons have aria-labels

### Motion

- Respect `prefers-reduced-motion`
- Subtle transitions only
- No auto-playing animations

---

## Dark Mode

The platform fully supports dark mode via Tailwind's `dark:` variants and CSS variables:

- Automatic color inversion
- All custom colors adapt
- Maintained contrast ratios
- Theme toggle available in UI

---

## Usage Guidelines

### DO

- Use Mauve (primary) for emphasis and CTAs
- Maintain consistent spacing with Tailwind scale
- Keep backgrounds subtle and unobtrusive
- Test in both light and dark modes

### DON'T

- Don't use emojis anywhere in the platform
- Don't add bright, distracting colors
- Don't override shadcn/ui component colors without reason
- Don't use custom colors outside the system

---

## Reference: Tailwind Config

CSS variables are defined in `src/app/globals.css` and automatically adapt to light/dark themes.

**Font:** Inter (loaded via `next/font/google`, variable `--font-sans`)
