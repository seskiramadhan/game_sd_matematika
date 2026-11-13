// Alat bersama Bab 8 (Sudut): jenis sudut, busur derajat dua skala, arah mata angin (mawar) + gambar SVG/HTML.
// Semua besar sudut bilangan bulat (derajat); arah = indeks 0-7 (U, TL, T, TG, S, BD, B, BL) searah jarum jam, mod 8.
// Sudut mutlak (a, a1, a2) diukur berlawanan jarum jam dari arah "kanan" layar. Tidak ada floating point untuk kunci.
// Cek logika: node tools/cek-bab8.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;

  // ---------- Logika (tanpa DOM) ----------
  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const mod = (a, n) => ((a % n) + n) % n;

  const TEKS_JENIS = { lancip: 'Lancip', siku: 'Siku-siku', tumpul: 'Tumpul', lurus: 'Lurus' };
  function jenisSudut(d) { return d === 90 ? 'siku' : d === 180 ? 'lurus' : d < 90 ? 'lancip' : 'tumpul'; }

  const ARAH = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  const NAMA_ARAH = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  const putarArah = (i, derajat, kanan) => mod(i + (kanan ? 1 : -1) * (derajat / 45), 8);
  const derajatPutar = (dari, ke, kanan) => mod(kanan ? ke - dari : dari - ke, 8) * 45;
  const TEKS_PECAH = { 45: '⅛', 90: '¼', 135: '⅜', 180: '½', 225: '⅝', 270: '¾', 315: '⅞' };
  const teksPutar = (d) => (d % 90 === 0 ? TEKS_PECAH[d] + ' putaran (' + d + '°)' : d + '°');
  const teksArah = (i) => NAMA_ARAH[i] + ' (' + ARAH[i] + ')';

  // Busur: rho = putaran busur (derajat, berlawanan jarum jam), sisi = 'R' (kaki pertama di 0 skala kanan) atau 'L' (di 0 skala kiri),
  // s = besar sudut. Kaki pertama a1, kaki kedua a2 (sudut mutlak). bacaR/bacaL = angka yang ditunjuk kaki kedua di tiap skala.
  function busur(rho, sisi, s) {
    const a1 = sisi === 'R' ? rho : rho + 180;
    const a2 = sisi === 'R' ? rho + s : rho + 180 - s;
    const bacaR = mod(a2 - rho, 360);
    return { rho, sisi, s, a1, a2, bacaR, bacaL: 180 - bacaR };
  }

  const HURUF = 'ABCDEFGHJKMNPQRSTUVWXYZ'.split('');
  const ambilHuruf = (n) => kocok(HURUF).slice(0, n);
  const namaSudut = (a, v, b) => '∠' + a + v + b;

  const logika = { acak, pilih, kocok, mod, TEKS_JENIS, jenisSudut, ARAH, NAMA_ARAH, putarArah, derajatPutar, teksPutar, teksArah, busur, HURUF, ambilHuruf, namaSudut };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  const rad = (d) => (d * Math.PI) / 180;
  const f = (n) => Math.round(n * 100) / 100;
  const titik = (cx, cy, a, r) => [f(cx + r * Math.cos(rad(a))), f(cy - r * Math.sin(rad(a)))];
  // busur lingkaran dari sudut aMulai sepanjang s derajat (berlawanan jarum jam)
  function jalurLengkung(cx, cy, r, aMulai, s, denganPusat) {
    const [x1, y1] = titik(cx, cy, aMulai, r), [x2, y2] = titik(cx, cy, aMulai + s, r);
    return (denganPusat ? 'M ' + cx + ' ' + cy + ' L ' + x1 + ' ' + y1 : 'M ' + x1 + ' ' + y1) + ' A ' + r + ' ' + r + ' 0 ' + (s > 180 ? 1 : 0) + ' 0 ' + x2 + ' ' + y2 + (denganPusat ? ' Z' : '');
  }
  const HALO = { 'paint-order': 'stroke', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linejoin': 'round' };
  function teks(svg, x, y, isi, ukuran, warna, extra) {
    const t = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': ukuran, 'font-weight': 800, fill: warna, 'font-family': 'Poppins, sans-serif' }, HALO, extra || {}));
    t.textContent = isi; svg.appendChild(t); return t;
  }

  // Gambar sudut. sinar: [{a, huruf}] ; lengkung: [{a, s, warna, teks}] ; hurufTitik: huruf titik sudut ;
  // pojok: sudut mutlak kaki tempat kotak siku-siku 90 ditempel (atau null) ; sorotTitik: lingkari titik sudut
  function sudutSvg({ sinar, lengkung = [], hurufTitik = null, pojok = null, sorotTitik = false, ukuran = 280 }) {
    const C = 150, L = 118;
    const svg = svgEl('svg', { viewBox: '0 0 300 300', width: ukuran, height: ukuran, class: 'gambar-sudut' });
    svg.appendChild(svgEl('rect', { x: 2, y: 2, width: 296, height: 296, rx: 22, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    lengkung.forEach((g) => {
      svg.appendChild(svgEl('path', { d: jalurLengkung(C, C, g.r || 52, g.a, g.s, true), fill: g.warna, 'fill-opacity': 0.28, stroke: g.warna, 'stroke-width': 3 }));
      if (g.teks) { const [tx, ty] = titik(C, C, g.a + g.s / 2, (g.r || 52) * 0.62); teks(svg, tx, ty, g.teks, 22, '#1F2A44'); }
    });
    if (pojok != null) {
      const p1 = titik(0, 0, pojok, 40), p2 = titik(0, 0, pojok + 90, 40), p3 = [p1[0] + p2[0], p1[1] + p2[1]];
      const [lx, ly] = titik(C, C, pojok + 90, L + 8);
      svg.appendChild(svgEl('line', { x1: C, y1: C, x2: lx, y2: ly, stroke: '#FF8A3D', 'stroke-width': 4, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }));
      svg.appendChild(svgEl('path', { d: 'M ' + C + ' ' + C + ' l ' + p1[0] + ' ' + p1[1] + ' l ' + p2[0] + ' ' + p2[1] + ' l ' + (-p1[0]) + ' ' + (-p1[1]) + ' Z', fill: '#FF8A3D', 'fill-opacity': 0.22, stroke: '#FF8A3D', 'stroke-width': 3 }));
    }
    sinar.forEach((s) => {
      const [x, y] = titik(C, C, s.a, L);
      svg.appendChild(svgEl('line', { x1: C, y1: C, x2: x, y2: y, stroke: '#1F2A44', 'stroke-width': 6, 'stroke-linecap': 'round' }));
      svg.appendChild(svgEl('circle', { cx: x, cy: y, r: 7, fill: '#1F2A44' }));
      if (s.huruf) { const [hx, hy] = titik(C, C, s.a, L + 22); teks(svg, hx, hy, s.huruf, 26, '#1F2A44'); }
    });
    if (sorotTitik) svg.appendChild(svgEl('circle', { cx: C, cy: C, r: 17, fill: '#FFC400', 'fill-opacity': 0.55, stroke: '#E0A800', 'stroke-width': 3 }));
    svg.appendChild(svgEl('circle', { cx: C, cy: C, r: 7, fill: '#E04466' }));
    if (hurufTitik) {
      let sx = 0, sy = 0; sinar.forEach((s) => { sx += Math.cos(rad(s.a)); sy += Math.sin(rad(s.a)); });
      const a = Math.hypot(sx, sy) < 0.3 ? sinar[0].a - 90 : (Math.atan2(sy, sx) * 180) / Math.PI + 180;
      const [hx, hy] = titik(C, C, a, 30); teks(svg, hx, hy, hurufTitik, 26, '#E04466');
    }
    return svg;
  }

  // Busur derajat 2 skala. b = busur(...) ; sorot: true -> tebalkan skala yang benar + lingkari angka ; tanpaKaki2: sembunyikan kaki kedua
  const RO = 215, RN_R = 187, RT_L = 168, RN_L = 141;
  function batasBawah(rho) { return Math.ceil(232 * Math.abs(Math.sin(rad(rho)))) + 26; }
  function busurSvg({ b, sorot = false, ukuran = 460 }) {
    const rho = b.rho, bawah = Math.max(30, batasBawah(rho));
    const vx = -240, vy = -240, vw = 480, vh = 240 + bawah;
    const svg = svgEl('svg', { viewBox: vx + ' ' + vy + ' ' + vw + ' ' + vh, width: ukuran, height: Math.round((ukuran * vh) / vw), class: 'gambar-busur' });
    // badan busur + tanda skala (diputar sebagai satu kelompok)
    const g = svgEl('g', { transform: 'rotate(' + (-rho) + ')' });
    g.appendChild(svgEl('path', { d: 'M ' + (-RO) + ' 0 A ' + RO + ' ' + RO + ' 0 0 1 ' + RO + ' 0 Z', fill: '#BFDCFF', 'fill-opacity': 0.4, stroke: '#6E8FBF', 'stroke-width': 3 }));
    g.appendChild(svgEl('rect', { x: -RO - 8, y: 0, width: 2 * RO + 16, height: 16, rx: 6, fill: '#BFDCFF', 'fill-opacity': 0.55, stroke: '#6E8FBF', 'stroke-width': 3 }));
    for (let t = 0; t <= 180; t++) {
      const panjang = t % 10 === 0 ? 16 : t % 5 === 0 ? 11 : 6, tebal = t % 10 === 0 ? 2 : 1.2;
      const [a1, b1] = titik(0, 0, t, RO), [a2, b2] = titik(0, 0, t, RO - panjang);
      g.appendChild(svgEl('line', { x1: a1, y1: b1, x2: a2, y2: b2, stroke: '#3A86FF', 'stroke-width': tebal }));
      const [c1, d1] = titik(0, 0, t, RT_L), [c2, d2] = titik(0, 0, t, RT_L - panjang);
      g.appendChild(svgEl('line', { x1: c1, y1: d1, x2: c2, y2: d2, stroke: '#E8731F', 'stroke-width': tebal }));
    }
    svg.appendChild(g);
    // sorotan skala yang benar (dari kaki pertama sampai kaki kedua)
    if (sorot) {
      const mulai = b.sisi === 'R' ? b.a1 : b.a2;
      const R = b.sisi === 'R' ? RO + 6 : RT_L + 5;
      svg.appendChild(svgEl('path', { d: jalurLengkung(0, 0, R, mulai, b.s, false), fill: 'none', stroke: b.sisi === 'R' ? '#3A86FF' : '#FF8A3D', 'stroke-width': 7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }));
    }
    // sudut: irisan + kaki
    const mulaiIris = b.sisi === 'R' ? b.a1 : b.a2;
    svg.appendChild(svgEl('path', { d: jalurLengkung(0, 0, 70, mulaiIris, b.s, true), fill: '#E04466', 'fill-opacity': 0.2, stroke: '#E04466', 'stroke-width': 2 }));
    const [k1x, k1y] = titik(0, 0, b.a1, 232), [k2x, k2y] = titik(0, 0, b.a2, 232);
    svg.appendChild(svgEl('line', { x1: 0, y1: 0, x2: k1x, y2: k1y, stroke: '#1F2A44', 'stroke-width': 5, 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('line', { x1: 0, y1: 0, x2: k2x, y2: k2y, stroke: '#E04466', 'stroke-width': 5, 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('circle', { cx: 0, cy: 0, r: 7, fill: '#1F2A44', stroke: '#fff', 'stroke-width': 2 }));
    // titik penunjuk di kedua skala
    const [p1x, p1y] = titik(0, 0, b.a2, RO), [p2x, p2y] = titik(0, 0, b.a2, RT_L);
    svg.appendChild(svgEl('circle', { cx: p1x, cy: p1y, r: 5, fill: '#3A86FF', stroke: '#fff', 'stroke-width': 2 }));
    svg.appendChild(svgEl('circle', { cx: p2x, cy: p2y, r: 5, fill: '#FF8A3D', stroke: '#fff', 'stroke-width': 2 }));
    // angka (tegak, di posisi terputar)
    for (let t = 0; t <= 180; t += 10) {
      const [rx, ry] = titik(0, 0, rho + t, RN_R), [lx, ly] = titik(0, 0, rho + t, RN_L);
      teks(svg, rx, ry, t, 13, '#2A63C9', { class: 'angka-busur' });
      teks(svg, lx, ly, 180 - t, 13, '#C25A12', { class: 'angka-busur' });
    }
    if (sorot && b.s % 10 === 0) {
      const [cx, cy] = b.sisi === 'R' ? titik(0, 0, b.a2, RN_R) : titik(0, 0, b.a2, RN_L);
      svg.appendChild(svgEl('circle', { cx, cy, r: 16, fill: 'none', stroke: '#2BB673', 'stroke-width': 4 }));
    }
    return svg;
  }

  // Mawar mata angin: tombol arah (HTML, >= 64 px), panah Garuda yang bisa diputar. semua: indeks arah yang tampil ;
  // aktif: bool (bisa diketuk) ; onKetuk(i)
  function mawar({ ukuran = 420, semua, aktif = false, onKetuk, bearing = 0 }) {
    const w = el('div', 'mawar'); w.style.width = w.style.height = ukuran + 'px';
    const tengah = ukuran / 2, rTombol = Math.round(ukuran * 0.38), tb = 64;
    const bg = svgEl('svg', { viewBox: '0 0 100 100', class: 'mawar-bg' });
    bg.appendChild(svgEl('circle', { cx: 50, cy: 50, r: 46, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 1.2 }));
    bg.appendChild(svgEl('circle', { cx: 50, cy: 50, r: 25, fill: 'none', stroke: '#F1E8D6', 'stroke-width': 0.8, 'stroke-dasharray': '1.5 2' }));
    [0, 2, 4, 6].forEach((i) => { const [x, y] = titik(50, 50, 90 - i * 45, 46); bg.appendChild(svgEl('line', { x1: 50, y1: 50, x2: x, y2: y, stroke: '#F1E8D6', 'stroke-width': 0.8 })); });
    w.appendChild(bg);
    const panah = el('div', 'mawar-panah');
    const pk = Math.round(ukuran * 0.30);
    const sp = svgEl('svg', { viewBox: '0 0 100 100', class: 'mawar-bg' });
    const t1 = 50 - pk / ukuran * 100 + 0, kepala = 14;
    sp.appendChild(svgEl('line', { x1: 50, y1: 36, x2: 50, y2: t1 + kepala - 2, stroke: '#E04466', 'stroke-width': 4.5, 'stroke-linecap': 'round' }));
    sp.appendChild(svgEl('path', { d: 'M 50 ' + t1 + ' L 59 ' + (t1 + kepala + 2) + ' L 41 ' + (t1 + kepala + 2) + ' Z', fill: '#E04466' }));
    panah.appendChild(sp);
    w.appendChild(panah);
    const g = document.createElement('img'); g.className = 'mawar-garuda'; g.src = 'assets/garuda/garuda-semangat.svg'; g.alt = '';
    w.appendChild(g);
    const tombol = {};
    semua.forEach((i) => {
      const [x, y] = titik(tengah, tengah, 90 - i * 45, rTombol);
      const t = el(aktif ? 'button' : 'div', 'mawar-btn' + (i % 2 ? ' kecil' : ''), ARAH[i]);
      t.style.left = (x - tb / 2) + 'px'; t.style.top = (y - tb / 2) + 'px';
      if (aktif) t.onclick = () => onKetuk(i);
      w.appendChild(t); tombol[i] = t;
    });
    const o = {
      el: w, tombol,
      setPanah(deg) { panah.style.transform = 'rotate(' + deg + 'deg)'; },
      tandai(i, kelas) { if (tombol[i]) tombol[i].classList.add(kelas); },
    };
    o.setPanah(bearing);
    return o;
  }

  root.Sudut = Object.assign({ svgEl, el, sudutSvg, busurSvg, mawar }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
