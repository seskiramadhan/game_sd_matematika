// Cek logika mini game Kelas 4 Bab 7 (Persentase): node tools/cek-bab7.js
// 200 ronde per tingkat per mini game. Jawaban dihitung ulang secara independen dari TEKS yang tampil
// (pecahan, desimal bertanda koma, persen) dengan bilangan bulat; tepat satu pilihan benar, tidak ada pilihan kembar,
// persen dari selalu bulat, format Indonesia (koma, % menempel, tidak ada titik desimal).
const Pn = require('../js/kelas-4/bab-7/persen.js');
const K = require('../js/kelas-4/bab-7/kotak-persen.js');
const T = require('../js/kelas-4/bab-7/tukar-persen.js');
const PD = require('../js/kelas-4/bab-7/persen-dari.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const persen = (x, n) => Math.round((100 * x) / n) + '%';

// ---- pembanding independen: teks -> pecahan [pembilang, penyebut] (bilangan bulat) ----
function dariTeks(t) {
  t = t.trim();
  if (t.endsWith('%')) { const [a, b] = dariTeks(t.slice(0, -1)); return [a, b * 100]; }
  if (t.includes('/')) { const [a, b] = t.split('/').map((x) => parseInt(x, 10)); return [a, b]; }
  const [bul, pec = ''] = t.split(',');
  return [parseInt(bul + pec, 10), Math.pow(10, pec.length)];
}
const sama = (x, y) => x[0] * y[1] === y[0] * x[1];
const tanpaTitik = (s, nama) => cek(!/\./.test(s), nama + ' memakai titik: ' + s);
const bentuk = (j, p) => Pn.teksBentuk(Pn.bentukDariPersen(j, p));

// ---- format ----
cek(Pn.teksMp(3700) === '37%' && Pn.teksMp(370) === '3,7%' && Pn.teksMp(37) === '0,37%' && Pn.teksMp(10000) === '100%' && Pn.teksMp(5000) === '50%' && Pn.teksMp(500) === '5%', 'teksMp');
cek(bentuk('d', 50) === '0,5' && bentuk('d', 5) === '0,05' && bentuk('d', 35) === '0,35' && bentuk('d', 100) === '1' && bentuk('d', 10) === '0,1', 'desimal persen');
cek(bentuk('f', 75) === '3/4' && bentuk('f', 5) === '1/20' && bentuk('f', 4) === '1/25', 'pecahan persen');
cek(Pn.ribuan(20000) === '20.000' && Pn.ribuan(150000) === '150.000' && Pn.ribuan(5000) === '5.000', 'ribuan');
for (let p = 1; p <= 100; p++) {
  tanpaTitik(bentuk('d', p), 'desimal');
  cek(sama(dariTeks(bentuk('d', p)), [p, 100]), 'desimal = persen ' + p);
  cek(sama(dariTeks(bentuk('f', p)), [p, 100]), 'pecahan = persen ' + p);
}

// ================= Kotak Persen =================
for (const t of [1, 2, 3]) {
  let nSisa = 0, nSisaTrap = 0, nBaca = 0, nTrapSisa = 0, nTrapPersepuluh = 0, n1 = 0, n100 = 0, nWarnai = 0, nTrapBisa = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(t);
    cek(ronde.length === 5, 'kotak 5 soal');
    cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size > 1, 'kotak jawaban 1-3 tidak boleh sama semua t' + t);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'kotak kode kembar t' + t);
    const urut = t < 3 ? 'baca baca baca warnai warnai' : 'baca sisa baca warnai warnai';
    cek(ronde.map((s) => s.jenis).join(' ') === urut, 'kotak urutan jenis ' + ronde.map((s) => s.jenis));
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, t)))) {
      cek(Number.isInteger(s.p) && s.p >= 1 && s.p <= 100, 'kotak p bulat');
      if (t === 1) cek(s.p % 10 === 0 && s.p <= 90, 'kotak t1 kelipatan 10: ' + s.p);
      if (t === 2) cek(s.p >= 1 && s.p <= 99, 'kotak t2 batas ' + s.p);
      if (s.jenis === 'warnai') {
        nWarnai++;
        cek(s.kunci === s.p && K.periksaWarnai(s, s.p).benar && !K.periksaWarnai(s, s.p + 1).benar && !K.periksaWarnai(s, s.p - 1).benar, 'kotak periksaWarnai');
        if (s.p === 100) n100++;
        continue;
      }
      nBaca++;
      const tak = s.jenis === 'sisa';
      const benarP = tak ? 100 - s.p : s.p;
      cek(s.opsi.length === 4, 'kotak 4 pilihan');
      const teksO = s.opsi.map(Pn.teksBentuk);
      cek(new Set(teksO).size === 4, 'kotak pilihan kembar ' + teksO);
      cek(s.opsi.filter((o) => sama(dariTeks(Pn.teksBentuk(o)), [benarP, 100])).length === 1, 'kotak tepat satu benar ' + teksO + ' kunci ' + benarP);
      cek(s.opsi.every((o) => sama(dariTeks(Pn.teksBentuk(o)), [benarP, 100]) === K.periksaPilih(s, o).benar), 'kotak pemeriksa sama dengan hitungan independen');
      cek(s.opsi.filter((o) => o.salah).length === 3, 'kotak 3 pengecoh');
      teksO.forEach((x) => { tanpaTitik(x, 'kotak'); cek(/^\d+(,\d+)?%$/.test(x), 'kotak format % menempel ' + x); });
      if (tak) {
        nSisa++;
        if (teksO.includes(s.p + '%')) nSisaTrap++; // jebakan: persen yang berwarna
        cek(s.p >= 11 && s.p <= 89, 'kotak sisa p');
      } else {
        if (s.p >= 11 && s.p < 100) {
          nTrapBisa++;
          if (teksO.includes((100 - s.p) + '%')) nTrapSisa++; // 63% untuk 37%
          if (teksO.includes(Pn.teksMp(s.p * 10))) nTrapPersepuluh++; // 3,7% untuk 37%
        }
        if (s.p === 1) n1++;
        if (s.p === 100) n100++;
      }
    }
  }
  if (t === 3) cek(n1 + n100 > 0 && nSisa >= RONDE, 'kotak t3 harus memuat 1%/100% dan soal sisa (n1=' + n1 + ', n100=' + n100 + ', sisa=' + nSisa + ')');
  if (t === 3) cek(nSisaTrap > nSisa * 0.5, 'kotak sisa: jebakan "yang berwarna" kurang sering ' + nSisaTrap + '/' + nSisa);
  cek(nTrapSisa > nTrapBisa * 0.8 && nTrapPersepuluh > nTrapBisa * 0.8 || t === 1, 'kotak pengecoh 63% & 3,7% harus hampir selalu ada t' + t + ' (' + nTrapSisa + ', ' + nTrapPersepuluh + ' / ' + nTrapBisa + ')');
  console.log('Kotak Persen t' + t + ': ' + nBaca + ' baca (p>=11: ' + nTrapBisa + ', pengecoh bagian tak berwarna ' + persen(nTrapSisa, nTrapBisa || 1) + ', "3,7%" ' + persen(nTrapPersepuluh, nTrapBisa || 1) + '), ' + nWarnai + ' warnai, 1%: ' + n1 + ', 100%: ' + n100 + ', sisa: ' + nSisa);
}

