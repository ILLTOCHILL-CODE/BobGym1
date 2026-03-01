---
name: api-contract-verification
description: Verifies compatibility between frontend API calls and backend route definitions/schemas using specialized review agents.
---

# API Contract Verification

Ensures that interfaces, API contracts, and data models remain synchronized across the system.

## Review Protocol

### 1. Identify Interface Changes
- Scan backend for changes in controller routes, HTTP methods, or payload schemas.
- Scan frontend for changes in API service calls or data types.
- Check for changes in types/interfaces shared between modules.

### 2. Cross-Reference Validation
- Use specialized `contracts-reviewer` pattern to analyze code contracts.
- Verify that frontend call sites match updated backend definitions.
- Check that all required fields are present and types are compatible (e.g., string vs Date).

### 3. Error Handling and Edge Cases
- Ensure new error responses in the backend are handled by the frontend.
- Check for compatibility issues in pagination, filtering, or sorting parameters.
- Verify that null/optional fields are handled consistently on both sides.

### 4. Quality Gates
- **Blocking**: Any breaking change in the backend without a matching frontend update.
- **Blocking**: Type mismatches in core data models passed through APIs.
- **Warning**: Missing documentation updates for contract changes.

## Verification Checklist
- [ ] Backend route parameters match frontend call arguments.
- [ ] JSON payload structure is consistent.
- [ ] Success and error response schemas are correctly mapped.
- [ ] Types are enforced (TypeScript interfaces or runtime validation).

---
**Goal**: Zero interface-related runtime errors by strictly verifying contracts during the development flow.
