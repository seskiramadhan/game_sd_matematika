// Cek logika 📖 Soal Cerita Kelas 4 Bab 4 (Pecahan 1): node tools/cek-soal-cerita-bab4.js
// Kunci dihitung ulang dengan cara lain: data memakai KPK + perkalian ke penyebut sama; tes ini memakai perkalian silang
// (a/b lawan c/d lewat a*d dan c*b) dan pencarian penyebut bersama terkecil dengan menghitung satu per satu.
// Juga: pilihan unik & bersebab benar, 3 gambar dengan tepat satu cocok (batang sama panjang, potongan sama), cerita0 tanpa digit,
// angka pengecoh (tingkat 3) bukan angka penting, contoh video ~12%, jebakan angka besar, "sama banyak", selisih disederhanakan.
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-4/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

// ---------- pembanding independen ----------
const silang = (p, q) => { const x = p[0] * q[1], y = q[0] * p[1]; return x > y ? 1 : x < y ? -1 : 0; };
const penyebutBersama = (ds) => { for (let L = 1; ; L++) if (ds.every((d) => L % d === 0)) return L; };
const gcd = (a, b) => { let x = a, y = b; while (y) { const t = x % y; x = y; y = t; } return x; };
const teks = (h) => h.replace(/<span class="pec-a">(\d+)<\/span><span class="pec-b">(\d+)<\/span>/g, '$1/$2').replace(/<[^>]+>/g, '');
const dec = (c) => [Math.floor(c / 100), c % 100];

// contoh video
cek(silang([6, 8], [3, 4]) === 0, 'contoh jus 6/8 = 3/4');
cek(penyebutBersama([3, 4]) === 12 && 2 * 4 === 8 && 3 * 3 === 9, 'contoh pita 8/12 dan 9/12');
cek(penyebutBersama([5, 2]) === 10 && 3 * 2 === 6 && 1 * 5 === 5 && silang([3, 5], [1, 2]) === 1, 'contoh roti 6/10 dan 5/10');
// jebakan klasik: pengurangan langsung 3/4 - 2/3 -> 1/1
cek(dec(D.kode([1, 1]))[0] === 1 && (3 - 2) === 1 && (4 - 3) === 1, 'jebakan 3/4 - 2/3');

