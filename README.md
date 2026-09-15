# nivro

Bright, honest electronics retail — Audio & Headphones, Laptops & Computers,
Smartphones, TV & Video, Cameras & Photography, Smart Home, Gaming, Wearables
and Accessories. UK-based, operated by **RYE FLOUR COOKIES LTD**.

## Stack

- Next.js 16 (App Router) · React 19
- TypeScript · Tailwind CSS v4 (CSS-first config)
- Prisma · Neon Postgres
- next-intl (i18n)
- Framer Motion, lucide-react, tailwind-merge

## Development

```bash
npm install
npm run dev            # starts on http://localhost:3000
npm run build          # prisma generate + next build
npm run lint
```

## Design system

All colours, spacing, radii, and typography live as design tokens in
`src/styles/variables.css` and are exposed to Tailwind through the `@theme`
block in `src/styles/globals.css`. Do not hardcode hex values in components —
reach for the tokens (`bg-primary`, `text-ink`, `border-line`, `font-display`,
`font-mono`, ...).

The aesthetic is **clean light retail**: bright, airy, high-trust storefront
with clean white surfaces, a trustworthy azure primary (`#1E6BE6`), a fresh
teal secondary (`#0FB5A6`) and coral (`#F0453A`) reserved for deals & urgency.
Deep navy `#111826` is used for utility strips and the footer.

## Company

- **CHANGE IT UP SERVICES LTD** (Company No. 16107295)
- 14 Broadway, Nottingham, NG1 1PS, United Kingdom
- Email: info@ultrasensskin.com

# dropskin
# ultrasensskins
