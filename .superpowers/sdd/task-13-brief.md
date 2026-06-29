# Task 13 Brief: "Request Document" UI Form

We need to implement a glassmorphic "Request Document" input form where users can submit direct public URLs (PDFs, UNESCO dossiers, etc.) to request heritage archive ingestion. The form will hit our API `POST /api/request-document`.

## TDD Plan

### Automated Test Cases
1. **Validation Checks**: A unit test ensuring input validations:
   - Must not be empty.
   - Must be a valid URL string.
   - Shows feedback validation warnings on invalid inputs.
2. **Submit Integration**: Verify that clicking submit correctly fires a POST request to `/api/request-document` with the URL payload, and handles standard Success/Error callback responses.

---

## Tasks & Proposed Changes

### [Component Name] Ingestion Request Form UI

#### [NEW] [DocumentRequestForm.tsx](../../frontend/src/components/ui/DocumentRequestForm.tsx)
A glassmorphic form component containing an input field, submit state loaders, validation indicators, and feedback messages.

#### [MODIFY] [page.tsx](../../frontend/src/app/[locale]/page.tsx)
Render the new `DocumentRequestForm` component inside the Left panel (Archive Ingestion section) to replace the static drag-and-drop skeleton.

#### [NEW] [form-check.js](../../frontend/src/tests/form-check.js)
Unit test script asserting input validation rules and submission callback payload formats.

---

## Verification Plan
- Execute the form validation unit test ensuring strict validation constraints.
- Run Next.js production builds to verify component type-checking and bundling.
