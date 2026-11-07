// Cek logika mini game Kelas 4 Bab 2 (Perkalian & Pembagian): node tools/cek-bab2.js
// 200 ronde per tingkat per mini game (+ soal "mirip" untuk ulangan): kunci benar (dihitung dengan cara lain: BigInt / penjumlahan berulang),
// pengecoh tidak sama dengan kunci, tidak ada pilihan kembar, hasil <= 100.000, format titik ribuan, bobot angka 6/7/8/12 sekitar 70%.
const H = require('../js/kelas-4/bab-2/hitung.js');
const T = require('../js/kelas-4/bab-2/tabel-kilat.js');
const K = require('../js/kelas-4/bab-2/kali-kotak.js');
const B = require('../js/kelas-4/bab-2/bagi-bersusun.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 300) console.log('GAGAL:', pesan); } };
const RONDE = 200;
const kali = (a, b) => Number(BigInt(a) * BigInt(b));            // pembanding independen
const kaliUlang = (a, b) => { let t = 0; for (let i = 0; i < b; i++) t += a; return t; }; // penjumlahan berulang
const bagiBig = (a, b) => [Number(BigInt(a) / BigInt(b)), Number(BigInt(a) % BigInt(b))];

// ---------- format & pembuat pilihan ----------
cek(H.fmt(0) === '0' && H.fmt(999) === '999' && H.fmt(2800) === '2.800' && H.fmt(98901) === '98.901' && H.fmt(100000) === '100.000', 'fmt');
for (let n = 0; n <= 100000; n += 13) cek(!/,/.test(H.fmt(n)) && Number(H.fmt(n).replace(/\./g, '')) === n, 'fmt balik ' + n);
cek(H.nolDepan(2800) === 28 && H.banyakNol(2800) === 2 && H.nolDepan(7) === 7 && H.banyakNol(7) === 0, 'nolDepan/banyakNol');
for (let i = 0; i < 2000; i++) {
  const k = H.acak(2, 5000), { opsi, sebab } = H.buatOpsi(k, [{ s: 'a', v: [k + 1, k - 1] }, { s: 'b', v: [k + 10] }], [k + 2, k - 2, k + 3]);
  cek(opsi.length === 4 && new Set(opsi).size === 4 && opsi.filter((o) => o === k).length === 1 && !(k in sebab), 'buatOpsi');
}

const opsiBaik = (opsi, kunci, nama, maks, min) => {
  cek(opsi.length === 4, nama + ' harus 4 pilihan: ' + opsi);
  cek(new Set(opsi).size === opsi.length, nama + ' pilihan kembar: ' + opsi);
  cek(opsi.filter((o) => o === kunci).length === 1, nama + ' tepat satu benar: ' + opsi + ' kunci ' + kunci);
  opsi.forEach((o) => { cek(Number.isInteger(o) && o >= (min == null ? 1 : min) && o <= maks, nama + ' di luar batas: ' + o); cek(!/,/.test(H.fmt(o)), nama + ' format'); });
};
const sebabBaik = (sebab, opsi, kunci, nama) => {
  opsi.filter((o) => o !== kunci).forEach((o) => cek(typeof sebab[o] === 'string', nama + ' pengecoh tanpa sebab ' + o));
  cek(!(kunci in sebab), nama + ' kunci tidak boleh punya sebab');
};

// ---------- Tabel Kilat ----------
for (const Tg of [1, 2, 3]) {
  let nFakta = 0, fokusFakta = 0, nNol = 0, fokusNol = 0, ada11 = 0, nLupaNol = 0, nLebihNol = 0, nSoal = 0, nKel = 0, fokusKel = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = T.buatRonde(Tg);
    cek(ronde.length === 5, 'tabel 5 soal');
    const jenis = ronde.map((s) => s.jenis).join();
    cek(jenis === (Tg === 3 ? 'nol,nol,nol,nol,keluarga' : 'fakta,fakta,fakta,nol,keluarga'), 'tabel urutan jenis t' + Tg + ' ' + jenis);
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'tabel soal tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => T.soalMirip(x, Tg)))) {
      nSoal++;
      cek(s.tingkat === Tg, 'tingkat');
      if (s.jenis === 'fakta') {
        nFakta++; if (H.adaFokus(s.a, s.b)) fokusFakta++;
        cek(s.kunci === kaliUlang(s.a, s.b) && s.kunci === kali(s.a, s.b), 'fakta kunci ' + s.a + 'x' + s.b);
        cek(s.a >= 2 && s.b >= 2 && Math.max(s.a, s.b) <= (Tg === 1 ? 10 : 12), 'fakta batas t' + Tg + ' ' + s.a + ' ' + s.b);
        if (s.a === 11 || s.b === 11) ada11++;
        opsiBaik(s.opsi, s.kunci, 'fakta t' + Tg, 200); sebabBaik(s.sebab, s.opsi, s.kunci, 'fakta');
        cek(T.periksa(s, s.kunci).benar && s.opsi.filter((o) => T.periksa(s, o).benar).length === 1, 'fakta periksa');
        const p = T.pecah(s.a, s.b);
        cek(p.hasilP + p.hasilR === s.kunci && p.p + p.r === p.besar && p.p >= 1 && p.r >= 0, 'trik pecah ' + s.a + 'x' + s.b);
      } else if (s.jenis === 'nol') {
        nNol++; if (H.adaFokus(s.d, s.m)) fokusNol++;
        const dua = Number(String(s.d * s.m) + '0'.repeat(s.k));
        cek(s.kunci === dua && s.kunci === kali(s.a, s.m) && s.a === Number(String(s.d) + '0'.repeat(s.k)), 'nol kunci ' + s.a + 'x' + s.m);
        cek(s.kunci <= 100000 && s.k === (Tg === 1 ? 1 : Tg === 2 ? 2 : s.k) && (Tg !== 3 || s.k === 2 || s.k === 3), 'nol batas/tempat t' + Tg);
        opsiBaik(s.opsi, s.kunci, 'nol t' + Tg, 100000); sebabBaik(s.sebab, s.opsi, s.kunci, 'nol');
        if (s.opsi.includes(s.inti * Math.pow(10, s.k - 1))) nLupaNol++;
        if (s.opsi.includes(s.inti * Math.pow(10, s.k + 1)) || s.inti * Math.pow(10, s.k + 1) > 100000) nLebihNol++;
        cek(s.opsi.includes(s.inti * Math.pow(10, s.k - 1)), 'nol: pengecoh lupa nol harus ada ' + s.a + 'x' + s.m + ' ' + s.opsi);
        cek(s.opsi.includes(s.inti * Math.pow(10, s.k + 1)) || s.inti * Math.pow(10, s.k + 1) > 100000, 'nol: pengecoh nol kelebihan harus ada');
      } else {
        nKel++; if (H.adaFokus(s.f1, s.f2)) fokusKel++;
        const [qq, rr] = bagiBig(s.dibagi, s.pembagi);
        cek(rr === 0 && qq === s.kunci && kali(s.kunci, s.pembagi) === s.dibagi, 'keluarga kunci ' + s.dibagi + ':' + s.pembagi);
        cek(s.dibagi <= 100000 && s.pembagi >= 2, 'keluarga batas');
        opsiBaik(s.opsi, s.kunci, 'keluarga t' + Tg, 100000); sebabBaik(s.sebab, s.opsi, s.kunci, 'keluarga');
        if (Tg === 1) cek(s.f1 <= 10 && s.f2 <= 10 && s.z === 0, 'keluarga t1 batas');
        if (Tg === 2) cek(s.f1 <= 12 && s.f2 <= 12 && s.z === 0, 'keluarga t2 batas');
        if (Tg === 3) cek(s.f1 <= 9 && s.f2 <= 9 && s.z >= 2 && s.dibagi >= 400, 'keluarga t3 ratusan/ribuan ' + s.dibagi);
      }
    }
  }
  const bagian = Tg === 3 ? fokusNol / nNol : fokusFakta / nFakta;
  console.log('Tabel Kilat tingkat ' + Tg + ': soal ' + nSoal + ', memuat 6/7/8/12 = ' + (bagian * 100).toFixed(0) + '%' + (Tg === 2 ? ', memuat 11 = ' + ada11 : '') + ', keluarga fokus ' + (fokusKel / nKel * 100).toFixed(0) + '%');
  cek(bagian > 0.6 && bagian < 0.82, 'tabel bobot fokus t' + Tg + ' ' + bagian);
  if (Tg === 2) cek(ada11 > 30, 'tabel t2: angka 11 jarang');
}

