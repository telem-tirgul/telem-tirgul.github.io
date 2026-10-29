// את-46 (נועה 29.10): Google Analytics בכל הטפסים – בלי מידע אישי.
//  לגוגל נשלחת רק כתובת הדף בלי פרמטרים, חוץ מ: city, school, tracks, track, m, embed, lead, pending, already + utm_* (נועה 29.10: לדעת כמה נכנסו מכל SMS) (קוד משפחה / טלפון / קוד תשלום / ref – לא).
//  לא מודדים: תצוגה מקדימה / עורך הנוסחים / בדיקות, טופס שנפתח מתוך מערכת הניהול (וכל מה שנפתח אחריו באותה לשונית), ולא מחוץ לאתר.
//  אירועים (TELEM_GA): generate_lead (השארת פרטים), sign_up (הרשמה נשלחה), begin_checkout (מעבר לתשלום), purchase (תשלום אושר – בלי סכום).
(function(){
  var ID = "G-VHQ6QEBVV9", KEEP = ["city", "school", "tracks", "track", "m", "embed", "lead", "pending", "already", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var no = false, q = location.search;
  try {
    if (location.hostname !== "telem-tirgul.github.io") no = true;
    if (/[?&](preview|cardtest|txedit|tyv|render|noga)=/.test(q)) no = true;
    if (/\/telem-admin\//.test(document.referrer || "")) no = true;
    try { if (window.top !== window && /\/telem-admin\//.test(window.top.location.pathname)) no = true; } catch (e) {}
    if (no) sessionStorage.setItem("tl_noga", "1"); else if (sessionStorage.getItem("tl_noga")) no = true;
  } catch (e) {}
  window.TELEM_GA = function(){}; window.TELEM_GA_SET = function(){};
  if (no) return;
  var clean = function(u, keep){ try { var x = new URL(u, location.href), o = new URL(x.origin + x.pathname);
    if (keep) KEEP.forEach(function(k){ var v = x.searchParams.get(k); if (v != null && v.length < 120) o.searchParams.set(k, v); });
    return o.href; } catch (e) { return ""; } };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", ID, { page_location: clean(location.href, true), page_referrer: document.referrer ? clean(document.referrer, false) : "",
    allow_google_signals: false, allow_ad_personalization_signals: false });
  var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID; document.head.appendChild(s);
  window.TELEM_GA = function(name, params){ try { gtag("event", name, Object.assign({ transport_type: "beacon" }, params || {})); } catch (e) {} };
  window.TELEM_GA_SET = function(params){ try { gtag("set", params || {}); } catch (e) {} };   // נועה 29.10: פרטי המרתון (בית ספר / שכבה) – לכל האירועים בדף
})();
// תלם – עיצוב אחיד לכל הטפסים (נועה 23.10.2026): הטפסים תמיד בהירים, כמו האתר.
// כללי "רק במצב בהיר" חלים תמיד, וכללי "מצב כהה" יורדים. רץ מיד אחרי site-look.css (בסוף ה-head).
// נועה 24.10: לא להראות טקסטים / מחירים זמניים לפני שהנתונים מהמערכת מגיעים – הדף מוסתר (עם "טוען…") עד שהנוסחים (TX.ready)
// וכל מה שהטופס ביקש לחכות לו (window.TELEM_HOLD(promise)) הגיעו. ליתר ביטחון – אחרי 8 שניות מוצג בכל מקרה. + חיבור מוקדם לשרת.
(function(){
  var de = document.documentElement, holds = [], shown = false;
  de.classList.add("tl-wait");
  try { var l = document.createElement("link"); l.rel = "preconnect"; l.href = "https://oulivucqbpmbavbavfvy.supabase.co"; l.crossOrigin = ""; document.head.appendChild(l); } catch (e) {}
  var show = function(){ if (shown) return; shown = true; de.classList.remove("tl-wait"); try { window.dispatchEvent(new Event("resize")); } catch (e) {} };
  var safe = function(p){ return Promise.resolve(p).then(function(){}, function(){}); };
  window.TELEM_HOLD = function(p){ holds.push(safe(p)); return p; };
  setTimeout(show, 8000);
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(function(){
    Promise.all([safe(window.TX && window.TX.ready)].concat(holds)).then(function(){ requestAnimationFrame(show); });
  }, 0); });
})();
(function(){
  var de = document.documentElement; de.setAttribute("data-theme", "light");
  if (/[?&]embed=1(&|$)/.test(location.search)) de.classList.add("embed");
  [].forEach.call(document.styleSheets, function(sh){
    try {
      var rs = sh.cssRules;
      for (var i = rs.length - 1; i >= 0; i--) {
        var r = rs[i]; if (!r.media) continue; var c = r.media.mediaText || "";
        if (/not all and \(prefers-color-scheme: ?dark\)/.test(c)) { var t = [].map.call(r.cssRules, function(x){ return x.cssText; }); sh.deleteRule(i); for (var k = t.length - 1; k >= 0; k--) sh.insertRule(t[k], i); }
        else if (/prefers-color-scheme: ?dark/.test(c)) sh.deleteRule(i);
      }
    } catch (e) {}   // גיליון חיצוני (גוגל פונטס) – לא נגיש, מדלגים
  });
})();
// את-26 (נועה 23.10): חזרה לאתר תלם אחרי התשלום. האתר מוסיף לקישור &back=<דף בית הספר>; שומרים אותו,
// ובדף התודה / התשלום לא הושלם מציגים "חזרה לאתר תלם". רק לכתובות של האתר.
(function(){
  var OK = /^https:\/\/telem-tirgul\.github\.io\/telem-tr\//;
  var b = null; try { b = new URLSearchParams(location.search).get("back"); } catch (e) {}
  if (b && OK.test(b)) { try { sessionStorage.setItem("telem_back", b); } catch (e) {} }
  var form = document.documentElement.getAttribute("data-form");
  if (form !== "thank-you" && form !== "payment-failed") return;
  document.addEventListener("DOMContentLoaded", function(){
    var u = b && OK.test(b) ? b : null; if (!u) { try { u = sessionStorage.getItem("telem_back"); } catch (e) {} }
    if (!u || !OK.test(u)) return;
    var a = document.createElement("a"); a.className = "back-site"; a.href = u; a.textContent = "→ חזרה לאתר תלם";
    var c = document.querySelector(".card .contact") || document.querySelector(".contact");
    if (c && c.parentNode) c.parentNode.insertBefore(a, c); else document.body.appendChild(a);
  });
})();
// נועה 23.10: פרטי הקשר בתחתית כל טופס ובדף התודה / התשלום לא הושלם – "שאלות? כתבו לנו בוואטסאפ: 052-9067101" (לחיץ, פותח וואטסאפ
// עם הודעה לפי הטופס), ומתחתיו האימייל (לחיץ). מחליף את שורת "טלפון · אימייל". בתוך האתר התחתית מוסתרת – לאתר יש משלו.
(function(){
  var MSG = { register: "לגבי ההרשמה לתרגולים השוטפים", marathon: "לגבי ההרשמה למרתון", interest: "לגבי התרגולים בתלם", shibutz: "לגבי טופס השיבוץ",
    pay: "לגבי התשלום", cancel: "לגבי ביטול ההרשמה", "thank-you": "לגבי ההרשמה ששלחתי" };
  var PHONE = "052-9067101", WA = "972529067101", MAIL = "telem.tr@gmail.com";
  var form = document.documentElement.getAttribute("data-form") || "";
  document.addEventListener("DOMContentLoaded", function(){
    if (document.querySelector(".wa-contact")) return;
    var old = document.querySelector("footer .contact") || document.querySelector(".card .contact") || document.querySelector(".contact");
    var host = old || document.querySelector("footer"); if (!host) return;
    var t = form === "payment-failed" ? "שלום, ניסיתי לשלם והתשלום לא הושלם" : ("שלום, יש לי שאלה " + (MSG[form] || "")).trim();
    var box = document.createElement("div"); box.className = "wa-contact";
    var a = document.createElement("a"); a.className = "wa-link"; a.target = "_blank"; a.rel = "noopener"; a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
    a.appendChild(document.createTextNode("💬 וואטסאפ: ")); var n = document.createElement("bdi"); n.textContent = PHONE; a.appendChild(n);
    var m = document.createElement("a"); m.className = "wa-link wa-mail"; m.target = "_blank"; m.rel = "noopener"; m.href = "mailto:" + MAIL; m.appendChild(document.createTextNode("✉️ אימייל: ")); var mb = document.createElement("bdi"); mb.textContent = MAIL; m.appendChild(mb);   // באותה בועה, כמו הוואטסאפ
    var h = document.createElement("div"); h.className = "wa-h"; h.textContent = "שאלות? כתבו לנו";   // נועה: הכול במסגרת אחת – כותרת, ומתחתיה וואטסאפ ואימייל
    box.appendChild(h); box.appendChild(a); box.appendChild(m);
    var pv = document.createElement("a"); pv.className = "wa-privacy"; pv.target = "_blank"; pv.rel = "noopener"; pv.textContent = "מדיניות פרטיות";   // את-46: עד שהאתר החדש באוויר – העמוד באתר הישן
    pv.href = "https://www.telem-tr.co.il/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA"; box.appendChild(pv);
    if (old) { old.parentNode.insertBefore(box, old); old.hidden = true; old.style.display = "none"; } else host.appendChild(box);
  });
})();
// את-37 (נועה 23.10): כרטיס מסלול – אותו מבנה ועיצוב כמו באתר (פס בצבע המסלול, מספר, שם קצר + המשך, התיאור, התשלום החודשי, החד-פעמיים).
// o: {key, color, title, body, early, regular, earlyOn, cut ("8.10.26"), fees:[{amount, label, offset}], offMonth, extra:[html], fold}
window.TELEM_TK = function(o){
  var e = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var NUM = { single: 1, "unlimited-single": 2, double: 3 };
  var SHORT = { single: "מסלול מקצוע אחד", "unlimited-single": "מסלול מקצוע אחד ללא הגבלה", double: "מסלול שני מקצועות" };
  var SUB = { single: "מתמטיקה או אנגלית", "unlimited-single": "מתמטיקה או אנגלית ללא הגבלה בכמות המפגשים", double: "מתמטיקה וגם אנגלית ללא הגבלה בכמות המפגשים" };
  var head = '<div class="tk-head"><div><h3>' + e(SHORT[o.key] || o.title) + '</h3>' + (SUB[o.key] ? '<span class="tk-sub">' + e(SUB[o.key]) + '</span>' : "") + '</div>' + (o.fold ? '<span class="tk-car" aria-hidden="true"></span>' : "") + '</div>';
  var price = o.regular == null ? "" : (o.earlyOn && o.early != null
    ? '<div class="tk-price"><span class="tk-lbl">תשלום חודשי</span><div class="tk-row"><b>' + e(o.early) + ' ₪</b><span>להרשמה מוקדמת<br><small>עד ' + e(o.cut) + '</small></span></div><div class="tk-row"><b>' + e(o.regular) + ' ₪</b><span>להרשמה רגילה<br><small>מ-' + e(o.cut) + ' ואילך</small></span></div></div>'
    : '<div class="tk-price tk-one"><span class="tk-lbl">תשלום חודשי</span><b>' + e(o.regular) + ' ₪</b></div>');
  var fees = (o.fees || []).filter(function(f){ return f && f.amount; }).map(function(f){ return '<b>' + e(f.amount) + ' ₪</b> ' + e(f.label) + (f.offset ? ' (יקוזז מתשלום חודש ' + e(o.offMonth || "יוני") + ')' : ""); });
  var once = fees.length ? '<p class="tk-once">בנוסף, בעת ההרשמה: ' + fees.join(" ו-") + '</p>' : "";
  var extra = (o.extra || []).filter(Boolean).map(function(x){ return '<p class="tk-once tk-more">' + x + '</p>'; }).join("");
  var body = '<div class="tk-body">' + (o.body ? '<p class="tk-desc">' + e(o.body) + '</p>' : "") + price + once + extra + '</div>';
  var cls = 'tk c-' + e(o.color || "red");
  return o.fold ? '<details class="' + cls + ' tk-fold"><summary>' + head + '</summary>' + body + '</details>' : '<div class="' + cls + '">' + head + body + '</div>';
};

