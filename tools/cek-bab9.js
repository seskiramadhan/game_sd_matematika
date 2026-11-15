// Cek logika mini game Kelas 4 Bab 9 (Garis & Sudut): node tools/cek-bab9.js
// 200 ronde per tingkat per mini game. Kunci dihitung ulang dengan cara lain (vektor sederhana, sudut dari titik gambar,
// ukuran wilayah dari sinar), tepat satu pilihan benar, tidak ada pilihan kembar, contoh di rencana dicek satu per satu.
const G = require('../js/kelas-4/bab-9/garis.js');
const JG = require('../js/kelas-4/bab-9/jenis-garis.js');
const TG = require('../js/kelas-4/bab-9/tarik-garis.js');
const SS = require('../js/kelas-4/bab-9/sudut-silang.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const prim = (v) => { const g = gcd(v[0], v[1]); return [v[0] / g, v[1] / g]; };
const sebanding = (u, v) => { const p = prim(u), q = prim(v); return (p[0] === q[0] && p[1] === q[1]) || (p[0] === -q[0] && p[1] === -q[1]); };
// pembanding independen: jenis dua vektor bulat lewat vektor sederhananya
const jenisAlt = (u, v) => (sebanding(u, v) ? 'sejajar' : sebanding([-u[1], u[0]], v) ? 'tegak' : 'berpotongan');

// ---- logika dasar ----
cek(G.silang([2, 1], [4, 2]) === 0 && G.titikKali([2, 1], [1, -2]) === 0 && G.titikKali([2, 2], [1, -1]) === 0, 'silang/titik contoh');
cek(G.jenisVektor([2, 1], [4, 2]) === 'sejajar' && G.jenisVektor([2, 1], [1, -2]) === 'tegak' && G.jenisVektor([2, 1], [1, 1]) === 'berpotongan', 'jenisVektor');
cek(G.jenisSudutGaris(10, 10) === 'sejajar' && G.jenisSudutGaris(10, 100) === 'tegak' && G.jenisSudutGaris(170, 80) === 'tegak' && G.jenisSudutGaris(0, 179) === 'berpotongan' && G.jenisSudutGaris(5, 185) === 'sejajar', 'jenisSudutGaris');
cek(G.teksLangkah([2, 1]) === '2 kanan, 1 atas' && G.teksLangkah([1, -2]) === '1 kanan, 2 bawah' && G.teksLangkah([-3, 0]) === '3 kiri', 'teksLangkah');
// contoh di rencana: AB (1,1)->(3,2), C(5,1)
{
  const v = [2, 1], C = [5, 1];
  const urut = (a) => a.map((p) => p.join(',')).sort().join(' ');
  cek(urut(G.titikKunci(v, C, 'sejajar')) === urut([[7, 2], [9, 3], [3, 0]]), 'contoh sejajar ' + urut(G.titikKunci(v, C, 'sejajar')));
  cek(urut(G.titikKunci(v, C, 'tegak')) === urut([[4, 3], [3, 5]]), 'contoh tegak ' + urut(G.titikKunci(v, C, 'tegak')));
  cek(!G.dalamKertas([6, -1]) && G.dalamKertas([9, 5]) && !G.dalamKertas([10, 0]), 'dalamKertas');
}
// contoh hitungan sudut di rencana
cek(180 - 70 === 110 && 180 - 65 === 115 && 180 - 38 === 142 && 180 - 45 - 70 === 65 && 50 + 130 + 50 + 130 === 360, 'contoh sudut rencana');
cek(SS.soalLurus1(1, 70).kunci === 110 && SS.soalSebelah(2, 65).kunci === 115 && SS.soalSebelah(3, 38).kunci === 142, 'kunci contoh sudut');
cek(SS.soalLurus1(1, 70).opsi.includes(20) && SS.soalLurus1(1, 70).opsi.includes(290) && SS.soalLurus1(1, 70).opsi.includes(70), 'pengecoh 20/290/70');

// ================= Jenis Garis =================
const jarak = (p) => Math.hypot(p[0], p[1]);
const EXPECT = { // jenis yang dimaksud manusia untuk setiap pasangan benda
  'rel:r1-r2': 'sejajar', 'rel:r1-s1': 'tegak', 'rel:s1-s2': 'sejajar', 'rel:r2-s3': 'tegak', 'rel:s2-s4': 'sejajar',
  'jendela:v1-v2': 'sejajar', 'jendela:v1-h1': 'tegak', 'jendela:h1-h2': 'sejajar', 'jendela:l-r': 'sejajar', 'jendela:t-v3': 'tegak', 'jendela:h2-v2': 'tegak',
  'zebra:z1-z2': 'sejajar', 'zebra:z2-z4': 'sejajar', 'zebra:z1-e1': 'sejajar', 'zebra:z3-st': 'tegak', 'zebra:e2-st': 'tegak',
  'gunting:b1-b2': 'berpotongan', 'gunting:b1-meja': 'berpotongan',
  'tambah:v-h': 'tegak', 'tambah:v-alas': 'tegak', 'tambah:h-alas': 'sejajar',
  'atap:kiri-kanan': 'berpotongan', 'atap:kiri-alas': 'berpotongan', 'atap:kanan-alas': 'berpotongan',
  'tangga:s1-s2': 'sejajar', 'tangga:k1-s1': 'tegak', 'tangga:k1-k2': 'sejajar', 'tangga:k3-s2': 'tegak', 'tangga:k2-k3': 'sejajar',
};
let nPasangan = 0;
JG.BENDA.forEach((b) => b.pasangan.forEach(([i1, i2]) => {
  nPasangan++;
  const v1 = G.kurang(b.garis[i1][1], b.garis[i1][0]), v2 = G.kurang(b.garis[i2][1], b.garis[i2][0]);
  const kunci = EXPECT[b.id + ':' + i1 + '-' + i2];
  cek(kunci != null, 'benda pasangan belum didaftarkan ' + b.id + i1 + i2);
  cek(G.jenisVektor(v1, v2) === kunci && jenisAlt(v1, v2) === kunci, 'benda kunci ' + b.id + ':' + i1 + '-' + i2 + ' kode ' + G.jenisVektor(v1, v2) + ' alt ' + jenisAlt(v1, v2));
  [i1, i2].forEach((id) => { const g = b.garis[id]; cek(g.every((p) => Number.isInteger(p[0]) && Number.isInteger(p[1]) && p[0] >= 0 && p[0] <= 480 && p[1] >= 0 && p[1] <= 320), 'benda koordinat ' + b.id + id); });
}));
cek(nPasangan === Object.keys(EXPECT).length, 'jumlah pasangan benda ' + nPasangan);

function cekGaris(s, t) {
  const [g1, g2] = s.spec.garis;
  const d1 = G.kurang(g1.q, g1.p), d2 = G.kurang(g2.q, g2.p);
  const n1 = jarak(d1), n2 = jarak(d2);
  const sinp = Math.abs(G.silang(d1, d2)) / (n1 * n2), cosp = Math.abs(G.titikKali(d1, d2)) / (n1 * n2);
  const phi = (Math.acos(Math.min(1, cosp)) * 180) / Math.PI; // sudut lancip antara dua garis
  const dari = sinp < 1e-6 ? 'sejajar' : cosp < 1e-6 ? 'tegak' : 'berpotongan';
  cek(dari === s.kunci, 'garis kunci gambar ' + dari + ' vs ' + s.kunci + ' t' + t);
  cek(G.jenisSudutGaris(s.t1, s.t2) === s.kunci, 'garis kunci sudut');
  if (s.kunci === 'berpotongan') {
    if (t === 1) { cek(phi >= 29.99 && phi <= 60.01, 'garis t1 sudut ' + phi); cek([0, 90].includes(s.t1), 'garis t1 mendatar/tegak'); }
    if (t === 2) cek(phi >= 74.99 && phi <= 85.01, 'garis t2 sudut ' + phi);
    if (t === 3) cek(phi >= 5.99 && phi <= 12.01, 'garis t3 sudut ' + phi);
  }
  if (t === 1) cek([0, 90].includes(s.t1 % 180), 'garis t1 arah pertama');
  // posisi relatif titik potong terhadap segmen
  const X = G.potong(g1, g2);
  const param = (g, P) => { const d = G.kurang(g.q, g.p); return G.titikKali(G.kurang(P, g.p), d) / G.titikKali(d, d); }; // 0..1 = di dalam segmen
  if (s.kunci !== 'sejajar') {
    cek(X != null, 'garis titik potong ada');
    const p1 = param(g1, X), p2 = param(g2, X);
    if (t < 3) cek(p1 > 0.15 && p1 < 0.85 && p2 > 0.15 && p2 < 0.85, 'garis t' + t + ' titik potong di dalam kedua segmen');
    else if (s.kunci === 'berpotongan') {
      cek((p1 < -0.1 || p1 > 1.1) && (p2 < -0.1 || p2 > 1.1), 'garis t3 titik potong di luar segmen');
      cek(Math.abs(X[0]) > 246 || Math.abs(X[1]) > 166, 'garis t3 titik potong di luar gambar');
      cek(Math.abs(X[0]) < 700 && Math.abs(X[1]) < 460, 'garis t3 titik potong masih di dalam tampilan Perpanjang');
    } else {
      cek((p1 < -0.1 || p1 > 1.1) && (p2 < -0.1 || p2 > 1.1), 'garis t3 tegak putus: segmen tidak bersentuhan');
      cek(Math.abs(X[0]) < 700 && Math.abs(X[1]) < 460, 'garis t3 tegak titik potong di tampilan');
    }
  } else cek(X == null || sinp < 1e-6, 'garis sejajar tidak berpotongan');
  // jarak dua garis sejajar cukup lebar
  if (s.kunci === 'sejajar') cek(Math.abs(G.silang(d1, G.kurang(g2.p, g1.p))) / n1 >= 40, 'garis sejajar terlalu dekat');
  // semua titik & huruf di dalam gambar
  [g1, g2].forEach((g) => [g.p, g.q].forEach((P) => cek(Math.abs(P[0]) <= 218 && Math.abs(P[1]) <= 138, 'garis titik di luar bingkai')));
  cek(new Set([].concat(g1.huruf, g2.huruf)).size === 4, 'garis huruf kembar');
}
for (const t of [1, 2, 3]) {
  const cacah = {}, jenisCacah = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = JG.buatRonde(t);
    cek(ronde.length === 5, 'jenis garis 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'garis') && ronde[3].jenis === 'benda' && ronde[4].jenis === (t === 3 ? 'tiga' : 'benda'), 'jenis garis urutan t' + t);
    cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size > 1, 'jenis garis 1-3 tidak boleh sama semua');
    if (t === 1) cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size === 3, 'jenis garis t1 tiga jenis');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'jenis garis kode kembar');
    if (t < 3) cek(ronde[3].benda !== ronde[4].benda, 'dua benda berbeda');
    for (const s of ronde.concat(ronde.map((x) => JG.soalMirip(x, t)))) {
      cacah[s.kunci] = (cacah[s.kunci] || 0) + 1; jenisCacah[s.jenis] = (jenisCacah[s.jenis] || 0) + 1;
      if (s.jenis === 'garis') cekGaris(s, t);
      else if (s.jenis === 'benda') {
        const b = JG.BENDA.find((x) => x.id === s.benda);
        const [i1, i2] = s.pasangan;
        const v1 = G.kurang(b.garis[i1][1], b.garis[i1][0]), v2 = G.kurang(b.garis[i2][1], b.garis[i2][0]);
        cek(jenisAlt(v1, v2) === s.kunci && EXPECT[b.id + ':' + i1 + '-' + i2] === s.kunci || EXPECT[b.id + ':' + i2 + '-' + i1] === s.kunci, 'benda kunci soal ' + b.id + i1 + i2);
        cek(s.spec.fokus.length === 2 && s.spec.fokus.every((i) => s.spec.garis[i] && s.spec.garis[i].f > 0), 'benda fokus');
      } else {
        // tiga garis: kunci dari sudut derajat bulat dan dari titik gambar
        const [a, b] = s.spec.garis;
        const da = G.kurang(a.q, a.p), db = G.kurang(b.q, b.p);
        const sinp = Math.abs(G.silang(da, db)) / (jarak(da) * jarak(db)), cosp = Math.abs(G.titikKali(da, db)) / (jarak(da) * jarak(db));
        cek((sinp < 1e-6 ? 'sejajar' : cosp < 1e-6 ? 'tegak' : 'berpotongan') === s.kunci && G.jenisSudutGaris(s.ta, s.tb) === s.kunci, 'tiga kunci');
        cek(s.kunci === (s.varian === 'sejajar-tegak' ? 'tegak' : 'sejajar'), 'tiga varian-kunci');
        cek(s.tingkat === 3 && t === 3, 'tiga hanya t3');
      }
      // satu benar
      cek(['sejajar', 'berpotongan', 'tegak'].filter((k) => JG.periksa(s, k).benar).length === 1 && JG.periksa(s, s.kunci).benar, 'jenis garis tepat satu benar');
      if (s.kunci === 'tegak') cek(!JG.periksa(s, 'berpotongan').benar, 'tegak lurus: Berpotongan harus salah');
    }
  }
  console.log('Jenis Garis t' + t + ': kunci ' + JSON.stringify(cacah) + ', soal ' + JSON.stringify(jenisCacah));
  if (t === 3) cek(cacah.berpotongan > 0 && cacah.tegak > 0 && cacah.sejajar > 0 && jenisCacah.tiga > 0, 'jenis garis t3 semua jenis muncul');
}

