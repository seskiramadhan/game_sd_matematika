// Cek logika mini game Kelas 4 Bab 10 (Segi Banyak): node tools/cek-bab10.js
// 200 ronde per tingkat per mini game. Kunci dihitung ulang dengan cara lain (geometri desimal untuk templat, solver untuk tangram),
// tepat satu pilihan benar, tidak ada pilihan kembar, contoh di rencana dicek satu per satu.
const B = require('../js/kelas-4/bab-10/bangun.js');
const HS = require('../js/kelas-4/bab-10/hitung-sisi.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const sama2 = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const unik = (arr) => new Set(arr).size === arr.length;

// ---- jenis segitiga (contoh rencana) ----
const tri = (a, b, c) => ({ sisi: B.jenisSisi(a, b, c), sudut: B.jenisSudutDariSisi(a, b, c), ok: B.bisaSegitiga(a, b, c) });
cek(sama2(tri(6, 6, 6), { sisi: 'sama-sisi', sudut: 'lancip', ok: true }), '6,6,6');
cek(sama2(tri(5, 5, 6), { sisi: 'sama-kaki', sudut: 'lancip', ok: true }) && 25 + 25 > 36, '5,5,6');
cek(sama2(tri(5, 5, 8), { sisi: 'sama-kaki', sudut: 'tumpul', ok: true }) && 25 + 25 < 64, '5,5,8');
cek(sama2(tri(3, 4, 5), { sisi: 'sembarang', sudut: 'siku', ok: true }) && 9 + 16 === 25, '3,4,5');
cek(sama2(tri(6, 8, 10), { sisi: 'sembarang', sudut: 'siku', ok: true }) && 36 + 64 === 100, '6,8,10');
cek(sama2(tri(4, 6, 7), { sisi: 'sembarang', sudut: 'lancip', ok: true }) && 16 + 36 > 49, '4,6,7');
cek(sama2(tri(3, 5, 7), { sisi: 'sembarang', sudut: 'tumpul', ok: true }) && 9 + 25 < 49 && 3 + 5 > 7, '3,5,7');
cek(!B.bisaSegitiga(3, 4, 8) && !B.bisaSegitiga(1, 2, 3), 'segitiga tidak bisa dibuat');
const der = (s) => ({ sisi: B.jenisSisiDariDerajat(s), sudut: B.jenisSudutDariDerajat(s), jumlah: s[0] + s[1] + s[2] });
cek(sama2(der([70, 70, 40]), { sisi: 'sama-kaki', sudut: 'lancip', jumlah: 180 }), '70,70,40');
cek(sama2(der([90, 45, 45]), { sisi: 'sama-kaki', sudut: 'siku', jumlah: 180 }) && B.namaGabungan('sama-kaki', 'siku') === 'Siku-siku sama kaki', '90,45,45');
cek(sama2(der([30, 50, 100]), { sisi: 'sembarang', sudut: 'tumpul', jumlah: 180 }), '30,50,100');
cek(sama2(der([60, 60, 60]), { sisi: 'sama-sisi', sudut: 'lancip', jumlah: 180 }), '60,60,60');

// ---- jenis segi empat (contoh rencana, kertas bertitik x 0-9, y 0-5) ----
const se = (p) => B.jenisSegiEmpat(p);
const f1 = B.sifatSegiEmpat([[1, 1], [6, 1], [6, 4], [1, 4]]);
cek(sama2(f1.l, [25, 9, 25, 9]) && f1.sikuSemua && f1.cacahSejajar === 2 && se([[1, 1], [6, 1], [6, 4], [1, 4]]) === 'persegi-panjang', 'persegi panjang');
const f2 = B.sifatSegiEmpat([[1, 1], [5, 1], [7, 4], [3, 4]]);
cek(sama2(f2.l, [16, 13, 16, 13]) && f2.cacahSejajar === 2 && f2.cacahSiku === 0 && B.titikKali([4, 0], [2, 3]) === 8 && se([[1, 1], [5, 1], [7, 4], [3, 4]]) === 'jajargenjang', 'jajargenjang');
const f3 = B.sifatSegiEmpat([[0, 2], [3, 0], [6, 2], [3, 4]]);
cek(sama2(f3.l, [13, 13, 13, 13]) && f3.cacahSiku === 0 && se([[0, 2], [3, 0], [6, 2], [3, 4]]) === 'belah-ketupat', 'belah ketupat');
const f4 = B.sifatSegiEmpat([[3, 0], [5, 3], [3, 4], [1, 3]]);
cek(sama2(f4.l, [13, 5, 5, 13]) && f4.cacahSejajar === 0 && B.silang(f4.s[0], f4.s[2]) === 4 && B.silang(f4.s[1], f4.s[3]) === 4 && se([[3, 0], [5, 3], [3, 4], [1, 3]]) === 'layang-layang', 'layang-layang');
const f5 = B.sifatSegiEmpat([[1, 1], [8, 1], [6, 4], [3, 4]]);
cek(f5.cacahSejajar === 1 && B.silang(f5.s[1], f5.s[3]) === 12 && se([[1, 1], [8, 1], [6, 4], [3, 4]]) === 'trapesium', 'trapesium');
cek(se([[1, 1], [7, 1], [4, 4], [1, 4]]) === 'trapesium', 'trapesium siku-siku');
const f6 = B.sifatSegiEmpat([[2, 1], [5, 2], [4, 5], [1, 4]]);
cek(sama2(f6.l, [10, 10, 10, 10]) && f6.cacahSiku === 4 && se([[2, 1], [5, 2], [4, 5], [1, 4]]) === 'persegi', 'persegi diputar');
cek(se([[0, 0], [3, 0], [3, 3], [0, 3]]) === 'persegi' && se([[0, 0], [1, 0], [3, 1], [0, 3]]) === 'sembarang', 'persegi / sembarang');
// tidak tergantung titik awal & arah putaran
{
  const P = [[2, 1], [5, 2], [4, 5], [1, 4]], Q = [[1, 1], [8, 1], [6, 4], [3, 4]];
  for (let r = 0; r < 4; r++) {
    cek(se(P.slice(r).concat(P.slice(0, r))) === 'persegi' && se(P.slice().reverse()) === 'persegi', 'persegi diputar titik awal ' + r);
    cek(se(Q.slice(r).concat(Q.slice(0, r))) === 'trapesium' && se(Q.slice().reverse()) === 'trapesium', 'trapesium titik awal ' + r);
  }
}
// titik keempat: D = A + C - B
cek(sama2(B.titikKeempat([1, 1], [5, 1], [6, 4]), [2, 4]) && sama2(B.titikKeempat([2, 1], [5, 2], [4, 5]), [1, 4]), 'titik keempat contoh');
cek(B.namaBangun([[1, 1], [6, 1], [6, 4], [1, 4]]) === 'Persegi panjang' && B.namaBangun([[0, 0], [2, 0], [1, 2]]) === 'Segitiga' && B.namaBangun([[0, 0], [1, 0], [2, 1], [1, 2], [0, 1]]) === 'Segi lima', 'namaBangun');
cek(B.LEBIH_UMUM.persegi.includes('persegi-panjang') && B.LEBIH_UMUM['persegi-panjang'].includes('jajargenjang') && !B.LEBIH_UMUM.trapesium, 'lebih umum');

// ---- templat bangun: kunci dari data dicek ulang dengan geometri desimal ----
const jarak = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
function sudutDalam(P, i) { const n = P.length, V = P[i], A = P[(i + n - 1) % n], C = P[(i + 1) % n]; let d = Math.abs(Math.atan2(A[1] - V[1], A[0] - V[0]) - Math.atan2(C[1] - V[1], C[0] - V[0])) * 180 / Math.PI; return d > 180 ? 360 - d : d; }
function cekungDesimal(P) { let pos = 0, neg = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], c = P[(i + 2) % P.length]; const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]); if (z > 1e-9) pos++; else if (z < -1e-9) neg++; } return pos > 0 && neg > 0; }
const hampirSama = (arr, tol) => Math.max(...arr) - Math.min(...arr) <= tol;
B.BANGUN.forEach((t) => {
  const P = t.pts, n = P.length;
  cek(t.n === n, 'n templat ' + t.id);
  const sisi = P.map((p, i) => jarak(p, P[(i + 1) % n]));
  const cekung = cekungDesimal(P);
  cek(cekung === t.cekung, 'cekung templat ' + t.id);
  cek(hampirSama(sisi, 1e-6) === t.sisiSama, 'sisiSama templat ' + t.id + ' ' + sisi.map((x) => x.toFixed(1)));
  if (!cekung) cek(hampirSama(P.map((_, i) => sudutDalam(P, i)), 1e-6) === t.sudutSama, 'sudutSama templat ' + t.id);
  else cek(!t.sudutSama && !t.beraturan, 'cekung tidak beraturan ' + t.id);
  cek(t.beraturan === (t.sisiSama && t.sudutSama), 'beraturan = sisi sama dan sudut sama ' + t.id);
  cek(Math.max(...P.map((p) => Math.hypot(p[0], p[1]))) <= 125.001, 'dalam bingkai ' + t.id);
  cek(B.jarakMin(P) >= 44, 'titik cukup jauh untuk diketuk ' + t.id + ' ' + B.jarakMin(P).toFixed(0));
  for (let d = 0; d < 360; d += 37) cek(Math.max(...B.putarTitik(P, d).map((p) => Math.hypot(p[0], p[1]))) <= 125.001, 'putar dalam bingkai ' + t.id + d);
});
const byId = (id) => B.BANGUN_ID[id];
cek(byId('huruf-L').n === 6 && byId('panah').n === 7 && byId('bintang').n === 10 && byId('segi8-beraturan').n === 8 && byId('segi5-beraturan').n === 5 && byId('segi6-beraturan').n === 6, 'jumlah titik contoh rencana');
cek(sama2(byId('persegi-panjang').beraturan, false) && byId('belah-ketupat').sisiSama && !byId('belah-ketupat').sudutSama && byId('persegi-panjang').sudutSama && !byId('persegi-panjang').sisiSama, 'beraturan: belah ketupat & persegi panjang bukan beraturan');
cek(byId('persegi').beraturan && byId('segi8-beraturan').beraturan, 'persegi & segi delapan beraturan');
// bintang 5 ujung: 5 ujung + 5 lekuk = 10 titik
cek(5 + 5 === 10 && B.NAMA_N[10] === 'Segi sepuluh', 'bintang segi sepuluh');
B.BENDA.forEach((b) => cek(B.BANGUN_ID[b.templat], 'benda punya templat ' + b.id));
cek(B.NAMA_N[3] === 'Segitiga' && B.NAMA_N[8] === 'Segi delapan', 'NAMA_N');