// ================= Tukar Bentuk =================
const POLA = { p: /^\d+(,\d+)?%$/, f: /^\d+\/\d+$/, d: /^\d+(,\d+)?$/ };
for (const t of [1, 2, 3]) {
  const pairSet = {}; let nTukar = 0, nIsi = 0, trap05 = 0, trap5 = 0, n05 = 0, n50 = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = T.buatRonde(t);
    cek(ronde.length === 5, 'tukar 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'tukar') && ronde.slice(3).every((s) => s.jenis === 'isi'), 'tukar urutan jenis');
    cek(new Set(ronde.slice(0, 3).map((s) => Pn.teksBentuk(s.kunci))).size > 1, 'tukar jawaban 1-3 tidak boleh sama semua');
    cek(new Set(ronde.slice(0, 3).map((s) => s.p)).size === 3, 'tukar p 1-3 harus berbeda');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'tukar kode kembar');
    if (t < 3) cek(ronde.slice(0, 3).every((s) => s.dari === 'p' || s.ke === 'p'), 'tukar t1-2 selalu melibatkan persen');
    for (const s of ronde.concat(ronde.map((x) => T.soalMirip(x, t)))) {
      const p = s.p;
      cek(Number.isInteger(p) && p >= 1 && p <= 99, 'tukar p bulat');
      cek((t === 1 ? [10, 25, 50, 75] : t === 2 ? T.L2 : T.L3).includes(p), 'tukar p dalam tingkat ' + p);
      cek(s.opsi.length === 4, 'tukar 4 pilihan');
      if (s.jenis === 'tukar') {
        nTukar++;
        pairSet[s.dari + '>' + s.ke] = 1;
        const src = Pn.teksBentuk(s.sumber);
        cek(POLA[s.dari].test(src), 'tukar bentuk sumber ' + s.dari + ': ' + src);
        cek(s.dari !== s.ke, 'tukar dari != ke');
        const teksO = s.opsi.map(Pn.teksBentuk);
        cek(new Set(teksO).size === 4, 'tukar pilihan kembar ' + teksO);
        cek(teksO.every((x) => POLA[s.ke].test(x)), 'tukar semua pilihan satu bentuk ' + s.ke + ': ' + teksO);
        teksO.forEach((x) => tanpaTitik(x, 'tukar'));
        tanpaTitik(src, 'tukar');
        cek(s.opsi.filter((o) => sama(dariTeks(Pn.teksBentuk(o)), dariTeks(src))).length === 1, 'tukar tepat satu benar: ' + src + ' -> ' + teksO);
        cek(s.opsi.every((o) => sama(dariTeks(Pn.teksBentuk(o)), dariTeks(src)) === T.periksaPilih(s, o).benar), 'tukar pemeriksa');
        cek(sama(dariTeks(src), [p, 100]), 'tukar sumber = p%');
        cek(s.opsi.filter((o) => o.salah).length === 3, 'tukar 3 pengecoh');
        if (s.dari === 'p' && s.ke === 'd' && p === 5) { n05++; if (teksO.includes('0,5')) trap05++; }
        if (s.dari === 'd' && s.ke === 'p' && p === 50) { n50++; if (teksO.includes('5%')) trap5++; }
      } else {
        nIsi++;
        cek(['fp', 'dp', 'pb'].includes(s.sub), 'isi sub');
        if (s.sub === 'pb') {
          cek(Number.isInteger(s.a) && (p * s.b) % 100 === 0 && s.a === (p * s.b) / 100 && s.kunci === s.a, 'isi pb pembilang bulat p=' + p + ' b=' + s.b);
          const v = s.opsi.map((o) => o.v);
          cek(new Set(v).size === 4 && v.every((x) => Number.isInteger(x) && x > 0), 'isi pb pilihan unik & bulat ' + v);
          cek(v.filter((x) => x * 100 === p * s.b).length === 1, 'isi pb tepat satu benar');
          cek(s.opsi.every((o) => (o.v * 100 === p * s.b) === T.periksaPilih(s, o).benar), 'isi pb pemeriksa');
        } else {
          const src = Pn.teksBentuk(s.sumber);
          tanpaTitik(src, 'isi');
          cek(s.sub === 'fp' ? POLA.f.test(src) : POLA.d.test(src), 'isi bentuk sumber ' + src);
          const teksO = s.opsi.map(Pn.teksBentuk);
          cek(new Set(teksO).size === 4 && teksO.every((x) => POLA.p.test(x)), 'isi pilihan persen unik ' + teksO);
          cek(s.opsi.filter((o) => sama(dariTeks(Pn.teksBentuk(o)), dariTeks(src))).length === 1, 'isi tepat satu benar ' + src + ' ' + teksO);
          cek(s.opsi.every((o) => sama(dariTeks(Pn.teksBentuk(o)), dariTeks(src)) === T.periksaPilih(s, o).benar), 'isi pemeriksa');
        }
      }
    }
  }
  const nama = Object.keys(pairSet).sort().join(',');
  cek(t === 3 ? nama === 'd>f,d>p,f>d,f>p,p>d,p>f' : nama === 'd>p,f>p,p>d,p>f', 'tukar pasangan arah t' + t + ': ' + nama);
  if (t >= 2) cek(trap05 === n05 && trap5 === n50, 'tukar jebakan 5%<->0,5 harus selalu ada: ' + trap05 + '/' + n05 + ', ' + trap5 + '/' + n50);
  console.log('Tukar Bentuk t' + t + ': ' + nTukar + ' tukar, ' + nIsi + ' isi, arah: ' + nama + ', 5%->0,5 jebakan ' + trap05 + '/' + n05 + ', 0,5->5% jebakan ' + trap5 + '/' + n50);
}

