# Design research — US beauty & aesthetics websites

Research date: 28 October 2026
Purpose: identify the patterns that make leading US med spa, esthetician and day-spa websites effective, so they can inform an original design system (see `DESIGN_SYSTEM.md`) and a reusable skill (`skills/aesthetics-web-design/SKILL.md`).

## How the research was done (and its limits)

- Every site below was retrieved live on 28 Oct 2026 through a web-fetch tool that returns the page's **HTML converted to text** (headings, links, button labels, image alt text, metadata).
- A real browser was **not available** in this session (the Chrome extension was not connected), so no screenshots were taken and computed styles were not readable. **Fonts, exact colours, spacing and animations could not be verified for any site**, and no finding below makes claims about them.
- Findings therefore cover structure, information architecture, copy tone, calls to action, pricing, trust signals and visible quality issues. Visual-language recommendations in the design system are the author's own reasoning, labelled as such.
- Some home pages were not reachable directly; where noted, an official sub-page of the same domain was inspected instead.
- Nothing here copies text, logos or layouts. Short quotes (under 15 words) are used only where the exact wording is the finding.

## Sites inspected

| # | Site | Page actually inspected | Business type |
|---|------|------------------------|---------------|
| 1 | Peachy | peachystudio.com/pages/west-soho-botox (location page; home page not reachable) | Neurotoxin studio chain, 6 cities |
| 2 | SKINNEY Medspa | skinneymedspa.com (home) | Multi-location NYC med spa |
| 3 | UPKEEP | upkeepmedspa.com (home) | Med spa, NYC & Dallas, 7 locations |
| 4 | Cienega Medical | cienegaspa.com (home) | Dermatologist-led med spa, 3 LA clinics |
| 5 | Mirabile M.D. | mirabilemd.com (home) | Physician-led med spa, Overland Park KS |
| 6 | Med Spa at Seena One | medspaatseenaone.com (home; `seenaone.com` resolves to this business) | Physician-led med spa, Burleson TX |
| 7 | Sanjiva Medical Spa | sanjivamedspa.com/clinical-skincare/ (home not reachable) | Med spa, Dallas TX |
| 8 | Spa Belles | spabelles.com (home) | NYC day spa & nail salon |
| 9 | SKINBYGABBY | skinbygabby.com (home) | Independent esthetician, Upland CA |
| 10 | Willow Med Spa | willowmedspa.com (home) | Med spa & salon (Webflow build) |

No additional sites were added: the ten leads already span the four segments the brief asked about (multi-location med spa, physician-led clinic, independent esthetician, day spa).

---

## Site-by-site findings

### 1. Peachy (location page)
- **Structure:** promo bar (referral offer) → header → breadcrumb → location hero (address, phone, hours, *Book Now* + *Directions*) → intro → two service cards → three value pillars → video testimonials → nearby studios → ~25-item FAQ → studio directory → newsletter → footer.
- **Pricing:** the clearest of the set — two flat-fee services with prices on the card, plus a stated product surcharge. "Transparent prices. Flat fee." is used as a value proposition.
- **Trust:** provider credential (board-certified nurse practitioners), annual treatment volume, FDA-approved products, client video testimonials with "client since" dates.
- **Tone:** short, confident headings with emphasis on one phrase; "no pressure" and "natural look" are recurring reassurances.
- **What works:** price certainty removes the biggest booking anxiety; a long FAQ handles objections (pain, downtime, safety) without cluttering the page; every service card has its own *Book Now*.

### 2. SKINNEY Medspa
- **Structure:** header → hero with three CTAs (*Free Consultation*, *Existing Client*, *Shop Treatments*) → press logo strip (10 outlets) → six featured treatments → memberships (2 tiers) → shop with "from" prices → founders' story → reviews → stats band → products → new-client offer with booking form → financing logos & locations → footer.
- **Pricing & offers:** membership tiers with monthly price; discounted "from" prices; new-client percentage offer with expiry date; three financing partners.
- **Trust:** dense — press logos, "years in business", treatment-count claims, named founders with training history.
- **Quality issues observed:** membership block duplicated in the source; location lists disagree between header, hero and footer; one treatment links to the wrong page.
- **What works:** splitting the hero CTA into *new* vs *existing* client shortens the path for both. **What to avoid:** promotional density and inconsistent data erode the premium feel.

