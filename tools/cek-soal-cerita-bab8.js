// Cek logika 📖 Soal Cerita Kelas 4 Bab 8 (Sudut): node tools/cek-soal-cerita-bab8.js
// Kunci dihitung ulang dengan cara lain, dari TEKS cerita yang tampil:
//  - jenis sudut: lewat tanda (d - 90) dan (d - 180), bukan urutan if seperti di kode soal;
//  - arah: derajat mata angin (U 0, T 90, S 180, B 270) ditambah / dikurangi lalu mod 360;
//  - total derajat putaran: jumlah derajat pecahan di teks (360 dibagi 4, 2, atau 360 x 3/4).
// Juga: cerita0 tanpa digit, pilihan unik & bersebab, 3 gambar dengan tepat satu yang cocok (atribut data-* di SVG), angka pengecoh (T3),
// contoh video ~12% (T2), jebakan (90 bukan lancip, lupa menjumlah, mengurangi, arah sebaliknya, berhenti di putaran pertama).
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-8/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

const jenisDariTanda = (d) => { const a = Math.sign(d - 90), b = Math.sign(d - 180); return b === 0 ? 'lurus' : a < 0 ? 'lancip' : a === 0 ? 'siku-siku' : 'tumpul'; };
const NAMA_BEARING = { 0: 'Utara', 90: 'Timur', 180: 'Selatan', 270: 'Barat' };
const BEARING = { Utara: 0, Timur: 90, Selatan: 180, Barat: 270 };
const putarDerajat = (b, d, kanan) => (((b + (kanan ? d : -d)) % 360) + 360) % 360;
const DERAJAT_PECAH = { '¼': 360 / 4, '½': 360 / 2, '¾': (360 * 3) / 4 };
const idxJenis = (d) => ['lancip', 'siku-siku', 'tumpul', 'lurus'].indexOf(jenisDariTanda(d));

// contoh video
cek(jenisDariTanda(70 + 40) === 'tumpul' && 70 + 40 === 110, 'contoh pintu kelas');
cek(jenisDariTanda(50 + 40) === 'siku-siku', 'contoh pintu 90');
cek(NAMA_BEARING[putarDerajat(putarDerajat(BEARING.Selatan, 180, true), 90, true)] === 'Timur' && 180 + 90 === 270, 'contoh Pak Tani');
cek(jenisDariTanda(90) === 'siku-siku' && jenisDariTanda(89) === 'lancip' && jenisDariTanda(180) === 'lurus' && jenisDariTanda(91) === 'tumpul', 'batas jenis');

