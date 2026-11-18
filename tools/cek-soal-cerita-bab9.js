// Cek logika 📖 Soal Cerita Kelas 4 Bab 9 (Garis & Sudut): node tools/cek-soal-cerita-bab9.js
// Kunci dihitung ulang dengan cara lain, dari TEKS cerita yang tampil:
//  - lurus: pilihan yang bersama sudut-sudut di teks berjumlah tepat 180 (bukan rumus 180 - jumlah);
//  - silang: dua garis pada arah 0 dan x derajat; empat sinar 0, x, 180, 180 + x; besar tiap sudut = selisih sinar berurutan;
//  - sejajar: relasi tiap pasang dibaca dari kalimat ("tidak pernah bertemu" / sudut 90 / sudut lain), lalu pasangan dihitung.
// Juga: cerita0 tanpa digit, pilihan unik & bersebab, 3 gambar dengan tepat satu yang cocok (atribut data-* di SVG),
// angka pengecoh (T3), contoh video ~12%, jebakan (360, 90, lupa satu sudut, jumlah saja, seberang 180 - x, sebelah sama).
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-9/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// contoh video
cek(180 - 40 - 85 === 55, 'contoh Tali Lampu');
cek(JSON.stringify([55, 180 - 55, 180 - 55]) === '[55,125,125]' && 55 + 125 + 55 + 125 === 360, 'contoh perempatan');
cek(JSON.stringify([70, 110, 110]) === '[70,110,110]' && 70 + 110 + 70 + 110 === 360, 'contoh penggaris');

// besar empat sudut dua garis bersilang (garis 1 arah 0, garis 2 arah x): [diketahui, sebelah, seberang, sebelah]
function empatSudut(x) {
  const sinar = [0, x, 180, 180 + x, 360];
  const b = []; for (let i = 0; i < 4; i++) b.push(sinar[i + 1] - sinar[i]);
  return b;
}
cek(JSON.stringify(empatSudut(55)) === '[55,125,55,125]', 'empatSudut');
// jumlah pasang dari daftar relasi
const hitung = (rel) => [rel.filter((r) => r === 'sejajar').length, rel.filter((r) => r === 'tegak').length];

