// Cek logika mini game Kelas 4 Bab 1 (Bilangan Cacah): node tools/cek-bab1.js
// 200 ronde per tingkat per mini game (+ soal "mirip" untuk ulangan): tepat satu jawaban benar (soal "pilih semua"
// dicek himpunannya), tidak ada pilihan kembar, angka dalam batas tingkat, format titik ribuan Indonesia,
// fungsi angka -> kata diuji untuk semua bilangan 0..100.000 dengan pembanding independen (kata -> angka).
const B = require('../js/kelas-4/bab-1/bilangan.js');
const S = require('../js/kelas-4/bab-1/susun-angka.js');
const M = require('../js/kelas-4/bab-1/mana-lebih-besar.js');
const K = require('../js/kelas-4/bab-1/bulatkan.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;

// ---------- format titik ribuan ----------
cek(B.fmt(0) === '0' && B.fmt(999) === '999' && B.fmt(1000) === '1.000' && B.fmt(62408) === '62.408' && B.fmt(100000) === '100.000' && B.fmt(30015) === '30.015', 'fmt');
for (let n = 0; n <= 100000; n += 7) cek(!/,/.test(B.fmt(n)) && Number(B.fmt(n).replace(/\./g, '')) === n, 'fmt balik ' + n);

// ---------- angka -> kata (diuji dengan pengurai kata -> angka yang independen) ----------
const NILAI = { nol: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9, sepuluh: 10, sebelas: 11 };
// pengurai lurus: tiap kelompok tiga angka dibaca dengan aturan eksplisit
function bacaTiga(t) { // kata untuk 0..999
  let n = 0;
  const w = t.slice();
  const ix = w.indexOf('ratus');
  if (w[0] === 'seratus') { n += 100; w.shift(); }
  else if (ix === 1) { n += NILAI[w[0]] * 100; w.splice(0, 2); }
  if (w.length === 0) return n;
  if (w.length === 1) return n + NILAI[w[0]];
  if (w.length === 2 && w[1] === 'belas') return n + 10 + NILAI[w[0]];
  if (w[1] === 'puluh') return n + NILAI[w[0]] * 10 + (w[2] ? NILAI[w[2]] : 0);
  throw new Error('tak terbaca: ' + t.join(' '));
}
function bacaKata(teks) {
  if (teks === 'nol') return 0;
  const w = teks.split(' ');
  const i = w.indexOf('ribu');
  if (w[0] === 'seribu') return 1000 + (w.length > 1 ? bacaTiga(w.slice(1)) : 0);
  if (i < 0) return bacaTiga(w);
  return bacaTiga(w.slice(0, i)) * 1000 + (i + 1 < w.length ? bacaTiga(w.slice(i + 1)) : 0);
}
for (let n = 0; n <= 100000; n++) {
  const k = B.kata(n);
  let balik; try { balik = bacaKata(k); } catch (e) { balik = -1; }
  if (balik !== n) cek(false, 'kata(' + n + ') = "' + k + '" terbaca ' + balik);
  if (/(^| )satu (ratus|puluh)|^satu ribu|sepuluh (belas|puluh)|satu belas|nol /.test(k) && n !== 0) cek(false, 'bentuk kata keliru: ' + k);
}
const KHUSUS = { 11: 'sebelas', 100: 'seratus', 1000: 'seribu', 10000: 'sepuluh ribu', 11011: 'sebelas ribu sebelas', 100000: 'seratus ribu', 30015: 'tiga puluh ribu lima belas',
  101: 'seratus satu', 1100: 'seribu seratus', 12000: 'dua belas ribu', 21000: 'dua puluh satu ribu', 62408: 'enam puluh dua ribu empat ratus delapan', 99999: 'sembilan puluh sembilan ribu sembilan ratus sembilan puluh sembilan', 2000: 'dua ribu', 110: 'seratus sepuluh', 15: 'lima belas' };
for (const n in KHUSUS) cek(B.kata(Number(n)) === KHUSUS[n], 'kata khusus ' + n + ': ' + B.kata(Number(n)));

// ---------- pembulatan: dua cara berbeda harus sama ----------
for (let n = 0; n <= 100000; n++) for (const p of [10, 100, 1000]) cek(B.bulatkan(n, p) === B.bulatkanTeks(n, p), 'bulatkan ' + n + '/' + p + ' ' + B.bulatkan(n, p) + ' vs ' + B.bulatkanTeks(n, p));
cek(B.bulatkan(34567, 1000) === 35000 && B.bulatkan(34500, 1000) === 35000 && B.bulatkan(34499, 1000) === 34000 && B.bulatkan(48265, 10) === 48270 && B.bulatkan(48264, 10) === 48260 && B.bulatkan(99960, 100) === 100000, 'bulatkan contoh');

const opsiBaik = (opsi, kunci, nama, maks) => {
  cek(opsi.length === 4, nama + ' harus 4 pilihan: ' + opsi);
  cek(new Set(opsi).size === opsi.length, nama + ' pilihan kembar: ' + opsi);
  cek(opsi.filter((o) => o === kunci).length === 1, nama + ' tepat satu benar: ' + opsi + ' kunci ' + kunci);
  opsi.forEach((o) => { cek(Number.isInteger(o) && o > 0 && o <= maks, nama + ' di luar batas: ' + o); cek(!/,/.test(B.fmt(o)), nama + ' format'); });
};

// ---------- Susun Angka ----------
const BATAS_S = { 1: 9999, 2: 99999, 3: 100000 };
for (const T of [1, 2, 3]) {
  let nolKata = 0, nolTotal = 0, pengecohNol = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = S.buatRonde(T);
    cek(ronde.length === 5, 'susun 5 soal');
    cek(ronde.slice(0, 3).map((s) => s.jenis).sort().join() === 'blok,kata,nilai' && ronde[3].jenis === 'susun' && ronde[4].jenis === 'susun', 'susun urutan jenis ' + ronde.map((s) => s.jenis));
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'susun soal tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => S.soalMirip(x, T)))) {
      cek(s.n <= BATAS_S[T] && s.n >= 1, 'susun n di luar batas ' + s.n);
      if (s.n < (T === 1 ? 1000 : 10000) && !(T === 3 && s.n === 100000)) cek(false, 'susun jumlah angka tidak sesuai tingkat ' + s.n);
      if (s.jenis === 'blok') {
        const dariBlok = Object.keys(s.hitung).reduce((t, k) => t + s.hitung[k] * Math.pow(10, Number(k)), 0);
        cek(dariBlok === s.kunci, 'blok jumlah ' + JSON.stringify(s.hitung) + ' != ' + s.kunci);
        opsiBaik(s.opsi, s.kunci, 'blok t' + T, BATAS_S[T]);
        nolTotal++;
        if (/0/.test(String(s.n).slice(1))) { nolKata++; if (s.opsi.some((o) => o !== s.kunci && String(o).length === String(s.n).length - 1)) pengecohNol++; }
      } else if (s.jenis === 'nilai') {
        opsiBaik(s.opsi, s.kunci, 'nilai t' + T, BATAS_S[T]);
        const st = String(s.n), idx = st.length - 1 - s.tempat;
        cek(Number(st[idx]) === s.digit && s.digit * Math.pow(10, s.tempat) === s.kunci, 'nilai kunci ' + s.n + ' tempat ' + s.tempat);
        cek(st.split('').filter((c) => c === String(s.digit)).length === 1, 'nilai angka muncul lebih dari sekali ' + s.n);
        cek(s.opsi.every((o) => o % s.digit === 0 && /^10*$/.test(String(o / s.digit))), 'nilai pengecoh bukan digit x tempat: ' + s.opsi);
      } else if (s.jenis === 'kata') {
        cek(bacaKata(s.kata) === s.kunci && s.kunci === s.n, 'kata->angka ' + s.kata + ' ' + s.n);
        opsiBaik(s.opsi, s.kunci, 'kata t' + T, BATAS_S[T]);
      } else {
        cek(s.jenis === 'susun' && s.kolom === (T === 1 ? 4 : 5), 'susun kolom');
        cek(/0/.test(String(s.n).slice(1)), 'susun harus ada nol di tengah ' + s.n);
        // satu-satunya susunan: digit demi digit, tiap tempat 0..9 -> jumlah = n
        const hitung = String(s.n).split('').reverse().map(Number);
        cek(S.periksaSusun(s, hitung).benar, 'susun jawaban digit tidak diterima ' + s.n);
        const salah = hitung.slice(); salah[0] = (salah[0] + 1) % 10;
        cek(!S.periksaSusun(s, salah).benar, 'susun jawaban salah diterima ' + s.n);
        cek(s.tampil === 'kata' || s.tampil === 'angka', 'susun tampil');
      }
    }
  }
  if (T >= 2) cek(nolKata / nolTotal > 0.6, 'susun t' + T + ' nol di tengah terlalu jarang ' + nolKata + '/' + nolTotal);
  if (nolKata > 20) cek(pengecohNol / nolKata > 0.5, 'susun t' + T + ' pengecoh "angka 0 hilang" terlalu jarang ' + pengecohNol + '/' + nolKata);
  console.log('Susun Angka tingkat ' + T + ': soal blok bernol ' + nolKata + '/' + nolTotal + ', pengecoh nol hilang ' + pengecohNol);
}