### 3. UPKEEP
- **Structure:** full-width image hero with a positioning line and three CTAs → results teaser → eight service cards (category, name, description, some starting prices) → testimonials → 7 location cards → "As seen in" press names → blog (3 posts) → closing CTA → newsletter → footer.
- **Pattern:** every H2 has a short eyebrow line above it; sections end with a single "View all …" link — a consistent rhythm.
- **Pricing:** per-unit starting prices on cards; a plain-language note on card surcharges.
- **Trust:** press, location count, founding year, complimentary consultation, women-owned statement, accessibility notice in the footer.
- **Booking:** all CTAs (*Schedule Your Visit*, *Book Now*, *Book Your Visit*) go to one third-party booking widget.
- **What works:** a distinct brand voice ("not your mother's med spa") positions it against clinical competitors; consistent section rhythm; pricing honesty.

### 4. Cienega Medical
- **Structure:** header (Book Now, phone, *My Appointments*) → hero naming the board-certified medical director → highlights → company facts (hours, founded, review count) → image band with stats → six concern-led service categories → **staff grid with 13 named headshots and titles** → "why choose us" checklist → three verified Google reviews → three location cards (each with *Book in [City]*) → social proof → newsletter → footer with **sticky mobile Book / Call bar**.
- **Policies as selling points:** free consultations, no cancellation fees, free parking, upfront pricing.
- **What works:** the strongest trust architecture of the set — a named, credentialed medical lead in the hero, a visible team, verified review labels, and practical reassurance (parking, cancellation). The sticky mobile bar keeps booking one tap away.

### 5. Mirabile M.D.
- **Structure:** location top bar → header (*Book Now*, *Call Us*) → hero ("art of natural enhancement" positioning) → four pillars → four service categories → visit-us block with hours → Google review carousel (4.9 average) → "not sure which treatment?" consultation prompt → footer.
- **Navigation idea worth adopting:** a **Treatment Finder** menu that lists ~15 *concern-based* pages (acne scars, wrinkles…) alongside the usual service-based menu. Clients think in concerns, not device names.
- **Quality issues observed:** a review counter displaying "0" beside visible reviews; inconsistent phone extensions; seven differently-worded booking CTAs.
- **What works:** concern-led entry point; the "not sure?" consultation prompt captures undecided visitors.

### 6. Med Spa at Seena One
- **Structure:** header (address, phone, review links, *Request an Appointment*) → hero focused on physician-led care and bilingual providers → medical director profile with credential bullets → four trust stats → five category cards → **before-and-after pairs** for named treatments → five Google reviews → visit block listing served towns → footer with accessibility tools panel and a persistent Call / Appointments bar.
- **Tone:** formal and clinical.
- **What works:** medical leadership presented before services; before-and-after shown in a dedicated section close to the booking CTA; local-SEO list of served towns.
- **What to avoid for a luxury brand:** exclamation-marked CTAs ("Request An Appointment Today!") and heavy clinical framing feel less premium.

### 7. Sanjiva Medical Spa (skin care page)
- **Structure:** top bar with first-time offer and phone → nav → hero with *Our Treatments* + *Watch Our Video* → Google review widget (295 reviews) → six services as plain text links → consultation form → footer.
- **Quality issues observed:** services listed without descriptions, images or prices; navigation repeated several times in the markup; two different phone numbers; footer copyright two years old.
- **Lesson:** a review widget cannot compensate for thin treatment content. Each treatment needs a description, duration and price signal.

### 8. Spa Belles
- **Structure:** header with cart and search → "elevated beauty & wellness" hero with *Learn More* → intro → nail art → gift cards → events → services → locations → contact → Instagram → newsletter → footer with hours and policy links.
- **Quality issues observed:** **no booking CTA anywhere on the home page**; an unfinished builder message ("needs a storage option") is visible in the newsletter block; gift cards link off-domain; an outdated COVID-19 nav item.
- **Lesson:** the most important conversion action must exist and be visible; launch checklists must catch builder placeholder text.

### 9. SKINBYGABBY
- **Structure:** header with *Book Appointment* → award banner → "skin coach" hero with *View Transformations* → practitioner intro → award statement → four attributed reviews (Yelp/Google) → ten services with one-line descriptions → coaching programme promo → closing *Book an Appointment* → footer with newsletter, address, email.
- **What works:** the independent-esthetician model sells **the person** — a nickname-level personal brand, awards, and a coaching programme that creates recurring revenue.
- **Quality issues observed:** the same unfinished newsletter builder message; uppercase letter-spaced headings throughout; empty meta description; copyright year four years old.