// ================= Tarik Garis =================
for (const t of [1, 2, 3]) {
  let nSej = 0, nTegak = 0, minKunci = 99;
  for (let r = 0; r < RONDE; r++) {
    const ronde = TG.buatRonde(t);
    cek(ronde.length === 5 && ronde.slice(0, 3).every((s) => s.rel === 'sejajar') && ronde.slice(3).every((s) => s.rel === 'tegak'), 'tarik urutan t' + t);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'tarik kode kembar');
    for (const s of ronde.concat(ronde.map((x) => TG.soalMirip(x, t)))) {
      const { A, B, C, v } = s;
      cek(v[0] === B[0] - A[0] && v[1] === B[1] - A[1], 'tarik v');
      cek([A, B, C].every(G.dalamKertas), 'tarik titik dalam kertas');
      cek(G.silang(G.kurang(C, A), v) !== 0, 'tarik C tidak di garis AB');
      const nilai = TG.VEKTOR[t].map((x) => x.join(','));
      cek(nilai.includes(v.join(',')) || nilai.includes([-v[0], -v[1]].join(',')), 'tarik vektor sesuai tingkat t' + t + ' ' + v);
      if (t === 1) cek(v[0] === 0 || v[1] === 0, 'tarik t1 mendatar/tegak');
      if (t === 2) cek(Math.abs(v[0]) === Math.abs(v[1]), 'tarik t2 miring 1:1');
      if (t === 3) cek(Math.abs(v[0]) !== Math.abs(v[1]) && v[0] !== 0 && v[1] !== 0, 'tarik t3 miring 2:1/3:1');
      // kunci dihitung ulang: semua titik kertas P != C dengan P - C kelipatan bulat dari arah sederhana
      const pv = prim(v), arahBenar = s.rel === 'sejajar' ? pv : [-pv[1], pv[0]];
      const alt = [];
      for (let x = 0; x < 10; x++) for (let y = 0; y < 6; y++) {
        const w = [x - C[0], y - C[1]];
        if (w[0] === 0 && w[1] === 0) continue;
        const k = arahBenar[0] !== 0 ? w[0] / arahBenar[0] : w[1] / arahBenar[1];
        if (Number.isInteger(k) && k * arahBenar[0] === w[0] && k * arahBenar[1] === w[1]) alt.push(x + ',' + y);
      }
      cek(alt.sort().join(' ') === s.kunci.map((p) => p.join(',')).sort().join(' '), 'tarik kunci alt ' + s.kode);
      cek(s.kunci.length >= 1, 'tarik minimal satu titik benar');
      minKunci = Math.min(minKunci, s.kunci.length);
      // pemeriksa: semua titik kertas
      let benar = 0;
      for (let x = 0; x < 10; x++) for (let y = 0; y < 6; y++) { if (TG.periksa(s, [x, y]).benar) benar++; }
      cek(benar === s.kunci.length, 'tarik periksa jumlah benar');
      cek(!TG.periksa(s, C).benar && !TG.periksa(s, A).benar === !s.kunci.some((p) => p[0] === A[0] && p[1] === A[1]), 'tarik C bukan jawaban');
      // arah putar contoh: (2,1) -> (1,-2)
      if (s.rel === 'tegak') { const w = TG.putar(v); cek(G.titikKali(w, v) === 0, 'tarik putar tegak lurus'); }
      s.rel === 'sejajar' ? nSej++ : nTegak++;
    }
  }
  console.log('Tarik Garis t' + t + ': sejajar=' + nSej + ', tegak=' + nTegak + ', titik benar minimal=' + minKunci);
}
cek(JSON.stringify(TG.putar([2, 1])) === '[1,-2]' && JSON.stringify(TG.putar([2, 2])) === '[2,-2]' && JSON.stringify(TG.sederhana([2, -2])) === '[1,-1]', 'putar contoh');