// ---------- Mana Lebih Besar ----------
const urutTeks = (a, b) => (a.length !== b.length ? Math.sign(a.length - b.length) : a < b ? -1 : a > b ? 1 : 0); // pembanding independen (teks)
for (const T of [1, 2, 3]) {
  const hitungTanda = { '-1': 0, '0': 0, '1': 0 };
  let nBentuk = 0, nPanjang = 0, nSama = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = M.buatRonde(T);
    cek(ronde.length === 5, 'banding 5 soal');
    cek(ronde.map((s) => s.jenis).join() === 'banding,banding,banding,urut,urut', 'banding urutan jenis');
    cek(new Set(ronde.slice(0, 3).map((s) => s.tanda)).size > 1, 'banding: tiga jawaban tidak boleh sama semua t' + T);
    cek(ronde[3].arah === 'kecil' && ronde[4].arah === 'besar', 'urut arah');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'banding soal tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => M.soalMirip(x, T)))) {
      if (s.jenis === 'banding') {
        cek(s.tanda === urutTeks(String(s.p), String(s.q)), 'banding tanda ' + s.p + ' ' + s.q + ' = ' + s.tanda);
        cek(Math.max(s.p, s.q) <= M.BATAS[T] && Math.min(s.p, s.q) >= 1000, 'banding batas ' + s.p + ' ' + s.q);
        if (T === 1) cek(String(s.p).length === 4 && String(s.q).length === 4 && !s.parts, 'banding t1 harus 4 angka: ' + s.p + ' ' + s.q);
        if (s.parts) {
          nBentuk++;
          cek(s.parts.reduce((t, x) => t + x, 0) === s.p, 'bentuk panjang jumlah ' + s.parts + ' != ' + s.p);
          cek(s.parts.every((x) => /^[1-9]0*$/.test(String(x))), 'bentuk panjang bagian ' + s.parts);
          cek(M.periksaBanding(s, s.tanda).benar && !M.periksaBanding(s, s.tanda === 0 ? 1 : 0).benar, 'bentuk periksa');
        }
        if (s.pola === 'panjang') { nPanjang++; cek(String(s.p).length !== String(s.q).length, 'panjang harus beda jumlah angka'); }
        if (s.tanda === 0) { nSama++; cek(s.parts, 'tanda "=" hanya untuk bentuk panjang'); }
        if (s.pola === 'angka' || s.pola === 'nol') {
          const kb = M.kolomBeda(s.p, s.q);
          if (T === 2 && s.kb != null) cek(kb === s.kb, 't2 kolom beda ' + kb + ' vs ' + s.kb);
          if (T === 3 && s.kb != null) cek(kb >= 3, 't3 kolom beda di puluhan/satuan: ' + s.p + ' ' + s.q + ' kb ' + kb);
        }
        hitungTanda[s.tanda]++;
      } else {
        cek(s.daftar.length === 4 && s.urut.length === 4 && new Set(s.daftar).size === 4, 'urut 4 bilangan berbeda');
        cek(s.daftar.slice().sort().join() === s.urut.slice().sort().join(), 'urut himpunan');
        const ref = s.daftar.map(String).sort((a, b) => (s.arah === 'kecil' ? urutTeks(a, b) : urutTeks(b, a))).map(Number);
        cek(ref.join() === s.urut.join(), 'urut kunci ' + s.daftar + ' ' + s.arah);
        cek(M.periksaUrut(s, s.urut).benar && !M.periksaUrut(s, s.daftar).benar && !M.periksaUrut(s, s.urut.slice().reverse()).benar, 'urut periksa');
        cek(s.daftar.every((x) => x <= M.BATAS[T] && x >= 1000 && String(x).length === (T === 1 ? 4 : 5)), 'urut batas ' + s.daftar);
        cek(s.daftar.some((x) => /0/.test(String(x).slice(1))), 'urut harus ada nol di tengah');
      }
    }
  }
  console.log('Mana Lebih Besar tingkat ' + T + ': < ' + hitungTanda['-1'] + ', = ' + hitungTanda['0'] + ', > ' + hitungTanda['1'] + ' (bentuk panjang ' + nBentuk + ', beda jumlah angka ' + nPanjang + ')');
  cek(hitungTanda['-1'] > 100 && hitungTanda['1'] > 100, 'banding tanda tidak seimbang t' + T);
  if (T >= 2) cek(nSama > 10, 'tanda "=" tidak pernah muncul t' + T);
}

