# Task 11b Brief: Progressive Web App Offline PWA Setup

We need to add offline PWA capabilities to Al-Rawi using `@ducanh2912/next-pwa`. This will ensure that static Draco `.glb` 3D files under `/models/`, core i18n locales, and app components are cached locally for offline tourism usage.

## TDD Plan

### Automated Test Cases
1. **Manifest File Validation**: A test case to verify that `public/manifest.json` exists, is syntactically valid JSON, and specifies all mandatory keys (such as `name`, `short_name`, `start_url`, `display`, and icons).
2. **Service Worker Registration**: Check that the build generates a `sw.js` and `workbox-*.js` bundle in the public directory, confirming that service worker generation is correctly integrated.

---

## Tasks & Proposed Changes

### [Component Name] Progressive Web App Core Setup

#### [NEW] [manifest.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/public/manifest.json)
PWA application manifest containing name, short_name, descriptions, themes, and icon paths.

#### [MODIFY] [next.config.ts](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/next.config.ts)
Wrap our existing Next.js config with the PWA plugin configured to build in production and cache static models.

#### [NEW] [pwa-check.js](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/tests/pwa-check.js)
Unit test script checking manifest existence and JSON integrity.

---

## Verification Plan
- Execute the manifest JSON validation check.
- Compile and build Next.js application to confirm service worker generation under the `public/` directory.
