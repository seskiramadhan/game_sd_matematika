// Data 📖 Soal Cerita Kelas 4 Bab 5 (Pecahan 2) untuk mesin js/soal-cerita.js.
// Dua jenis: MUNDUR (sisa diketahui, pecahan yang terpakai diketahui -> jumlah mula-mula, model batang)
// dan BAGIAN (jumlah seluruhnya diketahui -> berapa yang dipakai / belum dipakai). Semua kunci bilangan bulat, dihitung kode.
// Tes: node tools/cek-soal-cerita-bab5.js
// Contoh tetap (sama dengan video Jago Soal Cerita Ep. 2 & Buku Saku), muncul sekitar 12% per soal mundur:
//   tingkat 1: kelereng 3/4 diberikan, sisa 6 -> 24 · tingkat 2: buku 3/5 dibaca, sisa 24 halaman -> 60 · tingkat 3: tabungan 2/3 dipakai, sisa Rp12.000 -> Rp36.000.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, fmt, fpb, buatOpsi, pilihanBatang } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (t, nilai, penting) => ({ k: 'angka', t, nilai, penting: !!penting });
  const Q = (t) => ({ k: 'tanya', t });
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 };

  // Rentang per tingkat. b = penyebut, r = bagian sisa (a = b - r), u = isi satu bagian (x1000 untuk uang).
  const MUNDUR = {
    1: { b: [3, 4, 5], r: [1], u: [2, 10], uUang: [2, 9] },
    2: { b: [4, 5, 6, 8], r: [1, 2], u: [3, 12], uUang: [2, 12] },
    3: { b: [3, 4, 5, 6, 7, 8, 10, 12], r: [1, 2, 3], u: [4, 15], uUang: [3, 15] },
  };
  const BAGIAN = {
    1: { b: [3, 4, 5], a: [1, 2, 3, 4], u: [2, 8], uUang: [2, 8] },
    2: { b: [4, 5, 6, 8], a: [1, 2, 3, 4, 5, 7], u: [3, 10], uUang: [2, 10] },
    3: { b: [3, 4, 5, 6, 7, 8, 10, 12], a: [1, 2, 3, 4, 5, 7, 9, 11], u: [4, 12], uUang: [3, 12] },
  };

  const rp = (n) => 'Rp' + fmt(n);
  const bkl = (a, b) => a + '/' + b;
  function ambilPengecoh(tingkat, pembuat, terlarang) {
    const dis = [];
    for (let i = 0; i < BANYAK_PENGECOH[tingkat]; i++) {
      let v, n = 0;
      do { v = pembuat[i](); n++; } while (terlarang.has(v) && n < 100);
      terlarang.add(v); dis.push(v);
    }
    return dis;
  }
  // sisipkan kalimat pengecoh dengan tanda {x}
  function sisip(segmen, kalimat, dis) {
    dis.forEach((v, i) => { const [d, b] = kalimat[i].split('{x}'); segmen.push(T(d), N(String(v), v, false), T(b)); });
  }

  // ---------- MUNDUR ----------
  // Tiap templat: cerita0 (tanpa angka), kalimat soal (F = pecahan, S = sisa), uang?, satuan.
  const TEMPLAT_MUNDUR = [
    { uang: true, satuan: 'rupiah', tanya: 'Berapa rupiah tabungan Dina mula-mula?',
      cerita0: 'Dina memakai sebagian tabungannya untuk membeli buku cerita. Sisa tabungannya sudah diketahui. Berapa rupiah tabungan Dina mula-mula?',
      kata: ['Sisa tabungannya', 'mula-mula'],
      isi: (F, S) => [T('Dina memakai '), F, T(' tabungannya untuk membeli buku cerita. Sisa tabungannya '), S, T('.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Ia sudah menabung selama {x} bulan.', ' Ia menabung bersama {x} temannya.'] },
    { uang: false, satuan: 'halaman', tanya: 'Berapa halaman buku itu seluruhnya?',
      cerita0: 'Rina sudah membaca sebagian buku ceritanya. Sisa halaman yang belum dibaca sudah diketahui. Berapa halaman buku itu seluruhnya?',
      kata: ['Sisa halaman', 'seluruhnya'],
      isi: (F, S) => [T('Rina sudah membaca '), F, T(' buku ceritanya. Sisa halaman yang belum dibaca ada '), S, T(' halaman.')],
      dis: [() => acak(2, 9), () => acak(5, 20)], disTeks: [' Ia membacanya selama {x} hari.', ' Buku itu bergambar {x} tokoh hewan.'] },
    { uang: false, satuan: 'kelereng', tanya: 'Berapa kelereng Doni mula-mula?',
      cerita0: 'Doni memberikan sebagian kelerengnya kepada adik. Sisa kelerengnya sudah diketahui. Berapa kelereng Doni mula-mula?',
      kata: ['Sisa kelerengnya', 'mula-mula'],
      isi: (F, S) => [T('Doni memberikan '), F, T(' kelerengnya kepada adik. Sisa kelerengnya '), S, T(' butir.')],
      dis: [() => acak(2, 9), () => acak(5, 20)], disTeks: [' Adik Doni punya {x} mainan lain.', ' Kelereng itu dimainkan selama {x} hari.'] },
    { uang: false, satuan: 'cm', tanya: 'Berapa sentimeter panjang pita mula-mula?',
      cerita0: 'Bu Sari memotong sebagian pita untuk membuat bunga. Sisa pitanya sudah diketahui. Berapa sentimeter panjang pita mula-mula?',
      kata: ['Sisa pitanya', 'mula-mula'],
      isi: (F, S) => [T('Bu Sari memotong '), F, T(' dari pita untuk membuat bunga. Sisa pitanya '), S, T(' cm.')],
      dis: [() => acak(2, 9), () => acak(5, 20)], disTeks: [' Bunga yang dibuat ada {x} tangkai.', ' Pita itu dibeli dengan harga {x} ribu rupiah.'] },
    { uang: false, satuan: 'liter', tanya: 'Berapa liter air di tandon mula-mula?',
      cerita0: 'Pak Ujang memakai sebagian air di tandonnya untuk menyiram kebun. Sisa air sudah diketahui. Berapa liter air di tandon mula-mula?',
      kata: ['Sisa air', 'mula-mula'],
      isi: (F, S) => [T('Pak Ujang memakai '), F, T(' air di tandonnya untuk menyiram kebun. Sisa air '), S, T(' liter.')],
      dis: [() => acak(2, 9), () => acak(5, 20)], disTeks: [' Kebun itu ditanami {x} jenis sayur.', ' Ia menyiram selama {x} menit.'] },
  ];
  const CONTOH_MUNDUR = { 1: { ti: 2, a: 3, b: 4, u: 6 }, 2: { ti: 1, a: 3, b: 5, u: 12 }, 3: { ti: 0, a: 2, b: 3, u: 12000 } };

  function soalMundur(tingkat, pakai) {
    const L = MUNDUR[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let a, b, u, ti;
      if (Math.random() < 0.12) ({ a, b, u, ti } = CONTOH_MUNDUR[tingkat]);
      else {
        ti = acak(0, TEMPLAT_MUNDUR.length - 1);
        const tp0 = TEMPLAT_MUNDUR[ti];
        b = pilih(L.b); const r0 = pilih(L.r); a = b - r0;
        if (a < 1 || fpb(a, b) !== 1) continue;
        u = tp0.uang ? acak(L.uUang[0], L.uUang[1]) * 1000 : acak(L.u[0], L.u[1]);
      }
      const tp = TEMPLAT_MUNDUR[ti];
      const r = b - a, S = r * u, kunci = b * u, terpakai = a * u;
      const kode = 'mun-' + a + '-' + b + '-' + u + '-' + ti;
      if (pakai && pakai.has(kode)) continue;
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([a, b, S, kunci]));
      const maks = tp.uang ? 2000000 : 1000;
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu sisanya saja. Yang ditanya jumlah mula-mula, sebelum dipakai.', v: [S] },
        { s: 'Itu isi satu bagian. Masih harus dikali banyak bagian seluruhnya (' + b + ').', v: r > 1 ? [u] : [] },
        { s: 'Itu bagian yang dipakai (' + a + ' bagian), bukan jumlah mula-mula.', v: [terpakai] },
        { s: 'Sisa dikali pembilang ' + a + ' tanpa menghitung isi satu bagian. Cari dulu isi 1 bagian.', v: [S * a] },
        { s: 'Sisa dikali penyebut ' + b + ' langsung. Sisa itu ' + r + ' bagian, bukan 1 bagian.', v: r > 1 ? [S * b] : [] },
        { s: 'Sisa ditambah isi satu bagian. Jumlah mula-mula = semua ' + b + ' bagian.', v: [S + u] },
      ], [kunci + u, kunci - u, kunci + S, S + a], { min: 1, maks });
      const F = N(bkl(a, b), a / b, true);
      const Snilai = N(tp.uang ? rp(S) : fmt(S), S, true);
      const segmen = tp.isi(F, Snilai);
      sisip(segmen, tp.disTeks, dis);
      segmen.push(T(' '), Q(tp.tanya));
      const sat = tp.uang ? '' : ' ' + tp.satuan;
      const nilai = (x) => (tp.uang ? rp(x) : fmt(x) + sat);
      const cek = 'Dipakai ' + bkl(a, b) + ', jadi sisa ' + bkl(r, b) + ' (' + r + ' bagian dari ' + b + ' bagian sama besar).' +
        '<br>Sisa ' + nilai(S) + ' = ' + r + ' bagian, jadi 1 bagian = ' + fmt(S) + ' : ' + r + ' = ' + fmt(u) +
        '<br>Seluruhnya ' + b + ' bagian: ' + b + ' × ' + fmt(u) + ' = <b>' + fmt(kunci) + '</b> ' + (tp.uang ? 'rupiah (' + nilai(kunci) + ')' : tp.satuan) +
        '<br><small>Cek: dipakai ' + a + ' × ' + fmt(u) + ' = ' + fmt(terpakai) + ', ditambah sisa ' + fmt(S) + ' = ' + fmt(kunci) + '.</small>';
      return {
        jenis: 'mundur', tingkat, kode, a, b, u, uang: tp.uang, r, sisa: S, terpakai, cerita0: tp.cerita0, kata: tp.kata,
        segmen, angkaPenting: [bkl(a, b), S], angkaPengecoh: dis,
        gambar: pilihanBatang(b, a), tanya4: { teks: tp.tanya, satuan: tp.satuan },
        kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalMundur gagal');
  }

  // ---------- BAGIAN ----------
  const TEMPLAT_BAGIAN = [
    { uang: false, satuan: 'butir', dipakai: 'Berapa butir telur yang dipakai?', belum: 'Berapa butir telur yang belum dipakai?',
      cerita0: 'Ibu membeli telur untuk membuat kue. Sebagian telur dipakai hari ini. Banyak telur semuanya sudah diketahui. ',
      isi: (F, S) => [T('Ibu membeli '), S, T(' butir telur untuk membuat kue. '), F, T(' dari telur itu dipakai hari ini.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Kue itu dibuat untuk {x} tamu.', ' Ibu pergi ke pasar selama {x} jam.'] },
    { uang: false, satuan: 'meter persegi', dipakai: 'Berapa meter persegi kebun yang ditanami jagung?', belum: 'Berapa meter persegi kebun yang belum ditanami jagung?',
      cerita0: 'Pak Tani punya sebuah kebun. Sebagian kebun ditanami jagung. Luas kebun semuanya sudah diketahui. ',
      isi: (F, S) => [T('Pak Tani punya kebun seluas '), S, T(' meter persegi. '), F, T(' bagian kebun ditanami jagung.')],
      dis: [() => acak(2, 9), () => acak(10, 30)], disTeks: [' Ia dibantu {x} pekerja.', ' Jagung itu ditanam {x} hari lalu.'] },
    { uang: true, satuan: 'rupiah', dipakai: 'Berapa rupiah uang yang dipakai?', belum: 'Berapa rupiah uang yang belum dipakai?',
      cerita0: 'Dani punya sejumlah uang. Sebagian uangnya dipakai untuk membeli buku. Jumlah uang Dani semuanya sudah diketahui. ',
      isi: (F, S) => [T('Dani punya uang '), S, T('. '), F, T(' dari uangnya dipakai untuk membeli buku.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Ia membeli {x} buku.', ' Toko itu berjarak {x} kilometer dari rumah.'] },
    { uang: false, satuan: 'siswa', dipakai: 'Berapa siswa yang ikut lomba?', belum: 'Berapa siswa yang tidak ikut lomba?',
      cerita0: 'Sebuah kelas punya beberapa siswa. Sebagian siswa ikut lomba menggambar. Banyak siswa semuanya sudah diketahui. ',
      isi: (F, S) => [T('Dalam sebuah kelas ada '), S, T(' siswa. '), F, T(' dari mereka ikut lomba menggambar.')],
      dis: [() => acak(2, 9), () => acak(10, 30)], disTeks: [' Lomba itu diadakan selama {x} hari.', ' Hadiahnya {x} buah buku.'] },
  ];

  function soalBagian(tingkat, pakai) {
    const L = BAGIAN[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      const ti = acak(0, TEMPLAT_BAGIAN.length - 1), tp = TEMPLAT_BAGIAN[ti];
      const b = pilih(L.b), a = pilih(L.a);
      if (a >= b || fpb(a, b) !== 1 || (a === 1 && tingkat > 1)) continue;
      const u = tp.uang ? acak(L.uUang[0], L.uUang[1]) * 1000 : acak(L.u[0], L.u[1]);
      const tanyaDipakai = Math.random() < 0.5;
      const r = b - a, total = b * u, terpakai = a * u, sisa = r * u;
      const kunci = tanyaDipakai ? terpakai : sisa;
      const kode = 'bag-' + a + '-' + b + '-' + u + '-' + ti + (tanyaDipakai ? 'p' : 's');
      if (pakai && pakai.has(kode)) continue;
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([a, b, total, kunci]));
      const maks = tp.uang ? 2000000 : 1000;
      const lain = tanyaDipakai ? sisa : terpakai;
      const bagianDitanya = tanyaDipakai ? a : r;
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu jumlah seluruhnya. Yang ditanya hanya sebagian dari itu.', v: [total] },
        { s: 'Itu isi satu bagian. ' + (tanyaDipakai ? 'Yang dipakai ' + a + ' bagian, jadi dikali ' + a + '.' : 'Yang belum dipakai ' + r + ' bagian, jadi dikali ' + r + '.'), v: bagianDitanya > 1 ? [u] : [] },
        { s: tanyaDipakai ? 'Itu yang belum dipakai (' + r + ' bagian). Yang ditanya yang dipakai.' : 'Itu yang sudah dipakai (' + a + ' bagian). Yang ditanya yang belum dipakai.', v: [lain] },
        { s: 'Jumlah seluruhnya dikali pembilang tanpa dibagi dulu. Bagi dulu dengan penyebut ' + b + '.', v: [total * a] },
        { s: 'Jumlah seluruhnya dikurangi pembilang ' + a + '. Pecahan berarti membagi, bukan mengurangi.', v: [total - a] },
        { s: 'Jumlah seluruhnya dibagi pembilang ' + a + ' saja. Bagilah dengan penyebut ' + b + '.', v: a > 1 ? [total / a] : [] },
      ], [kunci + u, kunci - u, kunci + a, kunci * 2], { min: 1, maks });
      const F = N(bkl(a, b), a / b, true);
      const S = N(tp.uang ? rp(total) : fmt(total), total, true);
      const segmen = tp.isi(F, S);
      sisip(segmen, tp.disTeks, dis);
      const tanya = tanyaDipakai ? tp.dipakai : tp.belum;
      segmen.push(T(' '), Q(tanya));
      const sat = tp.uang ? '' : ' ' + tp.satuan;
      const nilai = (x) => (tp.uang ? rp(x) : fmt(x) + sat);
      const cek = 'Bagi dulu: ' + nilai(total) + ' dibagi ' + b + ' bagian sama besar, 1 bagian = ' + fmt(total) + ' : ' + b + ' = ' + fmt(u) +
        '<br>Dipakai ' + a + ' bagian = ' + a + ' × ' + fmt(u) + ' = ' + fmt(terpakai) + '. Belum dipakai ' + r + ' bagian = ' + r + ' × ' + fmt(u) + ' = ' + fmt(sisa) +
        '<br>Jawabannya: <b>' + fmt(kunci) + '</b> ' + (tp.uang ? 'rupiah (' + nilai(kunci) + ')' : tp.satuan) +
        '<br><small>Cek: ' + fmt(terpakai) + ' + ' + fmt(sisa) + ' = ' + fmt(total) + '.</small>';
      return {
        jenis: 'bagian', tingkat, kode, a, b, u, uang: tp.uang, r, total, terpakai, sisa, tanyaDipakai,
        cerita0: tp.cerita0 + tanya, kata: ['semuanya sudah diketahui', 'Sebagian'],
        segmen, angkaPenting: [bkl(a, b), total], angkaPengecoh: dis,
        gambar: pilihanBatang(b, a), tanya4: { teks: tanya, satuan: tp.satuan },
        kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalBagian gagal');
  }

  const data = {
    id: 'k4b5',
    jenis: [
      { id: 'bagian', nama: 'Mencari bagian', petunjuk: 'jumlah seluruhnya sudah diketahui ("semuanya"), yang ditanya bagian yang dipakai atau belum dipakai.',
        gambarPetunjuk: 'Soal ini mencari <b>bagian</b> dari yang seluruhnya. Pilih batang yang dibagi sama besar, dengan bagian yang dipakai diarsir.' },
      { id: 'mundur', nama: 'Bekerja mundur dari sisa', petunjuk: 'yang diketahui hanya <b>sisanya</b>, yang ditanya jumlah <b>mula-mula</b> atau seluruhnya.',
        gambarPetunjuk: 'Soal ini <b>bekerja mundur dari sisa</b>. Pilih batang yang dibagi sama besar: bagian dipakai diarsir, sisanya ditandai.' },
    ],
    tingkat: ['pecahan dengan penyebut kecil (3 sampai 5), tanpa angka pengecoh', 'penyebut sampai 8, 1 angka pengecoh', 'penyebut sampai 12, uang ribuan, 2 angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Gambar batang dibagi sama besar. Sisa diketahui: cari isi 1 bagian dulu, baru kali semua bagian.',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'mundur' ? soalMundur(tingkat, pakai) : soalBagian(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    MUNDUR, BAGIAN, CONTOH_MUNDUR,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b5 = data;
})(typeof window !== 'undefined' ? window : globalThis);
