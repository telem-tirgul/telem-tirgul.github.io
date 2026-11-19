// נועה 7.11: שהנוסח לא "יקפוץ" להורה – הדף מוסתר עד שהנוסח מהמערכת הגיע (texts.js מסיר), לכל היותר 1.2 שניות
(function(){ try { if (/[?&]txedit=1(&|$)/.test(location.search)) return; var h = document.documentElement; h.classList.add("tx-wait");
  var st = document.createElement("style"); st.textContent = "html.tx-wait body{visibility:hidden}"; (document.head || h).appendChild(st);
  setTimeout(function(){ h.classList.remove("tx-wait"); }, 1200); } catch(e) {} })();
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
  try { var sp = new URLSearchParams(location.search), cty = sp.get("city"), sch = sp.get("school"), g0 = {};   // נועה 18.11: העיר ובית הספר – לכל האירועים בדף (ב-GA: מאפיינים מותאמים "form_city", "form_school")
    if (cty && cty.length < 60) g0.form_city = cty; if (sch && sch.length < 80) g0.form_school = sch; if (g0.form_city || g0.form_school) gtag("set", g0); } catch (e) {}
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
// נועה 23.10: פרטי הקשר בתחתית כל טופס ובדף התודה / התשלום לא הושלם – "לשאלות ניתן לפנות אלינו בוואטסאפ: 052-9067101" (לחיץ, פותח וואטסאפ
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
    var FT = function(k, d, l){ var sp = document.createElement("span"); sp.innerHTML = window.TELEM_TXH(k, d, l, "תחתית העמוד"); return sp; };   // נועה 4.11: עריך
    a.appendChild(FT("foot.wa", "💬 וואטסאפ:", "תחתית – וואטסאפ")); a.appendChild(document.createTextNode(" ")); var n = document.createElement("bdi"); n.textContent = PHONE; a.appendChild(n);
    var m = document.createElement("a"); m.className = "wa-link wa-mail"; m.target = "_blank"; m.rel = "noopener"; m.href = "mailto:" + MAIL; m.appendChild(FT("foot.mail", "✉️ אימייל:", "תחתית – אימייל")); m.appendChild(document.createTextNode(" ")); var mb = document.createElement("bdi"); mb.textContent = MAIL; m.appendChild(mb);   // באותה בועה, כמו הוואטסאפ
    var h = document.createElement("div"); h.className = "wa-h"; h.appendChild(FT("foot.h", "לשאלות ניתן לפנות אלינו", "תחתית – כותרת"));   // נועה: הכול במסגרת אחת – כותרת, ומתחתיה וואטסאפ ואימייל
    box.appendChild(h); box.appendChild(a); box.appendChild(m);
    var pv = document.createElement("a"); pv.className = "wa-privacy"; pv.target = "_blank"; pv.rel = "noopener"; pv.appendChild(FT("foot.privacy", "מדיניות פרטיות", "תחתית – מדיניות פרטיות"));   // את-46: עד שהאתר החדש באוויר – העמוד באתר הישן
    pv.href = "https://www.telem-tr.co.il/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA";
    var ac = document.createElement("a"); ac.className = "wa-privacy wa-access"; ac.target = "_blank"; ac.rel = "noopener"; ac.appendChild(FT("foot.access", "הצהרת נגישות", "תחתית – הצהרת נגישות"));   // את-68 (נועה 19.11): נגישות – קישור קבוע בכל טופס (עד האתר החדש – באתר הישן)
    ac.href = "https://www.telem-tr.co.il/accessibillity-statement";
    var lg = document.createElement("div"); lg.className = "wa-legal"; lg.appendChild(pv); lg.appendChild(ac); box.appendChild(lg);   // נועה 19.11: שני הקישורים באותה שורה
    if (!document.getElementById("tlA11yCss")) { var st = document.createElement("style"); st.id = "tlA11yCss";   // את-68: ניגודיות (WCAG AA) – התחתית בלי שקיפות, טקסט כהה יותר
      st.textContent = "footer{opacity:1 !important;color:#6b5f55 !important}.wa-privacy{color:#5c4f45 !important}.priv-note{font-size:13px;color:#5c4f45;margin:10px 0 0;line-height:1.6}.priv-note a{color:inherit;font-weight:700}.wa-legal{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:4px 14px;margin-top:6px}.wa-legal .wa-privacy{margin:0 !important;display:inline}"; document.head.appendChild(st); }
    if (old) { old.parentNode.insertBefore(box, old); old.hidden = true; old.style.display = "none"; } else host.appendChild(box);
  });
})();
// את-37 (נועה 23.10): כרטיס מסלול – אותו מבנה ועיצוב כמו באתר (פס בצבע המסלול, מספר, שם קצר + המשך, התיאור, התשלום החודשי, החד-פעמיים).
// o: {key, color, title, body, early, regular, earlyOn, cut ("8.10.26"), fees:[{amount, label, offset}], offMonth, extra:[html], fold}
// נועה 4.11: הטקסטים הקבועים בכרטיס המסלול ובתחתית – עריכים מ"נוסחי הטפסים" (כשהטופס טוען את texts.js); בלי – ברירת המחדל
window.TELEM_PRIV_URL = "https://www.telem-tr.co.il/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA";   // את-68: מדיניות הפרטיות (עד האתר החדש – באתר הישן)
window.TELEM_TXH = function(k, def, lbl, grp, vals){ if (window.TX && TX.h) return TX.h(k, def, lbl, grp, vals);
  return String(def).replace(/\{([^{}]+)\}/g, function(m, n){ return vals && vals[n] != null ? String(vals[n]).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }) : ""; }); };
