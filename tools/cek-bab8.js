// Cek logika mini game Kelas 4 Bab 8 (Sudut): node tools/cek-bab8.js
// 200 ronde per tingkat per mini game. Kunci dihitung ulang dari data yang TAMPIL (sinar mutlak, huruf nama, bacaan busur,
// posisi arah) dengan bilangan bulat; tepat satu pilihan benar, tidak ada pilihan kembar, jawaban soal 1-3 tidak semuanya sama.
const Sd = require('../js/kelas-4/bab-8/sudut.js');
const J = require('../js/kelas-4/bab-8/jenis-sudut.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const mod = (a, n) => ((a % n) + n) % n;

// ---- logika dasar ----
cek(Sd.jenisSudut(30) === 'lancip' && Sd.jenisSudut(90) === 'siku' && Sd.jenisSudut(91) === 'tumpul' && Sd.jenisSudut(180) === 'lurus' && Sd.jenisSudut(89) === 'lancip', 'jenisSudut');
cek(Sd.putarArah(0, 90, true) === 2 && Sd.putarArah(0, 90, false) === 6 && Sd.putarArah(6, 135, true) === 1 && Sd.putarArah(1, 315, false) === 2, 'putarArah');
cek(Sd.derajatPutar(0, 6, true) === 270 && Sd.derajatPutar(0, 6, false) === 90 && Sd.derajatPutar(2, 4, true) === 90, 'derajatPutar');
cek(Sd.ARAH.join(' ') === 'U TL T TG S BD B BL' && Sd.NAMA_ARAH[3] === 'Tenggara', 'nama arah');
cek(Sd.teksPutar(90) === '¼ putaran (90°)' && Sd.teksPutar(135) === '135°', 'teksPutar');
cek(Sd.namaSudut('P', 'Q', 'R') === '∠PQR', 'namaSudut');
for (let rho = -30; rho <= 30; rho += 5) for (const sisi of ['R', 'L']) for (let s = 1; s <= 179; s++) {
  const b = Sd.busur(rho, sisi, s);
  cek(b.bacaR + b.bacaL === 180 && mod(b.a2 - b.a1, 360) === (sisi === 'R' ? s : 360 - s), 'busur geometri');
  cek((sisi === 'R' ? b.bacaR : b.bacaL) === s, 'busur kunci skala ' + rho + sisi + s);
}

const kecuali = (arr, x) => arr.filter((y) => y !== x);

// ================= Jenis Sudut =================
const KELAS = (d) => (d < 90 ? 'lancip' : d === 90 ? 'siku' : d < 180 ? 'tumpul' : 'lurus'); // pembanding independen
for (const t of [1, 2, 3]) {
  const cacah = {}; let nLurus = 0, nNama = 0, nHuruf = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = J.buatRonde(t);
    cek(ronde.length === 5, 'jenis 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'jenis') && ronde.slice(3).every((s) => s.jenis === (t === 3 ? 'nama2' : 'nama')), 'jenis urutan');
    cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size > 1, 'jenis jawaban 1-3 tidak boleh sama semua t' + t);
    if (t === 1) cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size === 3, 'jenis t1 tiga jenis berbeda');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'jenis kode kembar');
    for (const s of ronde.concat(ronde.map((x) => J.soalMirip(x, t)))) {
      if (s.jenis === 'jenis') {
        const a2 = s.a1 + s.d, beda = mod(a2 - s.a1, 360); // dihitung ulang dari dua sinar yang digambar
        cek(beda === s.d && Number.isInteger(s.d), 'jenis sinar');
        cek(KELAS(beda) === s.kunci, 'jenis kunci ' + beda + ' ' + s.kunci);
        cek(J.periksaJenis(s, s.kunci).benar && s.opsi.filter((o) => J.periksaJenis(s, o).benar).length === 1, 'jenis tepat satu benar');
        cek(s.opsi.length === (t === 3 ? 4 : 3) && new Set(s.opsi).size === s.opsi.length, 'jenis pilihan');
        const n = J.NILAI[t];
        if (t === 1) cek((s.d >= 20 && s.d <= 70) || s.d === 90 || (s.d >= 110 && s.d <= 160), 'jenis t1 rentang ' + s.d);
        if (t === 2) cek([75, 80, 85, 90, 95, 100, 105].includes(s.d), 'jenis t2 rentang ' + s.d);
        if (t < 3) cek(s.kunci !== 'lurus', 'jenis lurus hanya t3');
        else if (s.kunci === 'lurus') nLurus++;
        cacah[s.kunci] = (cacah[s.kunci] || 0) + 1;
      } else if (s.jenis === 'nama') {
        nNama++;
        const huruf = [s.A, s.V, s.B];
        cek(new Set(huruf).size === 3, 'nama huruf kembar');
        cek(s.opsi.length === 4 && new Set(s.opsi.map((o) => o.nama)).size === 4, 'nama pilihan kembar');
        // pembanding: benar bila huruf TENGAH = titik sudut
        const benar = s.opsi.filter((o) => o.huruf[1] === s.V);
        cek(benar.length === 1 && benar[0].nama === s.kunci, 'nama tepat satu benar');
        cek(s.opsi.every((o) => [...o.huruf].sort().join('') === [...huruf].sort().join('')), 'nama pakai tiga huruf yang sama');
        cek(s.opsi.every((o) => J.periksaNama(s, o).benar === (o.huruf[1] === s.V)), 'nama pemeriksa');
        cek(s.opsi.every((o) => /^∠[A-Z]{3}$/.test(o.nama)), 'nama format');
        if (t === 1) cek(KELAS(s.d) && ((s.d >= 20 && s.d <= 70) || s.d === 90 || (s.d >= 110 && s.d <= 160)), 'nama t1 sudut');
      } else {
        nHuruf++;
        const { P, Q, R, Sx, alfa, beta, tanya } = s;
        cek(new Set([P, Q, R, Sx]).size === 4 && alfa >= 25 && beta >= 25 && alfa + beta <= 170 && alfa % 5 === 0 && beta % 5 === 0, 'nama2 sudut');
        const target = tanya === 'x' ? [P, R] : [R, Sx];
        const benarFn = (o) => o.huruf[1] === Q && ((o.huruf[0] === target[0] && o.huruf[2] === target[1]) || (o.huruf[0] === target[1] && o.huruf[2] === target[0]));
        cek(s.opsi.length === 4 && new Set(s.opsi.map((o) => o.nama)).size === 4, 'nama2 pilihan kembar');
        cek(s.opsi.filter(benarFn).length === 1 && benarFn(s.opsi.find((o) => o.nama === s.kunci)), 'nama2 tepat satu benar');
        cek(s.opsi.every((o) => J.periksaNama(s, o).benar === benarFn(o)), 'nama2 pemeriksa');
        cek(s.opsi.filter((o) => o.huruf[1] !== Q).length === 1, 'nama2 satu pengecoh huruf tengah salah');
      }
    }
  }
  if (t === 3) cek(nLurus > 0, 'jenis t3 sudut lurus muncul');
  console.log('Jenis Sudut t' + t + ': ' + JSON.stringify(cacah) + ', nama ' + (t === 3 ? nHuruf + ' (x/y)' : nNama));
}

