const $ = id => document.getElementById(id);
const ld = k => { try { return JSON.parse(localStorage.getItem(k)) } catch (e) { return null } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } };

const A = [1.8, 2.8, 4, 5.6, 8, 11, 16];
const T = [1000, 500, 250, 125, 60, 30, 15, 8];
const I = [100, 200, 400, 800, 1600, 3200, 6400];
const LT = [["Cerah (siang hari)", 1], ["Mendung", .25], ["Dalam ruangan", .004]];

const MODS = [
    {
        n: "Pengenalan Kamera",
        i: "📷",
        p: [
            "Jenis kamera: DSLR, mirrorless, dan kamera ponsel, masing-masing punya sensor dan sistem lensa berbeda.",
            "Lensa fix memberi bukaan lebar dan tajam, lensa zoom lebih fleksibel untuk framing.",
            "Bagian utama: mode dial, tombol rana (shutter), viewfinder, dan ring fokus.",
            "Perawatan: pasang tutup lensa, bersihkan debu dengan blower, ganti lensa di tempat bersih."
        ]
    },
    {
        n: "Segitiga Eksposur",
        i: "🔺",
        p: [
            "ISO: kepekaan sensor. Makin tinggi makin terang, tetapi noise bertambah.",
            "Aperture (f): bukaan diafragma. Angka kecil = bukaan lebar = latar lebih blur (bokeh).",
            "Shutter speed: lama sensor terbuka. Lambat = gerakan blur, cepat = gerakan membeku.",
            "Ketiganya saling mengimbangi. Coba langsung di tab Lab Kamera."
        ]
    },
    {
        n: "Komposisi & Angle",
        i: "🔲",
        p: [
            "Rule of Thirds: letakkan subjek di titik pertemuan garis bagi tiga.",
            "Leading Lines: garis di scene mengarahkan mata ke subjek.",
            "Framing: gunakan objek sekitar sebagai bingkai alami.",
            "Angle: frog eye (dari bawah), eye level (sejajar mata), high angle (dari atas)."
        ]
    },
    {
        n: "Lighting & Editing",
        i: "💡",
        p: [
            "Pencahayaan studio dasar: key light, fill light, dan back light.",
            "Cahaya keras membuat bayangan tegas, cahaya lembut (softbox) membuat kulit lebih halus.",
            "Editing awal: crop, exposure, contrast, dan white balance.",
            "Jaga hasil tetap natural dan konsisten untuk kebutuhan DKV."
        ]
    }
];

const QZ = [
    { q: "Mana yang menghasilkan latar belakang paling blur (bokeh)?", o: ["f/16", "f/1.8", "f/8", "Tidak ada bedanya"], a: 1, e: "Bukaan lebar (angka f kecil) memperkecil ruang tajam sehingga latar blur." },
    { q: "Kamu memotret pelari dan ingin gerakannya membeku. Shutter speed terbaik?", o: ["1/15", "1/30", "1/1000", "1/8"], a: 2, e: "Shutter cepat menangkap momen singkat sehingga gerakan tampak beku." },
    { q: "Apa efek menaikkan ISO ke 6400?", o: ["Noise bertambah", "Bokeh bertambah", "Gambar lebih tajam", "Warna lebih akurat"], a: 0, e: "ISO tinggi menguatkan sinyal sensor sekaligus butiran noise." },
    { q: "Pada Rule of Thirds, subjek utama sebaiknya diletakkan di…", o: ["Tepat di tengah", "Pojok paling luar", "Titik pertemuan garis bagi tiga", "Selalu di bawah"], a: 2, e: "Titik pertemuan garis memberi komposisi yang seimbang dan dinamis." },
    { q: "Foto diambil dari bawah, kamera menengadah ke subjek. Ini angle…", o: ["High angle", "Eye level", "Frog eye", "Bird eye"], a: 2, e: "Frog eye membuat subjek tampak megah atau dominan." },
    { q: "Foto terlalu gelap, ISO dan aperture ingin dibiarkan. Apa yang diubah?", o: ["Percepat shutter", "Perlambat shutter", "Perkecil bukaan", "Turunkan ISO"], a: 1, e: "Shutter lebih lambat membiarkan sensor menerima lebih banyak cahaya." }
];

