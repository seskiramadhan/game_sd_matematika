// Data 📖 Soal Cerita Kelas 4 Bab 11 (Luas & Keliling) untuk mesin js/soal-cerita.js.
// Tiga jenis (video Jago Soal Cerita Ep. 4, "Tepi atau Dalam?"):
//   KELILING: yang ditanya TEPI (pagar, pita, berlari mengelilingi) -> 2 x (panjang + lebar).
//   LUAS: yang ditanya DALAM (rumput, keramik, cat) -> panjang x lebar.
//   GABUNGAN: bentuk huruf L (persegi panjang dikurangi pojok) -> luas = P x Q - c x d (atau dipotong jadi dua persegi panjang).
// Model gambar: denah berpetak (jalan di tepi / petak diisi penuh / bentuk L). Semua kunci bilangan bulat, dihitung kode.
// Tes: node tools/cek-soal-cerita-bab11.js
// Contoh tetap (sama dengan video Ep. 4 / Buku Saku), muncul sekitar 12% pada tingkat 1:
//   kebun 8 m x 5 m: pagar 26 m, rumput 40 m2 · bingkai foto 6 cm x 4 cm, pita 20 cm · teras L (7 x 5, pojok 3 x 2) = 29 m2.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, fmt, buatOpsi, pilihanDenah } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: true });
  const Q = (t) => ({ k: 'tanya', t });
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 };

  // Rentang per tingkat. p x l = persegi panjang (p > l); P x Q = kotak besar bentuk L, c x d = pojok yang tidak ada (c <= P-2, d <= Q-2).
  const LEVEL = {
    1: { p: [4, 10], l: [2, 6], P: [5, 8], Q: [4, 6], c: [1, 3], d: [1, 2] },
    2: { p: [6, 15], l: [3, 10], P: [6, 12], Q: [5, 9], c: [2, 5], d: [2, 4] },
    3: { p: [8, 25], l: [5, 16], P: [9, 16], Q: [6, 12], c: [2, 8], d: [2, 6] },
  };

  function ambilPengecoh(tingkat, pembuat, terlarang) {
    const dis = [];
    for (let i = 0; i < BANYAK_PENGECOH[tingkat]; i++) {
      let v, n = 0;
      do { v = pembuat[i](); n++; } while (terlarang.has(v) && n < 100);
      terlarang.add(v); dis.push(v);
    }
    return dis;
  }
  function sisip(segmen, kalimat, dis) {
    dis.forEach((v, i) => { const [d, b] = kalimat[i].split('{x}'); segmen.push(T(d), { k: 'angka', t: String(v), nilai: v, penting: false }, T(b)); });
  }

  // ---------- KELILING (tepi) ----------
  const TEMPLAT_KELILING = [
    { satuan: 'meter', pendek: 'm', tanya: 'Berapa meter pagar yang dibutuhkan?',
      cerita0: 'Pak Anto punya kebun berbentuk persegi panjang. Kebun itu akan dipagari di tepinya. Berapa meter pagar yang dibutuhkan?', kata: ['dipagari di tepinya'],
      isi: (p, l) => [T('Kebun Pak Anto berbentuk persegi panjang, panjangnya '), p, T(' meter dan lebarnya '), l, T(' meter. Kebun itu dipagari di tepinya.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Di kebun itu ada {x} pohon mangga.', ' Pagar itu dicat {x} hari yang lalu.'] },
    { satuan: 'sentimeter', pendek: 'cm', tanya: 'Berapa sentimeter pita yang dibutuhkan?',
      cerita0: 'Sebuah bingkai foto berbentuk persegi panjang. Di tepi bingkai itu akan dipasang pita. Berapa sentimeter pita yang dibutuhkan?', kata: ['Di tepi bingkai'],
      isi: (p, l) => [T('Bingkai foto berbentuk persegi panjang, panjangnya '), p, T(' cm dan lebarnya '), l, T(' cm. Di tepi bingkai itu dipasang pita.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Foto itu diambil {x} bulan yang lalu.', ' Bingkai itu dibeli dengan {x} teman.'] },
    { satuan: 'meter', pendek: 'm', tanya: 'Berapa meter jarak yang ditempuh Rudi?',
      cerita0: 'Rudi berlari mengelilingi sebuah lapangan berbentuk persegi panjang sebanyak satu putaran. Berapa meter jarak yang ditempuh Rudi?', kata: ['mengelilingi'],
      isi: (p, l) => [T('Lapangan berbentuk persegi panjang, panjangnya '), p, T(' meter dan lebarnya '), l, T(' meter. Rudi berlari satu putaran mengelilingi tepi lapangan.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Rudi berlari bersama {x} temannya.', ' Rudi berangkat pukul {x} pagi.'] },
    { satuan: 'sentimeter', pendek: 'cm', tanya: 'Berapa sentimeter tali hias yang dibutuhkan?',
      cerita0: 'Sebuah lukisan berbentuk persegi panjang akan diberi tali hias di sepanjang tepinya. Berapa sentimeter tali hias yang dibutuhkan?', kata: ['di sepanjang tepinya'],
      isi: (p, l) => [T('Lukisan berbentuk persegi panjang, panjangnya '), p, T(' cm dan lebarnya '), l, T(' cm. Tali hias dipasang di sepanjang tepinya.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Lukisan itu menggambar {x} burung.', ' Lukisan itu dibuat selama {x} hari.'] },
  ];

  // ---------- LUAS (dalam) ----------
  const TEMPLAT_LUAS = [
    { satuan: 'meter persegi', pendek: 'm', tanya: 'Berapa meter persegi luas rumput yang dibutuhkan?',
      cerita0: 'Pak Anto punya kebun berbentuk persegi panjang. Seluruh bagian dalam kebun akan ditanami rumput. Berapa meter persegi luas rumput yang dibutuhkan?', kata: ['bagian dalam'],
      isi: (p, l) => [T('Kebun Pak Anto berbentuk persegi panjang, panjangnya '), p, T(' meter dan lebarnya '), l, T(' meter. Seluruh kebun ditanami rumput.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Di kebun itu ada {x} pohon mangga.', ' Rumput itu dibeli {x} hari yang lalu.'] },
    { satuan: 'meter persegi', pendek: 'm', tanya: 'Berapa meter persegi luas lantai yang ditutup keramik?',
      cerita0: 'Lantai sebuah kamar berbentuk persegi panjang akan ditutup keramik. Berapa meter persegi luas lantai yang ditutup keramik?', kata: ['ditutup keramik'],
      isi: (p, l) => [T('Lantai sebuah kamar berbentuk persegi panjang, panjangnya '), p, T(' meter dan lebarnya '), l, T(' meter. Seluruh lantai ditutup keramik.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Kamar itu punya {x} jendela.', ' Kamar itu punya {x} pintu.'] },
    { satuan: 'meter persegi', pendek: 'm', tanya: 'Berapa meter persegi dinding yang dicat?',
      cerita0: 'Sebuah dinding berbentuk persegi panjang akan dicat seluruhnya. Berapa meter persegi dinding yang dicat?', kata: ['dicat seluruhnya'],
      isi: (p, l) => [T('Dinding berbentuk persegi panjang, panjangnya '), p, T(' meter dan tingginya '), l, T(' meter. Seluruh dinding itu dicat.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Pada dinding itu ada {x} lukisan.', ' Pengecatan dibantu {x} orang.'] },
    { satuan: 'sentimeter persegi', pendek: 'cm', tanya: 'Berapa sentimeter persegi kertas warna yang dibutuhkan?',
      cerita0: 'Selembar karton berbentuk persegi panjang akan ditempeli kertas warna pada seluruh permukaannya. Berapa sentimeter persegi kertas warna yang dibutuhkan?', kata: ['seluruh permukaannya'],
      isi: (p, l) => [T('Karton berbentuk persegi panjang, panjangnya '), p, T(' cm dan lebarnya '), l, T(' cm. Seluruh permukaan karton ditempeli kertas warna.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Karton itu dibeli seharga {x} ribu rupiah.', ' Kertas warna itu ada {x} warna.'] },
  ];

  // ---------- GABUNGAN (bentuk L) ----------
  const TEMPLAT_GABUNGAN = [
    { satuan: 'meter persegi', tanya: 'Berapa meter persegi lantai yang harus dicat?',
      cerita0: 'Bu Wati punya teras berbentuk huruf L. Seluruh lantai teras akan dicat. Satu pojok kotaknya tidak ada. Berapa meter persegi lantai yang harus dicat?', kata: ['huruf L'],
      isi: (P, Qq, c, d) => [T('Teras Bu Wati berbentuk huruf L. Teras itu berasal dari persegi panjang '), P, T(' meter kali '), Qq, T(' meter, tetapi di satu pojoknya ada bagian '), c, T(' meter kali '), d, T(' meter yang tidak ada. Seluruh lantai teras dicat.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Teras itu punya {x} tiang.', ' Pengecatan dibantu {x} orang.'] },
    { satuan: 'meter persegi', tanya: 'Berapa meter persegi kebun yang ditanami sayur?',
      cerita0: 'Pak Tani punya kebun berbentuk huruf L. Seluruh kebun ditanami sayur. Satu pojok kotaknya berupa kolam. Berapa meter persegi kebun yang ditanami sayur?', kata: ['huruf L'],
      isi: (P, Qq, c, d) => [T('Kebun Pak Tani berbentuk huruf L. Kebun itu berasal dari persegi panjang '), P, T(' meter kali '), Qq, T(' meter, dengan pojok '), c, T(' meter kali '), d, T(' meter berupa kolam yang tidak ditanami. Seluruh kebun ditanami sayur.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Ada {x} jenis sayur di kebun itu.', ' Kebun itu dikelilingi {x} pohon pisang.'] },
    { satuan: 'meter persegi', tanya: 'Berapa meter persegi karpet yang dibutuhkan?',
      cerita0: 'Sebuah ruang tamu berbentuk huruf L. Seluruh lantainya akan ditutup karpet. Satu pojok kotaknya tidak ada. Berapa meter persegi karpet yang dibutuhkan?', kata: ['huruf L'],
      isi: (P, Qq, c, d) => [T('Ruang tamu berbentuk huruf L. Ruang itu berasal dari persegi panjang '), P, T(' meter kali '), Qq, T(' meter, tetapi di satu pojoknya ada bagian '), c, T(' meter kali '), d, T(' meter yang tidak ada. Seluruh lantai ditutup karpet.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Ruang itu punya {x} kursi.', ' Karpet itu dibeli {x} hari yang lalu.'] },
  ];

  const CONTOH = [
    { jenis: 'keliling', t: 1, ti: 0, a: 8, b: 5 },
    { jenis: 'keliling', t: 1, ti: 1, a: 6, b: 4 },
    { jenis: 'luas', t: 1, ti: 0, a: 8, b: 5 },
    { jenis: 'gabungan', t: 1, ti: 0, a: 7, b: 5, c: 3, d: 2 },
  ];

  // ---------- pembuat ----------
  function soalKeliling(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let ti, p, l;
      const cs = CONTOH.filter((c) => c.jenis === 'keliling' && c.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); ti = c.ti; p = c.a; l = c.b; }
      else { ti = acak(0, TEMPLAT_KELILING.length - 1); p = acak(L.p[0], L.p[1]); l = acak(L.l[0], L.l[1]); }
      if (p <= l) continue;
      const tp = TEMPLAT_KELILING[ti];
      const kode = 'kel-' + ti + '-' + p + '-' + l;
      if (pakai && pakai.has(kode)) continue;
      const kunci = 2 * (p + l), luas = p * l;
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([p, l, kunci, luas]));
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu panjang + lebar saja, baru setengah keliling. Tepi persegi panjang punya 4 sisi: 2 panjang dan 2 lebar.', v: [p + l] },
        { s: 'Itu luas (panjang × lebar), bukan keliling. Yang ditanya panjang tepi, bukan isi dalam.', v: [luas] },
        { s: 'Satu sisi lebar terlewat. Ada 2 sisi panjang dan 2 sisi lebar.', v: [2 * p + l] },
        { s: 'Satu sisi panjang terlewat. Ada 2 sisi panjang dan 2 sisi lebar.', v: [p + 2 * l] },
        { s: 'Semua sisi dianggap sama dengan panjang (4 × ' + p + '). Persegi panjang punya 2 sisi lebar yang lebih pendek.', v: [4 * p] },
      ], [kunci + 2, kunci - 2, kunci + 4, kunci - 4, kunci + 10, kunci * 2, kunci + p, kunci - l], { min: 1, maks: 1000 });
      const a = N(p), b = N(l);
      const segmen = tp.isi(a, b);
      sisip(segmen, tp.disTeks, dis);
      segmen.push(T(' '), Q(tp.tanya));
      const u = tp.pendek;
      const cek = 'Yang ditanya <b>tepi</b>, jadi keliling.<br>Jalan sekeliling: ' + p + ' + ' + l + ' + ' + p + ' + ' + l + ' = ' + kunci + ' ' + u +
        '<br>Cara lain: 2 × (' + p + ' + ' + l + ') = 2 × ' + (p + l) + ' = <b>' + fmt(kunci) + '</b> ' + tp.satuan +
        '<br><small>Cek: ' + (p + l) + ' baru setengah jalan (2 sisi), jadi dikali 2. Satuan keliling ' + u + ', bukan ' + u + '².</small>';
      return {
        jenis: 'keliling', tingkat, kode, ti, a: p, b: l, kunci, luas, cerita0: tp.cerita0, kata: tp.kata, segmen, angkaPengecoh: dis,
        gambar: pilihanDenah('tepi', p, l), tanya4: { teks: tp.tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalKeliling gagal');
  }

  function soalLuas(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let ti, p, l;
      const cs = CONTOH.filter((c) => c.jenis === 'luas' && c.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); ti = c.ti; p = c.a; l = c.b; }
      else { ti = acak(0, TEMPLAT_LUAS.length - 1); p = acak(L.p[0], L.p[1]); l = acak(L.l[0], L.l[1]); }
      if (p <= l) continue;
      const tp = TEMPLAT_LUAS[ti];
      const kode = 'luas-' + ti + '-' + p + '-' + l;
      if (pakai && pakai.has(kode)) continue;
      const kunci = p * l, kel = 2 * (p + l);
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([p, l, kunci, kel]));
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu keliling (panjang tepi), bukan luas. Yang ditanya isi bagian dalam: banyak petak.', v: [kel] },
        { s: 'Itu panjang + lebar. Luas = banyak petak = panjang × lebar.', v: [p + l] },
        { s: 'Panjang dikali 2 saja. Luas = panjang × lebar (' + p + ' × ' + l + ').', v: [2 * p] },
        { s: 'Lebar dikali 2 saja. Luas = panjang × lebar (' + p + ' × ' + l + ').', v: [2 * l] },
      ], [kunci + p, kunci - p, kunci + l, kunci - l, kunci + 2, kunci - 2, kunci + 10, kunci * 2], { min: 1, maks: 1000 });
      const a = N(p), b = N(l);
      const segmen = tp.isi(a, b);
      sisip(segmen, tp.disTeks, dis);
      segmen.push(T(' '), Q(tp.tanya));
      const u = tp.pendek;
      const cek = 'Yang ditanya <b>bagian dalam</b>, jadi luas.<br>Gambar petak: ' + l + ' baris, tiap baris ' + p + ' petak.' +
        '<br>' + p + ' × ' + l + ' = <b>' + fmt(kunci) + '</b> ' + tp.satuan + ' (' + u + '²)' +
        '<br><small>Cek: ' + l + ' baris × ' + p + ' petak = ' + kunci + ' petak. Satuan luas ' + u + '², bukan ' + u + '.</small>';
      return {
        jenis: 'luas', tingkat, kode, ti, a: p, b: l, kunci, kel, cerita0: tp.cerita0, kata: tp.kata, segmen, angkaPengecoh: dis,
        gambar: pilihanDenah('isi', p, l), tanya4: { teks: tp.tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalLuas gagal');
  }

  function soalGabungan(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let ti, P, Qq, c, d;
      const cs = CONTOH.filter((x) => x.jenis === 'gabungan' && x.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const x = pilih(cs); ti = x.ti; P = x.a; Qq = x.b; c = x.c; d = x.d; }
      else {
        ti = acak(0, TEMPLAT_GABUNGAN.length - 1);
        P = acak(L.P[0], L.P[1]); Qq = acak(L.Q[0], L.Q[1]); c = acak(L.c[0], L.c[1]); d = acak(L.d[0], L.d[1]);
      }
      if (c > P - 2 || d > Qq - 2 || P === Qq) continue;
      const tp = TEMPLAT_GABUNGAN[ti];
      const kode = 'gab-' + ti + '-' + P + '-' + Qq + '-' + c + '-' + d;
      if (pakai && pakai.has(kode)) continue;
      const besar = P * Qq, pojok = c * d, kunci = besar - pojok;
      const bawah = P * (Qq - d), atas = (P - c) * d;
      if (bawah + atas !== kunci) throw new Error('potongan tidak cocok');
      const kel = 2 * (P + Qq);
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([P, Qq, c, d, kunci, besar, pojok, kel]));
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu luas persegi panjang besar (' + P + ' × ' + Qq + '). Pojok yang tidak ada belum dikurangi.', v: [besar] },
        { s: 'Itu luas pojok yang tidak ada saja (' + c + ' × ' + d + '). Pojok itu justru harus dibuang.', v: [pojok] },
        { s: 'Pojok yang tidak ada malah ditambahkan. Seharusnya dikurangi.', v: [besar + pojok] },
        { s: 'Itu keliling kotak besarnya (2 × (' + P + ' + ' + Qq + ')), bukan luas.', v: [kel] },
        { s: 'Pojok dikurangi dengan ' + c + ' + ' + d + '. Luas pojok itu ' + c + ' × ' + d + ', bukan ' + c + ' + ' + d + '.', v: [besar - (c + d)] },
        { s: 'Hanya satu bagian yang dihitung (bagian bawah ' + P + ' × ' + (Qq - d) + '). Bagian atasnya belum ditambahkan.', v: [bawah] },
      ], [kunci + c, kunci - c, kunci + d, kunci - d, kunci + 2, kunci - 2, kunci + 10, kunci * 2], { min: 1, maks: 1000 });
      const segmen = tp.isi(N(P), N(Qq), N(c), N(d));
      sisip(segmen, tp.disTeks, dis);
      segmen.push(T(' '), Q(tp.tanya));
      const cek = 'Yang ditanya <b>bagian dalam</b> bentuk L, jadi luas. Kotak besar dikurangi pojok yang tidak ada.' +
        '<br>Kotak besar: ' + P + ' × ' + Qq + ' = ' + besar + ' ; pojok: ' + c + ' × ' + d + ' = ' + pojok +
        '<br>' + besar + ' − ' + pojok + ' = <b>' + fmt(kunci) + '</b> ' + tp.satuan +
        '<br><small>Cek dengan cara lain, potong mendatar: bawah ' + P + ' × ' + (Qq - d) + ' = ' + bawah + ', atas ' + (P - c) + ' × ' + d + ' = ' + atas + ', jumlahnya ' + bawah + ' + ' + atas + ' = ' + kunci + '.</small>';
      return {
        jenis: 'gabungan', tingkat, kode, ti, a: P, b: Qq, c, d, kunci, besar, pojok, kel, bawah, atas, cerita0: tp.cerita0, kata: tp.kata, segmen, angkaPengecoh: dis,
        gambar: pilihanDenah('L', P, Qq, c, d), tanya4: { teks: tp.tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalGabungan gagal');
  }

  const data = {
    id: 'k4b11',
    jenis: [
      { id: 'keliling', nama: 'Tepi (keliling)', petunjuk: 'yang ditanya <b>tepi</b>: pagar, pita, tali, atau berlari mengelilingi.',
        gambarPetunjuk: 'Soal ini tentang <b>tepi</b>. Pilih gambar yang jalan di tepinya disorot, tanpa petak yang diisi.' },
      { id: 'luas', nama: 'Dalam (luas)', petunjuk: 'yang ditanya <b>bagian dalam</b>: rumput, keramik, cat, atau seluruh permukaan.',
        gambarPetunjuk: 'Soal ini tentang <b>bagian dalam</b>. Pilih gambar persegi panjang dengan semua petak diisi.' },
      { id: 'gabungan', nama: 'Bentuk L', petunjuk: 'bentuknya <b>huruf L</b>: persegi panjang besar yang satu pojoknya tidak ada. Yang ditanya isi dalam.',
        gambarPetunjuk: 'Soal ini berbentuk <b>huruf L</b>. Pilih gambar bentuk L yang pojoknya dibuang.' },
    ],
    tingkat: ['persegi panjang kecil (panjang 4 sampai 10), bentuk L kecil, tanpa angka pengecoh', 'ukuran sedang, bentuk L sedang, 1 angka pengecoh', 'ukuran besar sampai 25, bentuk L besar, 2 angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Tanya dulu: tepi atau dalam? Tepi = keliling (2 × (panjang + lebar), satuan m). Dalam = luas (panjang × lebar, satuan m²). Bentuk L: kotak besar dikurangi pojok, atau dipotong.',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'keliling' ? soalKeliling(tingkat, pakai) : jenisId === 'luas' ? soalLuas(tingkat, pakai) : soalGabungan(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    LEVEL, CONTOH, TEMPLAT_KELILING, TEMPLAT_LUAS, TEMPLAT_GABUNGAN,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b11 = data;
})(typeof window !== 'undefined' ? window : globalThis);
