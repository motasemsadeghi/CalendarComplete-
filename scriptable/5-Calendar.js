// تقویم یکپارچه — ویجت بزرگ Scriptable — همه زیر هم، هر خط در یک خط

// ───────── ابزار تبدیل تاریخ ─────────
function jdiv(a, b) { return Math.trunc(a / b); }
function jmod(a, b) { return a - Math.trunc(a / b) * b; }
function jalCal(jy) {
  var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  var bl = breaks.length, gy = jy + 621, leapJ = -14, jp = breaks[0], jm, jump = 0;
  for (var i = 1; i < bl; i++) { jm = breaks[i]; jump = jm - jp; if (jy < jm) break; leapJ += jdiv(jump, 33) * 8 + jdiv(jmod(jump, 33), 4); jp = jm; }
  var n = jy - jp; leapJ += jdiv(n, 33) * 8 + jdiv(jmod(n, 33) + 3, 4);
  if (jmod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  var leapG = jdiv(gy, 4) - jdiv((jdiv(gy, 100) + 1) * 3, 4) - 150;
  var march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + jdiv(jump + 4, 33) * 33;
  var leap = jmod(jmod(n + 1, 33) - 1, 4); if (leap === -1) leap = 4;
  return { leap: leap, gy: gy, march: march };
}
function g2d(gy, gm, gd) { var d = jdiv((gy + jdiv(gm - 8, 6) + 100100) * 1461, 4) + jdiv(153 * jmod(gm + 9, 12) + 2, 5) + gd - 34840408; d = d - jdiv(jdiv(gy + 100100 + jdiv(gm - 8, 6), 100) * 3, 4) + 752; return d; }
function j2d(jy, jm, jd) { var r = jalCal(jy); return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - jdiv(jm, 7) * (jm - 7) + jd - 1; }
function d2gFromJdn(jdn) { var j = 4 * jdn + 139361631; j = j + jdiv(jdiv(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908; var i = jdiv(jmod(j, 1461), 4) * 5 + 308; var gd = jdiv(jmod(i, 153), 5) + 1; var gm = jmod(jdiv(i, 153), 12) + 1; var gy = jdiv(j, 1461) - 100100 + jdiv(8 - gm, 6); return { gy: gy, gm: gm, gd: gd }; }
function d2j(jdn) { var gy = d2gFromJdn(jdn).gy, jy = gy - 621; var r = jalCal(jy); var jdn1f = g2d(gy, 3, r.march); var k = jdn - jdn1f, jm, jd; if (k >= 0) { if (k <= 185) { jm = 1 + jdiv(k, 31); jd = jmod(k, 31) + 1; return { jy: jy, jm: jm, jd: jd }; } k -= 186; } else { jy -= 1; k += 179; if (r.leap === 1) k += 1; } jm = 7 + jdiv(k, 30); jd = jmod(k, 30) + 1; return { jy: jy, jm: jm, jd: jd }; }
function toJalaali(gy, gm, gd) { return d2j(g2d(gy, gm, gd)); }
function isLeapJalaaliYear(jy) { return jalCal(jy).leap === 0; }
function jalaaliMonthLength(jy, jm) { if (jm <= 6) return 31; if (jm <= 11) return 30; return isLeapJalaaliYear(jy) ? 30 : 29; }
const fa = n => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

// ───────── نام‌ها ─────────
const PERS_MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const PERS_WD = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
const GREG_MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GREG_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const GREG_WD_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const GREG_WD_TR = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

// ───────── تاریخ امروز ─────────
const today = new Date();
const gY = today.getFullYear(), gM = today.getMonth() + 1, gD = today.getDate();
const jsDow = today.getDay();
const persDow = (jsDow + 1) % 7;
const todayJDN = g2d(gY, gM, gD);
const J = toJalaali(gY, gM, gD);

// ───────── تولد ─────────
const BIRTHDAYS = [
  { name: 'معتصم', jm: 8, jd: 1 }
];
function nextBirthdayLine() {
  let best = null;
  for (const b of BIRTHDAYS) {
    let yr = J.jy;
    let day = Math.min(b.jd, jalaaliMonthLength(yr, b.jm));
    let occ = j2d(yr, b.jm, day);
    if (occ < todayJDN) { yr = J.jy + 1; day = Math.min(b.jd, jalaaliMonthLength(yr, b.jm)); occ = j2d(yr, b.jm, day); }
    const diff = occ - todayJDN;
    if (!best || diff < best.diff) best = { name: b.name, diff, jm: b.jm, jd: day };
  }
  if (!best) return "";
  if (best.diff === 0) return "امروز تولد " + best.name + " است";
  if (best.diff === 1) return "فردا تولد " + best.name + " است";
  return "تولد بعدی: " + best.name + " (" + fa(best.jd) + " " + PERS_MONTHS[best.jm - 1] + ")";
}

// ───────── زرتشتی ─────────
const Z_MONTHS = ["فروردین","اردیبهشت","خورداد","تیر","امرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const Z_OFFSET = 2359;
const Z_DAYS = [
  ["هرمزد","(اهورا مزدا) نخستین روز ماه از آنِ اهورامزداست؛ آفریدگار دانا و سرچشمهٔ روشنی و اشه."],
  ["بهمن","(وهومنه) امشاسپند اندیشهٔ نیک و پاسدار چهارپایان سودمند؛ روزی برای مهربانی با جانوران."],
  ["اردیبهشت","(اشه وهیشته) بهترین راستی و نظم هستی؛ امشاسپندی که پاسدار آتش است."],
  ["شهریور","(خشثره وئیریه) فرمانروایی آرمانی و توانایی نیک؛ پاسدار فلزات."],
  ["اسفندارمذ","(سپنته آرمئیتی) فروتنی و مهر مقدس؛ پاسدار زمین و نمادِ بزرگداشت زن."],
  ["خورداد","(هئورتات) رسایی و کمال؛ پاسدار آب‌ها و تندرستی."],
  ["امرداد","(امرتات) بی‌مرگی و جاودانگی؛ پاسدار گیاهان و رویش."],
  ["دی‌به‌آذر","(دثوش) نخستین از چهار روز «دی» (آفریدگار)؛ روزی پیش از آذرروز و نیایش آتش."],
  ["آذر","(آتر) ایزد آتش، فروغ اهورایی و پسر اهورامزدا."],
  ["آبان","(اپو / اردویسور آناهیتا) آب‌های پاک و ایزدبانو آناهیتا، بخشندهٔ باروری و رودها."],
  ["خور","(هور) ایزد خورشید و روشنایی روز؛ روز نیایش خورشید."],
  ["ماه","(ماه) ایزد ماه؛ نگهبان چهارپایان و شمارندهٔ زمان شب‌ها."],
  ["تیر","(تیشتر) ایزد ستارهٔ باران؛ نبردکنندهٔ با خشکسالی."],
  ["گوش","(گئوش اورون) روان آفرینش سودمند و نگهبان چهارپایان؛ روز پاسداشت جانوران."],
  ["دی‌به‌مهر","(دثوش) دومین «دی»؛ روزی پیش از مهرروز."],
  ["مهر","(میثره) ایزد پیمان، دوستی و دادگری."],
  ["سروش","(سروشه) ایزد شنیدن و فرمان‌پذیری؛ نگهبان روان آدمی و پاسدار شب."],
  ["رشن","(رشنو) ایزد دادگری که در سنجش کردار آدمی ترازوی راستی به دست دارد."],
  ["فروردین","(فروهر) روز فروهرها، روان‌های پاکان و نیاکان؛ روز یاد درگذشتگان."],
  ["بهرام","(ورثرغنه) ایزد پیروزی و شکستِ بدی؛ نماد ایستادگی و نیرومندی."],
  ["رام","(رامن) ایزد آرامش، خوشی و هوای خوش؛ همراه با ایزد وای."],
  ["باد","(وایو) ایزد باد که میان زمین و آسمان در رفت‌وآمد است."],
  ["دی‌به‌دین","(دثوش) سومین «دی»؛ روزی پیش از دین‌روز."],
  ["دین","(دئنا) وجدان آدمی و دین راستین؛ ایزدی که راه نیک را می‌نماید."],
  ["ارد","(اشی) ایزدبانوی بخت نیک، پاداش و توانگری درست."],
  ["اشتاد","(اَشتات) ایزد درستی و راست‌کرداری؛ نگهبان نظم و ایمنی."],
  ["آسمان","(اسمان) ایزد آسمان و فراخنای پیرامون جهان."],
  ["زامیاد","(زم) ایزد زمین و پشتیبان پادشاهی و فرّه ایزدی."],
  ["مانتره‌سپند","(مانثره سپنته) سخن مقدس و آموزه‌های اشو زرتشت؛ نیروی نیایش و گفتار راست."],
  ["انیران","(انغرن) روشنایی بی‌آغاز و بی‌پایان؛ آخرین روز ماه و پایان هر دوره."]
];
const Z_EVENTS = [
  [1,1,"نوروز","آغاز سال نو و بیداری طبیعت"],[1,6,"خردادسال","زادروز اشو زرتشت"],[1,19,"فروردینگان","فروهرهای پاکان و یاد نیاکان را پاس می‌دارند"],
  [2,3,"اردیبهشتگان","اشه، راستی و آتش را پاس می‌دارند"],[3,6,"خردادگان","رسایی و آب را پاس می‌دارند"],[4,13,"تیرگان","ایزد تیشتر و باران را پاس می‌دارند"],
  [5,7,"امردادگان","بی‌مرگی و گیاهان را پاس می‌دارند"],[6,4,"شهریورگان","شهریاری نیک و فلزات را پاس می‌دارند"],[7,16,"مهرگان","میثره، پیمان و دوستی را پاس می‌دارند"],
  [7,21,"مهرگان بزرگ","پایان جشن‌های مهرگان (رام‌روز)"],[8,10,"آبانگان","آناهیتا و پاسداشت آب"],[9,9,"آذرگان","آتش و فروغ اهورایی را پاس می‌دارند"],
  [9,30,"شب یلدا","بلندترین شب سال و زایش مهر"],[10,1,"دی‌گان","آفریدگار، اهورامزدا را پاس می‌دارند"],[10,1,"خرم‌روز","نخستین روز دی، روز هرمزد"],
  [10,6,"درگذشت زرتشت","سالروز درگذشت اشو زرتشت"],[10,8,"دی‌گان","جشن روز آفریدگار (دی‌به‌آذر)"],[10,11,"خورروز","جشن ایزد خورشید"],
  [10,15,"دی‌گان","جشن روز آفریدگار (دی‌به‌مهر)"],[10,23,"دی‌گان","جشن روز آفریدگار (دی‌به‌دین)"],[11,2,"بهمنگان","اندیشهٔ نیک و جانوران سودمند را پاس می‌دارند"],
  [11,10,"جشن سده","جشن آتش در دل زمستان؛ ۵۰ روز مانده به نوروز"],[12,5,"اسفندگان","زمین و بزرگداشت زن را پاس می‌دارند"]
];
const Z_GAHANBARS = [[2,11,15,"گاهنبار میدیوزرم","میانهٔ بهار"],[4,11,15,"گاهنبار میدیوشهم","میانهٔ تابستان"],[6,26,30,"گاهنبار پتیه‌شهیم","آوردن خرمن"],[7,26,30,"گاهنبار ایاثرم","بازگشت گله‌ها"],[10,16,20,"گاهنبار میدیارم","میانهٔ سال؛ آفرینش جانوران"]];
const Z_GATHAS = [["اَهنَوَد","بزرگی و سروری؛ از یثا اهو ویریو"],["اُشتَوَد","خوشبختی و روشنایی؛ امید به سعادت و پاداش نیکی"],["سِپَنتمَد","نیروی افزاینده و مقدس؛ اندیشه پاک و سازندگی"],["وَهُوَخشَتَر","فرمانروایی نیک؛ شهریاری بر پایه دادگری"],["وَهیشتوایشت","بهترین آرزو و بالاترین ثروت؛ رسیدن به کمال نهایی"]];
function zoroastrian() {
  const zYear = fa(J.jy + Z_OFFSET); const monthName = Z_MONTHS[J.jm - 1]; let dateText, dayDesc;
  if (J.jm === 12 && J.jd >= 25 && J.jd <= 29) { const g = Z_GATHAS[J.jd - 25]; dateText = g[0] + " روز، " + zYear; dayDesc = g[1]; }
  else if (J.jm === 12 && J.jd === 30) { dateText = "اورداد روز (کبیسه)، " + zYear; dayDesc = "روز افزوده یا بخشیده‌شده"; }
  else { const dd = Z_DAYS[J.jd - 1]; dateText = dd[0] + " شید، " + monthName + " ماه " + zYear; dayDesc = dd[1]; }
  const names = [], descs = [];
  Z_EVENTS.filter(e => e[0] === J.jm && e[1] === J.jd).forEach(e => { names.push(e[2]); descs.push(e[3]); });
  Z_GAHANBARS.forEach(g => { if (g[0] === J.jm && J.jd >= g[1] && J.jd <= g[2]) { names.push(g[3]); descs.push(g[4]); } });
  if (J.jm === 12 && J.jd >= 25 && J.jd <= 29) { names.push("گاهنبار همسپتمدیم"); descs.push("همهٔ سپاهیان گرد آیند؛ آفرینش انسان و فروهرها"); }
  return { dateText, occasion: names.join(" و "), occDesc: descs.join(" | "), dayDesc: dayDesc };
}

// ───────── طبری ─────────
const T_MONTHS = ["فردینه‌ما","کرچه‌ما","هَرِ‌ما","تیرماه","ملاره‌ما","شروینه‌ما","میره‌ما","اونه‌ما","ارکه‌ما","دِماه","وهمنه‌ما","نوروزما"];
const T_START = [5, 2]; const T_PITAK_AFTER = 8; const T_YEAR_OFFSET = 133;
function tabari() {
  const sy = (J.jm > T_START[0] || (J.jm === T_START[0] && J.jd >= T_START[1])) ? J.jy : J.jy - 1;
  const start = j2d(sy, T_START[0], T_START[1]); const end = j2d(sy + 1, T_START[0], T_START[1]);
  const n = todayJDN - start; const len = end - start; const pit = len - 360; const pStart = T_PITAK_AFTER * 30;
  let name, day = null, mi = -1;
  if (n < pStart) { mi = Math.floor(n / 30); name = T_MONTHS[mi]; day = n % 30 + 1; }
  else if (pit === 6 && n === pStart) { name = "شیشک"; }
  else if (n < pStart + pit) { name = "پیتک"; day = n - pStart + 1 - (pit === 6 ? 1 : 0); }
  else { const k = n - pStart - pit; mi = T_PITAK_AFTER + Math.floor(k / 30); name = T_MONTHS[mi]; day = k % 30 + 1; }
  let fest = ""; if (mi === 0 && day === 1) fest = "جشن سال نو طبری"; if (mi === 3 && day === 13) fest = "تیرماه سیزده‌شو";
  const text = (day ? fa(day) + " " : "") + name + "، " + fa(sy + T_YEAR_OFFSET) + " طبری";
  return { text, fest };
}

// ───────── ظاهر — ویجت بزرگ، همه زیر هم ─────────
const bg = new Color("#12141c");
const ink = new Color("#ece6d6");
const inkDim = new Color("#7a7f8e");
const gold = new Color("#f5c26b");
const sage = new Color("#a8d5b5");
const teal = new Color("#9fd3c7");

function centerText(stack, text, size, color, bold) {
  const row = stack.addStack(); row.layoutHorizontally(); row.centerAlignContent(); row.addSpacer();
  const t = row.addText(text);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = color; t.lineLimit = 1; t.minimumScaleFactor = 0.7; t.centerAlignText();
  row.addSpacer(); return t;
}

// ───────── محاسبه ─────────
const z = zoroastrian(); const tb = tabari(); const bdayLine = nextBirthdayLine();
const jalaliText = PERS_WD[persDow] + " " + fa(J.jd) + " " + PERS_MONTHS[J.jm - 1] + " (" + fa(J.jm) + ") " + fa(J.jy) + " (" + fa(J.jy + 1180) + ")";
const gregText = GREG_WD_EN[jsDow] + " " + gD + " " + GREG_MONTHS_EN[gM - 1] + " " + gY;
const turkText = GREG_WD_TR[jsDow] + " " + gD + " " + GREG_MONTHS_TR[gM - 1] + " (" + gM + ") " + gY;

// ───────── ساخت ویجت بزرگ ─────────
const widget = new ListWidget();
widget.backgroundColor = bg;
widget.setPadding(14, 14, 14, 14);

widget.addSpacer(10);
centerText(widget, jalaliText, 32, ink, true);
widget.addSpacer(14);

centerText(widget, z.dateText, 24, gold, false);
widget.addSpacer(10);

centerText(widget, tb.text, 24, sage, false);
widget.addSpacer(10);

centerText(widget, gregText, 24, ink, false);
widget.addSpacer(10);

centerText(widget, turkText, 24, teal, false);
widget.addSpacer(16);

centerText(widget, bdayLine || " ", 24, ink, false);
widget.addSpacer(12);

let occ = z.occasion;
if (tb.fest) occ = occ ? occ + " | " + tb.fest : tb.fest;
if (occ) centerText(widget, occ, 25, ink, true);
else centerText(widget, "امروز مناسبتی ندارد", 23, inkDim, false);

widget.addSpacer(12);
centerText(widget, z.occDesc || " ", 17, teal, false);
widget.addSpacer(8);
centerText(widget, z.dayDesc || " ", 17, teal, false);
widget.addSpacer(10);

const nextMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 5, 0);
widget.refreshAfterDate = nextMidnight;
if (config.runsInWidget) { Script.setWidget(widget); } else { await widget.presentLarge(); }
Script.complete();