// ================= Sudut Silang =================
const mod = (a, n) => ((a % n) + n) % n;
for (const t of [1, 2, 3]) {
  const cacah = {}; let n90 = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = SS.buatRonde(t);
    cek(ronde.length === 5, 'silang 5 soal');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'silang kode kembar');
    const urutan = ronde.map((s) => s.jenis).join(' ');
    cek(urutan === (t === 1 ? 'lurus1 lurus1 lurus1 ketuk ketuk' : t === 2 ? 'sebelah sebelah sebelah ketuk ketuk' : 'lurus3 lurus3 sebelah ketuk empat'), 'silang urutan t' + t + ' ' + urutan);
    if (t === 2) { const k = ronde.slice(0, 3).filter((s) => s.a === 90).length; cek(k === 1, 'silang t2 tepat satu soal 90° ' + k); n90 += k; }
    for (const s of ronde.concat(ronde.map((x) => SS.soalMirip(x, t)))) {
      cacah[s.jenis] = (cacah[s.jenis] || 0) + 1;
      if (s.jenis === 'lurus1' || s.jenis === 'sebelah') {
        cek(Number.isInteger(s.a) && s.a + s.kunci === 180, 'silang jumlah 180');
        cek(s.opsi.length === 4 && new Set(s.opsi).size === 4 && s.opsi.includes(s.kunci), 'silang opsi');
        cek(s.opsi.every((x) => Number.isInteger(x) && x >= 1 && x <= 359), 'silang opsi valid');
        cek(s.opsi.filter((x) => SS.periksaPilih(s, x).benar).length === 1, 'silang satu benar');
        if (s.a !== 90) { // pengecoh menurut rencana: 90 - a (atau a - 90), 360 - a, a
          const d1 = Math.abs(90 - s.a);
          cek(s.opsi.includes(360 - s.a) && s.opsi.includes(s.a), 'silang pengecoh 360-a dan a');
          if (d1 !== s.kunci && d1 >= 1) cek(s.opsi.includes(d1), 'silang pengecoh 90-a');
        } else cek(s.kunci === 90 && s.opsi.includes(270), 'silang tegak lurus 90');
        if (s.jenis === 'lurus1' && t === 1) cek(s.a % 10 === 0 && s.a >= 20 && s.a <= 160 && s.a !== 90, 'silang t1 kelipatan 10');
        if (s.jenis === 'sebelah' && t === 2) cek(s.a % 5 === 0 && s.a >= 20 && s.a <= 160, 'silang t2 kelipatan 5');
        if (s.jenis === 'sebelah' && t === 3) cek(s.a >= 25 && s.a <= 155 && s.a !== 90, 'silang t3 sembarang');
      } else if (s.jenis === 'lurus3') {
        cek(s.x + s.y + s.kunci === 180 && s.kunci >= 20, 'silang lurus3 jumlah 180');
        cek(s.urut.length === 3 && s.urut.filter((v) => v === 0).length === 1 && s.urut.filter((v) => v).reduce((a, b) => a + b, 0) === s.x + s.y, 'silang lurus3 urut');
        cek(s.opsi.length === 4 && new Set(s.opsi).size === 4 && s.opsi.filter((x) => SS.periksaPilih(s, x).benar).length === 1 && s.opsi.every((x) => x >= 1 && x <= 359), 'silang lurus3 opsi');
        cek(s.opsi.includes(s.x + s.y), 'silang lurus3 pengecoh x+y');
      } else if (s.jenis === 'ketuk') {
        const a = s.a;
        cek(a >= 35 && a <= 145 && a !== 90 && 180 - a >= 35, 'silang ketuk ukuran wilayah >= 35');
        // ukuran wilayah dihitung ulang dari sinar: sinar 0, a, 180, 180+a
        const awal = [0, a, 180, 180 + a, 360];
        const ukur = [0, 1, 2, 3].map((i) => awal[i + 1] - awal[i]);
        cek(JSON.stringify(ukur) === JSON.stringify(SS.ukuranWilayah(a)) && ukur.reduce((x, y) => x + y, 0) === 360, 'silang ketuk ukuran');
        const harapan = [1, 2, 3].filter((i) => ukur[i] === s.target);
        cek(JSON.stringify(harapan) === JSON.stringify(s.kunciWilayah) && harapan.length >= 1, 'silang ketuk kunci wilayah');
        cek(s.q === 'sebelah' ? s.target === 180 - a && s.kunciWilayah.length === 2 : s.target === a && s.kunciWilayah.length === 1 && s.kunciWilayah[0] === 2, 'silang ketuk q');
        cek(!SS.periksaKetuk(s, 0).benar, 'silang ketuk sudut diketahui salah');
        for (let i = 0; i < 4; i++) {
          const tengah = awal[i] + ukur[i] / 2;
          cek(SS.wilayahDariSudut(a, tengah) === i && SS.wilayahDariSudut(a, tengah + 360) === i && SS.wilayahDariSudut(a, tengah - 360) === i, 'silang ketuk wilayah tengah ' + i);
          cek(SS.periksaKetuk(s, i).benar === (harapan.includes(i)), 'silang ketuk periksa ' + i);
        }
        cek(SS.wilayahDariSudut(a, a + 0.001) === 1 && SS.wilayahDariSudut(a, a - 0.001) === 0 && SS.wilayahDariSudut(a, -0.001) === 3 && SS.wilayahDariSudut(a, 180.001) === 2, 'silang ketuk batas wilayah');
        if (t === 1) cek(a % 10 === 0, 'silang ketuk t1 kelipatan 10');
        if (t === 2) cek(a % 5 === 0, 'silang ketuk t2 kelipatan 5');
      } else {
        const a = s.a, b = 180 - a;
        cek(a >= 35 && a <= 145 && a !== 90, 'silang empat a');
        cek(s.kunci === SS.teksTriple([b, a, b]) && a + b + a + b === 360, 'silang empat jumlah 360');
        cek(s.opsi.length === 4 && new Set(s.opsi).size === 4 && s.opsi.filter((x) => SS.periksaPilih(s, x).benar).length === 1, 'silang empat opsi');
        cek(s.opsi.includes(SS.teksTriple([a, b, a])), 'silang empat pengecoh tertukar');
      }
    }
  }
  console.log('Sudut Silang t' + t + ': ' + JSON.stringify(cacah) + (t === 2 ? ', soal 90°=' + n90 : ''));
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 9 lulus.');
process.exit(gagal ? 1 : 0);