const MS = {
    bokeh: { t: "Misi Bokeh Potret", d: "Buat latar kota sangat blur dengan eksposur tepat dan noise rendah.", xp: 60, c: (a, t, i, s) => [["Aperture f/2.8 atau lebih lebar", a <= 2.8], ["Eksposur tepat (±0,7 EV)", Math.abs(s) <= .7], ["ISO 800 atau lebih rendah", i <= 800]] },
    motion: { t: "Misi Motion Blur", d: "Buat bola bergerak tampak blur tetapi foto tidak gosong atau gelap.", xp: 80, c: (a, t, i, s) => [["Shutter 1/30 atau lebih lambat", t <= 30], ["Eksposur tepat (±1 EV)", Math.abs(s) <= 1], ["ISO 400 atau lebih rendah", i <= 400]] }
};

const BD = [
    { id: "p", n: "Pemula Lensa", i: "🔰", t: "Selesaikan 1 modul", f: s => Object.keys(s.mods).length >= 1 },
    { id: "b", n: "Raja Bokeh", i: "🌆", t: "Lulus Misi Bokeh", f: s => s.ms.bokeh >= 100 },
    { id: "m", n: "Master Shutter", i: "⏱️", t: "Lulus Misi Motion Blur", f: s => s.ms.motion >= 100 },
    { id: "x", n: "Pro Photographer", i: "📸", t: "4 modul, 2 misi, kuis ≥ 80%", f: s => Object.keys(s.mods).length >= 4 && s.ms.bokeh >= 100 && s.ms.motion >= 100 && s.qz / QZ.length >= .8 }
];

const PEERS = [["Raka P.", 340], ["Salsabila A.", 295], ["Dimas W.", 240], ["Anisa R.", 180], ["Fajar H.", 120]];

let me = null, st = null, tab = "mod", lab = { a: 4, t: 3, i: 0, l: 0, m: "free" }, qz = { i: 0, s: 0, p: null };

const lvl = () => Math.floor(st.xp / 100) + 1;

function toast(m) {
    const e = $("toast");
    e.textContent = m;
    e.className = "on";
    clearTimeout(toast.h);
    toast.h = setTimeout(() => e.className = "", 2600);
}

function save() {
    sv("mq:" + me.id, st);
    const h = $("hdr");
    if (h) h.innerHTML = hdr();
}

function addXP(n) {
    st.xp += n;
    BD.forEach(b => {
        if (b.f(st) && !st.bd.includes(b.id)) {
            st.bd.push(b.id);
            toast("Badge baru: " + b.i + " “" + b.n + "”");
        }
    });
    save();
}

function loginView() {
    $("app").innerHTML = `<div class="c login"><div class="lg">📸</div><h1>Multimedia Quest</h1><p class="mu">Dasar Fotografi · DKV Kelas X Fase E</p>
<p><label>Nama<input type="text" id="nm" autocomplete="name"></label></p>
<p><label>NISN (10 digit)<input type="text" id="ni" inputmode="numeric" maxlength="10"></label></p>
<p class="er" id="er" role="alert"></p><button class="btn" style="width:100%" onclick="login()">Masuk dan mulai quest</button></div>`;
    $("ni").addEventListener("keydown", e => { if (e.key === "Enter") login() });
}

function login() {
    const n = $("nm").value.trim(), id = $("ni").value.trim();
    if (!n || !/^\d{10}$/.test(id)) { $("er").textContent = "Isi nama dan NISN sebanyak 10 angka."; return }
    me = { n, id };
    sv("mq:last", me);
    st = ld("mq:" + id) || { xp: 0, mods: {}, ms: {}, qz: 0, bd: [] };
    shell();
}

function logout() {
    sv("mq:last", null);
    me = null;
    loginView();
}

function hdr() {
    const p = st.xp % 100;
    return `<div class="who"><div class="ring" style="--p:${p}" title="${p}/100 XP"><span>${lvl()}</span></div>
<div><h1>Multimedia Quest</h1><p class="mu">Halo, ${me.n.replace(/</g, "&lt;")}! ${st.xp} XP · ${100 - p} XP lagi ke level ${lvl() + 1}</p></div></div>
<div class="bdg">${BD.map(b => `<span class="bd ${st.bd.includes(b.id) ? "" : "off"}" title="${b.t}">${b.i} ${b.n}</span>`).join("")}
<button class="btn o sm" onclick="logout()">Keluar</button></div>`;
}

