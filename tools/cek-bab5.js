// Cek logika mini game Kelas 4 Bab 5 (Pecahan 2): node tools/cek-bab5.js
// 200 ronde per tingkat per mini game: tepat satu jawaban benar, pilihan tidak kembar/senilai,
// angka dalam batas tingkat, pengecoh wajib ada, kesalahan khas dikenali pemeriksa.
const P = require('../js/kelas-4/bab-4/pecahan.js');
const C = require('../js/kelas-4/bab-5/campuran.js');
const R = require('../js/kelas-4/bab-5/roti-utuh.js');
const T = require('../js/kelas-4/bab-5/tukar-bentuk.js');
const K = require('../js/kelas-4/bab-5/bagi-kelompok.js');
const { senilai } = P;
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 40) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const tekan = (b) => [6, 7, 8, 12].includes(b);
const tc = C.teks;
const persen = (x, n) => Math.round((100 * x) / n) + '%';

// ---------- alat dasar ----------
for (let b = 2; b <= 12; b++) for (let n = 1; n <= 80; n++) {
  const c = C.keCampuran(n, b);
  // hitung ulang tanpa rumus: kurangi b berulang kali
  let u = 0, s = n; while (s >= b) { s -= b; u++; }
  cek(c.u === u && c.a === s && c.b === b, 'keCampuran ' + n + '/' + b);
  cek(C.keTidakMurni(c) === n, 'bolak-balik ' + n + '/' + b);
  cek(senilai(C.nilai(c), [n, b]), 'nilai ' + n + '/' + b);
}
cek(tc(C.keCampuran(11, 4)) === '2 3/4', '11/4 = 2 3/4');
cek(C.keTidakMurni({ u: 2, a: 3, b: 8 }) === 19, '2 3/8 = 19/8');
cek(C.angka(1056) === '1.056' && C.angka(96) === '96', 'format angka Indonesia');

const bataskanCampuran = (s, Tk, nama) => {
  cek(s.b >= 2 && s.b <= C.MAKS_PENYEBUT[Tk], nama + ' penyebut t' + Tk + ': ' + tc(s));
  cek(s.u >= 1 && s.u <= C.MAKS_UTUH[Tk], nama + ' utuh t' + Tk + ': ' + tc(s));
  cek(s.a >= 1 && s.a < s.b, nama + ' pecahan murni: ' + tc(s));
};
const opsiUnik = (opsi, nama) => {
  for (let i = 0; i < opsi.length; i++) for (let j = i + 1; j < opsi.length; j++) cek(!senilai(C.nilai(opsi[i]), C.nilai(opsi[j])), nama + ' pilihan senilai/kembar ' + opsi.map(tc));
};

// ---------- 🥐 Roti Utuh ----------
const statR = {};
for (const Tk of [1, 2, 3]) {
  let n = 0, nT = 0, nBaca = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = R.buatRonde(Tk);
    cek(ronde.length === 5, 'roti 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'baca') && ronde.slice(3).every((s) => s.jenis === 'susun'), 'urutan jenis roti');
    cek(new Set(ronde.map(tc)).size === 5, 'soal roti tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => R.soalMirip(x, Tk)))) {
      n++; if (tekan(s.b)) nT++;
      bataskanCampuran(s, Tk, 'roti');
      if (s.jenis === 'baca') {
        nBaca++;
        cek(s.opsi.length === 4, 'roti 4 pilihan');
        const benar = s.opsi.filter((c) => R.periksaBaca(s, c).benar);
        cek(benar.length === 1 && tc(benar[0]) === tc(s), 'roti tepat satu benar ' + tc(s));
        opsiUnik(s.opsi, 'roti');
        cek(s.opsi.every((c) => c.u >= 0 && c.u <= 6 && c.a >= 1 && c.a <= 12 && c.b >= 2 && c.b <= 12), 'angka pilihan roti ' + s.opsi.map(tc));
        cek(s.opsi.some((c) => R.periksaBaca(s, c).jenisSalah === 'lupaUtuh'), 'pengecoh lupa utuh ada ' + tc(s));
        cek(s.opsi.some((c) => R.periksaBaca(s, c).jenisSalah === 'tertukar'), 'pengecoh tertukar ada ' + tc(s));
      } else {
        cek(R.periksaSusun(s, s.u, s.a).benar, 'susun pas diterima');
        cek(!R.periksaSusun(s, s.u - 1, s.b).benar, 'susun: semua potong diwarnai tapi utuh kurang 1 tetap salah (pembilang >= 1)');
        cek(!R.periksaSusun(s, s.u + 1, s.a).benar && !R.periksaSusun(s, s.u - 1, s.a).benar, 'susun utuh salah ditolak');
        cek(!R.periksaSusun(s, s.u, s.a + 1).benar && !R.periksaSusun(s, s.u, s.a - 1).benar, 'susun potong salah ditolak');
        cek(!R.periksaSusun(s, 0, s.a).benar, 'susun tanpa roti utuh ditolak');
        cek(s.u + 1 <= R.MAKS_TOMBOL_UTUH, 'tombol roti utuh cukup');
      }
    }
  }
  statR[Tk] = { penyebut_6_7_8_12: persen(nT, n) };
}

