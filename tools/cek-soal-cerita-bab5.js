// Cek logika 📖 Soal Cerita Kelas 4 Bab 5 (Pecahan 2): node tools/cek-soal-cerita-bab5.js
// Kunci dihitung ulang dengan cara lain (simulasi membagi satu-satu), pengecoh unik, angka pengecoh bukan angka penting,
// cerita0 tanpa digit, tiga gambar batang dengan tepat satu yang cocok, contoh video (kelereng, Rina, Dina) muncul.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-5/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// pembanding independen: cari jumlah mula-mula X sehingga X dikurangi (a/b dari X) = sisa, tanpa rumus
function mulaMula(a, b, sisa) {
  for (let x = b; x <= 3000000; x += b) { const dipakai = (x / b) * a; if (x - dipakai === sisa) return x; }
  return -1;
}
// bagian dari total: bagi total ke b kelompok satu-satu, ambil a kelompok
function ambilBagian(a, b, total) {
  const kel = new Array(b).fill(0);
  for (let i = 0; i < total; i++) kel[i % b]++;
  let s = 0; for (let i = 0; i < a; i++) s += kel[i]; return s;
}
// contoh video
cek(mulaMula(2, 3, 12000) === 36000 && mulaMula(3, 5, 24) === 60 && mulaMula(3, 4, 6) === 24, 'contoh video');