function shell() {
    $("app").innerHTML = `<div class="hd" id="hdr">${hdr()}</div><div class="tabs" role="tablist">${[["mod", "📚 Modul"], ["lab", "🎛️ Lab Kamera"], ["qst", "🎯 Quest"], ["rnk", "🏆 Peringkat"]].map(t => `<button role="tab" id="t-${t[0]}" onclick="go('${t[0]}')">${t[1]}</button>`).join("")}</div><div id="main"></div>`;
    go(tab);
}

function go(t) {
    tab = t;
    document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", b.id === "t-" + t));
    $("main").innerHTML = ({ mod: vModule, lab: vLab, qst: vQst, rnk: vRnk })[t]();
    if (t === "lab") upd();
}

function vMod() {
    const d = Object.keys(st.mods).length;
    return `<div class="c prog"><b>${d} dari ${MODS.length} modul selesai</b><div class="bar"><i style="width:${d / MODS.length * 100}%"></i></div></div>
<div class="g">${MODS.map((m, k) => `<article class="c mc m${k}"><div class="mi">${m.i}</div><h3><span class="mn">Modul ${k + 1}</span>${m.n}</h3><ul>${m.p.map(x => `<li>${x}</li>`).join("")}</ul>
${st.mods[k] ? '<span class="tag ok">✓ Selesai</span>' : `<button class="btn" onclick="fin(${k})">Tandai selesai (+30 XP)</button>`}</article>`).join("")}</div>
<p class="tip">💡 Setelah modul 2, buka tab Lab Kamera untuk mencoba segitiga eksposur secara langsung.</p>`;
}

function fin(k) {
    st.mods[k] = 1;
    addXP(30);
    go("mod");
}

function vLab() {
    const lk = lab.m !== "free";
    if (lk) lab.l = 0;
    return `<div class="lab"><div><div class="frame"><div id="fr">${svgScene(lab.sc || "city", "", { anim: 1 })}</div><i class="vf"></i><div class="hud" id="hud"></div></div>
<div class="c" style="margin-top:10px"><div class="mt"><b id="mk"></b></div><p style="margin:10px 0 0"><span class="tag" id="sl"></span> <span class="mu" id="ef"></span></p><svg id="hist" class="hist" viewBox="0 0 120 30" aria-label="Histogram eksposur"></svg><p class="hint" id="hint" aria-live="polite"></p></div></div>
<div class="c"><label>Adegan<select onchange="lab.sc=this.value;go('lab')">${Object.keys(SC).map(k => `<option value="${k}" ${(lab.sc || "city") === k ? "selected" : ""}>${SC[k].n}</option>`).join("")}</select></label>
<label>Mode<select onchange="lab.m=this.value;go('lab')"><option value="free">Eksplorasi bebas</option>${Object.keys(MS).map(k => `<option value="${k}" ${lab.m === k ? "selected" : ""}>${MS[k].t}</option>`).join("")}</select></label>
${lk ? `<p class="mu">${MS[lab.m].d} Nilai terbaik: ${st.ms[lab.m] || 0}/100</p>` : ""}
<label>Cahaya<select ${lk ? "disabled" : ""} onchange="lab.l=+this.value;upd()">${LT.map((l, k) => `<option value="${k}" ${lab.l === k ? "selected" : ""}>${l[0]}</option>`).join("")}</select></label>
${sld("a", "Aperture", A.length)}${sld("t", "Shutter", T.length)}${sld("i", "ISO", I.length)}
${lk ? '<button class="btn" style="width:100%;margin-top:6px" onclick="shot()">Jepret dan nilai</button><div id="rs" aria-live="polite" style="margin-top:10px"></div>' : ""}<button class="btn o sm" style="width:100%;margin-top:10px" onclick="resetLab()">↺ Reset Pengaturan</button></div></div>`;
}

function sld(k, n, len) {
    return `<div class="sl"><label><span>${n}</span><b id="v-${k}"></b></label><input type="range" min="0" max="${len - 1}" value="${lab[k]}" aria-label="${n}" oninput="lab.${k}=+this.value;upd()"></div>`;
}

