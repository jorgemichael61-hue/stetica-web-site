/* Marlowe Rue demo — four-step booking flow.
   Nothing leaves the browser: there is no booking backend in this demonstration.
   Treatments are read from the treatment list in the page, so prices and durations
   have a single source of truth (the HTML). */
(() => {
  "use strict";

  const form = document.querySelector("[data-booking]");
  if (!form) return;
  const $ = (sel, root = form) => root.querySelector(sel);
  const $$ = (sel, root = form) => Array.from(root.querySelectorAll(sel));
  const MR = window.MR || { toast() {}, validateField: () => true };

  /* ---------- Data ---------- */
  const treatments = Array.from(document.querySelectorAll("[data-treatment]")).map((row) => ({
    id: row.dataset.id,
    name: row.dataset.name,
    duration: Number(row.dataset.duration),
    price: Number(row.dataset.price),
  }));

  // Opening hours in 24h decimal. 0 = Sunday. Monday closed.
  const HOURS = { 0: [11, 16], 1: null, 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19], 6: [9, 17] };
  const DAYS_AHEAD = 14;

  const state = { step: 1, treatment: null, date: null, slot: null };

  /* ---------- Helpers ---------- */
  const fmtDay = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const fmtNum = new Intl.DateTimeFormat("en-US", { day: "numeric" });
  const fmtMon = new Intl.DateTimeFormat("en-US", { month: "short" });
  const fmtLong = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
  const fmtTime = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    const suffix = hh >= 12 ? "pm" : "am";
    const h12 = ((hh + 11) % 12) + 1;
    return `${h12}:${String(mm).padStart(2, "0")} ${suffix}`;
  };
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // Deterministic "already booked" times so the demo looks realistic but is repeatable.
  function isTaken(date, hour) {
    const n = date.getDate() * 31 + date.getMonth() * 7 + Math.round(hour * 2);
    return n % 5 === 0;
  }

  function openDays() {
    const days = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    for (let i = 0; days.length < DAYS_AHEAD && i < 30; i += 1) {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      if (HOURS[day.getDay()]) days.push(day);
    }
    return days;
  }

  function slotsFor(date, durationMin) {
    const [open, close] = HOURS[date.getDay()];
    const now = new Date();
    const isToday = isoDate(date) === isoDate(now);
    const minHour = isToday ? now.getHours() + now.getMinutes() / 60 + 2 : 0; // 2h notice
    const slots = [];
    for (let h = open; h + durationMin / 60 <= close; h += 1) {
      if (h < minHour) continue;
      slots.push({ hour: h, taken: isTaken(date, h) });
    }
    return slots;
  }

  /* ---------- Roving radio group (dates & times) ---------- */
  function radioGroup(container, items, { isChecked, onSelect, render }) {
    container.innerHTML = "";
    const buttons = items.map((item) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      render(b, item);
      b.setAttribute("aria-checked", String(isChecked(item)));
      if (b.disabled) return b;
      b.addEventListener("click", () => {
        onSelect(item);
        buttons.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        setTabStops();
      });
      return b;
    });
    buttons.forEach((b) => container.appendChild(b));
    const enabled = () => buttons.filter((b) => !b.disabled);
    function setTabStops() {
      const list = enabled();
      const checked = list.find((b) => b.getAttribute("aria-checked") === "true") || list[0];
      list.forEach((b) => { b.tabIndex = b === checked ? 0 : -1; });
    }
    container.onkeydown = (e) => {
      const list = enabled();
      const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = list[(i + 1) % list.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = list[(i - 1 + list.length) % list.length];
      if (e.key === "Home") next = list[0];
      if (e.key === "End") next = list[list.length - 1];
      if (next) { e.preventDefault(); next.focus(); next.click(); }
    };
    setTabStops();
  }

  /* ---------- Step 1: treatments ---------- */
  function renderTreatments() {
    const wrap = $("[data-treatment-options]");
    wrap.innerHTML = "";
    treatments.forEach((t) => {
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = `
        <input type="radio" name="treatment" value="${t.id}">
        <span class="option__name">${t.name}<span class="option__meta">${t.duration} minutes</span></span>
        <span class="option__price">$${t.price}</span>`;
      const input = label.querySelector("input");
      input.checked = state.treatment === t.id;
      input.addEventListener("change", () => {
        state.treatment = t.id;
        state.slot = null; // duration may change which times fit
        hideError("treatment");
      });
      wrap.appendChild(label);
    });
  }

  /* ---------- Step 2: dates & times ---------- */
  function renderDates() {
    const days = openDays();
    const duration = (treatments.find((x) => x.id === state.treatment) || { duration: 60 }).duration;
    const hasFree = (d) => slotsFor(d, duration).some((s) => !s.taken);
    if (!state.date || !days.some((d) => isoDate(d) === state.date)) {
      state.date = isoDate(days.find(hasFree) || days[0]);
    }
    radioGroup($("[data-dates]"), days, {
      isChecked: (d) => isoDate(d) === state.date,
      onSelect: (d) => { state.date = isoDate(d); state.slot = null; renderSlots(); },
      render: (b, d) => {
        b.className = "date";
        b.innerHTML = `<span>${fmtDay.format(d)}</span><strong>${fmtNum.format(d)}</strong><span>${fmtMon.format(d)}</span>`;
        b.setAttribute("aria-label", fmtLong.format(d));
      },
    });
    renderSlots();
  }

  function renderSlots() {
    const t = treatments.find((x) => x.id === state.treatment);
    const [y, m, d] = state.date.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const slots = slotsFor(date, t ? t.duration : 60);
    const container = $("[data-slots]");
    if (!slots.some((s) => !s.taken)) {
      container.innerHTML = `<p class="slot-empty">No times left on this day. Choose another date.</p>`;
      return;
    }
    radioGroup(container, slots, {
      isChecked: (s) => s.hour === state.slot,
      onSelect: (s) => { state.slot = s.hour; hideError("slot"); },
      render: (b, s) => {
        b.className = "slot";
        b.textContent = fmtTime(s.hour);
        if (s.taken) {
          b.disabled = true;
          b.setAttribute("aria-label", `${fmtTime(s.hour)}, already booked`);
          b.style.opacity = "0.35";
          b.style.textDecoration = "line-through";
          b.style.cursor = "not-allowed";
        }
      },
    });
  }

  /* ---------- Step 4: summary ---------- */
  function renderSummary() {
    const t = treatments.find((x) => x.id === state.treatment);
    const [y, m, d] = state.date.split("-").map(Number);
    const rows = [
      ["Treatment", `${t.name} (${t.duration} min)`],
      ["Price", `$${t.price} — example price`],
      ["Date", fmtLong.format(new Date(y, m - 1, d))],
      ["Time", fmtTime(state.slot)],
      ["Name", $("#b-name").value.trim()],
      ["Email", $("#b-email").value.trim()],
    ];
    const phone = $("#b-phone").value.trim();
    if (phone) rows.push(["Phone", phone]);
    if ($("#b-first").checked) rows.push(["First visit", "Yes — 15-minute consultation included"]);
    const notes = $("#b-notes").value.trim();
    if (notes) rows.push(["Notes", notes]);
    const dl = $("[data-summary]");
    dl.innerHTML = "";
    rows.forEach(([k, v]) => {
      const div = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = k;
      dd.textContent = v; // textContent: user input is never injected as HTML
      div.append(dt, dd);
      dl.appendChild(div);
    });
  }

  /* ---------- Errors ---------- */
  function showError(key, message) {
    const el = $(`[data-error-for="${key}"]`);
    el.textContent = message;
    el.hidden = false;
  }
  function hideError(key) {
    const el = $(`[data-error-for="${key}"]`);
    if (el) { el.textContent = ""; el.hidden = true; }
  }

  function validateStep(step) {
    if (step === 1 && !state.treatment) {
      showError("treatment", "Choose a treatment to continue.");
      const first = $('input[name="treatment"]');
      if (first) first.focus();
      return false;
    }
    if (step === 2 && state.slot === null) {
      showError("slot", "Choose an available time to continue.");
      return false;
    }
    if (step === 3) {
      const inputs = ["#b-name", "#b-email", "#b-phone"].map((s) => $(s));
      const ok = inputs.map((i) => MR.validateField(i));
      if (ok.includes(false)) {
        inputs.find((i) => i.getAttribute("aria-invalid") === "true").focus();
        return false;
      }
    }
    return true;
  }

  /* ---------- Step navigation ---------- */
  const stepEls = $$("[data-step]");
  const progress = Array.from(document.querySelectorAll("[data-steps] li"));
  stepEls.forEach((el) => el.setAttribute("tabindex", "-1"));

  function go(step, { focus = true } = {}) {
    state.step = step;
    stepEls.forEach((el) => { el.hidden = el.dataset.step !== String(step); });
    progress.forEach((li, i) => {
      const n = i + 1;
      if (n === step) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
      li.classList.toggle("is-done", step === "done" || n < step);
    });
    if (step === 2) renderDates();
    if (step === 4) renderSummary();
    if (focus) {
      const current = stepEls.find((el) => !el.hidden);
      current.focus({ preventScroll: true });
      const top = form.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }
  }

  form.addEventListener("click", (e) => {
    if (e.target.closest("[data-next]")) {
      if (validateStep(state.step)) go(state.step + 1);
    } else if (e.target.closest("[data-back]")) {
      go(state.step - 1);
    } else if (e.target.closest("[data-restart]")) {
      form.reset();
      Object.assign(state, { treatment: null, date: null, slot: null });
      renderTreatments();
      go(1);
    }
  });

  ["#b-name", "#b-email", "#b-phone"].forEach((s) => {
    const input = $(s);
    input.addEventListener("input", () => { if (input.hasAttribute("aria-invalid")) MR.validateField(input); });
    input.addEventListener("blur", () => { if (input.value.trim()) MR.validateField(input); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (state.step !== 4) return;
    const t = treatments.find((x) => x.id === state.treatment);
    const [y, m, d] = state.date.split("-").map(Number);
    const first = $("#b-name").value.trim().split(" ")[0];
    $("[data-done-text]").textContent =
      `Thank you, ${first}. In a live version, your request for the ${t.name} on ${fmtLong.format(new Date(y, m - 1, d))} at ${fmtTime(state.slot)} would now be sent to the studio.`;
    go("done");
  });

  /* ---------- "Book this" links preselect a treatment ---------- */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-book]");
    if (!link) return;
    const id = link.dataset.book;
    if (!treatments.some((t) => t.id === id)) return;
    state.treatment = id;
    state.slot = null;
    renderTreatments();
    hideError("treatment");
    if (state.step !== 1) go(1, { focus: false });
    const name = treatments.find((t) => t.id === id).name;
    MR.toast(`${name} selected. Continue to choose a date and time.`);
  });

  renderTreatments();
  go(1, { focus: false });
})();
