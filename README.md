# Biff Lewis Geomatics — Website

Static site built with [Astro](https://astro.build) and TypeScript. No UI framework dependencies.

## Commands

| Command            | Action                                      |
|--------------------|---------------------------------------------|
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Start dev server at `http://localhost:4321` |
| `npm run build`    | Build for production to `./dist/`           |
| `npm run preview`  | Preview the production build locally        |

## Project structure

```
src/
├── assets/gallery/          ← Gallery placeholder SVGs (swap for real photos here)
├── components/
│   ├── CtaBanner.astro      ← Red CTA strip; accepts heading/body/btn1/btn2 props
│   ├── Footer.astro
│   ├── Nav.astro            ← Sticky navbar + accessible mobile menu
│   ├── NavLogo.astro        ← Theodolite SVG logo (header/footer variants)
│   └── TopBar.astro         ← Contact strip above nav
├── layouts/
│   └── Layout.astro         ← Base layout: head, fonts, global CSS, nav, footer
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── services.astro
│   ├── gallery.astro
│   └── contact.astro
└── styles/
    └── global.css           ← Design tokens, shared utilities, all global rules
```

## Adding gallery photos

1. Place real photos in `src/assets/gallery/` (WebP recommended, 800×600 minimum).
2. In `src/pages/gallery.astro`, replace each SVG import at the top with your photo import, keeping the same variable name.
3. Keep gallery images at a 4:3 crop where possible. The gallery is configured with explicit `400×300` slots, lazy loading, responsive `sizes`, and AVIF/WebP output through Astro assets.
4. Run `npm run build` — Astro will optimise and hash the images automatically.
5. Remove the placeholder SVG files once all photos are in place.
## SEO configuration

Set `SITE_URL` to the production domain before building or deploying. This value
is used for canonical URLs, `robots.txt`, and the generated sitemap. The current
fallback is `https://www.blgeomatics.co.za` and should be confirmed before launch.

## Contact form backend

The quote form posts to `/api/quote`, which is routed by `netlify.toml` to the
native Netlify Function in `netlify/functions/quote.mjs`. Netlify was chosen so
the Astro frontend can stay fully static while the form runs as a small
serverless endpoint.

Set these environment variables in Netlify before using the form in production:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key used by the function to send quote request emails through Resend. |
| `QUOTE_REQUEST_TO` | Recipient email address for new quote requests, for example `info@blgeomatics.co.za`. |
| `QUOTE_REQUEST_FROM` | Verified sender address in Resend, for example `Biff Lewis Geomatics <quotes@yourdomain.co.za>`. |

Do not commit real API keys or secrets. Use Netlify environment variables for
production and a local `.env` file for local function testing.

See `HANDOFF.md` for full details on all stubs and next steps.