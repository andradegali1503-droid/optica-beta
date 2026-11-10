---
name: database-migration
description: >-
  Database migration guidelines for PostgreSQL/Supabase: schema versioning, non-destructive alters,
  RLS policies, indexing strategies, and rollback scripts.
---

# Database Migration Skill

## Migration Standards
1. **Idempotent & Safe Execution:**
   - Always write migrations with `IF NOT EXISTS` or conditional blocks.
   - Separate DDL migrations (table creation, column addition) from data seeding scripts.
2. **Clinical Security & RLS (Row Level Security):**
   - Health data tables (`prescriptions`, `customer_medical_notes`) must always enforce RLS.
   - Example policy:
     ```sql
     ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Optometrists can manage prescriptions"
     ON prescriptions FOR ALL
     USING (auth.jwt() ->> 'role' IN ('admin', 'optometrist'));
     ```
3. **Audit Trail Immutability:**
   - Table `audit_logs` must disallow `UPDATE` and `DELETE` operations via trigger or RLS rules.
