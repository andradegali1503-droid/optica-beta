---
name: error-handling
description: >-
  Error handling and resilient recovery guidelines: React Error Boundaries, toast notifications,
  human-readable error messages, audit log error tracking, and fallback UI states.
---

# Error Handling & Resilient Recovery Skill

## Principles & Strategies
1. **Human-Readable Clinical Feedback:**
   - Never present raw database or network exceptions (e.g. avoid showing `PGRST116` or `SQL foreign key violation`).
   - Translate to actionable advice: *"El profesional ya tiene una cita asignada en ese tramo horario"* or *"El valor del cilindro debe ser múltiplo de 0.25 D"*.
2. **Layered Error Boundaries:**
   - App-level boundary: Catches catastrophic rendering errors and displays a safe recovery screen with a "Reiniciar Sesión Segura" action.
   - Module-level boundary: Isolates errors within specific views (e.g., Agenda, Inventario) without crashing the entire consultation session.
3. **Safe State Rollback:**
   - In financial or stock operations, transactional rollbacks must ensure stock counts are not decremented if ticket generation fails.
