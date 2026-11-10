---
name: motion-design-framer
description: >-
  Motion design guidelines using Motion for React / Framer Motion. Smooth transitions,
  page fades, drawer slide-ins, modal scale animations, and non-distracting UI micro-interactions.
---

# Motion Design & Framer Motion Guidelines

## Enterprise Motion Principles
1. **Speed & Purpose:**
   - Interactive feedback animations should be 120ms to 200ms.
   - Panel exits should be faster than entrances (e.g. 150ms exit vs 200ms enter).
   - Easing curve: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo / fluid response).
2. **Reduced Motion Respect:**
   - Always wrap animated wrappers or check `prefers-reduced-motion`.
3. **Common Transitions:**
   - **Page View Transitions:** `initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}`.
   - **Modal Popups:** `initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}`.
   - **Dropdowns & Tooltips:** Quick fade & subtle translateY (4px).
