# Task 11 Brief: Edge Rate Limiting (DDoS Protection)

We need to implement API protection to limit requests to `/api/` endpoints (such as our chat or ingestion features) using `@upstash/ratelimit` and `@upstash/redis` in our Next.js 16 Proxy layer (`proxy.ts`).

## TDD Plan

### Automated Test Cases
1. **Ratelimit Headers**: A test case to verify that requests to protected endpoints return rate-limiting headers:
   - `x-ratelimit-limit`
   - `x-ratelimit-remaining`
   - `x-ratelimit-reset`
2. **Abuse Block (429 HTTP Code)**: Simulate a burst of requests exceeding the configured limit to confirm the proxy blocks subsequent calls with HTTP Status `429 Too Many Requests`.
3. **Excluded Paths**: Verify that static pages and public assets (under locales or images/models) are NOT rate limited by the proxy.

---

## Tasks & Proposed Changes

### [Component Name] Upstash Rate Limiting Proxy Setup

#### [MODIFY] [proxy.ts](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/proxy.ts)
Check incoming request pathnames. If the path matches `/api/chat` or `/api/request-document`, use Upstash Redis and Upstash Ratelimit to validate requests based on IP. If limited, return a `429` JSON response.

#### [NEW] [ratelimit-check.js](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/tests/ratelimit-check.js)
Unit test script utilizing standard mock request/response contexts to verify the rate limiting logic under proxy.ts.

---

## Verification Plan
- Execute the mock proxy test runner validating header presence and 429 response structures.
- Compile and build Next.js application to verify there are no bundling or Turbopack errors.
