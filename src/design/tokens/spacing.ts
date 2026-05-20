// Figma spacing system: 8px grid
// Source: references/design_report.json - Foundations > Spacing System
export const spacingTokens = {
  1:  '0.25rem',  // 4px  - --spacing-4
  2:  '0.5rem',   // 8px  - --spacing-8
  3:  '0.75rem',  // 12px - --spacing-12
  4:  '1rem',     // 16px - --spacing-16
  6:  '1.5rem',   // 24px - --spacing-24
  8:  '2rem',     // 32px - --spacing-32
  10: '2.5rem',   // 40px - --spacing-40
  12: '3rem',     // 48px - --spacing-48
  16: '4rem',     // 64px - --spacing-64

  // Named aliases
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};

// Figma border radius: Button=8px, Card=12px
export const radiusTokens = {
  sm:   '0.25rem',  // 4px
  md:   '0.375rem', // 6px
  lg:   '0.5rem',   // 8px  - buttons
  xl:   '0.75rem',  // 12px - cards
  full: '9999px',
};
