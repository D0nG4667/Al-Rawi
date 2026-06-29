# Task 15a Brief: High-Fidelity Cinematic Landing Page

We need to implement a premium cinematic landing page at `/` featuring GSAP entrance transitions that routes to our main `/explore` experience. In addition, we will set up the `PersonaSelector` switcher and a geolocation-based spatial refocusing hook `useGeofence`.

## TDD Plan

### Automated Test Cases
1. **Persona State Transition**: A unit test asserting that changing the persona selection state triggers the appropriate store updates (updates active narrator modes).
2. **Geofencing Coordinates Validation**: Verify that coordinates within the historical site bounding boxes trigger spatial panning events successfully.

---

## Tasks & Proposed Changes

### [Component Name] Cinematic Landing Page & Personalizations

#### [NEW] [PersonaSelector.tsx](../../frontend/src/components/ui/PersonaSelector.tsx)
A selector allowing users to switch between Storyteller and Academic guides.

#### [NEW] [useGeofence.ts](../../frontend/src/hooks/useGeofence.ts)
A React hook resolving the browser's geolocation to trigger spatial camera refocusing when entering specific historical geofenced boundaries.

#### [NEW] [landing-check.js](../../frontend/src/tests/landing-check.js)
Unit test verifying geofencing boundary math and persona selection updates.

---

## Verification Plan
- Execute the geolocation and state selection unit test.
- Run Next.js production builds to verify compilation and type conformance.
