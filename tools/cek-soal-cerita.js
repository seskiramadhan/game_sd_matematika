// Cek logika 📖 Soal Cerita Kelas 4 Bab 3: node tools/cek-soal-cerita.js
// Ribuan soal per tingkat. Kunci dibandingkan dengan KPK/FPB yang dihitung ulang dengan cara lain (cari satu per satu),
// pengecoh unik dan beda dari kunci, angka pengecoh tidak termasuk angka penting, cerita0 tanpa digit, dll.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-3/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// pembanding independen (tanpa rumus Euclid)
const kpkBrute = (a, b) => { for (let m = Math.max(a, b); ; m++) if (m % a === 0 && m % b === 0) return m; };
const fpbBrute = (a, b) => { for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d; };
cek(kpkBrute(6, 8) === 24 && fpbBrute(24, 32) === 8, 'contoh video');
for (let i = 0; i < 2000; i++) { const a = M.acak(2, 90), b = M.acak(2, 90); cek(M.kpk(a, b) === kpkBrute(a, b) && M.fpb(a, b) === fpbBrute(a, b), 'kpk/fpb ' + a + ' ' + b); }

const RONDE = 1500;
const stat = {};
for (let t = 1; t <= 3; t++) {
  stat[t] = { kel: 0, fak: 0, kelSama: 0, kelPrima: 0, kpkMaks: 0, contohK: 0, contohF: 0, ronde: 0, campur: 0 };
  const s = stat[t];
  const g = M.untuk(D);
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    const jenisAda = new Set(ronde.map((x) => x.jenis));
    cek(jenisAda.size === 2, 'ronde harus campur kedua jenis t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    s.ronde++;
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const { a, b } = so;
      const teks = so.segmen.map((x) => x.t).join('');
      // kunci benar menurut pembanding independen
      const benar = so.jenis === 'kelipatan' ? kpkBrute(a, b) : fpbBrute(a, b);
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4, nama + ' opsi harus 4 unik: ' + so.opsi);
      cek(so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' kunci harus tepat satu di opsi');
      so.opsi.forEach((o) => { cek(Number.isInteger(o) && o >= 1 && o <= 200, nama + ' opsi di luar batas ' + o); });
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 5, nama + ' sebab untuk non-opsi'));
      // sebab benar secara matematika untuk pengecoh bertanda hasil kali / jumlah / selisih
      so.opsi.forEach((o) => {
        const sb = so.sebab[o] || '';
        if (/hasil kali/.test(sb)) cek(o === a * b && o % a === 0 && o % b === 0, nama + ' sebab hasil kali salah');
        if (/saja, belum kelipatan/.test(sb)) cek(o % a === 0 !== (o % b === 0), nama + ' sebab kelipatan satu saja salah ' + o);
        if (/bukan yang terbesar/.test(sb)) cek(a % o === 0 && b % o === 0 && o < so.kunci, nama + ' sebab faktor persekutuan');
        if (/tiap/.test(sb) && /bukan banyak/.test(sb)) cek(o === a / so.kunci || o === b / so.kunci, nama + ' sebab isi tiap wadah');
        if (/Itu KPK/.test(sb)) cek(o === kpkBrute(a, b), nama + ' sebab KPK');
        if (/faktor persekutuan terbesar \(FPB\)/.test(sb)) cek(o === fpbBrute(a, b), nama + ' sebab FPB');
      });
      // cerita tanpa angka, kata kunci ada
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      // segmen: angka penting = a dan b tepat satu kali; pengecoh tidak sama dengan angka penting; teks biasa tanpa digit
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting).map((x) => Number(x.t));
      const pengecoh = angka.filter((x) => !x.penting).map((x) => Number(x.t));
      cek(penting.length === 2 && penting[0] === a && penting[1] === b, nama + ' angka penting ' + penting);
      cek(pengecoh.length === t - 1, nama + ' jumlah pengecoh ' + pengecoh.length + ' t' + t);
      pengecoh.forEach((p) => cek(!penting.includes(p) && p !== so.kunci, nama + ' angka pengecoh sama dengan angka penting/jawaban ' + p));
      cek(new Set(pengecoh).size === pengecoh.length, nama + ' pengecoh kembar');
      cek(JSON.stringify(so.angkaPengecoh) === JSON.stringify(pengecoh), nama + ' angkaPengecoh tidak cocok segmen');
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' tepat satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks, nama + ' kalimat tanya = tanya4');
      // jenis kata kunci pada cerita lengkap
      cek(so.jenis === 'kelipatan' ? /bersama lagi/.test(teks) : /sama rata/.test(teks) && /tanpa sisa/.test(teks) && /Paling banyak/.test(teks), nama + ' kata kunci jenis');
      // gambar: 3 pilihan unik, satu benar sesuai jenis, tanpa digit di keterangan
      cek(so.gambar.pilihan.length === 3 && new Set(so.gambar.pilihan.map((p) => p.id)).size === 3, nama + ' pilihan gambar');
      cek(so.gambar.pilihan.filter((p) => p.id === so.gambar.benar).length === 1, nama + ' gambar benar tepat satu');
      cek(so.gambar.benar === (so.jenis === 'kelipatan' ? 'garis' : 'bagi'), nama + ' gambar benar sesuai jenis');
      so.gambar.pilihan.forEach((p) => cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d{3,}/.test(p.ket), nama + ' svg ' + p.id));
      // layar cek memuat jawaban
      cek(so.cek.includes('<b>' + so.kunci + '</b>'), nama + ' cek tidak memuat kunci');
      // batas angka per tingkat
      if (so.jenis === 'kelipatan') {
        const L = D.KEL[t];
        cek(a >= L.lo && b <= L.hi && a < b && b % a !== 0, nama + ' angka di luar rentang');
        cek(so.kunci <= 60 && so.kunci <= L.maks, nama + ' KPK > batas ' + so.kunci);
        cek(so.kunci >= 12 || t === 1, nama + ' KPK terlalu kecil');
        if (idx < 5) { s.kel++; if (so.kunci === a * b) s.kelPrima++; else s.kelSama++; s.kpkMaks = Math.max(s.kpkMaks, so.kunci); if (a === 6 && b === 8) s.contohK++; }
      } else {
        const L = D.FAK[t];
        cek(a >= L.lo && b <= L.hi && a < b && b % a !== 0, nama + ' angka di luar rentang');
        cek(so.kunci >= 2, nama + ' FPB < 2');
        if (idx < 5) { s.fak++; if (a === 24 && b === 32) { s.contohF++; cek(so.kunci === 8 && a / so.kunci === 3 && b / so.kunci === 4, 'contoh stiker 8 amplop, 3 bintang 4 hati'); } }
      }
      if (a === 6 && b === 8 && so.jenis === 'kelipatan') cek(so.kunci === 24, 'contoh lampu 24 detik');
    });
  }
}
// contoh muncul sesuai rencana; KPK <> hasil kali di sebagian soal
cek(stat[1].contohK > RONDE * 0.1, 'contoh lampu terlalu jarang');
cek(stat[2].contohF > RONDE * 0.1, 'contoh stiker terlalu jarang');
for (let t = 1; t <= 3; t++) cek(stat[t].kelSama > 0 && stat[t].kelPrima >= 0, 'KPK <> hasil kali harus ada di t' + t);
console.log('Statistik per tingkat (soal utama dalam ' + RONDE + ' ronde):', JSON.stringify(stat));
// jumlah soal berbeda tersedia (supaya tidak cepat bosan)
for (let t = 1; t <= 3; t++) console.log('t' + t + ': pasangan kelipatan', require('../js/kelas-4/bab-3/soal-cerita-data.js').KEL[t] && 'ok');
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita lolos.');
process.exit(gagal ? 1 : 0);
