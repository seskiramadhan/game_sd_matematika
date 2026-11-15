// Alat bersama Bab 9 (Garis & Sudut): hubungan dua garis, kertas bertitik 10x6, gambar garis + tombol Perpanjang.
// Di kertas bertitik garis = vektor bilangan bulat: sejajar <=> perkalian silang = 0, tegak lurus <=> perkalian titik = 0.
// Di gambar bebas (garis diputar acak) kunci dari selisih sudut DERAJAT BULAT (mod 180): 0 = sejajar, 90 = tegak lurus.
// Koordinat gambar (float) hanya untuk menggambar, tidak pernah dipakai untuk kunci. Cek logika: node tools/cek-bab9.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('../bab-8/sudut.js') : root.Sudut;
  const { acak, pilih, kocok, mod } = S;

  // ---------- Logika (tanpa DOM) ----------
  const TEKS_JENIS = { sejajar: 'Sejajar', berpotongan: 'Berpotongan', tegak: 'Tegak lurus' };
  const SIMBOL = { sejajar: '∥', berpotongan: '', tegak: '⊥' };
  const ARTI = {
    sejajar: 'tidak pernah bertemu, walau diperpanjang',
    berpotongan: 'bertemu di satu titik',
    tegak: 'berpotongan dan membentuk sudut siku-siku (90°)',
  };

  const kurang = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const silang = (u, v) => u[0] * v[1] - u[1] * v[0];
  const titikKali = (u, v) => u[0] * v[0] + u[1] * v[1];
  const sejajarV = (u, v) => silang(u, v) === 0;
  const tegakV = (u, v) => titikKali(u, v) === 0;
  const jenisVektor = (u, v) => (silang(u, v) === 0 ? 'sejajar' : titikKali(u, v) === 0 ? 'tegak' : 'berpotongan');
  // dua garis dengan arah t1, t2 (derajat bulat)
  const jenisSudutGaris = (t1, t2) => { const d = mod(t2 - t1, 180); return d === 0 ? 'sejajar' : d === 90 ? 'tegak' : 'berpotongan'; };

  // Kertas bertitik: x 0..9, y 0..5 (y ke atas)
  const KOLOM = 10, BARIS = 6;
  const dalamKertas = (p) => p[0] >= 0 && p[0] < KOLOM && p[1] >= 0 && p[1] < BARIS;
  const sama = (p, q) => p[0] === q[0] && p[1] === q[1];
  // semua titik kertas (selain C) yang dilalui garis dari C yang sejajar / tegak lurus dengan vektor v
  function titikKunci(v, C, rel) {
    const hasil = [];
    for (let x = 0; x < KOLOM; x++) for (let y = 0; y < BARIS; y++) {
      const P = [x, y];
      if (sama(P, C)) continue;
      const w = kurang(P, C);
      if (rel === 'sejajar' ? sejajarV(w, v) : tegakV(w, v)) hasil.push(P);
    }
    return hasil;
  }
  function teksLangkah(v) {
    const bagian = [];
    if (v[0] !== 0) bagian.push(Math.abs(v[0]) + (v[0] > 0 ? ' kanan' : ' kiri'));
    if (v[1] !== 0) bagian.push(Math.abs(v[1]) + (v[1] > 0 ? ' atas' : ' bawah'));
    return bagian.join(', ');
  }

  // Geometri gambar (hanya untuk menggambar). Sudut matematika berlawanan jarum jam; koordinat SVG (y ke bawah).
  const rad = (d) => (d * Math.PI) / 180;
  const arah = (th) => [Math.cos(rad(th)), -Math.sin(rad(th))];
  const tambah = (p, u, t) => [p[0] + u[0] * t, p[1] + u[1] * t];
  const potong = (l1, l2) => {
    const d1 = kurang(l1.q, l1.p), d2 = kurang(l2.q, l2.p), den = silang(d1, d2);
    if (Math.abs(den) < 1e-9 * Math.hypot(d1[0], d1[1]) * Math.hypot(d2[0], d2[1])) return null;
    const t = silang(kurang(l2.p, l1.p), d2) / den;
    return [l1.p[0] + t * d1[0], l1.p[1] + t * d1[1]];
  };
  // gambar: 480 x 320, pusat (0,0)
  const LEBAR = 480, TINGGI = 320;

  const logika = {
    acak, pilih, kocok, mod, TEKS_JENIS, SIMBOL, ARTI, silang, titikKali, sejajarV, tegakV, jenisVektor, jenisSudutGaris, kurang, sama,
    KOLOM, BARIS, dalamKertas, titikKunci, teksLangkah, arah, tambah, potong, LEBAR, TINGGI,
  };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const { svgEl, el, teks } = S;

  // Gambar dua garis (atau tiga) dari spec: { garis: [{p, q, warna, lebar, huruf:[h1,h2] | label}], fokus: [i, j], zoom, kunci, dekor }
  // perpanjang: kedua garis fokus memanjang sampai tepi gambar; titik potong disorot; pojok 90 ditempel bila perpanjang & pojok.
  function adeganSvg(spec, { perpanjang = false, pojok = false, ukuran = 480 }) {
    let Z = 1;
    if (perpanjang && spec.zoom > 1 && spec.fokus && spec.fokus.length === 2) {
      // zoom secukupnya supaya titik potong terlihat (gambar bergaris putus: titik potong di luar bingkai)
      const X = potong(spec.garis[spec.fokus[0]], spec.garis[spec.fokus[1]]);
      Z = X ? Math.min(spec.zoom, Math.max(1.5, (Math.abs(X[0]) + 40) / 240, (Math.abs(X[1]) + 40) / 160)) : 1.5;
    }
    const vx = -LEBAR / 2 * Z, vy = -TINGGI / 2 * Z, vw = LEBAR * Z, vh = TINGGI * Z;
    const svg = svgEl('svg', { viewBox: vx + ' ' + vy + ' ' + vw + ' ' + vh, width: ukuran, height: Math.round(ukuran * TINGGI / LEBAR), class: 'gambar-garis' });
    svg.appendChild(svgEl('rect', { x: vx + 1.5 * Z, y: vy + 1.5 * Z, width: vw - 3 * Z, height: vh - 3 * Z, rx: 22 * Z, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 * Z }));
    (spec.dekor || []).forEach((d) => svg.appendChild(svgEl(d.tag, d.attr)));
    const fokus = (spec.fokus || []).map((i) => spec.garis[i]);
    if (perpanjang) {
      fokus.forEach((g) => {
        const d = kurang(g.q, g.p);
        const a = tambah(g.p, d, -40), b = tambah(g.p, d, 41);
        svg.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: g.warna, 'stroke-width': 4 * Z, 'stroke-dasharray': (10 * Z) + ' ' + (8 * Z), 'stroke-opacity': 0.75, class: 'garis-panjang' }));
      });
    }
    spec.garis.forEach((g) => {
      svg.appendChild(svgEl('line', { x1: g.p[0], y1: g.p[1], x2: g.q[0], y2: g.q[1], stroke: g.warna, 'stroke-width': (g.lebar || 6) * Z, 'stroke-linecap': 'round' }));
      if (g.titikUjung) [g.p, g.q].forEach((e) => svg.appendChild(svgEl('circle', { cx: e[0], cy: e[1], r: 7 * Z, fill: g.warna })));
      if (g.huruf) [[g.p, g.q, g.huruf[0]], [g.q, g.p, g.huruf[1]]].forEach(([e, lain, h]) => {
        const d = kurang(e, lain), n = Math.hypot(d[0], d[1]), t = tambah(e, [d[0] / n, d[1] / n], 21);
        teks(svg, t[0], t[1], h, 26, g.warna);
      });
      if (g.label) { const t = g.labelPos; teks(svg, t[0], t[1], g.label, 28, g.warna); }
    });
    if (perpanjang && fokus.length === 2) {
      const X = potong(fokus[0], fokus[1]);
      if (X && Math.abs(X[0]) < vw / 2 - 4 * Z && Math.abs(X[1]) < vh / 2 - 4 * Z) {
        if (pojok) {
          const u1 = kurang(fokus[0].q, fokus[0].p), n1 = Math.hypot(u1[0], u1[1]);
          const e1 = [u1[0] / n1, u1[1] / n1];
          let e2 = [-e1[1], e1[0]];
          const u2 = kurang(fokus[1].q, fokus[1].p);
          if (titikKali(e2, u2) < 0) e2 = [-e2[0], -e2[1]];
          const k = 30 * Z, a = tambah(X, e1, k), b = tambah(a, e2, k), c = tambah(X, e2, k);
          svg.appendChild(svgEl('path', { d: 'M ' + X[0] + ' ' + X[1] + ' L ' + a[0] + ' ' + a[1] + ' L ' + b[0] + ' ' + b[1] + ' L ' + c[0] + ' ' + c[1] + ' Z', fill: '#FF8A3D', 'fill-opacity': 0.3, stroke: '#FF8A3D', 'stroke-width': 3.5 * Z }));
        }
        svg.appendChild(svgEl('circle', { cx: X[0], cy: X[1], r: 13 * Z, fill: '#FFC400', 'fill-opacity': 0.55, stroke: '#E0A800', 'stroke-width': 3 * Z }));
        svg.appendChild(svgEl('circle', { cx: X[0], cy: X[1], r: 5 * Z, fill: '#E04466' }));
      }
    }
    return svg;
  }

  // ---------- Kertas bertitik ----------
  // opsi: { A, B, C, sp (jarak titik px), ketuk(P), perpanjangAB, tarik: {P, warna} (garis dari C lewat P), kunci: [titik] (hijau),
  //         pojok: {X:[x,y] float grid, e1, e2} , pilihan: P merah, geser: bool }
  function kertasSvg({ A, B, C, sp = 64, ketuk = null, perpanjangAB = false, tarik = null, kunciTampil = null, pilihanSalah = null, pojok = null, langkah = false, kosong = false, lapisan = null }) {
    // kosong: tanpa garis AB & titik C (dipakai Bab 10) ; lapisan(svg, px, py): gambar tambahan di atas titik-titik, di bawah lapisan ketuk
    const m = 34;
    const w = (KOLOM - 1) * sp + 2 * m, h = (BARIS - 1) * sp + 2 * m;
    const px = (x) => m + x * sp, py = (y) => m + (BARIS - 1 - y) * sp;
    const svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, class: 'gambar-kertas' });
    const id = 'klip' + Math.floor(Math.random() * 1e6);
    const klip = svgEl('clipPath', { id });
    klip.appendChild(svgEl('rect', { x: px(0) - 8, y: py(BARIS - 1) - 8, width: (KOLOM - 1) * sp + 16, height: (BARIS - 1) * sp + 16 }));
    svg.appendChild(klip);
    svg.appendChild(svgEl('rect', { x: 2, y: 2, width: w - 4, height: h - 4, rx: 20, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    for (let x = 0; x < KOLOM; x++) for (let y = 0; y < BARIS; y++) svg.appendChild(svgEl('circle', { cx: px(x), cy: py(y), r: 4, fill: '#B9AE98' }));
    const garisPanjang = (P, Q, warna, lebar, putus) => {
      const d = kurang(Q, P);
      const a = tambah(P, d, -14), b = tambah(P, d, 14);
      const g = svgEl('g', { 'clip-path': 'url(#' + id + ')' });
      g.appendChild(svgEl('line', { x1: px(a[0]), y1: py(a[1]), x2: px(b[0]), y2: py(b[1]), stroke: warna, 'stroke-width': lebar, 'stroke-linecap': 'round', 'stroke-dasharray': putus || 'none', 'stroke-opacity': putus ? 0.7 : 1 }));
      svg.appendChild(g);
    };
    if (perpanjangAB && !kosong) garisPanjang(A, B, '#6E8FBF', 4, '10 8');
    if (kunciTampil) kunciTampil.forEach((P) => svg.appendChild(svgEl('circle', { cx: px(P[0]), cy: py(P[1]), r: 15, fill: '#2BB673', 'fill-opacity': 0.35, stroke: '#2BB673', 'stroke-width': 3 })));
    if (tarik) garisPanjang(C, tarik.P, tarik.warna, 6);
    if (pilihanSalah) svg.appendChild(svgEl('circle', { cx: px(pilihanSalah[0]), cy: py(pilihanSalah[1]), r: 15, fill: '#E04466', 'fill-opacity': 0.3, stroke: '#E04466', 'stroke-width': 3 }));
    if (lapisan) lapisan(svg, px, py);
    if (!kosong) {
      svg.appendChild(svgEl('line', { x1: px(A[0]), y1: py(A[1]), x2: px(B[0]), y2: py(B[1]), stroke: '#1F2A44', 'stroke-width': 7, 'stroke-linecap': 'round' }));
      if (pojok) {
        const [X, e1, e2] = [pojok.X, pojok.e1, pojok.e2], k = 0.5;
        const a = tambah(X, e1, k), b = tambah(a, e2, k), c = tambah(X, e2, k);
        svg.appendChild(svgEl('path', { d: 'M ' + px(X[0]) + ' ' + py(X[1]) + ' L ' + px(a[0]) + ' ' + py(a[1]) + ' L ' + px(b[0]) + ' ' + py(b[1]) + ' L ' + px(c[0]) + ' ' + py(c[1]) + ' Z', fill: '#FF8A3D', 'fill-opacity': 0.35, stroke: '#FF8A3D', 'stroke-width': 3.5 }));
      }
      [[A, B, 'A'], [B, A, 'B']].forEach(([P, lain, h2]) => {
        svg.appendChild(svgEl('circle', { cx: px(P[0]), cy: py(P[1]), r: 9, fill: '#1F2A44' }));
        const dx = px(P[0]) - px(lain[0]), dy = py(P[1]) - py(lain[1]), n = Math.hypot(dx, dy); // huruf di ujung, menjauhi garis
        teks(svg, px(P[0]) + (dx / n) * 24, py(P[1]) + (dy / n) * 24, h2, 24, '#1F2A44');
      });
      svg.appendChild(svgEl('circle', { cx: px(C[0]), cy: py(C[1]), r: 11, fill: '#E04466', stroke: '#fff', 'stroke-width': 2 }));
      teks(svg, px(C[0]) - 16, py(C[1]) - 18, 'C', 26, '#E04466');
    }
    if (ketuk) {
      for (let x = 0; x < KOLOM; x++) for (let y = 0; y < BARIS; y++) {
        const t = svgEl('circle', { cx: px(x), cy: py(y), r: sp / 2, fill: '#fff', 'fill-opacity': 0, class: 'kertas-ketuk' });
        t.addEventListener('click', () => ketuk([x, y]));
        svg.appendChild(t);
      }
    }
    return svg;
  }

  root.Garis = Object.assign({ svgEl, el, adeganSvg, kertasSvg }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
