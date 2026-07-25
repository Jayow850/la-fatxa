# La Fatxa — Premium Handbag Storefront

A WhatsApp-first e-commerce site: the website does 100% of the selling (full product detail, a size-finder tool, quiet scarcity cues), and every "Order" button opens WhatsApp with a pre-filled message so Fatxa just confirms the sale. No payment gateway by design.

Two important design decisions:
- **Stock numbers are private.** Customers only ever see "Almost gone" or nothing — the real counts are visible only to Fatxa in her Studio. Scarcity stays believable because it only appears when true.
- **The admin is hidden, not linked.** Fatxa reaches her Studio by typing /admin in the address bar. No customer will ever stumble into it.

## Folder structure

```
la-fatxa/
├── app/
│   ├── page.jsx              Home (hero, new arrivals, best sellers, reviews, newsletter)
│   ├── layout.jsx            Root layout (nav, footer, floating WhatsApp button)
│   ├── globals.css           Brand tokens, buttons, animations
│   ├── shop/                 Catalog with instant category + price filtering
│   ├── product/[id]/         Product detail page (the selling engine)
│   ├── size-guide/           Standalone shareable "Find Your Size" tool
│   ├── story/                Fatxa's story
│   ├── faq/                  Pre-answers every DM question
│   └── admin/                Fatxa's Studio — hidden full editor (type /admin in the URL; never linked on the site)
├── components/
│   ├── Nav.jsx, Footer.jsx, WhatsAppFloat.jsx
│   ├── ProductCard.jsx       Card with live stock badge + swatches
│   ├── StockBadge.jsx        "Only 2 left in Camel" / "Sold out" logic
│   ├── SizeTool.jsx          3-question quiz → visual scale → recommendations
│   └── ScaleSvg.jsx          Bag vs iPhone/laptop/bottle/notebook comparison
├── lib/
│   ├── data.js               Seed catalog (10 bags), reviews, FAQs
│   ├── supabase.js           DB client (falls back to seed data if unconfigured)
│   └── wa.js                 WhatsApp deep-link builders
├── supabase/schema.sql       Database schema + row-level security
└── .env.example              Environment variables to fill in
```

## Quick start (runs immediately, no database needed)

```bash
npm install
cp .env.example .env.local     # then edit it — see below
npm run dev                    # → http://localhost:3000
```

The site runs fully on the built-in seed catalog until you connect Supabase. The only thing you MUST change before launch:

**`NEXT_PUBLIC_WA_NUMBER`** in `.env.local` — Fatxa's WhatsApp number as country code + number, no `+` or spaces (e.g. `254712345678`). Every order button on the site uses this.

## Connecting Supabase (live stock + admin)

1. Create a free project at supabase.com
2. SQL Editor → paste and run `supabase/schema.sql`
3. Table editor → insert your products and variants (mirror the shape in `lib/data.js`)
4. Storage → create a **public** bucket named `bags`, upload product photos, paste each photo's public URL into the product's `image_url`
5. Authentication → Add user → create Fatxa's login (email + password)
6. Settings → API → copy the URL and anon key into `.env.local`
7. Restart the dev server. `/admin` now signs in with Fatxa's login and stock edits write to the database, appearing on the live site within a minute.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repository
2. vercel.com → New Project → import the repo
3. Add the three `NEXT_PUBLIC_*` environment variables in the Vercel project settings
4. Deploy. Done — share `your-site.vercel.app/size-guide` with anyone who asks "which bag fits my stuff?"

## Replacing the placeholder visuals

Products currently show emoji stand-ins. Set `image_url` on each product (and optionally per variant) to a real photo URL and the cards, PDP gallery, and hero pick them up automatically. Shoot on a warm neutral background — the whole premium feel depends on photo quality more than anything in this code.



## About the demo vs this project

The interactive in-chat demo is the **reference implementation** — it shows the final look and the full, powerful Fatxa's Studio dashboard (editable hero, story, ticker, trust badges, FAQ, category show/hide/reorder/add, per-color photos, and an overview with graphs). This Next.js project mirrors the storefront exactly (including the mobile 2-column grid, clickable color swatches that swap images, and hidden stock numbers) and ships the same data model — every product has per-color `image` fields and there is an editable `defaultSettings` object in `lib/data.js` driving hero/story/ticker/FAQ/categories.

The `/admin` page in this project persists product + stock edits to Supabase. To bring the demo's full content-editing tabs (Website content, Categories) into the deployed app, wire `defaultSettings` to a Supabase `settings` table (a single JSON row) and render each storefront section from it — the demo's `ContentEditor` and `CategoryEditor` components are the blueprint to copy. I've kept the storefront reading from `defaultSettings` so the wiring is a drop-in.

## Notes

- No payment integration, deliberately: the WhatsApp deep link IS the checkout.
- Stock states ("Only 2 left", "Sold out") trigger automatically from the numbers — no manual flags.
- The admin page runs in demo mode (non-persistent) until Supabase is configured, so you can preview it right away.
