// Cek logika mini game Kelas 4 Bab 4 (Pecahan 1): node tools/cek-bab4.js
// 200 ronde per tingkat per mini game: kunci benar, pilihan tidak kembar/senilai, angka dalam batas.
const P = require('../js/kelas-4/bab-4/pecahan.js');
const Z = require('../js/kelas-4/bab-4/potong-pizza.js');
const C = require('../js/kelas-4/bab-4/cokelat-kembar.js');
const B = require('../js/kelas-4/bab-4/bandingkan.js');
const { fpb, sederhana, bandingkan, senilai } = P;
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 40) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const t = (p) => p[0] + '/' + p[1];
const desimal = (p) => p[0] / p[1];
const tekan = (b) => [6, 7, 8, 12].includes(b);

// ---------- alat dasar ----------
for (let a = 1; a <= 60; a++) for (let b = 1; b <= 60; b++) {
  let g = 1; for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) g = d;
  cek(fpb(a, b) === g, 'fpb ' + a + ',' + b);
  cek(P.kpk(a, b) === (a * b) / g, 'kpk ' + a + ',' + b);
  const s = sederhana([a, b]);
  cek(fpb(s[0], s[1]) === 1 && Math.abs(desimal(s) - a / b) < 1e-12, 'sederhana ' + a + '/' + b);
  cek(bandingkan([a, b], [b, a]) === Math.sign(a / b - b / a), 'bandingkan ' + a + '/' + b);
}
cek(t(sederhana([12, 16])) === '3/4', '12/16 -> 3/4');
cek(senilai([2, 3], [8, 12]) && bandingkan([2, 3], [3, 4]) === -1, '2/3 = 8/12 < 3/4');

// ---------- 🍕 Potong Pizza ----------
const statZ = {};
for (const T of [1, 2, 3]) {
  let n = 0, nTekan = 0, adaTerbalik = 0, adaSisa = 0, nBaca = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = Z.buatRonde(T);
    cek(ronde.length === 5, 'pizza 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'baca') && ronde.slice(3).every((s) => s.jenis === 'warnai'), 'urutan jenis pizza');
    cek(new Set(ronde.map((s) => s.a + '/' + s.b)).size === 5, 'soal pizza tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => Z.soalMirip(x, T)))) {
      n++;
      cek(s.b >= 3 && s.b <= Z.MAKS[T] && s.a >= 1 && s.a < s.b, 'batas pizza t' + T + ': ' + s.a + '/' + s.b);
      if (s.b > 12) cek(P.susunanKue(s.b)[0] >= 2, 'kue bisa disusun persegi panjang ' + s.b);
      if (tekan(s.b)) nTekan++;
      if (s.jenis === 'baca') {
        nBaca++;
        cek(s.opsi.length === 4, 'pizza 4 pilihan');
        const benar = s.opsi.filter((p) => Z.periksaBaca(s, p).benar);
        cek(benar.length === 1 && t(benar[0]) === s.a + '/' + s.b, 'kunci pizza tepat satu ' + s.a + '/' + s.b);
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) cek(!senilai(s.opsi[i], s.opsi[j]), 'pilihan pizza senilai/kembar ' + s.opsi.map(t));
        cek(s.opsi.every((p) => p[0] >= 1 && p[1] >= 1 && p[0] <= 24 && p[1] <= Z.MAKS[T]), 'angka pilihan pizza ' + s.opsi.map(t));
        cek(s.opsi.some((p) => p[0] === s.b && p[1] === s.a) && s.opsi.some((p) => p[0] === s.b - s.a && p[1] === s.b), 'pengecoh terbalik & sisa ada ' + s.a + '/' + s.b);
        if (s.opsi.some((p) => p[0] === s.b && p[1] === s.a)) adaTerbalik++;
        if (s.opsi.some((p) => p[0] === s.b - s.a && p[1] === s.b)) adaSisa++;
      } else {
        const semua = [...Array(s.b).keys()];
        cek(Z.periksaWarnai(s, semua.slice(0, s.a)).benar, 'warnai pas diterima');
        cek(Z.periksaWarnai(s, semua.slice(-s.a)).benar, 'warnai potongan mana saja diterima');
        cek(!Z.periksaWarnai(s, semua.slice(0, s.a + 1)).benar, 'warnai lebih ditolak');
        cek(!Z.periksaWarnai(s, semua.slice(0, s.a - 1)).benar, 'warnai kurang ditolak');
      }
    }
  }
  statZ[T] = { persenPenyebut_6_7_8_12: Math.round(100 * nTekan / n), pengecohTerbalik: Math.round(100 * adaTerbalik / nBaca) + '%', pengecohSisa: Math.round(100 * adaSisa / nBaca) + '%' };
}