const RONDE = 800, stat = {};
const g = M.untuk(D);
for (let t = 1; t <= 3; t++) {
  const s = stat[t] = { soal: 0, lurus: 0, silang: 0, sejajar: 0, seberang: 0, sebelah: 0, semua: 0, contoh: 0, dis: 0, k360: 0, k90: 0, lupa: 0, jumlah: 0, terbalik: 0, samaSebelah: 0, patah: 0, salahTanda: 0, miring: 0 };
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5 && new Set(ronde.map((x) => x.kode)).size === 5, 'ronde 5 soal unik t' + t);
    cek(new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde memuat dua jenis t' + t);
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
      penting.forEach((x) => cek(x.t === x.nilai + '°', nama + ' token derajat'));
      const teks = so.segmen.map((x) => x.t).join('');
      const deg = [...teks.matchAll(/(\d+)°/g)].map((m) => Number(m[1]));
      deg.forEach((v) => cek(v > 0 && v <= 180, nama + ' derajat di luar 1-180: ' + v));
      // ----- pilihan -----
      cek(new Set(so.opsi).size === so.opsi.length && so.opsi.length === 4 && so.opsi.includes(so.kunci), nama + ' 4 opsi unik memuat kunci');
      so.opsi.filter((o) => o !== so.kunci).forEach((o) => cek(typeof so.sebab[o] === 'string' && so.sebab[o].length > 20, nama + ' pengecoh tanpa sebab ' + o));
      if (so.labelOpsi) {
        so.opsi.forEach((o) => cek(so.labelOpsi[o], nama + ' label opsi ' + o));
        cek(new Set(so.opsi.map((o) => so.labelOpsi[o])).size === 4, nama + ' label unik');
      }
      const labelKunci = so.labelOpsi ? so.labelOpsi[so.kunci] : so.kunci + '°';
      cek(so.cek.includes('<b>' + labelKunci + '</b>'), nama + ' cek memuat jawaban');
      const pil = so.gambar.pilihan;
      cek(pil.length === 3 && new Set(pil.map((p) => p.id)).size === 3, nama + ' 3 gambar');
      pil.forEach((p) => cek(/^<svg[\s\S]*<\/svg>$/.test(p.svg) && !/NaN|undefined/.test(p.svg), nama + ' svg rusak ' + p.id));
      let cocok;
      if (so.jenis === 'lurus') {
        cek(deg.length === t, nama + ' jumlah sudut diketahui = tingkat');
        const jum = deg.reduce((p, q) => p + q, 0);
        const sisa = so.opsi.filter((o) => jum + o === 180);
        cek(sisa.length === 1 && sisa[0] === so.kunci, nama + ' kunci lurus ' + so.kunci + ' untuk ' + deg);
        cek(jum <= 160 && so.kunci >= 20, nama + ' sisa minimal 20');
        so.opsi.forEach((o) => {
          if (o === so.kunci) return;
          if (o === 360 - jum) s.k360++;
          if (o === 90 - jum) s.k90++;
          if (deg.length > 1 && deg.some((k) => o === 180 - k)) s.lupa++;
          if (o === jum) s.jumlah++;
        });
        cocok = pil.filter((p) => { const m = /data-model="lurus" data-bagian="([\d,]*)" data-lurus="(\d)"/.exec(p.svg); return m && m[1] === deg.join(',') && m[2] === '1'; });
        s.patah += pil.filter((p) => /data-lurus="0"/.test(p.svg)).length;
      } else if (so.jenis === 'silang') {
        cek(deg.length === 1, nama + ' satu sudut diketahui');
        const x = deg[0], b = empatSudut(x);
        cek(b.reduce((p, q) => p + q, 0) === 360, nama + ' empat sudut 360');
        let mode;
        if (/berseberangan/.test(teks)) { mode = 'seberang'; cek(so.kunci === b[2], nama + ' kunci seberang ' + so.kunci + ' != ' + b[2]); s.seberang++; }
        else if (/di sebelah sudut itu/.test(teks)) { mode = 'sebelah'; cek(so.kunci === b[1], nama + ' kunci sebelah ' + so.kunci + ' != ' + b[1]); s.sebelah++; }
        else {
          mode = 'semua'; s.semua++;
          cek(t === 3 && labelKunci === b[2] + '°, ' + b[1] + '°, ' + b[3] + '°', nama + ' kunci semua ' + labelKunci + ' utk ' + x);
          so.opsi.forEach((o) => { if (o === so.kunci) return; const p = Math.floor(o / 1000), q = o % 1000; if (p === b[1] && q === b[0]) s.terbalik++; if (q === x) s.samaSebelah++; });
        }
        cek((t === 3) === (mode === 'semua'), nama + ' mode sesuai tingkat');
        if (mode === 'seberang') so.opsi.forEach((o) => { if (o === b[1]) s.terbalik++; });
        if (mode === 'sebelah') so.opsi.forEach((o) => { if (o === x) s.samaSebelah++; });
        cocok = pil.filter((p) => { const m = /data-model="silang" data-x="(\d+)" data-tanda="(\w+)"/.exec(p.svg); return m && Number(m[1]) === x && m[2] === mode; });
        s.salahTanda += pil.filter((p) => /data-model="silang"/.test(p.svg) && !cocok.includes(p)).length;
      } else {
        // relasi dari kalimat
        const kalimat = teks.split(/\.\s+/);
        const nm = so.nama3, rel = {};
        const kunciPasang = (a, b) => [a, b].sort().join('|');
        const sebut = (k) => nm.filter((n) => k.includes(n));
        let tegakTrans = 0;
        kalimat.forEach((k) => {
          let m;
          if (/tidak pernah bertemu/.test(k)) { const p = sebut(k); cek(p.length === 2, nama + ' sejajar dua nama'); rel[kunciPasang(p[0], p[1])] = 'sejajar'; }
          else if ((m = /(\w+) dan (?:Jalan|Rel|Selokan) (\w+) berpotongan dengan sudut (\d+)°/.exec(k.replace(/^(Jalan|Rel|Selokan) /, '')))) rel[kunciPasang(m[1], m[2])] = Number(m[3]) === 90 ? 'tegak' : 'miring';
          else if ((m = /memotong (?:Jalan|Rel|Selokan) (\w+) dengan sudut (\d+)°(?: dan memotong (?:Jalan|Rel|Selokan) (\w+) dengan sudut (\d+)°)?/.exec(k))) {
            const dari = /^(?:Jalan|Rel|Selokan) (\w+) memotong/.exec(k) || /^(?:Jalan|Rel|Selokan) (\w+) memotong/.exec(k.replace(/^.*?\.\s*/, ''));
            const pemotong = nm.find((n) => new RegExp('(?:Jalan|Rel|Selokan) ' + n + ' memotong').test(k));
            cek(!!pemotong, nama + ' pemotong'); void dari;
            rel[kunciPasang(pemotong, m[1])] = Number(m[2]) === 90 ? 'tegak' : 'miring';
            if (m[3]) rel[kunciPasang(pemotong, m[3])] = Number(m[4]) === 90 ? 'tegak' : 'miring';
            tegakTrans++;
          }
        });
        cek(Object.keys(rel).length === 3, nama + ' tiga pasang terbaca: ' + JSON.stringify(rel) + ' | ' + teks);
        const [sj, tg] = hitung(Object.values(rel));
        cek(t === 1, nama + ' sejajar hanya T1');
        cek(labelKunci === sj + ' pasang sejajar, ' + tg + ' pasang tegak lurus', nama + ' kunci sejajar ' + labelKunci + ' != ' + sj + ',' + tg);
        cek(sj + tg <= 3, nama + ' maks 3 pasang');
        if (sj === 1 && tg === 2) s.contohBentuk = (s.contohBentuk || 0) + 1;
        if (Object.values(rel).includes('miring')) s.miring++;
        so.opsi.forEach((o) => { if (o !== so.kunci) { const lb = so.labelOpsi[o]; const mm = /(\d) pasang sejajar, (\d) pasang tegak lurus/.exec(lb); cek(mm && Number(mm[1]) + Number(mm[2]) <= 3, nama + ' opsi mustahil ' + lb); if (mm && Number(mm[1]) === tg && Number(mm[2]) === sj && sj !== tg) s.terbalik++; } });
        cocok = pil.filter((p) => { const m = /data-model="denah" data-s="(\d)" data-t="(\d)"/.exec(p.svg); return m && Number(m[1]) === sj && Number(m[2]) === tg; });
      }
      cek(cocok.length === 1 && cocok[0].id === so.gambar.benar, nama + ' tepat satu gambar cocok (' + cocok.map((p) => p.id) + ')');
      const cx = D.CONTOH.some((c) => c.jenis === so.jenis && ((c.xs && JSON.stringify(c.xs) === JSON.stringify(so.xs) && c.tp === so.tp) || (c.x && c.x === so.x && c.tp === so.tp && so.mode === 'semua') || (c.cfg && c.cfg === so.cfg && c.nama3.join() === so.nama3.join() && c.kind === so.kind)));
      if (so.dariContoh) { cek(cx, nama + ' penanda contoh harus cocok dengan CONTOH'); s.contoh++; }
    });
  }
}

