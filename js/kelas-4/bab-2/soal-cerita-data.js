// Data 📖 Soal Cerita Kelas 4 Bab 2 (Perkalian & Pembagian) untuk mesin js/soal-cerita.js.
// Pesan inti (video Jago Soal Cerita Ep. 7): KALI DULU, LALU BAGI, dan arti SISA. Tiga jenis soal:
//   KALI     : kelompok yang isinya sama, ditanya semuanya (tingkat 1).
//   BAGI     : jumlah semuanya sudah diketahui, tinggal dibagi rata / dimuat ke wadah (tingkat 1 "hasil dan sisa", tingkat 3 "berapa wadah").
//   KALIBAGI : kelompok sama dikali dulu, lalu dibagi (tingkat 2 "hasil dan sisa"; tingkat 3 "berapa wadah dibutuhkan" atau "berapa yang tidak kebagian").
// Jawaban "hasil dan sisa" (mis. 13 sisa 5): pilihan memakai kode bilangan hasil * 1000 + sisa dan labelOpsi (kode -> "13 sisa 5"),
// seperti Bab 10; mesin js/soal-cerita.js tidak berubah untuk bab lain (hanya menambah data.jenisTingkat yang bersifat opsional).
// Arti sisa (tingkat 3): "berapa wadah dibutuhkan" = hasil bagi + 1 (sisa butuh satu wadah lagi); "tidak kebagian" = sisanya.
// Langkah Gambar: model batang, semua di atas, dibagi di bawah (3 pilihan: kelompok saja / satu batang dibagi / kelompok lalu dibagi).
// Penekanan tabel 6, 7, 8, 12: sekitar 70% soal memuat angka itu. Hasil kali selalu <= 3 angka. Semua kunci dihitung kode.
// Tes: node tools/cek-soal-cerita-bab2.js
// Contoh tetap (sama dengan video Ep. 7), muncul sekitar 12%:
//   kue Bu Rina 12 kotak x 8 kue = 96, dibagi ke 7 meja -> 13 sisa 5; pensil sekolah 15 dus x 12 = 180, dibagi ke 8 kelas -> 22 sisa 4 (tingkat 2);
//   50 murid, tiap mobil memuat 8 -> 50 : 8 = 6 sisa 2 -> 7 mobil (tingkat 3, jenis bagi).
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const H = modul ? require('./hitung.js') : root.HitungB2;
  const { acak, pilih, kocok, fmt } = M;
  const FOKUS = [6, 7, 8, 12];

  const T = (t) => ({ k: 'teks', t });
  const N = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false }); // angka pengecoh
  const Q = (t) => ({ k: 'tanya', t });
  const kode2 = (q, r) => q * 1000 + r; // jawaban "q sisa r"
  const hasilQ = (c) => Math.floor(c / 1000), hasilR = (c) => c % 1000;
  const labelHasil = (c) => (hasilR(c) ? hasilQ(c) + ' sisa ' + hasilR(c) : String(hasilQ(c)));

  // Rentang per tingkat: m = banyak kelompok, k = isi tiap kelompok, n = pembagi. (hasil kali m x k <= 999)
  const R = {
    1: { m: [3, 9], k: [3, 9], n: [3, 9] },       // tingkat 1: kali saja (m x k) atau bagi bersisa (q = hasil bagi, n = pembagi)
    2: { m: [5, 15], k: [5, 15], n: [3, 12] },
    3: { m: [5, 25], k: [4, 15], n: [5, 15] },
  };
  const rentang = (r) => { const a = []; for (let i = r[0]; i <= r[1]; i++) a.push(i); return a; };
  const dari = (r, fokus) => { const s = rentang(r).filter((x) => FOKUS.includes(x) === fokus); return pilih(s.length ? s : rentang(r)); };
  // Pilih angka dengan penekanan 6/7/8/12 (sekitar 70% soal memuat satu): peran 'pair' = di m atau k, 'n' = di pembagi, 'tak' = tanpa.
  function angkaSoal(rm, rk, rn) {
    const x = Math.random();
    const peran = rn ? (x < 0.34 ? 'tak' : x < 0.74 ? 'pair' : 'n') : (x < 0.32 ? 'tak' : 'pair');
    let m, k, n = null;
    if (peran === 'pair') {
      if (Math.random() < 0.5) { m = dari(rm, true); k = pilih(rentang(rk)); } else { k = dari(rk, true); m = pilih(rentang(rm)); }
      if (rn) n = dari(rn, false);
    } else {
      m = dari(rm, false); k = dari(rk, false);
      if (rn) n = dari(rn, peran === 'n');
    }
    return { m, k, n };
  }
  const adaFokus = (...a) => a.some((x) => FOKUS.includes(x));

  // ---------- Templat cerita ----------
  // KB: kelompok sama (kel) berisi benda (isi), dibagi rata ke penerima (pen). Dipakai: kali, bagi (T1), kalibagi hasil (T2), kalibagi sisa (T3).
  const KB = [
    { orang: 'Bu Rina', verb: 'membuat', kel: 'kotak', isi: 'kue', pen: 'meja' },
    { orang: 'Sekolah', verb: 'membeli', kel: 'dus', isi: 'pensil', pen: 'kelas' },
    { orang: 'Pak Dani', verb: 'memanen', kel: 'keranjang', isi: 'jeruk', pen: 'warung' },
    { orang: 'Kak Maya', verb: 'membeli', kel: 'bungkus', isi: 'stiker', pen: 'teman' },
    { orang: 'Perpustakaan', verb: 'menerima', kel: 'peti', isi: 'buku', pen: 'rak' },
    { orang: 'Bu Tini', verb: 'menyiapkan', kel: 'kantong', isi: 'permen', pen: 'anak' },
  ];
  // BT: dimuat ke wadah ("berapa wadah dibutuhkan"). kel dipakai bila ada kelompok (kalibagi); bagi saja memakai jumlah semuanya.
  const BT = [
    { kel: 'kelas', isi: 'murid', wadah: 'bus', kerja: 'naik', agar: 'terangkut' },
    { kel: 'loyang', isi: 'kue', wadah: 'kotak', kerja: 'dimasukkan ke', agar: 'tertampung' },
    { kel: 'keluarga', isi: 'orang', wadah: 'perahu', kerja: 'naik', agar: 'terangkut' },
    { kel: 'rak', isi: 'buku', wadah: 'kardus', kerja: 'dimasukkan ke', agar: 'tertampung' },
    { kel: 'regu', isi: 'murid', wadah: 'mobil', kerja: 'naik', agar: 'terangkut' },
  ];
  const IDX_MOBIL = 4;
  const CONTOH2 = [{ ti: 0, m: 12, k: 8, n: 7 }, { ti: 1, m: 15, k: 12, n: 8 }];
  const CONTOH3 = { ti: IDX_MOBIL, total: 50, n: 8 };
  const DIS = [' Kegiatan itu berlangsung selama {x} jam.', ' Tempatnya berjarak {x} kilometer dari sekolah.', ' Acara itu dimulai pada tanggal {x}.', ' Ada {x} orang yang membantu.'];

  function sisipDis(segmen, tingkat, terlarang) {
    const dis = [];
    if (tingkat < 3) return dis;
    kocok(DIS).slice(0, acak(1, 2)).forEach((kal) => {
      let v; do { v = acak(2, 30); } while (terlarang.has(v) || dis.includes(v));
      dis.push(v);
      const [d, b] = kal.split('{x}'); segmen.push(T(d), P(v), T(b));
    });
    return dis;
  }
  const opsiBesar = { min: 1, maks: 10000000 };

  // ---------- Gambar: model batang (tanpa angka) ----------
  const W = { biru: '#3A86FF', hijau: '#2BB673', oranye: '#FF8A3D', merah: '#FF6384', teks: '#1F2A44' };
  const svg = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  const kotak = (x, y, w, h, isi, putus) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (putus ? '#FFF1F4' : isi) + '" stroke="' + (putus ? W.merah : W.teks) + '" stroke-width="' + (putus ? 4 : 3) + '"' + (putus ? ' stroke-dasharray="8 6"' : '') + '/>';
  const deret = (x0, y, h, jml, w, isi) => { let s = ''; for (let i = 0; i < jml; i++) s += kotak(x0 + i * w, y, w, h, isi); return s; };
  const panah = (x, y1, y2) => '<path d="M' + x + ' ' + y1 + ' V' + y2 + '" stroke="' + W.teks + '" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M' + (x - 9) + ' ' + (y2 - 10) + ' L' + x + ' ' + y2 + ' L' + (x + 9) + ' ' + (y2 - 10) + '" stroke="' + W.teks + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
  const bawahBagi = () => deret(50, 112, 40, 3, 60, W.oranye) + kotak(230, 112, 40, 40, '', true) + '<text x="250" y="176" font-size="16" font-weight="700" text-anchor="middle" fill="' + W.teks + '">sisa</text>';
  const GAMBAR = {
    // kelompok sama dikumpulkan jadi satu batang, ditanya semuanya
    kali() {
      return svg(deret(50, 56, 46, 4, 55, W.biru) + '<path d="M50 116 v12 H270 v-12" stroke="' + W.merah + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="170" font-size="34" font-weight="800" text-anchor="middle" fill="' + W.merah + '">?</text>');
    },
    // satu batang (semua) dibagi rata ke beberapa bagian, ada sisa
    bagi() {
      return svg(kotak(50, 22, 220, 40, W.hijau) + panah(160, 68, 100) + bawahBagi());
    },
    // kelompok sama di atas (kali dulu), lalu dibagi rata di bawah
    kalibagi() {
      return svg(deret(50, 22, 40, 4, 55, W.biru) + panah(160, 68, 100) + bawahBagi());
    },
  };
  const KET = { kali: 'Kelompok sama dikumpulkan', bagi: 'Satu batang dibagi rata', kalibagi: 'Kumpulkan dulu, lalu bagi rata' };
  const pilihanGambar = (jenis) => ({
    benar: 'b2-' + jenis,
    pilihan: kocok(['kali', 'bagi', 'kalibagi'].map((id) => ({ id: 'b2-' + id, ket: KET[id], svg: GAMBAR[id]() }))),
  });

  // ---------- KALI (tingkat 1) ----------
  function soalKali(tingkat, pakai) {
    const L = R[1];
    for (let coba = 0; coba < 2000; coba++) {
      const ti = acak(0, KB.length - 1), tp = KB[ti];
      const { m, k } = angkaSoal(L.m, L.k, null);
      const kunci = m * k, kode = 'kali-' + ti + '-' + m + '-' + k;
      if (pakai && pakai.has(kode)) continue;
      const { opsi, sebab } = H.buatOpsi(kunci, [
        { s: 'Itu ' + m + ' + ' + k + ' = ' + (m + k) + '. Isi tiap ' + tp.kel + ' ada ' + m + ' kali, jadi dikali: ' + m + ' × ' + k + '.', v: [m + k] },
        { s: 'Itu hanya ' + (m - 1) + ' ' + tp.kel + ' (' + (m - 1) + ' × ' + k + '). Ada ' + m + ' ' + tp.kel + '.', v: m > 1 ? [(m - 1) * k] : [] },
        { s: 'Itu ' + (m + 1) + ' ' + tp.kel + ' (' + (m + 1) + ' × ' + k + '). Ada ' + m + ' ' + tp.kel + '.', v: [(m + 1) * k] },
        { s: 'Itu ' + m + ' × ' + (k + 1) + '. Isi tiap ' + tp.kel + ' ada ' + k + '.', v: [m * (k + 1)] },
        { s: 'Itu ' + m + ' × ' + (k - 1) + '. Isi tiap ' + tp.kel + ' ada ' + k + '.', v: k > 1 ? [m * (k - 1)] : [] },
      ], [kunci + 10, kunci - 10, kunci + 2], opsiBesar);
      const tanya = 'Berapa ' + tp.isi + ' semuanya?';
      const segmen = [T(tp.orang + ' ' + tp.verb + ' '), N(m), T(' ' + tp.kel + ' ' + tp.isi + '. Tiap ' + tp.kel + ' berisi '), N(k), T(' ' + tp.isi + '. '), Q(tanya)];
      const cek = 'Ada ' + m + ' ' + tp.kel + ', tiap ' + tp.kel + ' berisi ' + k + ' ' + tp.isi + '.<br>Kelompok sama banyak, jadi dikali: ' + m + ' × ' + k + ' = <b>' + kunci + '</b> ' + tp.isi +
        '<br><small>Cek: ' + k + ' ditambah ' + m + ' kali = ' + kunci + '.</small>';
      return {
        jenis: 'kali', tingkat, kode, m, k, total: kunci, mode: 'semua',
        cerita0: tp.orang + ' ' + tp.verb + ' beberapa ' + tp.kel + ' ' + tp.isi + ' dengan isi yang sama. ' + tanya,
        kata: [tp.kel + ' ' + tp.isi + ' dengan isi yang sama', 'semuanya'],
        segmen, angkaPenting: [m, k], angkaPengecoh: [], fokus: adaFokus(m, k),
        gambar: pilihanGambar('kali'), tanya4: { teks: tanya, satuan: tp.isi }, kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalKali gagal');
  }

  // ---------- Pengecoh "hasil dan sisa" ----------
  function opsiHasil(total, n, q, r, kal) {
    const c = kode2;
    const grup = [
      { w: true, s: 'Sisa ' + (r + n) + ' tidak boleh sama dengan atau lebih besar dari pembagi ' + n + '. Bagi sekali lagi.', v: q > 1 ? [c(q - 1, r + n)] : [] },
      { s: 'Sisanya jangan dilupakan. ' + n + ' × ' + q + ' = ' + n * q + ', masih kurang dari ' + total + '.', v: [c(q, 0)] },
      { s: n + ' × ' + (q + 1) + ' + ' + r + ' = ' + (n * (q + 1) + r) + ', lebih besar dari ' + total + '. Cek dengan perkalian.', v: [c(q + 1, r)] },
      { s: 'Sisa itu ' + total + ' - ' + n + ' × ' + q + ' = ' + r + ', bukan ' + (n - r) + '.', v: n - r !== r ? [c(q, n - r)] : [] },
    ];
    if (kal) {
      const { m, k } = kal, besar = Math.max(m, k);
      grup.push({ w: true, s: 'Kamu hanya membagi ' + besar + ' dengan ' + n + '. Kali dulu: ' + m + ' × ' + k + ' = ' + total + '.', v: besar >= n ? [c(Math.floor(besar / n), besar % n)] : [] });
      grup.push({ s: 'Kamu menjumlah ' + m + ' + ' + k + ' = ' + (m + k) + '. Kelompok sama banyak harus dikali: ' + m + ' × ' + k + ' = ' + total + '.', v: m + k >= n ? [c(Math.floor((m + k) / n), (m + k) % n)] : [] });
    }
    const cad = [c(q, (r % (n - 1)) + 1), c(q - 1, r), c(q + 2, r), c(q + 1, 0)];
    if (r > 1) cad.push(c(q, r - 1));
    const { opsi, sebab } = H.buatOpsi(c(q, r), grup, cad, opsiBesar);
    const labelOpsi = {}; opsi.forEach((o) => { labelOpsi[o] = labelHasil(o); });
    return { opsi, sebab, labelOpsi };
  }

  // ---------- BAGI (tingkat 1: hasil dan sisa; tingkat 3: berapa wadah) ----------
  function soalBagi(tingkat, pakai) {
    if (tingkat === 1) {
      const L = R[1];
      for (let coba = 0; coba < 2000; coba++) {
        const ti = acak(0, KB.length - 1), tp = KB[ti];
        const { m: q, k: n } = angkaSoal(L.m, L.n, null); // q = hasil bagi, n = pembagi
        const r = acak(1, n - 1), total = n * q + r;
        const kode = 'bagi1-' + ti + '-' + total + '-' + n;
        if (pakai && pakai.has(kode)) continue;
        const kunci = kode2(q, r), { opsi, sebab, labelOpsi } = opsiHasil(total, n, q, r, null);
        const tanya = 'Berapa ' + tp.isi + ' untuk tiap ' + tp.pen + ', dan berapa ' + tp.isi + ' sisanya?';
        const segmen = [T(tp.orang + ' punya '), N(total), T(' ' + tp.isi + '. Semua ' + tp.isi + ' dibagi rata ke '), N(n), T(' ' + tp.pen + '. '), Q(tanya)];
        const cek = 'Semuanya ' + total + ' ' + tp.isi + ', dibagi rata ke ' + n + ' ' + tp.pen + ': ' + total + ' : ' + n + ' = ' + q + ' sisa ' + r + '.<br>Tiap ' + tp.pen + ' dapat ' + q + ' ' + tp.isi + ', sisanya ' + r + '. Jawaban: <b>' + labelHasil(kunci) + '</b>' +
          '<br><small>Cek: ' + n + ' × ' + q + ' + ' + r + ' = ' + total + '.</small>';
        return {
          jenis: 'bagi', tingkat, kode, mode: 'hasil', m: q, k: n, n, q, r, total,
          cerita0: tp.orang + ' punya sejumlah ' + tp.isi + '. Semua ' + tp.isi + ' dibagi rata ke beberapa ' + tp.pen + '. ' + tanya,
          kata: ['sejumlah ' + tp.isi, 'dibagi rata'],
          segmen, angkaPenting: [total, n], angkaPengecoh: [], fokus: adaFokus(q, n),
          gambar: pilihanGambar('bagi'), tanya4: { teks: tanya, satuan: '' }, kunci, opsi, sebab, labelOpsi, cek,
        };
      }
      throw new Error('soalBagi1 gagal');
    }
    // tingkat 2-3: berapa wadah dibutuhkan (sisa -> tambah 1)
    const L = R[3];
    for (let coba = 0; coba < 2000; coba++) {
      let ti, total, n;
      if (Math.random() < 0.12) ({ ti, total, n } = CONTOH3);
      else {
        ti = acak(0, BT.length - 1);
        const x = Math.random(), a = x < 0.7 ? dari(L.n, true) : dari(L.n, false);
        n = a;
        const q0 = acak(4, 15), total0 = n * q0 + acak(1, n - 1);
        total = total0;
      }
      const tp = BT[ti], q = Math.floor(total / n), r = total % n;
      if (r === 0 || q < 2) continue;
      const kode = 'bagi3-' + ti + '-' + total + '-' + n;
      if (pakai && pakai.has(kode)) continue;
      const kunci = q + 1;
      const { opsi, sebab } = H.buatOpsi(kunci, [
        { w: true, s: 'Itu hasil bagi saja (' + q + '). Masih ada sisa ' + r + ' ' + tp.isi + ' yang perlu ' + tp.wadah + ' lagi, jadi ditambah 1.', v: [q] },
        { w: true, s: 'Itu sisanya (' + r + '), bukan banyak ' + tp.wadah + '.', v: [r] },
        { s: 'Itu ' + (q + 2) + ', kelebihan satu. Sisa ' + r + ' ' + tp.isi + ' cukup satu ' + tp.wadah + ' lagi.', v: [q + 2] },
        { s: 'Itu banyak ' + tp.isi + ' seluruhnya, bukan banyak ' + tp.wadah + '.', v: [total] },
      ], [kunci + 3, kunci - 2, q - 1], opsiBesar);
      const tanya = 'Berapa ' + tp.wadah + ' yang dibutuhkan agar semua ' + tp.isi + ' ' + tp.agar + '?';
      const segmen = [T('Ada '), N(total), T(' ' + tp.isi + '. Semua ' + tp.isi + ' ' + tp.kerja + ' ' + tp.wadah + ', satu ' + tp.wadah + ' memuat '), N(n), T(' ' + tp.isi + '.')];
      const terlarang = new Set([total, n, q, r, kunci]);
      const dis = sisipDis(segmen, tingkat, terlarang);
      segmen.push(T(' '), Q(tanya));
      const cek = total + ' : ' + n + ' = ' + q + ' sisa ' + r + '. ' + q + ' ' + tp.wadah + ' penuh, tetapi masih ada ' + r + ' ' + tp.isi + '.<br>Sisa itu butuh 1 ' + tp.wadah + ' lagi: ' + q + ' + 1 = <b>' + kunci + '</b> ' + tp.wadah +
        '<br><small>Cek: ' + q + ' ' + tp.wadah + ' muat ' + n + ' × ' + q + ' = ' + n * q + ' ' + tp.isi + ', kurang dari ' + total + '. ' + kunci + ' ' + tp.wadah + ' muat ' + n * kunci + ', cukup.</small>';
      return {
        jenis: 'bagi', tingkat, kode, mode: 'butuh', ti, n, q, r, total,
        cerita0: 'Ada sejumlah ' + tp.isi + '. Semua ' + tp.isi + ' ' + tp.kerja + ' ' + tp.wadah + ' yang muatannya tetap. ' + tanya,
        kata: ['sejumlah ' + tp.isi, 'muatannya tetap'],
        segmen, angkaPenting: [total, n], angkaPengecoh: dis, fokus: adaFokus(n),
        gambar: pilihanGambar('bagi'), tanya4: { teks: tanya, satuan: tp.wadah }, kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalBagi3 gagal');
  }

  // ---------- KALIBAGI (tingkat 2: hasil dan sisa; tingkat 3: wadah dibutuhkan atau tidak kebagian) ----------
  function soalKaliBagi(tingkat, pakai) {
    const L = R[tingkat === 2 ? 2 : 3];
    for (let coba = 0; coba < 4000; coba++) {
      let mode, ti, m, k, n;
      if (tingkat === 2) {
        mode = 'hasil';
        if (Math.random() < 0.12) ({ ti, m, k, n } = pilih(CONTOH2));
        else { ti = acak(0, KB.length - 1); ({ m, k, n } = angkaSoal(L.m, L.k, L.n)); }
      } else {
        mode = Math.random() < 0.5 ? 'butuh' : 'sisa';
        ti = acak(0, (mode === 'butuh' ? BT : KB).length - 1);
        ({ m, k, n } = angkaSoal(L.m, L.k, L.n));
      }
      const total = m * k, q = Math.floor(total / n), r = total % n;
      if (r === 0 || q < 2) continue;
      const kode = 'kb-' + mode + '-' + ti + '-' + m + '-' + k + '-' + n;
      if (pakai && pakai.has(kode)) continue;
      let segmen, cerita0, kata, tanya, kunci, opsi, sebab, labelOpsi = null, satuan = '', cek;
      const terlarang = new Set([m, k, n, total, q, r]);
      if (mode === 'butuh') {
        const tp = BT[ti];
        kunci = q + 1; terlarang.add(kunci);
        const besar = Math.max(m, k);
        ({ opsi, sebab } = H.buatOpsi(kunci, [
          { w: true, s: 'Itu hasil bagi saja (' + q + '). Masih ada sisa ' + r + ' ' + tp.isi + ' yang perlu ' + tp.wadah + ' lagi, jadi ditambah 1.', v: [q] },
          { w: true, s: 'Itu sisanya (' + r + '), bukan banyak ' + tp.wadah + '.', v: [r] },
          { s: 'Itu ' + (q + 2) + ', kelebihan satu. Sisa ' + r + ' ' + tp.isi + ' cukup satu ' + tp.wadah + ' lagi.', v: [q + 2] },
          { s: 'Itu banyak ' + tp.isi + ' seluruhnya, bukan banyak ' + tp.wadah + '.', v: [total] },
          { s: 'Kamu hanya membagi ' + besar + ' dengan ' + n + ' (lupa kali dulu: ' + m + ' × ' + k + ' = ' + total + ').', v: besar >= n ? [Math.floor(besar / n) + 1] : [] },
        ], [kunci + 3, kunci - 2, q - 1], opsiBesar));
        tanya = 'Berapa ' + tp.wadah + ' yang dibutuhkan agar semua ' + tp.isi + ' ' + tp.agar + '?';
        segmen = [T('Ada '), N(m), T(' ' + tp.kel + ', tiap ' + tp.kel + ' ada '), N(k), T(' ' + tp.isi + '. Semua ' + tp.isi + ' ' + tp.kerja + ' ' + tp.wadah + ', satu ' + tp.wadah + ' memuat '), N(n), T(' ' + tp.isi + '.')];
        cerita0 = 'Ada beberapa ' + tp.kel + ' dengan jumlah ' + tp.isi + ' yang sama. Semua ' + tp.isi + ' ' + tp.kerja + ' ' + tp.wadah + ' yang muatannya tetap. ' + tanya;
        kata = ['beberapa ' + tp.kel + ' dengan jumlah ' + tp.isi + ' yang sama', 'muatannya tetap'];
        satuan = tp.wadah;
        cek = 'Semua ' + tp.isi + ': ' + m + ' × ' + k + ' = ' + total + '.<br>' + total + ' : ' + n + ' = ' + q + ' sisa ' + r + '. Sisa ' + r + ' ' + tp.isi + ' butuh 1 ' + tp.wadah + ' lagi: ' + q + ' + 1 = <b>' + kunci + '</b> ' + tp.wadah +
          '<br><small>Cek: ' + q + ' ' + tp.wadah + ' muat ' + n * q + ' ' + tp.isi + ', kurang dari ' + total + '. ' + kunci + ' ' + tp.wadah + ' muat ' + n * kunci + ', cukup.</small>';
      } else {
        const tp = KB[ti];
        const sisip = [T(tp.orang + ' ' + tp.verb + ' '), N(m), T(' ' + tp.kel + ' ' + tp.isi + '. Tiap ' + tp.kel + ' berisi '), N(k), T(' ' + tp.isi + '. Semua ' + tp.isi + ' dibagi rata ke '), N(n), T(' ' + tp.pen + '.' + (mode === 'sisa' ? ' Tiap ' + tp.pen + ' mendapat sama banyak.' : ''))];
        segmen = sisip;
        cerita0 = tp.orang + ' ' + tp.verb + ' beberapa ' + tp.kel + ' ' + tp.isi + ' dengan isi yang sama. Semua ' + tp.isi + ' dibagi rata ke beberapa ' + tp.pen + '.' + (mode === 'sisa' ? ' Tiap ' + tp.pen + ' mendapat sama banyak.' : '') + ' ';
        kata = [tp.kel + ' ' + tp.isi + ' dengan isi yang sama', 'dibagi rata'];
        if (mode === 'hasil') {
          tanya = 'Berapa ' + tp.isi + ' untuk tiap ' + tp.pen + ', dan berapa ' + tp.isi + ' sisanya?';
          kunci = kode2(q, r);
          ({ opsi, sebab, labelOpsi } = opsiHasil(total, n, q, r, { m, k }));
          cek = 'Semua ' + tp.isi + ': ' + m + ' × ' + k + ' = ' + total + '.<br>Dibagi rata ke ' + n + ' ' + tp.pen + ': ' + total + ' : ' + n + ' = ' + q + ' sisa ' + r + '.<br>Tiap ' + tp.pen + ' dapat ' + q + ' ' + tp.isi + ', sisanya ' + r + '. Jawaban: <b>' + labelHasil(kunci) + '</b>' +
            '<br><small>Cek: ' + n + ' × ' + q + ' + ' + r + ' = ' + total + '.</small>';
        } else {
          tanya = 'Berapa ' + tp.isi + ' yang tidak kebagian?';
          kunci = r; satuan = tp.isi;
          ({ opsi, sebab } = H.buatOpsi(kunci, [
            { w: true, s: 'Itu ' + tp.isi + ' untuk tiap ' + tp.pen + ' (' + q + '). Yang ditanya yang tidak kebagian, yaitu sisanya.', v: [q] },
            { s: 'Itu banyak ' + tp.isi + ' seluruhnya. Yang tidak kebagian hanya sisanya.', v: [total] },
            { s: 'Itu ' + n + ' - ' + r + ' = ' + (n - r) + ', kekurangan untuk satu putaran lagi, bukan sisanya.', v: n - r !== r ? [n - r] : [] },
            { w: true, s: 'Sisa ' + (r + n) + ' tidak mungkin: sisa harus lebih kecil dari pembagi ' + n + '.', v: [r + n] },
            { s: 'Itu ' + (q + 1) + ' (hasil bagi tambah 1). Yang tidak kebagian adalah sisanya.', v: [q + 1] },
          ], [r + 1, r - 1, r + 2, q - 1], opsiBesar));
          cek = 'Semua ' + tp.isi + ': ' + m + ' × ' + k + ' = ' + total + '.<br>' + total + ' : ' + n + ' = ' + q + ' sisa ' + r + '. Tiap ' + tp.pen + ' dapat ' + q + ', yang tidak kebagian: <b>' + kunci + '</b> ' + tp.isi +
            '<br><small>Cek: ' + n + ' × ' + q + ' + ' + r + ' = ' + total + '.</small>';
        }
        cerita0 += tanya;
        terlarang.add(kunci);
      }
      const dis = sisipDis(segmen, tingkat, terlarang);
      segmen.push(T(' '), Q(tanya));
      const sat = mode === 'butuh' ? satuan : (mode === 'sisa' ? satuan : '');
      const o = {
        jenis: 'kalibagi', tingkat, kode, mode, ti, m, k, n, q, r, total, cerita0, kata,
        segmen, angkaPenting: [m, k, n], angkaPengecoh: dis, fokus: adaFokus(m, k, n),
        gambar: pilihanGambar('kalibagi'), tanya4: { teks: tanya, satuan: sat }, kunci, opsi, sebab, cek,
      };
      if (labelOpsi) { o.labelOpsi = labelOpsi; }
      return o;
    }
    throw new Error('soalKaliBagi gagal');
  }

  const data = {
    id: 'k4b2',
    jenis: [
      { id: 'kali', nama: 'Hanya kali', petunjuk: 'ada kelompok yang isinya sama ("tiap ... berisi") dan yang ditanya <b>semuanya</b>. Tidak ada yang dibagi.',
        gambarPetunjuk: 'Soal ini <b>hanya kali</b>. Pilih gambar: kelompok yang sama besar dikumpulkan jadi satu batang, ditanya semuanya.' },
      { id: 'bagi', nama: 'Hanya bagi', petunjuk: 'jumlah <b>semuanya</b> sudah diketahui, tinggal <b>dibagi rata</b> atau dimuat ke wadah. Tidak ada kelompok yang perlu dikali.',
        gambarPetunjuk: 'Soal ini <b>hanya bagi</b>. Pilih gambar: satu batang (semuanya) dibagi rata ke beberapa bagian, ada sisa.' },
      { id: 'kalibagi', nama: 'Kali dulu, lalu bagi', petunjuk: 'ada <b>kelompok yang isinya sama</b>. Semuanya dikali dulu, <b>lalu dibagi rata</b>.',
        gambarPetunjuk: 'Soal ini <b>kali dulu, lalu bagi</b>. Pilih gambar: kelompok sama di atas (dikumpulkan), lalu dibagi rata di bawah.' },
    ],
    tingkat: ['satu langkah, angka kecil: kali saja atau bagi bersisa', 'dua langkah: kali dulu, lalu bagi bersisa (hasil dan sisa)', 'dua langkah + arti sisa: berapa wadah dibutuhkan atau berapa yang tidak kebagian'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Kelompok sama banyak: kali dulu, baru bagi. Sisa harus lebih kecil dari pembagi. Cek: pembagi × hasil + sisa = semuanya.',
    // jenis yang muncul dalam satu ronde per tingkat (opsional untuk mesin): tingkat 1 satu langkah, tingkat 2 semua dua langkah, tingkat 3 sebagian satu langkah
    jenisTingkat: (t) => (t === 1 ? ['kali', 'bagi'] : t === 2 ? ['kalibagi'] : ['kalibagi', 'kalibagi', 'bagi']),
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'kali' ? soalKali(tingkat, pakai) : jenisId === 'bagi' ? soalBagi(tingkat, pakai) : soalKaliBagi(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    R, KB, BT, CONTOH2, CONTOH3, FOKUS, kode2, labelHasil,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b2 = data;
})(typeof window !== 'undefined' ? window : globalThis);
