---
name: data-validation
description: >-
  Data validation guidelines using Zod, TypeScript strict typing, optometric boundary checks,
  date chronology validations, and prevention of clinical input errors.
---

# Data Validation Skill

## Validation Rules & Boundary Verification
1. **Clinical Diopters (SPH / CYL / ADD):**
   - Must be strictly within standard ranges: Sphere $[-30.00, +30.00]$, Cylinder $[-12.00, +12.00]$, Addition $[+0.75, +4.00]$.
   - Must strictly satisfy standard optical step: multiple of $0.25$ diopters (`val % 0.25 === 0`).
   - Axis must be an integer between $0^\circ$ and $180^\circ$.
2. **Identification & Contact:**
   - Spanish DNI/NIE validation checksum algorithm.
   - International standard phone format (E.164 / Spanish 9-digit format).
   - Sanitized email addresses.
3. **Temporal Validation:**
   - Appointment `endTime` must be strictly greater than `startTime`.
   - Prevent past date bookings unless explicitly logged as backdated historical entries.
   - Detect and prevent overlapping clinician schedules.
