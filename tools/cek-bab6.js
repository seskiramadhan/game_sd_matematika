// Cek logika mini game Kelas 4 Bab 6 (Desimal): node tools/cek-bab6.js
// 200 ronde per tingkat per mini game: tepat satu jawaban benar, tidak ada pilihan kembar/senilai,
// angka dalam batas tingkat, pengecoh wajib ada, format koma Indonesia (tidak pernah titik).
const D = require('../js/kelas-4/bab-6/desimal.js');
const K = require('../js/kelas-4/bab-6/kotak-seratus.js');
const G = require('../js/kelas-4/bab-6/garis-desimal.js');
const M = require('../js/kelas-4/bab-6/mana-lebih-besar.js');
const { teks, senilai, des, mil } = D;
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 400) console.log('GAGAL:', pesan); } };
const RONDE = 200;
// pembanding independen: dari teks "a,b" -> perseribuan (bilangan bulat), tanpa memakai mil()
const dariTeks = (t) => { const [a, b = ''] = t.split(','); return parseInt(a, 10) * 1000 + parseInt((b + '000').slice(0, 3), 10); };
const bandingTeks = (a, b) => Math.sign(dariTeks(a) - dariTeks(b));
const persen = (x, n) => Math.round((100 * x) / n) + '%';

// ---------- format & alat dasar ----------
cek(teks(des(75, 2)) === '0,75', 'fmt 0,75');
cek(teks(des(205, 2)) === '2,05', 'fmt 2,05');
cek(teks(des(60, 2)) === '0,60', 'fmt 0,60 (nol di belakang dipertahankan)');
cek(teks(des(6, 1)) === '0,6', 'fmt 0,6');
cek(teks(des(3, 3)) === '0,003', 'fmt 0,003');
cek(teks(des(1355, 3)) === '1,355', 'fmt 1,355');
cek(senilai(des(6, 1), des(60, 2)) && senilai(des(5, 1), des(500, 3)), '0,6 = 0,60');
cek(!senilai(des(205, 2), des(25, 1)), '2,05 != 2,5');
cek(teks(D.minimal(750)) === '0,75' && teks(D.minimal(600)) === '0,6' && teks(D.minimal(2050)) === '2,05' && teks(D.minimal(1250)) === '1,25', 'minimal');
cek(teks(D.dariPecahan(3, 4)) === '0,75' && teks(D.dariPecahan(2, 5)) === '0,4' && teks(D.dariPecahan(7, 20)) === '0,35' && teks(D.dariPecahan(1, 2)) === '0,5', 'pecahan -> desimal');
const tanpaTitik = (s, nama) => cek(!/\./.test(s), nama + ' memakai titik: ' + s);
for (let n = 1; n <= 999; n++) for (const d of [1, 2, 3]) tanpaTitik(teks(des(n, d)), 'teks');

const opsiBaik = (opsi, kunci, nama) => {
  cek(opsi.length === 4, nama + ' harus 4 pilihan: ' + opsi.map(teks));
  cek(opsi.filter((o) => senilai(o, kunci)).length === 1, nama + ' tepat satu benar: ' + opsi.map(teks) + ' kunci ' + teks(kunci));
  for (let i = 0; i < opsi.length; i++) for (let j = i + 1; j < opsi.length; j++) {
    cek(!senilai(opsi[i], opsi[j]), nama + ' pilihan senilai: ' + teks(opsi[i]) + ' & ' + teks(opsi[j]));
    cek(teks(opsi[i]) !== teks(opsi[j]), nama + ' pilihan kembar');
  }
  opsi.forEach((o) => tanpaTitik(teks(o), nama));
  cek(opsi.filter((o) => o.salah).length === 3, nama + ' butuh 3 pengecoh');
};

