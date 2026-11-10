---
name: pdf-document-generation
description: >-
  PDF & Document Generation guidelines: standard optical prescriptions (A4/A5),
  thermal receipt vouchers (80mm), lab workshop job tickets, and printable invoices.
---

# PDF & Document Generation Skill

## Print & PDF Specifications
1. **Prescription Document (A4/A5 Official Format):**
   - Header: Clinic logo, CIF, Optical Registry number, address, phone.
   - Patient info: Full name, DNI, date of exam.
   - Optometric Table: Clear tabular OD and OI grid with SPH, CYL, AXIS, ADD, DP, Visual Acuity.
   - Lens & Coatings Recommendation: Prescribed lens material, antireflective/blue filter coatings.
   - Optometrist Sign-off: Doctor name, professional license number (`Col. Óptico #`), signature space.
   - Legal notice: Compliance with health data protection and validity expiration (typically 1 year).
2. **Implementation Patterns:**
   - CSS Print Media stylesheets (`@media print`) for zero-dependency native browser printing.
   - Programmatic PDF generation via canvas/vector libraries for export and direct customer emailing.