window.TELEM_TK = function(o){
  var e = function(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var NUM = { single: 1, "unlimited-single": 2, double: 3 };
  var SHORT = { single: "מסלול מקצוע אחד", "unlimited-single": "מסלול מקצוע אחד ללא הגבלה", double: "מסלול שני מקצועות" };
  var SUB = { single: "מתמטיקה או אנגלית", "unlimited-single": "מתמטיקה או אנגלית ללא הגבלה בכמות המפגשים", double: "מתמטיקה וגם אנגלית ללא הגבלה בכמות המפגשים" };
  var G = "כרטיסי המסלולים", T = function(k, d, l, v){ return window.TELEM_TXH(k, d, l, G, v); };
  var head = '<div class="tk-head"><div><h3>' + (SHORT[o.key] ? T("tk." + o.key + ".name", SHORT[o.key], "שם המסלול – " + SHORT[o.key]) : e(o.title)) + '</h3>' + (SUB[o.key] ? '<span class="tk-sub">' + T("tk." + o.key + ".sub", SUB[o.key], "שורה מתחת לשם – " + SHORT[o.key]) + '</span>' : "") + '</div>' + (o.fold ? '<span class="tk-car" aria-hidden="true"></span>' : "") + '</div>';
  var price = o.regular == null ? "" : (o.earlyOn && o.early != null
    ? '<div class="tk-price"><span class="tk-lbl">' + T("tk.monthly", "תשלום חודשי", "התשלום החודשי – הכותרת") + '</span><div class="tk-row"><b>' + e(o.early) + ' ₪' + (o.star ? String(o.star).split(' ').map(function(x){ return '<sup class="tk-star">' + x + '</sup>'; }).join('') : '') + '</b><span>' + T("tk.early", "להרשמה מוקדמת<br><small>עד {תאריך}</small>", "מחיר להרשמה מוקדמת", { "תאריך": o.cut }) + '</span></div><div class="tk-row"><b>' + e(o.regular) + ' ₪' + (o.star ? String(o.star).split(' ').map(function(x){ return '<sup class="tk-star">' + x + '</sup>'; }).join('') : '') + '</b><span>' + T("tk.regular", "להרשמה רגילה<br><small>מ-{תאריך} ואילך</small>", "מחיר להרשמה רגילה", { "תאריך": o.cut }) + '</span></div></div>'
    : '<div class="tk-price tk-one"><span class="tk-lbl">' + T("tk.monthly", "תשלום חודשי", "התשלום החודשי – הכותרת") + '</span><b>' + e(o.regular) + ' ₪' + (o.star ? String(o.star).split(' ').map(function(x){ return '<sup class="tk-star">' + x + '</sup>'; }).join('') : '') + '</b></div>');
  // נועה 6.11: משפט אחד, עריך כולו ("נוסחי הטפסים" → כרטיסי המסלולים); עם חומרי תרגול / בלי
  var fReg = (o.fees || []).filter(function(f){ return f && f.amount && f.label === "דמי שיבוץ והרשמה"; })[0], fMat = (o.fees || []).filter(function(f){ return f && f.amount && f.label !== "דמי שיבוץ והרשמה"; })[0];
  var fv = { "דמי הרשמה": fReg ? fReg.amount : "", "חומרי תרגול": fMat ? fMat.amount : "", "חודש": o.offMonth || "יוני" };
  var FM = ["tk.fees_mat", "שירות עבור חומרי תרגול דיגיטליים בסך {חומרי תרגול} ₪ ודמי שיבוץ והרשמה בסך {דמי הרשמה} ₪ ייגבו בעת ההרשמה. עלות השירות עבור חומרי התרגול תקוזז מעלות חודש {חודש} בהתאם לתנאי ההתקשרות; דמי השיבוץ וההרשמה אינם ניתנים לביטול.", "תשלום בעת ההרשמה – עיר עם חומרי תרגול"],
      FR = ["tk.fees_reg", "דמי שיבוץ והרשמה בסך {דמי הרשמה} ₪ ייגבו בעת ההרשמה ויקוזזו מעלות חודש {חודש} בהתאם לתנאי ההתקשרות.", "תשלום בעת ההרשמה – עיר בלי חומרי תרגול"];
  if (window.TX && TX.def) [FM, FR].forEach(function(d){ TX.def(d[0], d[1], d[2], { "דמי הרשמה": "", "חומרי תרגול": "", "חודש": "" }, { group: G }); });   // שני הנוסחים מופיעים בעורך תמיד
  var onceTxt = !fReg && !fMat ? "" : (fMat ? T(FM[0], FM[1], FM[2], fv) : T(FR[0], FR[1], FR[2], fv));
  if (o.feesOnly) return onceTxt;   // נועה 6.11: המשפט לבד – מתחת לכל המסלולים (לא בכל כרטיס)
  var once = !onceTxt || o.noOnce ? "" : '<p class="tk-once">' + onceTxt + '</p>';
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

// את-68 (נועה 19.11): תפריט נגישות – אותו כפתור ותפריט כמו באתר (את-69). ההגדרות נשמרות בדפדפן (telem_a11y)
(function(){
  if (window.TELEM_A11Y_MENU) return; window.TELEM_A11Y_MENU = 1;
  var STMT = "https://www.telem-tr.co.il/accessibillity-statement";
  var CSS = ".a11y-btn{position:fixed;bottom:18px;left:18px;right:auto;z-index:60;width:52px;height:52px;border-radius:50%;border:3px solid #fff;background:#1A5C9E;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px -6px rgba(0,0,0,.45);padding:0}"
    + ".a11y-btn:focus-visible,.a11y-panel button:focus-visible,.a11y-panel a:focus-visible{outline:3px solid #C9A45C;outline-offset:2px}"
    + ".a11y-panel{position:fixed;bottom:80px;left:18px;right:auto;z-index:61;width:330px;max-width:calc(100vw - 36px);max-height:calc(100vh - 110px);overflow:auto;background:#fff;border-radius:20px;padding:14px;box-shadow:0 20px 50px -18px rgba(0,0,0,.45);display:flex;flex-direction:column;gap:10px;direction:rtl;text-align:right;font-size:15px;color:#2a2320}"
    + ".a11y-panel[hidden]{display:none}.a11y-h{display:flex;justify-content:space-between;align-items:center;font-size:18px;color:#5A1216}.a11y-x{background:none;border:none;font-size:18px;cursor:pointer;color:#6b5f55}"
    + ".a11y-row{display:flex;justify-content:space-between;align-items:center}.a11y-sz{display:flex;gap:6px}.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}"
    + ".a11y-sz button,.a11y-opt,.a11y-reset{font:inherit;font-size:14px;cursor:pointer;border-radius:12px;border:1.5px solid #E2D6C8;background:#FBF7F2;color:#2a2320;padding:8px 10px}.a11y-opt{text-align:right}"
    + ".a11y-opt[aria-pressed=\"true\"]{background:#1A5C9E;color:#fff;border-color:#1A5C9E}.a11y-reset{background:#fff}.a11y-st{text-align:center;color:#8B1E24;font-weight:700;padding-top:2px}"
    + ".a11y-mag{position:fixed;z-index:70;max-width:min(560px,90vw);background:#111;color:#fff;font-size:26px;line-height:1.4;padding:10px 16px;border-radius:12px;pointer-events:none;direction:rtl;box-shadow:0 10px 30px rgba(0,0,0,.4)}.a11y-mag[hidden]{display:none}"
    + "html.a11y-contrast{filter:contrast(1.4)}html.a11y-contrast p{color:#000 !important}html.a11y-gray{filter:grayscale(1)}html.a11y-dark{filter:invert(1) hue-rotate(180deg)}html.a11y-dark img,html.a11y-dark video,html.a11y-dark iframe,html.a11y-dark canvas,html.a11y-dark .a11y-btn{filter:invert(1) hue-rotate(180deg)}"
    + "html.a11y-light body,html.a11y-light body *:not(.a11y-btn):not(.a11y-btn *):not(.a11y-opt[aria-pressed=\"true\"]):not(.a11y-mag){background-color:#fff !important;background-image:none !important;color:#000 !important;border-color:#000 !important;box-shadow:none !important}"
    + "html.a11y-links a{text-decoration:underline !important;outline:2px dashed #C9A45C;outline-offset:2px}html.a11y-headings h1,html.a11y-headings h2,html.a11y-headings h3,html.a11y-headings h4{outline:2px solid #1A5C9E;outline-offset:4px;text-decoration:underline;text-underline-offset:6px}"
    + "html.a11y-font body,html.a11y-font body *{font-family:Arial,'Helvetica Neue',sans-serif !important;letter-spacing:.01em}html.a11y-spacing body *{line-height:1.9 !important;letter-spacing:.06em !important;word-spacing:.16em !important}"
    + "html.a11y-focus *:focus{outline:4px solid #E8A33D !important;outline-offset:3px !important;box-shadow:0 0 0 7px rgba(26,92,158,.45) !important}"
    + "html.a11y-cursorB,html.a11y-cursorB *{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l14 9-6.5 1.5L15 20l-3 1.4-3.4-7.4L4 18z' fill='%23000' stroke='%23fff' stroke-width='1.2'/%3E%3C/svg%3E\") 4 2,auto !important}"
    + "html.a11y-cursorW,html.a11y-cursorW *{cursor:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l14 9-6.5 1.5L15 20l-3 1.4-3.4-7.4L4 18z' fill='%23fff' stroke='%23000' stroke-width='1.2'/%3E%3C/svg%3E\") 4 2,auto !important}"
    + "html.a11y-noimg img:not(.brand-logo){visibility:hidden !important}html.a11y-noimg *{background-image:none !important}html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}"
    + "body:has(.m-bar:not([hidden])) .a11y-btn{bottom:86px}body:has(.m-bar:not([hidden])) .a11y-panel{bottom:148px}"
    + "@media (max-width:640px){.a11y-btn{bottom:14px;left:14px;width:48px;height:48px}.a11y-panel{left:10px;bottom:72px;width:calc(100vw - 20px)}}@media print{.a11y-btn,.a11y-panel,.a11y-mag{display:none}}";
  var OPT_T = [["spacing","ריווח טקסט"],["font","גופן קריא"],["headings","הדגשת כותרות"],["links","הדגשת קישורים"],["contrast","ניגודיות גבוהה"],["dark","רקע כהה"],["light","רקע בהיר"],["gray","גווני אפור"],["cursorB","סמן גדול שחור"],["cursorW","סמן גדול לבן"],["magnify","זכוכית מגדלת"],["focus","הדגשת מיקוד"],["still","עצירת אנימציות"],["noimg","הסתרת תמונות"]];
  function init(){
    if (document.getElementById("a11y-btn")) return;
    var stl = document.createElement("style"); stl.id = "tlA11yMenu"; stl.textContent = CSS; document.head.appendChild(stl);
    var wrap = document.createElement("div");
    wrap.innerHTML = '<button type="button" class="a11y-btn" id="a11y-btn" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="a11y-panel"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="11" cy="3.6" r="2" fill="currentColor"/><path d="M10.6 7.2v6.2h5.2l2.6 5.4 2-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6 10h4.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7.8 10.6a5.6 5.6 0 1 0 7.6 7.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'
      + '<div class="a11y-panel" id="a11y-panel" role="dialog" aria-label="תפריט נגישות" hidden><div class="a11y-h"><b>תפריט נגישות</b><button type="button" class="a11y-x" id="a11y-x" aria-label="סגירת תפריט הנגישות">✕</button></div>'
      + '<div class="a11y-row"><span>גודל טקסט</span><div class="a11y-sz"><button type="button" data-a11y="smaller" aria-label="הקטנת טקסט">א-</button><button type="button" data-a11y="bigger" aria-label="הגדלת טקסט">א+</button></div></div>'
      + '<div class="a11y-grid">' + OPT_T.map(function(o){ return '<button type="button" class="a11y-opt" data-a11y="' + o[0] + '" aria-pressed="false">' + o[1] + '</button>'; }).join("") + '</div>'
      + '<button type="button" class="a11y-reset" data-a11y="reset">איפוס כל ההתאמות</button><a class="a11y-st" href="' + STMT + '" target="_blank" rel="noopener">הצהרת נגישות</a></div><div class="a11y-mag" id="a11y-mag" aria-hidden="true" hidden></div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    var KEY = "telem_a11y", OPTS = OPT_T.map(function(o){ return o[0]; }), GROUPS = [["contrast","dark","light","gray"],["cursorB","cursorW"]];
    function blank(){ var o = {z:0}; OPTS.forEach(function(k){ o[k] = 0; }); return o; }
    var st = blank(); try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v) Object.keys(st).forEach(function(k){ if (v[k] != null) st[k] = v[k]; }); } catch(e) {}
    var root = document.documentElement, btn = document.getElementById("a11y-btn"), panel = document.getElementById("a11y-panel"), mag = document.getElementById("a11y-mag");
    function apply(){ var zs = [1, 1.1, 1.2, 1.32, 1.45]; st.z = Math.max(0, Math.min(4, st.z | 0)); document.body.style.zoom = zs[st.z] === 1 ? "" : zs[st.z];
      OPTS.forEach(function(k){ root.classList.toggle("a11y-" + k, !!st[k]); var b = panel.querySelector('[data-a11y="' + k + '"]'); if (b) b.setAttribute("aria-pressed", st[k] ? "true" : "false"); });
      if (!st.magnify) mag.hidden = true; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {} }
    function open(o){ panel.hidden = !o; btn.setAttribute("aria-expanded", o ? "true" : "false"); if (o) { var f = panel.querySelector("button"); if (f) f.focus(); } }
    btn.addEventListener("click", function(){ open(panel.hidden); });
    document.getElementById("a11y-x").addEventListener("click", function(){ open(false); btn.focus(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } });
    panel.addEventListener("click", function(e){ var b = e.target.closest("[data-a11y]"); if (!b) return; var a = b.getAttribute("data-a11y");
      if (a === "bigger") st.z = st.z + 1; else if (a === "smaller") st.z = st.z - 1; else if (a === "reset") st = blank();
      else { var on = !st[a]; GROUPS.forEach(function(g){ if (g.indexOf(a) >= 0) g.forEach(function(k){ st[k] = 0; }); }); st[a] = on ? 1 : 0; }
      apply(); });
    document.addEventListener("mouseover", function(e){ if (!st.magnify) return; var el = e.target.closest("p,li,h1,h2,h3,h4,a,button,label,td,th,span,b,small");
      if (!el || panel.contains(el)) { mag.hidden = true; return; } var t = (el.innerText || "").replace(/\s+/g, " ").trim(); if (!t) { mag.hidden = true; return; }
      mag.textContent = t.length > 220 ? t.slice(0, 220) + "…" : t; mag.hidden = false; });
    document.addEventListener("mousemove", function(e){ if (mag.hidden) return; var x = Math.min(window.innerWidth - mag.offsetWidth - 10, Math.max(10, e.clientX - mag.offsetWidth / 2)), y = e.clientY + 24;
      if (y + mag.offsetHeight > window.innerHeight - 10) y = e.clientY - mag.offsetHeight - 16; mag.style.left = x + "px"; mag.style.top = y + "px"; });
    apply();
  }
  if (window.top !== window) return;   // בתצוגה בתוך מערכת הניהול – בלי הכפתור
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
