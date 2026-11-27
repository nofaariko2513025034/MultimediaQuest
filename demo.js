/* demo.js: simulasi interaktif dan contoh visual tiap modul */
const SC = {
    city: { n: "Potret kota", sk: ["#2d3a8c", "#e98a5b"], bl: ["#1c2147", "#262c5c"], gr: "#2e3350", su: "#e5484d", bk: ["#ffcf5a", "#ff7aa8", "#7ad7ff", "#7affc8"] },
    night: { n: "Jalan malam", sk: ["#080b24", "#1d2152"], bl: ["#10122e", "#171a3d"], gr: "#1a1c33", su: "#35c4a0", bk: ["#ffd66b", "#ff8a5c", "#fff1b8", "#8ee0ff"], car: 1 },
    sport: { n: "Lapangan olahraga", sk: ["#5fb4ff", "#d8f0ff"], bl: ["#3f7a4d", "#4c8f5c"], gr: "#3d8f4f", su: "#f2b01e", bk: ["#ff5a5f", "#ffffff", "#ffd23f", "#3bb4ff"] }
};
let UID = 0, cur = 0;

/* Pasang foto/video asli di sini (taruh file di folder media/). Contoh:
   MEDIA[0].push({ t: "img", s: "media/dslr.jpg", c: "Kamera DSLR" });
   MEDIA[1].push({ t: "video", s: "media/shutter.mp4", c: "Shutter 1/15 vs 1/1000" }); */
const MEDIA = [
    [], // Modul 1
    [{ t: "img", s: "media/bokeh-nyata.jpg", c: "Contoh hasil nyata: Bukaan f/1.8 (Bokeh)" }], // Modul 2
    [{ t: "img", s: "media/thirds-nyata.jpg", c: "Contoh hasil nyata: Komposisi Rule of Thirds" }], // Modul 3
    []  // Modul 4
];