// ---------- Kotak Seratus ----------
for (const T of [1, 2, 3]) {
  let nPecah = 0, nWarnai = 0, nBaca = 0, nLengkap = 0, nBacaT2 = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(T);
    cek(ronde.length === 5, 'kotak 5 soal');
    const urutJenis = T < 3 ? 'baca baca baca warnai warnai' : 'pecahan pecahan baca warnai warnai';
    cek(ronde.map((s) => s.jenis).join(' ') === urutJenis, 'kotak urutan jenis t' + T + ': ' + ronde.map((s) => s.jenis));
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'kotak soal tidak kembar t' + T);
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, T)))) {
      if (s.jenis === 'baca' || s.jenis === 'pecahan') {
        nBaca++;
        opsiBaik(s.opsi, s.kunci, 'kotak t' + T);
        if (s.jenis === 'baca') {
          if (s.bentuk === 'pita') { cek(s.n >= 1 && s.n <= 9 && mil(s.kunci) === s.n * 100, 'kotak pita n/kunci'); }
          else {
            cek(s.n >= 11 && s.n <= 99 && s.n % 10 !== 0 && mil(s.kunci) === s.n * 10, 'kotak seratus n/kunci ' + s.n);
            nBacaT2++;
            // pengecoh khas: 3,7 / 0,307 / 0,73 (bila angkanya berbeda)
            const a = Math.floor(s.n / 10), b = s.n % 10, tk = s.opsi.map(teks);
            if (a !== b && b !== 0) {
              const ada = [a + ',' + b, '0,' + a + '0' + b, '0,' + b + a].every((x) => tk.includes(x));
              if (ada) nLengkap++; else cek(false, 'kotak pengecoh khas hilang untuk ' + teks(s.kunci) + ': ' + tk);
            }
          }
        } else {
          cek(100 % s.b === 0 && Number.isInteger(s.n) && s.n === (s.a * 100) / s.b, 'kotak pecahan n');
          cek(D.mil(s.kunci) === (s.a * 1000) / s.b && s.a < s.b && K.PECAHAN.some((p) => p[0] === s.a && p[1] === s.b), 'kotak pecahan kunci ' + s.a + '/' + s.b);
          nPecah++;
        }
        cek(!K.periksaPilih(s, s.opsi.find((o) => !senilai(o, s.kunci))).benar && K.periksaPilih(s, s.kunci).benar, 'kotak periksaPilih');
      } else {
        nWarnai++;
        const maks = s.bentuk === 'pita' ? 9 : 99;
        cek(s.n >= 1 && s.n <= maks, 'kotak warnai batas n=' + s.n);
        cek(K.periksaWarnai(s, s.n).benar && !K.periksaWarnai(s, s.n + 1).benar && !K.periksaWarnai(s, s.n - 1).benar, 'kotak periksaWarnai');
        if (s.a) cek(s.n === (s.a * 100) / s.b && mil(s.kunci) === (s.a * 1000) / s.b, 'kotak warnai pecahan ' + s.a + '/' + s.b);
        else cek(mil(s.kunci) === (s.bentuk === 'pita' ? s.n * 100 : s.n * 10), 'kotak warnai kunci');
      }
      cek(s.tingkat === T, 'kotak tingkat soal');
    }
  }
  console.log('Kotak Seratus t' + T + ': ' + nBaca + ' soal pilih (pengecoh khas lengkap ' + nLengkap + '/' + nBacaT2 + '), ' + nWarnai + ' soal warnai, ' + nPecah + ' pecahan');
}

