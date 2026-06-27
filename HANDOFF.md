# Handoff — Phase 1 Architecture & Migration

This document records every stub, placeholder, and judgment call left by the first agent (architecture/migration) for the second agent (form backend, image optimisation, SEO).

---

## Stubs left for the second agent

### 1. Contact form serverless endpoint

**File:** `src/pages/contact.astro`, `<script>` block near the bottom.

**Location of stub:**
```ts
// TODO: wire serverless endpoint
// Replace the block below with a real fetch when the backend is ready:
//
//   const payload = new FormData(form);
//   const res = await fetch('/api/quote', { method: 'POST', body: payload });
//   if (!res.ok) { /* handle error */ return; }
```

**Current behaviour:** Client-side validation runs (required fields: Full Name, Phone, Email, Survey Type). If validation passes, the form is hidden and a success `<div>` is shown. No network call is made.

**What the second agent needs to do:**
- Choose a serverless provider (Netlify Functions, Vercel, Cloudflare Workers, Resend, etc.)
- Replace the stub with a `fetch()` POST call to the chosen endpoint
- Handle loading state (disable the submit button while pending)
- Handle network/server errors gracefully (show an error message, do not hide the form)
- Update `astro.config.mjs` if a server adapter is needed (currently static output)

---

### 2. Gallery placeholder images

**Files:** `src/assets/gallery/*.svg` (9 files)

All gallery thumbnails are survey-diagram SVGs that stand in for real project photographs. The import block in `src/pages/gallery.astro` is clearly labelled:

```ts
// TODO (next agent): replace each SVG import below with the corresponding
// real photo. Keep the same variable name so the GalleryItem array needs
// no other changes. Recommended format: WebP, 800×600 minimum.
import imgBoundary1 from '../assets/gallery/residential-boundary.svg';
// ... (8 more)
```

Swap imports; `astro build` will process and hash the new files automatically.

**Tuning to complete:** After swapping to real images, configure `<Image>` props in the gallery (format, quality, sizes, loading strategy). The `width={400} height={300}` values on each `<Image>` are set for the SVG placeholders and will need updating to match the real photo dimensions.

---

### 3. SEO artifacts

The following were intentionally left out per the brief:

- **OG / social meta tags** — not present on any page
- **Sitemap** (`@astrojs/sitemap`)
- **robots.txt**
- **JSON-LD structured data** (LocalBusiness schema)

All five pages carry their original `<title>` and `<meta name="description">` / `<meta name="keywords">` exactly as in the legacy HTML. The second agent adds on top of these.

---

## Judgment calls made in Phase 1

### Internal URL scheme
Legacy HTML used `.html` extensions (`about.html`, `services.html`, etc.). These were changed to clean paths (`/about`, `/services`, etc.) using `build.format: 'file'` and `trailingSlash: 'never'` in `astro.config.mjs`. Redirect rules for old `.html` URLs are not set — the second agent should add them if the site is being relaunched at an existing domain.

### Lightbox implementation
Switched from a custom `<div>` overlay to the native `<dialog>` element (`showModal()` / `close()`). This provides built-in focus trapping, Esc-to-close, and proper `::backdrop` — without requiring extra JS. The `::backdrop` replaces the old `.lightbox` background overlay. Visual result is identical.

### FAQ buttons
The original FAQ used `<div class="faq-q" onclick="...">`. Replaced with `<button type="button">` elements with `aria-expanded` toggled by a typed `<script>`. The original `open` CSS class toggle is preserved.

### About/services process steps
The numbered step lists (`<div class="p-step">`) were converted to `<ol>` + `<li>` for semantic correctness without any visual change.

### CtaBanner contact-page slot
The contact page CTA has a phone SVG icon in button 1 and a WhatsApp link as button 2 — different from the generic two-button pattern on all other pages. Handled via a named `<slot name="buttons">` in `CtaBanner.astro`.

### Client lists on about page
The "Who We Work With" pills contained `&amp;` entities. In the Astro template these are rendered via `<Fragment set:html={name} />` to preserve the HTML entity rendering.

### Google Fonts
Still loaded via the `<link>` preconnect + stylesheet pattern (same as legacy). The second agent may want to self-host them for better performance and privacy.

### No `node_modules` in git
Add a `.gitignore` if not already present. Minimum content:
```
node_modules/
dist/
.astro/
```
