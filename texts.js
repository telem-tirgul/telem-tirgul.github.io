/* תלם 5.19.100 – נוסחי הטפסים נערכים במערכת הניהול (⚙ ← נוסחי הטפסים; טבלאות form_texts / form_text_drafts, קובץ 88).
   - כל טקסט קבוע בטופס מסומן data-t="מפתח". הנוסח שבקובץ = ברירת המחדל; נוסח שפורסם במערכת מוצג במקומו.
   - טקסט שנבנה בקוד (שם המרתון, סכום, תאריכים...) = תבנית: TX.def(מפתח, ברירת מחדל, שם, משבצות) ואז TX.t(מפתח, ערכים).
     בתבנית המשבצות כתובות {שם}, והקוד ממלא אותן. הפלט עטוף ב-<span data-tx> כדי שהעורך ידע שזה נערך.
   - קודם מהעותק השמור בדפדפן (מיד, בלי הבהוב), ואז מהמסד (ואם השתנה – מתעדכן; האירוע "telem-texts").
   - רק עיצוב בסיסי עובר: מודגש, קו תחתון, נטוי, ירידת שורה, צבעים של תלם, קישור (https / טלפון / מייל). שום קוד אחר. */
(function(){
  var SB = "https://oulivucqbpmbavbavfvy.supabase.co", KEY = "sb_publishable_M8wEF2-9fXMmX0U97nfENw_AfZw9wNz";
  var FORM = (document.documentElement.getAttribute("data-form") || location.pathname.split("/").pop().replace(/\.html?$/, "") || "index");
  var LS = "telem_tx_" + FORM, MAP = {}, EDIT = /[?&]txedit=1(&|$)/.test(location.search);
  // צבעי תלם לטקסט (העורך שומר class, לא צבע חופשי)
  var COLORS = { "tx-c1": "#5A1216", "tx-c2": "#B07A0C", "tx-c3": "#6B6B6B", "tx-c4": "#2E7D32" };
  try { var st = document.createElement("style"); st.textContent = Object.keys(COLORS).map(function(c){ return "." + c + "{color:" + COLORS[c] + "}"; }).join("") + ".tx-u{text-decoration:underline}";
        (document.head || document.documentElement).appendChild(st); } catch(e) {}
  var esc = function(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  function hexToRgb(h){ var n = parseInt(h.slice(1), 16); return "rgb(" + (n >> 16) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ")"; }
  // ניקוי: רק התגיות המותרות נשארות; כל השאר – רק הטקסט שלהן
  var OK = { B: 1, STRONG: 1, U: 1, I: 1, EM: 1, BR: 1, SMALL: 1, SPAN: 1, A: 1, FONT: 1 };
  function clean(html){
    var src = document.createElement("template"); src.innerHTML = String(html == null ? "" : html);
    var out = document.createElement("div");
    (function walk(from, to){
      [].slice.call(from.childNodes).forEach(function(n){
        if (n.nodeType === 3) { to.appendChild(document.createTextNode(n.nodeValue)); return; }
        if (n.nodeType !== 1) return;
        var tg = n.tagName, el = null;
        if (/^(SCRIPT|STYLE|TEMPLATE|IFRAME|OBJECT|NOSCRIPT)$/.test(tg)) return;   // בלי התוכן שלהם
        if (OK[tg]) {
          if (tg === "FONT" || tg === "SPAN") {   // צבע: רק מהרשימה; קו תחתון
            var cls = (n.getAttribute("class") || "").split(/\s+/).filter(function(c){ return COLORS[c] || c === "tx-u" || c === "ph-big"; });
            var col = (n.getAttribute("color") || (n.style && n.style.color) || "").toLowerCase();
            if (col) Object.keys(COLORS).forEach(function(c){ if (col === COLORS[c].toLowerCase() || col === hexToRgb(COLORS[c])) cls.push(c); });
            if (n.style && /underline/.test(n.style.textDecoration || "")) cls.push("tx-u");
            if (cls.length) { el = document.createElement("span"); el.className = cls.join(" "); }
          } else if (tg === "A") {
            var h = n.getAttribute("href") || "";
            if (/^(https:\/\/|tel:|mailto:)/i.test(h)) { el = document.createElement("a"); el.setAttribute("href", h);
              if (/^https/i.test(h)) { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
              if (/(^|\s)ph-big(\s|$)/.test(n.getAttribute("class") || "")) el.className = "ph-big";
              if (n.getAttribute("dir") === "ltr") el.setAttribute("dir", "ltr"); }
          } else el = document.createElement(tg === "STRONG" ? "b" : tg === "EM" ? "i" : tg.toLowerCase());
        }
        if (el) { to.appendChild(el); if (tg !== "BR") walk(n, el); } else walk(n, to);
      });
    })(src.content, out);
    return out.innerHTML;
  }
  // נוסח מהמערכת: HTML מנוקה; נוסח בלי תגיות – **מודגש** ושורות
  function fmt(s){ s = String(s == null ? "" : s); if (!/[<>]/.test(s)) s = esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\r?\n/g, "<br>"); return clean(s); }
  var toPlain = function(html){ var d = document.createElement("div"); d.innerHTML = String(html).replace(/<br\s*\/?>/gi, "\n"); return (d.textContent || "").replace(/[ \t]+/g, " ").trim(); };

  // ---------- תבניות (טקסט שנבנה בקוד) ----------
  var reg = {};   // key → { def, label, vars: {שם: הסבר}, req: [משבצות חובה], group }
  function TX(key, def, label){ if (!reg[key]) reg[key] = { def: def, label: label || "", vars: {} }; var v = MAP[key]; return v != null && v !== "" ? v : def; }
  TX.def = function(key, def, label, vars, opt){ opt = opt || {}; if (!reg[key]) reg[key] = { def: def, label: label || key, vars: vars || {}, req: opt.req || [], group: opt.group || "", plain: !!opt.plain }; };
  TX.defs = function(group, list){ list.forEach(function(d){ TX.def(d[0], d[1], d[2], d[3], { req: d[4], group: group, plain: d[5] }); }); };
  // ממלא תבנית: {שם} → הערך (כטקסט). מחזיר HTML עטוף ב-span data-tx (להכנסה עם innerHTML); raw – בלי העטיפה
  TX.t = function(key, vals, raw){
    var r = reg[key], tpl = MAP[key] != null && MAP[key] !== "" ? MAP[key] : (r ? r.def : key);
    var h = fmt(tpl).replace(/\{([^{}<>]{1,40})\}/g, function(m, n){ n = n.trim(); return vals && vals[n] != null ? esc(vals[n]) : ""; });
    return raw ? h : '<span data-tx="' + esc(key) + '">' + h + "</span>";
  };
  // אותו דבר כטקסט פשוט (לכותרות / תכונות)
  TX.text = function(key, vals){ var d = document.createElement("div"); d.innerHTML = TX.t(key, vals, true).replace(/<br\s*\/?>/gi, "\n"); return (d.textContent || "").trim(); };
  // ---------- ניסוח המשבצות (5.19.102): איך מספרים, משך ומחיר נכתבים בתוך המשבצות ----------
  var WG = "ניסוח המשבצות (המילים שנכנסות לתוך המשבצות)";
  var WD = [
    ["w.meet", "מפגש אחד\nשני מפגשים\nשלושה מפגשים\nארבעה מפגשים\nחמישה מפגשים", "מספר המפגשים – שורה לכל מספר (שורה 1 = מפגש אחד, שורה 2 = שני מפגשים...)"],
    ["w.meet_n", "{מספר} מפגשים", "מספר המפגשים – כשאין שורה למספר הזה"],
    ["w.les", "שיעור אקדמי אחד\nשני שיעורים אקדמיים\nשלושה שיעורים אקדמיים\nארבעה שיעורים אקדמיים\nחמישה שיעורים אקדמיים\nשישה שיעורים אקדמיים\nשבעה שיעורים אקדמיים\nשמונה שיעורים אקדמיים\nתשעה שיעורים אקדמיים\nעשרה שיעורים אקדמיים", "שיעורים במפגש – שורה לכל מספר"],
    ["w.les_n", "{מספר} שיעורים אקדמיים", "שיעורים במפגש – כשאין שורה למספר הזה"],
    ["w.les_min", "45", "כמה דקות הן שיעור אחד"],
    ["w.hour", "שעה\nשעתיים\nשלוש שעות\nארבע שעות\nחמש שעות", "משך – שעות שלמות, שורה לכל מספר"],
    ["w.hour_n", "{מספר} שעות", "משך – שעות, כשאין שורה למספר הזה"],
    ["w.min", "15: ורבע\n30: וחצי\n45: ושלושה רבעים", "משך – תוספת דקות אחרי השעות (דקות: מילים)"],
    ["w.min_n", "ו-{מספר} דקות", "משך – תוספת דקות אחרת"],
    ["w.min_only", "{מספר} דקות", "משך – פחות משעה"],
    ["w.price", "{סכום} ₪", "מחיר – איך נכתב סכום"]
  ];
  var wReg = function(){ WD.forEach(function(d){ if (!reg[d[0]]) reg[d[0]] = { def: d[1], label: d[2], vars: {}, req: [], group: WG, plain: true }; }); };
  var wv = function(k){ wReg(); var v = MAP[k]; if (v == null || v === "") { for (var i = 0; i < WD.length; i++) if (WD[i][0] === k) return WD[i][1]; return ""; } return toPlain(fmt(v)); };
  var wLine = function(k, n){ var l = wv(k).split(/\n/)[n - 1]; return l && l.trim() ? l.trim() : null; };
  var wFill = function(k, n){ return wv(k).replace(/\{[^{}]*\}/g, String(n)); };
  TX.W = {
    meet: function(n){ return wLine("w.meet", n) || wFill("w.meet_n", n); },
    lessons: function(k){ return wLine("w.les", k) || wFill("w.les_n", k); },
    lessonMin: function(){ var m = parseInt(wv("w.les_min"), 10); return m > 0 && m < 300 ? m : 45; },
    dur: function(d){ var h = Math.floor(d / 60), m = d % 60;
      if (!h) return wFill("w.min_only", d);
      var H = wLine("w.hour", h) || wFill("w.hour_n", h); if (!m) return H;
      var M = null; wv("w.min").split(/\n/).forEach(function(l){ var x = /^\s*(\d+)\s*[:=]\s*(.+)$/.exec(l); if (x && Number(x[1]) === m) M = x[2].trim(); });
      return H + " " + (M || wFill("w.min_n", m)); },
    price: function(x){ return wFill("w.price", Math.round(Number(x))); }
  };

  // אובייקט הגדרות (למשל CONFIG.trackInfo): כל שדה טקסט נרשם ומוחלף במקום
  var objs = [];
  TX.obj = function(prefix, obj, fields, label){ objs.push({ p: prefix, o: obj, f: fields, l: label, d: JSON.parse(JSON.stringify(obj)) }); applyObjs(); };
  function applyObjs(){ objs.forEach(function(x){ Object.keys(x.d).forEach(function(k){ x.f.forEach(function(f){ if (x.d[k] && typeof x.d[k][f] === "string") {
    var key = x.p + "." + k + "." + f; if (!reg[key]) reg[key] = { def: x.d[k][f], label: (x.d[k].title || k) + " – " + ({ title: "כותרת", body: "תיאור" }[f] || f), vars: {}, req: [], group: x.l || "", plain: true };
    var v = MAP[key]; x.o[k][f] = v != null && v !== "" ? toPlain(fmt(v)) : x.d[k][f]; } }); }); }); }

  // ---------- טקסטים קבועים (data-t) ----------
  function apply(){
    var els = document.querySelectorAll("[data-t]");
    for (var i = 0; i < els.length; i++) { var el = els[i], k = el.getAttribute("data-t");
      var ta = el.getAttribute("data-ta");
      if (ta) {   // טקסטים בתכונות (data-card / data-phone) – הטופס עצמו מציג אותם (אחרי האירוע telem-texts)
        ta.split(",").forEach(function(a){ a = a.trim(); var an = "data-" + a, kk = k + "." + a;
          if (!el.__txA) el.__txA = {}; if (el.__txA[a] == null) el.__txA[a] = el.getAttribute(an) || "";
          var vv = MAP[kk]; el.setAttribute(an, vv != null && vv !== "" ? toPlain(fmt(vv)) : el.__txA[a]); });
        continue; }
      if (el.__txDef == null) el.__txDef = el.innerHTML;
      if (el.innerHTML !== (el.__txSet ? el.__txLast : el.__txDef)) { el.__txAuto = 1; continue; }   // הטופס עצמו שינה בקוד – לא נוגעים
      var v = MAP[k];
      if (v != null && v !== "") { el.innerHTML = el.tagName === "OPTION" ? esc(toPlain(fmt(v))) : fmt(v); el.__txLast = el.innerHTML; el.__txSet = 1; }
      else if (el.__txSet) { el.innerHTML = el.__txDef; el.__txSet = 0; }
    }
    applyObjs();
    try { document.dispatchEvent(new CustomEvent("telem-texts")); } catch(e) {}
  }
  function set(m, save){ MAP = m || {}; if (save) { try { localStorage.setItem(LS, JSON.stringify(MAP)); } catch(e) {} } apply(); }
  (function(){ var els = document.querySelectorAll("[data-t]"); for (var i = 0; i < els.length; i++) if (els[i].__txDef == null) els[i].__txDef = els[i].innerHTML; })();
  TX.form = FORM; TX.reg = reg; TX.fmt = fmt; TX.clean = clean; TX.toPlain = toPlain; TX.esc = esc; TX.COLORS = COLORS; TX.edit = EDIT;
  TX.preview = function(m){ set(m, false); };   // עורך הנוסחים: תצוגה חיה בלי לשמור
  TX.map = function(){ return MAP; };
  window.TX = TX;
  // בעורך במערכת – הטיוטה מגיעה מהעורך (sessionStorage של אותו אתר, לפני שהקוד של הטופס רץ – גם לתבניות), ושינויים חיים דרך TX.preview
  // TX.ready – הנוסח מהמסד הגיע (או שיש עותק שמור / תקלה / עברו 2 שניות). טקסט שנבנה בקוד מחכה לזה בכניסה הראשונה.
  var readyFn, done = false; TX.ready = new Promise(function(res){ readyFn = res; });
  var ready = function(){ if (!done) { done = true; readyFn(); } };
  if (EDIT) { ready(); var em = null; try { em = JSON.parse(sessionStorage.getItem("telem_tx_edit_" + FORM) || "null"); } catch(e) {} if (em) set(em, false); return; }
  var cached = null; try { cached = JSON.parse(localStorage.getItem(LS) || "null"); } catch(e) {}
  if (cached) { set(cached, false); ready(); }
  setTimeout(ready, 2000);
  fetch(SB + "/rest/v1/form_texts?select=key,value&form=eq." + encodeURIComponent(FORM), { headers: { apikey: KEY } })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(rows){ if (!rows) { ready(); return; } var m = {}; rows.forEach(function(r){ m[r.key] = r.value; });
      if (JSON.stringify(m) !== JSON.stringify(cached || {})) set(m, true); ready(); })
    .catch(ready);
})();