// ---------- Kali Kotak ----------
const BATAS_A = { 1: [12, 99], 2: [12, 99], 3: [112, 999] };
for (const Tg of [1, 2, 3]) {
  let nKotak = 0, nSusun = 0, geserAda = 0, simpanAda = 0, nSimpan = 0, nSel = 0, selNol = 0, nolHilangAda = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = K.buatRonde(Tg);
    cek(ronde.length === 5, 'kotak 5 soal');
    cek(ronde.map((s) => s.jenis).join() === 'kotak,kotak,kotak,susun,susun' && ronde[3].tampilBaris && !ronde[4].tampilBaris, 'kotak urutan jenis');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'kotak soal tidak kembar');
    for (const s of ronde.concat(ronde.map((x) => K.soalMirip(x, Tg)))) {
      const kunciLain = kali(s.a, s.b);
      cek(s.kunci === kunciLain && kunciLain <= 100000, 'kotak kunci ' + s.a + 'x' + s.b);
      cek(s.a >= BATAS_A[Tg][0] && s.a <= BATAS_A[Tg][1], 'kotak a batas ' + s.a);
      if (Tg === 1) cek(s.b >= 2 && s.b <= 9, 'kotak t1 pengali 1 angka'); else cek(s.b >= 12 && s.b <= 99, 'kotak t2/3 pengali 2 angka ' + s.b);
      if (Tg === 3) cek(s.a >= 100, 'kotak t3 3 angka');
      if (s.jenis === 'kotak') {
        nKotak++;
        cek(s.baris.reduce((t, x) => t + x, 0) === s.a, 'kotak baris jumlah ' + s.baris + ' != ' + s.a);
        cek(s.kolom.reduce((t, x) => t + x, 0) === s.b, 'kotak kolom jumlah ' + s.kolom + ' != ' + s.b);
        cek(s.sel.length === s.baris.length * s.kolom.length && s.sel.length >= 2 && s.sel.length <= 4, 'kotak jumlah kotak ' + s.sel.length);
        if (Tg === 1) cek(s.sel.length === 2, 'kotak t1: 2 kotak');
        if (Tg === 2) cek(s.sel.length === 4, 'kotak t2: 4 kotak');
        if (Tg === 3) cek(s.sel.length === 2 && s.baris.length === 1, 'kotak t3: 2 kotak (3 angka x puluhan, x satuan)');
        let jml = 0;
        s.sel.forEach((c, idx) => {
          nSel++; if (c.p % 10 === 0 || c.q % 10 === 0) selNol++;
          cek(c.p === s.baris[Math.floor(idx / s.kolom.length)] && c.q === s.kolom[idx % s.kolom.length], 'kotak urutan sel');
          cek(c.kunci === kaliUlang(c.p, c.q), 'kotak sel kunci ' + c.p + 'x' + c.q);
          opsiBaik(c.opsi, c.kunci, 'kotak sel t' + Tg, 100000); sebabBaik(c.sebab, c.opsi, c.kunci, 'kotak sel');
          cek(K.periksaLangkah(s, idx, c.kunci) && c.opsi.filter((o) => K.periksaLangkah(s, idx, o)).length === 1, 'kotak periksa sel');
          const z = H.banyakNol(c.p) + H.banyakNol(c.q);
          if (z > 0 && c.opsi.includes(H.nolDepan(c.p) * H.nolDepan(c.q) * Math.pow(10, z - 1))) nolHilangAda++;
          jml += c.kunci;
        });
        cek(jml === s.kunci && s.jumlah.kunci === s.kunci, 'kotak jumlah sel ' + jml + ' != ' + s.kunci);
        opsiBaik(s.jumlah.opsi, s.jumlah.kunci, 'kotak jumlah t' + Tg, 100000); sebabBaik(s.jumlah.sebab, s.jumlah.opsi, s.jumlah.kunci, 'kotak jumlah');
        cek(K.periksaLangkah(s, s.sel.length, s.kunci) && !K.periksaLangkah(s, s.sel.length, s.kunci + 1), 'kotak periksa jumlah');
        if (Tg === 2) cek(s.jumlah.opsi.some((o) => s.sel.some((c) => o === s.kunci - c.kunci)), 'kotak jumlah: pengecoh "lupa satu kotak" harus ada');
      } else {
        nSusun++;
        opsiBaik(s.opsi, s.kunci, 'susun t' + Tg, 100000); sebabBaik(s.sebab, s.opsi, s.kunci, 'susun');
        cek(s.baris.reduce((t, x) => t + x.nilai, 0) === s.kunci && s.baris.length === 2 && !s.baris[0].geser && s.baris[1].geser, 'susun baris jumlah');
        cek(s.baris[1].nilai % 10 === 0, 'susun baris geser kelipatan 10');
        cek(K.periksaSusun(s, s.kunci).benar && s.opsi.filter((o) => K.periksaSusun(s, o).benar).length === 1, 'susun periksa');
        if (Tg >= 2) {
          const r1 = s.baris[0].nilai, r2 = s.baris[1].nilai;
          cek(s.opsi.includes(r1 + r2 / 10), 'susun: pengecoh "lupa geser" (' + r1 + ' + ' + r2 / 10 + ') harus ada: ' + s.opsi + ' kunci ' + s.kunci);
          geserAda++;
        } else {
          const ls = K.lupaSimpan(s.a, s.b);
          if (ls !== s.kunci) { nSimpan++; if (s.opsi.includes(ls)) simpanAda++; }
        }
      }
    }
  }
  if (Tg === 1) cek(simpanAda / nSimpan > 0.9, 'susun t1: pengecoh lupa simpan jarang ' + simpanAda + '/' + nSimpan);
  console.log('Kali Kotak tingkat ' + Tg + ': soal kotak ' + nKotak + ', soal susun ' + nSusun + (Tg === 1 ? ', pengecoh lupa simpan ' + simpanAda + '/' + nSimpan : ', pengecoh lupa geser ' + geserAda + '/' + nSusun) + ', kotak berangka nol ' + selNol + '/' + nSel + ' (pengecoh nol hilang ' + nolHilangAda + ')');
}
// contoh dari rencana: 23 x 14 -> 20x10, 20x4, 3x10, 3x4 = 200, 80, 30, 12 = 322
cek(K.bagian(23).join() === '20,3' && K.bagian(14).join() === '10,4' && K.bagian(234).join() === '200,30,4', 'bagian()');
cek(K.lupaSimpan(47, 6) === 242 && K.lupaSimpan(23, 4) === 82, 'lupaSimpan');
{
  let tampil = null;
  for (let i = 0; i < 20000 && !tampil; i++) { const s = K.soalKotak(2, null); if (s.a === 23 && s.b === 14) tampil = s; }
  if (tampil) cek(tampil.sel.map((c) => c.kunci).join() === '200,80,30,12' && tampil.kunci === 322, 'contoh 23 x 14');
}