// ---------- 🍫 Cokelat Kembar ----------
const statC = {};
for (const T of [1, 2, 3]) {
  let nSen = 0, adaTambah = 0, nSed = 0, jebakan = 0, nTekan = 0, n = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = C.buatRonde(T);
    cek(ronde.length === 5, 'cokelat 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'senilai') && ronde.slice(3).every((s) => s.jenis === 'sederhana'), 'urutan jenis cokelat');
    for (const s of ronde.concat(ronde.map((x) => C.soalMirip(x, T)))) {
      n++;
      if (s.jenis === 'senilai') {
        nSen++;
        cek(s.q[0] >= 1 && s.q[0] < s.q[1] && s.q[1] <= C.MAKS[T], 'batas soal senilai ' + t(s.q));
        cek(s.opsi.length === 4, 'cokelat 4 pilihan');
        const benar = s.opsi.filter((o) => C.periksaSenilai(s, o).benar);
        cek(benar.length === 1 && senilai(benar[0].p, s.q) && t(benar[0].p) !== t(s.q), 'kunci senilai tepat satu ' + t(s.q));
        cek(s.opsi.filter((o) => senilai(o.p, s.q)).length === 1, 'hanya satu pilihan senilai ' + t(s.q) + ': ' + s.opsi.map((o) => t(o.p)));
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) cek(!senilai(s.opsi[i].p, s.opsi[j].p), 'pilihan cokelat kembar ' + s.opsi.map((o) => t(o.p)));
        cek(s.opsi.every((o) => o.p[0] >= 1 && o.p[0] < o.p[1] && o.p[1] <= C.MAKS[T]), 'angka pilihan cokelat t' + T + ': ' + s.opsi.map((o) => t(o.p)));
        cek(s.j[1] % s.q[1] === 0 || s.q[1] % s.j[1] === 0, 'pengali/pembagi bulat ' + t(s.q) + '=' + t(s.j));
        const tb = s.opsi.find((o) => o.jenis === 'tambah');
        if (tb) {
          adaTambah++;
          cek(tb.p[0] - s.q[0] === tb.p[1] - s.q[1] || tb.p[0] - s.q[0] === tb.p[1] - s.q[1] || (tb.p[0] === s.j[0] || tb.p[1] === s.j[1]), 'pengecoh tambah ' + t(tb.p));
        }
        if (tekan(s.q[1]) || tekan(s.j[1])) nTekan++;
      } else {
        nSed++;
        const [a, b] = s.p;
        cek(b <= C.MAKS[T] && a >= 1 && a < b && fpb(a, b) > 1, 'batas sederhanakan ' + t(s.p));
        cek(t(s.akhir) === t(sederhana(s.p)) && fpb(s.akhir[0], s.akhir[1]) === 1, 'kunci sederhana ' + t(s.p));
        const habis = C.jalanHabis(s.p);
        cek(t(habis.jejak[habis.jejak.length - 1]) === t(s.akhir), 'jalan habis ' + t(s.p));
        cek(habis.bagi.every((d) => C.PEMBAGI.includes(d)), 'pembagi tersedia di tombol ' + habis.bagi);
        cek(C.periksaSederhana(s, habis.bagi, true).benar === true, 'sampai habis diterima ' + t(s.p));
        if (C.PEMBAGI.includes(s.fpb)) cek(C.periksaSederhana(s, [s.fpb], true).benar === true, 'langsung bagi FPB diterima ' + t(s.p));
        cek(C.periksaSederhana(s, [], true).benar === false, 'tanpa membagi ditolak ' + t(s.p));
        if (habis.bagi.length > 1) {
          jebakan++;
          const r1 = C.periksaSederhana(s, habis.bagi.slice(0, 1), true);
          cek(r1.benar === false && r1.alasan === 'berhenti', 'berhenti di tengah = belum selesai ' + t(s.p));
        }
        const salah = C.PEMBAGI.find((d) => a % d || b % d);
        const r2 = C.periksaSederhana(s, [salah], false);
        cek(r2 && r2.benar === false && r2.alasan === 'pembagi', 'pembagi salah ditolak ' + t(s.p) + ' :' + salah);
        if (tekan(b) || tekan(s.akhir[1])) nTekan++;
      }
    }
  }
  statC[T] = { pengecohTambah: Math.round(100 * adaTambah / nSen) + '%', jebakanBerhentiDiTengah: Math.round(100 * jebakan / nSed) + '%', persenPenyebut_6_7_8_12: Math.round(100 * nTekan / n) };
}

