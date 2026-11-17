/* Collection filters + instant search. Vanilla JS, operates on server-rendered cards. */
(function () {
  var root = document.querySelector("[data-coll]"); if (!root) return;
  var grid = root.querySelector("[data-grid]"), cards = Array.prototype.slice.call(grid.children);
  var q = document.getElementById("q"), sortSel = root.querySelector("[data-sort]");
  var boxes = Array.prototype.slice.call(root.querySelectorAll(".rail input[type=checkbox]"));
  var chips = root.querySelector("[data-chips]"), empty = root.querySelector("[data-empty]");
  var rail = document.getElementById("filters"), fbtn = root.querySelector(".filter-btn");
  var KEYS = ["builder", "wood", "room"];

  function selected() {
    var s = {}; KEYS.forEach(function (k) { s[k] = []; });
    boxes.forEach(function (b) { if (b.checked) s[b.name].push(b.value); });
    return s;
  }
  function vals(card, k) { var v = card.getAttribute("data-" + k) || ""; return k === "room" ? v.split("|") : [v]; }
  function match(card, s, terms, skip) {
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i]; if (k === skip || !s[k].length) continue;
      var cv = vals(card, k); if (!s[k].some(function (x) { return cv.indexOf(x) > -1; })) return false;
    }
    var txt = card.getAttribute("data-text");
    return terms.every(function (t) { return txt.indexOf(t) > -1; });
  }
  function apply(push) {
    var s = selected(), terms = (q.value || "").toLowerCase().trim().split(/\s+/).filter(Boolean), shown = 0;
    cards.forEach(function (c) { var ok = match(c, s, terms); c.hidden = !ok; if (ok) shown++; });
    // facet counts reflect the other active filters + search
    boxes.forEach(function (b) {
      var n = cards.filter(function (c) { return match(c, s, terms, b.name) && vals(c, b.name).indexOf(b.value) > -1; }).length;
      b.closest("label").querySelector("[data-count]").textContent = n;
      b.closest("li").classList.toggle("is-zero", n === 0 && !b.checked);
    });
    document.querySelectorAll("[data-count-shown],[data-count-total]").forEach(function (el) { el.textContent = shown; });
    empty.hidden = shown > 0; grid.hidden = shown === 0;
    var active = boxes.filter(function (b) { return b.checked; });
    var badge = root.querySelector("[data-active-count]"); badge.textContent = active.length; badge.hidden = !active.length;
    root.querySelectorAll(".rail [data-clear]").forEach(function (b) { b.hidden = !active.length; });
    chips.innerHTML = ""; chips.hidden = !active.length && !terms.length;
    if (terms.length) addChip("“" + q.value.trim() + "”", function () { q.value = ""; apply(true); });
    active.forEach(function (b) { addChip(b.value, function () { b.checked = false; apply(true); }); });
    if (!chips.hidden) { var c = document.createElement("button"); c.type = "button"; c.className = "link"; c.textContent = "Clear all"; c.onclick = clearAll; chips.appendChild(c); }
    if (push) {
      var p = new URLSearchParams();
      if (q.value.trim()) p.set("q", q.value.trim());
      KEYS.forEach(function (k) { if (s[k].length) p.set(k, s[k].join(",")); });
      if (sortSel.value !== "featured") p.set("sort", sortSel.value);
      history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
      window.dataLayer && window.dataLayer.push({ event: "collection_filter", filters: p.toString(), results: shown });
    }
  }
  function addChip(label, onRemove) {
    var b = document.createElement("button"); b.type = "button"; b.className = "chip";
    b.innerHTML = '<span></span><span aria-hidden="true">×</span>'; b.firstChild.textContent = label;
    b.setAttribute("aria-label", "Remove filter " + label); b.onclick = onRemove; chips.appendChild(b);
  }
  function clearAll() { boxes.forEach(function (b) { b.checked = false; }); q.value = ""; apply(true); q.focus(); }
  function sort() {
    var v = sortSel.value, arr = cards.slice();
    arr.sort(function (a, b) {
      if (v === "az") return a.getAttribute("data-name").localeCompare(b.getAttribute("data-name"));
      if (v === "new") return b.getAttribute("data-created").localeCompare(a.getAttribute("data-created"));
      return a.getAttribute("data-i") - b.getAttribute("data-i");
    });
    arr.forEach(function (c) { grid.appendChild(c); });
  }

  var t; q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { apply(true); }, 80); });
  boxes.forEach(function (b) { b.addEventListener("change", function () { apply(true); }); });
  sortSel.addEventListener("change", function () { sort(); apply(true); });
  root.querySelectorAll("[data-clear]").forEach(function (b) { b.addEventListener("click", clearAll); });

  // mobile filter sheet
  function setOpen(open) {
    rail.classList.toggle("is-open", open); fbtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) rail.querySelector("input").focus(); else fbtn.focus();
  }
  root.querySelectorAll("[data-filters-toggle]").forEach(function (b) { b.addEventListener("click", function () { setOpen(!rail.classList.contains("is-open")); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && rail.classList.contains("is-open")) setOpen(false); });

  // restore from URL
  var p = new URLSearchParams(location.search);
  if (p.get("q")) q.value = p.get("q");
  KEYS.forEach(function (k) { (p.get(k) || "").split(",").filter(Boolean).forEach(function (v) { boxes.forEach(function (b) { if (b.name === k && b.value === v) b.checked = true; }); }); });
  if (p.get("sort")) { sortSel.value = p.get("sort"); sort(); }
  apply(false);
})();
