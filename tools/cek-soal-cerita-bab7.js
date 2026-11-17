// Cek logika 📖 Soal Cerita Kelas 4 Bab 7 (Persentase): node tools/cek-soal-cerita-bab7.js
// Kunci dihitung ulang dari angka yang TAMPIL di cerita (persen, jumlah, uang), dengan menghitung satuan satu-satu (tanpa rumus),
// pengecoh unik, sebab salah benar secara matematika, angka pengecoh bukan angka penting, cerita0 tanpa digit,
// tiga kotak seratus dengan tepat satu yang cocok, contoh video muncul.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-7/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };
const angkaDari = (t) => Number(String(t).replace(/\D/g, ''));

// pembanding independen: p% dari total = banyak satuan u (1..total) dengan u*100 <= total*p
function persenDari(total, p) { let n = 0; for (let u = 1; u <= total; u++) if (u * 100 <= total * p) n++; return n; }
cek(persenDari(40, 25) === 10 && persenDari(50000, 20) === 10000 && persenDari(200, 50) === 100 && persenDari(200, 10) === 20, 'contoh video (persenDari)');
cek(40 - persenDari(40, 25) - persenDari(40, 50) === 10 && 200 - 100 - 20 === 80 && 45000 - (50000 - persenDari(50000, 20)) === 5000, 'contoh video (sisa)');