const RONDE = 1500, stat = {};
const g = M.untuk(D);
const angkaDari = (t) => Number(String(t).replace(/\D/g, ''));
for (let t = 1; t <= 3; t++) {
  stat[t] = { mundur: 0, bagian: 0, contoh: 0, money: 0, kunciMaks: 0 };
  const s = stat[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde harus campur kedua jenis t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const { a, b } = so;
      const teks = so.segmen.map((x) => x.t).join('');
      const maks = so.uang ? 2000000 : 1000;
      cek(a >= 1 && a < b && M.fpb(a, b) === 1, nama + ' pecahan tidak sederhana');
      const r = b - a;
      // kunci benar menurut pembanding independen
      let benar;
      if (so.jenis === 'mundur') {
        benar = mulaMula(a, b, so.sisa);
        cek(so.sisa === r * so.u && so.kunci === b * so.u, nama + ' hitungan mundur');
        cek(so.sisa + so.terpakai === so.kunci, nama + ' sisa + terpakai = semula');
      } else {
        benar = so.tanyaDipakai ? ambilBagian(a, b, so.total) : so.total - ambilBagian(a, b, so.total);
        cek(so.total % b === 0, nama + ' total tidak habis dibagi penyebut');
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(Number.isInteger(so.kunci), nama + ' kunci bukan bulat');
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4, nama + ' opsi 4 unik: ' + so.opsi);
      cek(so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' kunci tepat satu');
      so.opsi.forEach((o) => cek(Number.isInteger(o) && o >= 1 && o <= maks, nama + ' opsi di luar batas ' + o));
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 5, nama + ' sebab non-opsi'));
      // sebab benar secara matematika
      so.opsi.forEach((o) => {
        const sb = so.sebab[o] || '';
        if (/Itu sisanya saja/.test(sb)) cek(o === so.sisa, nama + ' sebab sisa');
        if (/Itu isi satu bagian/.test(sb)) cek(o === so.u, nama + ' sebab 1 bagian');
        if (/Itu bagian yang dipakai/.test(sb)) cek(o === a * so.u, nama + ' sebab dipakai');
        if (/Itu jumlah seluruhnya/.test(sb)) cek(o === so.total, nama + ' sebab total');
        if (/Itu yang belum dipakai/.test(sb)) cek(o === r * so.u, nama + ' sebab belum dipakai');
        if (/Itu yang sudah dipakai/.test(sb)) cek(o === a * so.u, nama + ' sebab sudah dipakai');
        if (/Sisa dikali pembilang/.test(sb)) cek(o === so.sisa * a, nama + ' sebab sisa x pembilang');
        if (/Sisa dikali penyebut/.test(sb)) cek(o === so.sisa * b, nama + ' sebab sisa x penyebut');
        if (/Sisa ditambah isi/.test(sb)) cek(o === so.sisa + so.u, nama + ' sebab sisa + 1 bagian');
        if (/dikali pembilang tanpa dibagi/.test(sb)) cek(o === so.total * a, nama + ' sebab total x pembilang');
        if (/dikurangi pembilang/.test(sb)) cek(o === so.total - a, nama + ' sebab total - pembilang');
        if (/dibagi pembilang/.test(sb)) cek(o === so.total / a, nama + ' sebab total : pembilang');
      });
      // cerita tanpa angka, kata kunci ada
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      cek(so.jenis === 'mundur' ? /Sisa/.test(so.cerita0) && /(mula-mula|seluruhnya)/.test(so.cerita0) : /semuanya sudah diketahui/.test(so.cerita0) && !/mula-mula/.test(so.cerita0) && !/Sisa/.test(so.cerita0), nama + ' kata kunci jenis');
      // segmen: angka penting = pecahan + (sisa atau total); pengecoh t-1; teks biasa tanpa digit
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      cek(penting.length === 2, nama + ' angka penting ' + penting.length);
      cek(penting.some((x) => x.t === a + '/' + b), nama + ' pecahan tidak ada di cerita');
      const nilaiBesar = so.jenis === 'mundur' ? so.sisa : so.total;
      cek(penting.some((x) => angkaDari(x.t) === nilaiBesar && !x.t.includes('/')), nama + ' angka sisa/total tidak ada');
      if (so.uang) cek(penting.some((x) => /^Rp\d{1,3}(\.\d{3})*$/.test(x.t)), nama + ' format Rp');
      else cek(penting.filter((x) => !x.t.includes('/')).every((x) => /^\d{1,3}(\.\d{3})*$/.test(x.t)), nama + ' format angka');
      cek(pengecoh.length === t - 1, nama + ' jumlah pengecoh ' + pengecoh.length);
      const pn = pengecoh.map((x) => Number(x.t));
      pn.forEach((p) => cek(p !== a && p !== b && p !== nilaiBesar && p !== so.kunci, nama + ' pengecoh sama angka penting ' + p));
      cek(new Set(pn).size === pn.length, nama + ' pengecoh kembar');
      cek(JSON.stringify(so.angkaPengecoh) === JSON.stringify(pn), nama + ' angkaPengecoh tidak cocok');
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      // gambar: 3 batang unik, tepat satu cocok (b bagian sama besar, a diarsir), tanpa digit di keterangan
      cek(so.gambar.pilihan.length === 3 && new Set(so.gambar.pilihan.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      const tepat = so.gambar.pilihan.filter((p) => p.n === b && p.arsir === a && !p.tidakSama);
      cek(tepat.length === 1 && tepat[0].id === so.gambar.benar, nama + ' gambar benar tepat satu');
      so.gambar.pilihan.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d{3,}/.test(p.ket), nama + ' svg ' + p.id);
        if (p.id !== so.gambar.benar) cek(p.n !== b || p.arsir !== a || p.tidakSama, nama + ' pengecoh gambar sama dengan benar');
        cek(p.arsir >= 1 && p.arsir < p.n, nama + ' gambar arsir ' + p.arsir + '/' + p.n);
        cek((p.svg.match(/<line /g) || []).length === p.n - 1, nama + ' jumlah sekat gambar');
      });
      // layar cek memuat jawaban
      cek(so.cek.includes('<b>' + M.fmt(so.kunci) + '</b>'), nama + ' cek tidak memuat kunci');
      // rentang tingkat
      const L = (so.jenis === 'mundur' ? D.MUNDUR : D.BAGIAN)[t];
      cek(L.b.includes(b), nama + ' penyebut di luar rentang');
      if (so.jenis === 'mundur') cek(L.r.includes(r), nama + ' sisa bagian di luar rentang');
      if (t === 1) cek(b <= 5, nama + ' t1 penyebut > 5');
      if (idx < 5) {
        s[so.jenis]++; if (so.uang) s.money++; s.kunciMaks = Math.max(s.kunciMaks, so.kunci);
        if (so.jenis === 'mundur' && a === D.CONTOH_MUNDUR[t].a && b === D.CONTOH_MUNDUR[t].b && so.u === D.CONTOH_MUNDUR[t].u) s.contoh++;
      }
    });
  }
}
// contoh muncul sekitar 12% dari soal mundur
for (let t = 1; t <= 3; t++) {
  const frak = stat[t].contoh / stat[t].mundur;
  cek(frak > 0.08 && frak < 0.2, 'contoh t' + t + ' muncul ' + (frak * 100).toFixed(1) + '%');
}
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 5 lolos.');
process.exit(gagal ? 1 : 0);
