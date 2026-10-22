/* תלם 5.19.100 – נוסחי הטפסים נערכים במערכת הניהול (⚙ ← נוסחי הטפסים; טבלה form_texts, קובץ 88).
   כל טקסט בטופס מסומן data-t="מפתח". הנוסח שבקובץ הוא ברירת המחדל; אם במערכת נשמר נוסח אחר – הוא מוצג במקומו.
   - קודם מהעותק השמור בדפדפן (מיד, בלי הבהוב), ואז מהמסד (ואם השתנה – מתעדכן).
   - טקסטים שנבנים בקוד (למשל תיאור המסלולים) – דרך TX.obj / TX(key, ברירת מחדל).
   - אחרי כל עדכון נשלח האירוע "telem-texts" כדי שהטופס יצייר מחדש את מה שבנוי בקוד.
   עיצוב בטקסט: **מודגש**, שורה חדשה = ירידת שורה. שום HTML אחר לא עובר (הכול מוצג כטקסט). */
(function(){
  var SB = "https://oulivucqbpmbavbavfvy.supabase.co", KEY = "sb_publishable_M8wEF2-9fXMmX0U97nfENw_AfZw9wNz";
  var FORM = (document.documentElement.getAttribute("data-form") || location.pathname.split("/").pop().replace(/\.html?$/, "") || "index");
  var LS = "telem_tx_" + FORM, MAP = {};
  var esc = function(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var fmt = function(s){ return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\r?\n/g, "<br>"); };
  // מהטקסט המקורי (HTML) לנוסח לעריכה: <b> → **, <br> → שורה חדשה
  var toPlain = function(html){ var d = document.createElement("div");
    d.innerHTML = String(html).replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(b|strong)>/gi, "**");
    return (d.textContent || "").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim(); };
  var reg = {};   // מפתחות שנבנים בקוד: key → {def, label}
  function TX(key, def, label){ if (!reg[key]) reg[key] = { def: def, label: label || "" }; var v = MAP[key]; return v != null && v !== "" ? v : def; }
  // אובייקט הגדרות (למשל CONFIG.trackInfo): כל שדה טקסט נרשם ומוחלף במקום, וחוזר לברירת המחדל כשנמחק
  var objs = [];
  TX.obj = function(prefix, obj, fields, label){ objs.push({ p: prefix, o: obj, f: fields, l: label, d: JSON.parse(JSON.stringify(obj)) }); applyObjs(); };
  function applyObjs(){ objs.forEach(function(x){ Object.keys(x.d).forEach(function(k){ x.f.forEach(function(f){ if (x.d[k] && typeof x.d[k][f] === "string")
    x.o[k][f] = TX(x.p + "." + k + "." + f, x.d[k][f], (x.l || "") + " · " + (x.d[k].title || k) + " – " + ({ title: "כותרת", body: "תיאור" }[f] || f)); }); }); }); }
  function apply(){
    var els = document.querySelectorAll("[data-t]");
    for (var i = 0; i < els.length; i++) { var el = els[i], k = el.getAttribute("data-t");
      var ta = el.getAttribute("data-ta");
      if (ta) {   // טקסטים שמחכים בתכונות (data-card / data-phone) – הטופס עצמו מציג אותם (אחרי האירוע telem-texts)
        ta.split(",").forEach(function(a){ a = a.trim(); var an = "data-" + a, kk = k + "." + a;
          if (!el.__txA) el.__txA = {}; if (el.__txA[a] == null) el.__txA[a] = el.getAttribute(an) || "";
          var vv = MAP[kk]; el.setAttribute(an, vv != null && vv !== "" ? vv : el.__txA[a]); });
        continue; }
      // טקסט שהטופס עצמו שינה בקוד (למשל שם המרתון) – לא נוגעים בו
      if (el.__txDef == null) el.__txDef = el.innerHTML;
      if (el.innerHTML !== (el.__txSet ? el.__txLast : el.__txDef)) { el.__txAuto = 1; continue; }
      var v = MAP[k];
      if (v != null && v !== "") { el.innerHTML = fmt(v); el.__txLast = el.innerHTML; el.__txSet = 1; }
      else if (el.__txSet) { el.innerHTML = el.__txDef; el.__txSet = 0; }
    }
    applyObjs();
    try { document.dispatchEvent(new CustomEvent("telem-texts")); } catch(e) {}
  }
  function set(m, save){ MAP = m || {}; if (save) { try { localStorage.setItem(LS, JSON.stringify(MAP)); } catch(e) {} } apply(); }
  // הנוסח המקורי – נשמר מיד (הסקריפט נטען לפני הקוד של הטופס)
  (function(){ var els = document.querySelectorAll("[data-t]"); for (var i = 0; i < els.length; i++) if (els[i].__txDef == null) els[i].__txDef = els[i].innerHTML; })();
  TX.form = FORM; TX.reg = reg; TX.fmt = fmt; TX.toPlain = toPlain;
  TX.preview = function(m){ set(m, false); };   // עורך הנוסחים במערכת: תצוגה חיה בלי לשמור
  TX.map = function(){ return MAP; };
  window.TX = TX;
  if (/[?&]txedit=1(&|$)/.test(location.search)) { applyObjs(); return; }   // בעורך במערכת – רואים את הנוסח המקורי, והעורך שולח את הנוסח (TX.preview)
  var cached = null; try { cached = JSON.parse(localStorage.getItem(LS) || "null"); } catch(e) {}
  if (cached) set(cached, false);
  fetch(SB + "/rest/v1/form_texts?select=key,value&form=eq." + encodeURIComponent(FORM), { headers: { apikey: KEY } })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(rows){ if (!rows) { if (!cached) apply(); return; } var m = {}; rows.forEach(function(r){ m[r.key] = r.value; });
      if (JSON.stringify(m) !== JSON.stringify(cached || {})) set(m, true); else if (!cached) apply(); })
    .catch(function(){ if (!cached) apply(); });
})();
