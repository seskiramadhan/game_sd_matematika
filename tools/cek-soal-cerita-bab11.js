// Cek logika 📖 Soal Cerita Kelas 4 Bab 11 (Luas & Keliling): node tools/cek-soal-cerita-bab11.js
// Kunci dihitung ulang dari angka yang TAMPIL di cerita, dengan menghitung petak/sisi satu-satu pada kisi (tanpa rumus),
// pengecoh unik, sebab salah benar secara matematika, angka pengecoh bukan angka penting, cerita0 tanpa digit,
// tiga gambar denah dengan tepat satu yang cocok, contoh video muncul.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-11/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// kisi: ada(r, k) = petak termasuk bangun. Luas = hitung petak; keliling = hitung sisi petak yang berbatasan dengan luar.
function kisi(P, Q, c, d) { return (r, k) => r >= 0 && r < Q && k >= 0 && k < P && !(k >= P - c && r < d); }
function hitungLuas(ada, P, Q) { let n = 0; for (let r = 0; r < Q; r++) for (let k = 0; k < P; k++) if (ada(r, k)) n++; return n; }
function hitungKeliling(ada, P, Q) {
  let n = 0;
  for (let r = 0; r < Q; r++) for (let k = 0; k < P; k++) if (ada(r, k)) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dk]) => { if (!ada(r + dr, k + dk)) n++; });
  return n;
}
// contoh video
cek(hitungKeliling(kisi(8, 5, 0, 0), 8, 5) === 26 && hitungLuas(kisi(8, 5, 0, 0), 8, 5) === 40 && hitungKeliling(kisi(6, 4, 0, 0), 6, 4) === 20 && hitungLuas(kisi(7, 5, 3, 2), 7, 5) === 29, 'contoh video');