// ================= Persen dari =================
for (const t of [1, 2, 3]) {
  let nModel = 0, nCerita = 0; const bs = [], ps = new Set();
  for (let r = 0; r < RONDE; r++) {
    const ronde = PD.buatRonde(t);
    cek(ronde.length === 5, 'dari 5 soal');
    cek(ronde.slice(0, 3).every((s) => s.jenis === 'model') && ronde.slice(3).every((s) => s.jenis === 'cerita'), 'dari urutan jenis');
    cek(new Set(ronde.slice(0, 3).map((s) => s.kunci)).size > 1, 'dari jawaban 1-3 tidak boleh sama semua');
    cek(new Set(ronde.slice(3).map((s) => s.cerita)).size === 2, 'dari dua cerita berbeda');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'dari kode kembar');
    for (const s of ronde.concat(ronde.map((x) => PD.soalMirip(x, t)))) {
      const { p, b } = s;
      cek(PD.PERSEN[t].includes(p), 'dari p dalam tingkat ' + t + ': ' + p);
      cek(Number.isInteger(b) && Number.isInteger(p), 'dari bulat');
      cek((p * b) % 100 === 0, 'dari hasil harus bulat: ' + p + '% dari ' + b);
      // hitung ulang tanpa rumus yang sama: tambahkan b sebanyak p kali lalu bagi 100 (penjumlahan berulang)
      let jumlah = 0; for (let i = 0; i < p; i++) jumlah += b;
      const hasil = jumlah / 100;
      cek(Number.isInteger(hasil) && s.kunci === hasil && hasil >= 1, 'dari kunci ' + p + '% dari ' + b + ' = ' + hasil + ' (kode ' + s.kunci + ')');
      cek(s.opsi.length === 4, 'dari 4 pilihan');
      const v = s.opsi.map((o) => o.v);
      cek(new Set(v).size === 4 && v.every((x) => Number.isInteger(x) && x > 0), 'dari pilihan unik & bulat ' + v);
      cek(v.filter((x) => x === hasil).length === 1, 'dari tepat satu benar');
      cek(s.opsi.every((o) => (o.v === hasil) === PD.periksaPilih(s, o).benar), 'dari pemeriksa');
      cek(s.opsi.filter((o) => o.salah).length === 3, 'dari 3 pengecoh');
      if (s.jenis === 'model') { nModel++; cek(b >= (t === 1 ? 10 : 20) && b <= 200, 'dari model b ' + b); }
      else {
        nCerita++;
        const C = PD.CERITA[s.cerita];
        cek(b >= C.lo && b <= C.hi, 'dari cerita b ' + s.cerita + ' ' + b);
      }
      ps.add(p); bs.push(b);
    }
  }
  cek(ps.size === PD.PERSEN[t].length, 'dari semua persen tingkat ' + t + ' muncul');
  console.log('Persen dari t' + t + ': ' + nModel + ' model, ' + nCerita + ' cerita, persen ' + [...ps].sort((a, b) => a - b).join('/') + ', banyak ' + Math.min(...bs) + '-' + Math.max(...bs));
}

console.log(gagal ? gagal + ' GAGAL' : 'Semua cek Bab 7 lulus.');
process.exit(gagal ? 1 : 0);