// ================= Hitung Sisi =================
const ID_CEKUNG = B.BANGUN.filter((t) => t.cekung).map((t) => t.id);
for (let t = 1; t <= 3; t++) {
  const cacah = {};
  for (let r = 0; r < RONDE; r++) {
    const ronde = HS.buatRonde(t);
    cek(ronde.length === 5 && unik(ronde.map((s) => s.kode)), 'hitung ronde 5 soal berbeda t' + t);
    ronde.forEach((s, i) => {
      cacah[s.jenis] = (cacah[s.jenis] || 0) + 1;
      cek(s.opsi.length >= 2 && unik(s.opsi.map((o) => o.nama)) && unik(s.opsi.map((o) => String(o.kode))), 'hitung opsi unik');
      cek(s.opsi.filter((o) => HS.periksa(s, o.kode).benar).length === 1, 'hitung tepat satu benar ' + s.jenis);
      cek(HS.periksa(s, s.kunci).benar, 'hitung periksa kunci');
      if (s.jenis === 'hitung' || s.jenis === 'benda') {
        const tp = B.BANGUN_ID[s.templat];
        cek(s.kunci === tp.pts.length && s.kunci === tp.n, 'hitung kunci = jumlah titik ' + s.templat);
        cek(s.opsi.find((o) => o.kode === s.kunci).nama === B.NAMA_N[tp.pts.length], 'hitung nama = segi-n');
        cek(s.opsi.every((o) => typeof o.kode === 'number'), 'hitung kode angka');
      }
      if (s.jenis === 'hitung') {
        cek(i < 3, 'hitung soal 1-3');
        const tp = B.BANGUN_ID[s.templat];
        if (t === 1) cek(!tp.cekung && tp.n <= 6 && s.rot === 0, 'hitung t1 cembung, n <= 6, tidak diputar');
        if (t === 2) cek(!tp.cekung && tp.n <= 8, 'hitung t2 cembung n <= 8');
        if (t === 3) cek(tp.cekung && ID_CEKUNG.includes(s.templat), 'hitung t3 cekung');
        if (t >= 2) cek(s.rot >= 0 && s.rot <= 359, 'hitung diputar acak');
      }
      if (s.jenis === 'benda') { cek(i === 3 || (t === 1 && i === 4), 'benda soal 4-5'); cek(s.rot === 0, 'benda tidak diputar'); }
      if (s.jenis === 'beraturan') {
        const tp = B.BANGUN_ID[s.templat];
        cek(s.kunci === (tp.sisiSama && tp.sudutSama) && i === 4 && t >= 2, 'beraturan kunci dari data');
        cek(s.opsi.length === 2 && s.opsi.some((o) => o.kode === true) && s.opsi.some((o) => o.kode === false), 'beraturan opsi');
        if (tp.n === 4 && !tp.beraturan) cek(!s.kunci, 'belah ketupat / persegi panjang tidak beraturan');
      }
      if (s.jenis === 'bukan') {
        cek(t === 3 && i === 2 && s.kunci === 'bukan' && s.opsi.some((o) => o.kode === 'bukan'), 'bukan segi banyak');
        cek(s.opsi.filter((o) => o.kode === 'bukan').length === 1, 'bukan satu pilihan');
      }
    });
    if (t === 1) cek(ronde.slice(0, 3).every((s) => s.jenis === 'hitung') && ronde.slice(3).every((s) => s.jenis === 'benda'), 'hitung t1 susunan');
    if (t === 2) cek(ronde[3].jenis === 'benda' && ronde[4].jenis === 'beraturan', 'hitung t2 susunan');
    if (t === 3) cek(ronde[2].jenis === 'bukan' && ronde[3].jenis === 'benda' && ronde[4].jenis === 'beraturan', 'hitung t3 susunan');
    // soal mirip tetap jenis sama & kunci tepat satu
    ronde.forEach((s) => { const m = HS.soalMirip(s, t); cek(m.jenis === s.jenis && m.kode !== s.kode && m.opsi.filter((o) => HS.periksa(m, o.kode).benar).length === 1, 'hitung mirip'); });
  }
  console.log('Hitung Sisi t' + t + ': ' + JSON.stringify(cacah));
}
// bintang 5 ujung & huruf L muncul di tingkat 3
{
  const lihat = new Set();
  for (let r = 0; r < RONDE; r++) HS.buatRonde(3).forEach((s) => { if (s.jenis === 'hitung') lihat.add(s.templat); });
  cek(lihat.has('bintang') && lihat.has('huruf-L') && lihat.has('panah'), 'hitung t3 memuat L, panah, bintang');
}

// @@AKHIR
console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 10 lulus.');
process.exit(gagal ? 1 : 0);
