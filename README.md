# stetica-web-site — Marlowe Rue (demonstration)

A reference website for US beauty and aesthetics businesses, built for a **fictional** skin studio, **Marlowe Rue Skin Atelier**. It comes with the research and design documentation behind it and a reusable Claude Code skill for future client projects.

> Marlowe Rue does not exist. Prices, people, testimonials, the address and the phone number (a 555 number reserved for fiction) are examples. Photographs are Unsplash stock images and do not show clients, staff, premises or results.

## Run it locally

Requirements: Node.js 18 or newer. There are no dependencies to install.

```bash
npm run dev        # serves the site at http://localhost:4173
npm run check      # link/anchor/id/image/label/meta checks + JS syntax check
```

You can also open `index.html` directly in a browser, or publish the folder as-is on GitHub Pages, Netlify or any static host.

Optional browser test (needs Python Playwright):

```bash
pip install playwright && playwright install chromium
npm run dev                         # in one terminal
python3 scripts/smoke-test.py       # in another
```

## What's in the repository

| Path | What it is |
|---|---|
| `index.html` | The one-page site: header, hero, treatments (with concern filter), about, gallery + lightbox, testimonials, pricing & memberships, 4-step demo booking, FAQ, contact, footer |
| `privacy.html`, `terms.html`, `credits.html` | Placeholder legal pages and image credits |
| `css/styles.css` | All styles; design tokens at the top |
| `js/main.js` | Navigation, mobile menu, filters, lightbox, forms, toasts |
| `js/booking.js` | Demo booking flow (nothing is sent anywhere) |
| `assets/fonts/` | Self-hosted Bodoni Moda + Hanken Grotesk (SIL OFL, licences included) |
| `design-research.md` | Findings from 10 US aesthetics websites |
| `DESIGN_SYSTEM.md` | Brand, colour, type, spacing, photography, motion |
| `COMPONENT_GUIDELINES.md` | How each component works and how to reuse it |
| `skills/aesthetics-web-design/SKILL.md` | The reusable design skill |
| `.claude/skills/aesthetics-web-design/SKILL.md` | Same skill, where Claude Code loads project skills |
| `docs/IMAGE_CREDITS.md` | Photo sources and licence |
| `scripts/` | Dev server, static checks, browser smoke test |

## Using the design skill

The skill is a **project skill**: Claude Code picks it up automatically when working inside this repository. To use it elsewhere, copy `skills/aesthetics-web-design/` into another project's `.claude/skills/`, or into `~/.claude/skills/` to have it in every project. After editing the skill, run `npm run sync-skill` to update the `.claude` copy (`npm run check` fails if they differ).

## Turning this into a client site

1. Replace tokens in `css/styles.css` (colours, fonts) following `DESIGN_SYSTEM.md`.
2. Replace content: treatments (`data-*` attributes hold name, duration and price), prices, story, people, FAQ, contact details.
3. Replace stock photos with the client's own photography.
4. Connect booking to the client's provider (see `COMPONENT_GUIDELINES.md` → Booking) and the contact form to a form service.
5. Remove the demo bar, demo tags and `noindex`; write real privacy and terms pages.
6. Run `npm run check` and the smoke test.
