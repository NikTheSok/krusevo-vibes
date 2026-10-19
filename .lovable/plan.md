# New WhenInKrusevo tab icon

- Design a simple square "WIK" logo in the festival colours (deep forest green with a warm accent, a small mountain peak hint), made to stay readable at tiny tab size.
- Use it as the browser tab icon on every page, and remove the old default icon so it never shows again.
- Check it in the preview at tab size.

## Technical notes
- Generate with imagegen (premium), downscale to 64x64 into `public/favicon.png`.
- Point the icon link in `src/routes/__root.tsx` to `/favicon.png`; delete `public/favicon.ico`.
