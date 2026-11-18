// Cek logika 📖 Soal Cerita Kelas 4 Bab 1 (Bilangan Cacah): node tools/cek-soal-cerita-bab1.js
// Kunci dihitung ulang dengan cara lain, dari TEKS yang tampil di cerita (titik ribuan dibuang):
//  - banding : bandingkan teks per digit dari kiri (rata kanan dengan nol di depan), berhenti di angka pertama yang berbeda;
//  - taksir  : pembulatan lewat sisa bagi (sisa >= setengah tempat), lalu jumlah / selisih / bandingkan dengan uang.
// Juga: cerita0 tanpa digit, bilangan <= 100.000, pilihan unik & bersebab, 3 gambar dengan tepat satu yang cocok (tabel: judul & digit; garis: tempat & batas),
// angka pengecoh (tingkat 3), contoh video ~12%, jebakan (urutan beda, banyak angka beda, hitung pas, bulat ke bawah, hasil dibulatkan).
const M = require('../js/soal-cerita.js');
const D = require('../js/kelas-4/bab-1/soal-cerita-data.js');
let gagal = 0;
const cek = (kond, pesan) => { if (!kond) { gagal++; if (gagal < 60) console.log('GAGAL:', pesan); } };

const angkaDariTeks = (t) => Number(t.replace(/\./g, ''));
const rata5 = (n) => String(n).padStart(5, '0');
// banding teks per digit: -1, 0, 1
function bandingDigit(a, b) {
  const x = rata5(a), y = rata5(b);
  for (let i = 0; i < 5; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
}
// pembulatan lewat sisa bagi, tempat u (1000 atau 100)
function bulat(x, u) { const sisa = x % u; return sisa >= u / 2 ? x - sisa + u : x - sisa; }
const tanpaTag = (h) => h.replace(/<[^>]+>/g, '');

// contoh video
cek(bandingDigit(23850, 23580) === 1 && 23850 - 23580 === 270, 'contoh stadion');
cek(bulat(2970, 1000) === 3000 && bulat(4050, 1000) === 4000 && bulat(2970, 1000) + bulat(4050, 1000) === 7000 && 2970 + 4050 === 7020, 'contoh toko buku');
cek(bulat(18900, 1000) + bulat(21200, 1000) === 40000, 'contoh belanja');
cek(bandingDigit(9990, 10100) === -1, 'jebakan banyak angka');
cek(bulat(3500, 1000) === 4000 && bulat(3499, 1000) === 3000 && bulat(2450, 100) === 2500 && bulat(2449, 100) === 2400, 'pembulatan 5 ke atas');

const RONDE = 1500, stat = {};
const g = M.untuk(D);
for (let t = 1; t <= 3; t++) {
  const s = stat[t] = { soal: 0, banding: 0, taksir: 0, sama: 0, urutBeda: 0, panjangBeda: 0, tiga: 0, hi: 0, lo: 0, jumlah: 0, selisih: 0, cukup: 0, cukupYa: 0, cukupTidak: 0, contoh: 0, ratus: 0, ribu: 0, pasPengecoh: 0, bawahPengecoh: 0, hasilPengecoh: 0, dis: 0, maks: 0 };
  for (let r = 0; r < RONDE; r++) {
    const ronde = g.buatRonde(t);
    cek(ronde.length === 5, 'ronde 5 soal');
    cek(new Set(ronde.map((x) => x.kode)).size === 5, 'soal kembar dalam ronde t' + t);
    cek(new Set(ronde.map((x) => x.jenis)).size === 2, 'ronde harus memuat kedua jenis t' + t);
    ronde.concat([g.soalMirip(ronde[0], t)]).forEach((so) => {
      const nama = 't' + t + ' ' + so.kode;
      s.soal++;
      cek(!/\d/.test(so.cerita0), nama + ' cerita0 memuat digit: ' + so.cerita0);
      cek(!/Rpsekian/.test(so.cerita0), nama + ' Rpsekian');
      so.kata.forEach((k) => cek(so.cerita0.includes(k), nama + ' kata kunci tidak ada di cerita0: ' + k));
      const angka = so.segmen.filter((x) => x.k === 'angka');
      const penting = angka.filter((x) => x.penting), pengecoh = angka.filter((x) => !x.penting);
      cek(so.segmen.filter((x) => x.k === 'tanya').length === 1, nama + ' satu kalimat tanya');
      penting.forEach((x) => { cek(/^\d{1,3}(\.\d{3})*$/.test(x.t), nama + ' format titik ribuan ' + x.t); cek(angkaDariTeks(x.t) === x.nilai, nama + ' nilai angka'); cek(x.nilai <= 100000, nama + ' > 100.000'); s.maks = Math.max(s.maks, x.nilai); });
      cek(pengecoh.length === so.angkaPengecoh.length, nama + ' angka pengecoh tercatat');
      if (t === 3) cek(pengecoh.length >= 1 && pengecoh.length <= 2, nama + ' T3 harus ada 1-2 angka pengecoh'); else cek(pengecoh.length === 0, nama + ' pengecoh hanya T3');
      pengecoh.forEach((x) => { s.dis++; cek(!penting.some((p) => p.nilai === x.nilai) && !/\./.test(x.t), nama + ' pengecoh sama dengan angka penting'); });
      const tk = penting.map((x) => angkaDariTeks(x.t));
      cek(JSON.stringify(tk) === JSON.stringify(so.angkaPenting), nama + ' angkaPenting');
      // ----- gambar -----
      const pil = so.gambar.pilihan;
      cek(pil.length === 3 && new Set(pil.map((p) => p.id)).size === 3, nama + ' 3 gambar');
      const cocok = pil.filter((p) => {
        const sv = p.svg;
        const model = (sv.match(/data-model="(\w+)"/) || [])[1];
        if (so.jenis === 'banding') {
          if (model !== 'tabel' || !/data-urut="normal"/.test(sv)) return false;
          const head = [...sv.matchAll(/data-h="(\d)"[^>]*>(.*?)<\/text>/g)].map((m) => tanpaTag(m[2].replace(/<\/tspan>/g, ' ')).trim());
          if (JSON.stringify(head) !== JSON.stringify(['Puluh ribuan', 'Ribuan', 'Ratusan', 'Puluhan', 'Satuan'])) return false;
          const baris = [...sv.matchAll(/<g data-n="([^"]+)" data-v="(\d+)">(.*?)<\/g>/g)];
          if (baris.length !== tk.length) return false;
          return baris.every((b, i) => {
            if (Number(b[2]) !== tk[i] || b[1] !== so.nama[i]) return false;
            const dg = ['', '', '', '', ''];
            [...b[3].matchAll(/data-c="(\d)"[^>]*>(\d)</g)].forEach((m) => { dg[Number(m[1])] = m[2]; });
            return dg.join('') === String(tk[i]); // digit ada di kolom nilai tempat yang benar (rata kanan)
          });
        }
        if (model !== 'garis') return false;
        const u = Number((sv.match(/data-model="garis" data-unit="(\d+)"/) || [])[1]);
        if (u !== so.u) return false;
        const sel = tk.slice(so.mode === 'cukup' ? 1 : 0);
        const baris = [...sv.matchAll(/<g data-v="(\d+)" data-l="(\d+)" data-u="(\d+)" data-unit="(\d+)">/g)];
        if (baris.length !== sel.length) return false;
        return baris.every((b, i) => Number(b[1]) === sel[i] && Number(b[2]) <= sel[i] && sel[i] < Number(b[3]) && Number(b[3]) - Number(b[2]) === u && Number(b[2]) % u === 0);
      });
      cek(cocok.length === 1 && cocok[0].id === so.gambar.benar, nama + ' tepat satu gambar cocok (' + cocok.map((p) => p.id) + ')');

      // ----- kunci -----
      cek(new Set(so.opsi).size === so.opsi.length, nama + ' opsi unik');
      cek(so.opsi.includes(so.kunci), nama + ' kunci ada di opsi');
      cek(so.cek.includes('<b>' + so.labelOpsi[so.kunci] + '</b>'), nama + ' cek memuat label kunci');
      so.opsi.forEach((o) => cek(so.labelOpsi[o], nama + ' label opsi ' + o));
      so.opsi.filter((o) => o !== so.kunci).forEach((o) => cek(typeof so.sebab[o] === 'string' && so.sebab[o].length > 20, nama + ' pengecoh tanpa sebab ' + o));
      if (so.jenis === 'banding') {
        s.banding++;
        cek(so.opsi.length === 3 && JSON.stringify(so.opsi.slice().sort()) === '[1,2,3]', nama + ' opsi 1 2 3');
        cek(tk.every((x) => x <= 99999), nama + ' banding <= 99.999');
        let benar;
        if (so.mode === 'dua') {
          cek(tk.length === 2, nama + ' dua bilangan');
          const h = bandingDigit(tk[0], tk[1]);
          benar = h === 0 ? 3 : h > 0 ? 1 : 2;
          if (h === 0) s.sama++;
          else {
            if (rata5(tk[0]).split('').sort().join('') === rata5(tk[1]).split('').sort().join('')) s.urutBeda++;
            if (String(tk[0]).length !== String(tk[1]).length) s.panjangBeda++;
          }
          cek(so.labelOpsi[1] === so.nama[0] && so.labelOpsi[2] === so.nama[1] && /^Sama/.test(so.labelOpsi[3]), nama + ' label');
          cek(t <= 2, nama + ' dua tokoh hanya T1-T2');
          cek(tk.every((x) => String(x).length >= 4 && String(x).length <= 5), nama + ' 4-5 angka');
        } else {
          s.tiga++;
          cek(t === 3 && tk.length === 3 && new Set(tk).size === 3, nama + ' tiga bilangan T3 berbeda');
          // paling besar / kecil: cari satu per satu dengan perbandingan digit
          const idx = so.paling === 'hi' ? tk.reduce((b, x, i) => (bandingDigit(x, tk[b]) > 0 ? i : b), 0) : tk.reduce((b, x, i) => (bandingDigit(x, tk[b]) < 0 ? i : b), 0);
          benar = idx + 1;
          if (so.paling === 'hi') s.hi++; else s.lo++;
          cek(so.labelOpsi[1] === so.nama[0] && so.labelOpsi[2] === so.nama[1] && so.labelOpsi[3] === so.nama[2], nama + ' label tiga');
        }
        cek(so.kunci === benar, nama + ' kunci banding ' + so.kunci + ' != ' + benar);
      } else {
        s.taksir++;
        const u = so.u;
        cek(u === 1000 || u === 100, nama + ' tempat pembulatan');
        if (u === 1000) s.ribu++; else s.ratus++;
        cek(so.tanya4.teks.includes(u === 1000 ? 'ribuan terdekat' : 'ratusan terdekat'), nama + ' tempat pembulatan disebut di soal');
        cek(/Kira-kira/.test(so.tanya4.teks) && so.kata.includes('Kira-kira'), nama + ' kata kira-kira');
        const xs = so.mode === 'cukup' ? tk.slice(1) : tk;
        cek(JSON.stringify(xs) === JSON.stringify(so.xs), nama + ' xs');
        const rb = xs.map((x) => bulat(x, u));
        cek(rb.every((v) => v % u === 0), nama + ' hasil bulat kelipatan tempat');
        const asli = so.mode === 'selisih' ? Math.abs(xs[0] - xs[1]) : xs.reduce((a, b) => a + b, 0);
        cek(asli <= 100000, nama + ' hasil asli > 100.000');
        if (so.mode === 'jumlah') {
          s.jumlah++;
          const k = rb.reduce((a, b) => a + b, 0);
          cek(so.kunci === k, nama + ' kunci jumlah ' + so.kunci + ' != ' + k);
          cek(xs.length === (t === 3 ? 3 : 2), nama + ' banyak bilangan');
          cek(k !== asli, nama + ' taksiran sama dengan hasil asli');
          cek(k <= 100000, nama + ' taksiran > 100.000');
          cek(so.opsi.length === 4, nama + ' 4 opsi');
        } else if (so.mode === 'selisih') {
          s.selisih++;
          const k = Math.abs(rb[0] - rb[1]);
          cek(so.kunci === k && k > 0 && k !== asli, nama + ' kunci selisih ' + so.kunci + ' != ' + k);
          cek(t >= 2 && xs.length === 2, nama + ' selisih T2-T3 dua bilangan');
          cek(so.opsi.length === 4, nama + ' 4 opsi');
        } else {
          s.cukup++;
          cek(t === 3 && xs.length === 2, nama + ' cukup hanya T3');
          const uang = tk[0], taksiran = rb[0] + rb[1];
          cek(uang !== taksiran && Math.abs(uang - taksiran) >= 2000, nama + ' uang terlalu dekat taksiran');
          cek((uang >= asli) === (uang >= taksiran), nama + ' taksiran dan hasil asli beda sisi uang');
          const benar = taksiran <= uang ? 1 : 2;
          if (benar === 1) s.cukupYa++; else s.cukupTidak++;
          cek(so.kunci === benar && JSON.stringify(so.opsi.slice().sort()) === '[1,2]' && so.labelOpsi[1] === 'Cukup' && so.labelOpsi[2] === 'Tidak cukup', nama + ' kunci cukup');
        }
        if (so.mode !== 'cukup') {
          // pengecoh khas yang muncul sebagai pilihan
          const op = so.opsi, hitung = (f) => (so.mode === 'selisih' ? Math.abs(f(xs[0]) - f(xs[1])) : xs.map(f).reduce((a, b) => a + b, 0));
          if (op.includes(asli)) s.pasPengecoh++;
          if (op.includes(hitung((x) => x - (x % u)))) s.bawahPengecoh++;
          if (op.includes(bulat(asli, u))) s.hasilPengecoh++;
          so.opsi.forEach((o) => cek(angkaDariTeks(so.labelOpsi[o].replace(/^Rp/, '').replace(/ [a-z]+$/, '')) === o, nama + ' label ' + so.labelOpsi[o] + ' != ' + o));
        }
      }
      if (D.CONTOH.some((c) => c.tp === so.tp && JSON.stringify(c.xs) === JSON.stringify(so.xs))) s.contoh++;
    });
  }
}

// ----- ringkasan & syarat sebaran -----
for (let t = 1; t <= 3; t++) {
  const s = stat[t];
  console.log('T' + t, JSON.stringify(s));
  const pct = s.contoh / s.soal;
  cek(s.banding > 0 && s.taksir > 0, 'T' + t + ' harus ada banding dan taksir');
  cek(t === 3 ? s.contoh === 0 : pct > 0.03 && pct < 0.25, 'T' + t + ' contoh video ~12%: ' + pct);
  cek(s.sama > 0 || t === 3, 'T' + t + ' harus ada jawaban Sama');
  cek(s.urutBeda > 0 || t === 3, 'T' + t + ' jebakan urutan beda');
  cek(s.panjangBeda > 0 || t === 3, 'T' + t + ' jebakan banyak angka beda');
  cek(s.pasPengecoh > 0 && s.bawahPengecoh > 0 && s.hasilPengecoh > 0, 'T' + t + ' pengecoh pas / ke bawah / hasil');
  cek(s.maks <= 100000, 'T' + t + ' maks');
}
cek(stat[2].selisih > 0 && stat[2].ratus > 0 && stat[2].ribu > 0 && stat[1].ribu > 0 && stat[1].ratus === 0, 'sebaran tingkat 1-2');
cek(stat[3].tiga > 0 && stat[3].hi > 0 && stat[3].lo > 0 && stat[3].cukup > 0 && stat[3].cukupYa > 0 && stat[3].cukupTidak > 0 && stat[3].jumlah > 0 && stat[3].dis > 0, 'sebaran tingkat 3');

if (gagal) { console.log('TOTAL GAGAL: ' + gagal); process.exit(1); }
console.log('Semua cek Soal Cerita Bab 1 lulus.');