// ---------- Bagi Bersusun ----------
const DIGIT = { 1: [2, 2], 2: [2, 3], 3: [3, 4] };
for (const Tg of [1, 2, 3]) {
  let nBagi = 0, nPembagiFokus = 0, nPembagi = 0, nolQ = 0, nSisa = 0, nBenar = 0, nSisaBesar = 0;
  for (let r = 0; r < RONDE; r++) {
    const ronde = B.buatRonde(Tg);
    cek(ronde.length === 5, 'bagi 5 soal');
    cek(ronde.map((s) => s.jenis).join() === 'bagi,bagi,bagi,cek,benar', 'bagi urutan jenis');
    cek(new Set(ronde.map((s) => s.kode)).size === 5, 'bagi soal tidak kembar');
    if (Tg === 3) cek(/0/.test(String(ronde[2].q).slice(1)), 'bagi t3 soal 3: nol di hasil bagi ' + ronde[2].a + ':' + ronde[2].b);
    for (const s of ronde.concat(ronde.map((x) => B.soalMirip(x, Tg)))) {
      const [qq, rr] = bagiBig(s.a, s.b);
      cek(s.q === qq && s.r === rr, 'bagi q,r ' + s.a + ':' + s.b);
      cek(s.b >= 2 && s.b <= 9, 'pembagi 1 angka');
      nPembagi++; if ([6, 7, 8].includes(s.b)) nPembagiFokus++;
      const dig = String(s.a).length;
      cek(dig >= DIGIT[Tg][0] && dig <= DIGIT[Tg][1], 'bagi t' + Tg + ' jumlah angka ' + s.a);
      if (Tg === 1) cek(s.r === 0, 'bagi t1 tanpa sisa'); else cek(s.r > 0 || (Tg === 3 && s.jenis === 'bagi' && s.a < 1000), 'bagi t' + Tg + ' bersisa ' + s.a + ':' + s.b);
      if (s.jenis === 'bagi') {
        nBagi++;
        // rekonstruksi langkah: hasil bagi dirangkai dari angka-angka; tiap langkah konsisten
        cek(Number(s.langkah.map((l) => l.q).join('')) === qq, 'bagi rangkaian q ' + s.a + ':' + s.b);
        const dg = String(s.a).split('').map(Number);
        let L = 1; while (L < dg.length && Number(dg.slice(0, L).join('')) < s.b) L++;   // angka pertama yang diambil: awalan terpendek >= pembagi
        let sisaSblm = 0, pos = L;
        s.langkah.forEach((l, i) => {
          const harapan = i === 0 ? Number(dg.slice(0, L).join('')) : sisaSblm * 10 + dg[pos++];
          cek(l.ambil === harapan, 'bagi ambil langkah ' + (i + 1) + ' ' + s.a + ':' + s.b + ' ' + l.ambil + ' vs ' + harapan);
          cek(l.q >= 0 && l.q <= 9 && l.kali === l.q * s.b && l.sisa === l.ambil - l.kali && l.sisa >= 0 && l.sisa < s.b, 'bagi langkah ' + JSON.stringify(l));
          sisaSblm = l.sisa;
        });
        cek(s.langkah[s.langkah.length - 1].sisa === rr && pos === dg.length, 'bagi sisa akhir/pos ' + s.a + ':' + s.b);
        cek(s.langkah[0].ambil >= s.b, 'bagi langkah pertama harus >= pembagi');
        if (/0/.test(String(qq).slice(1))) nolQ++;
        s.pilihan.forEach((opsi, i) => { opsiBaik(opsi, s.langkah[i].q, 'bagi langkah t' + Tg, 9, 0); cek(B.periksaLangkah(s, i, s.langkah[i].q) && opsi.filter((o) => B.periksaLangkah(s, i, o)).length === 1, 'bagi periksa langkah'); });
        if (s.r > 0) {
          nSisa++;
          opsiBaik(s.sisaOpsi, s.r, 'bagi sisa t' + Tg, 2 * s.b, 0);
          sebabBaik(s.sisaSebab, s.sisaOpsi, s.r, 'bagi sisa');
          cek(s.sisaOpsi.some((o) => o >= s.b), 'bagi sisa: pengecoh "sisa >= pembagi" harus ada ' + s.sisaOpsi + ' b=' + s.b);
          cek(B.periksaLangkah(s, s.langkah.length, s.r) && !B.periksaLangkah(s, s.langkah.length, s.r + 1), 'bagi periksa sisa');
        } else cek(s.sisaOpsi == null, 'bagi tanpa sisa tidak bertanya sisa');
      } else if (s.jenis === 'cek') {
        cek(s.b * s.q + s.r === s.a && s.kunci === s.a && kali(s.b, s.q) + s.r === s.a, 'cek kunci ' + s.a);
        opsiBaik(s.opsi, s.kunci, 'cek t' + Tg, 100000); sebabBaik(s.sebab, s.opsi, s.kunci, 'cek');
        if (s.r > 0) cek(s.opsi.includes(s.b * s.q), 'cek: pengecoh "lupa sisa" harus ada ' + s.a + ':' + s.b);
        cek(B.periksaCek(s, s.kunci).benar && s.opsi.filter((o) => B.periksaCek(s, o).benar).length === 1, 'cek periksa');
      } else {
        nBenar++;
        cek(s.opsi.length === 4 && new Set(s.opsi.map((o) => o.q + '|' + o.r)).size === 4, 'benar 4 pilihan berbeda ' + JSON.stringify(s.opsi));
        const sah = s.opsi.filter((o) => B.benarPasang(s.a, s.b, o.q, o.r));
        cek(sah.length === 1 && sah[0].q === qq && sah[0].r === rr && s.kunci === qq + '|' + rr, 'benar tepat satu sah ' + s.a + ':' + s.b + ' ' + JSON.stringify(s.opsi));
        // pembanding independen: sah bila b*q + r = a (BigInt) dan 0 <= r < b
        s.opsi.forEach((o) => { const ok = BigInt(s.b) * BigInt(o.q) + BigInt(o.r) === BigInt(s.a) && o.r >= 0 && o.r < s.b; cek(ok === (o.q + '|' + o.r === s.kunci), 'benar pembanding ' + JSON.stringify(o)); });
        cek(s.opsi.some((o) => o.r >= s.b && s.b * o.q + o.r === s.a), 'benar: pengecoh "sisa >= pembagi" (hasil tampak benar) harus ada ' + s.a + ':' + s.b + ' ' + JSON.stringify(s.opsi));
        if (s.opsi.some((o) => o.r >= s.b)) nSisaBesar++;
        cek(B.periksaBenar(s, s.kunci).benar && s.opsi.filter((o) => B.periksaBenar(s, o.q + '|' + o.r).benar).length === 1, 'benar periksa');
      }
    }
  }
  console.log('Bagi Bersusun tingkat ' + Tg + ': soal bagi ' + nBagi + ' (bersisa ' + nSisa + ', nol di hasil bagi ' + nolQ + '), pembagi 6/7/8 = ' + (nPembagiFokus / nPembagi * 100).toFixed(0) + '%, soal "benar" ' + nBenar + ' (pengecoh sisa>=pembagi ' + nSisaBesar + ')');
  cek(nPembagiFokus / nPembagi > 0.62 && nPembagiFokus / nPembagi < 0.78, 'bagi bobot pembagi 6/7/8 ' + nPembagiFokus / nPembagi);
  if (Tg === 3) cek(nolQ > nBagi * 0.2, 'bagi t3: nol di hasil bagi jarang');
}
cek(B.langkahBagi(86, 6).q === 14 && B.langkahBagi(86, 6).r === 2 && B.langkahBagi(86, 6).langkah.length === 2, 'contoh 86 : 6');
cek(B.langkahBagi(3045, 3).q === 1015 && B.langkahBagi(3045, 3).langkah.map((l) => l.q).join('') === '1015', 'contoh 3045 : 3 (nol di tengah)');

// ---------- Bab 1, 3-6 tetap lulus ----------
const { spawnSync } = require('child_process');
for (const n of [1, 3, 4, 5, 6]) {
  const r = spawnSync(process.execPath, [require('path').join(__dirname, 'cek-bab' + n + '.js')], { encoding: 'utf8' });
  console.log('cek-bab' + n + '.js: ' + (r.status === 0 ? 'lulus' : 'GAGAL (kode ' + r.status + ')'));
  cek(r.status === 0, 'cek-bab' + n + ' gagal');
}

console.log(gagal ? '\nGAGAL: ' + gagal + ' pelanggaran' : '\nSemua cek Bab 2 lulus (Tabel Kilat, Kali Kotak, Bagi Bersusun)');
process.exit(gagal ? 1 : 0);
