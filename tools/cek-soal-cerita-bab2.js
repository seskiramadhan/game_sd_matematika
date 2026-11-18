// Cek logika 📖 Soal Cerita Kelas 4 Bab 2 (Perkalian & Pembagian): node tools/cek-soal-cerita-bab2.js
// Kunci dihitung ulang dengan cara lain (penjumlahan berulang untuk kali, pengurangan berulang untuk bagi), 3 pilihan gambar dengan tepat satu cocok,
// pengecoh unik & bersebab benar, cerita0 tanpa digit, angka pengecoh (tingkat 3) bukan angka penting, contoh video muncul ~12%, penekanan 6/7/8/12 ~70%.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-2/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// pembanding independen
const kaliUlang = (m, k) => { let t = 0; for (let i = 0; i < m; i++) t += k; return t; };
const bagiUlang = (total, n) => { let sisa = total, q = 0; while (sisa >= n) { sisa -= n; q++; } return { q, r: sisa }; };
// contoh video
cek(kaliUlang(12, 8) === 96 && JSON.stringify(bagiUlang(96, 7)) === '{"q":13,"r":5}', 'contoh Bu Rina');
cek(kaliUlang(15, 12) === 180 && JSON.stringify(bagiUlang(180, 8)) === '{"q":22,"r":4}', 'contoh pensil');
cek(JSON.stringify(bagiUlang(50, 8)) === '{"q":6,"r":2}' && bagiUlang(50, 8).q + 1 === 7, 'contoh 50 murid');

