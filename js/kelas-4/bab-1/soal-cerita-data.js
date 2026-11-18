// Data 📖 Soal Cerita Kelas 4 Bab 1 (Bilangan Cacah sampai 100.000) untuk mesin js/soal-cerita.js.
// Pesan inti: PAS ATAU KIRA-KIRA? Kata "kira-kira" = taksiran: bulatkan tiap bilangan dulu, baru hitung.
//   banding : "Mana lebih banyak / ramai / mahal?" (pas). Dibandingkan dari KIRI, berhenti di angka pertama yang berbeda.
//             Jawaban nama (hari, toko, barang ...) atau "Sama ..." (labelOpsi: kode 1 = tokoh pertama, 2 = kedua, 3 = ketiga atau "sama").
//             Jebakan: angka sama urutan beda (23.850 lawan 23.580), banyak angka beda (9.990 lawan 10.100).
//   taksir  : "Kira-kira berapa?" Bulatkan tiap bilangan (ke ribuan atau ratusan, disebut di soal), lalu jumlah / selisih / "cukup tidak uangnya?".
//             Pengecoh: hitung pas, bulat ke bawah padahal 5 ke atas, hasil saja yang dibulatkan, tempat pembulatan salah.
// Tingkat 1: banding dua bilangan 4-5 angka; taksiran dua bilangan ke ribuan, jumlah.
// Tingkat 2: banding (5 angka) + taksiran jumlah atau selisih ke ratusan atau ribuan.
// Tingkat 3: banding tiga pilihan (paling ...), taksiran tiga bilangan atau "cukup tidak uangnya?" (kira-kira), + 1-2 angka pengecoh di Tandai.
// Semua bilangan bulat biasa (Number), tanpa floating point; tampil dengan titik ribuan (23.850). Semua bilangan dan hasil <= 100.000.
// Langkah Gambar: banding -> tabel nilai tempat (puluh ribuan ... satuan); taksiran -> garis bilangan pembulatan (bilangan di antara dua ribuan / ratusan).
//   3 pilihan: benar + 2 pengecoh (banding: judul kolom terbalik, garis bilangan; taksiran: tempat pembulatan salah, tabel nilai tempat).
// Contoh tetap (video Ep. 10 / Buku Saku), muncul sekitar 12%: stadion Sabtu 23.850 lawan Minggu 23.580; toko buku 2.970 + 4.050 (ribuan); belanja Rp18.900 + Rp21.200 (ribuan).
// Tes: node tools/cek-soal-cerita-bab1.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok, fmt, buatOpsi } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (v) => ({ k: 'angka', t: fmt(v), nilai: v, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false }); // angka pengecoh
  const Q = (t) => ({ k: 'tanya', t });
  const sgn = Math.sign;
  const KOL = ['puluh ribuan', 'ribuan', 'ratusan', 'puluhan', 'satuan'];
  const SATUAN_TEMPAT = { 1000: 'ribuan', 100: 'ratusan' };
  const PENENTU = { 1000: 'ratusan', 100: 'puluhan' }; // angka yang menentukan naik atau turun
  const lain = (u) => (u === 1000 ? 100 : 1000);
  // pembulatan terdekat (5 ke atas naik) dengan sisa bagi
  const rnd = (x, u) => { const r = x % u; return r * 2 >= u ? x - r + u : x - r; };
  const flr = (x, u) => x - (x % u);
  const cil = (x, u) => (x % u === 0 ? x : x - (x % u) + u);

  // ---------- Templat cerita ----------
  // Banding: pre(nama) + angka + post. samar = pengganti angka di cerita tanpa angka.
  const TA = [
    { id: 'stadion', nama: ['Sabtu', 'Minggu', 'Jumat', 'Senin', 'Rabu', 'Kamis'], pre: (n) => 'Hari ' + n + ', stadion dikunjungi ', post: ' penonton. ', samar: 'sekian',
      qhi2: 'Hari apa yang lebih ramai?', kata2: 'lebih ramai', qhi3: 'Hari apa yang paling ramai?', kata3hi: 'paling ramai', qlo3: 'Hari apa yang paling sepi?', kata3lo: 'paling sepi', sama: 'Sama ramai' },
    { id: 'toko', nama: ['Toko Mawar', 'Toko Melati', 'Toko Dahlia', 'Toko Kenari'], pre: (n) => n + ' menjual ', post: ' buku. ', samar: 'sekian',
      qhi2: 'Toko mana yang menjual lebih banyak buku?', kata2: 'lebih banyak', qhi3: 'Toko mana yang menjual paling banyak buku?', kata3hi: 'paling banyak', qlo3: 'Toko mana yang menjual paling sedikit buku?', kata3lo: 'paling sedikit', sama: 'Sama banyak' },
    { id: 'harga', nama: ['Sepeda', 'Lemari', 'Kulkas', 'Mesin cuci'], pre: (n) => n + ' harganya Rp', post: '. ', samar: 'sekian',
      qhi2: 'Barang mana yang lebih mahal?', kata2: 'lebih mahal', qhi3: 'Barang mana yang paling mahal?', kata3hi: 'paling mahal', qlo3: 'Barang mana yang paling murah?', kata3lo: 'paling murah', sama: 'Sama mahal' },
    { id: 'sekolah', nama: ['SD Harapan', 'SD Pelita', 'SD Tunas', 'SD Mentari'], pre: (n) => n + ' memiliki ', post: ' siswa. ', samar: 'sekian',
      qhi2: 'Sekolah mana yang siswanya lebih banyak?', kata2: 'lebih banyak', qhi3: 'Sekolah mana yang siswanya paling banyak?', kata3hi: 'paling banyak', qlo3: 'Sekolah mana yang siswanya paling sedikit?', kata3lo: 'paling sedikit', sama: 'Sama banyak' },
    { id: 'pabrik', nama: ['Pabrik Maju', 'Pabrik Jaya', 'Pabrik Mulia', 'Pabrik Asri'], pre: (n) => n + ' membuat ', post: ' botol dalam sebulan. ', samar: 'sekian',
      qhi2: 'Pabrik mana yang membuat lebih banyak botol?', kata2: 'lebih banyak', qhi3: 'Pabrik mana yang membuat paling banyak botol?', kata3hi: 'paling banyak', qlo3: 'Pabrik mana yang membuat paling sedikit botol?', kata3lo: 'paling sedikit', sama: 'Sama banyak' },
  ];
  // Taksir: total(k) = pertanyaan jumlah untuk k bilangan; sel = pertanyaan selisih. uang = angka berawalan Rp.
  const KATA_K = { 2: 'dua', 3: 'tiga' };
  const TB = [
    { id: 'buku', nama: ['Juli', 'Agustus', 'September', 'Oktober'], pre: (n) => 'Bulan ' + n + ' terjual ', post: ' buku. ', samar: 'sekian', satuan: 'buku',
      total: (k) => 'Kira-kira berapa buku yang terjual dalam ' + KATA_K[k] + ' bulan itu?', sel: 'Kira-kira berapa selisih buku yang terjual pada kedua bulan itu?' },
    { id: 'penonton', nama: ['Sabtu', 'Minggu', 'Jumat', 'Senin'], pre: (n) => 'Hari ' + n + ' ada ', post: ' penonton di stadion. ', samar: 'sekian', satuan: 'penonton',
      total: (k) => 'Kira-kira berapa penonton dalam ' + KATA_K[k] + ' hari itu?', sel: 'Kira-kira berapa selisih penonton pada kedua hari itu?' },
    { id: 'belanja', nama: ['Kipas angin', 'Setrika', 'Sepatu', 'Tas sekolah', 'Jaket', 'Rak buku'], pre: (n) => n + ' harganya Rp', post: '. ', samar: 'sekian', satuan: '', uang: true,
      total: (k) => 'Kira-kira berapa rupiah yang harus dibayar untuk ' + (k === 2 ? 'kedua' : 'ketiga') + ' barang itu?', sel: 'Kira-kira berapa rupiah selisih harga kedua barang itu?' },
    { id: 'botol', nama: ['Pabrik Maju', 'Pabrik Jaya', 'Pabrik Mulia', 'Pabrik Asri'], pre: (n) => n + ' membuat ', post: ' botol. ', samar: 'sekian', satuan: 'botol',
      total: (k) => 'Kira-kira berapa botol yang dibuat ' + (k === 2 ? 'kedua' : 'ketiga') + ' pabrik itu?', sel: 'Kira-kira berapa selisih botol yang dibuat kedua pabrik itu?' },
  ];
  const ORANG = ['Ayu', 'Bima', 'Citra', 'Dimas', 'Rina', 'Tono'];
  const ITEM_CUKUP = ['sepeda', 'kipas angin', 'sepatu', 'tas sekolah', 'jaket', 'rak buku', 'lemari kecil', 'meja belajar'];
  const tpA = (id) => TA.find((x) => x.id === id);
  const tpB = (id) => TB.find((x) => x.id === id);
  const DIS = [' Kejadian itu pada tanggal {x}.', ' Ada {x} petugas yang membantu.', ' Semua itu terjadi dalam {x} hari.'];
  const CONTOH = [
    { jenis: 'banding', tingkat: [1, 2], tp: 'stadion', nama: ['Sabtu', 'Minggu'], xs: [23850, 23580] },
    { jenis: 'taksir', mode: 'jumlah', tingkat: [1, 2], tp: 'buku', nama: ['Juli', 'Agustus'], xs: [2970, 4050], u: 1000 },
    { jenis: 'taksir', mode: 'jumlah', tingkat: [1, 2], tp: 'belanja', nama: ['Kipas angin', 'Setrika'], xs: [18900, 21200], u: 1000 },
  ];

  // ---------- Pembuat bilangan (banding) ----------
  const berapaAngka = (n) => String(n).length;
  function tukarSebelah(n) { // tukar dua angka bersebelahan yang berbeda (tanpa nol di depan)
    const s = String(n).split(''), calon = [];
    for (let i = 0; i < s.length - 1; i++) if (s[i] !== s[i + 1] && !(i === 0 && s[1] === '0')) calon.push(i);
    if (!calon.length) return n;
    const i = pilih(calon);
    [s[i], s[i + 1]] = [s[i + 1], s[i]];
    return Number(s.join(''));
  }
  function ubahAngka(n, dariKanan) { // ganti satu angka (posisi dariKanan: 0 = satuan) dengan angka lain
    const s = String(n).split(''), i = s.length - 1 - dariKanan;
    let d; do { d = acak(i === 0 ? 1 : 0, 9); } while (String(d) === s[i]);
    s[i] = String(d);
    return Number(s.join(''));
  }
  const acakDigit = (a, b) => acak(a, b);
  function dasar(t) {
    if (t === 1) return Math.random() < 0.5 ? acak(1000, 9999) : acak(10000, 60000);
    return acak(10000, 99999);
  }
  function pasangA(t) {
    const r = Math.random();
    let a, b;
    if (r < 0.08) { a = dasar(t); return kocok([a, a]); } // sama
    if (r < 0.40) { a = dasar(t); for (let i = 0; i < 20; i++) { b = tukarSebelah(a); if (b !== a) break; } return kocok([a, b]); } // angka sama, urutan beda
    if (r < 0.70) { a = dasar(t); b = ubahAngka(a, acak(0, Math.min(3, berapaAngka(a) - 1))); return kocok([a, b]); } // beda di satu tempat
    if (r < 0.88) { // banyak angka beda: 9.xxx lawan 10.xxx
      a = acak(9000, 9999); b = acak(10000, 11999);
      return kocok([a, b]);
    }
    do { a = dasar(t); b = dasar(t); } while (a === b);
    return [a, b];
  }
  function tigaA() {
    for (;;) {
      const a = acak(10000, 99999), bag = [a, tukarSebelah(a), ubahAngka(a, acak(0, 3))];
      if (Math.random() < 0.25) bag[2] = acak(9000, 9999);
      if (new Set(bag).size === 3 && Math.max(...bag) <= 99999) return kocok(bag);
    }
  }

  // ---------- Pembuat bilangan (taksir) ----------
  function bilT(u, t) {
    for (;;) {
      const x = u === 1000 ? (t === 1 ? (Math.random() < 0.5 ? acak(1500, 9999) : acak(10000, 49999)) : acak(1500, 49999)) : (t === 1 ? acak(1500, 9999) : acak(1200, 49999));
      if (x % (u === 1000 ? 1000 : 100) !== 0) return x;
    }
  }

  // ---------- Gambar: tabel nilai tempat & garis bilangan ----------
  const W = { warna: ['#3A86FF', '#FF8A3D', '#2BB673'], teks: '#1F2A44', merah: '#FF6384', kuning: '#FFE08A', hijau: '#BFEBD3' };
  const svg = (isi, tinggi) => '<svg viewBox="0 0 320 ' + tinggi + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  const HEAD = [['Puluh', 'ribuan'], ['Ribuan'], ['Ratusan'], ['Puluhan'], ['Satuan']];
  function tabelSvg(nama, xs, o) {
    o = o || {};
    const nw = 80, cw = 47.6, x0 = 1, h0 = 40, rh = 42, n = xs.length;
    const head = o.terbalik ? HEAD.slice().reverse() : HEAD;
    let s = '<g data-model="tabel" data-urut="' + (o.terbalik ? 'terbalik' : 'normal') + '">';
    head.forEach((h, c) => {
      const cx = x0 + nw + c * cw + cw / 2;
      s += '<rect x="' + (x0 + nw + c * cw) + '" y="2" width="' + cw + '" height="' + (h0 - 4) + '" fill="#E8EEFC" stroke="' + W.teks + '" stroke-width="2"/>';
      s += '<text data-h="' + c + '" x="' + cx + '" y="' + (h.length === 2 ? 17 : 25) + '" font-size="9.5" font-weight="800" text-anchor="middle" fill="' + W.teks + '">' + h.map((p, i) => (h.length === 2 ? '<tspan x="' + cx + '" dy="' + (i ? 13 : 0) + '">' + p + '</tspan>' : p)).join('') + '</text>';
    });
    xs.forEach((v, k) => {
      const y = h0 + k * rh, dg = String(v).padStart(5, ' ');
      s += '<g data-n="' + nama[k] + '" data-v="' + v + '">';
      s += '<text x="' + (x0 + 2) + '" y="' + (y + rh / 2 + 5) + '" font-size="10.5" font-weight="800" fill="' + W.warna[k] + '">' + nama[k] + '</text>';
      for (let c = 0; c < 5; c++) {
        s += '<rect x="' + (x0 + nw + c * cw) + '" y="' + (y + 2) + '" width="' + cw + '" height="' + (rh - 4) + '" fill="#FFFFFF" stroke="' + W.teks + '" stroke-width="2"/>';
        if (dg[c] !== ' ') s += '<text data-c="' + c + '" x="' + (x0 + nw + c * cw + cw / 2) + '" y="' + (y + rh / 2 + 9) + '" font-size="26" font-weight="800" text-anchor="middle" fill="' + W.teks + '">' + dg[c] + '</text>';
      }
      s += '</g>';
    });
    s += '</g>';
    return svg(s, h0 + n * rh + 8);
  }
  function garisSvg(xs, o) {
    const u = o.unit, n = xs.length, x0 = 38, lebar = 244, rh = n === 2 ? 80 : 68;
    let s = '<g data-model="garis" data-unit="' + u + '">';
    xs.forEach((v, k) => {
      const L = flr(v, u), U = L + u, y = 10 + k * rh + 38, tengah = L + u / 2, xv = x0 + ((v - L) / u) * lebar;
      s += '<g data-v="' + v + '" data-l="' + L + '" data-u="' + U + '" data-unit="' + u + '">';
      s += '<line x1="' + (x0 - 12) + '" y1="' + y + '" x2="' + (x0 + lebar + 12) + '" y2="' + y + '" stroke="' + W.teks + '" stroke-width="4" stroke-linecap="round"/>';
      [[L, x0, true], [U, x0 + lebar, true], [tengah, x0 + lebar / 2, false]].forEach(([nilai, x, utama]) => {
        s += '<line x1="' + x + '" y1="' + (y - (utama ? 11 : 7)) + '" x2="' + x + '" y2="' + (y + (utama ? 11 : 7)) + '" stroke="' + (utama ? W.teks : '#8A94AD') + '" stroke-width="' + (utama ? 3 : 2) + '"' + (utama ? '' : ' stroke-dasharray="3 3"') + '/>';
        s += '<text x="' + x + '" y="' + (y + 28) + '" font-size="' + (utama ? 12.5 : 10.5) + '" font-weight="' + (utama ? 800 : 700) + '" text-anchor="middle" fill="' + (utama ? W.teks : '#6B7694') + '">' + (utama ? fmt(nilai) : 'tengah') + '</text>';
      });
      s += '<circle cx="' + xv + '" cy="' + y + '" r="9" fill="' + W.warna[k] + '" stroke="' + W.teks + '" stroke-width="3"/>';
      s += '<text x="' + Math.min(Math.max(xv, x0 + 6), x0 + lebar - 6) + '" y="' + (y - 17) + '" font-size="14" font-weight="800" text-anchor="middle" fill="' + W.teks + '">' + fmt(v) + '</text>';
      s += '</g>';
    });
    s += '</g>';
    return svg(s, n * rh + 26);
  }
  function pilihanBanding(nama, xs) {
    const pil = [
      { id: 'tabel-benar', ket: 'Tabel nilai tempat', svg: tabelSvg(nama, xs) },
      { id: 'tabel-terbalik', ket: 'Tabel nilai tempat', svg: tabelSvg(nama, xs, { terbalik: true }) },
      { id: 'garis-salah', ket: 'Garis bilangan', svg: garisSvg(xs, { unit: 1000 }) },
    ];
    return { benar: 'tabel-benar', pilihan: kocok(pil) };
  }
  function pilihanTaksir(nama, xs, u) {
    const pil = [
      { id: 'garis-benar', ket: 'Garis bilangan', svg: garisSvg(xs, { unit: u }) },
      { id: 'garis-unit', ket: 'Garis bilangan', svg: garisSvg(xs, { unit: lain(u) }) },
      { id: 'tabel-salah', ket: 'Tabel nilai tempat', svg: tabelSvg(nama, xs) },
    ];
    return { benar: 'garis-benar', pilihan: kocok(pil) };
  }

  // ---------- Teks penjelasan ----------
  function bandingTeks(a, b) { // kalimat: bandingkan dua bilangan dari kiri
    const sa = String(a), sb = String(b);
    if (a === b) return 'Semua angkanya sama, dari kiri sampai kanan. ' + fmt(a) + ' sama dengan ' + fmt(b) + '.';
    const besar = Math.max(a, b), kecil = Math.min(a, b);
    if (sa.length !== sb.length) return fmt(besar) + ' punya lebih banyak angka, jadi lebih besar daripada ' + fmt(kecil) + '.';
    let i = 0; while (sa[i] === sb[i]) i++;
    const kol = KOL[5 - sa.length + i];
    return 'Bandingkan dari kiri. ' + (i === 0 ? 'Angka paling kiri sudah berbeda' : 'Angka di sebelah kiri sama (sampai ' + KOL[5 - sa.length + i - 1] + '), angka pertama yang berbeda ada di ' + kol) + ': ' + sa[i] + ' lawan ' + sb[i] + '. ' + fmt(besar) + ' lebih besar dari ' + fmt(kecil) + '.';
  }
  const urutSama = (a, b) => String(a).split('').sort().join('') === String(b).split('').sort().join('') && a !== b;
  function tabelCek(nama, xs) {
    // tabel mini (HTML), kolom sama diwarnai hijau, kolom beda pertama kuning
    const dg = xs.map((v) => String(v).padStart(5, ' '));
    let beda = -1; for (let c = 0; c < 5 && beda < 0; c++) if (dg.some((d) => d[c] !== dg[0][c])) beda = c;
    const th = 'style="padding:2px 6px;border:2px solid #1F2A44;background:#E8EEFC;font-size:.62em"', td = (c, d) => 'style="padding:2px 8px;border:2px solid #1F2A44;text-align:center;font-weight:800;background:' + (d === ' ' ? '#FFFFFF' : c < beda || beda < 0 ? W.hijau : c === beda ? W.kuning : '#FFFFFF') + '"';
    let h = '<table style="margin:6px auto;border-collapse:collapse"><tr><th style="border:0"></th>' + HEAD.map((x) => '<th ' + th + '>' + x.join(' ') + '</th>').join('') + '</tr>';
    xs.forEach((v, k) => { h += '<tr><td style="padding:2px 8px;font-weight:800;text-align:right;border:0">' + nama[k] + '</td>' + dg[k].split('').map((d, c) => '<td ' + td(c, d) + '>' + (d === ' ' ? '&nbsp;' : d) + '</td>').join('') + '</tr>'; });
    return h + '</table>';
  }

  // ---------- Bagian cerita ----------
  function sisipDis(segmen, tingkat, terlarang) {
    const dis = [];
    if (tingkat === 3) {
      kocok(DIS).slice(0, acak(1, 2)).forEach((kal) => {
        let v; do { v = acak(13, 45); } while (terlarang.has(v) || dis.includes(v));
        dis.push(v);
        const [x, y] = kal.split('{x}'); segmen.push(T(x.replace(/^ /, '')), P(v), T(y + ' '));
      });
    }
    return dis;
  }
  const kodeUnik = (jenis, tp, xs, nama) => jenis + '-' + tp + '-' + xs.join('-') + '-' + nama.join('+');
  const jenisBanding = { id: 'banding', nama: 'Bandingkan (pas)', petunjuk: 'yang ditanya <b>mana yang lebih banyak, ramai, atau mahal</b>. Angkanya <b>pas</b> dibandingkan dari kiri.',
    gambarPetunjuk: 'Untuk membandingkan, gambar yang cocok adalah <b>tabel nilai tempat</b> dengan judul kolom yang urut benar: satuan di paling kanan.' };
  const jenisTaksir = { id: 'taksir', nama: 'Taksiran (kira-kira)', petunjuk: 'ada kata <b>kira-kira</b>. Tiap bilangan dibulatkan dulu, baru dihitung.',
    gambarPetunjuk: 'Untuk kira-kira, gambar yang cocok adalah <b>garis bilangan</b>: bilangan ada di antara dua ribuan (atau ratusan) yang sesuai pertanyaan.' };

  // ---------- BANDING ----------
  function soalBanding(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      let ct = null;
      if (Math.random() < 0.12) { const c = CONTOH.filter((x) => x.jenis === 'banding' && x.tingkat.includes(tingkat)); if (c.length) ct = pilih(c); }
      let tp, nama, xs, mode = 'dua', paling = null;
      if (ct) { tp = tpA(ct.tp); nama = ct.nama; xs = ct.xs.slice(); }
      else if (tingkat === 3) { tp = pilih(TA); xs = tigaA(); nama = kocok(tp.nama).slice(0, 3); mode = 'tiga'; paling = Math.random() < 0.65 ? 'hi' : 'lo'; }
      else { tp = pilih(TA); xs = pasangA(tingkat); nama = kocok(tp.nama).slice(0, 2); }
      const kd = kodeUnik(mode === 'tiga' ? 'bd3' + paling : 'bd', tp.id, xs, nama);
      if (pakai && pakai.has(kd)) continue;
      let kunci, labelOpsi, tanya, kata, hasil = 0, kunciIdx = -1;
      if (mode === 'dua') {
        hasil = sgn(xs[0] - xs[1]);
        kunci = hasil === 0 ? 3 : hasil > 0 ? 1 : 2; kunciIdx = hasil >= 0 ? 0 : 1;
        labelOpsi = { 1: nama[0], 2: nama[1], 3: tp.sama }; tanya = tp.qhi2; kata = tp.kata2;
      } else {
        const urut = [0, 1, 2].sort((a, b) => xs[b] - xs[a]);
        kunciIdx = paling === 'hi' ? urut[0] : urut[2]; kunci = kunciIdx + 1;
        labelOpsi = { 1: nama[0], 2: nama[1], 3: nama[2] }; tanya = paling === 'hi' ? tp.qhi3 : tp.qlo3; kata = paling === 'hi' ? tp.kata3hi : tp.kata3lo;
      }
      const sebab = {};
      [1, 2, 3].filter((k) => k !== kunci).forEach((k) => {
        let s = '';
        if (mode === 'dua') {
          const a = xs[0], b = xs[1];
          if (k === 3) s = 'Kedua bilangan tidak sama. ' + bandingTeks(a, b);
          else { s = bandingTeks(a, b); if (urutSama(a, b)) s += ' Angkanya sama, tetapi urutannya beda: lihat dari kiri.'; if (berapaAngka(a) !== berapaAngka(b)) s += ' Jangan hanya melihat angka depan: hitung dulu banyak angkanya.'; }
        } else {
          const i = k - 1, w = xs[kunciIdx];
          s = bandingTeks(Math.max(xs[i], w), Math.min(xs[i], w));
          s += ' ' + nama[i] + ' bukan yang ' + (paling === 'hi' ? tp.kata3hi : tp.kata3lo) + '.';
          if (urutSama(xs[i], w)) s += ' Angkanya sama, tetapi urutannya beda.';
        }
        sebab[k] = s;
      });
      const segmen = [];
      nama.forEach((n, i) => { segmen.push(T(tp.pre(n)), N(xs[i]), T(tp.post)); });
      const dis = sisipDis(segmen, tingkat, new Set(xs));
      segmen.push(Q(tanya));
      const cerita0 = nama.map((n) => tp.pre(n).replace(/Rp$/, '') + tp.samar + tp.post).join('') + tanya;
      const urutNama = [0, 1, 2].slice(0, xs.length).sort((a, b) => xs[b] - xs[a]).map((i) => nama[i] + ' ' + fmt(xs[i]));
      const cek = 'Bandingkan <b>pas</b>, dari kiri, angka demi angka (hijau = sama, kuning = angka pertama yang berbeda).' + tabelCek(nama, xs) +
        (mode === 'dua'
          ? bandingTeks(Math.max(xs[0], xs[1]), Math.min(xs[0], xs[1])).replace(/^Bandingkan dari kiri\. /, '') + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>' + (hasil !== 0 ? '<br><small>Selisihnya ' + fmt(Math.abs(xs[0] - xs[1])) + '.</small>' : '')
          : 'Dari yang terbesar: ' + urutNama.join(', ') + '.<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>');
      return {
        jenis: 'banding', tingkat, kode: kd, mode, paling, tp: tp.id, nama, xs, hasil, kunciIdx,
        cerita0, kata: [kata],
        segmen, angkaPenting: xs.slice(), angkaPengecoh: dis,
        arahAngka: 'angka penting', hintKurang: 'Masih ada angka penting yang belum kuning. Ketuk semua bilangan di cerita.',
        gambar: pilihanBanding(nama, xs), tanya4: { teks: tanya, satuan: '' },
        kunci, opsi: kocok([1, 2, 3]), labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalBanding gagal');
  }

  // ---------- TAKSIRAN ----------
  const hitungOp = (xs, mode, f) => { const r = xs.map(f); return mode === 'selisih' ? Math.abs(r[0] - r[1]) : r.reduce((p, q) => p + q, 0); };
  const rp = (v) => 'Rp' + fmt(v);
  function langkahBulat(nama, xs, u, uang) {
    const tt = (v) => (uang ? rp(v) : fmt(v));
    return xs.map((x, i) => {
      const d = Math.floor((x % u) / (u / 10)), naik = d >= 5;
      return nama[i] + ' ' + tt(x) + ': angka ' + PENENTU[u] + 'nya ' + d + (naik ? ' (5 ke atas), naik jadi ' : ' (kurang dari 5), turun jadi ') + tt(rnd(x, u));
    }).join('<br>');
  }
  function soalTaksir(tingkat, pakai) {
    for (let coba = 0; coba < 6000; coba++) {
      let ct = null;
      if (Math.random() < 0.12) { const c = CONTOH.filter((x) => x.jenis === 'taksir' && x.tingkat.includes(tingkat)); if (c.length) ct = pilih(c); }
      let mode, tp, nama, xs, u;
      if (ct) { mode = ct.mode; tp = tpB(ct.tp); nama = ct.nama; xs = ct.xs.slice(); u = ct.u; }
      else if (tingkat === 1) { mode = 'jumlah'; u = 1000; tp = pilih(TB); xs = [bilT(u, 1), bilT(u, 1)]; nama = kocok(tp.nama).slice(0, 2); }
      else if (tingkat === 2) { mode = Math.random() < 0.6 ? 'jumlah' : 'selisih'; u = Math.random() < 0.55 ? 1000 : 100; tp = pilih(TB); xs = [bilT(u, 2), bilT(u, 2)]; nama = kocok(tp.nama).slice(0, 2); }
      else if (Math.random() < 0.5) { mode = 'cukup'; u = 1000; tp = tpB('belanja'); xs = [acak(5200, 48000), acak(5200, 48000)]; nama = kocok(ITEM_CUKUP).slice(0, 2); }
      else { mode = 'jumlah'; u = Math.random() < 0.5 ? 1000 : 100; tp = pilih(TB); xs = [bilT(u, 3), bilT(u, 3), bilT(u, 3)]; nama = kocok(tp.nama).slice(0, 3); }
      if (xs.some((x) => x % u === 0 && !ct)) continue;
      if (mode === 'selisih' && rnd(xs[0], u) === rnd(xs[1], u)) continue;
      if (Math.max(...xs) > 99999) continue;
      const exact = mode === 'selisih' ? Math.abs(xs[0] - xs[1]) : xs.reduce((p, q) => p + q, 0);
      const est = hitungOp(xs, mode === 'cukup' ? 'jumlah' : mode, (x) => rnd(x, u));
      if (est === exact || exact > 100000 || est > 100000) continue;
      const kd = kodeUnik('tk' + mode, tp.id, xs, nama);
      if (pakai && pakai.has(kd)) continue;
      const sel = mode === 'selisih', cukup = mode === 'cukup', uang = !!tp.uang;
      const tempat = SATUAN_TEMPAT[u] + ' terdekat';
      const lab = (v) => (uang ? rp(v) : fmt(v) + (tp.satuan ? ' ' + tp.satuan : ''));
      let kunci, opsi, sebab = {}, labelOpsi = {}, tanya, orang = null, U = 0, cek;
      if (cukup) {
        orang = pilih(ORANG);
        const sisi = Math.random() < 0.5;
        U = sisi ? est + acak(2, 9) * 1000 : est - acak(2, 9) * 1000;
        if (U < 5000 || U > 100000) continue;
        kunci = est <= U ? 1 : 2; opsi = [1, 2]; labelOpsi = { 1: 'Cukup', 2: 'Tidak cukup' };
        tanya = 'Kira-kira, cukup tidak uangnya? Bulatkan ke ' + tempat + '.';
        const kal = 'Taksiran belanja ' + rp(est) + (est <= U ? ' kurang dari uangnya ' : ' lebih dari uangnya ') + rp(U) + ', jadi ';
        sebab[1] = kunci === 2 ? kal + 'tidak cukup. Bulatkan harga barang dulu, jumlahkan, lalu bandingkan dengan uang.' : '';
        sebab[2] = kunci === 1 ? kal + 'cukup. Bulatkan harga barang dulu, jumlahkan, lalu bandingkan dengan uang.' : '';
        sebab[kunci] = undefined; delete sebab[kunci];
        cek = 'Pertanyaan <b>kira-kira</b>, jadi bulatkan tiap harga ke ' + tempat + ' (lihat angka ' + PENENTU[u] + 'nya).<br>' + langkahBulat(nama, xs, u, true) + '<br>' +
          rp(rnd(xs[0], u)) + ' + ' + rp(rnd(xs[1], u)) + ' = <b>' + rp(est) + '</b>. Uang ' + orang + ' ' + rp(U) + (est <= U ? ' lebih dari ' : ' kurang dari ') + rp(est) + '.<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>' +
          '<br><small>Hitung pas: ' + rp(xs[0]) + ' + ' + rp(xs[1]) + ' = ' + rp(exact) + ' (hanya untuk dibandingkan, soalnya kira-kira).</small>';
      } else {
        kunci = est;
        const u2 = lain(u), opn = sel ? 'selisih' : 'jumlah';
        const grup = [
          { s: 'Itu hasil menghitung <b>pas</b>. Yang diminta kira-kira: bulatkan tiap bilangan dulu, baru ' + (sel ? 'kurangkan' : 'jumlahkan') + '.', v: [exact] },
          { s: 'Itu hanya membulatkan hasilnya. Bulatkan <b>tiap bilangan</b> dulu, baru ' + (sel ? 'kurangkan' : 'jumlahkan') + '.', v: [rnd(exact, u)] },
          { s: 'Ada bilangan yang dibulatkan ke bawah padahal angka ' + PENENTU[u] + 'nya 5 ke atas. Aturannya: 5 ke atas naik, kurang dari 5 turun.', v: [hitungOp(xs, opn, (x) => flr(x, u))] },
          { s: 'Itu dibulatkan ke tempat yang salah. Soal ini meminta ' + tempat + ', bukan ' + SATUAN_TEMPAT[u2] + '.', v: [hitungOp(xs, opn, (x) => rnd(x, u2))] },
          { s: 'Semua bilangan dibulatkan ke atas. Lihat angka ' + PENENTU[u] + 'nya: yang kurang dari 5 harus turun.', v: [hitungOp(xs, opn, (x) => cil(x, u))] },
        ];
        if (sel) grup.push({ s: 'Itu hasil menjumlah. Yang ditanya selisih, jadi dikurangi.', v: [xs.map((x) => rnd(x, u)).reduce((p, q) => p + q, 0)] });
        const cadangan = [est + u, est - u, est + 2 * u, est - 2 * u, est + 10 * u, est - 10 * u];
        const hasilOpsi = buatOpsi(kunci, grup, cadangan, { min: 1, maks: 100000, n: 4 });
        opsi = hasilOpsi.opsi; sebab = hasilOpsi.sebab;
        opsi.forEach((o) => { if (o !== kunci && !sebab[o]) sebab[o] = 'Belum tepat. Bulatkan tiap bilangan ke ' + tempat + ' dulu (5 ke atas naik), baru ' + (sel ? 'kurangkan' : 'jumlahkan') + '.'; });
        opsi.forEach((o) => { labelOpsi[o] = lab(o); });
        tanya = (sel ? tp.sel : tp.total(xs.length)) + ' Bulatkan ke ' + tempat + '.';
        const rb = xs.map((x) => rnd(x, u));
        cek = 'Pertanyaan <b>kira-kira</b>, jadi bulatkan <b>tiap bilangan</b> ke ' + tempat + ' (lihat angka ' + PENENTU[u] + 'nya, 5 ke atas naik).<br>' + langkahBulat(nama, xs, u, uang) + '<br>' +
          (sel ? [rb[0], rb[1]].sort((a, b) => b - a).map((v) => (uang ? rp(v) : fmt(v))).join(' − ') : rb.map((v) => (uang ? rp(v) : fmt(v))).join(' + ')) + ' = <b>' + lab(est) + '</b>. Jawaban: <b>' + labelOpsi[kunci] + '</b>' +
          '<br><small>Hitung pas: ' + (sel ? [xs[0], xs[1]].sort((a, b) => b - a).map((v) => (uang ? rp(v) : fmt(v))).join(' − ') : xs.map((v) => (uang ? rp(v) : fmt(v))).join(' + ')) + ' = ' + lab(exact) + '. Beda sedikit, karena hanya kira-kira.</small>';
      }
      const segmen = [];
      let cerita0, kataIsi;
      if (cukup) {
        segmen.push(T(orang + ' membawa uang Rp'), N(U), T('. Ia ingin membeli ' + nama[0] + ' seharga Rp'), N(xs[0]), T(' dan ' + nama[1] + ' seharga Rp'), N(xs[1]), T('. '));
        cerita0 = orang + ' membawa uang sekian rupiah. Ia ingin membeli ' + nama[0] + ' seharga sekian rupiah dan ' + nama[1] + ' seharga sekian rupiah. ' + tanya;
      } else {
        nama.forEach((n, i) => { segmen.push(T(tp.pre(n)), N(xs[i]), T(tp.post)); });
        cerita0 = nama.map((n) => tp.pre(n).replace(/Rp$/, '') + tp.samar + tp.post).join('') + tanya;
      }
      const dis = sisipDis(segmen, tingkat, new Set(xs.concat([U])));
      segmen.push(Q(tanya));
      const penting = cukup ? [U].concat(xs) : xs.slice();
      return {
        jenis: 'taksir', tingkat, kode: kd, mode, tp: tp.id, nama, xs, u, est, exact, U, orang, uang,
        cerita0, kata: ['Kira-kira'],
        segmen, angkaPenting: penting, angkaPengecoh: dis,
        arahAngka: 'angka penting', hintKurang: 'Masih ada angka penting yang belum kuning. Ketuk semua bilangan di cerita (termasuk uangnya).',
        gambar: pilihanTaksir(nama, xs, u), tanya4: { teks: tanya, satuan: '' },
        kunci, opsi, labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalTaksir gagal');
  }

  const data = {
    id: 'k4b1',
    jenis: [jenisBanding, jenisTaksir],
    tingkat: ['bandingkan dua bilangan, taksiran jumlah ke ribuan', 'bandingkan 5 angka, taksiran jumlah atau selisih ke ratusan atau ribuan', 'tiga pilihan, taksiran tiga bilangan atau cukup tidak uangnya, dan angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Pas atau kira-kira? Kata "kira-kira" berarti taksiran: bulatkan tiap bilangan dulu (5 ke atas naik), baru hitung. Kalau pas, bandingkan dari kiri sampai ketemu angka pertama yang berbeda.',
    jenisTingkat: () => ['banding', 'taksir'],
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'taksir' ? soalTaksir(tingkat, pakai) : soalBanding(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    TA, TB, CONTOH, ORANG, fmt, rnd,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b1 = data;
})(typeof window !== 'undefined' ? window : globalThis);
