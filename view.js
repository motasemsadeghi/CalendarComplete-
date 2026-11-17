// view.js — zoom and "no clipping" controls (saved in this browser)
(function () {
  const K = "view-prefs", root = document.documentElement;
  let p = { z: 100, noclip: true };
  try { Object.assign(p, JSON.parse(localStorage.getItem(K)) || {}); } catch {}
  const apply = () => {
    p.z = Math.min(200, Math.max(60, p.z));
    root.style.setProperty("--z", p.z / 100);
    document.body.classList.toggle("clip", !p.noclip);
    document.getElementById("zv").textContent = p.z + "%";
    document.getElementById("nc").checked = p.noclip;
    try { localStorage.setItem(K, JSON.stringify(p)); } catch {}
  };
  document.getElementById("zin").onclick = () => { p.z += 10; apply(); };
  document.getElementById("zout").onclick = () => { p.z -= 10; apply(); };
  document.getElementById("zv").onclick = () => { p.z = 100; apply(); };
  document.getElementById("nc").onchange = e => { p.noclip = e.target.checked; apply(); };
  apply();
})();