const RONDE = 1200, stat = {};
const g = M.untuk(D);
for (let t = 1; t <= 3; t++) {
  stat[t] = { bagian: 0, sisa: 0, contoh: 0, kembalian: 0, uang: 0, dua: 0, kunciMaks: 0 };
  const s = stat[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde 5 soal, dua jenis t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      const persenTampil = penting.filter((x) => x.t.endsWith('%')).map((x) => angkaDari(x.t));
      const lain = penting.filter((x) => !x.t.endsWith('%')).map((x) => angkaDari(x.t));
      cek(JSON.stringify(persenTampil) === JSON.stringify(so.ps), nama + ' persen tampil != ps');
      const maks = so.uang ? 2000000 : 1000;
      // kunci dari angka yang tampil
      let benar;
      if (so.jenis === 'bagian') {
        cek(persenTampil.length === 1 && lain.length === 1, nama + ' bagian: angka penting');
        benar = persenDari(lain[0], persenTampil[0]);
        cek(lain[0] === so.total, nama + ' total tampil');
      } else if (so.uangBayar) {
        cek(persenTampil.length === 1 && lain.length === 2, nama + ' kembalian: angka penting');
        const [harga, uangBayar] = lain; // urutan di cerita: harga, lalu uang
        const potong = persenDari(harga, persenTampil[0]);
        benar = uangBayar - (harga - potong);
        cek(harga === so.total && uangBayar === so.uangBayar, nama + ' harga/uang tampil');
        cek(benar > 0 && uangBayar >= harga - potong, nama + ' kembalian tidak positif');
      } else {
        cek(persenTampil.length === so.np && lain.length === 1 && so.np <= 2, nama + ' sisa: angka penting');
        let sisa = lain[0];
        persenTampil.forEach((p) => { sisa -= persenDari(lain[0], p); });
        benar = sisa;
        cek(persenTampil.reduce((a, b) => a + b, 0) <= 90 && new Set(persenTampil).size === persenTampil.length, nama + ' jumlah persen > 90 atau kembar');
        cek(100 - persenTampil.reduce((a, b) => a + b, 0) === so.sisaP, nama + ' sisaP');
        // sisa persen dihitung lain: sisaP% dari total
        cek(persenDari(lain[0], so.sisaP) === benar, nama + ' sisa lewat 100% - bagian');
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.penting === penting.length, nama + ' penting ' + so.penting + ' vs ' + penting.length);
      cek(Number.isInteger(so.kunci) && so.kunci >= 1, nama + ' kunci bukan bulat positif');
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4 && so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' opsi 4 unik: ' + so.opsi);
      so.opsi.forEach((o) => cek(Number.isInteger(o) && o >= 1 && o <= maks, nama + ' opsi di luar batas ' + o));
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 5, nama + ' sebab non-opsi'));
      // sebab benar secara matematika
      const tot = so.total;
      so.opsi.forEach((o) => {
        const sb = so.sebab[o] || '';
        if (so.jenis === 'bagian') {
          const p = so.ps[0];
          if (/Itu angka persennya saja/.test(sb)) cek(o === p, nama + ' sebab p');
          if (/Itu jumlah seluruhnya/.test(sb)) cek(o === tot, nama + ' sebab total');
          if (/Itu sisanya/.test(sb)) cek(o === tot - so.kunci, nama + ' sebab sisa');
          if (/dikali \d+ tanpa dibagi 100/.test(sb)) cek(o === tot * p, nama + ' sebab total x p');
          if (/dikurangi \d+\. Persen bukan/.test(sb)) cek(o === tot - p, nama + ' sebab total - p');
          if (/dibagi \d+ saja/.test(sb)) cek(o === tot / p, nama + ' sebab total : p');
        } else if (so.uangBayar) {
          const potong = persenDari(tot, so.ps[0]), bayar = tot - potong;
          if (/Itu potongan harganya/.test(sb)) cek(o === potong, nama + ' sebab potongan');
          if (/Itu harga yang harus dibayar/.test(sb)) cek(o === bayar, nama + ' sebab bayar');
          if (/Itu harga asli/.test(sb)) cek(o === tot, nama + ' sebab harga asli');
          if (/Uang dikurangi potongan saja/.test(sb)) cek(o === so.uangBayar - potong, nama + ' sebab uang - potongan');
          if (/Itu uang Bayu/.test(sb)) cek(o === so.uangBayar, nama + ' sebab uang');
        } else {
          const jml = so.ps.reduce((a, b) => a + b, 0), bag = so.ps.map((p) => persenDari(tot, p));
          if (/Itu bagian yang disebut/.test(sb)) cek(o === persenDari(tot, jml), nama + ' sebab bagian disebut');
          if (/Itu jumlah seluruhnya/.test(sb)) cek(o === tot, nama + ' sebab total');
          if (/dikurangi angka persennya/.test(sb)) cek(o === tot - jml, nama + ' sebab total - persen');
          if (/Itu angka persen sisanya/.test(sb)) cek(o === so.sisaP, nama + ' sebab sisaP');
          if (/Itu bagian pertama saja/.test(sb)) cek(o === bag[0], nama + ' sebab bagian 1');
          if (/Itu bagian kedua saja/.test(sb)) cek(o === bag[1], nama + ' sebab bagian 2');
          if (/Satu bagian lupa dikurangkan/.test(sb)) cek(so.ps.length === 2 && (o === tot - bag[0] || o === tot - bag[1]), nama + ' sebab lupa kurang');
        }
      });
      // cerita0 tanpa angka, kata kunci ada, kata kunci jenis
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      cek(so.jenis === 'bagian' ? !/(sisa|kembalian)/i.test(so.cerita0) && /sebagian/i.test(so.cerita0) : /(sisa|kembalian)/i.test(so.cerita0), nama + ' kata kunci jenis');
      // segmen
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      if (so.uang) cek(penting.filter((x) => !x.t.endsWith('%')).every((x) => /^Rp\d{1,3}(\.\d{3})*$/.test(x.t)), nama + ' format Rp');
      else cek(penting.filter((x) => !x.t.endsWith('%')).every((x) => /^\d{1,3}(\.\d{3})*$/.test(x.t)), nama + ' format angka');
      cek(pengecoh.length === t - 1, nama + ' jumlah pengecoh ' + pengecoh.length);
      const pn = pengecoh.map((x) => Number(x.t));
      const terlarang = new Set([so.kunci, so.total, so.sisaP].concat(so.ps, so.uangBayar ? [so.uangBayar] : []));
      pn.forEach((p) => cek(!terlarang.has(p), nama + ' pengecoh sama angka penting ' + p));
      cek(new Set(pn).size === pn.length && JSON.stringify(so.angkaPengecoh) === JSON.stringify(pn), nama + ' pengecoh kembar/tidak cocok');
      // gambar: 3 kotak unik, tepat satu cocok (segs sama, 100 sel, bagian sesuai jenis)
      cek(so.gambar.pilihan.length === 3 && new Set(so.gambar.pilihan.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      const bagianJenis = so.jenis === 'bagian';
      const tepat = so.gambar.pilihan.filter((p) => p.n === 100 && JSON.stringify(p.segs) === JSON.stringify(so.ps) && p.bagian === bagianJenis);
      cek(tepat.length === 1 && tepat[0].id === so.gambar.benar, nama + ' gambar benar tepat satu');
      so.gambar.pilihan.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d{3,}/.test(p.ket), nama + ' svg ' + p.id);
        cek((p.svg.match(/<rect x="[\d.]+" y="[\d.]+" width="13.5"/g) || []).length === p.n, nama + ' jumlah sel gambar ' + p.id);
      });
      cek(so.cek.includes('<b>' + M.fmt(so.kunci) + '</b>'), nama + ' cek tidak memuat kunci');
      // rentang tingkat
      const L = D.LEVEL[t];
      so.ps.forEach((p) => cek(L.p.includes(p) || D.CONTOH.some((c) => c.t === t && c.ps.includes(p)), nama + ' persen di luar rentang ' + p));
      if (idx < 5) {
        s[so.jenis]++; if (so.uang) s.uang++; if (so.uangBayar) s.kembalian++; if (so.ps.length === 2) s.dua++;
        s.kunciMaks = Math.max(s.kunciMaks, so.kunci);
        if (D.CONTOH.some((c) => c.jenis === so.jenis && c.t === t && c.ti === so.ti && c.T === so.total && JSON.stringify(c.ps) === JSON.stringify(so.ps))) s.contoh++;
      }
    });
  }
}
// contoh video muncul (sekitar 12% per jenis yang punya contoh di tingkat itu)
for (let t = 1; t <= 3; t++) {
  const n = stat[t].bagian + stat[t].sisa;
  const frak = stat[t].contoh / n;
  cek(frak > 0.03 && frak < 0.25, 'contoh t' + t + ' muncul ' + (frak * 100).toFixed(1) + '%');
}
cek(stat[1].kembalian === 0 && stat[3].kembalian > 0 && stat[2].dua > 0 && stat[3].dua > 0 && stat[1].dua === 0, 'sebaran kembalian / dua persen per tingkat');
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 7 lolos.');
process.exit(gagal ? 1 : 0);
