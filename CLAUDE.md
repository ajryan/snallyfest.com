# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static landing page for **Snallyfest** — a two-day music festival in Frederick, Maryland (August 14–15, 2026). Hosted on GitHub Pages at `snallyfest.com`. No build step; deploy directly from the repo root.

## Stack

Plain HTML / CSS / JavaScript. No framework, no bundler, no dependencies beyond:
- CDNFonts: Death Record · zai Olivetti Lettera 22 Typewriter (loaded via `<link>` in `index.html`)
- Leaflet 1.9.4 (vendored at `assets/vendor/leaflet/`) + CARTO `dark_all` basemap tiles (free with attribution) for the venue map
- `.nojekyll` prevents GitHub Pages from running Jekyll

## Files

| File | Purpose |
|---|---|
| `index.html` | Single-page site — all sections |
| `styles.css` | All styles; CSS custom properties at `:root` |
| `script.js` | Hero clip rotation (`HERO_CLIPS`), gallery lightbox, drag-to-scroll, venue map (Leaflet), Mailchimp signup (JSONP submit) |
| `assets/` | Images (`edward-01..07.jpg`, `fest-2025-01..10.jpg`, `fest-archive-01..19.jpg`, `flyer_2026.png`) + hero clips (`hero-01..03.mp4` — 10 s segments cut from `edward-snallyfest-2025.mp4`, which was removed from the repo but lives in git history) |
| `assets/vendor/leaflet/` | Vendored Leaflet 1.9.4 (`leaflet.js`, `leaflet.css`) |
| `favicon.ico` / `favicon.png` / `apple-touch-icon.png` | Favicons (woodcut eye artwork) — root level |
| `sitemap.xml` / `robots.txt` | SEO — single-URL sitemap; robots points to it |

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

Olivetti Lettera via `fonts.cdnfonts.com` (free personal use; commercial license required).
Pacifico via Google Fonts (free, open source).

Hero title uses `.letter-cap` spans on the first and last letters (`font-size: 1.38em; vertical-align: bottom`) to reproduce the arched S…T size effect from the flyer.

## Sections (top to bottom)

1. **Hero** — full-screen autoplay video background; `hero-01.mp4` always plays first, then `script.js` rotates randomly through the clips in `HERO_CLIPS` (no immediate repeats) with a two-`<video>` crossfade; title uses `.letter-cap` spans on S and T
2. **Flyer** (`#flyer`) — viewport-filling `flyer_2026.png` (100svh, `object-fit: contain` with 1rem inset)
3. **Tickets + Venues** (`#tickets`) — merged section; `#ticket-link` href is a placeholder; separated by `.section-divider`. Below the venue list: `#venue-map`, a Leaflet map with a pin per venue (coordinates hardcoded in `script.js`)
4. **Email signup** (`#signup`) — live Mailchimp form; submits via JSONP in `script.js` (includes hidden honeypot fields — keep them)
5. **Gallery** (`#gallery`) — horizontal scroll strip with lightbox; drag-to-scroll enabled
6. **Footer** (`#footer`) — logo, dates, "presented by" braindead.live link + Instagram icon link

Scroll arrows (`.section-arrow`) appear on: hero, flyer, tickets+venues. No arrows on signup or gallery.

## Things still needing real values

- `#ticket-link` href in `index.html`
- Social link hrefs in the footer (`instagram.com/...`, `facebook.com/...`, etc.)
- Canonical URL and OG image URLs use `https://snallyfest.com/` — update if domain differs

## GitHub Pages deployment

Push to `main` branch. In repo Settings → Pages, set source to **Deploy from a branch** → `main` / `/ (root)`. The `.nojekyll` file is required.

## SEO

`index.html` includes: `<title>`, `<meta name="description">`, `<meta name="keywords">`, Open Graph tags, Twitter Card tags, and a `<script type="application/ld+json">` MusicEvent schema block with the full performer list.
