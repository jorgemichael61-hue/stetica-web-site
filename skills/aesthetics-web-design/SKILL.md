---
name: aesthetics-web-design
description: Design and build premium US-style websites for beauty and aesthetics businesses (med spas, estheticians, skin studios, day spas, beauty clinics). Use when planning, designing, building or reviewing a website, landing page or redesign for any skincare, facial, med spa or beauty client.
---

# Aesthetics website design

A working method for websites that look bespoke and convert, distilled from a structural review of ten US aesthetics websites (see `design-research.md` in the stetica-web-site repository) and the Marlowe Rue reference build in that repository (`index.html`, `DESIGN_SYSTEM.md`, `COMPONENT_GUIDELINES.md`).

Note on evidence: the research inspected page structure, copy, CTAs, pricing and trust signals. Visual properties (fonts, colours, motion) of those sites were **not** verified, so the visual guidance below is reasoned design practice, not measured data.

## 1. Start from the business, not a template

Before any visual work, answer these in writing:

1. **Segment** — which one is it? It changes what leads the page.

   | Segment | Lead with | Voice |
   |---|---|---|
   | Physician-led med spa | Medical director, credentials, safety | Calm, clinical, precise |
   | Multi-location med spa | Positioning line, locations, press | Confident, modern |
   | Independent esthetician | The person: story, awards, approach | Personal, warm |
   | Day spa | Experience, rituals, gift cards | Sensory, relaxed |
   | Single-treatment studio | One service, flat price | Direct, reassuring |

2. **Primary action** — almost always "book". Name the booking provider (Square, Vagaro, Boulevard, Acuity, Fresha, Mindbody, Phorest, PatientNow) and how booking will work: embed, link per service, or request form.
3. **Real assets** — practitioner names and licences, real photos, real reviews, real prices, policies (cancellation, deposits, consultations). Anything missing is marked as a placeholder, never invented.
4. **Legal scope** — esthetics vs medical. Never imply medical qualifications or results the client does not have.

## 2. Page structure that converts

