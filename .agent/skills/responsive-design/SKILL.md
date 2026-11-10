---
name: responsive-design
description: >-
  Responsive design guidelines for desktop consultation stations, clinical tablets (iPad/Surface),
  and mobile quick-views. Fluid grid systems, breakpoints, and touch targets.
---

# Responsive Design Skill

## Breakpoint Strategy
- **Mobile (`< 640px`):** Stacked vertical layouts, bottom navigation drawers, full-width touch-friendly form buttons (min 44px tap target).
- **Tablet / Clinical Sales Station (`640px - 1024px`):** Split-view layouts, scrollable clinical tables with sticky headers, collapsible sidebar.
- **Desktop Gabinete (`>= 1024px`):** Full multi-column view, persistent sidebar, dual-eye prescription grid (OD side-by-side with OI).

## Key Patterns
- Fluid tables with horizontal scroll indicators and fixed first column for patient names / SKU.
- Responsive grid templates: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- Touch target sizing: All actionable icons wrapped in at least 40x40px interactive bounding boxes.
