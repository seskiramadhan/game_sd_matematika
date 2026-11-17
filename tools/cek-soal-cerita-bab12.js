// Cek logika 📖 Soal Cerita Kelas 4 Bab 12 (Grafik Batang): node tools/cek-soal-cerita-bab12.js
// Nilai batang dibaca KEMBALI dari gambar SVG (tinggi batang + angka sumbu), lalu kunci dihitung ulang dari nilai itu dan dari nama batang
// yang disebut di kalimat tanya (bukan dari data internal). Juga: nilai kelipatan skala atau tepat di tengah, pengecoh unik, sebab salah benar,
// cerita0 tanpa digit, tiga diagram dengan tepat satu yang cocok, contoh video (angka persis dari data.py Buku Saku) muncul.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-12/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// Baca diagram dari SVG: skala dan nilai batang. Rangka: viewBox 320x190, atas 12, bawah 38 -> tinggi petak 140.
function bacaDiagram(svg, n) {
  const label = [...svg.matchAll(/<text x="28" y="[\d.]+" font-size="11" font-weight="700" text-anchor="end" fill="#4A5878">(\d+)<\/text>/g)].map((m) => Number(m[1]));
  const garis = label.length > 1 ? label[1] - label[0] : NaN, ymax = label[label.length - 1];
  const batang = [...svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" rx="4"/g)].map((m) => Number(m[2]));
  const nilai = batang.map((h) => (h / 140) * ymax);
  return { label, garis, ymax, nilai, banyak: batang.length, n };
}
const sorotDari = (svg) => [...svg.matchAll(/<rect [^>]*rx="4"[^>]*>/g)].map((m, i) => (/stroke="#E0A800"/.test(m[0]) ? i : -1)).filter((i) => i >= 0);

// contoh video: hitung ulang dari data.py (angka persis)
const jml = (a) => a.reduce((x, y) => x + y, 0);
cek(jml([15, 20, 10, 25]) === 70 && 25 - 10 === 15 && jml([9, 6, 12, 3]) === 30 && 12 - 6 === 6 && 25 - 15 === 10, 'contoh video');

const RONDE = 1200, stat = {};
const g = M.untuk(D);
for (let t = 1; t <= 3; t++) {
  stat[t] = { selisih: 0, seluruh: 0, contoh: 0, dua: 0, skala: {}, n: {} };
  const s = stat[t], R = D.LEVEL[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde 5 soal, dua jenis campur t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const bc = bacaDiagram(so.diagram, so.nama.length);
      // diagram: skala dan nilai terbaca
      cek(bc.banyak === so.nama.length, nama + ' jumlah batang di gambar ' + bc.banyak);
      cek(bc.garis === so.garis && [1, 2, 5, 10].includes(bc.garis), nama + ' skala terbaca ' + bc.garis + ' != ' + so.garis);
      cek(bc.label[0] === 0 && bc.label.every((v, i) => v === i * bc.garis) && bc.ymax / bc.garis >= 3 && bc.ymax / bc.garis <= 10, nama + ' label sumbu ' + bc.label);
      const baca = bc.nilai.map((v) => Math.round(v * 1000) / 1000);
      cek(baca.every((v, i) => Math.abs(v - so.nilai[i]) < 0.01), nama + ' nilai di gambar ' + baca + ' != ' + so.nilai);
      // nilai kelipatan skala, atau tepat di tengah (skala 2 dan 10)
      const langkah = so.garis === 1 ? 1 : so.garis === 5 ? 5 : so.garis / 2;
      so.nilai.forEach((v) => cek(Number.isInteger(v) && v % langkah === 0 && v >= 1 && v <= bc.ymax, nama + ' nilai bukan kelipatan/tengah: ' + v));
      cek(new Set(so.nilai).size === so.nilai.length, nama + ' nilai kembar');
      cek(so.nama.length === new Set(so.nama).size, nama + ' nama batang kembar');
      // rentang tingkat
      const contohSoal = so.contoh;
      if (!contohSoal) {
        cek(so.nama.length >= R.n[0] && so.nama.length <= R.n[1] && R.skala.includes(so.garis), nama + ' di luar rentang tingkat');
        so.nilai.forEach((v) => cek(v >= R.min && v <= R.maks, nama + ' nilai di luar rentang ' + v));
      }
      // kalimat tanya: nama batang yang disebut
      const q = so.tanya4.teks;
      const disebut = so.nama.map((nm, i) => ({ nm, i, pos: q.indexOf(nm) })).filter((x) => x.pos >= 0).sort((a, b) => a.pos - b.pos);
      let benar;
      if (so.jenis === 'selisih') {
        cek(disebut.length === 2, nama + ' selisih harus menyebut 2 batang: ' + q);
        const [p1, p2] = disebut, v1 = so.nilai[p1.i], v2 = so.nilai[p2.i];
        benar = Math.abs(v1 - v2);
        if (/lebih banyak/.test(q)) cek(v1 > v2, nama + ' lebih banyak: yang pertama harus lebih tinggi');
        else if (/lebih sedikit/.test(q)) cek(v1 < v2, nama + ' lebih sedikit: yang pertama harus lebih pendek');
        else cek(/selisih/.test(q), nama + ' kata selisih');
        cek(new Set([p1.i, p2.i]).size === 2 && [so.X, so.Y].every((k) => k === p1.i || k === p2.i), nama + ' X Y tidak cocok dengan kalimat');
        cek(/lebih banyak|lebih sedikit|selisih/.test(q) && !/seluruhnya|jumlah/.test(q), nama + ' kata kunci selisih');
        s.selisih++;
      } else {
        const semuaDisebut = so.nama.every((nm) => so.cerita0.includes(nm));
        if (so.mode === 'dua') {
          cek(disebut.length === 2, nama + ' dua batang disebut');
          benar = so.nilai[disebut[0].i] + so.nilai[disebut[1].i];
          cek(/jumlah/.test(q), nama + ' kata jumlah');
          s.dua++;
        } else {
          cek(semuaDisebut && disebut.length === 0, nama + ' semua batang disebut di cerita, bukan di tanya');
          benar = jml(so.nilai);
          cek(/seluruhnya|jumlah/.test(q), nama + ' kata kunci seluruh');
        }
        cek(!/lebih banyak|lebih sedikit|selisih/.test(q), nama + ' kata selisih ikut tercampur');
        s.seluruh++;
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4 && so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' opsi 4 unik: ' + so.opsi);
      so.opsi.forEach((o) => cek(Number.isInteger(o) && o >= 1 && o <= 400, nama + ' opsi di luar batas ' + o));
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 5, nama + ' sebab non-opsi'));
      // sebab benar secara matematika
      const nilaiSoal = so.nilai, gg = so.garis;
      const idxPakai = so.jenis === 'selisih' ? [so.X, so.Y] : (so.mode === 'dua' ? so.idx : so.nilai.map((_, i) => i));
      const vp = idxPakai.map((i) => nilaiSoal[i]);
      so.opsi.forEach((o) => {
        const sb = so.sebab[o] || '';
        if (/Itu hasil ditambah/.test(sb)) cek(so.jenis === 'selisih' && o === vp[0] + vp[1], nama + ' sebab tambah');
        if (/tinggi satu batang saja/.test(sb)) cek(so.jenis === 'selisih' && vp.includes(o), nama + ' sebab satu batang');
        if (/selisih banyak garis/.test(sb)) cek(so.jenis === 'selisih' && o === Math.abs(Math.floor(vp[0] / gg) - Math.floor(vp[1] / gg)), nama + ' sebab selisih garis');
        if (/jumlah banyak garis/.test(sb)) cek(so.jenis === 'seluruh' && o === jml(vp.map((v) => Math.floor(v / gg))), nama + ' sebab jumlah garis');
        if (/batang tertinggi dikurangi batang terpendek/.test(sb)) cek(so.mode === 'semua' && o === Math.max(...vp) - Math.min(...vp), nama + ' sebab kurang semua');
        if (/Ada satu batang yang belum ikut/.test(sb)) cek(so.mode === 'semua' && vp.some((v) => o === benar - v), nama + ' sebab batang terlewat');
        if (/Itu hasil dikurangi\. Jumlah/.test(sb)) cek(so.mode === 'dua' && o === Math.abs(vp[0] - vp[1]), nama + ' sebab kurang dua');
        if (/Semua batang ikut dijumlahkan/.test(sb)) cek(so.mode === 'dua' && o === jml(nilaiSoal), nama + ' sebab semua');
      });
      // cerita0 tanpa angka; segmen konsisten
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === q && so.cerita0.endsWith(q), nama + ' tanya = tanya4 = akhir cerita0');
      const penting = so.segmen.filter((x) => x.k === 'angka' && x.penting).map((x) => x.t);
      const pengecoh = so.segmen.filter((x) => x.k === 'angka' && !x.penting).map((x) => Number(x.t));
      cek(penting.length === idxPakai.length && idxPakai.every((i) => penting.includes(so.nama[i])), nama + ' nama penting ' + penting);
      penting.forEach((p) => cek(so.cerita0.includes(p), nama + ' nama penting tidak di cerita0'));
      cek(pengecoh.length === t - 1 && new Set(pengecoh).size === pengecoh.length && JSON.stringify(so.angkaPengecoh) === JSON.stringify(pengecoh), nama + ' jumlah pengecoh ' + pengecoh.length);
      const terlarang = new Set(so.nilai.concat([so.kunci, so.garis]));
      pengecoh.forEach((p) => cek(!terlarang.has(p), nama + ' pengecoh sama angka penting ' + p));
      cek(so.cek.includes('<b>' + M.fmt(so.kunci) + '</b>'), nama + ' cek tidak memuat kunci');
      // gambar: 3 pilihan, tepat satu cocok; tanda ? untuk selisih, + untuk jumlah; sorotan di SVG = sorot data
      const gp = so.gambar.pilihan, modeBenar = so.jenis === 'selisih' ? 'beda' : 'gabung';
      cek(gp.length === 3 && new Set(gp.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      const bn = gp.filter((p) => p.id === so.gambar.benar);
      cek(bn.length === 1 && bn[0].mode === modeBenar && bn[0].sorot.join() === idxPakai.slice().sort((a, b) => a - b).join(), nama + ' gambar benar ' + (bn[0] && bn[0].ket));
      cek(gp.filter((p) => p.mode === modeBenar && p.sorot.slice().sort((a, b) => a - b).join() === idxPakai.slice().sort((a, b) => a - b).join()).length === 1, nama + ' gambar benar tidak tunggal');
      gp.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d/.test(p.ket.replace(/[^\d]/g, '')), nama + ' svg/ket ' + p.id);
        cek(JSON.stringify(sorotDari(p.svg)) === JSON.stringify(p.sorot.slice().sort((a, b) => a - b)), nama + ' sorotan svg ' + p.id + ' ' + sorotDari(p.svg));
        cek(p.mode !== 'beda' || (p.sorot.length === 2 && p.svg.includes('>?</text>')), nama + ' tanda ? ' + p.id);
        cek(p.mode !== 'gabung' || p.svg.includes('>+</text>') === (p.sorot.length > 1), nama + ' tanda + ' + p.id);
        const bp = bacaDiagram(p.svg, so.nama.length);
        cek(bp.garis === so.garis && bp.nilai.every((v, i) => Math.abs(v - so.nilai[i]) < 0.01), nama + ' tinggi batang di pilihan ' + p.id);
      });
      if (idx < 5) { s.skala[so.garis] = (s.skala[so.garis] || 0) + 1; s.n[so.nama.length] = (s.n[so.nama.length] || 0) + 1; if (so.contoh) s.contoh++; }
    });
  }
}
// contoh video: angka persis dari data.py
const C = D.CONTOH;
const sc = (jenis, topik, nilai) => C.find((c) => c.jenis === jenis && c.topik === topik && c.nilai.join() === nilai.join());
cek(sc('selisih', 'kue', [15, 20, 10, 25]) && sc('seluruh', 'kue', [15, 20, 10, 25]) && sc('seluruh', 'olahraga', [9, 6, 12, 3]) && sc('selisih', 'olahraga', [9, 6, 12, 3]) && sc('selisih', 'sepeda', [10, 25, 15]), 'data contoh video lengkap');
// semua contoh benar-benar muncul dan kuncinya sesuai
const lihat = {};
for (let i = 0; i < 40000; i++) {
  const jenis = Math.random() < 0.5 ? 'selisih' : 'seluruh';
  const so = D.buatSoal(2, jenis, new Set());
  if (so.contoh) lihat[so.tid + '|' + so.jenis + '|' + so.nilai.join(',') + '|' + (so.sub || so.mode) + '=' + so.kunci] = 1;
}
const diharap = ['kue|selisih|15,20,10,25|banyak=15', 'kue|seluruh|15,20,10,25|semua=70', 'olahraga|seluruh|9,6,12,3|semua=30', 'olahraga|selisih|9,6,12,3|banyak=6', 'sepeda|selisih|10,25,15|selisih=10'];
diharap.forEach((k) => cek(lihat[k], 'contoh video tidak muncul / kunci salah: ' + k));
cek(Object.keys(lihat).length === 5, 'contoh lain muncul: ' + Object.keys(lihat));
// frekuensi contoh di tingkat 2 sekitar 12%; tingkat 1 dan 3 tanpa contoh
const f2 = stat[2].contoh / (stat[2].selisih + stat[2].seluruh);
cek(f2 > 0.05 && f2 < 0.2, 'contoh t2 muncul ' + (f2 * 100).toFixed(1) + '%');
cek(stat[1].contoh === 0 && stat[3].contoh === 0, 'contoh hanya di tingkat 2');
cek(Object.keys(stat[1].skala).every((k) => ['1', '2'].includes(k)) && Object.keys(stat[3].skala).every((k) => ['5', '10'].includes(k)), 'skala per tingkat');
cek(stat[3].dua > 0 && [1, 2, 3].every((t) => stat[t].selisih > 0 && stat[t].seluruh > 0), 'semua jenis muncul di semua tingkat');
// banyak templat: 9 topik x 2 jenis
cek(D.TOPIK.length >= 8 && D.TOPIK.length <= 10, 'jumlah templat');
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 12 lolos.');
process.exit(gagal ? 1 : 0);
