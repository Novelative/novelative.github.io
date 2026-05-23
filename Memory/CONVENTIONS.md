# Conventions

## Page Files

- Standalone route pages belong in `src/components`.
- Use PascalCase filenames that match the exported component name, such as `DownloadPage.tsx`, `PurchasePage.tsx`, or `SupportPage.tsx`.
- Keep page-only constants near the top of the page file.
- Keep `App.tsx` route rendering concise. It should import page components rather than containing page markup.

## Shared Components

- Put reusable page primitives in `src/components/shared.tsx`.
- Reuse existing theme variables and CSS classes before adding new abstractions.
- Use Framer Motion patterns already present in the site, especially the shared `reveal` variant and `MotionCard`.

## Styling

- Continue using `src/styles.css` for the website's global and route-specific CSS.
- Add responsive rules when a new page introduces grids, cards, forms, or fixed-format controls.
- Preserve light/dark mode behavior through existing CSS variables.

## Verification

- Run `npm run build` after TypeScript or component changes.
- For visual changes, inspect the local Vite route in the browser or capture a screenshot when practical.
