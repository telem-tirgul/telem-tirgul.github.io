// תלם – עיצוב אחיד לכל הטפסים (נועה 23.10.2026): הטפסים תמיד בהירים, כמו האתר.
// כללי "רק במצב בהיר" חלים תמיד, וכללי "מצב כהה" יורדים. רץ מיד אחרי site-look.css (בסוף ה-head).
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
