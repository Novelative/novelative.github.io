# Architecture

## Tech Stack

- Vite
- React
- TypeScript
- Framer Motion
- Lucide React icons
- Site-wide styling in `src/styles.css`

## Source Layout

- `src/App.tsx` owns the application shell, manual route detection, document titles, header/footer, floating actions, and homepage-specific sections.
- `src/components/` owns standalone route pages and shared reusable visual helpers.
- `src/components/shared.tsx` owns reusable animation and route helper primitives such as `ParticleCanvas`, `MotionCard`, `CountdownUnit`, `useCountdown`, and the shared `reveal` variant.
- `src/styles.css` owns global layout, theme variables, route-specific classes, responsive rules, and component presentation.

## Page Component Rule

Do not add new standalone pages directly inside `App.tsx`.

When recreating or adding a page:

1. Create a dedicated component file in `src/components`, for example `src/components/ContactPage.tsx` or `src/components/ReleaseNotesPage.tsx`.
2. Keep page-local data arrays and page-only helper functions in that page file.
3. Put reusable behavior in `src/components/shared.tsx` only when at least two components need it.
4. Import the page into `App.tsx` and update `getCurrentPage()` plus the route switch.
5. Keep legacy route aliases in `getCurrentPage()` when replacing old static `.html` pages.

This rule exists because the site now has multiple recreated pages from the old static website. Keeping pages inline in `App.tsx` makes routing, review, and future edits harder.