const RONDE = 1500, stat = {};
const g = M.untuk(D);
const KODE_UJI = new Set();
for (let t = 1; t <= 3; t++) {
  const s = stat[t] = { soal: 0, sama: 0, trap: 0, beda: 0, fokus: 0, contoh: 0, ctEligible: 0, sed: 0, selisih: 0, tiga: 0, hi: 0, lo: 0, langsung: 0, jumlah: 0, dua: 0 };
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde t' + t);
    const ids = D.jenisTingkat(t);
    ronde.forEach((x) => cek(ids.includes(x.jenis), 'jenis di luar tingkat t' + t));
    cek(new Set(ronde.map((x) => x.jenis)).size === new Set(ids).size, 'ronde harus memuat semua jenis tingkat t' + t);
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so) => {
      const nama = 't' + t + ' ' + so.kode;
      s.soal++;
      const fr = so.fr, n = fr.length;
      // ----- pecahan proper, penyebut <= 12, KPK <= 24 -----
      fr.forEach((f) => cek(Number.isInteger(f[0]) && Number.isInteger(f[1]) && f[0] >= 1 && f[0] < f[1] && f[1] >= 2 && f[1] <= 12, nama + ' pecahan di luar batas ' + f));
      const L = penyebutBersama(fr.map((f) => f[1]));
      cek(so.L === L && L <= 24, nama + ' penyebut bersama ' + so.L + ' != ' + L);
      const cm = fr.map((f) => f[0] * (L / f[1]));
      cek(Number.isInteger(L / fr[0][1]), nama + ' L bukan kelipatan');
      // ----- penyebut per tingkat -----
      const [d, e] = [fr[0][1], fr[1][1]];
      if (t === 1) { cek(so.jenis === 'banding' && so.mode === 'dua' && (d === e ? true : (d % e === 0 || e % d === 0)), nama + ' T1 penyebut kelipatan ' + d + ',' + e); cek(d !== e, nama + ' T1 penyebut dipilih berbeda'); }
      if (t === 2) cek(d % e !== 0 && e % d !== 0 && d !== e, nama + ' T2 kelipatan persekutuan ' + d + ',' + e);
      if (t === 3) cek(so.mode === 'tiga' || so.jenis === 'selisih', nama + ' T3 tiga tokoh atau selisih');
      cek(so.jenis === 'selisih' ? t >= 2 : true, nama + ' selisih hanya tingkat 2-3');
      cek(so.mode === 'tiga' ? t === 3 && n === 3 : n === 2, nama + ' jumlah tokoh');

      // ----- kunci dengan cara lain -----
      let benar;
      if (so.jenis === 'banding' && so.mode === 'dua') {
        s.dua++;
        const h = silang(fr[0], fr[1]);
        benar = h === 0 ? 3 : h > 0 ? 1 : 2;
        cek(so.hasil === h, nama + ' hasil');
        if (h === 0) s.sama++; else { s.beda++; const kecilAngka = (fr[0][0] > fr[1][0]) !== (h > 0); if (fr[0][0] !== fr[1][0] && kecilAngka) s.trap++; }
        cek(so.labelOpsi[3] && so.opsi.length === 3 && new Set(so.opsi).size === 3, nama + ' tiga opsi');
        cek(JSON.stringify(so.opsi.slice().sort()) === '[1,2,3]', nama + ' opsi 1 2 3');
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => {
          const sb = teks(so.sebab[o] || '');
          cek(sb.length > 20, nama + ' pengecoh tanpa sebab ' + o);
          // sebab memuat hasil konversi yang benar
          if (d !== e) cek(sb.includes(fr[0][0] + '/' + fr[0][1] + ' = ' + cm[0] + '/' + L) && sb.includes(fr[1][0] + '/' + fr[1][1] + ' = ' + cm[1] + '/' + L), nama + ' sebab salah konversi: ' + sb);
        });
        cek(teks(so.cek).includes(cm[0] + '/' + L) && teks(so.cek).includes('Jawaban: ' + so.labelOpsi[so.kunci]), nama + ' cek');
        cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
        cek(so.labelOpsi[1] === so.nama[0] && so.labelOpsi[2] === so.nama[1], nama + ' label nama');
      } else if (so.mode === 'tiga') {
        s.tiga++;
        const urut = [0, 1, 2].sort((x, y) => { const h = silang(fr[y], fr[x]); return h; }); // naik menurut nilai? sortir terbesar dulu
        const terbesar = [0, 1, 2].reduce((a, b) => (silang(fr[b], fr[a]) > 0 ? b : a));
        const terkecil = [0, 1, 2].reduce((a, b) => (silang(fr[b], fr[a]) < 0 ? b : a));
        benar = (so.paling === 'hi' ? terbesar : terkecil) + 1;
        so.paling === 'hi' ? s.hi++ : s.lo++;
        cek(so.paling === 'hi' || so.paling === 'lo', nama + ' paling');
        cek(JSON.stringify(so.opsi.slice().sort()) === '[1,2,3]' && so.opsi.length === 3, nama + ' opsi tiga');
        cek(fr.every((f, i) => fr.every((g2, j) => i === j || silang(f, g2) !== 0)), nama + ' tiga nilai berbeda');
        cek(new Set(fr.map((f) => f[1])).size >= 2, nama + ' tiga penyebut beda');
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => {
          const sb = teks(so.sebab[o] || '');
          cek(sb.length > 20 && sb.includes(fr[0][0] + '/' + fr[0][1] + ' = ' + cm[0] + '/' + L) && sb.includes(fr[2][0] + '/' + fr[2][1] + ' = ' + cm[2] + '/' + L), nama + ' sebab tiga: ' + sb);
        });
        cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
        cek(urut.length === 3, '');
      } else { // selisih
        s.selisih++;
        const h = silang(fr[0], fr[1]);
        cek(h !== 0, nama + ' selisih nol');
        const bes = h > 0 ? fr[0] : fr[1], kec = h > 0 ? fr[1] : fr[0];
        // selisih lewat perkalian silang: (a*e - c*d) / (d*e), lalu disederhanakan
        let sn = bes[0] * kec[1] - kec[0] * bes[1], sd = bes[1] * kec[1];
        const gg = gcd(sn, sd); sn /= gg; sd /= gg;
        benar = sn * 100 + sd;
        cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
        // lewat KPK
        const sk = Math.abs(cm[0] - cm[1]), gk = gcd(sk, L);
        cek(sk / gk === sn && L / gk === sd, nama + ' selisih KPK vs silang');
        cek(so.s === sk && so.g === gk, nama + ' s/g tersimpan');
        if (so.mode === 'sederhana') { s.sed++; cek(t === 3 && gk > 1, nama + ' sederhana harus bisa disederhanakan (tingkat 3)'); cek(so.tanya4.teks.includes('paling sederhana'), nama + ' soal minta paling sederhana'); cek(so.opsi.includes(sk * 100 + L), nama + ' pengecoh belum sederhana tidak ada'); }
        else cek(gk === 1 && !/paling sederhana/.test(so.tanya4.teks), nama + ' biasa harus sudah sederhana');
        cek(so.opsi.length === 4 && new Set(so.opsi).size === 4, nama + ' 4 opsi unik');
        // pengecoh: nilainya tidak boleh sama dengan kunci kecuali bentuk belum sederhana di mode sederhana
        so.opsi.filter((o) => o !== so.kunci).forEach((o) => {
          const x = dec(o), sb = teks(so.sebab[o] || '');
          const sama = x[0] * sd === sn * x[1];
          cek(!sama || (so.mode === 'sederhana' && o === sk * 100 + L), nama + ' pengecoh bernilai sama dengan kunci ' + x);
          if (/mengurangi angka atas dan angka bawah langsung/.test(sb)) cek(x[0] === Math.abs(bes[0] - kec[0]) && x[1] === Math.abs(bes[1] - kec[1]), nama + ' sebab langsung'), s.langsung++;
          if (/belum boleh langsung dikurangi/.test(sb)) cek(x[0] === Math.abs(bes[0] - kec[0]) && x[1] === Math.max(fr[0][1], fr[1][1]), nama + ' sebab lupa menyamakan');
          if (/pecahan yang lebih besar saja/.test(sb)) cek(x[0] * L === Math.max(cm[0], cm[1]) * x[1], nama + ' sebab besar saja');
          if (/belum paling sederhana/.test(sb)) cek(x[0] === sk && x[1] === L, nama + ' sebab belum sederhana');
          if (/hasil menjumlah/.test(sb)) cek(x[0] === cm[0] + cm[1] && x[1] === L, nama + ' sebab menjumlah'), s.jumlah++;
          cek(sb.length > 15, nama + ' pengecoh tanpa sebab');
        });
        cek(so.labelOpsi[so.kunci] === D.pc(sn, sd) && so.cek.includes('<b>' + D.pc(sn, sd) + '</b>'), nama + ' label/cek kunci');
        so.opsi.forEach((o) => { const x = dec(o); cek(x[0] >= 1 && x[1] >= 1 && o === x[0] * 100 + x[1] && so.labelOpsi[o] === D.pc(x[0], x[1]), nama + ' label opsi ' + o); });
        cek(so.nama.length === 2, nama + ' nama');
      }
      cek(so.kunci === benar, nama + ' kunci ' + so.kunci + ' != ' + benar);
      cek(so.opsi.filter((o) => o === so.kunci).length === 1, nama + ' kunci tepat satu');
      cek(!so.sebab[so.kunci], nama + ' kunci punya sebab salah');
      Object.keys(so.sebab).forEach((k) => cek(so.opsi.includes(Number(k)), nama + ' sebab non-opsi ' + k));
      cek(so.cek.length > 40 && /Utuhnya sama besar/.test(so.cek), nama + ' cek');

      // ----- cerita & segmen -----
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 ada digit');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada: ' + k));
      so.segmen.filter((x) => x.k !== 'angka').forEach((x) => cek(!/\d/.test(x.t), nama + ' teks segmen ada digit: ' + x.t));
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1 && so.segmen[so.segmen.length - 1].k === 'tanya', nama + ' satu kalimat tanya di akhir');
      cek(so.segmen[so.segmen.length - 1].t === so.tanya4.teks && so.cerita0.endsWith(so.tanya4.teks), nama + ' tanya = tanya4 = akhir cerita0');
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      cek(JSON.stringify(penting.map((x) => x.nilai)) === JSON.stringify(fr), nama + ' angka penting != pecahan');
      cek(JSON.stringify(so.angkaPenting) === JSON.stringify(fr), nama + ' angkaPenting');
      penting.forEach((x) => cek(teks(x.t) === x.nilai[0] + '/' + x.nilai[1], nama + ' teks angka penting'));
      if (t < 3) cek(pengecoh.length === 0, nama + ' tingkat <3 tanpa pengecoh');
      else cek(pengecoh.length >= 1 && pengecoh.length <= 2, nama + ' tingkat 3 butuh 1-2 pengecoh: ' + pengecoh.length);
      const pn = pengecoh.map((x) => x.nilai);
      const dilarang = new Set(fr.flat().concat([L, so.s, so.g].filter((v) => v), cm));
      pn.forEach((p) => cek(!dilarang.has(p) && p >= 13, nama + ' pengecoh sama dengan angka penting ' + p));
      cek(new Set(pn).size === pn.length, nama + ' pengecoh kembar');
      cek(JSON.stringify(so.angkaPengecoh) === JSON.stringify(pn), nama + ' angkaPengecoh tidak cocok');
      // nama tokoh unik
      cek(new Set(so.nama).size === so.nama.length, nama + ' nama kembar');

      // ----- gambar: tepat satu cocok -----
      const gp = so.gambar.pilihan;
      cek(gp.length === 3 && new Set(gp.map((p) => p.id)).size === 3, nama + ' 3 pilihan gambar');
      cek(so.gambar.benar === 'b4-sama' && gp.filter((p) => p.id === so.gambar.benar).length === 1, nama + ' gambar benar tepat satu');
      cek(new Set(gp.map((p) => p.svg)).size === 3, nama + ' svg kembar');
      gp.forEach((p) => {
        cek(p.svg.startsWith('<svg') && p.svg.endsWith('</svg>') && !/\d/.test(p.ket) && !/<text[^>]*>\d/.test(p.svg), nama + ' svg ' + p.id);
        const lebar = (p.svg.match(/<rect x="20" y="[\d.]+" width="([\d.]+)" height="\d+" rx="5"/g) || []).map((x) => Number(x.match(/width="([\d.]+)"/)[1]));
        const garis = (p.svg.match(/<line /g) || []).length;
        cek(lebar.length === n, nama + ' jumlah batang ' + p.id);
        if (p.id === 'b4-sama') {
          cek(lebar.every((w) => w === 280), nama + ' batang benar harus sama panjang');
          cek(garis === n * (L - 1), nama + ' potongan benar = ' + n + ' x ' + (L - 1) + ' garis, ada ' + garis);
          cek(p.L === L, nama + ' meta L');
        } else if (p.id === 'b4-beda') cek(new Set(lebar).size > 1, nama + ' batang salah harus beda panjang');
        else {
          const semuaSama = fr.every((f) => f[1] === L);
          cek(lebar.every((w) => w === 280), nama + ' tak-sama panjang sama');
          cek(garis === fr.reduce((a, f) => a + f[1] - 1, 0), nama + ' tak-sama garis ' + garis);
          if (semuaSama) cek(/stroke-width="2.4"|1.6/.test(p.svg), nama + ' tak-sama');
        }
      });
      if (so.jenis === 'selisih') cek(gp.every((p) => p.svg.includes('?')), nama + ' selisih ditandai');
      else cek(gp.every((p) => !p.svg.includes('>?<')), nama + ' banding tanpa tanda ?');

      // ----- statistik -----
      if (so.fokus) s.fokus++;
      const ct = D.CONTOH.some((c) => c.tp === so.tp && c.jenis === so.jenis && c.tingkat === t && JSON.stringify(c.f) === JSON.stringify(fr) && JSON.stringify(c.nama) === JSON.stringify(so.nama));
      if (ct) s.contoh++;
      KODE_UJI.add(so.kode);
    });
  }
}
// ---------- ringkasan statistik ----------
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
for (let t = 1; t <= 3; t++) {
  const s = stat[t];
  const eligible = s.soal;
  console.log('Tingkat ' + t + ': ' + s.soal + ' soal | banding2 ' + s.dua + ' (sama ' + pct(s.sama, s.dua) + '%, jebakan angka ' + pct(s.trap, s.beda) + '% dari beda) | tiga ' + s.tiga + ' (paling banyak/sedikit ' + s.hi + '/' + s.lo + ') | selisih ' + s.selisih + ' (disederhanakan ' + pct(s.sed, s.selisih) + '%) | contoh video ' + pct(s.contoh, eligible) + '% | penyebut 6/7/8/12 ' + pct(s.fokus, eligible) + '%');
}
cek(stat[1].selisih === 0 && stat[1].tiga === 0 && stat[1].dua === stat[1].soal, 'tingkat 1 hanya banding dua tokoh');
cek(stat[2].tiga === 0 && stat[2].selisih > 0 && stat[2].dua > 0 && stat[2].sed === 0, 'tingkat 2 banding + selisih tanpa sederhanakan');
cek(stat[3].tiga > 0 && stat[3].selisih > 0 && stat[3].sed > 0, 'tingkat 3 tiga tokoh + selisih (sederhanakan)');
cek(stat[1].sama / stat[1].dua > 0.12 && stat[2].sama / stat[2].dua > 0.05, '"sama banyak" cukup sering');
cek(stat[1].trap / stat[1].beda > 0.25, 'jebakan angka besar cukup sering di tingkat 1');
cek(stat[2].langsung > 0 && stat[3].langsung > 0, 'pengecoh kurang langsung muncul');
cek(KODE_UJI.size > 200, 'variasi soal cukup: ' + KODE_UJI.size);
const j = (a, b, c) => pct(a, b) >= 6 && pct(a, b) <= 25;
cek(j(stat[1].contoh, stat[1].soal) && j(stat[2].contoh, stat[2].soal), 'contoh video ~12%');
cek(stat[1].fokus / stat[1].soal > 0.45 && stat[2].fokus / stat[2].soal > 0.45, 'penekanan 6/7/8/12');

if (gagal) { console.log('\n' + gagal + ' pemeriksaan GAGAL'); process.exit(1); }
console.log('\nSemua pemeriksaan Soal Cerita Bab 4 LULUS (' + (3 * RONDE * 6) + ' soal, ' + KODE_UJI.size + ' kode berbeda).');
