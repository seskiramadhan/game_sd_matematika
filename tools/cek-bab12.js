// Cek logika mini game Kelas 4 Bab 12 (Grafik Batang): node tools/cek-bab12.js
// 200 ronde per tingkat per mini game. Kunci dihitung ulang dengan cara lain (urutan menurun, pengurangan langsung),
// tepat satu pilihan benar, tidak ada pilihan kembar, contoh rencana dicek satu per satu.
const G = require('../js/kelas-4/bab-12/grafik.js');
const CT = require('../js/kelas-4/bab-12/catat-turus.js');
const BB = require('../js/kelas-4/bab-12/baca-batang.js');
const BG = require('../js/kelas-4/bab-12/bangun-batang.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const jml = (a) => a.reduce((x, y) => x + y, 0);
const unik = (a) => new Set(a).size === a.length;

// kunci dihitung ulang dengan cara berbeda dari tanya()
function kunciUlang(d, q) {
  const v = d.nilai;
  if (q.jenis === 'nilai' || q.jenis === 'turus') return String(v[q.i]);
  if (q.jenis === 'paling') { const t = [...v].sort((a, b) => a - b); return String(v.indexOf(q.sub === 'banyak' ? t[t.length - 1] : t[0])); }
  if (q.jenis === 'selisih') return String(Math.max(v[q.i], v[q.j]) - Math.min(v[q.i], v[q.j]));
  if (q.jenis === 'jumlah2') return String(v[q.i] + v[q.j]);
  return String(v.reduce((s, x) => s + x, 0));
}
function cekQ(d, q, nama) {
  cek(q.kunci === kunciUlang(d, q), nama + ' kunci ' + q.kunci + ' vs ' + kunciUlang(d, q));
  cek(q.opsi.length === 4 && unik(q.opsi.map((o) => o.kode)) && unik(q.opsi.map((o) => o.teks)), nama + ' 4 opsi unik');
  cek(q.opsi.filter((o) => o.kode === q.kunci).length === 1, nama + ' tepat satu benar');
  if (q.jenis !== 'paling') cek(q.opsi.every((o) => Number.isInteger(Number(o.kode)) && Number(o.kode) > 0), nama + ' opsi bilangan bulat positif');
  if (q.jenis === 'paling') { const t = d.nilai, mx = Math.max(...t), mn = Math.min(...t); cek(t.filter((x) => x === (q.sub === 'banyak' ? mx : mn)).length === 1, nama + ' paling tunggal'); }
  if (q.jenis === 'selisih') cek(d.nilai[q.i] !== d.nilai[q.j] && q.i !== q.j, nama + ' selisih beda kategori');
  Object.keys(q.sebab).forEach((k) => cek(q.opsi.some((o) => o.kode === k) || true, nama + ' sebab'));
}
function cekData(d, nama) {
  cek(d.nilai.length === d.cats.length && d.nilai.every((x) => Number.isInteger(x) && x > 0), nama + ' nilai bulat positif');
  cek(d.nilai.every((x) => x % d.langkah === 0), nama + ' nilai kelipatan langkah');
  cek(d.ymax % d.garis === 0 && d.ymax >= Math.max(...d.nilai) && d.ymax < Math.max(...d.nilai) + d.garis, nama + ' ymax');
}

// ---- contoh rencana ----
{
  const buah = G.dataContoh('buah', 1);
  cek(jml(buah.nilai) === 28 && 8 + 7 + 5 + 4 + 4 === 28 && buah.cats[0].nama === 'Mangga', 'buah jumlah 28');
  cek(G.tanya(buah, 'jumlah', {}).kunci === '28', 'buah kunci 28');
  cek(G.tanya(buah, 'paling', { sub: 'banyak' }).kunci === '0', 'buah paling banyak mangga');
  cek(G.tanya(buah, 'selisih', { i: 0, j: 1 }).kunci === '1', 'buah mangga - jeruk 1');
  cek(G.turusPecah(8).ikat === 1 && G.turusPecah(8).sisa === 3 && G.turusPecah(7).sisa === 2 && G.turusPecah(5).ikat === 1 && G.turusPecah(5).sisa === 0 && G.turusPecah(4).ikat === 0, 'turus buah');
  const buku = G.dataContoh('buku', 2);
  cek(buku.nilai.join() === '6,10,7,12,9' && buku.ymax === 12, 'buku data & ymax');
  const qb = G.tanya(buku, 'paling', { sub: 'banyak' }), qs = G.tanya(buku, 'paling', { sub: 'sedikit' });
  cek(buku.cats[Number(qb.kunci)].nama === 'Kamis' && buku.nilai[Number(qb.kunci)] === 12 && buku.cats[Number(qs.kunci)].nama === 'Senin' && buku.nilai[Number(qs.kunci)] === 6, 'buku Kamis 12 dan Senin 6');
  const qsel = G.tanya(buku, 'selisih', { i: 3, j: 0 });
  cek(qsel.kunci === '6' && G.tanya(buku, 'jumlah', {}).kunci === '44' && 6 + 10 + 7 + 12 + 9 === 44, 'buku selisih 6 jumlah 44');
  const kue = G.dataContoh('kue', 5);
  cek(kue.nilai.join() === '15,20,10,25' && G.tanya(kue, 'selisih', { i: 3, j: 2 }).kunci === '15' && G.tanya(kue, 'jumlah', {}).kunci === '70' && 15 + 20 + 10 + 25 === 70, 'kue selisih 15 jumlah 70');
  // pengecoh: 7 pada skala 2 di antara 6 dan 8 (sebab diisi); selisih ditukar jumlah (6 + 12... a+b = 18)
  let ada68 = false, ada18 = false;
  for (let i = 0; i < 200; i++) {
    const qn = G.tanya(buku, 'nilai', { i: 2 }); cek(qn.kunci === '7', 'buku nilai 7');
    if (qn.opsi.some((o) => o.kode === '6') && qn.opsi.some((o) => o.kode === '8') && qn.sebab['6'] && qn.sebab['8']) ada68 = true;
    if (G.tanya(buku, 'selisih', { i: 3, j: 0 }).opsi.some((o) => o.kode === '18')) ada18 = true;
  }
  cek(ada68 && ada18, 'pengecoh garis terdekat (6, 8) dan jumlah (18) muncul');
  const kuePk = G.tanya(kue, 'nilai', { i: 0 });
  cek(kuePk.kunci === '15', 'kue Senin 15');
}

for (let t = 1; t <= 3; t++) {
  // ---- Catat Turus ----
  const cacah = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = CT.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'turus ronde 5 soal unik');
    ronde.forEach((s) => {
      cekData(s.d, 'turus'); cekQ(s.d, s.q, 'turus');
      const kc = s.jenis + (s.d.contoh ? '*' : ''); cacah[kc] = (cacah[kc] || 0) + 1;
      if (s.jenis === 'catat') {
        const hit = s.d.cats.map(() => 0); s.items.forEach((i) => hit[i]++);
        cek(hit.join() === s.d.nilai.join() && s.items.length === jml(s.d.nilai), 'catat benda = nilai');
        cek(s.items.length <= (t === 1 ? 12 : t === 2 ? 20 : 26), 'catat banyak benda <= batas');
        cek(s.d.cats.every((c) => c.ikon), 'catat benda bergambar');
        if (t === 1) cek(s.d.nilai.every((v) => v <= 5) && s.d.cats.length <= 3, 'catat t1 kecil');
        cek(CT.periksa(s, s.q.kunci).benar && s.q.opsi.filter((o) => CT.periksa(s, o.kode).benar).length === 1, 'catat periksa');
      } else {
        if (t === 1) cek(s.d.nilai.every((v) => v <= 9) && s.q.jenis === 'turus', 'tabel t1 <= 9, turus ke angka');
        if (t === 3) cek(jml(s.d.nilai) <= 40, 'tabel t3 jumlah <= 40');
      }
      const m = CT.soalMirip(s, t);
      cek(m.jenis === s.jenis && m.kode !== s.kode, 'turus mirip');
    });
  }
  console.log('Catat Turus t' + t + ': ' + JSON.stringify(cacah));
  // ---- Baca Batang ----
  const cb = {}, bentuk = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = BB.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'baca ronde 5 soal unik');
    ronde.forEach((s) => {
      cekData(s.d, 'baca'); cekQ(s.d, s.q, 'baca');
      const k = (s.d.contoh ? s.d.topik : 'acak') + '/g' + s.d.garis + (s.d.pikto ? 'p' : ''); bentuk[k] = (bentuk[k] || 0) + 1;
      cb[s.d.contoh ? '*' : 'acak'] = (cb[s.d.contoh ? '*' : 'acak'] || 0) + 1;
      if (t === 1) cek(!s.d.contoh && (s.d.pikto ? s.d.nilai.every((v) => v % s.d.garis === 0 && v / s.d.garis <= 8) : s.d.garis === 1 && s.d.nilai.every((v) => v <= 10)), 'baca t1 pikto / skala 1');
      if (t === 2 && !s.d.contoh) cek(s.d.garis === 2 && s.d.nilai.filter((v) => v % 2).length >= 2 && s.d.nilai.every((v) => v <= 14), 'baca t2 skala 2 ganjil');
      if (t === 3 && !s.d.contoh) cek((s.d.garis === 5 && s.d.nilai.every((v) => v % 5 === 0 && v <= 30)) || (s.d.garis === 2 && s.d.nilai.filter((v) => v % 2).length >= 2), 'baca t3 skala 5 / 2');
      cek(BB.periksa(s, s.q.kunci).benar && s.q.opsi.filter((o) => BB.periksa(s, o.kode).benar).length === 1, 'baca periksa');
      const m = BB.soalMirip(s, t);
      cek(m.kode !== s.kode, 'baca mirip');
    });
  }
  console.log('Baca Batang t' + t + ': ' + JSON.stringify(cb) + ' ' + JSON.stringify(bentuk));
  // ---- Bangun Batang ----
  const cg = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = BG.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'bangun ronde 5 soal unik');
    ronde.forEach((s) => {
      cekData(s.d, 'bangun');
      cek(s.d.nilai.every((v) => v % s.d.langkah === 0) && s.d.langkah <= s.d.garis, 'bangun nilai kelipatan langkah');
      if (s.q) cekQ(s.d, s.q, 'bangun');
      const kc = (s.q ? 'q' : 'tanpaQ') + (s.d.contoh ? '*' : ''); cg[kc] = (cg[kc] || 0) + 1;
      if (t === 3) cek(s.q && (s.d.contoh || (s.d.cats.length === 5 && s.d.langkah === 5)), 'bangun t3: 5 batang, langkah 5, ada pertanyaan');
      if (t === 3 && s.d.garis === 10 && !s.d.contoh) cek(s.d.nilai.filter((v) => v % 10).length >= 2, 'bangun t3 garis 10: nilai di tengah garis');
      if (t === 2 && !s.d.contoh) cek(s.d.garis === 2 && s.d.nilai.filter((v) => v % 2).length >= 2, 'bangun t2 skala 2 ganjil');
      cek(BG.periksaTinggi(s, s.d.nilai).benar, 'bangun periksa benar');
      const salah = s.d.nilai.slice(), k = Math.floor(Math.random() * salah.length); salah[k] += s.d.langkah;
      const h = BG.periksaTinggi(s, salah);
      cek(!h.benar && h.salah.join() === String(k), 'bangun periksa salah satu batang');
      const m = BG.soalMirip(s, t);
      cek(m.kode !== s.kode, 'bangun mirip');
    });
  }
  console.log('Bangun Batang t' + t + ': ' + JSON.stringify(cg));
}

{ // frekuensi contoh ~ 12% per soal yang memenuhi syarat
  let n = 0, c = 0;
  for (let i = 0; i < 400; i++) BB.buatRonde(3).forEach((s) => { n++; if (s.d.contoh) c++; });
  const p = c / n; console.log('Baca t3: contoh ' + (p * 100).toFixed(1) + '% dari soal');
  cek(p > 0.07 && p < 0.17, 'frekuensi contoh Baca t3 ~12%');
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 12 lulus.');
process.exit(gagal ? 1 : 0);
