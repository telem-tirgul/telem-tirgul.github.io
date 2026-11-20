// 20.11.2026 (מנ-540): "תלם שלי" עברה ל-telem-sheli.pages.dev. מי שהאפליקציה הישנה שמורה אצלו –
// הדפדפן בודק עדכון של sw.js, מקבל את הקובץ הזה: מוחק את הקבצים השמורים, מבטל את עצמו ומעביר לכתובת החדשה.
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); })
    .then(function(){ return self.registration.unregister(); })
    .then(function(){ return self.clients.matchAll({ type: "window" }); })
    .then(function(cs){ cs.forEach(function(c){ try { c.navigate("https://telem-sheli.pages.dev/" + new URL(c.url).hash); } catch (x) {} }); }));
});