// ---------- Garis Desimal ----------
for (const T of [1, 2, 3]) {
  const batas = G.BATAS[T];
  let nKetuk = 0, nBaca = 0, nDrill = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = G.buatRonde(T);
    cek(ronde.map((s) => s.jenis).join(' ') === 'ketuk ketuk ketuk baca baca', 'garis urutan jenis t' + T);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'garis soal tidak kembar t' + T);
    for (const s of ronde.concat(ronde.map((x) => G.soalMirip(x, T)))) {
      cek(s.tingkat === T, 'garis tingkat soal');
      const m = s.mil;
      cek(m > 0 && m < batas, 'garis di luar batas: ' + m);
      if (s.jenis === 'ketuk') {
        nKetuk++;
        if (T === 1) cek(m % 100 === 0 && s.d === 1, 'garis t1 persepuluhan ' + m);
        else cek(m % 10 === 0 && m % 100 !== 0 && s.d === 2, 'garis t2/3 perseratusan bukan kelipatan 0,1: ' + m);
        if (T === 2) cek(m > 100, 'garis t2 > 0,1');
        cek(mil(s.kunci) === m, 'garis kunci ketuk');
        // simulasi ketuk bertahap: selalu ada tepat satu bagian yang memuat m, berakhir di tik tepat m
        let r0 = { lo: 0, hi: batas }, langkah = 0;
        for (;;) {
          const th = G.tahap(r0, s.d);
          const sel = (r0.hi - r0.lo) / th.bagian;
          cek(Number.isInteger(sel) && th.bagian >= 2 && th.bagian <= 10, 'garis tahap bagian ' + th.bagian);
          if (th.akhir) {
            const ada = []; for (let i = 0; i <= th.bagian; i++) ada.push(r0.lo + i * sel);
            cek(ada.includes(m), 'garis tik akhir memuat nilai ' + m + ' di ' + ada);
            cek(ada.filter((x) => G.periksaKetuk(s, x).benar).length === 1, 'garis tepat satu tik benar');
            break;
          }
          const i = Math.floor((m - r0.lo) / sel);
          cek(m % sel !== 0, 'garis nilai jatuh di batas bagian ' + m);
          r0 = { lo: r0.lo + i * sel, hi: r0.lo + (i + 1) * sel };
          if (++langkah > 5) { cek(false, 'garis tahap tak berujung'); break; }
        }
        nDrill += langkah;
        const rt = G.rantai(m, s.d);
        cek(rt.length === (s.d === 1 ? 1 : 2) && rt.every((x) => m >= x.lo && m <= x.hi), 'garis rantai zoom ' + JSON.stringify(rt));
      } else {
        nBaca++;
        opsiBaik(s.opsi, s.kunci, 'garis t' + T);
        cek(s.titik.length === 3 && new Set(s.titik).size === 3, 'garis 3 titik beda');
        cek(s.titik[s.tanya] === m, 'garis indeks tanya');
        cek(s.titik.every((v, i) => i === 0 || v > s.titik[i - 1]), 'garis titik terurut');
        for (let i = 1; i < 3; i++) cek(s.titik[i] - s.titik[i - 1] >= G.SELANG[T], 'garis label bertumpuk: ' + s.titik);
        s.titik.forEach((v) => cek(v > 0 && v < batas, 'garis titik batas'));
        if (T === 3) cek(m % 100 === 50, 'garis t3 titik tanya di tengah tik: ' + m);
        if (T === 2) cek(m % 100 !== 0 && m % 10 === 0, 'garis t2 titik tanya');
        if (T === 1) cek(m % 100 === 0, 'garis t1 titik tanya');
        cek(mil(s.kunci) === m, 'garis kunci baca');
      }
    }
  }
  console.log('Garis Desimal t' + T + ': ' + nKetuk + ' soal ketuk (rata-rata ' + (nDrill / nKetuk).toFixed(2) + ' zoom), ' + nBaca + ' soal baca');
}

