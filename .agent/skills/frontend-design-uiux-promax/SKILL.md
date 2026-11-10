---
name: frontend-design-uiux-promax
description: >-
  Expert guidelines for high-end SaaS frontend design, UI/UX architecture, typography,
  visual hierarchy, enterprise dashboards, dense clinical data tables, and minimal aesthetics.
---

# UI UX Pro Max — Design System & Architecture

This skill equips the agent with high-standard UI/UX engineering principles for modern, premium enterprise applications.

## Core Tenets
1. **Visual Hierarchy & Information Density:**
   - Group related clinical metrics with clear whitespace (`gap-4`, `p-6`) rather than heavy borders.
   - Use subtle backgrounds (`bg-slate-50` / `dark:bg-slate-900`) and high-contrast typography (`text-slate-900` / `dark:text-slate-50`).
   - Prioritize primary action buttons (high contrast teal/slate) and demote secondary actions to ghost or outline variants.

2. **Optical & Clinical Ergonomics:**
   - Dioptric values ($SPH, CYL, AXIS$) must be rendered with tabular figures (`font-mono` or `tabular-nums`) to prevent optical misalignment.
   - High contrast ratios (WCAG AAA for text, AA for interactive boundaries).
   - Responsive layouts that gracefully adapt from desktop consultation stations (1920px) to optical sales tablets (iPad / 1024px) and mobile quick views.

3. **Component Architecture:**
   - Modal dialogs with fixed headers/footers and scrollable inner bodies for dense forms.
   - Breadcrumb navigation, smart badge indicators for appointment and stock status.
