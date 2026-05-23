# Download Page Font Weight Tuning

**Date:** 2026-05-07
**Agent:** Codex

## Summary

The download page typography was adjusted in response to browser review comments. The bottom hero proof row (`Windows + macOS`, trial, sign-up, purchase text) no longer uses the previous heavy `850` font weight. The `What You Get` summary panel was also softened by reducing the value weight, adding a lighter label weight, and making the panel heading less heavy.

## Files Modified

- `src/styles.css` - Tuned `.download-proof-row`, `.download-summary-panel h2`, `.download-summary-panel dt`, and `.download-summary-panel dd` font weights.
- `Memory/changelog/2026-05-07-download-page-font-weight-tuning.md` - Documented this typography fix.

## Why

The previous font weights made secondary metadata read with the same intensity as primary UI content. These elements are supportive details, so reducing the weights improves hierarchy while preserving the layout and existing content.

## Verification

- Ran `npm run build` successfully.
- Captured a local `/download` screenshot for a quick visual pass.

## Risks

None.
