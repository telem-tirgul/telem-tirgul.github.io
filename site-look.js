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
    var m = document.createElement("a"); m.className = "wa-link wa-mail"; m.href = "mailto:" + MAIL; m.appendChild(document.createTextNode("✉️ אימייל: ")); var mb = document.createElement("bdi"); mb.textContent = MAIL; m.appendChild(mb);   // באותה בועה, כמו הוואטסאפ
    var h = document.createElement("div"); h.className = "wa-h"; h.textContent = "שאלות? כתבו לנו";   // נועה: כותרת, ומתחתיה וואטסאפ ואימייל זה מתחת לזה
    box.appendChild(h); box.appendChild(a); box.appendChild(m);
    if (old) { old.parentNode.insertBefore(box, old); old.hidden = true; old.style.display = "none"; } else host.appendChild(box);
  });
})();
