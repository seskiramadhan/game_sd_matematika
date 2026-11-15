// Alat bersama Bab 11 (Luas & Keliling): bangun dari daftar titik bilangan bulat, luas (petak), keliling (jumlah sisi), pemotongan bangun gabungan + gambar SVG.
// KUNCI SEMUA BILANGAN BULAT. Luas dihitung dengan 4 titik uji per petak (kuartal, koordinat dikali 4, tanpa desimal): 4 kuartal = 1 petak utuh,
// 2 kuartal = setengah petak. Cek silang: rumus tali sepatu (luas x 2), jumlah p x l tiap bagian, dan keliling = jumlah sisi = tepi petak.
// Koordinat desimal (templat gambar bebas) hanya untuk menggambar. Cek logika: node tools/cek-bab11.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('../bab-8/sudut.js') : root.Sudut;
  const { acak, pilih, kocok } = S;

  // ---------- Logika (tanpa DOM) ----------
  const luas2 = (pts) => { let t = 0; const n = pts.length; for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; t += p[0] * q[1] - q[0] * p[1]; } return Math.abs(t); }; // luas x 2
  const arahPutar = (pts) => { let t = 0; const n = pts.length; for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; t += p[0] * q[1] - q[0] * p[1]; } return t; }; // > 0: berlawanan jarum jam
  // panjang tiap sisi (hanya sisi mendatar / tegak)
  const lensDari = (pts) => pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; if (p[0] !== q[0] && p[1] !== q[1]) return null; return Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]); });
  const jumlah = (a) => a.reduce((x, y) => x + y, 0);
  const kelilingPts = (pts) => { const l = lensDari(pts); return l.includes(null) ? null : jumlah(l); };

  // titik di dalam poligon (titik uji tidak pernah tepat di sisi); semua koordinat bilangan bulat (dikali 4)
  function didalam(pts4, X, Y) {
    let dalam = false; const n = pts4.length;
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pts4[i], [x2, y2] = pts4[(i + 1) % n];
      if ((y1 > Y) === (y2 > Y)) continue;
      const kiri = (x2 - x1) * (Y - y1) - (X - x1) * (y2 - y1);
      if (y2 > y1 ? kiri > 0 : kiri < 0) dalam = !dalam;
    }
    return dalam;
  }
  // kuartal tiap petak: 0 bawah, 1 kanan, 2 atas, 3 kiri
  const TITIK_UJI = [[2, 1], [3, 2], [2, 3], [1, 2]];
  function lebarTinggi(pts) { return [Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]; }
  function selDari(pts) {
    const p4 = pts.map((p) => [p[0] * 4, p[1] * 4]), [W, H] = lebarTinggi(pts), hasil = [];
    for (let i = 0; i < W; i++) for (let j = 0; j < H; j++) {
      const k = TITIK_UJI.map(([a, b]) => didalam(p4, i * 4 + a, j * 4 + b)), q = k.filter(Boolean).length;
      if (q > 0) hasil.push({ i, j, q, kuartal: k });
    }
    return hasil;
  }
  const luasDariSel = (sel) => jumlah(sel.map((s) => s.q)) / 4; // bisa pecahan bila ada kuartal ganjil (tidak dipakai di soal)
  const luasPts = (pts) => luasDariSel(selDari(pts));
  // keliling dari tepi petak (tiap sisi petak utuh yang tidak bertetangga dengan petak utuh)
  function kelilingSel(sel) {
    const penuh = new Set(sel.filter((s) => s.q === 4).map((s) => s.i + ',' + s.j));
    let t = 0;
    penuh.forEach((k) => { const [i, j] = k.split(',').map(Number); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if (!penuh.has((i + a) + ',' + (j + b))) t++; }); });
    return t;
  }

  // ---------- Bentuk ----------
  const persegiPanjang = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
  const bentukL = (W, H, w2, h2) => [[0, 0], [W, 0], [W, h2], [w2, h2], [w2, H], [0, H]];
  const bentukT = (W, hp, tw, th) => { const a = (W - tw) / 2; return [[a, 0], [a + tw, 0], [a + tw, th], [W, th], [W, th + hp], [0, th + hp], [0, th], [a, th]]; };
  const bentukU = (W, H, a, b) => [[0, 0], [W, 0], [W, H], [W - a, H], [W - a, b], [a, b], [a, H], [0, H]];
  const tangga = (...baris) => { // lebar tiap baris dari bawah ke atas (menurun)
    const hasil = [[0, 0]]; baris.forEach((w, k) => { hasil.push([w, k]); hasil.push([w, k + 1]); });
    hasil.push([0, baris.length]);
    return hasil.filter((p, i, a) => { const prev = a[(i + a.length - 1) % a.length], next = a[(i + 1) % a.length]; return !((p[0] === prev[0] && p[0] === next[0]) || (p[1] === prev[1] && p[1] === next[1])); });
  };

  // Bagian (persegi panjang) tiap cara memotong. garis: [x1,y1,x2,y2] sisi potong (putus-putus)
  function bagianL(W, H, w2, h2) {
    return [
      { id: 'mendatar', nama: 'Potong mendatar', garis: [[0, h2, w2, h2]], bagian: [{ x: 0, y: 0, w: W, h: h2 }, { x: 0, y: h2, w: w2, h: H - h2 }] },
      { id: 'tegak', nama: 'Potong tegak', garis: [[w2, 0, w2, h2]], bagian: [{ x: 0, y: 0, w: w2, h: H }, { x: w2, y: 0, w: W - w2, h: h2 }] },
    ];
  }
  function bagianT(W, hp, tw, th) {
    const a = (W - tw) / 2;
    return [
      { id: 'mendatar', nama: 'Potong mendatar', garis: [[a, th, a + tw, th]], bagian: [{ x: a, y: 0, w: tw, h: th }, { x: 0, y: th, w: W, h: hp }] },
      { id: 'tegak', nama: 'Potong tegak', garis: [[a, th, a, th + hp], [a + tw, th, a + tw, th + hp]], bagian: [{ x: 0, y: th, w: a, h: hp }, { x: a, y: 0, w: tw, h: th + hp }, { x: a + tw, y: th, w: a, h: hp }] },
    ];
  }
  function bagianU(W, H, a, b) {
    return [
      { id: 'mendatar', nama: 'Potong mendatar', garis: [[0, b, a, b], [W - a, b, W, b]], bagian: [{ x: 0, y: 0, w: W, h: b }, { x: 0, y: b, w: a, h: H - b }, { x: W - a, y: b, w: a, h: H - b }] },
      { id: 'tegak', nama: 'Potong tegak', garis: [[a, 0, a, b], [W - a, 0, W - a, b]], bagian: [{ x: 0, y: 0, w: a, h: H }, { x: a, y: 0, w: W - 2 * a, h: b }, { x: W - a, y: 0, w: a, h: H }] },
    ];
  }
  // cara kurang: persegi panjang besar dikurangi lubang
  const buatL = (W, H, w2, h2) => ({ jenis: 'L', pts: bentukL(W, H, w2, h2), W, H, cuts: bagianL(W, H, w2, h2), kurang: { besar: { w: W, h: H }, lubang: [{ w: W - w2, h: H - h2 }] } });
  const buatT = (W, hp, tw, th) => { const a = (W - tw) / 2; return { jenis: 'T', pts: bentukT(W, hp, tw, th), W, H: th + hp, cuts: bagianT(W, hp, tw, th), kurang: { besar: { w: W, h: th + hp }, lubang: [{ w: a, h: th }, { w: a, h: th }] } }; };
  const buatU = (W, H, a, b) => ({ jenis: 'U', pts: bentukU(W, H, a, b), W, H, cuts: bagianU(W, H, a, b), kurang: { besar: { w: W, h: H }, lubang: [{ w: W - 2 * a, h: H - b }] } });
  const luasBagian = (b) => b.w * b.h;
  const luasKurang = (k) => k.besar.w * k.besar.h - jumlah(k.lubang.map((l) => l.w * l.h));

  function acakL(Wmin, Wmaks, Hmin, Hmaks, tebalMin) {
    const W = acak(Wmin, Wmaks), H = acak(Hmin, Hmaks);
    return buatL(W, H, acak(tebalMin, W - tebalMin), acak(tebalMin, H - tebalMin)); // w2 = lebar tangkai tegak, h2 = tinggi alas
  }
  function acakT(Wmin, Wmaks, Hmin, Hmaks) {
    for (;;) {
      const W = acak(Wmin, Wmaks), tw = acak(2, W - 4);
      if ((W - tw) % 2 !== 0) continue;
      const th = acak(2, Hmaks - 2), hp = acak(2, Hmaks - th);
      if (th + hp < Hmin) continue;
      return buatT(W, hp, tw, th);
    }
  }
  function acakU(Wmin, Wmaks, Hmin, Hmaks) {
    for (;;) {
      const W = acak(Wmin, Wmaks), H = acak(Hmin, Hmaks), a = acak(2, 3), b = acak(2, 3);
      if (W - 2 * a < 3 || H - b < 3) continue;
      return buatU(W, H, a, b);
    }
  }

  // ---------- Pilihan jawaban ----------
  // 4 bilangan bulat berbeda (kunci + pengecoh dari kesalahan umum, lalu angka di dekat kunci)
  function opsiAngka(kunci, kandidat) {
    const set = [kunci];
    kocok(kandidat || []).forEach((v) => { if (set.length < 4 && Number.isInteger(v) && v > 0 && !set.includes(v)) set.push(v); });
    for (let d = 1; set.length < 4; d++) [kunci + d, kunci - d].forEach((v) => { if (set.length < 4 && v > 0 && !set.includes(v)) set.push(v); });
    return kocok(set);
  }
  // pilihan {v, u}: kunci + pengecoh (angka & satuan) ; tepat satu yang sama dengan kunci
  function opsiSatuan(kunci, kandidat) {
    const id = (o) => o.v + '|' + o.u, set = [kunci];
    kocok(kandidat || []).forEach((o) => { if (set.length < 4 && o.v > 0 && !set.some((x) => id(x) === id(o))) set.push(o); });
    for (let d = 1; set.length < 4; d++) [kunci.v + d, kunci.v - d].forEach((v) => { const o = { v, u: kunci.u }; if (set.length < 4 && v > 0 && !set.some((x) => id(x) === id(o))) set.push(o); });
    return kocok(set);
  }
  const teksSatuan = (u) => (u === 'cm2' ? 'cm²' : u === 'm2' ? 'm²' : u);
  const teksNilai = (o) => o.v + ' ' + teksSatuan(o.u);
  const kuadrat = (u) => (u === 'cm' ? 'cm2' : u === 'm' ? 'm2' : u);
  const lurus = (u) => (u === 'cm2' ? 'cm' : u === 'm2' ? 'm' : u);

  // ---------- Templat gambar bebas (HANYA untuk menggambar; berlawanan jarum jam; sisi diberi panjang oleh soal) ----------
  const POLI = {
    3: [[[0, 0], [9, 0], [3, 6]], [[0, 0], [8, 0], [8, 6]], [[1, 0], [9, 1], [4, 6]]],
    4: [[[0, 0], [9, 0], [7, 6], [1, 5]], [[0, 1], [8, 0], [9, 5], [2, 6]], [[0, 0], [9, 1], [8, 6], [2, 5]]],
    5: [[[1, 0], [8, 0], [10, 4], [5, 7], [0, 5]], [[0, 0], [7, 0], [9, 3], [6, 7], [1, 5]]],
    6: [[[2, 0], [8, 0], [10, 3], [8, 6], [2, 6], [0, 3]], [[1, 0], [7, 0], [10, 2], [8, 6], [3, 7], [0, 4]]],
  };
  const NAMA_N = { 3: 'segitiga', 4: 'segi empat', 5: 'segi lima', 6: 'segi enam' };

  // ---------- Jebakan: luas sama / keliling sama ----------
  const OPSI_JEBAKAN = [
    { kode: 'luasSama', nama: 'Luas sama, keliling beda' },
    { kode: 'kelSama', nama: 'Keliling sama, luas beda' },
    { kode: 'sama', nama: 'Dua-duanya sama' },
    { kode: 'beda', nama: 'Dua-duanya beda' },
  ];
  const ukur = (pts) => ({ luas: luasPts(pts), keliling: kelilingPts(pts) });
  function banding(a, b) {
    const ls = a.luas === b.luas, ks = a.keliling === b.keliling;
    return ls && ks ? 'sama' : ls ? 'luasSama' : ks ? 'kelSama' : 'beda';
  }

  const logika = {
    acak, pilih, kocok, luas2, arahPutar, lensDari, jumlah, kelilingPts, didalam, selDari, luasDariSel, luasPts, kelilingSel, lebarTinggi,
    persegiPanjang, bentukL, bentukT, bentukU, tangga, bagianL, bagianT, bagianU, buatL, buatT, buatU, luasBagian, luasKurang, acakL, acakT, acakU,
    opsiAngka, opsiSatuan, teksSatuan, teksNilai, kuadrat, lurus, POLI, NAMA_N, OPSI_JEBAKAN, ukur, banding,
  };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const { svgEl, el, teks } = S;
  const BIRU = '#3A86FF', ORANYE = '#FF8A3D', HIJAU = '#2BB673', MERAH = '#E04466', TINTA = '#1F2A44';
  const WARNA_BAGIAN = [BIRU, ORANYE, HIJAU];
  const KECIL = () => window.innerHeight < 790;
  const GARUDA = 'assets/garuda/garuda-senang.svg';

  // Kanvas kertas petak: W x H petak, u px per petak, m ruang untuk label. y ke atas (seperti buku).
  function kanvas(W, H, u, m, mx) {
    m = m == null ? 44 : m; mx = mx == null ? m : mx; // mx: ruang kiri-kanan (label "l = 3 cm" lebih lebar)
    const lebar = W * u + 2 * mx, tinggi = H * u + 2 * m;
    const svg = svgEl('svg', { viewBox: '0 0 ' + lebar + ' ' + tinggi, width: lebar, height: tinggi, class: 'gambar-luas' });
    svg.appendChild(svgEl('rect', { x: 2, y: 2, width: lebar - 4, height: tinggi - 4, rx: 20, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    const K = { svg, W, H, u, m, lebar, tinggi, px: (x) => mx + x * u, py: (y) => m + (H - y) * u };
    ['dasar', 'isi', 'garis', 'tepi', 'label', 'atas'].forEach((n) => { K[n] = svgEl('g', {}); svg.appendChild(K[n]); });
    return K;
  }
  function jalur(K, pts) { return pts.map((p, i) => (i ? 'L' : 'M') + ' ' + K.px(p[0]) + ' ' + K.py(p[1])).join(' ') + ' Z'; }
  function polaPetak(K, pts) { // bayangan bangun (pucat)
    K.dasar.appendChild(svgEl('path', { d: jalur(K, pts), fill: '#F2F8FF', stroke: 'none' }));
  }
  // garis petak: 'penuh' (semua), 'tepi' (baris pertama dan kolom pertama), 'tidak'
  function garisPetak(K, mode) {
    if (mode === 'tidak') return;
    const g = (x1, y1, x2, y2) => K.garis.appendChild(svgEl('line', { x1: K.px(x1), y1: K.py(y1), x2: K.px(x2), y2: K.py(y2), stroke: '#C9D6E8', 'stroke-width': 1.6 }));
    if (mode === 'penuh') {
      for (let x = 0; x <= K.W; x++) g(x, 0, x, K.H);
      for (let y = 0; y <= K.H; y++) g(0, y, K.W, y);
    } else {
      for (let x = 0; x <= K.W; x++) g(x, 0, x, 1);
      for (let y = 0; y <= K.H; y++) g(0, y, 1, y);
      for (let x = 0; x <= 1; x++) g(x, 0, x, K.H);
      for (let y = 0; y <= 1; y++) g(0, y, K.W, y);
    }
  }
  // petak berwarna (utuh atau tiap kuartal yang tercakup)
  function isiSel(K, s, warna, opa, nomor) {
    const gr = svgEl('g', { class: 'lk-sel' });
    const x0 = K.px(s.i), x1 = K.px(s.i + 1), yb = K.py(s.j), ya = K.py(s.j + 1), cx = (x0 + x1) / 2, cy = (yb + ya) / 2;
    const st = { fill: warna, 'fill-opacity': opa, stroke: warna, 'stroke-opacity': opa, 'stroke-width': 1 };
    if (s.q === 4) gr.appendChild(svgEl('rect', Object.assign({ x: x0, y: ya, width: x1 - x0, height: yb - ya }, st)));
    else {
      const seg = [[[x0, yb], [x1, yb]], [[x1, yb], [x1, ya]], [[x1, ya], [x0, ya]], [[x0, ya], [x0, yb]]];
      s.kuartal.forEach((a, k) => { if (a) gr.appendChild(svgEl('polygon', Object.assign({ points: seg[k][0].join(',') + ' ' + seg[k][1].join(',') + ' ' + cx + ',' + cy }, st))); });
    }
    if (nomor != null) {
      let tx = cx, ty = cy, f = Math.min(24, K.u * 0.46);
      if (s.q !== 4) { // setengah petak: angka di tengah bagian yang terisi, lebih kecil
        const T = [[0.5, 0.25], [0.75, 0.5], [0.5, 0.75], [0.25, 0.5]], k = s.kuartal.map((a, n) => (a ? T[n] : null)).filter(Boolean);
        tx = x0 + (k.reduce((a, b) => a + b[0], 0) / k.length) * K.u; ty = yb - (k.reduce((a, b) => a + b[1], 0) / k.length) * K.u; f = Math.min(17, K.u * 0.34);
        tx = tx * 0.7 + cx * 0.3 - (tx - cx) * 0.0; ty = ty * 0.7 + cy * 0.3;
      }
      const t = teks(gr, tx, ty, nomor, f, TINTA); t.setAttribute('class', 'lk-nomor');
    }
    K.isi.appendChild(gr);
    return gr;
  }
  function tepiBangun(K, pts, warna, tebal) {
    return K.tepi.appendChild(svgEl('path', { d: jalur(K, pts), fill: 'none', stroke: warna || TINTA, 'stroke-width': tebal || 6, 'stroke-linejoin': 'round' }));
  }
  function sisiGaris(K, pts, i, warna, tebal) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    return K.tepi.appendChild(svgEl('line', { x1: K.px(p[0]), y1: K.py(p[1]), x2: K.px(q[0]), y2: K.py(q[1]), stroke: warna, 'stroke-width': tebal || 9, 'stroke-linecap': 'round' }));
  }
  // posisi label sisi i: tengah sisi digeser keluar (arah luar dari urutan titik berlawanan jarum jam)
  function posLabel(K, pts, i, jarak) {
    const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], n = Math.hypot(dx, dy), ccw = arahPutar(pts) > 0 ? 1 : -1;
    const nx = (dy / n) * ccw, ny = (-dx / n) * ccw; // normal luar (koordinat y ke atas)
    return [K.px((p[0] + q[0]) / 2) + nx * jarak, K.py((p[1] + q[1]) / 2) - ny * jarak];
  }
  function labelSisi(K, pts, i, isi, warna, jarak) {
    const [x, y] = posLabel(K, pts, i, jarak || 24);
    const t = teks(K.label, x, y, isi, KECIL() ? 21 : 23, warna || TINTA);
    t.setAttribute('class', 'lk-label');
    return t;
  }
  // kotak pojok siku-siku di titik i (bila sudutnya 90 derajat), seperti Bab 8-10
  function kotakPojok(K, pts, i) {
    const n = pts.length, P = pts[i], A = pts[(i + n - 1) % n], B = pts[(i + 1) % n];
    const a = [Math.sign(A[0] - P[0]), Math.sign(A[1] - P[1])], b = [Math.sign(B[0] - P[0]), Math.sign(B[1] - P[1])], k = 13;
    const x = K.px(P[0]), y = K.py(P[1]), ax = a[0] * k, ay = -a[1] * k, bx = b[0] * k, by = -b[1] * k;
    K.label.appendChild(svgEl('path', { d: 'M ' + (x + ax) + ' ' + (y + ay) + ' l ' + bx + ' ' + by + ' l ' + (-ax) + ' ' + (-ay), fill: 'none', stroke: TINTA, 'stroke-width': 2.4, opacity: 0.7 }));
  }
  function semuaPojok(K, pts) {
    const n = pts.length;
    for (let i = 0; i < n; i++) { const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n]; if ((a[0] === p[0] && b[1] === p[1]) || (a[1] === p[1] && b[0] === p[0])) kotakPojok(K, pts, i); }
  }
  // tanda sisi sama panjang (garis kecil di tengah sisi)
  function tandaSama(K, pts, i) {
    const p = pts[i], q = pts[(i + 1) % pts.length], mx = K.px((p[0] + q[0]) / 2), my = K.py((p[1] + q[1]) / 2), dx = q[0] - p[0], dy = -(q[1] - p[1]), n = Math.hypot(dx, dy);
    const nx = -dy / n, ny = dx / n;
    K.label.appendChild(svgEl('line', { x1: mx - nx * 9, y1: my - ny * 9, x2: mx + nx * 9, y2: my + ny * 9, stroke: MERAH, 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
  }
  // lapisan ketuk (transparan) di atas sisi
  function ketukSisi(K, pts, i, fn) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    const t = svgEl('line', { x1: K.px(p[0]), y1: K.py(p[1]), x2: K.px(q[0]), y2: K.py(q[1]), stroke: '#fff', 'stroke-opacity': 0, 'stroke-width': 34, 'stroke-linecap': 'round', class: 'lk-ketuk' });
    t.addEventListener('click', () => fn(i));
    K.atas.appendChild(t);
    return t;
  }
  function ketukSel(K, s, fn) {
    const t = svgEl('rect', { x: K.px(s.i), y: K.py(s.j + 1), width: K.u, height: K.u, fill: '#fff', 'fill-opacity': 0, class: 'lk-ketuk' });
    t.addEventListener('click', () => fn(s));
    K.atas.appendChild(t);
    return t;
  }
  // Garuda kecil yang berjalan ke titik (gx, gy) dalam petak
  function garudaJalan(K) {
    const g = svgEl('image', { href: GARUDA, width: 44, height: 44, x: -22, y: -40, class: 'lk-garuda' });
    g.style.opacity = 0;
    K.atas.appendChild(g);
    return {
      ke(x, y, langsung) {
        if (langsung) g.style.transition = 'none';
        g.style.opacity = 1;
        g.style.transform = 'translate(' + K.px(x) + 'px,' + K.py(y) + 'px)';
        if (langsung) { void g.getBoundingClientRect(); g.style.transition = ''; }
      },
      hilang() { g.style.opacity = 0; },
    };
  }

  // ukuran petak yang muat: bangun W x H petak di kotak maksimum (lebar, tinggi px)
  function petakMuat(W, H, maksLebar, maksTinggi, m, uMaks, mx) {
    m = m == null ? 44 : m; mx = mx == null ? m : mx;
    return Math.max(14, Math.floor(Math.min((maksLebar - 2 * mx) / W, (maksTinggi - 2 * m) / H, uMaks || 64)));
  }
  const batasGambar = () => (KECIL() ? { w: 560, h: 270 } : { w: 600, h: 330 });

  // kotak kecil berisi bangun pada kertas petak (kartu pilihan / perbandingan). Sisi mendatar saja.
  function bangunKecil(pts, { lebar = 280, tinggi = 200, warna = BIRU, grid = 'penuh', isi = true, bagian = null } = {}) {
    const [W, H] = lebarTinggi(pts), m = 10, u = petakMuat(W, H, lebar, tinggi, m, 44), K = kanvas(W, H, u, m);
    polaPetak(K, pts);
    if (isi) selDari(pts).forEach((s) => isiSel(K, s, warna, 0.4));
    if (bagian) bagian.forEach((b, k) => selDari(persegiPanjang(b.w, b.h).map((p) => [p[0] + b.x, p[1] + b.y])).forEach((s) => isiSel(K, s, WARNA_BAGIAN[k % 3], 0.45)));
    garisPetak(K, grid);
    tepiBangun(K, pts, TINTA, 4);
    K.svg.classList.add('lk-kecil');
    return K.svg;
  }

  root.Luas = Object.assign({
    svgEl, el, teks, kanvas, polaPetak, garisPetak, isiSel, tepiBangun, sisiGaris, posLabel, labelSisi, kotakPojok, semuaPojok, tandaSama, ketukSisi, ketukSel,
    garudaJalan, petakMuat, batasGambar, bangunKecil, KECIL, BIRU, ORANYE, HIJAU, MERAH, TINTA, WARNA_BAGIAN,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
