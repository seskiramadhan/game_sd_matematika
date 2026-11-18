// Data 📖 Soal Cerita Kelas 4 Bab 6 (Desimal) untuk mesin js/soal-cerita.js.
// Pesan inti (video Jago Soal Cerita Ep. 9): ANGKA PANJANG BELUM TENTU BESAR. Samakan banyak angka di belakang koma dulu.
//   banding : "Mana lebih banyak / jauh / panjang?" Jawaban NAMA TOKOH atau "Sama" (labelOpsi: kode 1 = tokoh pertama, 2 = kedua, 3 = ketiga atau "sama").
//   selisih : "Lebih berapa?" Jawaban DESIMAL (kode = bilangan bulat perseratus, labelOpsi = teks Indonesia dengan koma).
// Tingkat 1: banding dua tokoh, persepuluhan saja, atau satu persepuluhan + satu perseratusan (0,6 lawan 0,45; 0,6 = 0,60).
// Tingkat 2: banding dan selisih, perseratusan (1,5 lawan 1,25), selisih desimal.
// Tingkat 3: desimal lawan pecahan (1/2, 1/4, 3/4, 2/5, 3/20 ... ubah ke desimal dulu), tiga tokoh (paling banyak / sedikit), selisih desimal-pecahan, 1-2 angka pengecoh di Tandai.
// SEMUA nilai disimpan sebagai bilangan bulat PERSERATUS (h): 1,25 -> 125. Tanpa floating point. d = banyak angka di belakang koma yang TERTULIS (0,6 d=1; 0,60 d=2).
// Langkah Gambar: nilai semua tokoh < 1 -> kotak seratus (1 kotak besar = 1 utuh = 100 kotak kecil); ada nilai >= 1 -> garis bilangan 0 sampai M.
//   3 pilihan: benar, dan 2 pengecoh (arsiran salah tempat nilai: angka dibaca tanpa meratakan, nilai tertukar, angka puluhan-satuan terbalik, bergeser 0,1).
// Contoh tetap (video Ep. 9 / Buku Saku), muncul sekitar 12%: dua botol 1,5 dan 1,25 liter; Dodi 0,8 km dan Sari 3/4 km; tali Ali 0,6 m dan Beni 0,45 m.
// Tes: node tools/cek-soal-cerita-bab6.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok } = M;

  const T = (t) => ({ k: 'teks', t });
  const pc = (a, d) => '<span class="pec"><span class="pec-a">' + a + '</span><span class="pec-b">' + d + '</span></span>';
  const N = (it) => ({ k: 'angka', t: it.t, nilai: { h: it.h, d: it.d, a: it.a, b: it.b }, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false }); // angka pengecoh
  const Q = (t) => ({ k: 'tanya', t });

  // ---------- Bilangan: perseratus bulat ----------
  // teks Indonesia dengan d angka di belakang koma (d = 0: bilangan bulat)
  function teks(h, d) {
    const w = Math.floor(h / 100), f = String(h % 100).padStart(2, '0');
    return d === 0 ? String(w) : d === 1 ? w + ',' + f[0] : w + ',' + f;
  }
  const dMin = (h) => (h % 100 === 0 ? 0 : h % 10 === 0 ? 1 : 2);
  const teksMin = (h) => teks(h, dMin(h));
  const dec = (h, d) => ({ tp: 'dec', h, d, t: teks(h, d) });
  const fra = (a, b) => ({ tp: 'fra', h: (a * 100) / b, a, b, d: 0, t: pc(a, b) });
  const FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [1, 10], [3, 20], [7, 20], [9, 20], [11, 20], [13, 20], [17, 20]];
  const frAcak = () => { const [a, b] = pilih(FR); return fra(a, b); };
  const dl = (it) => (it.tp === 'dec' ? it.d : 0); // "panjang" angka di belakang koma yang tertulis (pecahan: tidak ada)
  const sgn = Math.sign;

  const ORANG = ['Dodi', 'Sari', 'Ali', 'Beni', 'Rani', 'Tono', 'Budi', 'Wati', 'Dewi', 'Agus', 'Lina', 'Joko', 'Maya', 'Eko', 'Tika', 'Bayu', 'Putri', 'Rafi'];
  // Templat cerita. pre/post mengapit angka; samar = kata pengganti angka di cerita tanpa angka.
  const TPL = [
    { id: 'lari', orang: true, pre: 'berlari ', post: ' kilometer', samar: 'sekian', wh: 'Siapa yang', vs: 'berlari', hi: 'jauh', lo: 'dekat', samaLabel: 'Sama jauh', selisih: 'Berapa kilometer selisih jarak lari mereka?', satuan: 'kilometer' },
    { id: 'tali', orang: true, pre: 'memotong tali sepanjang ', post: ' meter', samar: 'sekian', wh: 'Siapa yang', vs: 'memotong tali', hi: 'panjang', lo: 'pendek', samaLabel: 'Sama panjang', selisih: 'Berapa meter selisih panjang tali mereka?', satuan: 'meter' },
    { id: 'air', orang: true, pre: 'membawa air ', post: ' liter', samar: 'sekian', wh: 'Siapa yang', vs: 'membawa air', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa liter selisih air yang mereka bawa?', satuan: 'liter' },
    { id: 'jus', orang: false, nama: ['Botol merah', 'Botol biru', 'Botol hijau'], pre: 'berisi ', post: ' liter jus', samar: 'sekian', wh: 'Botol mana yang', vs: 'berisi', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa liter selisih isi kedua botol?', satuan: 'liter' },
    { id: 'pita', orang: false, nama: ['Pita merah', 'Pita biru', 'Pita kuning'], pre: 'panjangnya ', post: ' meter', samar: 'sekian', wh: 'Pita mana yang', vs: '', hi: 'panjang', lo: 'pendek', samaLabel: 'Sama panjang', selisih: 'Berapa meter selisih panjang kedua pita?', satuan: 'meter' },
    { id: 'beras', orang: true, pre: 'membeli beras ', post: ' kilogram', samar: 'sekian', wh: 'Siapa yang', vs: 'membeli beras', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa kilogram selisih beras yang mereka beli?', satuan: 'kilogram' },
    { id: 'lompat', orang: true, pre: 'melompat sejauh ', post: ' meter', samar: 'sekian', wh: 'Siapa yang', vs: 'melompat', hi: 'jauh', lo: 'dekat', samaLabel: 'Sama jauh', selisih: 'Berapa meter selisih jauh lompatan mereka?', satuan: 'meter' },
    { id: 'pohon', orang: false, nama: ['Pohon mangga', 'Pohon jambu', 'Pohon jeruk'], pre: 'tingginya ', post: ' meter', samar: 'sekian', wh: 'Pohon mana yang', vs: '', hi: 'tinggi', lo: 'pendek', samaLabel: 'Sama tinggi', selisih: 'Berapa meter selisih tinggi kedua pohon?', satuan: 'meter' },
  ];
  const tpl = (id) => TPL.find((x) => x.id === id);
  const kalimat = (t, kata) => [t.wh, t.vs, kata].filter(Boolean).join(' ') + '?';
  const CONTOH = [
    { jenis: 'banding', tingkat: [1, 2], tp: 'jus', nama: ['Botol merah', 'Botol biru'], mk: () => [dec(150, 1), dec(125, 2)] },
    { jenis: 'selisih', tingkat: [2], tp: 'jus', nama: ['Botol merah', 'Botol biru'], mk: () => [dec(150, 1), dec(125, 2)] },
    { jenis: 'banding', tingkat: [1, 2], tp: 'tali', nama: ['Ali', 'Beni'], mk: () => [dec(60, 1), dec(45, 2)] },
    { jenis: 'selisih', tingkat: [2], tp: 'tali', nama: ['Ali', 'Beni'], mk: () => [dec(60, 1), dec(45, 2)] },
    { jenis: 'banding', tingkat: [3], tp: 'lari', nama: ['Dodi', 'Sari'], mk: () => [dec(80, 1), fra(3, 4)] },
    { jenis: 'selisih', tingkat: [3], tp: 'lari', nama: ['Dodi', 'Sari'], mk: () => [dec(80, 1), fra(3, 4)] },
  ];
  const DIS = [' Kejadian itu berlangsung {x} menit.', ' Ada {x} anak yang menonton.', ' Hari itu tanggal {x}.', ' Mereka mulai setelah {x} menit.'];

  // ---------- Pembuat pasangan nilai ----------
  const wholeAcak = () => { const r = Math.random(); return r < 0.5 ? 0 : r < 0.8 ? 1 : 2; };
  const f2 = () => { let f; do { f = acak(1, 99); } while (f % 10 === 0); return f; }; // dua angka, tidak berakhir nol
  const dec1 = (w) => dec(w * 100 + acak(1, 9) * 10, 1);
  const dec2 = (w) => dec(w * 100 + f2(), 2);
  // satu persepuluhan + satu perseratusan; jebakan: persepuluhan LEBIH BESAR padahal angkanya lebih pendek (0,6 lawan 0,45)
  function pasangPS(w, pJebakan) {
    for (;;) {
      const t = acak(1, 9), f = f2();
      const jebakan = t * 10 > f && f > t;
      if ((Math.random() < pJebakan) !== jebakan) continue;
      return kocok([dec(w * 100 + t * 10, 1), dec(w * 100 + f, 2)]);
    }
  }
  function pasangSS(w) { for (;;) { const a = dec2(w), b = dec2(w); if (a.h !== b.h) return kocok([a, b]); } }
  function pasangSama(w) { const t = acak(1, 9); return kocok([dec(w * 100 + t * 10, 1), dec(w * 100 + t * 10, 2)]); } // 0,6 dan 0,60
  function pasangPP(w) { const a = acak(1, 9); let b; do { b = acak(1, 9); } while (b === a); return [dec(w * 100 + a * 10, 1), dec(w * 100 + b * 10, 1)]; }
  function pasangDesPec(pSama) {
    for (;;) {
      const F = frAcak();
      if (Math.random() < pSama) return kocok([dec(F.h, F.h % 10 === 0 && Math.random() < 0.5 ? 1 : 2), F]);
      const D = Math.random() < 0.5 ? dec(acak(1, 9) * 10, 1) : dec(f2(), 2);
      if (D.h !== F.h) return kocok([D, F]);
    }
  }
  function pasangA(t) {
    const w = wholeAcak(), r = Math.random();
    if (t === 1) return r < 0.4 ? pasangPP(w) : r < 0.88 ? pasangPS(w, 0.65) : pasangSama(w);
    if (t === 2) return r < 0.4 ? pasangPS(w, 0.6) : r < 0.82 ? pasangSS(w) : pasangSama(w);
    return pasangDesPec(0.12);
  }
  function pasangB(t) {
    const w = wholeAcak(), r = Math.random();
    if (t === 2) return r < 0.5 ? pasangPS(w, 0.5) : pasangSS(w);
    if (r < 0.75) return pasangDesPec(0);
    const w2 = acak(1, 2);
    return Math.random() < 0.5 ? pasangPS(w2, 0.5) : pasangSS(w2);
  }
  function tiga() {
    for (;;) {
      const adaPec = Math.random() < 0.8, w = adaPec ? 0 : acak(1, 2), arr = [];
      const nf = adaPec ? acak(1, 2) : 0;
      for (let i = 0; i < nf; i++) arr.push(frAcak());
      while (arr.length < 3) arr.push(Math.random() < 0.5 ? dec1(w) : dec2(w));
      if (new Set(arr.map((x) => x.h)).size < 3) continue;
      const jebakan = arr.some((x) => arr.some((y) => x !== y && dl(x) > dl(y) && x.h < y.h));
      if (Math.random() < 0.7 && !jebakan) continue;
      return kocok(arr);
    }
  }

  // ---------- Gambar: kotak seratus (nilai < 1) atau garis bilangan (ada nilai >= 1) ----------
  const WG = { warna: ['#3A86FF', '#FF8A3D', '#2BB673'], teks: '#1F2A44', merah: '#FF6384', sisa: '#F3F5FA' };
  const svg = (isi, tinggi) => '<svg viewBox="0 0 320 ' + (tinggi || 190) + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  let _pid = 0;
  // vals: perseratus tiap tokoh. o: { model, M, sel, besar }. Tiap tokoh dibungkus <g data-n data-v> (dipakai tes).
  function gambar6(nama, vals, o) {
    const n = vals.length, sel = !!o.sel && n === 2;
    const lo = sel ? Math.min(vals[0], vals[1]) : 0;
    let s = '';
    if (o.model === 'kotak') {
      const id = 'ht' + (++_pid), c = n === 2 ? 12.5 : 9.4, gapx = n === 2 ? 40 : 14, lebar = 10 * c, tot = n * lebar + (n - 1) * gapx, x0 = (320 - tot) / 2, y0 = 30;
      s += '<defs><pattern id="' + id + '" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="' + WG.merah + '"/><rect width="3" height="8" fill="#FFB3C1"/></pattern></defs>';
      vals.forEach((v, k) => {
        const gx = x0 + k * (lebar + gapx);
        s += '<g data-n="' + nama[k] + '" data-v="' + v + '">';
        s += '<text x="' + (gx + lebar / 2) + '" y="19" font-size="' + (n === 2 ? 16 : 14) + '" font-weight="800" text-anchor="middle" fill="' + WG.teks + '">' + nama[k] + '</text>';
        for (let i = 0; i < 100; i++) {
          const bx = gx + Math.floor(i / 10) * c, by = y0 + (i % 10) * c;
          let isi = WG.sisa;
          if (sel && k === o.besar) { if (i < lo) isi = WG.warna[k]; else if (i < v) isi = 'url(#' + id + ')'; }
          else if (i < v) isi = WG.warna[k];
          s += '<rect x="' + bx + '" y="' + by + '" width="' + (c - 1.4) + '" height="' + (c - 1.4) + '" rx="1.5" fill="' + isi + '"/>';
        }
        s += '<rect x="' + (gx - 1) + '" y="' + (y0 - 1) + '" width="' + (lebar + 0) + '" height="' + (lebar + 0) + '" rx="3" fill="none" stroke="' + WG.teks + '" stroke-width="3"/>';
        if (sel && k === o.besar && v > lo) {
          const mid = Math.floor((lo + v - 1) / 2);
          s += '<text x="' + (gx + Math.floor(mid / 10) * c + c / 2) + '" y="' + (y0 + (mid % 10) * c + c / 2 + 6) + '" font-size="19" font-weight="800" text-anchor="middle" fill="#FFFFFF" stroke="' + WG.merah + '" stroke-width="1" paint-order="stroke">?</text>';
        }
        s += '</g>';
      });
    } else {
      const Mx = o.M, x0 = 20, lebar = 280, per = lebar / Mx, h = n === 2 ? 34 : 26, lab = n === 2 ? 20 : 17, gap = n === 2 ? 12 : 6;
      const yAxis = 6 + n * (h + lab + gap);
      for (let t = 0; t <= Mx * 10; t++) {
        const x = x0 + (per * t) / 10, utuh = t % 10 === 0;
        s += '<line x1="' + x + '" y1="6" x2="' + x + '" y2="' + (yAxis + (utuh ? 10 : 5)) + '" stroke="' + (utuh ? '#8A94AD' : '#D5DAE6') + '" stroke-width="' + (utuh ? 2 : 1) + '"/>';
        if (utuh) s += '<text x="' + x + '" y="' + (yAxis + 28) + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + WG.teks + '">' + t / 10 + '</text>';
      }
      vals.forEach((v, k) => {
        const y = 6 + k * (h + lab + gap) + lab, w = (per * v) / 100;
        s += '<g data-n="' + nama[k] + '" data-v="' + v + '" data-per="' + per + '">';
        s += '<text x="' + x0 + '" y="' + (y - 4) + '" font-size="16" font-weight="800" fill="' + WG.teks + '">' + nama[k] + '</text>';
        if (sel && k === o.besar && v > lo) {
          const wl = (per * lo) / 100;
          s += '<rect x="' + x0 + '" y="' + y + '" width="' + wl + '" height="' + h + '" fill="' + WG.warna[k] + '"/>';
          s += '<rect x="' + (x0 + wl) + '" y="' + y + '" width="' + (w - wl) + '" height="' + h + '" fill="#FFFFFF" fill-opacity=".7" stroke="' + WG.merah + '" stroke-width="3" stroke-dasharray="7 5"/>';
          s += '<text x="' + (x0 + (wl + w) / 2) + '" y="' + (y + h / 2 + 7) + '" font-size="20" font-weight="800" text-anchor="middle" fill="' + WG.merah + '">?</text>';
        } else s += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + WG.warna[k] + '"/>';
        s += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="none" stroke="' + WG.teks + '" stroke-width="3"/>';
        s += '</g>';
      });
    }
    return svg(s, o.model === 'kotak' ? (n === 2 ? 168 : 138) : (n === 2 ? 174 : 190));
  }
  // 3 pilihan: benar + 2 pengecoh (arsiran salah tempat nilai)
  function pilihanGambar6(nama, items, sel, besar) {
    const hs = items.map((x) => x.h), n = hs.length, mx = Math.max(...hs);
    const model = mx >= 100 ? 'garis' : 'kotak', Mx = Math.floor(mx / 100) + 1, cap = model === 'kotak' ? 100 : Mx * 100;
    const pecah = (x) => String(x.h % 100).padStart(2, '0');
    const kandidat = [
      { id: 'b6-angka', v: items.map((x) => { const w = Math.floor(x.h / 100); return x.tp === 'dec' ? w * 100 + Number(pecah(x).slice(0, x.d)) : x.h; }) }, // angka belakang koma dibaca perseratus (0,6 jadi 0,06)
      { id: 'b6-tukar', v: items.map((_, i) => hs[(i + 1) % n]) },
      { id: 'b6-balik', v: items.map((x) => Math.floor(x.h / 100) * 100 + Number(pecah(x).split('').reverse().join(''))) },
      { id: 'b6-geser', v: hs.map((h) => (h + 10 <= cap ? h + 10 : h - 10)) },
      { id: 'b6-turun', v: hs.map((h) => (h - 10 >= 1 ? h - 10 : h + 10)) },
      { id: 'b6-satu', v: hs.map((h, i) => (i === 0 ? (h + 10 <= cap ? h + 10 : h - 10) : h)) },
    ];
    const sama = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const pakai = [];
    kandidat.forEach((c) => { if (c.v.every((v) => v >= 1 && v <= cap) && !sama(c.v, hs) && !pakai.some((p) => sama(p.v, c.v))) pakai.push(c); });
    const awal = pakai.filter((c) => c.id === 'b6-angka'), sisa = kocok(pakai.filter((c) => c.id !== 'b6-angka'));
    const dua = awal.concat(sisa).slice(0, 2);
    const ket = model === 'kotak' ? 'Kotak seratus' : 'Garis bilangan';
    const sebuah = (id, v) => ({ id, ket, model, svg: gambar6(nama, v, { model, M: Mx, sel, besar: v[0] >= v[1] ? 0 : 1 }) });
    return { benar: 'b6-benar', pilihan: kocok([sebuah('b6-benar', hs)].concat(dua.map((c) => sebuah(c.id, c.v)))) };
  }

  // ---------- Bagian cerita ----------
  const ambilNama = (tp, n) => kocok(tp.orang ? ORANG : tp.nama).slice(0, n);
  function susun(tp, nama, items, tanya, tingkat, terlarang) {
    const segmen = [];
    nama.forEach((n, i) => { segmen.push(T(n + ' ' + tp.pre), N(items[i]), T(tp.post + '. ')); });
    const dis = [];
    if (tingkat === 3) {
      kocok(DIS).slice(0, acak(1, 2)).forEach((kal) => {
        let v; do { v = acak(13, 45); } while (terlarang.has(v) || dis.includes(v));
        dis.push(v);
        const [x, y] = kal.split('{x}'); segmen.push(T(x.replace(/^ /, '')), P(v), T(y + ' '));
      });
    }
    segmen.push(Q(tanya));
    const cerita0 = nama.map((n) => n + ' ' + tp.pre + tp.samar + tp.post + '. ').join('') + tanya;
    return { segmen, cerita0, dis, kataIsi: tp.pre + tp.samar + tp.post };
  }
  // banyak angka di belakang koma yang dipakai untuk meratakan
  const dRata = (items) => (items.some((x) => x.h % 10 !== 0 || x.d === 2) ? 2 : 1);
  const rataTeks = (x, D) => (x.tp === 'fra' ? x.t + ' = ' + teks(x.h, D) : x.d < D ? x.t + ' = ' + teks(x.h, D) : x.t);
  const baris = (nama, items, D) => nama.map((n, i) => n + ': ' + rataTeks(items[i], D)).join('<br>');
  const kodeUnik = (tp, jenis, items, nama) => jenis + '-' + tp.id + '-' + items.map((x) => (x.tp === 'fra' ? x.a + '/' + x.b : x.t)).join('-') + '-' + nama.join('+');

  // ---------- BANDING (dua atau tiga tokoh) ----------
  function soalBanding(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      let ct = null;
      if (Math.random() < 0.12) { const c = CONTOH.filter((x) => x.jenis === 'banding' && x.tingkat.includes(tingkat)); if (c.length) ct = pilih(c); }
      let tp, nama, items, mode = 'dua', paling = null;
      if (ct) { tp = tpl(ct.tp); nama = ct.nama; items = ct.mk(); }
      else if (tingkat === 3 && Math.random() < 0.55) { tp = pilih(TPL); items = tiga(); nama = ambilNama(tp, 3); mode = 'tiga'; paling = Math.random() < 0.65 ? 'hi' : 'lo'; }
      else { tp = pilih(TPL); items = pasangA(tingkat); nama = ambilNama(tp, 2); }
      const hs = items.map((x) => x.h), D = dRata(items);
      const kd = kodeUnik(tp, mode === 'tiga' ? 'bd3' + paling : 'bd', items, nama);
      if (pakai && pakai.has(kd)) continue;
      let kunci, hasil = 0, kunciIdx = -1, labelOpsi, tanya;
      if (mode === 'dua') {
        hasil = sgn(hs[0] - hs[1]);
        kunci = hasil === 0 ? 3 : hasil > 0 ? 1 : 2; kunciIdx = hasil >= 0 ? 0 : 1;
        labelOpsi = { 1: nama[0], 2: nama[1], 3: tp.samaLabel };
        tanya = kalimat(tp, 'lebih ' + tp.hi);
      } else {
        const urut = [0, 1, 2].sort((a, b) => hs[b] - hs[a]);
        kunciIdx = paling === 'hi' ? urut[0] : urut[2]; kunci = kunciIdx + 1;
        labelOpsi = { 1: nama[0], 2: nama[1], 3: nama[2] };
        tanya = kalimat(tp, 'paling ' + tp[paling]);
      }
      const sebab = {};
      const ket = (nm, it) => nm + ' ' + it.t;
      [1, 2, 3].filter((k) => k !== kunci).forEach((k) => {
        let s = 'Ratakan dulu banyak angka di belakang koma:<br>' + baris(nama, items, D) + '<br>';
        const dipilih = k - 1;
        if (mode === 'dua') {
          const menang = hasil > 0 ? 0 : 1;
          if (k !== 3 && dl(items[dipilih]) > dl(items[menang])) s += 'Angka yang lebih panjang belum tentu lebih besar. ';
          s += hasil === 0 ? 'Keduanya sama besar.' : k === 3 ? 'Keduanya tidak sama: ' + nama[menang] + ' yang lebih ' + tp.hi + '.' : nama[menang] + ' yang lebih ' + tp.hi + '.';
        } else {
          if (dl(items[dipilih]) > dl(items[kunciIdx])) s += 'Angka yang lebih panjang belum tentu lebih besar. ';
          s += nama[dipilih] + ' bukan yang paling ' + tp[paling] + '.';
        }
        sebab[k] = s;
      });
      const { segmen, cerita0, dis, kataIsi } = susun(tp, nama, items, tanya, tingkat, new Set(hs.concat(items.flatMap((x) => (x.tp === 'fra' ? [x.a, x.b] : [])))));
      const urutNama = [0, 1, 2].slice(0, items.length).sort((a, b) => hs[b] - hs[a]).map((i) => nama[i]);
      const cek = 'Ratakan banyak angka di belakang koma dulu (1 kotak besar = 1 utuh = 100 kotak kecil).<br>' + baris(nama, items, D) + '<br>' +
        (mode === 'dua'
          ? teks(hs[0], D) + (hasil === 0 ? ' sama dengan ' : hasil > 0 ? ' lebih dari ' : ' kurang dari ') + teks(hs[1], D) + '. Jawaban: <b>' + labelOpsi[kunci] + '</b>'
          : 'Yang paling ' + tp[paling] + ': ' + teks(hs[kunciIdx], D) + '. Jawaban: <b>' + labelOpsi[kunci] + '</b><br><small>Urutan dari terbesar: ' + urutNama.join(', ') + '.</small>');
      return {
        jenis: 'banding', tingkat, kode: kd, mode, paling, tp: tp.id, nama, items, hs, D, hasil,
        cerita0, kata: [kataIsi, mode === 'tiga' ? 'paling ' + tp[paling] : 'lebih ' + tp.hi],
        segmen, angkaPenting: items.map((x) => x.h), angkaPengecoh: dis,
        arahAngka: 'angka penting', hintKurang: 'Masih ada angka penting yang belum kuning. Ketuk semua angka (dan pecahan) di cerita.',
        gambar: pilihanGambar6(nama, items, false, 0), tanya4: { teks: tanya, satuan: '' },
        kunci, opsi: kocok([1, 2, 3]), labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalBanding gagal');
  }

  // ---------- SELISIH ----------
  const digitTanpaKoma = (x) => Number(String(Math.floor(x.h / 100)) + String(x.h % 100).padStart(2, '0').slice(0, Math.max(1, x.d)));
  function soalSelisih(tingkat, pakai) {
    for (let coba = 0; coba < 5000; coba++) {
      let ct = null;
      if (Math.random() < 0.12) { const c = CONTOH.filter((x) => x.jenis === 'selisih' && x.tingkat.includes(tingkat)); if (c.length) ct = pilih(c); }
      let tp, nama, items;
      if (ct) { tp = tpl(ct.tp); nama = ct.nama; items = ct.mk(); }
      else { tp = pilih(TPL); items = pasangB(tingkat); nama = ambilNama(tp, 2); }
      const hs = items.map((x) => x.h), D = dRata(items);
      if (hs[0] === hs[1]) continue;
      const kd = kodeUnik(tp, 'sl', items, nama);
      if (pakai && pakai.has(kd)) continue;
      const besar = hs[0] > hs[1] ? 0 : 1, hb = hs[besar], hk = hs[1 - besar], s = hb - hk;
      const kunci = s;
      const lb = (h) => teksMin(h);
      const grup = [];
      const sameWhole = Math.floor(hs[0] / 100) === Math.floor(hs[1] / 100);
      if (items[0].tp === 'dec' && items[1].tp === 'dec' && items[0].d !== items[1].d && sameWhole) {
        const p1 = Math.abs(digitTanpaKoma(items[0]) - digitTanpaKoma(items[1]));
        grup.push({ s: 'Itu mengurangi angkanya tanpa meratakan banyak angka di belakang koma. Ratakan dulu: ' + teks(hb, D) + ' − ' + teks(hk, D) + '.', v: [p1] });
        const fb = Number(String(hb % 100).padStart(2, '0').slice(0, items[besar].d)), fk = Number(String(hk % 100).padStart(2, '0').slice(0, items[1 - besar].d));
        grup.push({ s: 'Angka di belakang koma dikurangi begitu saja, padahal 1 angka di belakang koma itu persepuluhan, bukan perseratusan. Ratakan dulu jadi ' + D + ' angka di belakang koma.', v: [Math.abs(fb - fk)] });
      }
      const fr = items.find((x) => x.tp === 'fra');
      if (fr && fr.b < 10) {
        const salahH = fr.a * 10 + fr.b, dd = items.find((x) => x.tp === 'dec');
        grup.push({ s: 'Itu mengubah ' + fr.t + ' menjadi 0,' + fr.a + fr.b + ', padahal ' + fr.t + ' = ' + teks(fr.h, Math.max(1, dMin(fr.h))) + '. Ubah pecahan ke desimal dulu.', v: [Math.abs(dd.h - salahH)] });
      }
      grup.push({ s: 'Koma salah tempat. Selisih ' + hb + ' − ' + hk + ' = ' + s + ' perseratus, jadi ' + lb(s) + '.', v: [s * 10].filter((v) => v <= 999) });
      grup.push({ s: 'Itu hasil menjumlah. Selisih berarti dikurangi.', v: [hb + hk].filter((v) => v <= 999) });
      grup.push({ s: 'Itu nilai yang lebih besar saja. Yang ditanya selisih, jadi dikurangi: ' + teks(hb, D) + ' − ' + teks(hk, D) + '.', v: [hb] });
      const cadangan = [s + 10, s - 10, s + 1, s - 1, s + 5, s - 5, s * 2].filter((v) => v >= 1);
      grup.push({ s: 'Belum tepat. Ratakan dulu banyak angka di belakang koma, lalu kurangi: ' + teks(hb, D) + ' − ' + teks(hk, D) + '.', v: cadangan });
      const { opsi, sebab } = M.buatOpsi(kunci, grup, cadangan, { min: 1, maks: 999, n: 4 });
      const labelOpsi = {}; opsi.forEach((o) => { labelOpsi[o] = lb(o); });
      const tanya = tp.selisih;
      const { segmen, cerita0, dis, kataIsi } = susun(tp, nama, items, tanya, tingkat, new Set(hs.concat([s]).concat(items.flatMap((x) => (x.tp === 'fra' ? [x.a, x.b] : [])))));
      const cek = 'Ratakan banyak angka di belakang koma dulu (1 kotak besar = 1 utuh = 100 kotak kecil).<br>' + baris(nama, items, D) + '<br>' +
        'Selisih: ' + teks(hb, D) + ' − ' + teks(hk, D) + ' = ' + lb(s) + ' <small>(' + hb + ' − ' + hk + ' = ' + s + ' perseratus)</small>. Jawaban: <b>' + labelOpsi[kunci] + '</b> ' + tp.satuan +
        '<br><small>Cek: ' + teks(hk, D) + ' + ' + lb(s) + ' = ' + teks(hb, D) + '.</small>';
      return {
        jenis: 'selisih', tingkat, kode: kd, mode: 'biasa', tp: tp.id, nama, items, hs, D, s, besar,
        cerita0, kata: [kataIsi, 'selisih'],
        segmen, angkaPenting: items.map((x) => x.h), angkaPengecoh: dis,
        arahAngka: 'angka penting', hintKurang: 'Masih ada angka penting yang belum kuning. Ketuk kedua angka (atau pecahan) di cerita.',
        gambar: pilihanGambar6(nama, items, true, besar), tanya4: { teks: tanya, satuan: tp.satuan },
        kunci, opsi, labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalSelisih gagal');
  }

  const data = {
    id: 'k4b6',
    jenis: [
      { id: 'banding', nama: 'Bandingkan', petunjuk: 'yang ditanya <b>mana yang lebih banyak</b> (atau lebih jauh, lebih panjang). Desimalnya dibandingkan.',
        gambarPetunjuk: 'Untuk membandingkan, gambar harus memakai <b>utuh yang sama besar</b>, lalu tiap nilai diarsir <b>sesuai angka di belakang koma</b>.' },
      { id: 'selisih', nama: 'Cari selisih', petunjuk: 'yang ditanya <b>selisihnya</b>: lebih berapa. Banyak angka di belakang koma disamakan, lalu dikurangi.',
        gambarPetunjuk: 'Untuk mencari selisih, gambar harus memakai <b>utuh yang sama besar</b>, diarsir <b>sesuai angka di belakang koma</b>, lalu bagian lebihnya ditandai.' },
    ],
    tingkat: ['dua tokoh, persepuluhan atau persepuluhan lawan perseratusan', 'bandingkan dan cari selisih, perseratusan', 'desimal lawan pecahan, tiga tokoh, selisih, dan angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Angka panjang belum tentu besar: samakan banyak angka di belakang koma dulu (0,6 = 0,60). Pecahan diubah ke desimal dulu. Selisih: kurangi, lalu cek (kecil + selisih = besar).',
    jenisTingkat: (t) => (t === 1 ? ['banding'] : ['banding', 'selisih']),
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'selisih' ? soalSelisih(tingkat, pakai) : soalBanding(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    TPL, CONTOH, FR, teks, teksMin, dec, fra, pc,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b6 = data;
})(typeof window !== 'undefined' ? window : globalThis);
