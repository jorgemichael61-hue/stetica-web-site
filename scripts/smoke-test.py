"""Browser smoke test for the Marlowe Rue demo (optional; needs Python Playwright).

    pip install playwright && playwright install chromium
    npm run dev            # in another terminal
    python3 scripts/smoke-test.py [base_url]

Exercises navigation, the mobile menu, treatment filters, the booking flow,
the contact form, the gallery lightbox and placeholder links, and checks for
console errors and horizontal overflow at common screen widths.
"""
import sys
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/"
results = []


def check(name, cond):
    results.append((name, bool(cond)))
    print(("PASS " if cond else "FAIL ") + name)


def is_remote_image_noise(msg):
    # Remote photos may be blocked in sandboxes/CI; that's handled by the fallback, not a page error.
    return "images.unsplash.com" in msg or "Failed to load resource" in msg


with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---------- Responsive overflow at common widths ----------
    for w, h in [(320, 640), (390, 844), (768, 1024), (1024, 768), (1440, 900), (1920, 1080)]:
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto(BASE, wait_until="load")
        sw = page.evaluate("document.documentElement.scrollWidth")
        check(f"no horizontal overflow at {w}px (scrollWidth={sw})", sw <= w)
        page.close()

    # ---------- Desktop interactions ----------
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: m.type == "error" and not is_remote_image_noise(m.text) and errors.append(m.text))
    page.goto(BASE, wait_until="load")

    check("one h1", page.locator("h1").count() == 1)
    for target in ["#treatments", "#about", "#gallery", "#contact", "#book", "#pricing"]:
        check(f"anchor {target} exists", page.locator(target).count() == 1)

    # nav link scrolls to section
    page.click('.primary-nav a[href="#gallery"]')
    page.wait_for_timeout(900)
    top = page.evaluate("document.getElementById('gallery').getBoundingClientRect().top")
    check("nav link scrolls to gallery", -5 < top < 200)

    # filter
    page.click('[data-filter="tension"]')
    visible = page.locator("[data-treatment]:visible").count()
    check(f"tension filter shows 1 treatment (got {visible})", visible == 1)
    check("chip aria-pressed updated", page.get_attribute('[data-filter="tension"]', "aria-pressed") == "true")
    check("filter status announced", "1 treatment for" in page.text_content("[data-filter-status]"))
    page.click('[data-filter="all"]')
    check("all filter restores 6", page.locator("[data-treatment]:visible").count() == 6)

    # "Book this" preselects
    page.click('[data-book="chemical-peel"].treatment__book')
    page.wait_for_timeout(600)
    check("Book this preselects Chemical Peel", page.locator('input[name="treatment"][value="chemical-peel"]').is_checked())
    check("toast shows selection", "Chemical Peel selected" in page.text_content("[data-toast]"))

    # booking: step 2 validation then pick a slot
    page.click('[data-step="1"] [data-next]')
    expect(page.locator('[data-step="2"]')).to_be_visible()
    page.click('[data-step="2"] [data-next]')
    check("missing time shows error", page.locator('[data-error-for="slot"]').is_visible())
    # find a day with an available slot
    dates = page.locator("[data-dates] .date")
    found = False
    for i in range(dates.count()):
        dates.nth(i).click()
        free = page.locator("[data-slots] .slot:not([disabled])")
        if free.count():
            free.first.click()
            found = True
            break
    check("an available slot can be chosen", found)
    page.click('[data-step="2"] [data-next]')
    expect(page.locator('[data-step="3"]')).to_be_visible()

    # step 3 validation
    page.click('[data-step="3"] [data-next]')
    check("empty name flagged", page.get_attribute("#b-name", "aria-invalid") == "true")
    page.fill("#b-name", "Jordan Avery")
    page.fill("#b-email", "not-an-email")
    page.click('[data-step="3"] [data-next]')
    check("bad email flagged", page.get_attribute("#b-email", "aria-invalid") == "true")
    page.fill("#b-email", "jordan@example.com")
    page.fill("#b-notes", "<b>sensitive skin</b>")
    page.check("#b-first")
    page.click('[data-step="3"] [data-next]')
    expect(page.locator('[data-step="4"]')).to_be_visible()
    summary = page.text_content("[data-summary]")
    check("summary lists treatment and email", "Chemical Peel" in summary and "jordan@example.com" in summary)
    check("notes rendered as text, not HTML", page.locator("[data-summary] b").count() == 0)
    page.click('[data-step="4"] button[type="submit"]')
    expect(page.locator('[data-step="done"]')).to_be_visible()
    check("done state says nothing was booked", "Nothing has been booked" in page.text_content('[data-step="done"]'))
    page.click("[data-restart]")
    expect(page.locator('[data-step="1"]')).to_be_visible()
    check("restart clears selection", page.locator('input[name="treatment"]:checked').count() == 0)

    # date radio keyboard support
    page.click('[data-step="1"] .option >> nth=0')
    page.click('[data-step="1"] [data-next]')
    page.focus('[data-dates] [aria-checked="true"]')
    first_label = page.evaluate("document.activeElement.getAttribute('aria-label')")
    page.keyboard.press("ArrowRight")
    second_label = page.evaluate("document.activeElement.getAttribute('aria-label')")
    check("arrow keys move between dates", first_label != second_label)

    # contact form
    page.click(".contact__form button[type=submit]")
    check("contact form blocks empty submit", page.get_attribute("#c-name", "aria-invalid") == "true")
    page.fill("#c-name", "Jordan Avery")
    page.fill("#c-email", "jordan@example.com")
    page.select_option("#c-topic", "Memberships")
    page.fill("#c-message", "Do memberships include LED?")
    page.click(".contact__form button[type=submit]")
    check("contact success message", "does not send it anywhere" in page.text_content("[data-contact-status]"))

    # gallery lightbox
    page.click("[data-gallery] .gallery__item >> nth=0")
    expect(page.locator("[data-lightbox]")).to_be_visible()
    check("lightbox count 1 of 6", page.text_content("[data-lightbox-count]") == "1 of 6")
    page.keyboard.press("ArrowRight")
    check("lightbox arrow next", page.text_content("[data-lightbox-count]") == "2 of 6")
    page.keyboard.press("Escape")
    check("lightbox closes on Escape", not page.locator("[data-lightbox]").is_visible())

    # placeholder link
    page.click(".social [data-placeholder-link]")
    check("Instagram placeholder explains itself", "placeholder" in page.text_content("[data-toast]"))

    # focus ring visible on keyboard focus
    page.goto(BASE, wait_until="load")
    page.keyboard.press("Tab")
    check("first Tab reaches skip link", page.evaluate("document.activeElement.className") == "skip-link")
    outline = page.evaluate("getComputedStyle(document.querySelector('.site-header__book')).outlineStyle")
    page.focus(".site-header__book")
    page.keyboard.press("Shift+Tab"); page.keyboard.press("Tab")
    outline = page.evaluate("getComputedStyle(document.activeElement).outlineStyle")
    check(f"focus outline visible ({outline})", outline != "none")

    # secondary pages
    for path in ["privacy.html", "terms.html", "credits.html"]:
        r = page.goto(BASE + path)
        check(f"{path} loads", r.status == 200)
    check(f"no console errors ({errors})", not errors)
    page.close()

    # ---------- Mobile menu ----------
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(BASE, wait_until="load")
    check("mobile bar visible", page.locator("[data-mobile-bar]").is_visible())
    page.click("[data-menu-toggle]")
    check("menu opens", page.get_attribute("[data-menu-toggle]", "aria-expanded") == "true")
    check("focus moved into menu", page.evaluate("document.activeElement.closest('#primary-nav') !== null"))
    page.keyboard.press("Escape")
    check("Escape closes menu and returns focus", page.get_attribute("[data-menu-toggle]", "aria-expanded") == "false"
          and page.evaluate("document.activeElement.hasAttribute('data-menu-toggle')"))
    page.click("[data-menu-toggle]")
    page.click('#primary-nav a[href="#contact"]')
    page.wait_for_timeout(900)
    check("menu link closes menu", page.get_attribute("[data-menu-toggle]", "aria-expanded") == "false")
    page.close()

    # ---------- Image fallback ----------
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.route("**/images.unsplash.com/**", lambda route: route.abort())
    page.goto(BASE, wait_until="load")
    page.wait_for_timeout(500)
    check("failed images get hidden fallback (no broken icon)", page.locator(".hero__media img.is-broken").count() == 1)
    page.close()

    browser.close()

failed = [n for n, ok in results if not ok]
print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
sys.exit(1 if failed else 0)
