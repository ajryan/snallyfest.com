# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static site for **Snallyfest** — a music festival in Frederick, Maryland. Hosted on GitHub Pages at `snallyfest.com`. No build step; deploy directly from the repo root.

The 2026 fest (August 14–15, 2026) is **over**. The site is now two pages: a minimal single-viewport front page, and the full 2026 event page preserved as an archive.

## Stack

Plain HTML / CSS / JavaScript. No framework, no bundler, no dependencies beyond:
- zai Olivetti Lettera 22 Typewriter (self-hosted at `assets/fonts/`, `@font-face` in `styles.css`) · Pacifico (Google Fonts)
- Leaflet 1.9.4 (vendored at `assets/vendor/leaflet/`) + CARTO `dark_all` basemap tiles (free with attribution) for the venue map
- `.nojekyll` prevents GitHub Pages from running Jekyll

## Files

| File | Purpose |
|---|---|
| `index.html` | Front page — single viewport (no scroll): eye-art background, logo + location, email signup, link to the 2026 archive |
| `snallyfest-2026.html` | Preserved 2026 event page (was the original `index.html`) — hero video, flyer, t-shirt, venues, gallery, footer. All ticket links removed. |
| `styles.css` | All styles for both pages; CSS custom properties at `:root` |
| `script.js` | Hero clip rotation (`HERO_CLIPS`), gallery lightbox, drag-to-scroll, venue map (Leaflet), Mailchimp signup (JSONP submit) |
| `assets/` | Images (`edward-01..07.jpg`, `fest-2025-01..10.jpg`, `fest-archive-01..19.jpg`, `flyer_2026.png`/`.webp`, `shirt-front/back.png`/`.webp`) + hero clips (`hero-01..17.mp4` — ≤10 s h264 segments: 01–03 cut from `edward-snallyfest-2025.mp4`, 04–17 from phone .movs; raw sources removed from the repo, 01–03's source lives in git history). PNGs that have a `.webp` sibling are served via `<picture>` (WebP + PNG fallback); the PNG stays as the OG/Twitter meta image for social-crawler compatibility. |
| `assets/fonts/` | Self-hosted Olivetti Lettera 22 (`.woff2` + `.woff` fallback) |
| `assets/vendor/leaflet/` | Vendored Leaflet 1.9.4 (`leaflet.js`, `leaflet.css`) |
| `favicon.ico` / `favicon.png` / `apple-touch-icon.png` | Favicons (woodcut eye artwork) — root level |
| `sitemap.xml` / `robots.txt` | SEO — lists both pages; robots points to the sitemap |

## Key design tokens (CSS custom properties)

```
--bg: #111213           dark background
--bg-alt: #181a1c       alternate section background
--blue: #9dd8ec         powder blue (from flyer) — primary accent
--pink: #e89880         salmon/pink (from flyer) — secondary accent
--text: #ede8e0         off-white body text
--text-muted: #7a7672   muted/secondary text
```

## Fonts

| Font | CSS family name | Usage |
|---|---|---|
| Olivetti Lettera 22 | `'zai Olivetti Lettera 22 Typewriter'` | Primary — all headings, body, buttons, venues |
| Pacifico | `'Pacifico'` | Secondary — hero dates/location, section subtitles |

Olivetti Lettera is self-hosted at `assets/fonts/` (`@font-face` in `styles.css`, `font-display: swap`) — originally sourced from `fonts.cdnfonts.com` (free personal use; commercial license required).
Pacifico via Google Fonts (free, open source).

The Snallyfest wordmark, dates, and location are pre-rendered images (`assets/logo.png`, `dates.png`, `location.png`), not live text.

## Front page (`index.html`)

One `.eye-hero` section sized to exactly one viewport (`min-height: 100svh`, no scrolling at normal window sizes). Layers: `.eye-hero-bg` (the woodcut eye from `apple-touch-icon.png`, blurred + centered), `.eye-hero-overlay` (radial darkening gradient), then `.eye-hero-content`.

`.eye-hero-content` layout differs by breakpoint — **both paths matter, check both when editing**:
- **≥601px** — CSS grid, `grid-template-columns: minmax(0, 1fr)` / `grid-template-rows: 1fr auto 1fr`. The equal `1fr` rows put the signup's midpoint at exactly 50% height, centered over the eye, regardless of brand-block height. The explicit column is required — an implicit `auto` column sizes to content and parks left. `.eye-hero-bottom` is `position: absolute` here: CTA bottom-left, "presented by" bottom-right, baseline-aligned.
- **≤600px** — flex column, `space-between`; `.eye-hero-bottom` goes `static` and stacks the CTA above the credit.

The signup form is horizontal (wrapping) on desktop and a column on mobile. **The mobile rule must keep `flex-wrap: nowrap`** — wrapping in a column flex container wraps along the *cross* axis, spilling fields into a second column off the right edge whenever the viewport is short enough to compress the block.

## 2026 archive page sections (`snallyfest-2026.html`, top to bottom)

1. **Hero** — full-screen autoplay video background; `hero-01.mp4` always plays first, then `script.js` rotates randomly through the clips in `HERO_CLIPS` (no immediate repeats) with a two-`<video>` crossfade
2. **Flyer** (`#flyer`) — viewport-filling `flyer_2026.png` (100svh, `object-fit: contain` with 1rem inset)
3. **T-shirt** (`#tickets`) — "SNALLYFEST 2026 T-SHIRT"; just the layered front/back shirt images (`.shirt-stack` inside `.shirt-stack-solo`)
4. **Venues** (`#venues`) — venue list plus `#venue-map`, a Leaflet map with a pin per venue (coordinates hardcoded in `script.js`)
5. **Gallery** (`#gallery`) — horizontal scroll strip with lightbox; drag-to-scroll enabled
6. **Footer** (`#footer`) — logo, dates, "presented by" braindead.live link + Instagram icon link

All ticket links (`buytickets.at`, `#ticket-link`, JSON-LD `offers`) were removed when the fest ended — don't reintroduce them. The email signup lives only on the front page now.

Scroll arrows (`.section-arrow`) appear on: hero, flyer, t-shirt, venues. No arrow on gallery.

## Things still needing real values

- Social link hrefs in the footer (`instagram.com/...`, `facebook.com/...`, etc.)
- Canonical URL and OG image URLs use `https://snallyfest.com/` — update if domain differs

## GitHub Pages deployment

Push to `main` branch. In repo Settings → Pages, set source to **Deploy from a branch** → `main` / `/ (root)`. The `.nojekyll` file is required.

### Cache busting — bump this when you edit CSS/JS

GitHub Pages serves `styles.css` and `script.js` with a long cache lifetime, so returning visitors get the stale file and a broken-looking layout until they hard-refresh. There is no build step to hash filenames, so the version is a manual query string:

```html
<link rel="stylesheet" href="styles.css?v=2" />
<script src="script.js?v=2"></script>
```

**After changing `styles.css` or `script.js`, bump `?v=` in _both_ `index.html` and `snallyfest-2026.html`** (keep the two pages on the same number). Same convention applies to changed images — see `flyer_2026.png?v=3`. Editing a file without bumping means the change won't reach anyone who has already visited.

## SEO

Both pages include: `<title>`, `<meta name="description">`, `<meta name="keywords">`, Open Graph tags, and Twitter Card tags. `snallyfest-2026.html` additionally carries the `<script type="application/ld+json">` MusicEvent schema block with the full performer list (the `offers` array was dropped with the ticket links).
