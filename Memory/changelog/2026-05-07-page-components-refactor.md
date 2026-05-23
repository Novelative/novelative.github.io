# Page Components Refactor

**Date:** 2026-05-07
**Agent:** Codex

## Summary

The new React/Vite website was refactored so standalone route pages are no longer implemented inline inside `src/App.tsx`. The recreated route pages now live in dedicated component files under `src/components`, while `App.tsx` imports and renders them from the route switch.

The refactor added a shared component module for route-level primitives used by multiple pages. `ParticleCanvas`, `MotionCard`, `CountdownUnit`, `useCountdown`, and the shared `reveal` animation variant now live in `src/components/shared.tsx`. The homepage and extracted pages use those shared exports instead of keeping duplicate implementations in the app shell.

The memory vault for the new `novelative.com` website was also created. It documents the rule that future standalone pages must be created as separate components under `src/components` and imported into `App.tsx`, rather than being written directly in `App.tsx`.

## Files Modified

- `src/App.tsx` - Removed inline implementations for the recreated route pages and shared helpers, imported the extracted components, and kept route selection in the app shell.
- `src/components/BlogPage.tsx` - Added the blog route component and its blog-specific helpers.
- `src/components/DownloadPage.tsx` - Added the download route component and page-local download data.
- `src/components/PurchasePage.tsx` - Added the purchase route component and page-local purchase data.
- `src/components/SupportPage.tsx` - Added the support/contact route component and EmailJS form behavior.
- `src/components/StaticPages.tsx` - Added download help, license help, privacy policy, and terms/EULA route components.
- `src/components/shared.tsx` - Added shared route primitives for particles, motion cards, countdowns, and reveal animation.
- `Memory/README.md` - Created the new-site memory workflow and page component rule.
- `Memory/ARCHITECTURE.md` - Documented the Vite/React site structure and page extraction convention.
- `Memory/CONVENTIONS.md` - Documented page file, shared component, styling, and verification conventions.

## Why

The old approach made `App.tsx` responsible for too many route bodies. That made it hard to review page changes, increased merge risk, and encouraged future recreated pages to be added inline. Moving route pages into separate component files keeps `App.tsx` focused on shell and routing concerns while letting each page own its content and local behavior.

## Verification

- Ran `npm run build` successfully after the refactor.

## Risks

The routing system is still a manual `window.location.pathname` switch rather than a router library. Future page additions must update both the `SitePage` union and `getCurrentPage()` aliases in `App.tsx`.
