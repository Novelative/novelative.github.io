# Novelative Website Memory Vault

This memory vault is for the new `novelative.com` React/Vite website.

## Required Workflow

Before changing the website:

1. Read `Memory/ARCHITECTURE.md`.
2. Read `Memory/CONVENTIONS.md`.
3. Search `Memory/changelog/` for prior work related to the route, component, or style area being changed.

After changing the website:

1. Add a dated changelog file in `Memory/changelog/`.
2. Include the files changed, the reason for the change, verification performed, and any known risks.

## Current Architectural Rule

Page routes must be implemented as separate React components in `src/components`. `src/App.tsx` should own the app shell, route selection, header/footer wiring, and homepage sections, but new standalone pages should not be built inline inside `App.tsx`.