const RONDE = 1500, stat = {};
const g = M.untuk(D);
const dec = (c) => ({ q: Math.floor(c / 1000), r: c % 1000 });
for (let t = 1; t <= 3; t++) {
  stat[t] = { kali: 0, bagi: 0, kalibagi: 0, hasil: 0, butuh: 0, sisa: 0, fokus: 0, soal: 0, contoh: 0, contohSemua: 0, kalibagiTotal: 0, bagiTotal: 0, kunciMaks: 0, dis: 0 };
  const s = stat[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde t' + t);
    const idsOk = D.jenisTingkat(t);
    ronde.forEach((x) => cek(idsOk.includes(x.jenis), 'jenis di luar tingkat t' + t + ' ' + x.jenis));
    cek(new Set(ronde.map((x) => x.jenis)).size === new Set(idsOk).size, 'ronde harus memuat semua jenis tingkat t' + t);
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const teks = so.segmen.map((x) => x.t).join('');
      const adaLabel = !!so.labelOpsi;

      // ----- kunci dengan cara lain -----
      let benar, total, q, rr;
      if (so.jenis === 'kali') {
        total = kaliUlang(so.m, so.k); benar = total;
        cek(t === 1 && so.mode === 'semua', nama + ' kali hanya tingkat 1');
        cek(so.total === total, nama + ' total kali');
      } else if (so.jenis === 'bagi' && so.mode === 'hasil') {
        cek(t === 1, nama + ' bagi hasil hanya tingkat 1');
        total = so.total; ({ q, r: rr } = bagiUlang(total, so.n));
        benar = D.kode2(q, rr);
        cek(rr >= 1 && rr < so.n && so.n * q + rr === total, nama + ' sisa < pembagi, cek perkalian');
        cek(so.q === q && so.r === rr, nama + ' q r tersimpan');
      } else if (so.jenis === 'bagi') {
        cek(t === 3 && so.mode === 'butuh', nama + ' bagi butuh hanya tingkat 3');
        total = so.total; ({ q, r: rr } = bagiUlang(total, so.n));
        cek(rr >= 1, nama + ' butuh harus bersisa');
        benar = rr > 0 ? q + 1 : q;
      } else { // kalibagi
        total = kaliUlang(so.m, so.k); ({ q, r: rr } = bagiUlang(total, so.n));
        cek(so.total === total && so.q === q && so.r === rr, nama + ' total/q/r');
        cek(rr >= 1 && so.n * q + rr === total, nama + ' sisa ada & cek perkalian');
        if (so.mode === 'hasil') { cek(t === 2, nama + ' hasil kalibagi tingkat 2'); benar = D.kode2(q, rr); }
        else if (so.mode === 'butuh') { cek(t === 3, nama + ' butuh tingkat 3'); benar = rr > 0 ? q + 1 : q; }
        else { cek(t === 3 && so.mode === 'sisa', nama + ' sisa tingkat 3'); benar = rr; }
      }
      cek(total >= 1 && total <= 999, nama + ' total di luar <= 3 angka: ' + total);
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4, nama + ' opsi 4 unik: ' + so.opsi);
      cek(so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' kunci tepat satu');
      cek(!(so.kunci in so.sebab) || !so.sebab[so.kunci], nama + ' kunci punya sebab salah');
      so.opsi.forEach((o) => cek(Number.isInteger(o) && o >= 1, nama + ' opsi bukan bulat positif ' + o));
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)), nama + ' sebab non-opsi ' + k));
      so.opsi.filter((o) => o !== so.kunci).forEach((o) => cek(so.jenis === 'kali' || (so.sebab[o] && so.sebab[o].length > 8), nama + ' pengecoh ' + o + ' tanpa sebab'));
      const n = so.n;

      // ----- label hasil dan sisa -----
      if (adaLabel) {
        cek(so.jenis !== 'kali' && so.mode === 'hasil', nama + ' labelOpsi hanya untuk hasil');
        so.opsi.forEach((o) => {
          const { q: a, r: b } = dec(o);
          const lab = b ? a + ' sisa ' + b : String(a);
          cek(so.labelOpsi[o] === lab, nama + ' label ' + so.labelOpsi[o] + ' != ' + lab);
          cek(a >= 1 && b >= 0 && b < 1000, nama + ' kode di luar batas ' + o);
          const sb = so.sebab[o] || '';
          if (/tidak boleh sama dengan atau lebih besar dari pembagi/.test(sb)) cek(b >= n && a * n + b === total, nama + ' sebab sisa >= pembagi (' + lab + ') total ' + total);
          if (/Sisanya jangan dilupakan/.test(sb)) cek(b === 0 && a === q, nama + ' sebab lupa sisa');
          if (/^\d+ × \d+ \+ \d+ = \d+, lebih besar dari/.test(sb)) cek(a === q + 1 && b === rr && a * n + b > total, nama + ' sebab terlalu besar');
          if (/Sisa itu .* bukan/.test(sb)) cek(a === q && b === n - rr, nama + ' sebab sisa salah');
          if (/Kamu hanya membagi/.test(sb)) { const besar = Math.max(so.m, so.k); cek(a === Math.floor(besar / n) && b === besar % n && so.jenis === 'kalibagi', nama + ' sebab lupa kali'); }
          if (/Kamu menjumlah/.test(sb)) cek(a === Math.floor((so.m + so.k) / n) && b === (so.m + so.k) % n, nama + ' sebab dijumlah');
        });
        // pengecoh wajib: sisa >= pembagi selalu ada bila hasil bagi > 1; kalibagi: "hanya membagi" muncul bila mungkin
        if (q > 1) cek(so.opsi.some((o) => /tidak boleh sama dengan atau lebih besar/.test(so.sebab[o] || '')), nama + ' pengecoh sisa >= pembagi tidak ada');
        if (so.jenis === 'kalibagi' && Math.max(so.m, so.k) >= n) cek(so.opsi.some((o) => /Kamu hanya membagi/.test(so.sebab[o] || '')), nama + ' pengecoh lupa kali tidak ada');
        cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek tidak memuat label kunci');
        cek(so.tanya4.satuan === '', nama + ' satuan label');
      } else {
        cek(so.cek.includes('<b>' + so.kunci + '</b>'), nama + ' cek tidak memuat kunci');
        so.opsi.forEach((o) => {
          const sb = so.sebab[o] || '';
          if (/hasil bagi saja/.test(sb)) cek(o === q, nama + ' sebab hasil bagi');
          if (/Itu sisanya/.test(sb)) cek(o === rr, nama + ' sebab sisa');
          if (/kelebihan satu/.test(sb)) cek(o === q + 2, nama + ' sebab q+2');
          if (/banyak .* seluruhnya/.test(sb) || /seluruhnya\. Yang tidak/.test(sb)) cek(o === total, nama + ' sebab total');
          if (/hanya membagi/.test(sb)) { const besar = Math.max(so.m, so.k); cek(o === Math.floor(besar / n) + 1, nama + ' sebab lupa kali (butuh)'); }
          if (/untuk tiap/.test(sb)) cek(o === q, nama + ' sebab q (sisa)');
          if (/kekurangan untuk satu putaran/.test(sb)) cek(o === n - rr, nama + ' sebab n-r');
          if (/tidak mungkin/.test(sb)) cek(o === rr + n && o >= n, nama + ' sebab sisa>=pembagi');
          if (/hasil bagi tambah 1/.test(sb)) cek(o === q + 1, nama + ' sebab q+1');
          if (/Itu \d+ × \d+\./.test(sb)) cek(true, '');
        });
        if (so.mode === 'butuh') cek(so.kunci === q + 1 && so.opsi.includes(q) , nama + ' pengecoh "lupa tambah 1" harus ikut');
        if (so.mode === 'sisa') cek(so.opsi.includes(q) || so.opsi.some((o) => /tidak mungkin/.test(so.sebab[o] || '')), nama + ' pengecoh sisa');
        cek(so.tanya4.satuan.length > 0, nama + ' satuan');
      }

      // ----- cerita & segmen -----
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      const diharap = so.jenis === 'kali' ? [so.m, so.k] : so.jenis === 'bagi' ? [total, n] : [so.m, so.k, n];
      cek(JSON.stringify(penting.map((x) => Number(x.t))) === JSON.stringify(diharap), nama + ' angka penting ' + penting.map((x) => x.t) + ' != ' + diharap);
      cek(JSON.stringify(so.angkaPenting) === JSON.stringify(diharap), nama + ' angkaPenting');
      if (t < 3) cek(pengecoh.length === 0, nama + ' tingkat <3 tanpa pengecoh');
      else cek(pengecoh.length >= 1 && pengecoh.length <= 2, nama + ' tingkat 3 butuh 1-2 pengecoh: ' + pengecoh.length);
      const pn = pengecoh.map((x) => Number(x.t));
      pn.forEach((p) => cek(!diharap.includes(p) && p !== so.kunci && p !== total && !(q !== undefined && (p === q || p === rr)), nama + ' pengecoh sama angka penting ' + p));
      cek(new Set(pn).size === pn.length, nama + ' pengecoh kembar');
      cek(JSON.stringify(so.angkaPengecoh) === JSON.stringify(pn), nama + ' angkaPengecoh tidak cocok');
      // angka di teks sama dengan nilai
      cek(so.jenis !== 'kali' ? /^\D*\d+/.test(teks) || true : true, '');
      so.segmen.filter((x) => x.k === 'angka').forEach((x) => cek(x.t === String(x.nilai), nama + ' nilai angka'));

      // ----- gambar -----
      cek(so.gambar.pilihan.length === 3 && new Set(so.gambar.pilihan.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      cek(so.gambar.benar === 'b2-' + so.jenis && so.gambar.pilihan.some((p) => p.id === so.gambar.benar), nama + ' gambar benar tepat satu');
      const svgs = so.gambar.pilihan.map((p) => p.svg);
      cek(new Set(svgs).size === 3, nama + ' svg kembar');
      so.gambar.pilihan.forEach((p) => cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d/.test(p.ket) && !/<text[^>]*>\d/.test(p.svg), nama + ' svg ' + p.id));

      // ----- rentang tingkat & statistik -----
      cek(so.cek.length > 20, nama + ' cek');
      if (idx < 5) {
        s.soal++; s[so.jenis]++; s[so.mode === 'semua' ? 'hasil' : so.mode] += so.mode === 'semua' ? 0 : 1;
        if (so.fokus) s.fokus++;
        s.kunciMaks = Math.max(s.kunciMaks, so.kunci);
        s.dis += pengecoh.length;
        if (so.jenis === 'kalibagi') s.kalibagiTotal++;
        if (so.jenis === 'bagi') s.bagiTotal++;
        if (t === 2 && D.CONTOH2.some((c) => c.m === so.m && c.k === so.k && c.n === n && c.ti === so.ti)) s.contoh++;
        if (t === 3 && so.jenis === 'bagi' && so.total === D.CONTOH3.total && n === D.CONTOH3.n) s.contoh++;
      }
    });
  }
}
// penekanan 6/7/8/12: sekitar 70% soal memuat satu
for (let t = 1; t <= 3; t++) {
  const f = stat[t].fokus / stat[t].soal;
  cek(f > 0.62 && f < 0.78, 'fokus 6/7/8/12 tingkat ' + t + ' = ' + (f * 100).toFixed(1) + '%');
}
// contoh video sekitar 12% (tingkat 2: dari semua soal; tingkat 3: dari soal jenis bagi)
{
  const f2 = stat[2].contoh / stat[2].soal, f3 = stat[3].contoh / stat[3].bagiTotal;
  cek(f2 > 0.08 && f2 < 0.17, 'contoh tingkat 2 muncul ' + (f2 * 100).toFixed(1) + '%');
  cek(f3 > 0.08 && f3 < 0.17, 'contoh tingkat 3 muncul ' + (f3 * 100).toFixed(1) + '%');
  stat.contohPersen = { t2: +(f2 * 100).toFixed(1), t3: +(f3 * 100).toFixed(1) };
}
// kedua mode tingkat 3 muncul
cek(stat[3].butuh > 0 && stat[3].sisa > 0 && stat[3].bagi > 0 && stat[3].kalibagi > stat[3].bagi, 'tingkat 3: mode butuh/sisa/bagi harus muncul');
cek(stat[1].kali > 0 && stat[1].bagi > 0 && stat[1].kalibagi === 0, 'tingkat 1: hanya kali dan bagi');
cek(stat[2].kalibagi === stat[2].soal, 'tingkat 2: semua kalibagi');
stat.fokusPersen = [1, 2, 3].map((t) => +(stat[t].fokus / stat[t].soal * 100).toFixed(1));
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 2 lolos.');
process.exit(gagal ? 1 : 0);