const RONDE = 1200, stat = {};
const g = M.untuk(D);
const ADA = { keliling: 'tepi', luas: 'isi', gabungan: 'L' };
for (let t = 1; t <= 3; t++) {
  stat[t] = { keliling: 0, luas: 0, gabungan: 0, contoh: 0, kunciMaks: 0 };
  const s = stat[t];
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.jenis)).size === 3, 'ronde 5 soal, tiga jenis campur t' + t);
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde');
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so, idx) => {
      const nama = 't' + t + ' ' + so.kode;
      const penting = so.segmen.filter((x) => x.k === 'angka' && x.penting).map((x) => Number(x.t));
      const pengecoh = so.segmen.filter((x) => x.k === 'angka' && !x.penting).map((x) => Number(x.t));
      let benar, dims;
      if (so.jenis === 'gabungan') {
        cek(penting.length === 4, nama + ' gabungan angka penting');
        const [P, Q, c, d] = penting; dims = { P, Q, c, d };
        const ada = kisi(P, Q, c, d);
        benar = hitungLuas(ada, P, Q);
        cek(P === so.a && Q === so.b && c === so.c && d === so.d, nama + ' angka tampil');
        cek(c <= P - 2 && d <= Q - 2 && P !== Q, nama + ' pojok terlalu besar');
        cek(so.bawah + so.atas === benar && so.besar - so.pojok === benar, nama + ' dua cara beda');
        // potongan tegak sebagai cara ketiga: kiri (P-c) x Q + kanan c x (Q-d)
        cek((P - c) * Q + c * (Q - d) === benar, nama + ' potongan tegak');
        cek(hitungKeliling(ada, P, Q) === 2 * (P + Q) && so.kel === 2 * (P + Q), nama + ' keliling L = keliling kotak besar');
      } else {
        cek(penting.length === 2, nama + ' angka penting');
        const [p, l] = penting; dims = { P: p, Q: l, c: 0, d: 0 };
        const ada = kisi(p, l, 0, 0);
        benar = so.jenis === 'keliling' ? hitungKeliling(ada, p, l) : hitungLuas(ada, p, l);
        cek(p === so.a && l === so.b && p > l && l >= 2, nama + ' angka tampil / p > l');
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.length === 4 && new Set(so.opsi).size === 4 && so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' opsi 4 unik: ' + so.opsi);
      so.opsi.forEach((o) => cek(Number.isInteger(o) && o >= 1 && o <= 1000, nama + ' opsi di luar batas ' + o));
      cek(!(so.kunci in so.sebab), nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)) && so.sebab[k].length > 5, nama + ' sebab non-opsi'));
      // sebab benar secara matematika
      const { P, Q: Qq, c, d } = dims;
      so.opsi.forEach((o) => {
        const sb = so.sebab[o] || '';
        if (so.jenis === 'keliling') {
          if (/baru setengah keliling/.test(sb)) cek(o === P + Qq, nama + ' sebab p+l');
          if (/Itu luas/.test(sb)) cek(o === P * Qq, nama + ' sebab luas');
          if (/Satu sisi lebar terlewat/.test(sb)) cek(o === 2 * P + Qq, nama + ' sebab 2p+l');
          if (/Satu sisi panjang terlewat/.test(sb)) cek(o === P + 2 * Qq, nama + ' sebab p+2l');
          if (/Semua sisi dianggap sama/.test(sb)) cek(o === 4 * P, nama + ' sebab 4p');
        } else if (so.jenis === 'luas') {
          if (/Itu keliling/.test(sb)) cek(o === 2 * (P + Qq), nama + ' sebab keliling');
          if (/Itu panjang \+ lebar/.test(sb)) cek(o === P + Qq, nama + ' sebab p+l');
          if (/Panjang dikali 2 saja/.test(sb)) cek(o === 2 * P, nama + ' sebab 2p');
          if (/Lebar dikali 2 saja/.test(sb)) cek(o === 2 * Qq, nama + ' sebab 2l');
        } else {
          if (/luas persegi panjang besar/.test(sb)) cek(o === P * Qq, nama + ' sebab besar');
          if (/luas pojok yang tidak ada saja/.test(sb)) cek(o === c * d, nama + ' sebab pojok');
          if (/malah ditambahkan/.test(sb)) cek(o === P * Qq + c * d, nama + ' sebab tambah');
          if (/Itu keliling/.test(sb)) cek(o === 2 * (P + Qq), nama + ' sebab keliling');
          if (/dikurangi dengan \d+ \+ \d+/.test(sb)) cek(o === P * Qq - (c + d), nama + ' sebab kurang c+d');
          if (/Hanya satu bagian/.test(sb)) cek(o === P * (Qq - d), nama + ' sebab bawah');
        }
      });
      // cerita0 tanpa angka, kata kunci jenis
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      const L = /huruf L/.test(so.cerita0);
      cek(so.jenis === 'gabungan' ? L : !L, nama + ' huruf L hanya di gabungan');
      if (so.jenis === 'keliling') cek(/(tepi|dipagari|mengelilingi)/.test(so.cerita0) && !/(ditanami|ditutup|dicat|ditempeli)/.test(so.cerita0), nama + ' kata kunci keliling');
      if (so.jenis === 'luas') cek(/(bagian dalam|ditutup|dicat|seluruh permukaan)/.test(so.cerita0) && !/(tepi|dipagari|mengelilingi)/.test(so.cerita0), nama + ' kata kunci luas');
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      cek(pengecoh.length === t - 1 && new Set(pengecoh).size === pengecoh.length, nama + ' jumlah pengecoh ' + pengecoh.length);
      const terlarang = new Set(penting.concat([so.kunci, so.kel || 0, so.luas || 0, so.besar || 0, so.pojok || 0]));
      pengecoh.forEach((p) => cek(!terlarang.has(p), nama + ' pengecoh sama angka penting ' + p));
      cek(JSON.stringify(so.angkaPengecoh) === JSON.stringify(pengecoh), nama + ' angkaPengecoh tidak cocok');
      // gambar: 3 denah (tepi, isi, L), tepat satu cocok dengan jenis; ukuran sesuai soal
      cek(so.gambar.pilihan.length === 3 && new Set(so.gambar.pilihan.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      cek(so.gambar.benar === ADA[so.jenis] && so.gambar.pilihan.filter((p) => p.mode === ADA[so.jenis]).length === 1, nama + ' gambar benar tepat satu');
      so.gambar.pilihan.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d{2,}/.test(p.ket) && p.p === so.a && p.l === so.b, nama + ' svg ' + p.id);
        const petak = (p.svg.match(/<rect [^>]*stroke="#9AA6C0"/g) || []).length;
        cek(petak === so.a * so.b, nama + ' jumlah petak gambar ' + petak);
      });
      cek(so.cek.includes('<b>' + M.fmt(so.kunci) + '</b>'), nama + ' cek tidak memuat kunci');
      // rentang tingkat
      const R = D.LEVEL[t], isCont = D.CONTOH.some((x) => x.jenis === so.jenis && x.t === t && x.ti === so.ti && x.a === so.a && x.b === so.b && (x.c || 0) === (so.c || 0));
      if (!isCont) {
        if (so.jenis === 'gabungan') cek(so.a >= R.P[0] && so.a <= R.P[1] && so.b >= R.Q[0] && so.b <= R.Q[1] && so.c >= R.c[0] && so.c <= R.c[1] && so.d >= R.d[0] && so.d <= R.d[1], nama + ' di luar rentang');
        else cek(so.a >= R.p[0] && so.a <= R.p[1] && so.b >= R.l[0] && so.b <= R.l[1], nama + ' di luar rentang');
      }
      if (idx < 5) { s[so.jenis]++; s.kunciMaks = Math.max(s.kunciMaks, so.kunci); if (isCont) s.contoh++; }
    });
  }
}
// contoh muncul hanya di tingkat 1 (sekitar 12% per jenis)
const f1 = stat[1].contoh / (stat[1].keliling + stat[1].luas + stat[1].gabungan);
cek(f1 > 0.03 && f1 < 0.25, 'contoh t1 muncul ' + (f1 * 100).toFixed(1) + '%');
cek([2, 3].every((t) => ['keliling', 'luas', 'gabungan'].every((j) => stat[t][j] > 0)), 'semua jenis muncul di t2 dan t3');
console.log('Statistik per tingkat:', JSON.stringify(stat));
console.log(gagal ? 'GAGAL: ' + gagal + ' pemeriksaan' : 'Semua pemeriksaan Soal Cerita Bab 11 lolos.');
process.exit(gagal ? 1 : 0);
