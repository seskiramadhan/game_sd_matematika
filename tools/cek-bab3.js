// Cek logika mini game Bagi Rata & Katak Loncat (Kelas 4 Bab 3): node tools/cek-bab3.js
const B = require('../js/kelas-4/bab-3/bagi-rata.js');
const K = require('../js/kelas-4/bab-3/katak-loncat.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 30) console.log('GAGAL:', pesan); } };
const RONDE = 200;

// ---------- 🍬 Bagi Rata ----------
// faktor dibandingkan dengan cara lain (cek semua d dari 1..n)
for (let n = 1; n <= 120; n++) {
  const f = B.faktor(n);
  const f2 = []; for (let d = 1; d <= n; d++) if (Number.isInteger(n / d)) f2.push(d);
  cek(JSON.stringify(f) === JSON.stringify(f2), 'faktor ' + n);
  B.pasangan(n).forEach(([a, b]) => cek(a * b === n && a <= b, 'pasangan ' + n));
  cek(B.pasangan(n).length === Math.ceil(f.length / 2), 'banyak pasangan ' + n);
}
cek(JSON.stringify(B.faktor(84)) === JSON.stringify([1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84]), 'faktor 84');

const statB = {};
for (const t of [1, 2, 3]) {
  let rata = 0, nRata = 0, piringPenekanan = 0, nFaktor = 0, faktorPenekanan = 0, maksChip = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = B.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'rata') && ronde.slice(3).every((s) => s.jenis === 'faktor'), 'urutan jenis');
    const r3 = ronde.slice(0, 3);
    cek(r3.some((s) => s.rata) && r3.some((s) => !s.rata), 'soal 1-3 campur rata & sisa');
    cek(ronde[3].n !== ronde[4].n, 'soal faktor tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => B.soalMirip(x, t)))) {
      if (s.jenis === 'rata') {
        nRata++;
        cek(s.n >= B.MIN[t] && s.n <= B.MAKS[t], 'batas permen t' + t + ': ' + s.n);
        cek(s.k >= 2 && s.k <= 12, 'banyak piring ' + s.k);
        cek(s.rata === (s.n % s.k === 0), 'kunci rata ' + s.n + ':' + s.k);
        cek(s.q * s.k + s.sisa === s.n && s.sisa >= 0 && s.sisa < s.k, 'hasil bagi ' + s.n + ':' + s.k);
        cek(s.q >= 1 && s.q <= B.MAKS_PER_PIRING, 'permen per piring ' + s.q);
        if (s.rata) rata++;
        if ([6, 7, 8, 12].includes(s.k)) piringPenekanan++;
      } else {
        nFaktor++;
        cek(s.n >= 1 && s.n <= B.MAKS[t], 'batas faktor t' + t + ': ' + s.n);
        cek(s.faktorList.length >= 4, 'cukup banyak faktor ' + s.n);
        cek(s.angka.length <= B.MAKS_CHIP && s.angka.length >= Math.min(s.n, 12), 'banyak chip ' + s.angka.length + ' untuk ' + s.n);
        cek(new Set(s.angka).size === s.angka.length, 'chip unik ' + s.n);
        cek(s.angka.every((x) => x >= 1 && x <= s.n), 'chip dalam 1..n ' + s.n);
        cek(s.faktorList.every((x) => s.angka.includes(x)), 'semua faktor ada di chip ' + s.n);
        cek(s.angka.some((x) => s.n % x !== 0), 'ada pengecoh ' + s.n);
        cek(JSON.stringify(s.faktorList) === JSON.stringify(s.angka.filter((x) => s.n % x === 0)), 'kunci faktor ' + s.n);
        cek(B.periksaFaktor(s, s.faktorList).benar === true, 'jawaban benar diterima ' + s.n);
        cek(B.periksaFaktor(s, []).benar === false, 'kosong ditolak');
        cek(B.periksaFaktor(s, s.angka).benar === false, 'semua dipilih ditolak');
        cek(B.periksaFaktor(s, s.faktorList.slice(1)).benar === false, 'kurang satu ditolak');
        maksChip = Math.max(maksChip, s.angka.length);
        if (B.isPenekanan(s.n)) faktorPenekanan++;
      }
    }
  }
  statB[t] = { persenRata: Math.round(100 * rata / nRata), persenPiring_6_7_8_12: Math.round(100 * piringPenekanan / nRata), persenN_kelipatan_6_7_8_12: Math.round(100 * faktorPenekanan / nFaktor), maksChip };
}

// ---------- 🐸 Katak Loncat ----------
const statK = {};
for (const t of [1, 2, 3]) {
  const hitung = {}; let maksRentang = 0, maksAngka = 0, n = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'satu') && ronde.slice(3).every((s) => s.jenis === 'dua'), 'urutan jenis katak');
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, t)))) {
      n++;
      hitung[s.n] = (hitung[s.n] || 0) + 1;
      cek(K.LONCAT[t].includes(s.n), 'loncat dalam tingkat ' + t + ': ' + s.n);
      cek(s.m >= K.SUDAH[t][0] && s.m <= K.SUDAH[t][1], 'banyak loncatan awal ' + s.m);
      cek(s.katak === s.m * s.n, 'posisi katak');
      cek(s.mendarat.length === s.m + 1 && s.mendarat.every((v, i) => v === i * s.n), 'jejak kelipatan');
      const banyak = s.jenis === 'dua' ? 2 : 1;
      cek(s.target.length === banyak, 'banyak target');
      s.target.forEach((v, i) => cek(v === s.katak + (i + 1) * s.n && v % s.n === 0, 'target kelipatan ' + v));
      cek(s.L >= 0 && s.L < s.katak, 'katak & 1 angka sebelumnya terlihat (L=' + s.L + ', katak=' + s.katak + ')');
      cek(s.R > s.target[banyak - 1], 'target tidak di ujung kanan');
      cek(s.R - s.L <= K.MAKS_RENTANG, 'rentang garis ' + (s.R - s.L));
      cek(K.periksa(s, s.target).benar === true, 'jawaban benar diterima');
      cek(K.periksa(s, s.target.slice().reverse()).benar === true, 'urutan ketuk bebas');
      cek(K.periksa(s, s.target.map((v) => v + 1)).benar === false, 'salah ditolak');
      cek(K.periksa(s, [s.katak + s.n - 1].concat(s.target.slice(1))).benar === false, 'meleset 1 ditolak');
      if (banyak === 2) cek(K.periksa(s, [s.target[0]]).benar === false, 'kurang 1 loncatan ditolak');
      maksRentang = Math.max(maksRentang, s.R - s.L);
      maksAngka = Math.max(maksAngka, s.R);
    }
  }
  const persen = {}; Object.keys(hitung).forEach((k) => { persen[k] = Math.round(100 * hitung[k] / n) + '%'; });
  statK[t] = { loncat: persen, maksRentang, maksAngka };
}

console.log('Bagi Rata:', JSON.stringify(statB));
console.log('Katak Loncat:', JSON.stringify(statK));
console.log(gagal ? 'GAGAL: ' + gagal + ' cek' : 'SEMUA CEK LULUS (' + RONDE + ' ronde per tingkat per mini game)');
process.exit(gagal ? 1 : 0);
