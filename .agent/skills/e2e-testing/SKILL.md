---
name: e2e-testing
description: >-
  E2E testing guidelines with Playwright: simulated user flows (appointment booking, prescription entry,
  inventory checkout), visual regression testing, and clinical assertion checks.
---

# E2E Testing Skill with Playwright

## Testing Suite Architecture
1. **Critical Clinical Paths:**
   - **Flow 1: Prescripción Optométrica Completa:** Navigate to `/recetas/nueva` -> Enter OD/OI values -> Validate auto-transposition -> Submit -> Verify in prescription history -> Trigger print view.
   - **Flow 2: Agenda sin Solapamientos:** Book appointment at 10:00 -> Attempt booking another appointment with same professional at 10:15 -> Assert that conflict banner is displayed.
   - **Flow 3: Inventario y Alertas:** Filter products by low stock -> Perform stock adjustment -> Confirm movement appears in audit logs.
2. **Playwright Best Practices:**
   - Use role-based selectors (`getByRole('button', { name: /guardar/i })`).
   - Run tests headless in CI and headed in local debug mode.
