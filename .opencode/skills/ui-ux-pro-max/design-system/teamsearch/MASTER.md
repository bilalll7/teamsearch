# TeamSearch Design System (v1.0)

## Pattern: Hero-Centric Design
- One primary CTA
- Hero dominates initial viewport
- Non-pulsing CTA with reduced motion support
- Static hero with video controls

## Style: Vibrant & Block-based
- **Mode Support:** Light (supported), Dark (supported)
- **Keywords:** Bold, energetic, playful, block layout, geometric shapes, high color contrast, duotone, modern, energetic
- **Best For:** Startups, creative agencies, gaming, social media, youth-focused, entertainment, consumer
- **Accessibility:** Conditional - requires contrast-text-4.5, keyboard, visible-focus, reduced-motion

## Colors (Primary Palette)
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--color-primary` | #DC2626 (Team red) | #EF4444 (Secondary red) |
| `--color-on-primary` | #FFFFFF | #000000 |
| `--color-secondary` | #EF4444 | #DC2626 |
| `--color-on-secondary` | #000000 | #FFFFFF |
| `--color-accent` | #F59E0B (Championship gold) | #D97706 |
| `--color-on-accent` | #FFFFFF | #000000 |
| `--color-background` | #FEF2F2 (Light red tint) | #111827 |
| `--color-foreground` | #7F1D1D | #F9FAFB |
| `--color-card` | #FFFFFF | #1F2937 |
| `--color-card-foreground` | #7F1D1D | #F9FAFB |
| `--color-muted` | #F0EDF1 | #374151 |
| `--color-muted-foreground` | #475569 | #9CA3AF |
| `--color-border` | #FECACA | #374151 |
| `--color-destructive` | #DC2626 | #EF4444 |
| `--color-on-destructive` | #FFFFFF | #000000 |
| `--color-ring` | #DC2626 | #EF4444 |

## Typography
- **Headlines:** Bebas Neue (bold, impactful, strong, dramatic, modern)
- **Body:** Source Sans 3 (300, 400, 500, 600, 700)
- **Google Fonts Import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
  ```

## Key Effects
- Large sections (48px+ gaps)
- Animated patterns
- Bold hover (color shift)
- Scroll-snap
- Large type (32px+)
- Animation timing: 200-300ms

## Spacing System
- `--space-px`: 1px
- `--space-0\.5`: 0.125rem (2px)
- `--space-1`: 0.25rem (4px)
- `--space-1\.5`: 0.375rem (6px)
- `--space-2`: 0.5rem (8px)
- `--space-2\.5`: 0.625rem (10px)
- `--space-3`: 0.75rem (12px)
- `--space-3\.5`: 0.875rem (14px)
- `--space-4`: 1rem (16px)
- `--space-5`: 1.25rem (20px)
- `--space-6`: 1.5rem (24px)
- `--space-7`: 1.75rem (28px)
- `--space-8`: 2rem (32px)
- `--space-9`: 2.25rem (36px)
- `--space-10`: 2.5rem (40px)
- `--space-11`: 2.75rem (44px)
- `--space-12`: 3rem (48px)
- `--space-14`: 3.5rem (56px)
- `--space-16`: 4rem (64px)
- `--space-20`: 5rem (80px)
- `--space-24`: 6rem (96px)
- `--space-32`: 8rem (128px)

## Component Recipes

### Hero Section
- Full-bleed background
- Centered headline (3xl-5xl)
- Subhead (lg-xl)
- Primary CTA at bottom (centered + sticky)
- Secondary CTA for alternative action
- Reduced motion: static hero, pause controls

### Card (Grid Layout)
- White card on tinted background (#FEF2F2)
- Border: #FECACA
- Hover: shadow-lg, border-primary
- Icon container: rounded-lg bg-primary/10 text-primary

### Button
- Primary: bg-primary text-white hover:bg-secondary
- Secondary: bg-white text-primary border border-primary hover:bg-muted
- Outline: transparent bg border border-neutral-300 text-neutral-700 hover:bg-neutral-50
- Ghost: transparent bg text-neutral-600 hover:bg-neutral-100
- Size: sm (h-8 px-3), md (h-10 px-4), lg (h-12 px-6)

### Form
- Label: text-sm font-medium text-neutral-700
- Input: h-10 border border-neutral-300 rounded-md px-3 focus:ring-2 focus:ring-primary
- Error: inline below input, text-destructive
- Error summary: role="alert" at top of form, link to each invalid field

### Navigation
- Header: border-b border-neutral-200 bg-white h-16
- Logo: h-8 w-8 rounded-lg bg-primary text-white
- Nav items: gap-4 with primary color accents
- Mobile: hamburger menu, full-screen overlay

## Accessibility Requirements
- [ ] No emojis as icons (use Heroicons/Lucide SVG)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast ≥4.5:1 minimum
- [ ] Focus states visible for keyboard nav (ring-2 ring-primary)
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px breakpoints
- [ ] Touch targets ≥44x44pt
- [ ] Error messages announced (role="alert" or aria-live)
- [ ] Error summary at top of form with links to fields

## Anti-Patterns
- Static content + Poor fan engagement
- Low contrast text on colored backgrounds
- Single-color CTAs without hover states
- No keyboard navigation support
- Missing reduced motion support
- Mobile-unfriendly spacing (gaps <16px)
