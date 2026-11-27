# Foothills Amish Furniture: static demo (Astro)

A working demo of the redesign. It uses the design system in `src/styles/tokens.css`, `components.css`, and the demo additions in `demo.css`. Every page carries `<meta name="robots" content="noindex,nofollow">`. Tracking IDs are placeholders and do not fire.

```
npm install
npm run build      # -> dist/foothills-demo/  (base /foothills-demo)
npm run serve      # http://localhost:4321/foothills-demo/  (HTTP/1.1)
                   # https://localhost:4322/foothills-demo/ (HTTP/2, self-signed, local only)
```

Requires Node `>=22.23.4`. Internal links go through `import.meta.env.BASE_URL` via `withBase()`.

## Pages (same URL paths as Shopify)
| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/collections/dining-benches` | `src/pages/collections/[handle].astro` (filters: builder, wood, room, plus instant search in `public/collection.js`) |
| `/products/<handle>` (37 benches) | `src/pages/products/[handle].astro` ("Request info on this piece" leads to the short form `#contact_form`) |
| `/pages/contact-us` | `src/pages/pages/contact-us.astro` (hours, today's status, map facade, DIRECTIONS, form `#contact-us-page`) |
| `/pages/book` | `src/pages/pages/book.astro` (two-step flow: Cabinetry or Furniture, then a person; each person has a click-to-load calendar facade) |
| `/pages/our-team` | `src/pages/pages/our-team.astro` (live roster from foothillsamishfurniture.com/pages/our-team) |
| `/collections` | `src/pages/collections/index.astro` (rooms index) |
| `/collections/<handle>` (47: 5 rooms + 42 sub-collections, the live mega-menu paths) | `src/pages/collections/[handle].astro` (generic template: category chips, Category/Builder/Wood/Room facets, instant search; a small real sample per collection) |
| `/products/<handle>` (355 sample products) | `src/pages/products/[handle].astro` (Product JSON-LD from `src/data/ld.ts`) |
| `/pages/cabinetry-page` | `src/pages/pages/cabinetry-page.astro` (Landrum + Charleston, series, team) |
| `/pages/21st-anniversary-sale` | `src/pages/pages/21st-anniversary-sale.astro` (SaleEvent JSON-LD) |
| `/pages/<handle>` (story, why, services, craftsmanship, reviews, careers, customize, species, finishes, hardware, upholstery, poly colors, live edge, FAQ, shipping, financing, care, policies, privacy, terms, six Landrum pages, Greenville/Spartanburg/Asheville) | `src/pages/pages/[handle].astro` driven by `src/data/pagecfg.ts`, `src/data/pages.json` and `src/data/local.ts` |
| `/sitemap`, `/sitemap.xml` | `src/pages/sitemap.astro`, `src/pages/sitemap.xml.ts` (from `src/data/routes.ts`) |

## Booking rules
Appointments are one hour, booked at least 24 hours ahead, with a one-hour buffer between appointments. Showroom hours are Monday–Saturday, 10 a.m. to 5 p.m. Eastern. The demo calendar placeholder (`public/booking-embed-placeholder.html`) enforces the same rules and uses no real Google calendars.

Cabinetry appointments are with Lauren Manzin or Michael Holladay. Furniture sales (Landrum) are with Lexi Wertheim, Savannah Russel or Kyra Yoder. Each facade has a `data-person` attribute and a clearly marked `CALENDAR_URLS` placeholder in `book.astro`. On the live site, confirmations go to the person who was booked. No other confirmation recipient has been named.

## Lead routing
Contact and product-inquiry forms are inert in the demo (they validate and push `generate_lead` to a local `dataLayer`, but never submit). On the live site, those leads are emailed to `travis@foothillsamish.com` and a text is sent to the store phone, (864) 457-2400. Code comments in the forms, in `src/data/site.ts` (`LEAD`), and in `public/site.js` record this. Email signup stays on Omnisend only.

## Podium
Podium never auto-opens, including on phones. Below 1024px the bottom bar's Text button is the only Text entry (the floating "Text us" facade is hidden). The widget script is not on the page at load; it would be injected only after a tap, and in the demo it is not injected at all.

## Data
- `src/data/benches.json`: built from the Shopify capture (`foothills-migration/raw/prod_*.json`). The collection contains Bench products tagged Dining Room. Wood comes from "Pictured in …" in the description.
- `src/data/site.ts`: address, phone, hours (America/New_York), reviews (verbatim from /pages/reviews-testimonials) and builder notes (from product copy).
- `src/data/team.ts`: names, titles, bios and photographs taken from the live Our Team page on 2026-11-17. Nothing is invented. Photos are 4:5 crops of the official portraits, optimized to JPEG sources; Astro/sharp emits AVIF and WebP srcsets at build time.
- Trust copy comes from the captured pages: shipping-delivery, our-policies (warranty), and our-story (Judson & Pat; "real people, not a phone tree").

## Imagery
Selected shots from `/workspace/foothills-demo-photos/` (March 2026 web-size frames, larger showroom/lifestyle stills, and six kitchen/cabinetry raw masters) are cropped to the design-system ratios, given a light warm-neutral grade (no heavy filters), and stored as mid-size JPEGs under `src/assets/img/` (sources cap around 2400–2880px wide). Originals and raw masters are not committed. Astro's `<Picture>` (sharp) builds AVIF/WebP srcsets. The brass faucet close-up (master 028) is a small 3:2 inset on the home cabinetry band. The sage cabinetry still (master 018) is a small inset on the booking cabinetry intro, sized so it does not compete with the forest accent color. There are no masters for the storefront or the living-room hero; the contact/visit hero stays the 1800px `store-exterior.jpg` sign shot, and the home hero stays the 2500×1668 living-room showroom photograph. See the PR for slot-by-slot sources.

## Performance standard
- Fonts: Fraunces and Inter are self-hosted variable woff2 files (latin subset) in `public/fonts/`, with `font-display: swap`, both preloaded, and metric matched fallbacks. No Google Fonts requests. The SIL Open Font License for each font ships beside it (`OFL-Fraunces.txt`, `OFL-Inter.txt`).
- Favicon: `public/favicon.svg` (171 bytes).
- Images: `src/components/Img.astro` builds AVIF and WebP srcsets with `sizes`, width and height, `decoding="async"`, lazy loading below the fold, and eager loading with `fetchpriority="high"` for the hero. The `<img>` fallback is WebP (no JPEG copies are built). Logos are 264px WebP with `decoding="async"`.
- Target: Lighthouse mobile 95+ performance, 100 accessibility and best practices, CLS 0. SEO scores 66 only because every page is intentionally `noindex,nofollow`.

## Tags: all inert
Slots sit where they live today: `lptm.js` and Omnisend in `<head>`, the GTM noscript at the start of `<body>`, and the load-deferred GTM, Meta Pixel and NEXSTAR at the end of `<body>`. They are HTML comments with placeholder IDs. Podium is a click facade that only shows a toast in the demo. Constant Contact, the on.aws beacon, Sentry, GemPages and Elfsight are gone.

## Tools
- `tools/build_catalog.py`: read-only fetch of public collection `products.json` → `src/data/catalog.json` + `src/assets/products/*.jpg` (8 per sub-collection, 24 per room)
- `tools/build_pages.py`: captured live page HTML → `src/data/pages.json`
- `tools/linkcheck.py`: internal links, noindex on every page, no live external scripts
- `tools/shoot.cjs`: screenshots at 390 and 1440 → `screens/`
- `tools/interact.cjs`: smoke test (filters, search, form, facades, zero external requests)
- `tools/lh.sh`: Lighthouse mobile → `lighthouse/` (`PAGES="name=/path …" ORIGIN=… tools/lh.sh tag`)
