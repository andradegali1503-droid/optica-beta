---
name: tailwind-shadcn-ui
description: >-
  Rules and patterns for building robust, accessible, responsive components using Tailwind CSS,
  shadcn/ui design patterns, and Radix UI primitives.
---

# Tailwind CSS + shadcn/ui Enterprise Component Guide

## Foundations
- Use clean `cn()` utility (`clsx` + `tailwind-merge`) for dynamic class combinations.
- Color tokens mapped to CSS variables with HSL channels to ensure seamless Dark Mode switching without CSS flickering.
- Accessible form controls built with Radix UI primitives (`@radix-ui/react-*`), supporting keyboard navigation (`Tab`, `Escape`, `Enter`, arrows) and ARIA attributes.

## Key Component Patterns
- **Buttons:** Variants for `default` (teal primary), `secondary`, `outline`, `destructive`, and `ghost`.
- **Form Controls:** `Input`, `Select`, `Textarea` with distinct `:focus-visible:ring-2` teal rings.
- **Card:** Clean border `border-slate-200 dark:border-slate-800`, subtle shadow `shadow-sm`, rounded-xl geometry.
- **Data Tables:** TanStack Table wrapper with sticky headers, sort indicators, pagination controls, and row hover states.