// ================= Baca Busur =================
const B = require('../js/kelas-4/bab-8/baca-busur.js');
for (const t of [1, 2, 3]) {
  let nBaca = 0, nBuat = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = B.buatRonde(t);
    cek(ronde.length === 5, 'busur 5 soal t' + t);
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'baca'), 'busur 1-3 baca t' + t);
    cek(ronde.slice(3).every((s) => s.jenis === 'buat'), 'busur 4-5 buat t' + t);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'busur kode kembar t' + t);
    for (const soal of ronde.concat(ronde.map((x) => B.soalMirip(x, t)))) {
      cek(Number.isInteger(soal.s) && soal.s >= 1 && soal.s <= 179, 'busur s rentang t' + t);
      if (t === 1) cek(soal.s % 10 === 0 && soal.sisi === 'R', 'busur t1 step+sisi');
      if (t === 2) cek(soal.s % 5 === 0, 'busur t2 step');
      if (soal.jenis === 'baca') {
        nBaca++;
        cek(soal.opsi.length === 4 && new Set(soal.opsi).size === 4, 'busur baca pilihan t' + t);
        cek(soal.opsi.includes(soal.kunci), 'busur baca kunci ada t' + t);
        cek(soal.opsi.includes(180 - soal.s), 'busur baca pengecoh ada t' + t);
        cek(B.periksaBaca(soal, soal.kunci).benar, 'busur baca periksaBenar');
        cek(!B.periksaBaca(soal, 180 - soal.s).benar || soal.s === 90, 'busur baca periksaSalah');
      } else {
        nBuat++;
        cek(B.periksaBuat(soal, soal.kunci).benar, 'busur buat periksaBenar');
        cek(!B.periksaBuat(soal, Math.min(179, soal.kunci + 1)).benar || soal.kunci === 179, 'busur buat periksaSalah');
      }
    }
  }
  console.log('Baca Busur t' + t + ': baca=' + nBaca + ', buat=' + nBuat);
}

// ================= Putar Arah =================
const P = require('../js/kelas-4/bab-8/putar-arah.js');
for (const t of [1, 2, 3]) {
  let nPutar = 0, nBerapa = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = P.buatRonde(t);
    cek(ronde.length === 5, 'arah 5 soal t' + t);
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'putar'), 'arah 1-3 putar t' + t);
    cek(ronde.slice(3).every((s) => s.jenis === 'berapa'), 'arah 4-5 berapa t' + t);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'arah kode kembar t' + t);
    cek(new Set(ronde.slice(0, 3).map((s) => s.ke)).size > 1, 'arah putar tujuan beragam t' + t);
    for (const soal of ronde.concat(ronde.map((x) => P.soalMirip(x, t)))) {
      if (t <= 2) {
        cek([0, 2, 4, 6].includes(soal.dari), 'arah t1t2 dari t' + t);
        cek([0, 2, 4, 6].includes(soal.ke), 'arah t1t2 ke t' + t);
      }
      if (soal.jenis === 'putar') {
        nPutar++;
        cek(soal.ke !== soal.dari, 'arah putar ke != dari t' + t);
        cek(Sd.putarArah(soal.dari, soal.d, soal.kanan) === soal.ke, 'arah putar putarArah t' + t);
        cek(P.periksaPutar(soal, soal.kunci).benar, 'arah putar periksaBenar');
        cek(!P.periksaPutar(soal, mod(soal.ke + 1, 8)).benar, 'arah putar periksaSalah');
      } else {
        nBerapa++;
        cek(soal.opsi.length >= 2 && soal.opsi.includes(soal.kunci), 'arah berapa opsi t' + t);
        cek(P.periksaBerapa(soal, soal.kunci).benar, 'arah berapa periksaBenar');
        const lain = soal.opsi.find((x) => x !== soal.kunci);
        if (lain != null) cek(!P.periksaBerapa(soal, lain).benar, 'arah berapa periksaSalah');
      }
    }
  }
  console.log('Putar Arah t' + t + ': putar=' + nPutar + ', berapa=' + nBerapa);
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 8 lulus.');
process.exit(gagal ? 1 : 0);