function svgScene(k = "city", p = "", o = {}) {
    const S = SC[k] || SC.city, gy = o.gy || 205, sc = o.sc || 1, sx = o.sx || 200;
    const xs = [[20, 40], [70, 70], [130, 30], [250, 50], [310, 75], [360, 35], [290, 110], [50, 120], [180, 20], [220, 90]];
    const bk = xs.map((c, i) => `<circle cx="${c[0]}" cy="${c[1] + 40}" r="9" fill="${S.bk[i % 4]}"/>`).join("");
    const bl = [[10, 90, 60], [90, 60, 50], [230, 80, 70], [320, 50, 60]].map((b, i) => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${gy - b[1]}" fill="${S.bl[i % 2]}"/>`).join("");
    const mv = S.car ? `<rect x="40" y="${gy + 9}" width="46" height="16" rx="6" fill="#ff4d4d"/><circle cx="84" cy="${gy + 17}" r="5" fill="#fff6c9"/>` : `<circle cx="60" cy="${gy + 23}" r="${k === "sport" ? 15 : 13}" fill="${k === "sport" ? "#fff" : "#35e0c6"}"/>`;
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Contoh foto: ${S.n}"><defs>
<filter id="${p}fb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur id="${p}gb" stdDeviation="${o.bg || 0}"/></filter>
<filter id="${p}fm" x="-60%" y="-30%" width="220%" height="160%"><feGaussianBlur id="${p}gm" stdDeviation="${o.mx || "0 0"}"/></filter>
<filter id="${p}fn"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter>
<linearGradient id="${p}sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.sk[0]}"/><stop offset="1" stop-color="${S.sk[1]}"/></linearGradient></defs>
<g id="${p}fz"><rect width="400" height="260" fill="url(#${p}sk)"/>
<g filter="url(#${p}fb)">${bl}${bk}</g>
<rect y="${gy}" width="400" height="${260 - gy}" fill="${S.gr}"/>
<g transform="translate(${sx} ${gy}) scale(${sc}) translate(-200 -205)"><circle cx="200" cy="105" r="18" fill="#f2c9a5"/><rect x="176" y="125" width="48" height="85" rx="18" fill="${S.su}"/><rect x="186" y="205" width="10" height="38" fill="#222"/><rect x="204" y="205" width="10" height="38" fill="#222"/></g>
<g${o.anim ? ' class="mv"' : ""}><g filter="url(#${p}fm)">${mv}</g></g>
<rect id="${p}ov" width="400" height="260" fill="#fff" opacity="0"/>
<rect id="${p}nz" width="400" height="260" filter="url(#${p}fn)" opacity="${o.nz || 0}" style="mix-blend-mode:overlay"/></g>${o.ov || ""}</svg>`;
}
const sf = (k, o, cap) => `<figure class="ph"><div class="frame">${svgScene(k, "u" + (++UID) + "_", o)}</div><figcaption>${cap}</figcaption></figure>`;

function usrMedia(k) {
    return MEDIA[k].length ? `<div class="um">${MEDIA[k].map(m => `<figure class="ph">${m.t === "video" ? `<video src="${m.s}" controls playsinline preload="metadata"></video>` : `<img src="${m.s}" alt="${m.c}" loading="lazy">`}<figcaption>${m.c}</figcaption></figure>`).join("")}</div>` : "";
}

/* ---------- Modul 1: kamera ---------- */
const CAMP = {
    dial: ["Mode dial", "Memilih mode: Auto, P, A (prioritas bukaan), S (prioritas shutter), dan M (manual)."],
    rana: ["Tombol rana (shutter)", "Tekan setengah untuk fokus, tekan penuh untuk memotret. Tahan agar tidak goyang."],
    lensa: ["Lensa", "Lensa fix: bukaan lebar dan tajam. Lensa zoom: fleksibel untuk framing. Ring fokus untuk fokus manual."],
    vf: ["Viewfinder", "Jendela bidik untuk melihat komposisi dan indikator eksposur. Kamera ponsel memakai layar sebagai gantinya."]
};
function camSel(k) {
    Object.keys(CAMP).forEach(x => $("cp-" + x).classList.toggle("on", x === k));
    Object.keys(CAMP).forEach(x => $("cb-" + x).setAttribute("aria-pressed", x === k));
    $("cam-txt").innerHTML = `<b>${CAMP[k][0]}</b><br>${CAMP[k][1]}`;
}
function camDemo() {
    return `<div class="frame cam"><svg viewBox="0 0 400 250" role="img" aria-label="Diagram kamera dengan mode dial, tombol rana, lensa, dan viewfinder">
<rect width="400" height="250" fill="#1b1f45"/>
<path d="M150 80 l20 -32 h60 l20 32z" fill="#2c3160"/><rect x="30" y="80" width="340" height="140" rx="16" fill="#2c3160"/><rect x="30" y="120" width="60" height="100" rx="14" fill="#3a4080"/>
<rect id="cp-vf" class="hs" x="187" y="52" width="26" height="14" rx="3" fill="#8ad0ff"/>
<rect id="cp-dial" class="hs" x="68" y="62" width="44" height="20" rx="5" fill="#ffcf5a"/>
<circle id="cp-rana" class="hs" cx="320" cy="70" r="11" fill="#ff5a72"/>
<g id="cp-lensa" class="hs"><circle cx="205" cy="152" r="62" fill="#12142a" stroke="#555a8c" stroke-width="6"/><circle cx="205" cy="152" r="40" fill="#1d2152" stroke="#3b49df" stroke-width="3"/><circle cx="205" cy="152" r="14" fill="#35e0c6" opacity=".6"/><circle cx="192" cy="138" r="6" fill="#fff" opacity=".5"/></g></svg></div>
<div class="seg" role="group" aria-label="Bagian kamera">${Object.keys(CAMP).map(k => `<button id="cb-${k}" aria-pressed="false" onclick="camSel('${k}')">${CAMP[k][0]}</button>`).join("")}</div>
<p class="note" id="cam-txt" aria-live="polite">Pilih salah satu bagian kamera di atas untuk melihat fungsinya.</p>
<p class="note">Jenis kamera: <b>DSLR</b> (cermin dan prisma, bodi besar), <b>mirrorless</b> (tanpa cermin, ringkas), dan <b>ponsel</b> (sensor kecil, serba otomatis).</p>`;
}

/* ---------- Modul 2: segitiga eksposur ---------- */
function expTab(n) {
    [0, 1, 2].forEach(i => { $("ex" + i).hidden = i !== n; $("eb" + i).setAttribute("aria-pressed", i === n) });
}
function expDemo() {
    const sh = [[1000, "1/1000: gerakan membeku"], [125, "1/125: sedikit blur"], [15, "1/15: blur kuat"]];
    return `<div class="seg" role="group" aria-label="Pilih parameter">${["Aperture", "Shutter (video)", "ISO"].map((x, i) => `<button id="eb${i}" aria-pressed="${i === 0}" onclick="expTab(${i})">${x}</button>`).join("")}</div>
<div id="ex0"><div class="pair">${sf("city", { bg: 11 }, "f/1.8: latar sangat blur (bokeh)")}${sf("city", { bg: .6 }, "f/16: latar ikut tajam")}</div>
<p class="note">Perhatikan lampu dan gedung di belakang. Bukaan lebar (angka kecil) memisahkan subjek dari latar.</p></div>
<div id="ex1" hidden><div id="vid" class="tri">${sh.map(s => sf("sport", { mx: Math.min(40, 600 / parseInt(s[0])) + " 0", anim: 1 }, s[1])).join("")}</div>
<button class="btn o sm" onclick="$('vid').classList.toggle('paused')">⏯ Jeda / putar</button>
<p class="note">Bola melintas dengan kecepatan sama. Makin lambat shutter, makin panjang jejak blur-nya.</p></div>
<div id="ex2" hidden><div class="pair">${sf("night", { nz: 0 }, "ISO 100: bersih dan halus")}${sf("night", { nz: .6 }, "ISO 6400: terang tetapi berbutir (noise)")}</div>
<p class="note">ISO tinggi membantu saat gelap, tetapi harganya adalah noise.</p></div>`;
}

/* ---------- Modul 3: komposisi dan angle ---------- */
const cp = { t: 1, l: 0, f: 0, a: 1, s: 0 };
function compSvg() {
    const g = [{ gy: 165, sc: 1.5 }, { gy: 205, sc: 1 }, { gy: 238, sc: .75 }][cp.a], sx = cp.s ? 267 : 200;
    let ov = "";
    if (cp.t) ov += `<g stroke="#fff" stroke-opacity=".75"><path d="M133 0V260M267 0V260M0 87H400M0 173H400"/></g>${[133, 267].map(x => [87, 173].map(y => `<circle cx="${x}" cy="${y}" r="6" fill="#ffcf5a"/>`).join("")).join("")}`;
    if (cp.l) ov += `<g stroke="#ffcf5a" stroke-width="2.5" opacity=".9"><path d="M0 260L${sx} ${g.gy - 60}M400 260L${sx} ${g.gy - 60}M130 260L${sx} ${g.gy - 60}M270 260L${sx} ${g.gy - 60}"/></g>`;
    if (cp.f) ov += `<path fill="#05061a" fill-opacity=".88" fill-rule="evenodd" d="M0 0H400V260H0Z M${sx - 95} 25H${sx + 95}V235H${sx - 95}Z"/>`;
    return svgScene("city", "cp_", { gy: g.gy, sc: g.sc, sx, ov });
}
function compSet(k, v) {
    cp[k] = v;
    $("cp-view").innerHTML = compSvg();
    document.querySelectorAll("[data-cp]").forEach(b => { const [kk, vv] = b.dataset.cp.split(":"); b.setAttribute("aria-pressed", kk === "a" || kk === "s" ? cp[kk] == vv : !!cp[kk]) });
    $("cp-note").textContent = ["Frog eye: subjek tampak megah dan dominan.", "Eye level: terasa netral dan akrab.", "High angle: subjek tampak kecil dan lebih lemah."][cp.a];
}
function compDemo() {
    const b = (k, v, t) => `<button data-cp="${k}:${v}" aria-pressed="${k === "a" || k === "s" ? cp[k] == v : !!cp[k]}" onclick="compSet('${k}',${k === "a" || k === "s" ? v : cp[k] ? 0 : 1})">${t}</button>`;
    return `<div class="frame"><div id="cp-view">${compSvg()}</div></div>
<p class="cap">Garis bantu</p><div class="seg">${b("t", 1, "Rule of thirds")}${b("l", 1, "Leading lines")}${b("f", 1, "Framing")}</div>
<p class="cap">Posisi subjek</p><div class="seg">${b("s", 0, "Di tengah")}${b("s", 1, "Titik thirds")}</div>
<p class="cap">Angle kamera</p><div class="seg">${b("a", 0, "Frog eye")}${b("a", 1, "Eye level")}${b("a", 2, "High angle")}</div>
<p class="note" id="cp-note">Eye level: terasa netral dan akrab.</p>`;
}

/* ---------- Modul 4: lighting dan editing ---------- */
const lt = { k: 1, f: 0, b: 0, s: 0 }, ed = { e: 0, c: 0, w: 0 };
function lightSvg() {
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Potret dengan pencahayaan studio"><defs>
<radialGradient id="kl" cx=".15" cy=".4" r="${lt.s ? 1.1 : .75}"><stop offset="0" stop-color="#ffe3c4" stop-opacity=".95"/><stop offset="1" stop-color="#ffe3c4" stop-opacity="0"/></radialGradient>
<radialGradient id="fl" cx=".9" cy=".5" r=".9"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".5"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient>
<filter id="sh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${lt.s ? 14 : 1.5}"/></filter><clipPath id="hc"><circle cx="200" cy="110" r="56"/></clipPath></defs>
<rect width="400" height="260" fill="#272c58"/>
<ellipse cx="300" cy="125" rx="46" ry="66" fill="#000" opacity="${lt.k ? .5 : 0}" filter="url(#sh)"/>
<path d="M105 260q0-72 95-72t95 72z" fill="#3b4177"/>
<circle cx="200" cy="110" r="56" fill="#5a3b2a"/>
<g clip-path="url(#hc)"><rect x="140" y="50" width="120" height="120" fill="url(#kl)" opacity="${lt.k}"/><rect x="140" y="50" width="120" height="120" fill="url(#fl)" opacity="${lt.f}"/></g>
<circle cx="182" cy="105" r="4" fill="#12142a"/><circle cx="218" cy="105" r="4" fill="#12142a"/><path d="M186 132q14 10 28 0" stroke="#12142a" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M146 98a56 56 0 0 1 108 0M112 238q8-40 50-46M288 238q-8-40-50-46" stroke="#ffe9a8" stroke-width="4" fill="none" stroke-linecap="round" opacity="${lt.b}"/></svg>`;
}
const LT_INFO = {
    k: "Key light: cahaya utama paling terang yang menentukan arah bayangan dan bentuk wajah.",
    f: "Fill light: cahaya pengisi dari sisi berlawanan untuk mengurangi bayangan gelap dari key light.",
    b: "Back light: cahaya dari belakang untuk memisahkan subjek dari latar belakang (rim light).",
    s: "Cahaya lembut (softbox): menyebarkan cahaya agar bayangan halus dan tekstur kulit tampak mulus."
};

function ltSet(k) {
    lt[k] = lt[k] ? 0 : 1;
    $("lt-view").innerHTML = lightSvg();
    document.querySelectorAll("[data-lt]").forEach(b => b.setAttribute("aria-pressed", !!lt[b.dataset.lt]));
    $("lt-note").textContent = LT_INFO[k];
}
function edUpd(k, v) {
    ed[k] = +v;
    // Update angka indikator pada label slider
    const valEl = $("ev-" + k);
    if (valEl) valEl.textContent = (ed[k] > 0 ? "+" : "") + ed[k];
    
    $("ed-fr").style.filter = ed.off ? "none" : `brightness(${1 + ed.e / 100}) contrast(${1 + ed.c / 100}) sepia(${Math.max(0, ed.w) / 100 * .6}) hue-rotate(${Math.min(0, ed.w) * .8}deg)`;
}

function edReset() {
    ed.e = 0; ed.c = 0; ed.w = 0; ed.off = false;
    ["e", "c", "w"].forEach(k => {
        const sl = $("esl-" + k);
        if (sl) sl.value = 0;
        edUpd(k, 0);
    });
}
function edOrig(on) { ed.off = on; edUpd("e", ed.e) }
function lightDemo() {
    const tb = (k, t) => `<button data-lt="${k}" aria-pressed="${!!lt[k]}" onclick="ltSet('${k}')">${t}</button>`;
    const sl = (k, n) => `<div class="sl"><label><span>${n}</span><b id="ev-${k}">0</b></label><input id="esl-${k}" type="range" min="-50" max="50" value="${ed[k]}" aria-label="${n}" oninput="edUpd('${k}',this.value)"></div>`;
    return `<p class="cap">Pencahayaan studio</p><div class="frame"><div id="lt-view">${lightSvg()}</div></div>
<div class="seg">${tb("k", "Key light")}${tb("f", "Fill light")}${tb("b", "Back light")}${tb("s", "Cahaya lembut")}</div>
<p class="note" id="lt-note">Key light aktif: cahaya utama untuk membentuk dimensi subjek.</p>
<p class="cap">Editing awal</p><div class="frame"><div id="ed-fr">${svgScene("city", "ed_", { bg: 3 })}</div></div>
${sl("e", "Exposure")}${sl("c", "Contrast")}${sl("w", "White balance (dingin ↔ hangat)")}
<div class="seg">
    <button class="btn o sm" onpointerdown="edOrig(true)" onpointerup="edOrig(false)" onpointerleave="edOrig(false)">Tahan lihat asli</button>
    <button class="btn o sm" onclick="edReset()">↺ Reset Editing</button>
</div>`;
}

const MOD_TIPS = [
    "💡 Tips: Gunakan tali strap kamera di leher atau pergelangan tangan saat memotret di luar ruangan.",
    "💡 Tips: Mulai atur Aperture terlebih dahulu untuk menentukan efek blur, baru sesuaikan Shutter dan ISO.",
    "💡 Tips: Aktifkan fitur Grid (garis bantu) di layar HP atau viewfinder kamera agar garis horizon tidak miring.",
    "💡 Tips: Hindari menggeser slider editing terlalu ekstrem agar warna kulit tetap terlihat alami."
];

const DEMO = [camDemo, expDemo, compDemo, lightDemo];
function vModule() {
    const d = Object.keys(st.mods).length, m = MODS[cur];
    return `<div class="c prog"><b>${d} dari ${MODS.length} modul selesai</b><div class="bar"><i style="width:${d / MODS.length * 100}%"></i></div></div>
<div class="steps">${MODS.map((x, k) => `<button class="stp m${k}" aria-current="${k === cur}" onclick="cur=${k};go('mod')"><span>${st.mods[k] ? "✓" : x.i}</span>${x.n}</button>`).join("")}</div>
<div class="split"><div class="c demo m${cur}"><h2>Coba langsung</h2>${DEMO[cur]()}${usrMedia(cur)}</div>
<article class="c mc m${cur}"><div class="mi">${m.i}</div><h3><span class="mn">Modul ${cur + 1}</span>${m.n}</h3><ul>${m.p.map(x => `<li>${x}</li>`).join("")}</ul>
${st.mods[cur] ? '<span class="tag ok">✓ Selesai</span>' : `<button class="btn" onclick="fin(${cur})">Tandai selesai (+30 XP)</button>`}
${cur === 1 ? '<button class="btn o" style="width:100%;margin-top:8px" onclick="go(\'lab\')">Lanjut ke Lab Kamera</button>' : ""}<p class="tip">${MOD_TIPS[cur]}</p></article></div>`;
}

function simExtra(s, bg, mx, i) {
    let h = "";
    for (let b = 0; b < 24; b++) { const x = (b - 11.5) / 4 - s * .9, v = Math.exp(-x * x) * 26 + 1.5; h += `<rect x="${b * 5}" y="${30 - v}" width="4" height="${v}" rx="1"/>` }
    $("hist").innerHTML = h;
    $("hint").textContent = s > .7 ? "Terlalu terang: perkecil bukaan, percepat shutter, atau turunkan ISO." : s < -.7 ? "Terlalu gelap: buka bukaan lebih lebar, perlambat shutter, atau naikkan ISO." : i >= 3200 ? "Eksposur pas, tetapi ISO tinggi membuat noise. Coba bukaan lebih lebar." : "Eksposur pas. Sekarang perhatikan bokeh latar dan jejak bola.";
}
function flash() {
    const f = document.querySelector(".frame");
    if (f) { f.classList.remove("fl"); void f.offsetWidth; f.classList.add("fl") }
}
