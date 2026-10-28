# Component guidelines

How each part of the Marlowe Rue demo is built, why, and how to reuse it on a client project. Class names follow a light BEM style (`block__element`, `block--modifier`). JavaScript hooks use `data-*` attributes, never class names, so styling can change without breaking behaviour.

Files: `index.html` · `css/styles.css` · `js/main.js` (page behaviour) · `js/booking.js` (booking flow).

---

## Global

### Demo bar — `.demo-bar`
A one-line notice above the header stating the brand and content are fictional. **Remove it on a real client site.** Keep it on any portfolio or pitch demo.

### Buttons — `.btn` + modifier
| Modifier | Use |
|---|---|
| `--primary` | The booking action. One per view. |
| `--secondary` | Second action next to a primary ("Explore treatments"). |
| `--light` | Primary action on bordeaux backgrounds. |
| `--ghost-light` | Back / secondary on bordeaux. |
| `--ghost` | Neutral controls in dialogs. |

Rules: square corners; label says exactly what happens ("Book an appointment", "Send message"); never add arrows or icons to labels; min height 46 px.

### Text link — `.text-link`
Rose-deep, underlined, thicker underline on hover. Also works on `<button>` for in-page actions.

### Tag — `.tag`
Small outlined pill used **only** for honesty labels: "Fictional person", "Example prices", "Demonstration content", "Fictional address". Do not use it for decoration.

### Fields — `.field`
Label above input, error message below (`.field-error`, linked through `aria-describedby` and toggled by `window.MR.validateField`). Errors say how to fix the problem ("Enter an email address like name@example.com."). Validation runs on blur and on submit, then live while a field is invalid.

---

## Header — `.site-header`
- Sticky; gains a hairline (`.is-scrolled`) after 8 px of scroll.
- Wordmark left, five links, primary "Book an appointment" right.
- **Mobile (< 60em):** "Menu" button with `aria-expanded` / `aria-controls`. The panel is full-screen, uses large serif links, traps Tab focus, closes on Escape, on link click, and when resizing to desktop. Focus moves to the first link on open and back to the button on Escape.
- The current section is marked with `aria-current="true"` by an `IntersectionObserver`.

Reuse: keep navigation to 5–6 items. Research showed 21-item carousels and mega-menus hide services; use the page itself and a concern filter instead.

## Hero — `.hero`
- `.hero__masthead`: the brand name as a magazine nameplate (decorative, `aria-hidden`; the real `<h1>` follows).
- `.hero__grid`: photo (7 cols) overlapping the masthead baseline, copy (5 cols) with H1, lead, two CTAs, and three reassurance facts.
- Photo loads eagerly with `fetchpriority="high"` — it is the LCP element.
- One load animation (masthead reveal), disabled under reduced motion and when JS is off.

Reuse: the reassurance facts are where research found the strongest conversion copy (free consultation, cancellation, no pressure). Swap in the client's real policies.

## Treatments — `.treatments`
- **Filter chips** (`[data-filter]`, `aria-pressed`) map to `data-concerns` on each row. An `aria-live` region announces the count; an empty state offers "Show all treatments".
- **Rows** (`.treatment`, `[data-treatment]`): name, one-sentence description, duration, price, "Book this". Desktop hides the row thumbnails and shows one large sticky preview (`[data-preview]`) that follows hover/focus; mobile shows a thumbnail per row.
- Each row's `data-id`, `data-name`, `data-duration`, `data-price` are the **single source of truth** read by the booking flow. Change a price in one place.
- "Book this" links carry `data-book="<id>"`, preselecting the treatment in the booking form.

Reuse: always show a description, a duration and a price signal. Sanjiva's plain list of names was the weakest treatment section in the research.

## About — `.about`
Two overlapping photos, a story, three working principles (`<dl class="principles">`), and the founder. The founder block is explicitly labelled fictional. On a real site, list the practitioner's actual licence and training only after the client confirms them; never invent medical credentials.

## Gallery — `.gallery`
- Six-image asymmetric grid on desktop (6-column CSS grid with explicit placements), 2-column on mobile.
- Each image is a `<button>` that opens a native `<dialog>` lightbox: Previous / Next / Close, arrow keys, Escape, backdrop click; focus returns to the opening image.
- A note states the images are stock and show no results.

Reuse: **before-and-after** only with real, consented client photos and a results-may-vary disclaimer. Never use stock imagery as results.

## Testimonials — `.quotes`
Three large serif-italic quotes with a single bordeaux rule above each. Clearly tagged as demonstration content. On a real site, use verified reviews with source (Google, Yelp) and date, or embed the review platform.

## Pricing — `.pricing`
- Four price groups as hairline lists: name · duration · price.
- Two membership plans (`.plan`, `.plan--featured`). The featured plan inverts to bordeaux.
- Every price block carries an "Example prices" tag in the demo.

## Booking — `.booking`, `js/booking.js`
Four steps (treatment → date & time → details → review) plus a done state.
- Progress list uses `aria-current="step"`; each step is a `<fieldset>` with a `<legend>` and receives focus when shown.
- Dates and times are custom radio groups (`role="radio"`, roving `tabindex`, arrow keys, Home/End). Taken slots are disabled and struck through. Slots only appear if the treatment fits before closing; same-day slots need two hours' notice.
- User input is rendered with `textContent` only.
- A persistent notice says nothing is booked or sent; the final state repeats it.

**Going live:** replace the submit handler with the client's booking provider (Square Appointments, Vagaro, Boulevard, Acuity, Fresha…). Most offer an embed or a booking URL; the simplest robust option is linking each "Book" button to the provider's page for that service and deleting this component.

## FAQ — `.faq`
Native `<details>`/`<summary>`, so it works without JavaScript. Research (Peachy) shows FAQs absorb objections — pain, downtime, cancellation, scope of practice.

## Contact — `.contact`
Address, phone, email, hours table, illustrative SVG map (labelled fictional), Instagram placeholder button, and a validated contact form that does not send. On a real site, embed the real map, link real social accounts, and connect the form to a form service or email endpoint.

## Footer — `.site-footer`
Brand + CTA, navigation, studio details, social placeholders, and legal links (privacy, terms, image credits). Contact details must match the contact section exactly — inconsistent phone numbers appeared on several real sites.

## Mobile booking bar — `.mobile-bar`
Fixed Book / Call bar under 48em, hidden while the booking section is on screen. Taken from Cienega and Seena One; keeps booking one tap away.

## Toast — `[data-toast]`
`window.MR.toast(message)` shows a short status message (`role="status"`). Used for placeholder links and treatment preselection.

---

## Accessibility checklist (applies to every component)
- Landmarks: `header`, `nav` (labelled), `main`, `footer`; one `h1`; headings in order.
- Skip link to `#main`.
- All interactive elements are native buttons/links/inputs; ≥ 44 px targets.
- Visible `:focus-visible` rings on light and dark backgrounds.
- Colour contrast ≥ 4.5 : 1 for text (see `DESIGN_SYSTEM.md`).
- Images: meaningful `alt`; decorative masthead `aria-hidden`.
- Motion: one load animation, all transitions removed under `prefers-reduced-motion`.
- Works without JavaScript: content, prices, FAQ and links are plain HTML. The booking form needs JS (as any real booking widget does).