const RONDE = 800, stat = {};
const g = M.untuk(D);
for (let t = 1; t <= 3; t++) {
  const s = stat[t] = { soal: 0, sudut: 0, putar: 0, jenis: 0, jumlah: 0, sisa: 0, busur: 0, arah: 0, derajat: 0, dua: 0, kananKiri: 0, kiri: 0, contoh: 0, dis: 0, batas90: 0, lupa: 0, kurang: 0, balik: 0, pertama: 0, dua5: 0, satuJenis: [0, 0, 0, 0], maks: 0 };
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.kode)).size === 5, 'ronde 5 soal unik t' + t);
    cek(new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde memuat kedua jenis t' + t);
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so) => {
      const nama = 't' + t + ' ' + so.kode;
      s.soal++; s[so.jenis]++;
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 memuat digit: ' + so.cerita0);
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1, nama + ' satu kalimat tanya');
      cek(pengecoh.length === so.angkaPengecoh.length, nama + ' angka pengecoh tercatat');
      if (t === 3) cek(pengecoh.length >= 1 && pengecoh.length <= 2, nama + ' T3 harus 1-2 angka pengecoh'); else cek(pengecoh.length === 0, nama + ' pengecoh hanya T3');
      pengecoh.forEach((x) => { s.dis++; cek(!penting.some((p) => p.nilai === x.nilai) && Number(x.t) === x.nilai, nama + ' pengecoh sama dengan angka penting'); });
      cek(JSON.stringify(penting.map((x) => x.nilai)) === JSON.stringify(so.angkaPenting), nama + ' angkaPenting');
      const teks = so.segmen.map((x) => x.t).join('');
      s.maks = Math.max(s.maks, ...penting.map((x) => x.nilai));
      // ----- pilihan -----
      cek(new Set(so.opsi).size === so.opsi.length && so.opsi.includes(so.kunci), nama + ' opsi unik & memuat kunci');
      cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
      so.opsi.forEach((o) => cek(so.labelOpsi[o], nama + ' label opsi ' + o));
      cek(new Set(so.opsi.map((o) => so.labelOpsi[o])).size === so.opsi.length, nama + ' label unik');
      so.opsi.filter((o) => o !== so.kunci).forEach((o) => cek(typeof so.sebab[o] === 'string' && so.sebab[o].length > 20, nama + ' pengecoh tanpa sebab ' + o));
      const labelKunci = so.labelOpsi[so.kunci];
      const pil = so.gambar.pilihan;
      cek(pil.length === 3 && new Set(pil.map((p) => p.id)).size === 3, nama + ' 3 gambar');
      let cocok;
      if (so.jenis === 'sudut') {
        const deg = [...teks.matchAll(/(\d+)°/g)].map((m) => Number(m[1]));
        let d, bagian, susun = 'seq', total = '';
        if (so.mode === 'jenis') {
          s.jenis++; d = deg[0]; cek(deg.length === 1 && t === 1, nama + ' jenis hanya T1');
          cek(labelKunci === { lancip: 'Lancip', 'siku-siku': 'Siku-siku', tumpul: 'Tumpul', lurus: 'Lurus' }[jenisDariTanda(d)], nama + ' kunci jenis ' + labelKunci + ' utk ' + d);
          cek(so.opsi.length === 4, nama + ' 4 jenis'); s.satuJenis[so.kunci - 1]++;
          if (d === 90 && so.opsi.includes(1)) s.batas90++;
          bagian = [d];
        } else {
          if (so.mode === 'jumlah') {
            s.jumlah++; cek(deg.length === 2 && t >= 2, nama + ' jumlah dua bukaan T2-T3');
            d = deg[0] + deg[1]; cek(d <= 180 && d >= 30, nama + ' total <= 180: ' + d); bagian = [deg[0], deg[1]];
            so.opsi.forEach((o) => { if (o === so.kunci) return; const dd = Math.floor(o / 10); if (dd === deg[0] || dd === deg[1]) s.lupa++; if (dd === Math.abs(deg[0] - deg[1])) s.kurang++; });
          } else if (so.mode === 'sisa') {
            s.sisa++; cek(deg.length === 2 && t === 3, nama + ' sisa T3'); cek(deg[0] === 90 || deg[0] === 180, nama + ' total 90 atau 180');
            d = deg[0] - deg[1]; cek(d >= 10, nama + ' sisa positif'); bagian = [deg[1]]; susun = 'sisa'; total = String(deg[0]);
          } else {
            s.busur++;
            const sk = /yaitu (\d+) dan (\d+)\./.exec(teks).slice(1).map(Number);
            cek(t === 3 && sk[0] + sk[1] === 180, nama + ' busur dua skala jumlah 180');
            const sempit = /lebih sempit/.test(teks); d = sempit ? Math.min(...sk) : Math.max(...sk);
            cek(sempit ? d < 90 : d > 90, nama + ' busur jenis'); bagian = [d];
          }
          cek(labelKunci === d + '°, ' + jenisDariTanda(d), nama + ' kunci ' + labelKunci + ' != ' + d + '°, ' + jenisDariTanda(d));
          cek(so.opsi.length === 4, nama + ' 4 opsi');
          so.opsi.forEach((o) => { if (o !== so.kunci && Math.floor(o / 10) === d && o % 10 !== idxJenis(d)) s.batas90++; });
        }
        cocok = pil.filter((p) => {
          const m = /data-model="(\w+)" data-susun="(\w+)" data-bagian="([\d,]*)" data-total="(\d*)"/.exec(p.svg);
          return m && m[1] === 'sudut' && m[2] === susun && m[3] === bagian.join(',') && m[4] === total;
        });
      } else {
        const fr = [...teks.matchAll(/(¼|½|¾) putaran ke (kanan|kiri)/g)].map((m) => ({ d: DERAJAT_PECAH[m[1]], kanan: m[2] === 'kanan' }));
        const mulai = BEARING[/menghadap ke (Utara|Timur|Selatan|Barat)/.exec(teks)[1]];
        cek(fr.length === so.langkah.length && fr.length === so.angkaPenting.length, nama + ' jumlah putaran di teks');
        cek(fr.every((l, i) => l.d === so.langkah[i].d && l.kanan === so.langkah[i].kanan), nama + ' langkah sesuai teks');
        cek(penting.every((x, i) => x.nilai === fr[i].d && DERAJAT_PECAH[x.t] === fr[i].d), nama + ' token pecahan');
        let b = mulai; fr.forEach((l) => { b = putarDerajat(b, l.d, l.kanan); });
        const tot = fr.reduce((p, l) => p + l.d, 0);
        if (fr.some((l) => !l.kanan)) s.kiri++;
        let bb = mulai; fr.forEach((l) => { bb = putarDerajat(bb, l.d, !l.kanan); });
        const b1 = putarDerajat(mulai, fr[0].d, fr[0].kanan);
        if (so.mode === 'arah') {
          s.arah++; cek(labelKunci === NAMA_BEARING[b], nama + ' kunci arah ' + labelKunci + ' != ' + NAMA_BEARING[b]);
          cek(so.opsi.length === 4 && so.opsi.every((o) => ['Utara', 'Timur', 'Selatan', 'Barat'].includes(so.labelOpsi[o])), nama + ' 4 arah');
          if (fr.length === 2 && fr[0].kanan !== fr[1].kanan) { s.kananKiri++; cek(t === 3, nama + ' kanan-kiri T3'); } else cek(fr.length === 1 && t === 1, nama + ' arah T1 satu putaran');
          if (bb !== b) s.balik++;
          if (fr.length > 1 && b1 !== b) s.pertama++;
          if (fr.length > 1) cek(so.sebab[so.opsi.find((o) => so.labelOpsi[o] === NAMA_BEARING[b1] && NAMA_BEARING[b1] !== NAMA_BEARING[b])] === undefined || /putaran pertama/.test(so.sebab[so.opsi.find((o) => so.labelOpsi[o] === NAMA_BEARING[b1] && NAMA_BEARING[b1] !== NAMA_BEARING[b])] || 'putaran pertama'), nama + ' sebab putaran pertama');
        } else if (so.mode === 'derajat') {
          s.derajat++; cek(t === 1 && fr.length === 1 && labelKunci === tot + '°', nama + ' kunci derajat ' + labelKunci + ' != ' + tot);
          cek(so.opsi.length === 4, nama + ' 4 opsi derajat');
          if (so.opsi.some((o) => o === (fr[0].d / 90) * 25)) s.dua5++;
        } else {
          s.dua++; cek(t === 2 && fr.length === 2 && fr[0].kanan === fr[1].kanan, nama + ' dua searah T2');
          cek(labelKunci === NAMA_BEARING[b] + ', ' + tot + '°', nama + ' kunci dua ' + labelKunci + ' != ' + NAMA_BEARING[b] + ', ' + tot);
          cek(tot <= 270, nama + ' total <= 270');
          if (so.opsi.some((o) => so.labelOpsi[o] === NAMA_BEARING[b1] + ', ' + fr[0].d + '°')) s.pertama++;
        }
        cocok = pil.filter((p) => {
          const m = /data-model="(\w+)" data-start="(\w+)" data-langkah="([RL\d,]+)"/.exec(p.svg);
          return m && m[1] === 'mawar' && BEARING[m[2]] === mulai && m[3] === fr.map((l) => (l.kanan ? 'R' : 'L') + l.d).join(',');
        });
      }
      cek(cocok.length === 1 && cocok[0].id === so.gambar.benar, nama + ' tepat satu gambar cocok (' + cocok.map((p) => p.id) + ')');
      pil.forEach((p) => cek(/^<svg[\s\S]*<\/svg>$/.test(p.svg) && !/NaN|undefined/.test(p.svg), nama + ' svg rusak ' + p.id));
      if (D.CONTOH.some((c) => (c.xs && so.jenis === 'sudut' && c.tp === so.tp && c.nama === so.nama && JSON.stringify(c.xs) === JSON.stringify([so.a, so.b])) || (c.subjek && so.jenis === 'putar' && c.subjek === so.subjek && c.start === so.start && JSON.stringify(c.langkah) === JSON.stringify(so.langkah)))) s.contoh++;
    });
  }
}

