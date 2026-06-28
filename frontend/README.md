# Al-Rawi Frontend: Core Workspace

This is the Next.js 16 core workspace for the Al-Rawi Saudi Heritage & Tourism AI Oracle application.

## Architecture Overview

The workspace implements a **split-layer rendering architecture**:
1. **WebGL Layer (z-index 0)**: A fixed React Three Fiber (`@react-three/fiber` and `@react-three/drei`) canvas running behind the DOM. It loads compressed Draco GLTF/GLB models dynamically.
2. **DOM Layer (z-index 10)**: A container overlay hosting semantic components, guide personalizations, and form interfaces.
3. **State Management**: Global coordination is powered by a synchronized Zustand store (`useUIStore`) to coordinate camera coordinates, loading states, and viewport target nodes.

---

## Key Design Patterns

### 1. Extensible Artifact Factory
Historical media types (Mind Maps, Audio files, PDFs, 3D highlights) are resolved and rendered dynamically via the `ArtifactFactory` component pattern, keeping display panels Open-Closed Principle (OCP) compliant.

### 2. WebGL Context Recovery
The 3D Scene (`Scene.tsx`) attaches event listeners to capture `webglcontextlost` and `webglcontextrestored`, dynamically overlaying recovery loading UI banners and resetting geometries.

### 3. Geofencing Coordinates
The custom hook `useGeofence.ts` resolves user geolocation coordinates, matching bounds against UNESCO historical sites to automatically refocus viewports.

---

## Local Environment Config

Create `frontend/.env.local` with the following variables:

```env
# Public donation links
NEXT_PUBLIC_DONATION_LINK=https://sociabuzz.com/gabcares/support

# Upstash Serverless Redis REST Config
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# Neon Auth Configuration
NEON_AUTH_BASE_URL=your_neon_auth_base_url
NEON_AUTH_COOKIE_SECRET=your_32_character_cookie_secret
NEXT_PUBLIC_NEON_AUTH_URL=http://localhost:3000/api/auth

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Development Scripts

```bash
# Run local dev server (Next.js Turbopack)
pnpm dev

# Check code formatting and lints (Biome)
pnpm lint
pnpm format

# Build production optimized client bundles
pnpm build
```

---

## License

This software is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) license. 

Portions of this project are part of the Al-Rawi national tourism archives initiative. 
Author & Maintainer: Gabriel Okundaye and the Al-Rawi Development Team.
