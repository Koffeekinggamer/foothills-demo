/* Foothills demo runtime. Vanilla JS, no framework, deferred. */
(function () {
  var html = document.documentElement;
  var DEMO = html.hasAttribute("data-demo");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dataLayer = window.dataLayer || [];

  /* 0. Open / closed status, computed in the showroom's time zone (America/New_York). */
  var HOURS = { 0: null, 1: [600, 1020], 2: [600, 1020], 3: [600, 1020], 4: [600, 1020], 5: [600, 1020], 6: [600, 1020] };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function nowET() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { day: d, min: (+p.hour % 24) * 60 + +p.minute };
  }
  function t(m) { var h = Math.floor(m / 60), mm = m % 60; return ((h + 11) % 12 + 1) + (mm ? ":" + String(mm).padStart(2, "0") : "") + (h < 12 ? " a.m." : " p.m."); }
  function status() {
    var n = nowET(), h = HOURS[n.day];
    if (h && n.min >= h[0] && n.min < h[1]) {
      var left = h[1] - n.min;
      return { open: true, text: left <= 60 ? "Open now · closes at " + t(h[1]) : "Open now · until " + t(h[1]) };
    }
    if (h && n.min < h[0]) return { open: false, text: "Closed · opens today at " + t(h[0]) };
    for (var i = 1; i <= 7; i++) {
      var d = (n.day + i) % 7;
      if (HOURS[d]) return { open: false, text: "Closed · opens " + (i === 1 ? "tomorrow" : DAYS[d]) + " at " + t(HOURS[d][0]) };
    }
  }
  function paintStatus() {
    var s = status(), today = nowET().day;
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.classList.toggle("is-open", s.open); el.classList.toggle("is-closed", !s.open);
      el.querySelector(".status__text").textContent = s.text;
    });
    document.querySelectorAll(".hours-table tr").forEach(function (tr) {
      var on = +tr.getAttribute("data-day") === today;
      tr.classList.toggle("is-today", on);
      if (on) tr.setAttribute("aria-current", "date"); else tr.removeAttribute("aria-current");
    });
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* 1. Header state + 2px scroll progress + gentle parallax */
  var header = document.querySelector(".header");
  var bar = document.querySelector(".scroll-progress span");
  var parallax = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bar) bar.parentNode.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    parallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.setProperty("--py", (c * -24).toFixed(1) + "px");
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* 2. Reveal on scroll. Content is never hidden without JS. */
  if (!reduce && "IntersectionObserver" in window && !html.hasAttribute("data-static")) {
    html.classList.add("motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("is-in"); else io.observe(el);
    });
  }

  /* 3. Tracking: one delegated listener -> dataLayer (GTM is inert in the demo, so nothing leaves the page). */
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-track]");
    if (!el) return;
    window.dataLayer.push({
      event: el.getAttribute("data-track"),
      cta_location: el.getAttribute("data-cta-location") || "",
      store_location: el.getAttribute("data-store") || "landrum",
      link_url: el.href || "",
      product_handle: document.body.getAttribute("data-product") || ""
    });
  });

  var toastEl = document.querySelector(".toast"), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 4000);
  }

  /* 4. Podium: NEVER auto-open, especially on phones. Below 1024px the bottom action
     bar's Text button is the only Text entry (the floating .podium-facade is hidden).
     The widget script is not in the page on load; it is injected only after a user tap,
     and in the demo it is not injected at all. When wiring the live token, do not pass
     an auto-open / proactive campaign flag. */
  function openPodium(src) {
    window.dataLayer.push({ event: "podium_open", cta_location: src || "" });
    if (DEMO) { toast("Demo: Podium text chat would open here. Nothing was loaded."); return; }
    if (window.PodiumWebChat) { window.PodiumWebChat.open && window.PodiumWebChat.open(); return; }
    var s = document.createElement("script");
    s.id = "podium-widget"; s.defer = true; s.src = "https://connect.podium.com/widget.js#API_TOKEN=PODIUM_TOKEN_PLACEHOLDER";
    s.setAttribute("data-api-token", "PODIUM_TOKEN_PLACEHOLDER");
    document.body.appendChild(s);
  }
  document.querySelectorAll("[data-podium]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openPodium(b.getAttribute("data-cta-location")); });
  });

  /* 5. Click-to-load facades (map, booking calendar): no third-party iframe until asked. */
  document.querySelectorAll("[data-facade]").forEach(function (box) {
    var btn = box.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = box.getAttribute("data-src"); f.title = box.getAttribute("data-title") || "";
      f.setAttribute("allow", "fullscreen");
      box.classList.add("is-loaded");
      box.innerHTML = ""; box.appendChild(f); f.focus();
    });
  });

  /* 5b. Booking flow on /pages/book: step 1 category, step 2 person, then that person's calendar. */
  var flow = document.querySelector("[data-book-flow]");
  if (flow) {
    var current = "category";
    function personCategory(slug) {
      var btn = flow.querySelector("[data-pick-person='" + slug + "']");
      if (!btn) return "furniture";
      var panel = btn.closest("[data-step]");
      var step = panel && panel.getAttribute("data-step") || "";
      return step.indexOf("people-") === 0 ? step.slice(7) : "furniture";
    }
    function show(name) {
      current = name;
      flow.querySelectorAll("[data-step]").forEach(function (el) {
        el.classList.toggle("is-active", el.getAttribute("data-step") === name);
      });
      var active = flow.querySelector("[data-step].is-active");
      if (active && current !== "category") {
        var h = active.querySelector("h2, h3");
        if (h) h.setAttribute("tabindex", "-1"), h.focus({ preventScroll: true });
        active.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
    flow.setAttribute("data-ready", "");
    var hash = (location.hash || "").replace(/^#/, "");
    if (hash && flow.querySelector('[data-step="cal-' + hash + '"]')) show("cal-" + hash);
    else if (hash && flow.querySelector('[data-step="people-' + hash + '"]')) show("people-" + hash);
    else show("category");
    flow.querySelectorAll("[data-choose]").forEach(function (b) {
      b.addEventListener("click", function () { show("people-" + b.getAttribute("data-choose")); });
    });
    flow.querySelectorAll("[data-pick-person]").forEach(function (b) {
      b.addEventListener("click", function () { show("cal-" + b.getAttribute("data-pick-person")); });
    });
    flow.querySelectorAll("[data-book-back]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (current.indexOf("cal-") === 0) show("people-" + personCategory(current.slice(4)));
        else show("category");
      });
    });
  }

  /* 6. Forms: validate, and in the demo never send anything.
     LIVE LEAD ROUTING: contact-page and product-inquiry submissions are emailed to
     travis@foothillsamish.com and a text is sent to the store phone, (864) 457-2400.
     Email signup stays on Omnisend. Nothing is sent from this demo. */
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      form.querySelectorAll("[required]").forEach(function (inp) {
        var ok = inp.value.trim() !== "" && (inp.type !== "email" || /.+@.+\..+/.test(inp.value));
        inp.setAttribute("aria-invalid", ok ? "false" : "true");
        var err = document.getElementById(inp.getAttribute("aria-describedby") || "_");
        if (err) err.hidden = ok;
        if (!ok && !bad) bad = inp;
      });
      if (bad) { bad.focus(); return; }
      window.dataLayer.push({ event: "generate_lead", form_id: form.id, form_name: form.getAttribute("data-form") });
      var st = form.querySelector(".form__status");
      var kind = form.getAttribute("data-form");
      var msg = kind === "email_signup"
        ? "Demo only: nothing was sent. On the live site this Omnisend signup is the only email list."
        : "Demo only: nothing was sent. On the live site this " + (form.getAttribute("data-demo-form") || "form") + " is emailed to travis@foothillsamish.com and a text is sent to (864) 457-2400.";
      if (st) { st.hidden = false; st.textContent = msg; st.focus && st.focus(); } else toast(msg);
    });
  });

  /* 7. "Request info on this piece": jump to the short form and focus it. */
  document.querySelectorAll("[data-request-info]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.getElementById("request");
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      var first = target.querySelector("input:not([type=hidden])");
      setTimeout(function () { first && first.focus({ preventScroll: true }); }, reduce ? 0 : 450);
    });
  });

  /* 8. Product gallery thumbs */
  var main = document.querySelector(".gallery__main");
  document.querySelectorAll(".gallery__thumbs button").forEach(function (b, i, all) {
    b.addEventListener("click", function () {
      var tpl = document.getElementById("gallery-" + i);
      if (!tpl || !main) return;
      main.innerHTML = tpl.innerHTML;
      main.classList.toggle("is-room", b.hasAttribute("data-room"));
      all.forEach(function (x) { x.removeAttribute("aria-current"); }); b.setAttribute("aria-current", "true");
    });
  });

  /* 9. Mobile menu */
  var menuBtn = document.querySelector(".header__menu"), sheet = document.getElementById("menu");
  document.querySelectorAll("[data-menu-toggle]").forEach(function (tg) {
    tg.addEventListener("click", function () {
      var open = !sheet.hidden;
      menuBtn.setAttribute("aria-expanded", String(!open)); sheet.hidden = open;
      document.body.style.overflow = open ? "" : "hidden";
      if (!open) sheet.querySelector("a,button").focus(); else menuBtn.focus();
    });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet && !sheet.hidden) sheet.querySelector("[data-menu-toggle]").click(); });
})();
