---
name: accessibility-expert
description: >-
  Accessibility Expert guidelines (WCAG 2.1 AA/AAA, ARIA patterns, keyboard navigation,
  high contrast ratios, screen reader ergonomics for clinical SaaS).
---

# Accessibility Expert Skill

## Standards & Principles
1. **WCAG 2.1 Compliance:**
   - Minimum contrast ratio 4.5:1 for standard text, 3:1 for large text and interactive borders.
   - For clinical values (e.g., SPH, CYL, AXIS), target WCAG AAA (7:1 contrast) against backgrounds.
2. **Keyboard Navigation & Focus Management:**
   - Every interactive control must have an accessible focus ring (`focus-visible:ring-2 focus-visible:ring-teal-500`).
   - Modals and popovers must trap focus while open and restore focus upon dismissal.
   - Support `Escape` to close modals, `Arrow` keys for dropdown and tab navigation, `Enter`/`Space` for triggers.
3. **Screen Reader Ergonomics:**
   - Provide `aria-label` or `aria-labelledby` on icon buttons and metric counters.
   - Use semantic HTML tags (`<main>`, `<nav>`, `<aside>`, `<header>`, `<table>`, `<dialog>`).
   - Use `aria-live="polite"` for dynamic notifications and error alerts.