for (let t = 1; t <= 3; t++) {
  const s = stat[t];
  console.log('T' + t, JSON.stringify(s));
  const pct = s.contoh / s.soal;
  cek(s.sudut > 0 && s.putar > 0, 'T' + t + ' harus ada kedua jenis');
  cek(t === 2 ? pct > 0.03 && pct < 0.25 : pct < 0.02, 'T' + t + ' contoh video ~12% (sengaja hanya T2): ' + pct);
  cek(s.maks <= 360, 'T' + t + ' maks');
}
cek(stat[1].jenis > 0 && stat[1].batas90 > 0 && stat[1].satuJenis.every((n) => n > 0) && stat[1].arah > 0 && stat[1].derajat > 0 && stat[1].kiri > 0 && stat[1].dua5 > 0, 'sebaran T1');
cek(stat[2].jumlah > 0 && stat[2].dua > 0 && stat[2].lupa > 0 && stat[2].kurang > 0 && stat[2].batas90 > 0 && stat[2].pertama > 0, 'sebaran T2 (lupa menjumlah, mengurangi, jenis di batas, berhenti di putaran pertama)');
cek(stat[3].sisa > 0 && stat[3].busur > 0 && stat[3].jumlah > 0 && stat[3].kananKiri > 0 && stat[3].balik > 0 && stat[3].pertama > 0 && stat[3].dis > 0, 'sebaran T3');
if (gagal) { console.log('TOTAL GAGAL: ' + gagal); process.exit(1); }
console.log('Semua cek Soal Cerita Bab 8 lulus.');