function scene() {
    let b = "", x = [[20, 40, "#ffcf5a"], [70, 70, "#ff7aa8"], [130, 30, "#7ad7ff"], [250, 50, "#ffcf5a"], [310, 75, "#7affc8"], [360, 35, "#ff7aa8"], [290, 110, "#ffcf5a"], [50, 120, "#7ad7ff"]];
    x.forEach(c => b += `<circle cx="${c[0]}" cy="${c[1] + 40}" r="9" fill="${c[2]}"/>`);
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Pratinjau hasil foto: orang di tengah, latar kota, bola bergerak"><defs>
<filter id="fb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur id="gb" stdDeviation="0"/></filter>
<filter id="fm" x="-60%" y="-30%" width="220%" height="160%"><feGaussianBlur id="gm" stdDeviation="0 0"/></filter>
<filter id="fn"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter>
<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3a8c"/><stop offset="1" stop-color="#e98a5b"/></linearGradient></defs>
<g id="fz"><rect width="400" height="260" fill="url(#sk)"/>
<g filter="url(#fb)"><rect x="10" y="90" width="60" height="120" fill="#1c2147"/><rect x="90" y="60" width="50" height="150" fill="#262c5c"/><rect x="230" y="80" width="70" height="130" fill="#1c2147"/><rect x="320" y="50" width="60" height="160" fill="#262c5c"/>${b}</g>
<rect y="205" width="400" height="55" fill="#2e3350"/>
<g><circle cx="200" cy="105" r="18" fill="#f2c9a5"/><rect x="176" y="125" width="48" height="85" rx="18" fill="#e5484d"/><rect x="186" y="205" width="10" height="38" fill="#222"/><rect x="204" y="205" width="10" height="38" fill="#222"/></g>
<g filter="url(#fm)"><circle cx="85" cy="228" r="14" fill="#35e0c6"/></g>
<rect id="ov" width="400" height="260" fill="#fff" opacity="0"/>
<rect id="nz" width="400" height="260" filter="url(#fn)" opacity="0" style="mix-blend-mode:overlay"/></g></svg>`;
}

function upd() {
    const a = A[lab.a], t = T[lab.t], i = I[lab.i], L = LT[lab.l][1];
    const s = Math.log2(L * (i / 100) * (125 / t) * Math.pow(8 / a, 2));
    $("v-a").textContent = "f/" + a;
    $("v-t").textContent = "1/" + t;
    $("v-i").textContent = i;
    $("hud").textContent = "f/" + a + "   1/" + t + "   ISO " + i;
    const bg = Math.max(0, 22 / a - .8), mx = Math.min(40, 600 / t);
    $("gb").setAttribute("stdDeviation", bg);
    $("gm").setAttribute("stdDeviation", mx + " 0");
    $("nz").setAttribute("opacity", Math.min(.8, i / 6400 * .75));
    const br = Math.min(2.2, Math.max(.12, Math.pow(2, s * .55)));
    $("fr").style.filter = `brightness(${br})`;
    $("ov").setAttribute("opacity", Math.min(.8, Math.max(0, (s - .7) * .25)));
    $("mk").style.left = ((Math.max(-3, Math.min(3, s)) + 3) / 6 * 100) + "%";
    const e = $("sl"), ok = Math.abs(s) <= .7;
    e.textContent = (s > .7 ? "Overexposed" : s < -.7 ? "Underexposed" : "Eksposur tepat") + " (" + (s >= 0 ? "+" : "") + s.toFixed(1).replace(".", ",") + " EV)";
    e.style.color = ok ? "var(--ok)" : "var(--wa)";
    $("ef").textContent = "Bokeh latar: " + (bg > 5 ? "kuat" : bg > 2 ? "sedang" : "tipis") + " · Motion blur: " + (mx > 14 ? "kuat" : mx > 4 ? "sedang" : "membeku") + " · Noise: " + (i >= 3200 ? "tinggi" : i >= 800 ? "sedang" : "rendah");
    lab.s = s;
    simExtra(s, bg, mx, i);
}

function resetLab() {
    lab.a = 4; // f/8
    lab.t = 3; // 1/125
    lab.i = 0; // ISO 100
    if (lab.m === "free") lab.l = 0; // Cerah
    go("lab");
    toast("Pengaturan kamera dikembalikan ke awal.");
}

function shot() {
    flash();
    const M = MS[lab.m], a = A[lab.a], t = T[lab.t], i = I[lab.i], cs = M.c(a, t, i, lab.s), n = cs.filter(c => c[1]).length, sc = Math.round(n / cs.length * 100), prev = st.ms[lab.m] || 0;
    let gain = 0;
    if (sc > prev) { st.ms[lab.m] = sc }
    if (sc === 100 && prev < 100) gain = M.xp;
    $("rs").innerHTML = cs.map(c => `<div class="${c[1] ? "ok" : "er"}">${c[1] ? "✓" : "✗"} ${c[0]}</div>`).join("") + `<p><b>Skor: ${sc}/100</b>${gain ? " · +" + gain + " XP" : sc < 100 ? " · Atur ulang dan coba lagi." : ""}</p>`;
    gain ? addXP(gain) : save();
}

function vQst() {
    return `<div class="g" style="margin-bottom:12px">${Object.keys(MS).map(k => `<div class="c qc"><h3>🎯 ${MS[k].t}</h3><p class="mu">${MS[k].d}</p><p class="mu">Skor terbaik: ${st.ms[k] || 0}/100 · Hadiah ${MS[k].xp} XP</p><button class="btn o" onclick="lab.m='${k}';go('lab')">Mulai misi di Lab</button></div>`).join("")}</div><div class="c" id="qb">${quiz()}</div>`;
}

function quiz() {
    if (qz.i >= QZ.length) {
        const ok = qz.s, pct = Math.round(ok / QZ.length * 100);
        return `<h2>Hasil kuis</h2><p>Benar ${ok} dari ${QZ.length} (${pct}%). Rekor terbaikmu: ${st.qz}/${QZ.length}.</p><button class="btn" onclick="qz={i:0,s:0,p:null};$('qb').innerHTML=quiz()">Ulangi kuis</button>`;
    }
    const q = QZ[qz.i];
    return `<h2>Kuis tebak eksposur dan angle (${qz.i + 1}/${QZ.length})</h2><div class="bar" style="margin-bottom:12px"><i style="width:${qz.i / QZ.length * 100}%"></i></div><p>${q.q}</p>${q.o.map((o, k) => `<button class="opt ${qz.p === null ? "" : k === q.a ? "r" : k === qz.p ? "x" : ""}" ${qz.p !== null ? "disabled" : ""} onclick="pick(${k})">${o}</button>`).join("")}
${qz.p !== null ? `<p class="mu">${q.e}</p><button class="btn" onclick="qz.i++;qz.p=null;$('qb').innerHTML=quiz()">${qz.i + 1 < QZ.length ? "Soal berikutnya" : "Lihat hasil"}</button>` : ""}`;
}

function pick(k) {
    const q = QZ[qz.i];
    qz.p = k;
    if (k === q.a) qz.s++;
    if (qz.i + 1 === QZ.length) {
        const d = Math.max(0, qz.s - st.qz);
        if (qz.s > st.qz) st.qz = qz.s;
        d ? addXP(d * 15) : save();
    }
    $("qb").innerHTML = quiz();
}

function vRnk() {
    const r = PEERS.map(p => ({ n: p[0], x: p[1] })).concat([{ n: me.n, x: st.xp, me: 1 }]).sort((a, b) => b.x - a.x);
    return `<div class="c"><h2>🏆 Peringkat Kelas 10 DKV</h2><table><tr><th>#</th><th>Nama</th><th>XP</th></tr>${r.map((p, k) => `<tr class="${p.me ? "me" : ""}"><td class="md">${["🥇", "🥈", "🥉"][k] || k + 1}</td><td>${p.n.replace(/</g, "&lt;")}${p.me ? " (kamu)" : ""}</td><td>${p.x}</td></tr>`).join("")}</table>
<p class="mu">Data siswa lain masih contoh dan XP-mu tersimpan di perangkat ini. Untuk nilai otomatis ke guru, leaderboard perlu dihubungkan ke database bersama.</p></div>`;
}

// Inisialisasi Aplikasi
const last = ld("mq:last");
if (last && last.id) {
    me = last;
    st = ld("mq:" + me.id) || { xp: 0, mods: {}, ms: {}, qz: 0, bd: [] };
    shell();
} else {
    loginView();
}