// ---------- Mana Lebih Besar ----------
for (const T of [1, 2, 3]) {
  let nBanding = 0, nPanjang = 0, nSama = 0, nNol = 0, nUrut = 0, nJebakUrut = 0;
  const dMaks = { 1: 1, 2: 2, 3: 3 }[T];
  for (let r = 0; r < RONDE; r++) {
    const ronde = M.buatRonde(T);
    cek(ronde.map((s) => s.jenis).join(' ') === 'banding banding banding urut urut', 'mana urutan jenis t' + T);
    cek(new Set(ronde.slice(0, 3).map((s) => s.tanda)).size > 1, 'mana jawaban 1-3 tidak boleh semua sama t' + T);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'mana soal tidak kembar');
    if (T === 2) cek(ronde[0].pola === 'panjang', 'mana t2 soal 1 = jebakan angka panjang');
    for (const s of ronde.concat(ronde.map((x) => M.soalMirip(x, T)))) {
      if (s.jenis === 'banding') {
        nBanding++;
        const a = teks(s.p), b = teks(s.q);
        tanpaTitik(a + b, 'mana');
        cek(s.p.d <= dMaks && s.q.d <= dMaks && s.p.d >= 1 && s.q.d >= 1, 'mana banyak angka t' + T + ': ' + a + ' ' + b);
        cek(Math.floor(mil(s.p) / 1000) <= 4 && Math.floor(mil(s.q) / 1000) <= 4, 'mana bagian utuh terlalu besar');
        cek(a !== b, 'mana soal kembar ' + a);
        cek(bandingTeks(a, b) === s.tanda, 'mana tanda salah ' + a + ' ' + b + ' ' + s.tanda);
        const benar = [-1, 0, 1].filter((t) => M.periksaBanding(s, t).benar);
        cek(benar.length === 1 && benar[0] === s.tanda, 'mana tepat satu tanda benar');
        if (s.tanda === 0) { nSama++; cek(s.pola.startsWith('sama'), 'mana "=" hanya untuk jenis sama'); }
        if (T >= 2) {
          if (s.p.d !== s.q.d && ((s.p.d < s.q.d) === (s.tanda > 0))) nPanjang++; // yang lebih panjang malah lebih kecil
          if (s.pola.startsWith('nol')) nNol++;
        }
        if (T === 1) cek(s.pola === 'acak1', 'mana t1 pola');
      } else {
        nUrut++;
        cek(s.daftar.length >= (T === 1 ? 4 : 3) && s.daftar.length <= 4, 'mana urut jumlah ' + s.daftar.length);
        const tk = s.daftar.map(teks);
        cek(new Set(tk).size === tk.length, 'mana urut teks kembar');
        for (let i = 0; i < s.daftar.length; i++) for (let j = i + 1; j < s.daftar.length; j++) cek(!senilai(s.daftar[i], s.daftar[j]), 'mana urut nilai senilai ' + tk);
        s.daftar.forEach((x) => { cek(x.d >= 1 && x.d <= dMaks, 'mana urut digit ' + teks(x)); tanpaTitik(teks(x), 'mana'); cek(teks(x).slice(-1) !== '0', 'mana urut tanpa nol di belakang ' + teks(x)); });
        // urutan benar dihitung ulang dengan pembanding teks
        const hitung = tk.slice().sort((x, y) => bandingTeks(x, y));
        cek(s.urut.map(teks).join() === hitung.join(), 'mana urut kunci ' + hitung);
        cek(!M.sudahUrut(s.daftar), 'mana urut tidak boleh sudah urut');
        cek(M.periksaUrut(s, s.urut).benar && !M.periksaUrut(s, s.daftar).benar, 'mana periksaUrut');
        if (T >= 2) { // ada pasangan "lebih panjang tapi lebih kecil"
          let jebak = false;
          for (const x of s.daftar) for (const y of s.daftar) if (x.d < y.d && mil(x) > mil(y)) jebak = true;
          if (jebak) nJebakUrut++; else cek(false, 'mana urut tanpa jebakan ' + tk);
        }
      }
    }
  }
  console.log('Mana Lebih Besar t' + T + ': ' + nBanding + ' banding (angka panjang-tapi-kecil ' + persen(nPanjang, nBanding) + ', "=" ' + persen(nSama, nBanding) + ', pola nol ' + persen(nNol, nBanding) + '), ' + nUrut + ' urut (jebakan ' + nJebakUrut + ')');
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 6 lulus.');
process.exit(gagal ? 1 : 0);