// ---------- Bulatkan ----------
for (const T of [1, 2, 3]) {
  const p = K.TEMPAT_P[T];
  let naik = 0, turun = 0, lintas9 = 0, nBatas = 0, tepi = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(T);
    cek(ronde.map((s) => s.jenis).join() === 'bulat,bulat,bulat,batas,taksir', 'bulat urutan jenis');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'bulat soal tidak kembar');
    cek(ronde.slice(0, 3).some((s) => s.penentu >= 5) && ronde.slice(0, 3).some((s) => s.penentu < 5), 'bulat: harus ada yang naik dan yang turun');
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, T)))) {
      if (s.jenis === 'bulat') {
        const kunciLain = B.bulatkanTeks(s.n, p);
        cek(s.kunci === kunciLain, 'bulat kunci ' + s.n + ' ' + s.kunci + ' vs ' + kunciLain);
        opsiBaik(s.opsi, s.kunci, 'bulat t' + T, K.HASIL_MAX[T]);
        cek(s.n <= K.BATAS[T] && s.n >= 100, 'bulat n batas ' + s.n);
        cek(s.opsi.filter((o) => o % p === 0).length >= 3, 'bulat minimal 3 pilihan kelipatan ' + p + ': ' + s.opsi);
        const penentuTeks = Number(String(s.n)[String(s.n).length - (String(p).length - 1)]);
        cek(penentuTeks === s.penentu, 'bulat penentu ' + s.n);
        cek(s.opsi.includes(s.penentu >= 5 ? s.lo : s.hi), 'bulat: pengecoh "arah salah" harus ada ' + s.n + ' ' + s.opsi);
        if (s.penentu >= 5) naik++; else turun++;
        if (String(s.kunci).length > String(s.n).length || (s.kunci > s.lo && s.lo % (p * 10) === p * 9)) lintas9++;
      } else if (s.jenis === 'batas') {
        nBatas++;
        cek(s.opsi.length === 6 && new Set(s.opsi).size === 6, 'batas 6 pilihan berbeda ' + s.opsi);
        const himpunan = s.opsi.filter((o) => B.bulatkanTeks(o, p) === s.target);
        cek(himpunan.join() === s.kunciSet.join() && himpunan.length >= 2 && himpunan.length <= 3, 'batas himpunan benar ' + s.opsi + ' target ' + s.target + ' kunci ' + s.kunciSet + ' hitung ' + himpunan);
        cek(K.periksaBatas(s, himpunan).benar && !K.periksaBatas(s, himpunan.slice(1)).benar && !K.periksaBatas(s, himpunan.concat(s.opsi.filter((o) => !himpunan.includes(o)).slice(0, 1))).benar, 'batas periksa');
        cek(s.opsi.includes(s.dalamLo - 1) && s.opsi.includes(s.dalamHi + 1), 'batas: pengecoh tepat di luar batas harus ada ' + s.opsi);
        if (s.kunciSet.includes(s.dalamLo) || s.kunciSet.includes(s.dalamHi)) tepi++;
        cek(s.target % p === 0 && s.dalamLo === s.target - p / 2 && s.dalamHi === s.target + p / 2 - 1, 'batas dalamLo/dalamHi');
        cek(s.opsi.every((o) => o > 0 && o <= 100000), 'batas angka dalam batas');
      } else {
        const pr = s.p, rb = (x) => B.bulatkanTeks(x, pr);
        const kunciLain = s.minus ? rb(s.a) - rb(s.b) : rb(s.a) + rb(s.b);
        cek(s.kunci === kunciLain, 'taksir kunci ' + s.a + ' ' + s.b);
        cek(s.asli === (s.minus ? s.a - s.b : s.a + s.b) && s.asli !== s.kunci && s.opsi.includes(s.asli), 'taksir hasil asli harus jadi pengecoh yang berbeda dari kunci');
        opsiBaik(s.opsi, s.kunci, 'taksir t' + T, 100000);
        cek(s.a % pr !== 0 && s.b % pr !== 0, 'taksir angka tidak boleh sudah bulat');
        cek(!s.minus || T === 3, 'selisih hanya tingkat 3');
        cek(s.a <= 99999 && s.b <= 99999 && (s.minus ? s.a > s.b : s.a + s.b <= 100000), 'taksir batas');
      }
    }
  }
  console.log('Bulatkan tingkat ' + T + ': naik ' + naik + ', turun ' + turun + ', batas ' + nBatas + ' (kunci tepat di batas ' + tepi + ')');
  cek(naik > 100 && turun > 100, 'bulat naik/turun tidak seimbang');
  cek(tepi > nBatas * 0.3, 'batas: bilangan tepat di batas jarang muncul ' + tepi + '/' + nBatas);
}

// ---------- Bab 3-6 tetap lulus ----------
const { spawnSync } = require('child_process');
for (const n of [3, 4, 5, 6]) {
  const r = spawnSync(process.execPath, [require('path').join(__dirname, 'cek-bab' + n + '.js')], { encoding: 'utf8' });
  console.log('cek-bab' + n + '.js: ' + (r.status === 0 ? 'lulus' : 'GAGAL (kode ' + r.status + ')'));
  cek(r.status === 0, 'cek-bab' + n + ' gagal');
}

console.log(gagal ? '\nGAGAL: ' + gagal + ' pelanggaran' : '\nSemua cek Bab 1 lulus (Susun Angka, Mana Lebih Besar, Bulatkan!)');
process.exit(gagal ? 1 : 0);
