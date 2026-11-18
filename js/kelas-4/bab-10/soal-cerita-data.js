// Data 📖 Soal Cerita Kelas 4 Bab 10 (Segi Banyak) untuk mesin js/soal-cerita.js.
// Dua jenis (video Jago Soal Cerita Ep. 6, "Bangun Apa? atau Berapa Panjang?"):
//   BANGUN : "Bangun apa?" -> nama bangun dari SIFAT (berapa pasang sisi sejajar, ada sudut siku?, sisi sama panjang, banyak sisi).
//            Kunci tunggal = nama paling khusus (persegi bukan "persegi panjang"); trapesium = tepat satu pasang sisi sejajar.
//   PANJANG: "Berapa panjang tepi?" -> segi banyak beraturan: banyak sisi x panjang sisi (pita, pagar, bingkai, lidi).
//            Pengecoh: hanya satu sisi, atau dikira 4 sisi.
// Jawaban "bangun" berupa NAMA: pilihan jawaban memakai kode bilangan (kunci) + labelOpsi (kode -> nama), didukung mesin js/soal-cerita.js.
// Langkah Gambar: BANGUN = pilih gambar yang tandanya cocok dengan petunjuk (panah = sejajar, garis kecil = sama panjang, kotak pojok = siku);
//                 PANJANG = pilih model bangun dengan pojok dinomori dan semua sisi disorot (banyak pojok = banyak sisi).
// Nama bangun dikenali KODE dari titik (Bangun.jenisSegiEmpat dari tools Bab 10 untuk segi empat), tidak ditulis tangan.
// Tes: node tools/cek-soal-cerita-bab10.js
// Contoh tetap (sama dengan video Ep. 6 / Buku Saku): kertas Dina (persegi 2 x 2 dipotong diagonal, disusun (0,0)(2,0)(4,2)(2,2)) = jajargenjang
//   (tingkat 2); ubin Pak Rudi segi enam beraturan sisi 4 cm: pita 6 x 4 = 24 cm; bingkai foto segi lima beraturan sisi 7 cm: 5 x 7 = 35 cm (tingkat 1).
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const B = modul ? require('./bangun.js') : root.Bangun;
  const { acak, pilih, kocok, fmt, buatOpsi } = M;

  const T = (t) => ({ k: 'teks', t });
  const A = (t) => ({ k: 'angka', t, penting: true }); // petunjuk penting (kuning)
  const N = (v) => ({ k: 'angka', t: String(v), penting: true });
  const Q = (t) => ({ k: 'tanya', t });
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 };
  const KATA = { 3: 'tiga', 4: 'empat', 5: 'lima', 6: 'enam', 7: 'tujuh', 8: 'delapan' };

  // ---------- nama & kode ----------
  const KODE = { persegi: 1, 'persegi-panjang': 2, jajargenjang: 3, 'belah-ketupat': 4, trapesium: 5, 'layang-layang': 6, 'sama-sisi': 11, 'sama-kaki': 12, 'siku-siku': 13, sembarang: 14, 'segi-5': 25, 'segi-6': 26, 'segi-7': 27, 'segi-8': 28 };
  const NAMA = {
    persegi: 'Persegi', 'persegi-panjang': 'Persegi panjang', jajargenjang: 'Jajargenjang', 'belah-ketupat': 'Belah ketupat', trapesium: 'Trapesium', 'layang-layang': 'Layang-layang',
    'sama-sisi': 'Segitiga sama sisi', 'sama-kaki': 'Segitiga sama kaki', 'siku-siku': 'Segitiga siku-siku', sembarang: 'Segitiga sembarang',
    'segi-5': 'Segi lima', 'segi-6': 'Segi enam', 'segi-7': 'Segi tujuh', 'segi-8': 'Segi delapan',
  };
  const DEF = {
    persegi: 'keempat sisinya sama panjang dan keempat sudutnya siku-siku',
    'persegi-panjang': 'dua pasang sisi sejajar dan empat sudut siku-siku (sisi yang bersebelahan tidak sama)',
    jajargenjang: 'dua pasang sisi sejajar, sisi yang bersebelahan tidak sama, dan tanpa sudut siku-siku',
    'belah-ketupat': 'keempat sisinya sama panjang dan tanpa sudut siku-siku',
    trapesium: 'tepat satu pasang sisi sejajar',
    'layang-layang': 'dua pasang sisi sama panjang yang bersebelahan dan tidak ada sisi sejajar',
    'sama-sisi': 'ketiga sisinya sama panjang',
    'sama-kaki': 'tepat dua sisinya sama panjang',
    'siku-siku': 'satu sudutnya siku-siku',
    sembarang: 'ketiga sisinya berbeda panjang dan tidak ada sudut siku-siku',
  };
  const SE4 = ['persegi', 'persegi-panjang', 'jajargenjang', 'trapesium'];
  const SE6 = ['persegi', 'persegi-panjang', 'jajargenjang', 'belah-ketupat', 'trapesium', 'layang-layang'];
  const SEG3 = ['sama-sisi', 'sama-kaki', 'siku-siku'];
  const SEG3_OPSI = ['sama-sisi', 'sama-kaki', 'siku-siku', 'sembarang'];
  const BANYAK = ['segi-5', 'segi-6', 'segi-7', 'segi-8'];
  const grupDari = (tid) => (SE6.includes(tid) ? 'se' : SEG3.includes(tid) ? 'tiga' : 'banyak');
  const POOL = {
    1: SE4,
    2: SE6.concat(SEG3),
    3: SE6.concat(SEG3, BANYAK),
  };
  const jumlahSisi = (tid) => (grupDari(tid) === 'se' ? 4 : grupDari(tid) === 'tiga' ? 3 : Number(tid.slice(5)));

  // petunjuk (ciri) tiap bangun: lengkap (tingkat 1-2) dan ringkas (tingkat 3). Kalimat dipakai juga oleh tools/cek-soal-cerita-bab10.js.
  const C = {
    sejajar2: 'dua pasang sisi sejajar', sejajar1: 'tepat satu pasang sisi sejajar', sejajar0: 'tidak ada sisi yang sejajar',
    siku4: 'empat sudut siku-siku', siku0: 'tidak ada sudut siku-siku',
    sama4: 'keempat sisinya sama panjang', beda: 'sisi yang bersebelahan tidak sama panjang', layang: 'dua pasang sisi sama panjang yang bersebelahan',
    t3: 'ketiga sisinya sama panjang', t2: 'tepat dua sisinya sama panjang', lancip: 'semua sudutnya lancip', sikuT: 'satu sudutnya siku-siku', tak: 'tidak ada dua sisi yang sama panjang',
  };
  const CIRI = {
    persegi: { penuh: [C.sejajar2, C.siku4, C.sama4], ringkas: [C.siku4, C.sama4] },
    'persegi-panjang': { penuh: [C.sejajar2, C.siku4, C.beda], ringkas: [C.siku4, C.beda] },
    jajargenjang: { penuh: [C.sejajar2, C.siku0, C.beda], ringkas: [C.sejajar2, C.siku0, C.beda] },
    'belah-ketupat': { penuh: [C.sejajar2, C.siku0, C.sama4], ringkas: [C.siku0, C.sama4] },
    trapesium: { penuh: [C.sejajar1], ringkas: [C.sejajar1] },
    'layang-layang': { penuh: [C.sejajar0, C.layang], ringkas: [C.sejajar0, C.layang] },
    'sama-sisi': { penuh: [C.t3], ringkas: [C.t3] },
    'sama-kaki': { penuh: [C.t2, C.lancip], ringkas: [C.t2, C.lancip] },
    'siku-siku': { penuh: [C.sikuT, C.tak], ringkas: [C.sikuT, C.tak] },
  };

  // ---------- geometri (desimal, hanya untuk menggambar dan mengenali bentuk dari titik) ----------
  const dekat = (a, b, eps) => Math.abs(a - b) <= (eps || 1e-6) * Math.max(1, Math.abs(a), Math.abs(b));
  function kelasTol(arr) { const unik = []; return arr.map((v) => { let k = unik.findIndex((u) => dekat(u, v)); if (k < 0) { unik.push(v); k = unik.length - 1; } return k; }); }
  function geom(P) {
    const n = P.length;
    const s = P.map((p, i) => { const q = P[(i + 1) % n]; return [q[0] - p[0], q[1] - p[1]]; });
    const L2 = s.map((v) => v[0] * v[0] + v[1] * v[1]);
    const kelas = kelasTol(L2);
    const sejajar = [];
    if (n === 4) [[0, 2], [1, 3]].forEach(([i, j]) => { const c = s[i][0] * s[j][1] - s[i][1] * s[j][0]; if (Math.abs(c) <= 1e-9 * Math.sqrt(L2[i] * L2[j])) sejajar.push([i, j]); });
    const siku = [];
    for (let i = 0; i < n; i++) { const a = s[(i + n - 1) % n], b = s[i]; const d = a[0] * b[0] + a[1] * b[1]; if (Math.abs(d) <= 1e-9 * Math.sqrt(L2[(i + n - 1) % n] * L2[i])) siku.push(i); }
    return { n, s, L2, kelas, sejajar, siku };
  }
  // tanda gambar mirip bentuk: ukuran kelas panjang sisi + posisinya (berdekatan / berhadapan) + sejajar + siku
  function sidik(P) {
    const g = geom(P), cacah = {}; g.kelas.forEach((k) => { cacah[k] = (cacah[k] || 0) + 1; });
    const ukuran = Object.values(cacah).sort().join('');
    const dekatSama = g.n === 4 && ukuran === '22' && (g.kelas[0] === g.kelas[1] || g.kelas[1] === g.kelas[2]);
    return [g.n, g.sejajar.length, g.siku.length, ukuran, dekatSama ? 'b' : 'h'].join('|');
  }
  // kenali nama bangun dari titik (id). Segi empat: titik bilangan bulat, dihitung Bangun.jenisSegiEmpat.
  function kenali(P) {
    const g = geom(P);
    if (g.n === 3) {
      const sama = [g.kelas[0] === g.kelas[1], g.kelas[1] === g.kelas[2], g.kelas[0] === g.kelas[2]].filter(Boolean).length;
      if (g.siku.length) return sama ? 'siku-sama-kaki' : 'siku-siku';
      return sama === 3 ? 'sama-sisi' : sama ? 'sama-kaki' : 'sembarang';
    }
    if (g.n === 4) return B.jenisSegiEmpat(P);
    return 'segi-' + g.n;
  }
  const neg = (pts) => pts.map((p) => [p[0], -p[1]]);
  const REG = (n) => neg(B.reg(n, n === 6 ? 0 : n === 8 ? -67.5 : -90));

  // ---------- pembuat titik tiap bangun (y ke atas) ----------
  const GEN = {
    persegi(t) { const [u, w] = t === 3 ? pilih([[2, 0], [3, 0], [4, 0], [1, 1], [2, 1], [1, 2]]) : pilih([[2, 0], [3, 0], [4, 0]]); return [[0, 0], [u, w], [u - w, w + u], [-w, u]]; },
    'persegi-panjang'() { let a, b; do { a = acak(3, 6); b = acak(2, 4); } while (a === b); return [[0, 0], [a, 0], [a, b], [0, b]]; },
    jajargenjang() { for (;;) { const w = acak(3, 5), h = acak(2, 3), s = acak(1, 2); if (w * w !== s * s + h * h) return [[0, 0], [w, 0], [w + s, h], [s, h]]; } },
    'belah-ketupat'() { let a, b; do { a = acak(2, 3); b = acak(1, 3); } while (a === b); return [[a, 0], [2 * a, b], [a, 2 * b], [0, b]]; },
    trapesium() { const w = acak(4, 6), t = acak(2, w - 1), h = acak(2, 3), o = acak(0, w - t); return [[0, 0], [w, 0], [o + t, h], [o, h]]; },
    'layang-layang'() { let b, c; do { b = acak(1, 3); c = acak(1, 4); } while (b === c); const a = acak(1, 3); return [[0, 0], [a, b], [0, b + c], [-a, b]]; },
    'sama-sisi'() { return REG(3); },
    'sama-kaki'() { const [b, h] = pilih([[4, 3], [4, 4], [4, 5], [6, 4], [6, 5], [6, 6]]); return [[0, 0], [b, 0], [b / 2, h]]; },
    'siku-siku'() { let a, b; do { a = acak(2, 5); b = acak(2, 5); } while (a === b); const k = Math.random() < 0.5 ? 1 : -1; return [[0, 0], [k * a, 0], [0, b]]; },
  };
  BANYAK.forEach((id) => { GEN[id] = () => REG(Number(id.slice(5))); });
  function buatPts(tid, tingkat) {
    for (let i = 0; i < 200; i++) { const P = GEN[tid](tingkat); if (kenali(P) === tid) return P; }
    throw new Error('buatPts gagal ' + tid);
  }

  // ---------- gambar SVG (string) ----------
  const svgW = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  function keLayar(P) {
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const k = Math.min(230 / (x1 - x0 || 1), 118 / (y1 - y0 || 1));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return P.map((p) => [160 + (p[0] - cx) * k, 95 - (p[1] - cy) * k]);
  }
  const r1 = (v) => Math.round(v * 100) / 100;
  // tanda: garis kecil (sisi sama), panah (sejajar), kotak pojok (siku). Dihitung dari bentuk titiknya sendiri.
  function tandaGambar(S, g, o) {
    let s = '';
    const n = S.length, sisi = (i) => { const a = S[i], b = S[(i + 1) % n], d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]); return { a, b, e: [d[0] / L, d[1] / L], nr: [-d[1] / L, d[0] / L] }; };
    const cacah = {}; g.kelas.forEach((k) => { cacah[k] = (cacah[k] || 0) + 1; });
    const banyak = []; g.kelas.forEach((k) => { if (cacah[k] > 1 && !banyak.includes(k)) banyak.push(k); });
    g.kelas.forEach((k, i) => {
      const r = banyak.indexOf(k); if (r < 0) return;
      const E = sisi(i), pos = g.n === 4 && g.sejajar.length ? 0.34 : 0.5;
      for (let t = 0; t <= r; t++) {
        const off = (t - r / 2) * 8, c = [E.a[0] + (E.b[0] - E.a[0]) * pos + E.e[0] * off, E.a[1] + (E.b[1] - E.a[1]) * pos + E.e[1] * off];
        s += '<line x1="' + r1(c[0] - E.nr[0] * 9) + '" y1="' + r1(c[1] - E.nr[1] * 9) + '" x2="' + r1(c[0] + E.nr[0] * 9) + '" y2="' + r1(c[1] + E.nr[1] * 9) + '" stroke="#E04466" stroke-width="3.5" stroke-linecap="round"/>';
      }
    });
    if (!o.tanpaSejajar) g.sejajar.forEach(([i, j], r) => {
      const E1 = sisi(i);
      [i, j].forEach((m) => {
        const E = sisi(m), arah = E.e[0] * E1.e[0] + E.e[1] * E1.e[1] >= 0 ? 1 : -1, d = [E.e[0] * arah, E.e[1] * arah];
        for (let t = 0; t <= r; t++) {
          const c0 = [E.a[0] + (E.b[0] - E.a[0]) * 0.68, E.a[1] + (E.b[1] - E.a[1]) * 0.68], off = (t - r / 2) * 9, c = [c0[0] + d[0] * off, c0[1] + d[1] * off];
          const tip = [c[0] + d[0] * 6, c[1] + d[1] * 6], a1 = [tip[0] - d[0] * 9 + E.nr[0] * 8, tip[1] - d[1] * 9 + E.nr[1] * 8], b1 = [tip[0] - d[0] * 9 - E.nr[0] * 8, tip[1] - d[1] * 9 - E.nr[1] * 8];
          s += '<path d="M ' + r1(a1[0]) + ' ' + r1(a1[1]) + ' L ' + r1(tip[0]) + ' ' + r1(tip[1]) + ' L ' + r1(b1[0]) + ' ' + r1(b1[1]) + '" fill="none" stroke="#2A7BE8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      });
    });
    if (!o.tanpaSiku) g.siku.forEach((i) => {
      const V = S[i], Pr = S[(i + n - 1) % n], Nx = S[(i + 1) % n];
      const ua = [Pr[0] - V[0], Pr[1] - V[1]], ub = [Nx[0] - V[0], Nx[1] - V[1]], la = Math.hypot(ua[0], ua[1]), lb = Math.hypot(ub[0], ub[1]), k = 15;
      const e1 = [ua[0] / la * k, ua[1] / la * k], e2 = [ub[0] / lb * k, ub[1] / lb * k];
      s += '<path d="M ' + r1(V[0]) + ' ' + r1(V[1]) + ' l ' + r1(e1[0]) + ' ' + r1(e1[1]) + ' l ' + r1(e2[0]) + ' ' + r1(e2[1]) + ' l ' + r1(-e1[0]) + ' ' + r1(-e1[1]) + ' Z" fill="#FF8A3D" fill-opacity="0.4" stroke="#FF8A3D" stroke-width="3"/>';
    });
    return s;
  }
  // bangun dengan tanda sifatnya (soal "bangun")
  function gambarBangun(P) {
    const S = keLayar(P), g = geom(P);
    let s = '<rect x="1" y="1" width="318" height="188" rx="14" fill="#FFFFFF" stroke="#E9DFCB" stroke-width="3"/>';
    s += '<polygon points="' + S.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') + '" fill="#BFDCFF" fill-opacity="0.85" stroke="#1F2A44" stroke-width="5" stroke-linejoin="round"/>';
    s += tandaGambar(S, g, {});
    S.forEach((p) => { s += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="5" fill="#1F2A44"/>'; });
    return svgW(s);
  }
  // model tepi (soal "panjang"): segi-n beraturan, pojok dinomori, sisi disorot ('semua' atau 'satu')
  function gambarTepi(n, mode) {
    const P = REG(n), S = keLayar(P), g = geom(P);
    let s = '<rect x="1" y="1" width="318" height="188" rx="14" fill="#FFFFFF" stroke="#E9DFCB" stroke-width="3"/>';
    s += '<polygon points="' + S.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') + '" fill="#BFDCFF" fill-opacity="0.6" stroke="none"/>';
    S.forEach((p, i) => {
      const q = S[(i + 1) % n], sorot = mode === 'semua' || i === 0;
      s += '<line' + (sorot ? ' class="sorot"' : '') + ' x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(q[0]) + '" y2="' + r1(q[1]) + '" stroke="' + (sorot ? '#FF8A3D' : '#8C97B2') + '" stroke-width="' + (sorot ? 8 : 4) + '" stroke-linecap="round"/>';
    });
    s += tandaGambar(S, g, { tanpaSejajar: true, tanpaSiku: true });
    S.forEach((p, i) => { s += '<circle class="nomor" cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="11" fill="#FFC400" stroke="#E0A800" stroke-width="2.5"/><text x="' + r1(p[0]) + '" y="' + r1(p[1] + 5) + '" font-size="14" font-weight="800" text-anchor="middle" fill="#1F2A44">' + (i + 1) + '</text>'; });
    return svgW(s);
  }

  // ---------- pengecoh angka & cerita ----------
  function sisipPengecoh(segmen, tingkat, terlarang, gen) {
    const dis = [];
    kocok(gen).slice(0, BANYAK_PENGECOH[tingkat]).forEach((g) => {
      let v, n = 0;
      do { v = acak(2, 9); n++; } while (terlarang.has(v) && n < 100);
      terlarang.add(v); dis.push(v);
      const [d, b] = g.split('{x}');
      segmen.splice(segmen.length - 1, 0, T(d), { k: 'angka', t: String(v), penting: false }, T(b + ' '));
    });
    return dis;
  }
  const GEN_BANGUN = ['Pekerjaan itu selesai dalam {x} jam.', 'Ada {x} temannya yang ikut melihat.', 'Hasilnya dipajang pada pukul {x} siang.'];
  const PEMBUKA = [
    { p: 'Dina menggunting selembar kertas warna menjadi satu bangun datar.', q: 'Bangun apa yang dibuat Dina?' },
    { p: 'Pak Rudi merancang bentuk ubin untuk lantai ruang tamu.', q: 'Bangun apa bentuk ubin itu?' },
    { p: 'Bu Wati menggambar denah sebuah taman bermain.', q: 'Bangun apa denah taman itu?' },
    { p: 'Ali membuat bingkai dari karton bekas.', q: 'Bangun apa bingkai buatan Ali?' },
    { p: 'Seorang pengrajin membuat hiasan dinding dari kayu.', q: 'Bangun apa hiasan dinding itu?' },
    { p: 'Sinta melipat kertas origami menjadi satu bentuk.', q: 'Bangun apa yang terbentuk?' },
  ];
  const adaKata = (arr) => arr.map((x, i) => (i === 0 ? '' : i === arr.length - 1 ? ' dan ' : ', ') + x).join('');

  // sebab pilihan salah (nama): benar sifatnya tetapi ada nama lebih tepat / definisi nama itu tidak cocok / jumlah sisi
  function sebabNama(o, kunci, grup, n) {
    if (grup === 'banyak') return NAMA[o] + ' punya ' + KATA[jumlahSisi(o)] + ' sisi, sedangkan bangun ini punya ' + KATA[n] + ' sisi. Hitung sisinya.';
    if (B.LEBIH_UMUM[kunci] && B.LEBIH_UMUM[kunci].includes(o)) return NAMA[o] + ' memang benar sifatnya, tetapi ada nama yang lebih tepat: ' + NAMA[kunci].toLowerCase() + '.';
    return NAMA[o] + ' itu ' + DEF[o] + '. Cocokkan lagi dengan petunjuk di cerita.';
  }
  const ceklis = (P, tid) => {
    const g = geom(P), cacah = {}; g.kelas.forEach((k) => { cacah[k] = (cacah[k] || 0) + 1; });
    const sama = Math.max(...Object.values(cacah));
    const baris = [];
    if (g.n === 4) {
      baris.push(g.sejajar.length === 2 ? '2 pasang sisi sejajar' : g.sejajar.length === 1 ? 'tepat 1 pasang sisi sejajar' : 'tidak ada sisi sejajar');
      baris.push(g.siku.length === 4 ? '4 sudut siku-siku' : g.siku.length === 0 ? 'tidak ada sudut siku-siku' : g.siku.length + ' sudut siku-siku');
      baris.push(sama === 4 ? '4 sisi sama panjang' : sama === 2 ? (g.kelas[0] === g.kelas[2] ? 'sisi yang berhadapan sama panjang' : '2 pasang sisi sama panjang yang bersebelahan') : 'sisi tidak ada yang sama');
    } else if (g.n === 3) {
      baris.push(sama === 3 ? '3 sisi sama panjang' : sama === 2 ? 'tepat 2 sisi sama panjang' : 'tidak ada sisi yang sama panjang');
      baris.push(g.siku.length ? '1 sudut siku-siku' : 'tidak ada sudut siku-siku');
    } else baris.push(g.n + ' sisi lurus, ' + g.n + ' titik sudut');
    return baris;
  };

  // ---------- BANGUN ----------
  function soalBangun(tingkat, pakai) {
    for (let coba = 0; coba < 2000; coba++) {
      let contoh = false, tid, P, segmen, cerita0, q, dis = [];
      if (tingkat === 2 && Math.random() < 0.12) {
        contoh = true; tid = 'jajargenjang'; P = [[0, 0], [2, 0], [4, 2], [2, 2]];
        q = 'Bangun apa yang terbentuk?';
        const ciri = CIRI[tid].penuh;
        segmen = [T('Dina punya selembar kertas berbentuk persegi, '), { k: 'angka', t: '2', penting: false }, T(' petak kali '), { k: 'angka', t: '2', penting: false },
          T(' petak. Ia memotongnya sepanjang diagonal menjadi dua segitiga siku-siku yang sama, lalu menyusun keduanya menjadi satu bangun baru. Ciri-ciri bangun baru: '),
          A(ciri[0]), T(', '), A(ciri[1]), T(' dan '), A(ciri[2]), T('. '), Q(q)];
        cerita0 = 'Dina punya selembar kertas berbentuk persegi. Ia memotongnya sepanjang diagonal menjadi dua segitiga siku-siku yang sama, lalu menyusun keduanya menjadi satu bangun baru. Ciri-ciri bangun baru: ' + adaKata(ciri) + '. ' + q;
      } else {
        tid = pilih(POOL[tingkat]); P = buatPts(tid, tingkat);
        const pb = pilih(PEMBUKA); q = pb.q;
        const grup = grupDari(tid), n = jumlahSisi(tid);
        if (grup === 'banyak') {
          segmen = [T(pb.p + ' Bangun itu tertutup dan semua sisinya lurus. Ciri-cirinya: punya '), A(KATA[n] + ' sisi'), T(' yang sama panjang, dengan sudut yang sama besar. '), Q(q)];
          cerita0 = pb.p + ' Bangun itu tertutup dan semua sisinya lurus. Ciri-cirinya: punya ' + KATA[n] + ' sisi yang sama panjang, dengan sudut yang sama besar. ' + q;
        } else {
          const ciri = CIRI[tid][tingkat === 3 ? 'ringkas' : 'penuh'];
          const awal = pb.p + ' Bangun itu punya ' + KATA[n] + ' sisi. Ciri-cirinya: ';
          segmen = [T(awal)];
          ciri.forEach((c, i) => { if (i) segmen.push(T(i === ciri.length - 1 ? ' dan ' : ', ')); segmen.push(A(c)); });
          segmen.push(T('. '), Q(q));
          cerita0 = awal + adaKata(ciri) + '. ' + q;
        }
        dis = sisipPengecoh(segmen, tingkat, new Set(), GEN_BANGUN);
      }
      const nama = kenali(P);
      if (nama !== tid) continue;
      const kode = 'bgn-' + tid + '-' + P.map((p) => r1(p[0]) + ',' + r1(p[1])).join(';');
      if (pakai && pakai.has(kode)) continue;
      const grup = grupDari(tid), n = P.length, kunci = KODE[tid];
      // pilihan jawaban (4 nama)
      const kelompok = grup === 'se' ? (tingkat === 1 ? SE4 : SE6) : grup === 'tiga' ? SEG3_OPSI : BANYAK;
      const lain = kelompok.filter((x) => x !== tid);
      const { opsi, sebab } = buatOpsi(kunci, lain.map((o) => ({ s: sebabNama(o, tid, grup, n), v: [KODE[o]] })), lain.map((o) => KODE[o]), { min: 1, maks: 40 });
      const labelOpsi = {}; opsi.forEach((k) => { labelOpsi[k] = NAMA[Object.keys(KODE).find((id) => KODE[id] === k)]; });
      // tiga gambar: bangun benar + 2 bangun lain dengan tanda berbeda
      const sidikBenar = sidik(P), pilihanId = [tid];
      const gambarPool = (grup === 'se' ? (tingkat === 1 ? SE4 : SE6) : grup === 'tiga' ? SEG3 : BANYAK).filter((x) => x !== tid);
      const cal = {}; cal[tid] = P;
      kocok(gambarPool).forEach((x) => {
        if (pilihanId.length >= 3) return;
        const Px = buatPts(x, tingkat), sg = sidik(Px);
        if (sg === sidikBenar || pilihanId.some((y) => sidik(cal[y]) === sg)) return;
        cal[x] = Px; pilihanId.push(x);
      });
      if (pilihanId.length < 3) continue;
      const huruf = ['A', 'B', 'C'];
      const pilihan = kocok(pilihanId).map((x, i) => ({ id: 'g-' + x, ket: 'Gambar ' + huruf[i], svg: gambarBangun(cal[x]), tid: x, pts: cal[x] }));
      const baris = ceklis(P, tid);
      let cek = 'Petunjuk di cerita dicocokkan dengan sifat bangun:<br>' + baris.map((b) => '✔ ' + b).join('<br>') + '<br>Jadi bangun itu adalah <b>' + NAMA[tid] + '</b>.';
      if (contoh) cek += '<br><small>Dua segitiga siku-siku tadi masing-masing 2 petak, jadi bangun baru luasnya 2 + 2 = 4 petak, sama dengan persegi 2 × 2 tadi.</small>';
      else if (B.LEBIH_UMUM[tid]) cek += '<br><small>Cek: bangun ini juga punya sifat ' + B.LEBIH_UMUM[tid].map((x) => NAMA[x].toLowerCase()).join(' dan ') + ', tetapi nama yang paling khusus (paling tepat) adalah ' + NAMA[tid].toLowerCase() + '.</small>';
      else cek += '<br><small>Cek: pilih nama yang paling cocok dengan <b>semua</b> petunjuk, bukan hanya sebagian.</small>';
      return {
        jenis: 'bangun', tingkat, kode, tid, pts: P, kunci, contoh, labelOpsi, coba: 'Coba cek lagi sifatnya.',
        cerita0, kata: ['Bangun apa'], segmen, angkaPengecoh: dis, arahAngka: 'petunjuk tentang sifat bangun (sisi, sudut)',
        hintKurang: 'Masih ada petunjuk sifat bangun yang belum kuning. Ketuk petunjuk tentang sisi sejajar, sudut siku-siku, atau sisi sama panjang.',
        gambar: { benar: 'g-' + tid, pilihan }, tanya4: { teks: q, satuan: '' }, opsi, sebab, cek,
      };
    }
    throw new Error('soalBangun gagal');
  }

  // ---------- PANJANG ----------
  const namaBeraturan = (n) => (n === 3 ? 'segitiga sama sisi' : 'segi ' + KATA[n] + ' beraturan');
  const TEMPLAT = [
    { id: 'ubin', n: [3, 5, 6, 8], pendek: 'cm', satuan: 'sentimeter', tanya: 'Berapa sentimeter pita yang dibutuhkan?', kata: ['Di sepanjang tepi'],
      c0: (b) => 'Pak Rudi punya sebuah ubin berbentuk ' + b + '. Di sepanjang tepi ubin itu akan dipasang pita. ',
      isi: (b, s) => [T('Ubin Pak Rudi berbentuk '), A(b), T(', panjang tiap sisinya '), N(s), T(' cm. Di sepanjang tepi ubin itu dipasang pita. ')],
      dis: ['Ubin itu dibeli {x} hari yang lalu.', 'Pak Rudi dibantu {x} orang memasang pita itu.'] },
    { id: 'bingkai', n: [3, 5, 6, 8], pendek: 'cm', satuan: 'sentimeter', tanya: 'Berapa sentimeter pita hias yang dibutuhkan?', kata: ['Seluruh sisinya'],
      c0: (b) => 'Sebuah bingkai foto berbentuk ' + b + '. Seluruh sisinya akan dililit pita hias. ',
      isi: (b, s) => [T('Bingkai foto berbentuk '), A(b), T(', panjang tiap sisinya '), N(s), T(' cm. Seluruh sisinya dililit pita hias. ')],
      dis: ['Foto di bingkai itu diambil {x} bulan lalu.', 'Bingkai itu dibuat selama {x} hari.'] },
    { id: 'taman', n: [5, 6, 8], pendek: 'm', satuan: 'meter', tanya: 'Berapa meter pagar yang dibutuhkan?', kata: ['dipagari'],
      c0: (b) => 'Sebuah taman kota berbentuk ' + b + '. Taman itu akan dipagari di sekeliling tepinya. ',
      isi: (b, s) => [T('Taman kota berbentuk '), A(b), T(', panjang tiap sisinya '), N(s), T(' meter. Taman itu dipagari di sekeliling tepinya. ')],
      dis: ['Di taman itu ada {x} bangku.', 'Pemasangan pagar dibantu {x} tukang.'] },
    { id: 'lidi', n: [3, 5, 6, 7, 8], pendek: 'cm', satuan: 'sentimeter', tanya: 'Berapa sentimeter lidi yang dibutuhkan?', kata: ['kerangka'],
      c0: (b) => 'Ali membuat kerangka berbentuk ' + b + ' dari lidi. Setiap sisi kerangka dibuat dari satu lidi yang dipotong. ',
      isi: (b, s) => [T('Ali membuat kerangka berbentuk '), A(b), T(' dari lidi. Setiap sisinya dipotong '), N(s), T(' cm. ')],
      dis: ['Ali membuatnya {x} hari yang lalu.', 'Ada {x} temannya yang ikut membuat.'] },
    { id: 'lampu', n: [3, 5, 6, 8], pendek: 'm', satuan: 'meter', tanya: 'Berapa meter tali lampu yang dibutuhkan?', kata: ['mengelilingi'],
      c0: (b) => 'Panggung acara sekolah berbentuk ' + b + '. Tali lampu hias dipasang mengelilingi tepi panggung. ',
      isi: (b, s) => [T('Panggung acara sekolah berbentuk '), A(b), T(', panjang tiap sisinya '), N(s), T(' meter. Tali lampu hias dipasang mengelilingi tepi panggung. ')],
      dis: ['Acara itu dimulai pukul {x} sore.', 'Panggung itu dihias oleh {x} murid.'] },
  ];
  const LEVEL = { 1: { n: [5, 6], s: [2, 9] }, 2: { n: [5, 6, 7, 8], s: [3, 15] }, 3: { n: [3, 5, 6, 7, 8], s: [5, 25] } };
  const CONTOH = [
    { jenis: 'panjang', t: 1, ti: 'ubin', n: 6, s: 4 },
    { jenis: 'panjang', t: 1, ti: 'bingkai', n: 5, s: 7 },
    { jenis: 'bangun', t: 2, tid: 'jajargenjang' },
  ];

  function soalPanjang(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 2000; coba++) {
      let tp, n, s, contoh = false;
      const cs = CONTOH.filter((c) => c.jenis === 'panjang' && c.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); tp = TEMPLAT.find((x) => x.id === c.ti); n = c.n; s = c.s; contoh = true; }
      else {
        tp = pilih(TEMPLAT);
        const ok = tp.n.filter((x) => L.n.includes(x)); if (!ok.length) continue;
        n = pilih(ok); s = acak(L.s[0], L.s[1]);
      }
      const kode = 'pjg-' + tp.id + '-' + n + '-' + s;
      if (pakai && pakai.has(kode)) continue;
      const b = namaBeraturan(n), kunci = n * s;
      const segmen = tp.isi(b, s);
      segmen.push(Q(tp.tanya));
      const dis = sisipPengecoh(segmen, tingkat, new Set([s, kunci, n]), tp.dis);
      const cerita0 = tp.c0(b) + tp.tanya;
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu panjang satu sisi saja. Tepi bangun punya ' + n + ' sisi yang sama panjang.', v: [s] },
        { s: 'Itu dikira 4 sisi (4 × ' + s + '). Bangun ini punya ' + n + ' sisi, bukan 4.', v: [4 * s] },
        { s: 'Satu sisi terlewat. Bangun ini punya ' + n + ' sisi, jadi dikali ' + n + '.', v: [(n - 1) * s] },
        { s: 'Itu hasil ditambah (' + n + ' + ' + s + '). Sisi yang sama panjang dijumlahkan berulang, jadi dikalikan.', v: [n + s] },
        { s: 'Terlalu banyak sisi. Hitung pojok pada gambar: ada ' + n + ', jadi sisinya ' + n + '.', v: [(n + 1) * s] },
      ], [kunci + s, kunci - 2 * s, kunci + 10, kunci - 10, kunci + 2 * s], { min: 1, maks: 1000 });
      const jumlahBerulang = Array(n).fill(s).join(' + ');
      const cek = 'Yang ditanya panjang <b>tepi</b>, jadi semua sisi dijumlahkan. ' + b.charAt(0).toUpperCase() + b.slice(1) + ' punya ' + n + ' sisi yang sama panjang.' +
        '<br>' + jumlahBerulang + ' = ' + kunci + ' ' + tp.pendek +
        '<br>Cara lain: ' + n + ' × ' + s + ' = <b>' + fmt(kunci) + '</b> ' + tp.satuan +
        '<br><small>Cek: bangun itu punya ' + n + ' pojok, jadi ' + n + ' sisi. Beraturan berarti semua sisinya sama panjang, bukan hanya satu sisi.</small>';
      // tiga model: semua sisi disorot (benar) / satu sisi saja / bangun dengan banyak sisi lain
      let n2 = [4, n - 1, n + 1].filter((x) => x !== n && x >= 3 && x <= 8);
      n2 = n2.length ? n2[Math.random() < 0.5 ? 0 : Math.floor(Math.random() * n2.length)] : 4;
      const pilihan = kocok([
        { id: 'p-benar', ket: 'Semua sisi, pojok dinomori', svg: gambarTepi(n, 'semua'), n, mode: 'semua' },
        { id: 'p-satu', ket: 'Satu sisi saja', svg: gambarTepi(n, 'satu'), n, mode: 'satu' },
        { id: 'p-n', ket: 'Semua sisi, pojok dinomori', svg: gambarTepi(n2, 'semua'), n: n2, mode: 'semua' },
      ]);
      return {
        jenis: 'panjang', tingkat, kode, tid: tp.id, n, s, kunci, contoh, cerita0, kata: tp.kata, segmen, angkaPengecoh: dis,
        arahAngka: 'nama bangun (banyak sisi) dan panjang satu sisi',
        hintKurang: 'Masih ada petunjuk yang belum kuning. Ketuk nama bangun (menunjukkan banyak sisi) dan panjang satu sisinya.',
        gambar: { benar: 'p-benar', pilihan }, tanya4: { teks: tp.tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalPanjang gagal');
  }

  const data = {
    id: 'k4b10',
    jenis: [
      { id: 'bangun', nama: 'Bangun apa? (nama bangun)', petunjuk: 'ada kata <b>Bangun apa</b>: dari sifat sisi dan sudutnya, cari <b>nama</b> bangunnya.',
        gambarPetunjuk: 'Soal ini menanyakan <b>nama bangun</b>. Cocokkan petunjuk di cerita dengan tanda pada gambar: panah = sejajar, garis kecil = sama panjang, kotak pojok = siku-siku.' },
      { id: 'panjang', nama: 'Berapa panjang? (tepi bangun)', petunjuk: 'ada kata seperti <b>di sepanjang tepi</b>, <b>dipagari</b>, atau <b>mengelilingi</b> dan pertanyaan <b>berapa</b>: semua sisi dijumlahkan.',
        gambarPetunjuk: 'Soal ini menghitung <b>panjang tepi</b>: semua sisi bangun. Pilih gambar dengan banyak pojok yang sama dengan bangun di cerita, dan semua sisinya disorot.' },
    ],
    tingkat: [
      'segi empat dasar (persegi, persegi panjang, jajargenjang, trapesium) dan tepi segi lima / segi enam, tanpa angka pengecoh',
      'ditambah belah ketupat, layang-layang, dan segitiga menurut sisi dan sudut; tepi sampai segi delapan, 1 angka pengecoh',
      'petunjuk ringkas, persegi miring, segi banyak dari banyak sisi; tepi termasuk segitiga sama sisi dan sisi sampai 25, 2 angka pengecoh',
    ],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Bangun apa? Cocokkan SEMUA petunjuk (sisi sejajar, siku-siku, sisi sama panjang) lalu pilih nama yang paling tepat. Berapa panjang tepi? Hitung banyak sisi (sama dengan banyak pojok), lalu banyak sisi × panjang satu sisi.',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'bangun' ? soalBangun(tingkat, pakai) : soalPanjang(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    LEVEL, CONTOH, TEMPLAT, POOL, CIRI, C, KODE, NAMA, kenali, geom,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b10 = data;
})(typeof window !== 'undefined' ? window : globalThis);
