# Task 12 Brief: Dynamic Open Graph (OG) Images

We need to set up a dynamic ImageResponse API endpoint under `/api/og` using `@vercel/og` (or standard Next.js `ImageResponse` from `next/og`) that generates stylized Open Graph cards for social media sharing.

## TDD Plan

### Automated Test Cases
1. **Endpoint Resolution**: A unit test validating that hitting the `/api/og` endpoint returns a response with:
   - Status code `200`
   - Header `Content-Type: image/png`
2. **Dynamic Parameter Parsing**: Verify that passing a custom title (e.g. `?title=Diriyah`) changes the response content (returns successfully) and renders correctly.

---

## Tasks & Proposed Changes

### [Component Name] Dynamic Open Graph Image Generator

#### [NEW] [route.tsx](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/app/api/og/route.tsx)
An API endpoint rendering an SVG canvas wrapped in Next.js' `ImageResponse` to produce clean PNG images dynamically based on URL query params.

#### [NEW] [og-check.js](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/tests/og-check.js)
Unit test script making sure the `ImageResponse` constructs cleanly and returns standard headers.

---

## Verification Plan
- Execute the OG endpoint mock runner checking header and status results.
- Run the production Next.js build to verify image generation routes compile under Edge runtime requirements.