Default order for a one-page or home page (adapt, don't copy blindly):

1. Header — wordmark, ≤ 6 links, persistent **Book** button.
2. Hero — one strong image, headline in the brand's voice, primary + secondary CTA, 2–4 **reassurance facts** (free consultation, cancellation terms, no pressure, parking).
3. Treatments — with description, duration and price (or "from" price) for each, plus a **concern filter** ("dullness", "texture"…). Clients think in concerns, not device names.
4. About / people — named practitioner with verifiable credentials; team grid if more than one.
5. Proof — reviews with source, press, awards; before-and-after only with real consented photos.
6. Pricing & memberships — transparency is a differentiator in this market.
7. Booking — embedded or explained step by step ("How it works" in 3 steps).
8. FAQ — pain, downtime, preparation, cancellation, scope of practice.
9. Contact — address, map, hours, phone, email, parking.
10. Footer — repeat contact details exactly, legal links.
11. Mobile — sticky **Book / Call** bar.

Booking CTA appears in: header, hero, every treatment, pricing, closing section, mobile bar. Use **one verb** for it everywhere.

## 3. Visual identity

### Choose a palette with a reason
- Pick 5–6 named colours: a background, an alternate background, a deep brand colour that replaces black, text, a muted text colour, and one accent.
- Avoid the two category defaults (beige + gold spa; pastel pink "girly" med spa) unless the client's brand demands them. Look at the client's materials, interior, product packaging and city for the palette instead.
- Verify contrast: body text ≥ 4.5 : 1, large text ≥ 3 : 1. Document ratios in the design system.
- No gradients for decoration. Depth comes from photography and from changing section backgrounds.

### Choose type deliberately
- One expressive display face + one quiet text face, clearly different. Example from the reference build: Bodoni Moda (fashion-editorial) + Hanken Grotesk.
- Avoid the reflex picks for this category (Cormorant Garamond, Playfair Display + Montserrat/Poppins) unless there is a specific reason.
- Fluid type scale (~1.25 ratio) with `clamp()`. Body 16–17 px, line-height 1.6, measure ≤ 65–75 characters.
- Sentence-case labels. No tracked-out capitals over every heading; no single italic word inside headlines as decoration.
- Self-host fonts (WOFF2/WOFF, subset, `font-display: swap`) for privacy and speed.

### Spend boldness in one place
Choose **one** memorable move and keep everything else quiet. Examples: an oversized wordmark masthead (reference build), a single full-bleed video, a distinctive photo crop system, a signature colour block. Then: hairlines, whitespace, restrained motion.

### Shape and structure
- Use structure that carries meaning: hairline-separated lists for treatments and prices read like a printed spa menu and feel more premium than a grid of identical rounded cards.
- Pick radii by role (photos square, chips round), not one radius for everything.
- Numbered markers only for real sequences (booking steps).

## 4. Photography

- **Subjects:** hands at work, skin close-ups, calm treatment moments, textures, the actual rooms.
- **Light:** soft and warm; skin tones and neutrals that sit with the palette. Avoid blue clinical casts and heavy retouching.
- **Crops:** portrait (4:5, 3:4) for an editorial rhythm; set `aspect-ratio` + `object-fit: cover` so mixed sources stay consistent.
- **Honesty:** stock is mood, never results or "our clients". Caption or label it. Real before-and-after needs consent, same lighting/angle, and a "results vary" note.
- **Delivery:** responsive `srcset`/`sizes`, explicit `width`/`height`, `loading="lazy"` except the hero (`fetchpriority="high"`), and a CSS fallback background so a failed image never shows a broken icon.
- **Sources:** the client's own shoot first; otherwise permitted stock (Unsplash License, Pexels License) with a credits page. Never Unsplash+ / premium images without a licence.

## 5. Treatments and pricing

- Each treatment: name · one plain sentence of what happens · duration · price · "Book this".
- Add a concern filter with `aria-pressed` chips and an `aria-live` count.
- Price lists: grouped (facials, peels, body, add-ons), name · duration · price, prices right-aligned in the display face.
- Memberships: 2–3 plans max, one featured; list concrete inclusions, not adjectives.
- Keep one source of truth for each price (data attributes or a data file) — conflicting numbers were a common failure in the research.

## 6. Booking and conversion

- If a provider exists: link each "Book" button to that service's booking URL, or embed the provider widget in a dedicated section. Don't rebuild what the provider does.
- If no provider exists (demo or early stage): build a clear step flow (treatment → date & time → details → review) and say plainly that nothing is booked or sent. Never fake confirmation emails.
- Reduce anxiety near every CTA: consultation, cancellation, deposit, parking, duration.
- Split "new client" / "existing client" paths when the provider supports it.
- Forms: labels above fields, errors that explain the fix, validation on blur and submit, `autocomplete` attributes, `inputmode` for phone.

## 7. Mobile

- Design the 390 px layout first for hero, treatments and booking — most traffic in this sector is mobile.
- Sticky Book / Call bar (hide it while the booking section is visible).
- Full-screen menu with large links; focus trap; Escape to close.
- Horizontal date strips and slot pills with ≥ 44 px targets.
- Check that no element causes horizontal scroll (`scrollWidth === innerWidth`).

## 8. Reusable components

Build as plain, composable blocks (see `COMPONENT_GUIDELINES.md`): header, hero, treatment row, filter chips, price list, plan, booking steps, FAQ (`<details>`), contact block, footer, mobile bar, toast. Hooks in `data-*` attributes; styles via BEM-like classes; tokens in `:root`. A new client = new tokens + new content, same components.

## 9. Accessibility and performance (non-negotiable)

- Semantic landmarks, one `h1`, ordered headings, skip link, labelled nav.
- Native controls; custom radio groups need `role="radio"`, roving `tabindex` and arrow keys.
- Visible `:focus-visible` on light and dark backgrounds.
- `prefers-reduced-motion` removes animation.
- No layout shift: image dimensions, font preload, `font-display: swap`.
- No framework unless the project needs one; a brochure site should ship < 100 KB of CSS + JS.
- Run a link/anchor/alt/label check before delivery (`scripts/check.mjs` in the reference repo).

## 10. Avoid the generic AI look

Before building, write the plan (palette, type, layout sketch, the one bold move) and ask: *would I produce this same plan for any other beauty client?* If yes, change it. Common tells to avoid:

- Cream background + serif + terracotta accent by default.
- Identical rounded cards with soft shadows for every content type.
- ALL-CAPS tracked eyebrows over every heading; "01 / 02 / 03" on non-sequences.
- Fade-up-on-scroll for every section; hover lifts on every card.
- Arrows appended to every link; middot-joined meta strings everywhere.
- Copy like "Unlock your glow", "Transform your skin", "flawless results", exclamation marks.

Write copy in plain, specific sentences that say what happens in the appointment.

## 11. Launch checklist (from real failures seen in research)

- [ ] Booking CTA visible in header and hero; works on mobile.
- [ ] Phone, address and hours identical everywhere on the site.
- [ ] No builder placeholder text ("needs a storage option", lorem ipsum).
- [ ] No counters showing "0", no template text in alt attributes.
- [ ] Meta title and description written; current copyright year.
- [ ] No outdated nav items (old promotions, COVID pages).
- [ ] Every treatment has description + duration + price signal.
- [ ] Reviews, credentials and results are real and verifiable — or clearly labelled as placeholders.
- [ ] Images load, have alt text, and are licensed; credits page present.
- [ ] Keyboard-only run-through of menu, filters, booking and forms.

## 12. Adapting to other businesses

| Business | Change |
|---|---|
| Physician-led med spa | Add medical director block in/near hero, credentials, FDA-cleared device names, consultation-first CTA, before-and-after (consented), financing. Cooler, cleaner palette. |
| Injectables studio | One or two flat-priced services, long FAQ (safety, downtime), provider credentials, referral offer. |
| Independent esthetician | Personal story and portrait up front, awards, Instagram feed, booking link per service, coaching or membership upsell. |
| Day spa / wellness | Rituals and packages, gift cards prominently, warmer palette, slower imagery, group/event bookings. |
| Multi-location brand | Location chooser before booking, per-location pages (address, hours, parking, map, book link), consistent data source. |
| Lash / brow / nail studio | Gallery-led (real work), price menu by service, fills/maintenance timing, policy on late arrivals. |

## How to install this skill

This file is a **project skill**, not a globally installed one.
- In the stetica-web-site repository, Claude Code loads the copy at `.claude/skills/aesthetics-web-design/SKILL.md` (kept identical to `skills/aesthetics-web-design/SKILL.md`; run `npm run sync-skill` after editing).
- To use it in other projects, copy the `aesthetics-web-design` folder into that project's `.claude/skills/`, or into `~/.claude/skills/` for all projects on your computer.
