---
name: Zenith Minimalist
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d4e4fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3f4945'
  inverse-surface: '#223144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7975'
  outline-variant: '#bec9c4'
  surface-tint: '#186a5a'
  primary: '#005648'
  on-primary: '#ffffff'
  primary-container: '#1f6f5f'
  on-primary-container: '#a3efdb'
  inverse-primary: '#8ad5c1'
  secondary: '#555f71'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f6'
  on-secondary-container: '#596376'
  tertiary: '#763a2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#935142'
  on-tertiary-container: '#ffd7cf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f1dd'
  primary-fixed-dim: '#8ad5c1'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#005143'
  secondary-fixed: '#d9e3f9'
  secondary-fixed-dim: '#bdc7dc'
  on-secondary-fixed: '#121c2c'
  on-secondary-fixed-variant: '#3d4759'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a3'
  on-tertiary-fixed: '#390c04'
  on-tertiary-fixed-variant: '#713628'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d4e4fc'
typography:
  display-lg:
    fontFamily: Pretendard
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Pretendard
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Pretendard
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-md:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  margin: 24px
  max-width: 1200px
---

## Brand & Style

This design system is defined by a serene, high-utility minimalism tailored for the Korean market. The brand personality is intellectual, composed, and efficient. It seeks to evoke a sense of clarity and "finality"—the definitive answer to a user's need.

The design style is **Minimalism** with a focus on editorial-grade typography. It prioritizes generous negative space to accommodate the visual density of Hangul characters. By stripping away non-essential decoration, the UI allows the primary brand color and the content to take center stage, resulting in a professional and calming digital environment.

## Colors

The palette is anchored by a deep, sophisticated teal (#1F6F5F) used for primary actions and brand presence. The background is a soft, off-white (#EEEEEE) which reduces eye strain compared to pure white, providing a gallery-like canvas for content.

- **Primary:** Used for the main CTA, active states, and critical brand moments.
- **Secondary:** A slate grey for secondary actions and subtle iconography.
- **Neutral:** A range of greys derived from the primary hue to maintain tonal harmony.
- **Surface:** Pure white is reserved for cards and elevated containers to create a clear visual hierarchy against the #EEEEEE background.

## Typography

This design system utilizes **Pretendard** as the sole typeface. Pretendard is a variable font optimized for the Apple SD Gothic Neo environment, ensuring exceptional readability for both Korean and English text across all platforms.

To support Hangul naturally:
- **Line Height:** Set slightly higher (1.6 for body) than standard Latin settings to account for the vertical complexity of Korean characters.
- **Letter Spacing:** Headlines use slight negative tracking for a tight, modern look, while body and labels use zero or positive tracking to ensure clear glyph separation.
- **Weights:** Heavy use of Medium (500) and SemiBold (600) for UI labels to ensure legibility against the light background.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop and a **Fluid Grid** for mobile. A 12-column system is used for wide screens, narrowing to 4 columns on mobile devices.

The spacing rhythm is based on a 4px baseline grid. Because Korean text can appear visually "boxed," we use generous internal padding (MD or LG) within components to prevent the UI from feeling cramped. Content groups should be separated by XL spacing to reinforce the minimalist aesthetic.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Low-Contrast Outlines**. 

- **Level 0:** The #EEEEEE background.
- **Level 1:** White (#FFFFFF) surfaces with no shadows, but a subtle 1px border (#E2E8F0) to define edges.
- **Level 2:** White surfaces with a very soft, diffused ambient shadow (8% opacity of #1F6F5F) to indicate interactivity or modals.

Avoid heavy drop shadows. Depth should feel like layers of premium paper stacked neatly.

## Shapes

The design system uses **Soft** shapes (Level 1). 
- Standard components (buttons, inputs): 0.25rem (4px).
- Large components (cards, modals): 0.75rem (12px).

This subtle rounding balances the organic nature of Korean calligraphy with the geometric precision of the minimalist layout. It feels approachable without losing its professional edge.

## Components

- **Buttons:** Primary buttons use a solid #1F6F5F background with white text. Secondary buttons use a transparent background with a 1.5px border in #1F6F5F. Text should be centered with Medium weight.
- **Input Fields:** Use a white background with a 1px #CBD5E0 border. On focus, the border shifts to #1F6F5F with a 2px outer glow. Labels should always be visible above the field in `label-sm`.
- **Chips:** Small, pill-shaped indicators with #EEEEEE backgrounds and #2D3748 text. Used for filtering and tags.
- **Lists:** Clean rows separated by 1px #E2E8F0 dividers. Ensure vertical padding is at least 16px to accommodate Korean text descenders and ascenders.
- **Cards:** White surfaces with 12px rounding. Use `headline-md` for titles. Cards should not have shadows unless they are "hovered" or "active."
- **Checkboxes/Radios:** Use the primary color (#1F6F5F) for the selected state. Icons should be crisp and minimal.