// ---------- 🔄 Tukar Bentuk ----------
const statT = {};
for (const Tk of [1, 2, 3]) {
  let n = 0, nT = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = T.buatRonde(Tk);
    cek(ronde.length === 5, 'tukar 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'keCampuran') && ronde.slice(3).every((s) => s.jenis === 'keTidakMurni'), 'urutan jenis tukar');
    cek(new Set(ronde.map((s) => s.n + '/' + s.b)).size === 5, 'soal tukar tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => T.soalMirip(x, Tk)))) {
      n++; if (tekan(s.b)) nT++;
      bataskanCampuran(s, Tk, 'tukar');
      cek(s.n > s.b && C.keTidakMurni(s) === s.n && tc(C.keCampuran(s.n, s.b)) === tc(s), 'tukar hitungan ' + s.n + '/' + s.b + ' = ' + tc(s));
      if (s.jenis === 'keCampuran') {
        cek(s.opsi.length === 4, 'tukar 4 pilihan');
        const benar = s.opsi.filter((c) => T.periksaKeCampuran(s, c).benar);
        cek(benar.length === 1 && tc(benar[0]) === tc(C.keCampuran(s.n, s.b)), 'tukar tepat satu benar ' + s.n + '/' + s.b);
        opsiUnik(s.opsi, 'tukar');
        cek(s.opsi.every((c) => c.u >= 1 && c.u <= 12 && c.a >= 1 && c.a < c.b && c.b === s.b), 'angka pilihan tukar ' + s.opsi.map(tc));
        cek(s.opsi.some((c) => T.periksaKeCampuran(s, c).jenisSalah === 'tertukar'), 'pengecoh hasil bagi/sisa tertukar ada ' + s.n + '/' + s.b);
      } else {
        cek(s.n <= 5 * 12 + 11 && String(s.n).length <= 2, 'jawaban muat 2 digit');
        cek(T.periksaKeTidakMurni(s, s.n).benar, 'isi benar diterima');
        const lupa = T.periksaKeTidakMurni(s, s.u + s.a);
        cek(!lupa.benar && lupa.jenisSalah === 'lupaKali', 'utuh + pembilang dikenali ' + tc(s));
        const kurang = T.periksaKeTidakMurni(s, s.u * s.b);
        cek(!kurang.benar && kurang.jenisSalah === (s.u * s.b === s.u + s.a ? 'lupaKali' : 'lupaTambah'), 'utuh x penyebut saja dikenali ' + tc(s));
        cek(!T.periksaKeTidakMurni(s, s.n + 1).benar, 'isi salah ditolak');
      }
    }
  }
  statT[Tk] = { penyebut_6_7_8_12: persen(nT, n) };
}

// ---------- 🍓 Bagi Kelompok ----------
const statK = {};
for (const Tk of [1, 2, 3]) {
  let n = 0, nT = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(Tk);
    cek(ronde.length === 5, 'kelompok 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'pilih') && ronde.slice(3).every((s) => s.jenis === 'bagikan'), 'urutan jenis kelompok');
    cek(new Set(ronde.map((s) => s.a + '/' + s.b + ' ' + s.N)).size === 5, 'soal kelompok tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, Tk)))) {
      n++; if (tekan(s.b)) nT++;
      cek(s.N <= K.MAKS_JUMLAH[Tk] && s.N % s.b === 0 && s.k === s.N / s.b && s.k >= 2, 'batas kelompok t' + Tk + ': ' + s.a + '/' + s.b + ' dari ' + s.N);
      cek(s.a >= 2 && s.a < s.b && s.b <= 12 && P.fpb(s.a, s.b) === 1, 'pecahan kelompok ' + s.a + '/' + s.b);
      // hitung ulang tanpa rumus: bagikan satu-satu ke b kelompok, jumlahkan a kelompok
      const isi = Array(s.b).fill(0); for (let i = 0; i < s.N; i++) isi[i % s.b]++;
      cek(isi.slice(0, s.a).reduce((x, y) => x + y, 0) === s.jawab, 'jawab kelompok ' + s.a + '/' + s.b + ' dari ' + s.N);
      if (s.jenis === 'pilih') {
        cek(s.opsi.length === 4 && new Set(s.opsi).size === 4, 'kelompok 4 pilihan berbeda ' + s.opsi);
        cek(s.opsi.filter((x) => K.periksaPilih(s, x).benar).length === 1, 'kelompok tepat satu benar');
        cek(s.opsi.every((x) => Number.isInteger(x) && x >= 1 && x <= 11 * 96), 'angka pilihan kelompok ' + s.opsi);
        cek(s.opsi.some((x) => K.periksaPilih(s, x).jenisSalah === 'hanyaBagi'), 'pengecoh hanya bagi ada');
        cek(s.opsi.some((x) => K.periksaPilih(s, x).jenisSalah === 'kaliSaja'), 'pengecoh kali tanpa bagi ada');
      } else {
        cek(s.k <= K.MAKS_ISI_BAGIKAN[Tk], 'isi piring terbaca');
        cek(K.periksaBagikan(s, s.a).benar, 'ambil a kelompok diterima');
        cek(!K.periksaBagikan(s, 1).benar && K.periksaBagikan(s, 1).jenisSalah === 'hanyaBagi', 'ambil 1 kelompok = hanya bagi');
        cek(!K.periksaBagikan(s, s.a + 1).benar && !K.periksaBagikan(s, s.b).benar, 'ambil salah ditolak');
      }
    }
  }
  statK[Tk] = { penyebut_6_7_8_12: persen(nT, n) };
}

console.log('🥐 Roti Utuh', statR);
console.log('🔄 Tukar Bentuk', statT);
console.log('🍓 Bagi Kelompok', statK);
console.log(gagal ? 'GAGAL: ' + gagal : 'LULUS: semua cek Bab 5 benar (' + RONDE + ' ronde x 3 tingkat x 3 mini game).');
process.exit(gagal ? 1 : 0);
