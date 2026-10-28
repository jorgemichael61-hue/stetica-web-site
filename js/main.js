/* Marlowe Rue demo — page interactions (no dependencies). */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Toast (shared, exposed for booking.js) ---------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4500);
  }
  window.MR = { toast };

  /* ---------- Remote image fallback ---------- */
  function markBroken(img) { img.classList.add("is-broken"); }
  $$("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markBroken(img);
    img.addEventListener("error", () => markBroken(img));
    img.addEventListener("load", () => img.classList.remove("is-broken"));
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Header: scrolled state ---------- */
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = $("[data-menu-toggle]");
  const nav = $("#primary-nav");
  const mobileQuery = window.matchMedia("(max-width: 59.99em)");

  function setMenu(open, { focusToggle = false } = {}) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    $(".menu-toggle__label", toggle).textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      const rect = header.getBoundingClientRect();
      nav.style.setProperty("--nav-top", `${Math.max(rect.bottom, 0)}px`);
      const first = $("a", nav);
      if (first) first.focus();
    } else if (focusToggle) {
      toggle.focus();
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, { focusToggle: true });
    });
    // Keep focus inside the open menu (toggle + menu links).
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      const items = [toggle, ...$$("a", nav)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    mobileQuery.addEventListener("change", (e) => { if (!e.matches) setMenu(false); });
  }

  /* ---------- Current section in nav ---------- */
  const navLinks = $$('.primary-nav a[href^="#"]:not(.btn)');
  const sectionIds = ["top", "treatments", "about", "gallery", "contact"];
  if ("IntersectionObserver" in window) {
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting));
      const current = sectionIds.find((id) => visible.get(id));
      navLinks.forEach((a) => {
        if (a.getAttribute("href") === `#${current}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Treatments: concern filter ---------- */
  const chips = $$("[data-filter]");
  const rows = $$("[data-treatment]");
  const status = $("[data-filter-status]");
  const empty = $("[data-filter-empty]");

  function applyFilter(value) {
    let shown = 0;
    rows.forEach((row) => {
      const match = value === "all" || row.dataset.concerns.split(" ").includes(value);
      row.hidden = !match;
      if (match) shown += 1;
    });
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === value)));
    if (empty) empty.hidden = shown !== 0;
    const label = chips.find((c) => c.dataset.filter === value)?.textContent.trim() ?? "";
    const noun = shown === 1 ? "treatment" : "treatments";
    if (status) status.textContent = value === "all" ? `Showing all ${shown} ${noun}` : `Showing ${shown} ${noun} for ${label.toLowerCase()}`;
    const firstVisible = rows.find((r) => !r.hidden);
    if (firstVisible) setPreview(firstVisible);
  }
  chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.filter)));
  const resetBtn = $("[data-filter-reset]");
  if (resetBtn) resetBtn.addEventListener("click", () => applyFilter("all"));

  /* ---------- Treatments: desktop preview image follows the hovered/focused row ---------- */
  const preview = $("[data-preview]");
  const previewImg = preview ? $("img", preview) : null;
  let activeRow = null;
  function setPreview(row) {
    if (!previewImg || row === activeRow) return;
    activeRow = row;
    rows.forEach((r) => r.classList.toggle("is-active", r === row));
    const src = $("img", row);
    if (!src) return;
    preview.classList.add("is-swapping");
    const next = new Image();
    next.srcset = src.srcset;
    next.sizes = previewImg.sizes;
    const swap = () => {
      previewImg.srcset = src.srcset;
      previewImg.src = src.src;
      previewImg.alt = src.alt;
      previewImg.classList.remove("is-broken");
      preview.classList.remove("is-swapping");
    };
    next.onload = swap;
    next.onerror = swap;
    next.src = src.src;
  }
  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => setPreview(row));
    row.addEventListener("focusin", () => setPreview(row));
  });
  if (rows[0]) { activeRow = rows[0]; rows[0].classList.add("is-active"); }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("[data-lightbox]");
  const items = $$("[data-gallery] .gallery__item");
  let lbIndex = 0;
  let lbReturn = null;
  function showLightbox(i) {
    lbIndex = (i + items.length) % items.length;
    const item = items[lbIndex];
    const img = $("[data-lightbox-img]", lightbox);
    img.classList.remove("is-broken");
    img.src = item.dataset.full;
    img.alt = item.dataset.alt;
    $("[data-lightbox-caption]", lightbox).textContent = `${item.dataset.alt}. Stock photograph from Unsplash.`;
    $("[data-lightbox-count]", lightbox).textContent = `${lbIndex + 1} of ${items.length}`;
  }
  if (lightbox && typeof lightbox.showModal === "function") {
    $("[data-lightbox-img]", lightbox).addEventListener("error", (e) => markBroken(e.target));
    items.forEach((item, i) => item.addEventListener("click", () => {
      lbReturn = item;
      showLightbox(i);
      lightbox.showModal();
      $("[data-lightbox-close]", lightbox).focus();
    }));
    $("[data-lightbox-prev]", lightbox).addEventListener("click", () => showLightbox(lbIndex - 1));
    $("[data-lightbox-next]", lightbox).addEventListener("click", () => showLightbox(lbIndex + 1));
    $("[data-lightbox-close]", lightbox).addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
    });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener("close", () => { if (lbReturn) lbReturn.focus(); });
  } else {
    // Very old browsers: open the image itself.
    items.forEach((item) => item.addEventListener("click", () => window.open(item.dataset.full, "_blank", "noopener")));
  }

  /* ---------- Placeholder social links ---------- */
  $$("[data-placeholder-link]").forEach((btn) => btn.addEventListener("click", () => {
    toast(`${btn.dataset.placeholderLink} placeholder — connect the business's real account here.`);
  }));

  /* ---------- Form validation helpers (shared with booking.js) ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(input, message) {
    const err = document.getElementById(`${input.id}-error`);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (err) {
        err.textContent = message;
        err.hidden = false;
        input.setAttribute("aria-describedby", err.id);
      }
    } else {
      input.removeAttribute("aria-invalid");
      if (err) { err.textContent = ""; err.hidden = true; }
      input.removeAttribute("aria-describedby");
    }
    return !message;
  }
  function validateField(input) {
    const v = input.value.trim();
    const label = (input.labels && input.labels[0] ? input.labels[0].firstChild.textContent : "This field").trim();
    if (input.required && !v) {
      return setError(input, input.tagName === "SELECT" ? "Choose an option." : `Enter your ${label.toLowerCase()}.`);
    }
    if (input.type === "email" && v && !EMAIL.test(v)) return setError(input, "Enter an email address like name@example.com.");
    if (input.type === "tel" && v && v.replace(/\D/g, "").length < 10) return setError(input, "Enter a phone number with at least 10 digits, or leave it empty.");
    if (input.minLength > 0 && v && v.length < input.minLength) return setError(input, `Write at least ${input.minLength} characters.`);
    return setError(input, "");
  }
  window.MR.validateField = validateField;

  /* ---------- Contact form ---------- */
  const contact = $("[data-contact]");
  if (contact) {
    const fields = $$("input, select, textarea", contact);
    const statusEl = $("[data-contact-status]", contact);
    fields.forEach((f) => {
      f.addEventListener("blur", () => { if (f.value.trim() || f.hasAttribute("aria-invalid")) validateField(f); });
      f.addEventListener("input", () => { if (f.hasAttribute("aria-invalid")) validateField(f); });
    });
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = fields.map((f) => validateField(f));
      if (results.includes(false)) {
        statusEl.textContent = "Check the highlighted fields and try again.";
        const firstBad = fields.find((f) => f.getAttribute("aria-invalid") === "true");
        if (firstBad) firstBad.focus();
        return;
      }
      const name = $("#c-name").value.trim().split(" ")[0];
      statusEl.textContent = `Thanks, ${name}. Your message passed the checks, but this demo form does not send it anywhere.`;
      contact.reset();
    });
  }

  /* ---------- Mobile booking bar: hide while the booking section is on screen ---------- */
  const bar = $("[data-mobile-bar]");
  const bookSection = document.getElementById("book");
  if (bar && bookSection && "IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => bar.classList.toggle("is-hidden", en.isIntersecting), { threshold: 0.1 }).observe(bookSection);
  }
})();