// נועה 25.10: שדות חסרים / לא תקינים – קופצים לשדה הראשון המסומן, ושורה אדומה ליד כפתור השליחה
window.TELEM_BAD = function(btn){
  var vis = function(el){ return el && el.offsetParent !== null && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden"; };
  var all = Array.prototype.slice.call(document.querySelectorAll(".invalid, .error-msg"));
  var first = null;
  for (var i = 0; i < all.length && !first; i++) {
    var el = all[i];
    if (el.id === "topError" || el.id === "tlFixNote") continue;
    if (el.classList.contains("invalid") ? vis(el) : (el.textContent.trim() && vis(el))) first = el.classList.contains("invalid") ? el : (el.closest(".field, .consent, .sig-wrap, label") || el);
  }
  if (first) {
    first.scrollIntoView({ behavior: "smooth", block: "center" });
    var inp = first.matches("input, select, textarea") ? first : first.querySelector("input:not([type=hidden]), select, textarea");
    if (inp && inp.type !== "checkbox" && inp.type !== "radio") setTimeout(function(){ try { inp.focus({ preventScroll: true }); } catch (e) {} }, 450);
  }
  if (btn && btn.parentNode) {
    var n = document.getElementById("tlFixNote");
    if (!n) { n = document.createElement("div"); n.id = "tlFixNote"; n.className = "tl-fix-note"; n.setAttribute("role", "alert"); }
    if (n.nextSibling !== btn) btn.parentNode.insertBefore(n, btn);
    n.textContent = "יש שדות שצריך למלא או לתקן – הם מסומנים באדום בטופס.";
    n.hidden = false;
  }
};
window.TELEM_OK = function(){ var n = document.getElementById("tlFixNote"); if (n) n.hidden = true; };
