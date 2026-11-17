const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const row = (t, cls = "") => `<div class="cal ${cls}">${esc(t || " ")}</div>`;
function render() {
  const c = calendarLines(new Date());
  $("main").innerHTML = `<div class="calwrap">${row(c.jalali, "k1")}${row(c.zoro, "gold")}${row(c.tabari, "sage")}${row(c.greg)}${row(c.turk, "teal")}<br>${row(c.bday)}
    ${c.occ ? row(c.occ, "k1") : row("امروز مناسبتی ندارد", "dim")}${row(c.occDesc, "teal sm")}${row(c.dayDesc, "teal sm")}</div>`;
}
render();
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
setInterval(render, 60000);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
