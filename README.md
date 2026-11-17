# Foothills Amish Furniture: static demo (Astro)

A working demo of the redesign that uses the design system in `/workspace/foothills-design` (`src/styles/tokens.css`, `components.css`, and the demo additions in `demo.css`). It is not deployed, and every page carries `<meta name="robots" content="noindex,nofollow">`.

```
npm install
npm run build      # -> dist/
npm run serve      # http://localhost:4321 (HTTP/1.1) and https://localhost:4322 (HTTP/2, self-signed, local only)
```

## Pages (same URL paths as Shopify)
| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/collections/dining-benches` | `src/pages/collections/[handle].astro` (filters: builder, wood, room, plus instant search in `public/collection.js`) |
| `/products/<handle>` (37 benches) | `src/pages/products/[handle].astro` ("Request info on this piece" leads to the short form `#contact_form`) |
| `/pages/contact-us` | `src/pages/pages/contact-us.astro` (hours, today's status, map facade, DIRECTIONS, form `#contact-us-page`) |
| `/pages/book` | `src/pages/pages/book.astro` (Google Calendar appointment embed behind a click-to-load facade; the demo loads `public/booking-embed-placeholder.html`) |

## Data
- `src/data/benches.json`: built from the Shopify capture (`foothills-migration/raw/prod_*.json`). The collection contains Bench products tagged Dining Room. Wood comes from "Pictured in …" in the description.
- `src/data/site.ts`: address, phone, hours (America/New_York), reviews (verbatim from /pages/reviews-testimonials) and builder notes (from product copy).
- Trust copy comes from the captured pages: shipping-delivery, our-policies (warranty), and our-story (Judson & Pat; "real people, not a phone tree"). Gilligan does not appear in any captured page, so the team teaser names Judson, Pat and Trip, who is named in reviews.

## Tags: all inert
Slots sit where they live today: `lptm.js` and Omnisend in `<head>`, the GTM noscript at the start of `<body>`, and the load-deferred GTM, Meta Pixel and NEXSTAR at the end of `<body>`. They are HTML comments with placeholder IDs. Podium is a click facade that only shows a toast in the demo. Constant Contact, the on.aws beacon, Sentry, GemPages and Elfsight are gone. Forms validate and push `generate_lead` to a local `dataLayer`, but they never submit.

## Tools
- `tools/shoot.cjs`: screenshots at 390 and 1440 → `screens/`
- `tools/interact.cjs`: smoke test (filters, search, form, facades, zero external requests)
- `tools/lh.sh`: Lighthouse mobile → `lighthouse/`
