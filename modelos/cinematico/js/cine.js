/* Corvelle — cinematic demo: page behaviour and animation (no dependencies). */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Toast + shared validation (used by booking.js) ---------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 4500);
  }
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(input, message) {
    const err = document.getElementById(`${input.id}-error`);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      if (err) { err.textContent = message; err.hidden = false; input.setAttribute("aria-describedby", err.id); }
      return false;
    }
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    if (err) { err.textContent = ""; err.hidden = true; }
    return true;
  }
  function validateField(input) {
    const v = input.value.trim();
    const label = (input.labels && input.labels[0] ? input.labels[0].firstChild.textContent : "this field").trim().toLowerCase();
    if (input.required && !v) return setError(input, `Enter your ${label}.`);
    if (input.type === "email" && v && !EMAIL.test(v)) return setError(input, "Enter an email address like name@example.com.");
    if (input.type === "tel" && v && v.replace(/\D/g, "").length < 10) return setError(input, "Enter a phone number with at least 10 digits, or leave it empty.");
    if (input.minLength > 0 && v && v.length < input.minLength) return setError(input, `Write at least ${input.minLength} characters.`);
    return setError(input, "");
  }
  window.MR = { toast, validateField };

  $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Photos: if a photo cannot load, show the storyboard slate ---------- */
  $$(".frame img").forEach((img) => {
    const frame = img.closest(".frame");
    const fail = () => frame.classList.add("is-slate");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
    img.addEventListener("load", () => frame.classList.remove("is-slate"));
  });

  /* ---------- Opening: drifting tungsten light (canvas) ---------- */
  const canvas = $("[data-light]");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, raf = 0, running = false, t0 = performance.now();
    const blobs = [
      { x: .28, y: .38, r: .55, sx: .021, sy: .013, hue: [233, 172, 110], a: .55 },
      { x: .72, y: .3,  r: .45, sx: -.017, sy: .019, hue: [201, 116, 63],  a: .45 },
      { x: .55, y: .75, r: .6,  sx: .013, sy: -.011, hue: [120, 52, 48],   a: .5 },
    ];
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.fillStyle = "#18110F";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      blobs.forEach((b, i) => {
        const x = (b.x + Math.sin(t * b.sx * 6 + i) * .12) * w;
        const y = (b.y + Math.cos(t * b.sy * 6 + i * 2) * .1) * h;
        const r = b.r * Math.max(w, h) * (1 + Math.sin(t * .3 + i) * .06);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const [cr, cg, cb] = b.hue;
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${b.a * .8})`);
        g.addColorStop(.45, `rgba(${cr},${cg},${cb},${b.a * .28})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      // a slow projector beam from the top-right corner
      const beamA = -2.35 + Math.sin(t * .15) * .06;
      ctx.save();
      ctx.translate(w * .95, -h * .05);
      ctx.rotate(beamA);
      const beam = ctx.createLinearGradient(0, 0, Math.max(w, h) * 1.2, 0);
      beam.addColorStop(0, "rgba(241,230,218,0.16)");
      beam.addColorStop(1, "rgba(241,230,218,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.max(w, h) * 1.3, -h * .22);
      ctx.lineTo(Math.max(w, h) * 1.3, h * .22);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    }
    function loop(now) { draw(now); if (running) raf = requestAnimationFrame(loop); }
    function start() { if (running || reduce.matches) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    size(); draw(performance.now());
    window.addEventListener("resize", () => { size(); draw(performance.now()); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
    } else start();
    reduce.addEventListener("change", () => (reduce.matches ? stop() : start()));
  }

  /* ---------- Header: solid after the opening; scroll timecode; current scene ---------- */
  const bar = $("[data-bar]");
  const tc = $("[data-timecode]");
  const sceneLabel = $("[data-scene]");
  const scenes = $$("[data-scene-name]");
  const RUNTIME = 90 * 60; // the page "runs" as long as the 90-minute Signature Ritual
  const pad = (n) => String(n).padStart(2, "0");
  function timecode(seconds, frames) {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
  }
  const navLinks = $$("[data-scene-link]");
  const timeline = $("[data-timeline]");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    const secs = p * RUNTIME;
    if (tc) tc.textContent = timecode(secs, Math.floor((secs % 1) * 24));
    if (bar) bar.classList.toggle("is-solid", y > window.innerHeight * .6);

    const mid = window.innerHeight * .4;
    let current = scenes[0];
    scenes.forEach((s) => { if (s.getBoundingClientRect().top <= mid) current = s; });
    if (current && sceneLabel) sceneLabel.textContent = current.dataset.sceneName;
    navLinks.forEach((a) => {
      if (current && a.getAttribute("href") === `#${current.id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const tp = Math.min(1, Math.max(0, (window.innerHeight * .75 - r.top) / (r.height + window.innerHeight * .35)));
      timeline.style.setProperty("--progress", tp.toFixed(4));
    }
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Mobile scene-selection menu ---------- */
  const toggle = $("[data-menu-toggle]");
  const nav = $("#scene-menu");
  function setMenu(open, focusToggle) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Scenes";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) { const first = $("a", nav); if (first) first.focus(); }
    else if (focusToggle) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a") && nav.classList.contains("is-open")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (e.key === "Escape") { setMenu(false, true); return; }
      if (e.key === "Tab") {
        const items = [toggle, ...$$("a", nav)];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia("(min-width: 64em)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Scroll reveals: only elements below the first screen start hidden ---------- */
  const revealables = [...$$(".reveal"), timeline, $(".credits")].filter(Boolean);
  if ("IntersectionObserver" in window && !reduce.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.remove("is-pending");
        en.target.classList.add("is-shown");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealables.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("is-pending");
        io.observe(el);
      }
    });
  }

  /* ---------- Stills reel ---------- */
  const reel = $("[data-reel]");
  if (reel) {
    const step = (dir) => {
      const item = $("li", reel);
      const dist = item ? item.getBoundingClientRect().width + 12 : 300;
      reel.scrollBy({ left: dir * dist, behavior: reduce.matches ? "auto" : "smooth" });
    };
    $("[data-reel-prev]").addEventListener("click", () => step(-1));
    $("[data-reel-next]").addEventListener("click", () => step(1));
    // vertical wheel over the reel moves it sideways on desktop
    reel.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = reel.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = reel.scrollLeft + reel.clientWidth >= reel.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      reel.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  /* ---------- Reviews as subtitles ---------- */
  const subs = $$(".subtitle");
  const count = $("[data-sub-count]");
  let subIndex = 0, subTimer = 0;
  function showSub(i) {
    subIndex = (i + subs.length) % subs.length;
    subs.forEach((s, n) => s.classList.toggle("is-active", n === subIndex));
    if (count) count.textContent = `${subIndex + 1} of ${subs.length}`;
  }
  function autoplay() {
    clearInterval(subTimer);
    if (!reduce.matches) subTimer = setInterval(() => showSub(subIndex + 1), 6500);
  }
  if (subs.length) {
    $("[data-sub-prev]").addEventListener("click", () => { showSub(subIndex - 1); autoplay(); });
    $("[data-sub-next]").addEventListener("click", () => { showSub(subIndex + 1); autoplay(); });
    const box = $("[data-subtitles]");
    box.addEventListener("mouseenter", () => clearInterval(subTimer));
    box.addEventListener("mouseleave", autoplay);
    autoplay();
  }

  /* ---------- Contact form ---------- */
  const contact = $("[data-contact]");
  if (contact) {
    const fields = $$("input, textarea", contact);
    const status = $("[data-contact-status]", contact);
    fields.forEach((f) => {
      f.addEventListener("blur", () => { if (f.value.trim() || f.hasAttribute("aria-invalid")) validateField(f); });
      f.addEventListener("input", () => { if (f.hasAttribute("aria-invalid")) validateField(f); });
    });
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = fields.map(validateField);
      if (ok.includes(false)) {
        status.textContent = "Check the highlighted fields and try again.";
        fields.find((f) => f.getAttribute("aria-invalid") === "true").focus();
        return;
      }
      status.textContent = `Thanks, ${$("#c-name").value.trim().split(" ")[0]}. Your message passed the checks, but this demo form does not send it anywhere.`;
      contact.reset();
    });
  }

  /* ---------- Placeholder links ---------- */
  $$("[data-placeholder]").forEach((b) => b.addEventListener("click", () => {
    toast(`${b.dataset.placeholder} is a placeholder in this demo. Connect the studio's real page here.`);
  }));

  /* ---------- Mobile Book/Call bar: after the opening, hidden at the booking section ---------- */
  const cta = $("[data-mobile-cta]");
  const opening = $("#opening");
  const book = $("#book");
  if (cta && "IntersectionObserver" in window) {
    let pastOpening = false, atBooking = false;
    const update = () => cta.classList.toggle("is-visible", pastOpening && !atBooking);
    new IntersectionObserver(([e]) => { pastOpening = !e.isIntersecting; update(); }, { threshold: 0.2 }).observe(opening);
    new IntersectionObserver(([e]) => { atBooking = e.isIntersecting; update(); }, { threshold: 0.05 }).observe(book);
  }
})();
