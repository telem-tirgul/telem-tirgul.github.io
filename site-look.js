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
