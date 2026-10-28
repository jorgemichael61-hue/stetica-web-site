# Design system — Marlowe Rue (demonstration brand)

> **Marlowe Rue is a fictional brand** created for this demonstration website. It does not represent a real clinic, and the name was checked against web search on 28 Oct 2026 without finding an existing skin studio using it.

The tokens below live in `css/styles.css` under `:root`. Change them there; never hard-code colours or font sizes in components.

## 1. Brand

| | |
|---|---|
| **Name** | Marlowe Rue |
| **Descriptor** | Skin Atelier |
| **Tagline** | Skin care that listens first. |
| **Positioning** | An independent, esthetician-led skin studio (not a medical practice). Unhurried appointments, published prices, no upselling. Sits between the warmth of an independent esthetician and the polish of a city med spa. |
| **Personality** | Calm · precise · warm but never sugary · quietly confident |
| **Voice** | Plain sentences, second person, sentence case. Explains what happens in an appointment rather than promising outcomes. No exclamation marks, no "transform", no "flawless". |

### Wordmark
Set in **Bodoni Moda**, high optical size, regular weight, with tight tracking (`-0.02em`). The "&" is never used; the name is always two words. The descriptor "Skin Atelier" sits beneath or beside it in Hanken Grotesk at small size.
- In the header: wordmark at 1.5 rem.
- In the hero: the wordmark becomes the masthead — set across the full content width like a fashion-magazine nameplate. This is the brand's single bold move (see §6).
- Favicon: monogram "M" in Bodoni on bordeaux (`assets/favicon.svg`).

## 2. Colour

Chosen to avoid the two defaults of this category: beige-and-gold spa, and pink "girly" med spa. Porcelain is a cool, faintly rosy white (not cream); bordeaux gives luxury depth and replaces black.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--porcelain` | `#F5F0EE` | Page background | — |
| `--mist` | `#E9DCD8` | Alternate section background, inputs, image fallback | — |
| `--bordeaux` | `#4A1E2A` | Primary buttons, dark sections, headings accent | 12.3 : 1 on porcelain |
| `--ink` | `#26161A` | Body text | 15.3 : 1 on porcelain |
| `--muted` | `#6E5A5E` | Secondary text, captions | 5.65 : 1 on porcelain, 4.77 : 1 on mist |
| `--rose` | `#B5837C` | Hairlines, decorative details on light | decorative only |
| `--rose-deep` | `#8E5149` | Links / small accent text on light | 5.43 : 1 on porcelain |
| `--champagne` | `#D9C4A3` | Accent text and focus ring on bordeaux | 8.19 : 1 on bordeaux |

Rules
- Text is always `--ink`, `--bordeaux`, `--muted` or `--rose-deep` on light, `--porcelain` or `--champagne` on bordeaux.
- `--rose` is never used for text on light backgrounds (fails contrast).
- No gradients. Depth comes from photography and from the porcelain → mist → bordeaux sequence.
- One dark (bordeaux) section per page area at most: the booking section and the footer.

## 3. Typography

| Role | Family | Settings |
|---|---|---|
| Display (masthead, H1–H3, prices, quotes) | **Bodoni Moda** variable (opsz 6–96, wght 400–900) | weight 400–500, high optical size for large sizes, tracking `-0.02em` |
| Text (body, UI, labels, buttons) | **Hanken Grotesk** variable (wght 100–900) | 400 body, 500 UI, 600 buttons |

Why: a modern Bodoni is the typography of American beauty editorial — it signals fashion and precision without the overused Cormorant/Playfair look. Hanken Grotesk is a neutral, warm grotesk that stays legible at small sizes on phones. Both are SIL Open Font License; licences are in `assets/fonts/`.

Fonts are **self-hosted** (WOFF, Latin subset, `font-display: swap`) — no request to Google's servers, and no layout shift beyond the swap.

### Scale (fluid, ~1.25 ratio)

| Token | Size | Use |
|---|---|---|
| `--step--1` | 0.83 → 0.875 rem | captions, notes, labels |
| `--step-0` | 1 → 1.0625 rem | body |
| `--step-1` | 1.2 → 1.33 rem | lead paragraphs, card titles |
| `--step-2` | 1.44 → 1.78 rem | H3 |
| `--step-3` | 1.73 → 2.37 rem | H2 |
| `--step-4` | 2.07 → 3.16 rem | H1 |
| `--masthead` | 3.5 → 11.5 rem (vw-based) | hero nameplate only |

- Body line-height 1.6; headings 1.1. Measure capped at `65ch` for body copy.
- Labels are **sentence case**, never tracked-out capitals.
- Emphasis inside headlines is not used; hierarchy comes from size and weight.

## 4. Space, shape and lines

- Spacing scale (`--space-3xs` … `--space-3xl`) is fluid and based on the body size; sections use `--space-2xl` top/bottom.
- Content width `--wrap: 76rem`; text columns `65ch`.
- **Radius:** `0` for photographs and sections (editorial), `2px` for inputs, `999px` only for the small filter chips and time-slot pills. Cards are not rounded boxes — treatments are rows separated by hairlines.
- **Lines:** 1 px hairlines in `--line` (rose at 45 % opacity) separate list rows; this is the main structural device.
- **Shadows:** none, except the sticky header's 1 px bottom line once scrolled.

## 5. Buttons and controls

| Variant | Look | Use |
|---|---|---|
| Primary | Bordeaux fill, porcelain text, square corners, 600 weight | "Book an appointment", form submit — one per view |
| Secondary | 1 px bordeaux outline, transparent | "Explore treatments", alternate actions |
| Text link | Rose-deep, underline offset 0.2em, thicker on hover | inline links, "Book this" in rows |
| On dark | Champagne fill, bordeaux text | primary action inside the bordeaux booking section |

All controls ≥ 44 × 44 px tap area. Focus ring: 2 px solid `--bordeaux` (on light) or `--champagne` (on dark) with 3 px offset, always visible with `:focus-visible`.

## 6. The one bold move

The hero masthead: "Marlowe Rue" set in Bodoni at up to ~11 rem across the full width, with the hero photograph placed beneath and slightly overlapping the baseline. Everything else stays quiet — hairline lists, generous whitespace, no decorative motion. The only orchestrated motion is the masthead's one-time load reveal (disabled under `prefers-reduced-motion`).

## 7. Photography direction

- **Subjects:** hands at work, skin in close-up, calm treatment moments, textures (cream, stone, linen). Faces shown resting, eyes closed — the client's experience, not a model's pose.
- **Light & colour:** soft, warm daylight; skin tones and neutrals that sit naturally beside porcelain and bordeaux. Avoid blue-cast clinical shots, neon, and heavy retouching.
- **Crops:** tall portrait crops (4:5, 3:4) for editorial pacing; one wide crop maximum per section.
- **Honesty:** every stock image is captioned or labelled as stock; no image is presented as a client, a result, or the studio's own room.
- **Source in this demo:** free photographs from Unsplash (Unsplash License), loaded from `images.unsplash.com` with responsive `srcset`. Credits are listed in `docs/IMAGE_CREDITS.md`. For a client project, replace them with the client's own photography.

## 8. Motion

- Durations: 150 ms (hover/focus), 300 ms (panels, menu), 700 ms (single masthead reveal).
- Easing: `cubic-bezier(.2,.7,.2,1)`.
- Motion only responds to user actions (menu, filters, booking steps) apart from the masthead reveal. No scroll-triggered fades.
- `prefers-reduced-motion: reduce` removes all transitions and the reveal.
