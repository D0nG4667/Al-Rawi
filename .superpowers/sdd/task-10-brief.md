# Task 10 Brief: Multilingual & RTL Support (i18n)

We need to implement seamless switching between English (LTR) and Arabic (RTL) locales using `next-intl` in the Next.js App Router framework.

## TDD Plan

### Automated Test Cases
1. **Locales Match Configuration**: We will write a unit test to verify that the `en` and `ar` keys in the translation files match exactly, preventing missing translation key errors.
2. **Middleware Routing**: Verify that accessing `/` automatically detects and redirects to the preferred locale (defaulting to `/en` or `/ar` based on headers), and prefixing all pages correctly.
3. **Document Direction**: Verify that the HTML `dir` attribute is correctly set to `rtl` when the active locale is `ar`, and `ltr` when the active locale is `en`.

---

## Tasks & Proposed Changes

### [Component Name] next-intl Core Infrastructure

#### [NEW] [en.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/messages/en.json)
English localized strings mapping.

#### [NEW] [ar.json](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/messages/ar.json)
Arabic localized strings mapping.

#### [NEW] [i18n.ts](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/i18n/request.ts)
Configuration loader to request current translation bundle based on context.

#### [NEW] [middleware.ts](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/middleware.ts)
Next.js middleware to inspect headers and route incoming requests under the active locale.

#### [MODIFY] [layout.tsx](file:///c:/Users/hp/Desktop/gab/git%20projects/Al-Rawi/frontend/src/app/[locale]/layout.tsx)
Wrap layout using routing locale context, set `dir={locale === 'ar' ? 'rtl' : 'ltr'}` and `lang={locale}`.

---

## Verification Plan

- Run unit checks validating locale translation keys parity.
- Execute Next.js build verification to ensure Turbopack type-checks all route parameters under dynamic segments.