for (let t = 1; t <= 3; t++) {
  const s = stat[t];
  console.log('T' + t, JSON.stringify(s));
  const pct = s.contoh / s.soal;
  cek(pct > 0.03 && pct < 0.25, 'T' + t + ' contoh video ~12%: ' + pct);
}
cek(stat[1].sejajar > 0 && stat[1].lurus > 0 && stat[1].silang === 0 && stat[1].miring > 0 && stat[1].terbalik > 0 && stat[1].k360 > 0, 'sebaran T1');
cek(stat[2].lurus > 0 && stat[2].silang > 0 && stat[2].seberang > 0 && stat[2].sebelah > 0 && stat[2].lupa > 0 && stat[2].jumlah > 0 && stat[2].k360 > 0 && stat[2].k90 > 0 && stat[2].terbalik > 0 && stat[2].samaSebelah > 0, 'sebaran T2');
cek(stat[3].lurus > 0 && stat[3].semua > 0 && stat[3].lupa > 0 && stat[3].terbalik > 0 && stat[3].samaSebelah > 0 && stat[3].dis > 0 && stat[3].patah > 0 && stat[3].salahTanda > 0, 'sebaran T3');
if (gagal) { console.log('TOTAL GAGAL: ' + gagal); process.exit(1); }
console.log('Semua cek Soal Cerita Bab 9 lulus.');
