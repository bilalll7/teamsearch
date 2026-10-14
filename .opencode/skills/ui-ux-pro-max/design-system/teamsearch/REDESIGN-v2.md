# TeamSearch Design System v2.0 - Editorial Professional

## Design Philosophy
**Product identity:** Platform for finding competition/hackathon/project teammates
**Visual approach:** Editorial typography + asymmetric layout + navy foundation + warm accents
**Not:** Generic SaaS template, gaming style, centered hero, fake statistics

## Colors
```css
/* Dark navy foundation (reference screenshot inspired) */
--color-background: #0F172A;      /* Navy slate-900 */
--color-surface: #1E293B;         /* Slate-800 */
--color-surface-elevated: #334155; /* Slate-700 */

/* Typography */
--color-foreground: #F8FAFC;      /* Slate-50 - primary text */
--color-muted-foreground: #94A3B8; /* Slate-400 - secondary text */

/* Warm accent (strategic use only) */
--color-accent: #F59E0B;          /* Amber-500 */
--color-accent-hover: #D97706;    /* Amber-600 */

/* Action colors */
--color-primary: #3B82F6;         /* Blue-500 - primary CTA */
--color-primary-hover: #2563EB;   /* Blue-600 */

/* Borders & dividers */
--color-border: #334155;          /* Slate-700 */
--color-border-subtle: #1E293B;   /* Slate-800 */

/* Status */
--color-success: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;
```

## Typography - Plus Jakarta Sans
```css
/* Single font family - variable weight */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

--font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */

/* Hero headline: clamp(2.5rem, 5vw, 4.5rem) - responsive 40-72px */
/* Line height: 1.1 for headlines, 1.5 for body */
/* Letter spacing: -0.02em for large text */
```

## Layout Principles
1. **Asymmetric composition** - avoid centered blocks stacked vertically
2. **Whitespace as design element** - generous padding (min 80px section gaps)
3. **Grid breakout** - some elements escape container for visual interest
4. **Focal hierarchy** - clear visual entry point, then guided flow

## Hero Section (New)
**Goal:** Establish product identity in first viewport

**Composition:**
- Left: Large headline (clamp 40-72px) + subtext + CTA
- Right: Visual representation of team matching (not illustration, not photo)
  - Option A: Card grid showing skill badges + role indicators
  - Option B: Connection graph visualization (simple SVG)
  - Option C: Live opportunity preview cards (2-3 real examples)
- Background: Navy #0F172A with subtle texture or gradient
- Accent: Warm amber used sparingly for active states

**Typography hierarchy:**
- H1: 700 weight, 72px desktop / 40px mobile, -0.02em tracking
- Subtext: 400 weight, 20px, slate-400, max-width 500px
- CTA: 600 weight, 18px

**No stats, no fake numbers, no testimonials**

## Navigation
- Fixed top, bg-surface (#1E293B) with backdrop-blur
- Height: 72px (generous, not cramped)
- Logo left: TeamSearch wordmark, 24px, 700 weight
- Nav center: Dashboard, Opportunities, Search (16px, 500 weight)
- Right: CTA button + user avatar (if logged in)
- Mobile: Hamburger → full-height overlay

## Components

### Button
```css
/* Primary CTA */
bg: #3B82F6, text: white, px: 32px, h: 48px
hover: bg #2563EB, transform scale(1.02), transition 200ms

/* Secondary */
bg: transparent, border: 2px solid #334155, text: slate-200
hover: bg #1E293B

/* Accent (limited use) */
bg: #F59E0B, text: white
hover: bg #D97706
```

### Card
```css
bg: #1E293B (surface)
border: 1px solid #334155
border-radius: 12px
padding: 24px
hover: border-color #3B82F6, shadow-lg
transition: 200ms
```

### Input
```css
bg: #0F172A (background)
border: 1px solid #334155
text: #F8FAFC
placeholder: #64748B
focus: border #3B82F6, ring 2px #3B82F61A
h: 48px, px: 16px
```

## Section Structure (Landing Page)

1. **Hero** (full viewport height)
   - Asymmetric: headline left, visual right
   - No centering
   - One primary CTA

2. **How It Works** (80px top padding)
   - 3 steps: horizontal flow on desktop, vertical mobile
   - Icon + title + description
   - Connector line between steps (horizontal rule with gradient)
   - No cards, just typography and icons

3. **Opportunities Preview** (80px top padding)
   - Real opportunity cards from API (2-3 examples)
   - Horizontal scroll on mobile
   - Each card: title, skills needed, team size, deadline
   - CTA: "View All Opportunities"

4. **Footer CTA** (80px top padding)
   - Single focused message
   - One CTA button
   - Footer links below

## Accessibility
- Contrast: Navy #0F172A + White #F8FAFC = 15.69:1 ✓
- Focus visible: 2px ring #3B82F6
- Reduced motion: disable transforms
- Touch targets: min 44x44px
- Keyboard nav: tab order logical
- ARIA labels on icons

## Anti-Patterns to Avoid
- ❌ Centered hero with two buttons
- ❌ Stats section with fake numbers (100+, 500+)
- ❌ Feature grid with identical cards
- ❌ Repeated CTAs ("Ready to build your team?" x2)
- ❌ Gradient backgrounds everywhere
- ❌ Emoji as icons
- ❌ Badge/pill overuse
- ❌ Pink tinted backgrounds (#FEF2F2)
- ❌ Red as primary brand color for text