// ---------- ⚖️ Mana Lebih Besar ----------
const statB = {};
for (const T of [1, 2, 3]) {
  let nB = 0, sama = 0, anti = 0, beda = 0, tanda = { '-1': 0, 0: 0, 1: 0 }, nU = 0, maksK = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = B.buatRonde(T);
    cek(ronde.length === 5, 'banding 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'banding') && ronde.slice(3).every((s) => s.jenis === 'urut'), 'urutan jenis banding');
    if (T < 3) cek(new Set(ronde.slice(0, 3).map((s) => s.tanda)).size > 1, 'jawaban soal 1-3 tidak sama semua');
    for (const s of ronde.concat(ronde.map((x) => B.soalMirip(x, T)))) {
      if (s.jenis === 'banding') {
        nB++;
        const { p, q } = s;
        [p, q].forEach((x) => cek(x[0] >= 1 && x[0] < x[1] && x[1] <= B.MAKS_PENYEBUT, 'batas banding ' + t(x)));
        cek(s.tanda === Math.sign(desimal(p) - desimal(q)) || (s.tanda === 0 && Math.abs(desimal(p) - desimal(q)) < 1e-12), 'kunci banding ' + t(p) + ' ' + t(q));
        cek(B.periksaBanding(s, s.tanda).benar && [-1, 0, 1].filter((x) => B.periksaBanding(s, x).benar).length === 1, 'tepat satu tanda benar');
        if (T === 1) cek(p[1] === q[1] && p[0] !== q[0], 'tingkat 1 penyebut sama');
        if (T === 2) cek(p[0] === q[0] && p[1] !== q[1], 'tingkat 2 pembilang sama');
        if (T === 3) { cek(p[0] !== q[0] && p[1] !== q[1] && P.kpk(p[1], q[1]) <= B.MAKS_SAMA, 'tingkat 3 beda keduanya ' + t(p) + ' ' + t(q)); maksK = Math.max(maksK, P.kpk(p[1], q[1])); }
        tanda[s.tanda]++;
        if (s.tanda === 0) sama++;
        if (p[1] !== q[1]) { beda++; const besar = p[1] > q[1] ? p : q, kecil = besar === p ? q : p; if (bandingkan(besar, kecil) < 0) anti++; }
      } else {
        nU++;
        cek(s.daftar.length >= 3 && s.daftar.length <= 4, 'banyak pecahan urut');
        cek(s.daftar.every((x) => x[0] >= 1 && x[0] < x[1] && x[1] <= B.MAKS_PENYEBUT), 'batas urut ' + s.daftar.map(t));
        for (let i = 0; i < s.daftar.length; i++) for (let j = i + 1; j < s.daftar.length; j++) cek(!senilai(s.daftar[i], s.daftar[j]), 'urut ada yang senilai ' + s.daftar.map(t));
        const kunci = s.daftar.slice().sort((x, y) => desimal(x) - desimal(y));
        cek(kunci.map(t).join() === s.urut.map(t).join(), 'kunci urut ' + s.urut.map(t));
        cek(B.periksaUrut(s, s.urut).benar, 'urutan benar diterima');
        cek(!B.periksaUrut(s, s.urut.slice().reverse()).benar, 'urutan terbalik ditolak');
        cek(!B.periksaUrut(s, s.daftar).benar, 'soal tidak sudah urut dari awal ' + s.daftar.map(t));
        if (T === 3) cek(s.sama <= B.MAKS_SAMA, 'penyebut disamakan <= 24: ' + s.sama);
        if (T === 1) cek(new Set(s.daftar.map((x) => x[1])).size === 1, 'urut t1 penyebut sama');
        if (T === 2) cek(new Set(s.daftar.map((x) => x[0])).size === 1 && new Set(s.daftar.map((x) => x[1])).size === s.daftar.length, 'urut t2 pembilang sama');
        if (T === 3) cek(new Set(s.daftar.map((x) => x[1])).size === s.daftar.length, 'urut t3 penyebut beda');
      }
    }
  }
  statB[T] = { tanda: { '<': tanda[-1], '=': tanda[0], '>': tanda[1] }, persenSama: Math.round(100 * sama / nB) + '%',
    penyebutBesarJustruLebihKecil: beda ? Math.round(100 * anti / beda) + '%' : '-', maksKPK: maksK };
}

console.log('Potong Pizza:', JSON.stringify(statZ));
console.log('Cokelat Kembar:', JSON.stringify(statC));
console.log('Mana Lebih Besar:', JSON.stringify(statB));
console.log(gagal ? 'GAGAL: ' + gagal + ' cek' : 'SEMUA CEK LULUS (' + RONDE + ' ronde per tingkat per mini game)');
process.exit(gagal ? 1 : 0);