### 10. Willow Med Spa
- **Structure:** nav → hero ("radiate confidence") with *Book Here* → welcome with three link cards (one is "Ready to Book?") → experience section → partner brand logos → 21-item services carousel → **three-step "How it works"** → ingredient checker tool → curated products → newsletter → footer.
- **What works:** a simple numbered booking explanation; partner skincare brands as borrowed trust; an interactive tool (ingredient checker) that gives visitors a reason to return.
- **Quality issues observed:** service tile alt text contains a template leftover; a 21-item carousel hides most services behind pagination; no provider names.

---

## Cross-site patterns

### What effective sites consistently do
1. **Book CTA in three places minimum:** header, hero, and repeated at decision points (each treatment, each location, closing section). Best practice adds a **sticky mobile Book/Call bar** (Cienega, Seena One).
2. **Lead with reassurance, not technology:** "natural", "no pressure", "complimentary consultation", "upfront pricing", "no cancellation fees" appear repeatedly. These reduce first-visit anxiety.
3. **Credentialed people up front** (Cienega, Seena One, Peachy): named lead practitioner + credential in or near the hero; a team grid with titles.
4. **Transparent pricing differentiates** (Peachy, UPKEEP). Most med spas hide prices; the ones that publish them make it a selling point.
5. **Two entry routes into services:** by *treatment category* and by *skin concern* (Mirabile's Treatment Finder; Cienega's "Let's fix it…").
6. **Consistent section rhythm:** short label → H2 → content → one "view all" link (UPKEEP).
7. **Memberships and referral offers** create recurring revenue (SKINNEY, Peachy, SKINBYGABBY's coaching).
8. **Location blocks are practical:** address, hours, phone, directions, booking link per location; parking info where relevant.
9. **FAQ handles objections** (pain, downtime, safety, results timing) — Peachy's is the most complete.

### Common failures (things the skill should prevent)
- Inconsistent facts across a page (phone numbers, locations, extensions) — 4 of 10 sites.
- Builder placeholder text left live — 2 of 10 sites.
- Missing or buried booking CTA — 1 of 10 sites (Spa Belles).
- Services listed with no description, image or price signal (Sanjiva).
- Template leftovers in image alt text (Willow); empty meta descriptions (SKINBYGABBY).
- Counters that show "0" beside real reviews (Mirabile).
- Many slightly different CTA labels for the same action (Mirabile: seven variants).
- Stale copyright years and outdated nav items (COVID-19 page).

### Segment differences
| Segment | Leads with | Tone | Example |
|---|---|---|---|
| Multi-location med spa | Positioning line, locations, press | Confident, playful | UPKEEP, SKINNEY |
| Physician-led clinic | Medical director + credentials | Formal, clinical | Seena One, Mirabile, Cienega |
| Independent esthetician | The practitioner as a personal brand, awards | Personal, coaching | SKINBYGABBY |
| Day spa | Experience & relaxation, gift cards | Warm, aspirational | Spa Belles, Willow |
| Single-treatment studio | Flat price, one clear service | Direct, reassuring | Peachy |

## Decisions taken for the demonstration brand

Based on the evidence above (visual choices are the author's reasoning, since visuals could not be inspected):

| Decision | Evidence |
|---|---|
| Book CTA in header, hero, every treatment, pricing, closing, plus sticky mobile bar | Cienega, Seena One, Peachy |
| Prices and durations shown on every treatment | Peachy, UPKEEP; Sanjiva as the counter-example |
| Concern filter on the treatments section | Mirabile Treatment Finder, Cienega "Let's fix it…" |
| Named lead esthetician near the story, with honest (fictional) credentials | Cienega, Seena One, SKINBYGABBY |
| One booking verb used everywhere ("Book an appointment" / "Book this") | Mirabile's seven variants as the counter-example |
| Policies as reassurance (complimentary consultation, cancellation terms) | Cienega, UPKEEP |
| Membership options in pricing | SKINNEY, Peachy (referral), SKINBYGABBY |
| Three-step booking flow explained and built | Willow "How it works" |
| No before-and-after photos | Real B&A images require consented client photos; stock imagery would be a fabricated result claim |
| Explicit "demonstration" labelling on prices, testimonials, people and location | Brief requirement; avoids the trust failures above |
| Single source of truth for contact details | 4 of 10 sites had conflicting facts |
