// Alat bersama Bab 10 (Segi Banyak): jenis segitiga, jenis segi empat, templat bangun, tangram dalam seperempat petak + gambar SVG.
// KUNCI SEMUA BILANGAN BULAT. Segitiga berlabel: sisi bulat (a^2 + b^2 dibanding c^2) atau sudut bulat. Segi empat di kertas bertitik:
// sama panjang <=> kuadrat panjang sama, sejajar <=> perkalian silang 0, siku <=> perkalian titik 0 (sama dengan Bab 9).
// Tangram: luas dalam seperempat petak (tiap petak dibagi dua diagonal), potongan cocok <=> himpunan kuartal sama (titik uji bilangan bulat skala 6).
// Koordinat desimal (templat gambar bebas, hasil putar) hanya untuk menggambar; kunci dari data templat. Cek logika: node tools/cek-bab10.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('../bab-9/garis.js') : root.Garis;
  const S = modul ? require('../bab-8/sudut.js') : root.Sudut;
  const { acak, pilih, kocok, mod, kurang, silang, titikKali, sama, dalamKertas, KOLOM, BARIS, teksLangkah } = G;

  // ---------- Segitiga ----------
  const TEKS_SISI = { 'sama-sisi': 'Sama sisi', 'sama-kaki': 'Sama kaki', sembarang: 'Sembarang' };
  const TEKS_SUDUT_SEGITIGA = { siku: 'Siku-siku', lancip: 'Lancip', tumpul: 'Tumpul' };
  const urut3 = (a, b, c) => [a, b, c].sort((x, y) => x - y);
  const bisaSegitiga = (a, b, c) => { const [x, y, z] = urut3(a, b, c); return x > 0 && x + y > z; };
  const jenisSisi = (a, b, c) => (a === b && b === c ? 'sama-sisi' : a === b || b === c || a === c ? 'sama-kaki' : 'sembarang');
  // a^2 + b^2 dibanding c^2 (c terpanjang): sama = siku, lebih = lancip, kurang = tumpul
  function jenisSudutDariSisi(a, b, c) { const [x, y, z] = urut3(a, b, c); const l = x * x + y * y, r = z * z; return l === r ? 'siku' : l > r ? 'lancip' : 'tumpul'; }
  const jenisSudutDariDerajat = (s) => { const m = Math.max(s[0], s[1], s[2]); return m === 90 ? 'siku' : m < 90 ? 'lancip' : 'tumpul'; };
  const jenisSisiDariDerajat = (s) => jenisSisi(s[0], s[1], s[2]); // sudut sama <=> sisi di depannya sama
  const namaGabungan = (sisi, sudut) => TEKS_SUDUT_SEGITIGA[sudut] + ' ' + TEKS_SISI[sisi].toLowerCase();

  // ---------- Segi empat ----------
  const TEKS_SE = { persegi: 'Persegi', 'persegi-panjang': 'Persegi panjang', jajargenjang: 'Jajargenjang', 'belah-ketupat': 'Belah ketupat', 'layang-layang': 'Layang-layang', trapesium: 'Trapesium', sembarang: 'Segi empat sembarang' };
  const panjang2 = (p, q) => { const d = kurang(p, q); return d[0] * d[0] + d[1] * d[1]; };
  function kelasNilai(arr) { const unik = []; return arr.map((v) => { let k = unik.indexOf(v); if (k < 0) { unik.push(v); k = unik.length - 1; } return k; }); }
  // P: 4 titik berurutan (bilangan bulat)
  function sifatSegiEmpat(P) {
    const s = [0, 1, 2, 3].map((i) => kurang(P[(i + 1) % 4], P[i]));
    const l = s.map((v) => v[0] * v[0] + v[1] * v[1]);
    const sejajar = [silang(s[0], s[2]) === 0, silang(s[1], s[3]) === 0];
    const siku = [0, 1, 2, 3].map((i) => titikKali(s[i], s[(i + 1) % 4]) === 0); // sudut di titik i+1
    const sikuDi = [0, 1, 2, 3].filter((i) => titikKali(s[(i + 3) % 4], s[i]) === 0); // indeks titik yang sudutnya siku
    return {
      s, l, sejajar, cacahSejajar: (sejajar[0] ? 1 : 0) + (sejajar[1] ? 1 : 0), sikuDi, cacahSiku: sikuDi.length,
      semuaSama: l[0] === l[1] && l[1] === l[2] && l[2] === l[3], kelasSisi: kelasNilai(l),
      layang: (l[0] === l[1] && l[2] === l[3]) || (l[1] === l[2] && l[3] === l[0]),
      pasangSejajar: [sejajar[0] ? [0, 2] : null, sejajar[1] ? [1, 3] : null].filter(Boolean),
      sikuSemua: siku.every(Boolean),
    };
  }
  // urutan cek: persegi -> persegi panjang -> belah ketupat -> jajargenjang -> trapesium -> layang-layang
  function jenisSegiEmpat(P) {
    const f = sifatSegiEmpat(P);
    const jajar = f.sejajar[0] && f.sejajar[1];
    if (jajar && f.sikuSemua && f.semuaSama) return 'persegi';
    if (jajar && f.sikuSemua) return 'persegi-panjang';
    if (jajar && f.semuaSama) return 'belah-ketupat';
    if (jajar) return 'jajargenjang';
    if (f.sejajar[0] !== f.sejajar[1]) return 'trapesium';
    if (f.layang) return 'layang-layang';
    return 'sembarang';
  }
  // nama yang juga benar sifatnya, tetapi ada nama yang lebih tepat (keputusan Ayah: kunci tunggal nama paling khusus)
  const LEBIH_UMUM = {
    persegi: ['persegi-panjang', 'belah-ketupat', 'jajargenjang', 'layang-layang'],
    'persegi-panjang': ['jajargenjang'],
    'belah-ketupat': ['jajargenjang', 'layang-layang'],
  };
  const titikKeempat = (A, B, C) => [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; // D = A + C - B (jajargenjang ABCD)

  const NAMA_N = { 3: 'Segitiga', 4: 'Segi empat', 5: 'Segi lima', 6: 'Segi enam', 7: 'Segi tujuh', 8: 'Segi delapan', 9: 'Segi sembilan', 10: 'Segi sepuluh' };
  function namaBangun(P) { return P.length === 4 ? TEKS_SE[jenisSegiEmpat(P)] : NAMA_N[P.length]; }

  // ---------- Templat gambar bebas (koordinat desimal HANYA untuk menggambar; kunci = data n, sisiSama, sudutSama) ----------
  const rad = (d) => (d * Math.PI) / 180;
  const reg = (n, mulai = -90) => Array.from({ length: n }, (_, i) => { const a = rad(mulai + (360 * i) / n); return [Math.cos(a), Math.sin(a)]; });
  const RMAKS = 125; // jari-jari terjauh dari pusat (viewBox -165..165, ada ruang untuk lingkaran ketuk)
  function pas(pts) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const q = pts.map((p) => [p[0] - cx, p[1] - cy]);
    const r = Math.max(...q.map((p) => Math.hypot(p[0], p[1])));
    return q.map((p) => [(p[0] * RMAKS) / r, (p[1] * RMAKS) / r]);
  }
  const T = (id, nama, pts, sisiSama, sudutSama, cekung) => ({ id, nama, n: pts.length, sisiSama, sudutSama, beraturan: sisiSama && sudutSama, cekung: !!cekung, pts: pas(pts) });
  const BANGUN = [
    T('segitiga-sama-sisi', 'segitiga sama sisi', reg(3), true, true),
    T('segitiga-siku', 'segitiga siku-siku', [[-1, 0.8], [1, 0.8], [-1, -0.8]], false, false),
    T('segitiga-kaki', 'segitiga sama kaki', [[0, -1], [0.8, 0.9], [-0.8, 0.9]], false, false),
    T('segitiga-sembarang', 'segitiga sembarang', [[-1, 0.7], [0.9, 0.5], [-0.15, -0.9]], false, false),
    T('persegi', 'persegi', [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]], true, true),
    T('persegi-panjang', 'persegi panjang', [[-1, -0.6], [1, -0.6], [1, 0.6], [-1, 0.6]], false, true),
    T('belah-ketupat', 'belah ketupat', [[0, -1], [0.7, 0], [0, 1], [-0.7, 0]], true, false),
    T('jajargenjang', 'jajargenjang', [[-1, 0.6], [0.35, 0.6], [1, -0.6], [-0.35, -0.6]], false, false),
    T('trapesium', 'trapesium', [[-0.6, 0.6], [0.6, 0.6], [1, -0.6], [-1, -0.6]], false, false),
    T('layang-layang', 'layang-layang', [[0, -1], [0.6, -0.3], [0, 1], [-0.6, -0.3]], false, false),
    T('segi5-beraturan', 'segi lima beraturan', reg(5), true, true),
    T('rumah', 'segi lima (rumah)', [[-0.8, 0.9], [0.8, 0.9], [0.8, -0.2], [0, -1], [-0.8, -0.2]], false, false),
    T('segi6-beraturan', 'segi enam beraturan', reg(6, 0), true, true),
    T('segi6-lonjong', 'segi enam lonjong', reg(6, 0).map((p) => [p[0] * 1.5, p[1] * 0.75]), false, false),
    T('segi7-beraturan', 'segi tujuh beraturan', reg(7), true, true),
    T('segi8-beraturan', 'segi delapan beraturan', reg(8, -67.5), true, true),
    T('segi8-potong', 'segi delapan', [[-0.5, -0.7], [0.5, -0.7], [1, -0.2], [1, 0.2], [0.5, 0.7], [-0.5, 0.7], [-1, 0.2], [-1, -0.2]], false, true), // semua sudut 135 derajat, sisinya tidak sama
    // cekung (tingkat 3)
    T('huruf-L', 'huruf L', [[0, 0], [4, 0], [4, 1], [1, 1], [1, 3], [0, 3]], false, false, true),
    T('panah', 'tanda panah', [[0, 1], [3, 1], [3, 0], [5, 2], [3, 4], [3, 3], [0, 3]], false, false, true),
    T('huruf-U', 'huruf U', [[0, 0], [1, 0], [1, 2], [2, 2], [2, 0], [3, 0], [3, 3], [0, 3]], false, false, true),
    T('huruf-T', 'huruf T', [[0, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3], [1, 1], [0, 1]], false, false, true),
    T('tangga', 'tangga', [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 3], [0, 3]], false, false, true),
    T('bintang', 'bintang 5 ujung', (() => { const a = []; for (let i = 0; i < 10; i++) { const r = i % 2 === 0 ? 1 : 0.42; const t = rad(-90 + 36 * i); a.push([r * Math.cos(t), r * Math.sin(t)]); } return a; })(), true, false, true), // 10 sisi sama panjang, tetapi sudutnya tidak sama
  ];
  const BANGUN_ID = {}; BANGUN.forEach((b) => { BANGUN_ID[b.id] = b; });
  const putarTitik = (pts, d) => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return pts.map((p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c]); };
  const jarakMin = (pts) => { let m = Infinity; for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) m = Math.min(m, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])); return m; };

  // Benda sehari-hari (original): tepinya = bangun templat, tambahan hiasan digambar di tampilan
  const BENDA = [
    { id: 'stop', nama: 'rambu STOP', templat: 'segi8-beraturan', warna: '#E04466' },
    { id: 'lebah', nama: 'sarang lebah', templat: 'segi6-beraturan', warna: '#F5C242' },
    { id: 'mur', nama: 'mur baut', templat: 'segi6-beraturan', warna: '#9AA4B8', lubang: true },
    { id: 'penggaris', nama: 'penggaris segitiga', templat: 'segitiga-siku', warna: '#7FD1C7', lubang: true },
    { id: 'layang', nama: 'layang-layang mainan', templat: 'layang-layang', warna: '#9B5DE5' },
    { id: 'rumah', nama: 'rumah tampak depan', templat: 'rumah', warna: '#FF8A3D' },
    { id: 'bendera', nama: 'bendera segitiga', templat: 'segitiga-kaki', warna: '#3A86FF' },
    { id: 'jendela', nama: 'jendela berkisi', templat: 'persegi', warna: '#9ED0FF', kisi: true },
  ];

  // ---------- Tangram dalam seperempat petak ----------
  // Tiap petak (cx,cy) punya 4 kuartal: 0 = bawah, 1 = kanan, 2 = atas, 3 = kiri (y ke atas). Potongan = poligon titik bulat (sisi bersudut 0, 45, 90 derajat).
  const POTONGAN = {
    seg1: { nama: 'segitiga kecil', pts: [[0, 0], [2, 0], [1, 1]], warna: '#FFC400' },
    seg2: { nama: 'segitiga sedang', pts: [[0, 0], [2, 0], [0, 2]], warna: '#2BB673' },
    seg4: { nama: 'segitiga besar', pts: [[0, 0], [4, 0], [2, 2]], warna: '#3A86FF' },
    pers2: { nama: 'persegi', pts: [[0, 0], [2, 0], [2, 2], [0, 2]], warna: '#E04466' },
    miring2: { nama: 'persegi miring', pts: [[1, 0], [2, 1], [1, 2], [0, 1]], warna: '#9B5DE5' },
    jajar2: { nama: 'jajargenjang', pts: [[0, 0], [2, 0], [3, 1], [1, 1]], warna: '#FF8A3D' },
  };
  const kk = (cx, cy, q) => ((cx + 64) * 256 + (cy + 64)) * 4 + q;
  // titik uji (skala 6) di tiap kuartal: pusat berat segitiga kecil, tidak pernah tepat di garis kisi/diagonal
  const UJI = [[3, 1], [5, 3], [3, 5], [1, 3]];
  function dalamPoligon6(x, y, P) {
    let masuk = false;
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      if ((a[1] > y) !== (b[1] > y)) {
        const kiri = (x - a[0]) * (b[1] - a[1]), kanan = (y - a[1]) * (b[0] - a[0]);
        if (b[1] > a[1] ? kiri < kanan : kiri > kanan) masuk = !masuk;
      }
    }
    return masuk;
  }
  function kuartalPoligon(pts) {
    const P = pts.map((p) => [p[0] * 6, p[1] * 6]);
    const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0]));
    const y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
    const hasil = [];
    for (let cy = y0; cy < y1; cy++) for (let cx = x0; cx < x1; cx++) for (let q = 0; q < 4; q++) if (dalamPoligon6(cx * 6 + UJI[q][0], cy * 6 + UJI[q][1], P)) hasil.push([cx, cy, q]);
    return hasil;
  }
  const luasPetak = (kuartal) => kuartal.length / 4;
  function ubahPoligon(pts, rot, balik) {
    let q = pts.map((p) => (balik ? [-p[0], p[1]] : [p[0], p[1]]));
    for (let i = 0; i < rot; i++) q = q.map((p) => [-p[1], p[0]]);
    const mx = Math.min(...q.map((p) => p[0])), my = Math.min(...q.map((p) => p[1]));
    return q.map((p) => [p[0] - mx, p[1] - my]);
  }
  const cacheOri = {};
  function orientasi(id) {
    if (cacheOri[id]) return cacheOri[id];
    const lihat = new Set(), hasil = [];
    [false, true].forEach((balik) => [0, 1, 2, 3].forEach((rot) => {
      const pts = ubahPoligon(POTONGAN[id].pts, rot, balik), kuartal = kuartalPoligon(pts);
      const sig = kuartal.map((k) => kk(k[0], k[1], k[2])).sort((a, b) => a - b).join(',');
      if (!lihat.has(sig)) { lihat.add(sig); hasil.push({ rot, balik, pts, kuartal }); }
    }));
    cacheOri[id] = hasil;
    return hasil;
  }
  // Susun daftar potongan (id berulang boleh) menutup bayangan (array kuartal) tepat. Hasil: [{idx, id, rot, balik, tx, ty}] atau null.
  function selesaikan(bayangan, daftar, batasNode = 300000) {
    const target = new Set(bayangan.map((k) => kk(k[0], k[1], k[2])));
    const urutan = bayangan.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0] || a[2] - b[2]);
    const pakai = daftar.map(() => false), isi = new Set(), hasil = [];
    let node = 0;
    const dfs = () => {
      if (isi.size === target.size) return true;
      if (++node > batasNode) return false;
      const t = urutan.find((k) => !isi.has(kk(k[0], k[1], k[2])));
      const lihat = new Set();
      for (let i = 0; i < daftar.length; i++) {
        if (pakai[i] || lihat.has(daftar[i])) continue;
        lihat.add(daftar[i]);
        for (const o of orientasi(daftar[i])) {
          for (const k of o.kuartal) {
            if (k[2] !== t[2]) continue;
            const tx = t[0] - k[0], ty = t[1] - k[1];
            const kunci = o.kuartal.map((q) => kk(q[0] + tx, q[1] + ty, q[2]));
            if (!kunci.every((x) => target.has(x) && !isi.has(x))) continue;
            kunci.forEach((x) => isi.add(x)); pakai[i] = true; hasil.push({ idx: i, id: daftar[i], rot: o.rot, balik: o.balik, tx, ty });
            if (dfs()) return true;
            hasil.pop(); pakai[i] = false; kunci.forEach((x) => isi.delete(x));
          }
        }
      }
      return false;
    };
    return dfs() ? hasil : null;
  }
  // posisi (tx, ty) untuk potongan id dalam orientasi (rot, balik) yang memuat kuartal t dan muat di bayangan\isi. Pilih yang pusatnya paling dekat dengan titik ketuk (fx, fy, satuan petak).
  function carriTempat(id, rot, balik, t, targetSet, isiSet, fx, fy) {
    const ori = orientasi(id).find((o) => o.rot === rot && o.balik === balik) || null;
    const o = ori || (() => { const pts = ubahPoligon(POTONGAN[id].pts, rot, balik); return { rot, balik, pts, kuartal: kuartalPoligon(pts) }; })();
    let terbaik = null, jarak = Infinity;
    const lihat = new Set();
    for (const k of o.kuartal) {
      if (k[2] !== t[2]) continue;
      const tx = t[0] - k[0], ty = t[1] - k[1];
      if (lihat.has(tx + ',' + ty)) continue; lihat.add(tx + ',' + ty);
      if (!o.kuartal.every((q) => { const x = kk(q[0] + tx, q[1] + ty, q[2]); return targetSet.has(x) && !isiSet.has(x); })) continue;
      const mx = o.pts.reduce((a, p) => a + p[0], 0) / o.pts.length + tx, my = o.pts.reduce((a, p) => a + p[1], 0) / o.pts.length + ty;
      const d = (mx - fx) * (mx - fx) + (my - fy) * (my - fy);
      if (d < jarak) { jarak = d; terbaik = { tx, ty, pts: o.pts, kuartal: o.kuartal }; }
    }
    return terbaik;
  }
  const geserPoligon = (pts, tx, ty) => pts.map((p) => [p[0] + tx, p[1] + ty]);
  const kuartalDari = (pts, tx = 0, ty = 0) => kuartalPoligon(pts).map((k) => [k[0] + tx, k[1] + ty, k[2]]);
  const kuartalDiPoint = (x, y) => { // titik petak (satuan petak, y ke atas) -> kuartal [cx, cy, q]
    const cx = Math.floor(x), cy = Math.floor(y), fx = x - cx, fy = y - cy;
    const q = fy < fx && fy < 1 - fx ? 0 : fy < fx ? 1 : fy < 1 - fx ? 3 : 2;
    return [cx, cy, q];
  };

  // Teka-teki susun: bayangan = garis luar (titik bulat), potongan = daftar id. Dipakai Susun Bangun. Semua diperiksa selesaikan() di cek-bab10.js
  const PUZZLE = [
    // tingkat 1: dua segitiga siku-siku sama kaki
    { id: 'pers2', t: 1, sil: [[0, 0], [2, 0], [2, 2], [0, 2]], p: ['seg2', 'seg2'] },
    { id: 'segi-besar', t: 1, sil: [[0, 0], [4, 0], [2, 2]], p: ['seg2', 'seg2'] },
    { id: 'jajar-4', t: 1, sil: [[0, 0], [2, 0], [4, 2], [2, 2]], p: ['seg2', 'seg2'] },
    // tingkat 2: segitiga + persegi (3-4 potongan)
    { id: 'trapesium-6', t: 2, sil: [[0, 0], [6, 0], [4, 2], [2, 2]], p: ['seg2', 'pers2', 'seg2'] },
    { id: 'pp-4x2', t: 2, sil: [[0, 0], [4, 0], [4, 2], [0, 2]], p: ['pers2', 'seg2', 'seg2'] },
    { id: 'jajar-8', t: 2, sil: [[0, 0], [4, 0], [6, 2], [2, 2]], p: ['seg2', 'pers2', 'seg2'] },
    { id: 'rumah-12', t: 2, sil: [[0, 0], [4, 0], [4, 2], [2, 4], [0, 2]], p: ['pers2', 'pers2', 'seg2', 'seg2'] },
    // tingkat 3: tujuh potongan tangram
    { id: 'tg-persegi', t: 3, sil: [[0, 0], [4, 0], [4, 4], [0, 4]], p: ['seg4', 'seg4', 'seg2', 'seg1', 'seg1', 'miring2', 'jajar2'] },
    { id: 'tg-segitiga', t: 3, sil: [[0, 0], [8, 0], [4, 4]], p: ['seg4', 'seg4', 'seg2', 'seg1', 'seg1', 'miring2', 'jajar2'] },
    { id: 'tg-jajar', t: 3, sil: [[0, 0], [4, 0], [8, 4], [4, 4]], p: ['seg4', 'seg4', 'seg2', 'seg1', 'seg1', 'miring2', 'jajar2'] },
    { id: 'tg-trapesium', t: 3, sil: [[0, 0], [6, 0], [2, 4], [0, 4]], p: ['seg4', 'seg4', 'seg2', 'seg1', 'seg1', 'miring2', 'jajar2'] },
  ];
  // bangun lain untuk pilihan "mana yang tidak bisa dibuat?" (luas sengaja beda dari luas potongan)
  const PENGECOH = [
    { id: 'kecil-seg', sil: [[0, 0], [2, 0], [0, 2]] },
    { id: 'pp-5x1', sil: [[0, 0], [5, 0], [5, 1], [0, 1]] },
    { id: 'pers-3', sil: [[0, 0], [3, 0], [3, 3], [0, 3]] },
    { id: 'pp-6x2', sil: [[0, 0], [6, 0], [6, 2], [0, 2]] },
    { id: 'seg-6', sil: [[0, 0], [6, 0], [0, 4]] },
    { id: 'trap-5', sil: [[0, 0], [5, 0], [4, 1], [1, 1]] },
  ];
  // pilihan "bisa dibuat" untuk potongan tertentu di luar PUZZLE (dua segitiga besar): luas 8 petak
  const PUZZLE_BESAR = [
    { id: 'b-segi', sil: [[0, 0], [4, 0], [0, 4]], p: ['seg4', 'seg4'] },
    { id: 'b-miring', sil: [[2, 0], [4, 2], [2, 4], [0, 2]], p: ['seg4', 'seg4'] },
    { id: 'b-jajar', sil: [[0, 0], [4, 0], [6, 2], [2, 2]], p: ['seg4', 'seg4'] },
  ];

  const logika = {
    acak, pilih, kocok, mod, kurang, silang, titikKali, sama, dalamKertas, KOLOM, BARIS, teksLangkah,
    TEKS_SISI, TEKS_SUDUT_SEGITIGA, TEKS_SE, NAMA_N, panjang2, bisaSegitiga, jenisSisi, jenisSudutDariSisi, jenisSudutDariDerajat, jenisSisiDariDerajat, namaGabungan,
    kelasNilai, sifatSegiEmpat, jenisSegiEmpat, LEBIH_UMUM, titikKeempat, namaBangun,
    BANGUN, BANGUN_ID, BENDA, RMAKS, putarTitik, jarakMin, reg,
    POTONGAN, PUZZLE, PUZZLE_BESAR, PENGECOH, kk, kuartalPoligon, luasPetak, ubahPoligon, orientasi, selesaikan, carriTempat, geserPoligon, kuartalDari, kuartalDiPoint,
  };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const { svgEl, el, teks } = S;
  const HALO = { 'paint-order': 'stroke', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linejoin': 'round' };
  const WARNA_KELAS = ['#E04466', '#2A7BE8', '#2BB673', '#FF8A3D'];

  // tanda di sisi: garis kecil (sama panjang), panah (sejajar), kotak pojok (siku). P = titik layar (px).
  function lapisanTanda(svg, P, { kelasSisi = null, sejajar = null, siku = null, banding = null, u = 1 }) {
    const n = P.length;
    const sisi = (i) => { const a = P[i], b = P[(i + 1) % n], d = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(d[0], d[1]); return { m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], e: [d[0] / L, d[1] / L], nr: [-d[1] / L, d[0] / L] }; };
    if (kelasSisi) {
      const cacah = {}; kelasSisi.forEach((k) => { cacah[k] = (cacah[k] || 0) + 1; });
      const kelasBanyak = []; kelasSisi.forEach((k) => { if (cacah[k] > 1 && !kelasBanyak.includes(k)) kelasBanyak.push(k); });
      kelasSisi.forEach((k, i) => {
        const r = kelasBanyak.indexOf(k); if (r < 0) return;
        const E = sisi(i), banyak = r + 1;
        for (let t = 0; t < banyak; t++) {
          const off = (t - (banyak - 1) / 2) * 8 * u, c = [E.m[0] + E.e[0] * off, E.m[1] + E.e[1] * off];
          svg.appendChild(svgEl('line', { x1: c[0] - E.nr[0] * 10 * u, y1: c[1] - E.nr[1] * 10 * u, x2: c[0] + E.nr[0] * 10 * u, y2: c[1] + E.nr[1] * 10 * u, stroke: '#E04466', 'stroke-width': 4 * u, 'stroke-linecap': 'round' }));
        }
      });
    }
    if (sejajar) {
      sejajar.forEach(([i, j], r) => {
        const E1 = sisi(i);
        [i, j].forEach((s) => {
          const E = sisi(s), arah = E.e[0] * E1.e[0] + E.e[1] * E1.e[1] >= 0 ? 1 : -1, dir = [E.e[0] * arah, E.e[1] * arah];
          for (let t = 0; t <= r; t++) {
            const off = (t - r / 2) * 10 * u, c = [E.m[0] + dir[0] * off, E.m[1] + dir[1] * off];
            const tip = [c[0] + dir[0] * 7 * u, c[1] + dir[1] * 7 * u];
            const a = [tip[0] - dir[0] * 10 * u + E.nr[0] * 9 * u, tip[1] - dir[1] * 10 * u + E.nr[1] * 9 * u];
            const b = [tip[0] - dir[0] * 10 * u - E.nr[0] * 9 * u, tip[1] - dir[1] * 10 * u - E.nr[1] * 9 * u];
            svg.appendChild(svgEl('path', { d: 'M ' + a[0] + ' ' + a[1] + ' L ' + tip[0] + ' ' + tip[1] + ' L ' + b[0] + ' ' + b[1], fill: 'none', stroke: '#2A7BE8', 'stroke-width': 4 * u, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
          }
        });
      });
    }
    if (banding) { // kotak pojok 90 derajat ditempel pada satu kaki (ke titik berikutnya), menghadap ke dalam bangun: pembanding sudut
      banding.forEach((i) => {
        const V = P[i], A = P[(i + 1) % n], Bk = P[(i + n - 1) % n];
        const ua = [A[0] - V[0], A[1] - V[1]], la = Math.hypot(ua[0], ua[1]), ub = [Bk[0] - V[0], Bk[1] - V[1]];
        const e1 = [ua[0] / la, ua[1] / la];
        let e2 = [-e1[1], e1[0]]; if (e2[0] * ub[0] + e2[1] * ub[1] < 0) e2 = [-e2[0], -e2[1]];
        const k = 44 * u, a = [V[0] + e1[0] * k, V[1] + e1[1] * k], b = [a[0] + e2[0] * k, a[1] + e2[1] * k], c = [V[0] + e2[0] * k, V[1] + e2[1] * k];
        svg.appendChild(svgEl('path', { d: 'M ' + V[0] + ' ' + V[1] + ' L ' + a[0] + ' ' + a[1] + ' L ' + b[0] + ' ' + b[1] + ' L ' + c[0] + ' ' + c[1] + ' Z', fill: '#FF8A3D', 'fill-opacity': 0.2, stroke: '#FF8A3D', 'stroke-width': 3.5 * u, 'stroke-dasharray': (9 * u) + ' ' + (6 * u) }));
      });
    }
    if (siku) {
      siku.forEach((i) => {
        const V = P[i], A = P[(i + n - 1) % n], B = P[(i + 1) % n];
        const ua = [A[0] - V[0], A[1] - V[1]], ub = [B[0] - V[0], B[1] - V[1]], la = Math.hypot(ua[0], ua[1]), lb = Math.hypot(ub[0], ub[1]);
        const k = 20 * u, e1 = [ua[0] / la * k, ua[1] / la * k], e2 = [ub[0] / lb * k, ub[1] / lb * k];
        svg.appendChild(svgEl('path', { d: 'M ' + V[0] + ' ' + V[1] + ' l ' + e1[0] + ' ' + e1[1] + ' l ' + e2[0] + ' ' + e2[1] + ' l ' + (-e1[0]) + ' ' + (-e1[1]) + ' Z', fill: '#FF8A3D', 'fill-opacity': 0.35, stroke: '#FF8A3D', 'stroke-width': 3 * u }));
      });
    }
  }

  // lengkung sudut dalam di titik i (hanya untuk bangun cembung)
  function busurSudut(svg, pts, i, warna, r) {
    const n = pts.length, V = pts[i], A = pts[(i + n - 1) % n], B = pts[(i + 1) % n];
    const a1 = (Math.atan2(-(A[1] - V[1]), A[0] - V[0]) * 180) / Math.PI, a2 = (Math.atan2(-(B[1] - V[1]), B[0] - V[0]) * 180) / Math.PI;
    let s = mod(a2 - a1, 360), mulai = a1;
    if (s > 180) { s = 360 - s; mulai = a2; }
    svg.appendChild(svgEl('path', { d: S.jalurLengkung(V[0], V[1], r || 24, mulai, s, true), fill: warna, 'fill-opacity': 0.4, stroke: warna, 'stroke-width': 3 }));
  }
  // kelas panjang sisi / besar sudut dari desimal (hanya untuk gambar)
  function kelasDesimal(vals, tol) { const unik = []; return vals.map((v) => { let k = unik.findIndex((u) => Math.abs(u - v) <= tol); if (k < 0) { unik.push(v); k = unik.length - 1; } return k; }); }
  function sudutDalam(pts, i) {
    const n = pts.length, V = pts[i], A = pts[(i + n - 1) % n], B = pts[(i + 1) % n];
    const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]), a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
    let d = Math.abs(a1 - a2) * 180 / Math.PI; if (d > 180) d = 360 - d; return d;
  }

  const buatDekor = (d) => { const e = svgEl(d.tag, d.attr); if (d.isi != null) e.textContent = d.isi; return e; };

  // Gambar bebas: poligon dari pts (koordinat -165..165). nomor: indeks titik yang sudah diketuk (berurutan); ketuk(i): lingkaran ketuk.
  function poligonSvg({ pts, ukuran = 320, isi = '#BFDCFF', garis = '#1F2A44', tebal = 7, nomor = [], ketuk = null, sisiWarna = null, tandaSisi = false, tandaSudut = false, dekor = null, dekorAtas = null, titik = true }) {
    const svg = svgEl('svg', { viewBox: '-165 -165 330 330', width: ukuran, height: ukuran, class: 'gambar-bangun' });
    svg.appendChild(svgEl('rect', { x: -163, y: -163, width: 326, height: 326, rx: 24, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    (dekor || []).forEach((d) => svg.appendChild(buatDekor(d)));
    const n = pts.length;
    svg.appendChild(svgEl('polygon', { points: pts.map((p) => p[0] + ',' + p[1]).join(' '), fill: isi, 'fill-opacity': 0.85, stroke: 'none' }));
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      svg.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: sisiWarna ? sisiWarna(i) : garis, 'stroke-width': tebal, 'stroke-linecap': 'round' }));
    }
    if (tandaSudut) {
      const kelas = kelasDesimal(pts.map((_, i) => sudutDalam(pts, i)), 1.5);
      pts.forEach((_, i) => busurSudut(svg, pts, i, WARNA_KELAS[kelas[i] % 4], 24));
    }
    if (tandaSisi) {
      const kelas = kelasDesimal(pts.map((p, i) => Math.hypot(p[0] - pts[(i + 1) % n][0], p[1] - pts[(i + 1) % n][1])), 2.5);
      lapisanTanda(svg, pts, { kelasSisi: kelas });
    }
    (dekorAtas || []).forEach((d) => svg.appendChild(buatDekor(d)));
    if (titik) {
      pts.forEach((p, i) => {
        const k = nomor.indexOf(i);
        if (k >= 0) {
          svg.appendChild(svgEl('circle', { cx: p[0], cy: p[1], r: 17, fill: '#FFC400', stroke: '#E0A800', 'stroke-width': 3 }));
          teks(svg, p[0], p[1], String(k + 1), 22, '#1F2A44', { 'stroke-width': 0 });
        } else svg.appendChild(svgEl('circle', { cx: p[0], cy: p[1], r: 9, fill: ketuk ? '#E04466' : garis, stroke: '#fff', 'stroke-width': 2 }));
      });
    }
    if (ketuk) {
      const rKetuk = Math.max(18, Math.min(30, jarakMin(pts) / 2 - 1));
      pts.forEach((p, i) => {
        const c = svgEl('circle', { cx: p[0], cy: p[1], r: rKetuk, fill: '#fff', 'fill-opacity': 0, class: 'kertas-ketuk' });
        c.addEventListener('click', () => ketuk(i));
        svg.appendChild(c);
      });
    }
    return svg;
  }

  // Segitiga berlabel. Dari sisi (cm bulat: sisi[i] = panjang P_i P_(i+1)) atau sudut (derajat bulat: sudut[i] di titik P_i). tampil: 'sisi' | 'sudut' | null.
  function segitigaSvg({ sisi = null, sudut = null, tampil = null, rot = 0, ukuran = 380, tanda = false, siku = null, banding = null }) {
    let P; // koordinat math (y ke atas)
    if (sisi) {
      const [s0, s1, s2] = sisi, x = (s0 * s0 + s2 * s2 - s1 * s1) / (2 * s0);
      P = [[0, 0], [s0, 0], [x, Math.sqrt(Math.max(0, s2 * s2 - x * x))]];
    } else {
      const [a0, a1, a2] = sudut, L = Math.sin(rad(a1)) / Math.sin(rad(a2));
      P = [[0, 0], [1, 0], [L * Math.cos(rad(a0)), L * Math.sin(rad(a0))]];
    }
    P = putarTitik(P, rot);
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const sk = Math.min(250 / w, 165 / h), cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const Q = P.map((p) => [(p[0] - cx) * sk, -(p[1] - cy) * sk]);
    const svg = svgEl('svg', { viewBox: '-190 -135 380 270', width: ukuran, height: Math.round((ukuran * 270) / 380), class: 'gambar-bangun' });
    svg.appendChild(svgEl('rect', { x: -188, y: -133, width: 376, height: 266, rx: 24, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    svg.appendChild(svgEl('polygon', { points: Q.map((p) => p.join(',')).join(' '), fill: '#BFDCFF', 'fill-opacity': 0.85, stroke: '#1F2A44', 'stroke-width': 7, 'stroke-linejoin': 'round' }));
    const pusat = [(Q[0][0] + Q[1][0] + Q[2][0]) / 3, (Q[0][1] + Q[1][1] + Q[2][1]) / 3];
    const keluar = (t, jarak) => { const d = [t[0] - pusat[0], t[1] - pusat[1]], l = Math.hypot(d[0], d[1]); return [t[0] + (d[0] / l) * jarak, t[1] + (d[1] / l) * jarak]; };
    const keluarSisi = (a, b) => { // label sisi: di luar sisi, menjauhi pusat, cukup jauh supaya teks tidak menimpa garis miring
      const d = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(d[0], d[1]); let nr = [-d[1] / l, d[0] / l];
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (nr[0] * (m[0] - pusat[0]) + nr[1] * (m[1] - pusat[1]) < 0) nr = [-nr[0], -nr[1]];
      const j = 18 + 32 * Math.abs(nr[0]) + 12 * Math.abs(nr[1]);
      return [m[0] + nr[0] * j, m[1] + nr[1] * j];
    };
    if (tanda) {
      const nilai = sisi ? sisi : [sudut[2], sudut[0], sudut[1]]; // sisi i berhadapan dengan titik i+2
      lapisanTanda(svg, Q, { kelasSisi: kelasNilai(nilai) });
    }
    if (siku) lapisanTanda(svg, Q, { siku });
    if (banding) lapisanTanda(svg, Q, { banding });
    Q.forEach((p) => svg.appendChild(svgEl('circle', { cx: p[0], cy: p[1], r: 8, fill: '#1F2A44' })));
    if (tampil === 'sisi') Q.forEach((p, i) => { const t = keluarSisi(p, Q[(i + 1) % 3]); teks(svg, t[0], t[1], sisi[i] + ' cm', 26, '#1F2A44'); });
    if (tampil === 'sudut') Q.forEach((p, i) => { const t = keluar(p, 36); teks(svg, t[0], t[1], sudut[i] + '°', 26, '#1F2A44'); });
    return svg;
  }

  // ---------- Papan teka-teki susun ----------
  // bayangan: poligon garis luar; terpasang: [{pts (petak), warna}]; skala: px per petak
  function papanSvg({ sil, terpasang = [], skala = 60, ketuk = null, sorot = null, diagonal = false, petak = null }) {
    const xs = sil.map((p) => p[0]), ys = sil.map((p) => p[1]);
    const W = Math.max(...xs), H = Math.max(...ys), m = 14;
    const w = W * skala + 2 * m, h = H * skala + 2 * m;
    const sx = (x) => m + x * skala, sy = (y) => m + (H - y) * skala;
    const svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, class: 'gambar-papan' });
    svg.appendChild(svgEl('rect', { x: 1, y: 1, width: w - 2, height: h - 2, rx: 18, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    svg.appendChild(svgEl('polygon', { points: sil.map((p) => sx(p[0]) + ',' + sy(p[1])).join(' '), fill: '#E3EAF6', stroke: '#8896B3', 'stroke-width': 3, 'stroke-dasharray': '8 6', 'stroke-linejoin': 'round' }));
    for (let x = 0; x <= W; x++) svg.appendChild(svgEl('line', { x1: sx(x), y1: sy(0), x2: sx(x), y2: sy(H), stroke: '#B9C4DA', 'stroke-width': 1.2, 'stroke-opacity': 0.6 }));
    for (let y = 0; y <= H; y++) svg.appendChild(svgEl('line', { x1: sx(0), y1: sy(y), x2: sx(W), y2: sy(y), stroke: '#B9C4DA', 'stroke-width': 1.2, 'stroke-opacity': 0.6 }));
    if (diagonal) for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
      svg.appendChild(svgEl('line', { x1: sx(x), y1: sy(y), x2: sx(x + 1), y2: sy(y + 1), stroke: '#B9C4DA', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
      svg.appendChild(svgEl('line', { x1: sx(x), y1: sy(y + 1), x2: sx(x + 1), y2: sy(y), stroke: '#B9C4DA', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    }
    terpasang.forEach((t, i) => {
      const poli = svgEl('polygon', { points: t.pts.map((p) => sx(p[0]) + ',' + sy(p[1])).join(' '), fill: t.warna, 'fill-opacity': 0.92, stroke: '#1F2A44', 'stroke-width': 2.5, 'stroke-linejoin': 'round', class: 'papan-potongan' });
      if (t.muncul) { poli.style.animationDelay = (i * 0.55) + 's'; poli.classList.add('muncul'); }
      svg.appendChild(poli);
      if (petak && t.luas != null) {
        const cxm = t.pts.reduce((a, p) => a + p[0], 0) / t.pts.length, cym = t.pts.reduce((a, p) => a + p[1], 0) / t.pts.length;
        const tt = teks(svg, sx(cxm), sy(cym), String(t.luas), Math.max(18, skala * 0.4), '#fff', { stroke: '#1F2A44', 'stroke-width': 4 });
        if (t.muncul) { tt.style.animationDelay = (i * 0.55) + 's'; tt.classList.add('muncul'); }
      }
    });
    if (sorot) sorot.forEach((p) => svg.appendChild(svgEl('circle', { cx: sx(p[0]), cy: sy(p[1]), r: 7, fill: '#E04466' })));
    if (ketuk) {
      const lap = svgEl('rect', { x: 0, y: 0, width: w, height: h, fill: '#fff', 'fill-opacity': 0, class: 'kertas-ketuk' });
      lap.addEventListener('click', (e) => {
        const r = svg.getBoundingClientRect(), fx = ((e.clientX - r.left) / r.width) * w, fy = ((e.clientY - r.top) / r.height) * h;
        ketuk((fx - m) / skala, H - (fy - m) / skala);
      });
      svg.appendChild(lap);
    }
    return svg;
  }
  // potongan kecil (untuk baki / pilihan): poligon (petak) -> svg dengan kotak tetap
  function potonganSvg({ pts, warna, skala = 30, kotak = null, garis = '#1F2A44', isi = null }) {
    const W = Math.max(...pts.map((p) => p[0])), H = Math.max(...pts.map((p) => p[1])), m = 6;
    const w = kotak ? kotak[0] : W * skala + 2 * m, h = kotak ? kotak[1] : H * skala + 2 * m;
    const ox = (w - W * skala) / 2, oy = (h - H * skala) / 2;
    const svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, class: 'gambar-potongan' });
    svg.appendChild(svgEl('polygon', { points: pts.map((p) => (ox + p[0] * skala) + ',' + (oy + (H - p[1]) * skala)).join(' '), fill: isi || warna, 'fill-opacity': 0.92, stroke: garis, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
    return svg;
  }

  root.Bangun = Object.assign({ svgEl, el, teks, lapisanTanda, poligonSvg, segitigaSvg, papanSvg, potonganSvg, busurSudut, kelasDesimal, sudutDalam }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
