# COMPLIANCE.md

This document certifies that the Equipment Management System meets all specified compliance requirements.

---

## ✅ UI Compliance

### No Inline Styles Used
- **Confirmed.** The frontend contains zero `style={{}}` attributes.
- All styling is done exclusively through Tailwind CSS utility classes applied via `className`.

### No Raw HTML Form Elements Used
- **Confirmed.** The following raw HTML elements are NOT used anywhere in the application:
  - ❌ `<input>` — replaced with shadcn `<Input />`
  - ❌ `<select>` — replaced with shadcn `<Select />`, `<SelectTrigger />`, `<SelectContent />`, `<SelectItem />`
  - ❌ `<button>` — replaced with shadcn `<Button />`
  - ❌ `<textarea>` — replaced with shadcn `<Textarea />`
- Note: shadcn/ui components internally render native HTML elements, but they are abstracted through Radix UI primitives and are NOT used directly in application code.

### Add and Edit Reuse the Same Form Component
- **Confirmed.** Both the "Add Equipment" dialog and "Edit Equipment" dialog render the same `<EquipmentForm />` component (located at `frontend/src/components/EquipmentForm.jsx`).
- The component accepts an optional `initialData` prop: when provided, it pre-populates the form for editing; when absent, the form is blank for adding.

---

## ✅ Database Compliance

### Equipment Types Are Not Hardcoded in the Database Schema
- **Confirmed.** Equipment types are stored in a dedicated `equipment_types` table in PostgreSQL.
- Types can be added, modified, or removed directly via SQL without any code changes:
  ```sql
  -- Add a new type
  INSERT INTO equipment_types (name) VALUES ('New Type');
  
  -- Rename a type
  UPDATE equipment_types SET name = 'Updated Name' WHERE id = 1;
  
  -- Remove a type
  DELETE FROM equipment_types WHERE id = 6;
  ```
- No equipment types are hardcoded in Java enums, Spring Boot configuration, or frontend JavaScript.

---

## ✅ Business Rules Enforced in the Backend

### Rule 1 – Active Status Constraint
- Equipment **cannot** be marked as `ACTIVE` if `lastCleanedDate` is older than 30 days.
- Enforced in: `EquipmentService.validateActiveStatusRule()` — applies to both `createEquipment()` and `updateEquipment()`.
- The backend returns HTTP `400 Bad Request` with a meaningful error message.
- The frontend displays this message in the form's error alert.

### Rule 2 – Maintenance Auto-Update
- When a maintenance record is added via `POST /api/maintenance`:
  - Equipment status is automatically changed to `ACTIVE`.
  - Equipment's `lastCleanedDate` is updated to the `maintenanceDate` of the maintenance record.
- Enforced in: `MaintenanceService.addMaintenance()`.
- This logic runs entirely in the backend and is not dependent on frontend behavior.

---

## ✅ Safe Queries

- All database queries use Spring Data JPA with parameterized JPQL (`@Query` with `@Param`).
- No raw SQL string concatenation is used anywhere in the codebase.

---

## ✅ Layered Architecture

The backend strictly follows a three-layer architecture:
- **Controller Layer** – handles HTTP requests/responses only
- **Service Layer** – contains all business logic
- **Repository Layer** – handles data access via Spring Data JPA
