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
