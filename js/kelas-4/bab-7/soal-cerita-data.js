// Data 📖 Soal Cerita Kelas 4 Bab 7 (Persentase) untuk mesin js/soal-cerita.js.
// Dua jenis (sama dengan video Jago Soal Cerita Ep. 3: "yang ditanya, bagiannya atau sisanya?"):
//   BAGIAN: jumlah seluruhnya + p% diketahui, ditanya p% dari jumlah itu (mis. potongan harga).
//   SISA: satu atau dua persen disebut, ditanya SISANYA (mis. murid yang diantar, harga yang dibayar, kembalian).
// Model gambar: kotak seratus (10 x 10). Semua kunci bilangan bulat, dihitung kode. Tes: node tools/cek-soal-cerita-bab7.js
// Contoh tetap (sama dengan video Ep. 3 / Buku Saku), muncul sekitar 12% per jenis dan tingkat yang cocok:
//   murid 40, 25% naik sepeda -> 10 · murid 40, 25% sepeda + 50% jalan kaki, sisanya diantar -> 10 · kelereng 200, 50% biru + 10% merah, sisanya hijau -> 80
//   robot Rp50.000 diskon 20%: potongan Rp10.000, dibayar Rp40.000, uang Rp45.000 -> kembalian Rp5.000.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, fmt, fpb, buatOpsi, pilihanKotak } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (t, nilai, penting) => ({ k: 'angka', t, nilai, penting: !!penting });
  const Q = (t) => ({ k: 'tanya', t });
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 };

  // p = persen yang dipakai, T = jumlah seluruhnya (TU kali 1.000 untuk uang); persen kelipatan 5 dan jumlah kelipatan 20 supaya hasil bulat.
  const LEVEL = {
    1: { p: [10, 20, 25, 50], T: [20, 40, 60, 80, 100, 200], TU: [20, 40, 50, 60, 80, 100], np: [1] },
    2: { p: [10, 20, 25, 30, 40, 50, 60, 75], T: [40, 60, 80, 100, 120, 160, 200, 240, 300], TU: [40, 60, 80, 100, 120, 150, 200], np: [1, 2] },
    3: { p: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80], T: [80, 120, 160, 200, 240, 300, 400, 500], TU: [60, 80, 120, 150, 200, 250, 300, 400], np: [1, 2, 2] },
  };

  const rp = (n) => 'Rp' + fmt(n);
  const pct = (p) => p + '%';
  const dari = (Tot, p) => (Tot * p) / 100;
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
    dis.forEach((v, i) => { const [d, b] = kalimat[i].split('{x}'); segmen.push(T(d), N(String(v), v, false), T(b)); });
  }

  // ---------- BAGIAN ----------
  const TEMPLAT_BAGIAN = [
    { uang: false, satuan: 'murid', Tmaks: 60, tanya: 'Berapa murid yang naik sepeda?',
      cerita0: 'Di sebuah kelas ada beberapa murid. Sebagian murid naik sepeda ke sekolah. Banyak murid di kelas sudah diketahui. Berapa murid yang naik sepeda?', kata: ['Sebagian'],
      isi: (P, S) => [T('Di sebuah kelas ada '), S, T(' murid. '), P, T(' dari murid itu naik sepeda ke sekolah.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Kelas itu punya {x} jendela.', ' Sekolah dimulai pukul {x} pagi.'] },
    { uang: true, satuan: 'rupiah', tanya: 'Berapa rupiah potongan harganya?',
      cerita0: 'Sebuah toko memberi potongan harga untuk sepatu. Potongan itu sebagian dari harga asli. Harga asli sepatu sudah diketahui. Berapa rupiah potongan harganya?', kata: ['sebagian'],
      isi: (P, S) => [T('Harga sepatu di sebuah toko '), S, T('. Toko memberi diskon '), P, T(' untuk sepatu itu.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Sepatu itu tersedia dalam {x} warna.', ' Toko itu buka sampai pukul {x} malam.'] },
    { uang: false, satuan: 'halaman', tanya: 'Berapa halaman yang sudah dibaca Rani?',
      cerita0: 'Rani membaca sebagian dari buku ceritanya. Banyak halaman buku itu sudah diketahui. Berapa halaman yang sudah dibaca Rani?', kata: ['sebagian'],
      isi: (P, S) => [T('Buku cerita Rani tebalnya '), S, T(' halaman. Rani sudah membaca '), P, T(' dari buku itu.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Buku itu punya {x} tokoh.', ' Rani membacanya selama {x} hari.'] },
    { uang: false, satuan: 'meter persegi', tanya: 'Berapa meter persegi kebun yang ditanami cabai?',
      cerita0: 'Pak Tani punya sebuah kebun. Sebagian kebun ditanami cabai. Luas kebun sudah diketahui. Berapa meter persegi kebun yang ditanami cabai?', kata: ['Sebagian'],
      isi: (P, S) => [T('Pak Tani punya kebun seluas '), S, T(' meter persegi. '), P, T(' dari kebun itu ditanami cabai.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Ia dibantu {x} pekerja.', ' Cabai itu ditanam {x} bulan lalu.'] },
  ];

  // ---------- SISA ----------
  // np = banyak persen yang disebut (1 atau 2). maxNp = batas templat. kembalian: ada uang yang dibayarkan.
  const TEMPLAT_SISA = [
    { uang: false, satuan: 'murid', Tmaks: 60, maxNp: 2,
      tanya: (np) => (np === 1 ? 'Berapa murid yang jalan kaki?' : 'Berapa murid yang diantar orang tua?'),
      cerita0: (np) => (np === 1
        ? 'Di sebuah kelas ada beberapa murid. Sebagian murid naik sepeda, sisanya jalan kaki. Banyak murid di kelas sudah diketahui. Berapa murid yang jalan kaki?'
        : 'Di sebuah kelas ada beberapa murid. Sebagian naik sepeda, sebagian lagi jalan kaki. Sisanya diantar orang tua. Berapa murid yang diantar orang tua?'),
      kata: (np) => [np === 1 ? 'sisanya' : 'Sisanya'],
      isi: (P, S) => (P.length === 1
        ? [T('Di sebuah kelas ada '), S, T(' murid. '), P[0], T(' naik sepeda, sisanya jalan kaki.')]
        : [T('Di sebuah kelas ada '), S, T(' murid. '), P[0], T(' naik sepeda, '), P[1], T(' jalan kaki, dan sisanya diantar orang tua.')]),
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Kelas itu punya {x} jendela.', ' Sekolah dimulai pukul {x} pagi.'] },
    { uang: true, satuan: 'rupiah', maxNp: 1,
      tanya: () => 'Berapa rupiah yang harus dibayar?',
      cerita0: () => 'Sebuah toko memberi potongan harga untuk sebuah tas. Harga yang dibayar adalah sisanya setelah dipotong. Berapa rupiah yang harus dibayar?',
      kata: () => ['sisanya'],
      isi: (P, S) => [T('Harga sebuah tas '), S, T('. Toko memberi diskon '), P[0], T(' untuk tas itu.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Tas itu tersedia dalam {x} warna.', ' Toko itu buka sampai pukul {x} malam.'] },
    { uang: false, satuan: 'kelereng', maxNp: 2,
      tanya: () => 'Berapa kelereng yang berwarna hijau?',
      cerita0: (np) => (np === 1
        ? 'Doni punya banyak kelereng. Sebagian kelereng berwarna biru, sisanya berwarna hijau. Berapa kelereng yang berwarna hijau?'
        : 'Doni punya banyak kelereng. Sebagian berwarna biru, sebagian lagi merah, sisanya berwarna hijau. Berapa kelereng yang berwarna hijau?'),
      kata: () => ['sisanya'],
      isi: (P, S) => (P.length === 1
        ? [T('Doni punya '), S, T(' kelereng. '), P[0], T(' kelereng berwarna biru, sisanya hijau.')]
        : [T('Doni punya '), S, T(' kelereng. '), P[0], T(' berwarna biru, '), P[1], T(' berwarna merah, dan sisanya hijau.')]),
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Doni bermain bersama {x} temannya.', ' Kelereng itu disimpan dalam {x} kantong.'] },
    { uang: false, satuan: 'halaman', maxNp: 2,
      tanya: () => 'Berapa halaman yang belum dibaca?',
      cerita0: (np) => (np === 1
        ? 'Rani membaca sebagian dari buku ceritanya. Halaman yang belum dibaca adalah sisanya. Berapa halaman yang belum dibaca?'
        : 'Rani membaca buku ceritanya selama dua hari. Halaman yang belum dibaca adalah sisanya. Berapa halaman yang belum dibaca?'),
      kata: () => ['sisanya'],
      isi: (P, S) => (P.length === 1
        ? [T('Buku cerita Rani tebalnya '), S, T(' halaman. Rani sudah membaca '), P[0], T(' dari buku itu.')]
        : [T('Buku cerita Rani tebalnya '), S, T(' halaman. Hari pertama ia membaca '), P[0], T(' dari buku itu, hari kedua '), P[1], T(' dari buku itu.')]),
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Buku itu punya {x} tokoh.', ' Rani membacanya di {x} tempat.'] },
    { uang: true, satuan: 'rupiah', maxNp: 1, kembalian: true,
      tanya: () => 'Berapa rupiah kembalian Bayu?',
      cerita0: () => 'Bayu membeli sebuah robot mainan yang sedang diskon. Ia membayar dengan sejumlah uang. Sisa uang Bayu adalah kembaliannya. Berapa rupiah kembalian Bayu?',
      kata: () => ['Sisa uang'],
      isi: (P, S, U) => [T('Harga robot mainan '), S, T('. Toko memberi diskon '), P[0], T('. Bayu membayar dengan uang '), U, T('.')],
      dis: [() => acak(2, 9), () => acak(2, 9)], disTeks: [' Robot itu bisa berjalan {x} langkah.', ' Bayu menabung selama {x} minggu.'] },
  ];

  const CONTOH = [
    { jenis: 'bagian', t: 1, ti: 0, T: 40, ps: [25] },
    { jenis: 'bagian', t: 3, ti: 1, T: 50000, ps: [20] },
    { jenis: 'sisa', t: 1, ti: 1, T: 50000, ps: [20] },
    { jenis: 'sisa', t: 2, ti: 0, T: 40, ps: [25, 50] },
    { jenis: 'sisa', t: 2, ti: 2, T: 200, ps: [50, 10] },
    { jenis: 'sisa', t: 3, ti: 4, T: 50000, ps: [20], U: 45000 },
  ];

  // persen berbeda, jumlah paling banyak 90 supaya sisanya sedikitnya 10%
  function pilihPersen(L, np) {
    for (let i = 0; i < 500; i++) {
      const ps = []; for (let j = 0; j < np; j++) ps.push(pilih(L.p));
      if (new Set(ps).size === np && ps.reduce((a, b) => a + b, 0) <= 90) return ps;
    }
    return [pilih(L.p.filter((x) => x <= 45))];
  }
  const jumlahT = (tp, L) => (tp.uang ? pilih(L.TU) * 1000 : pilih(tp.Tmaks ? [20, 40, 60] : L.T));
  const jumlah = (a) => a.reduce((x, y) => x + y, 0);
  // p% sebagai pecahan paling sederhana: 25% = 1/4
  const sederhana = (p) => { const g = fpb(p, 100); return [p / g, 100 / g]; };

  function soalBagian(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let ti, Tot, p;
      const cs = CONTOH.filter((c) => c.jenis === 'bagian' && c.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); ti = c.ti; Tot = c.T; p = c.ps[0]; }
      else {
        ti = acak(0, TEMPLAT_BAGIAN.length - 1);
        p = pilih(L.p);
        Tot = jumlahT(TEMPLAT_BAGIAN[ti], L);
      }
      const tp = TEMPLAT_BAGIAN[ti];
      const kunci = dari(Tot, p), sisaNilai = Tot - kunci;
      if (!Number.isInteger(kunci)) continue;
      const kode = 'bag-' + ti + '-' + Tot + '-' + p;
      if (pakai && pakai.has(kode)) continue;
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([p, Tot, kunci]));
      const maks = tp.uang ? 2000000 : 1000;
      const [a, b] = sederhana(p);
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu angka persennya saja. Persen berarti per 100: hitung ' + p + ' per 100 dari jumlah seluruhnya.', v: [p] },
        { s: 'Itu jumlah seluruhnya. Yang ditanya hanya ' + p + '% dari itu.', v: [Tot] },
        { s: 'Itu sisanya (' + (100 - p) + '%). Yang ditanya bagiannya, yaitu ' + p + '%.', v: [sisaNilai] },
        { s: 'Jumlah seluruhnya dikali ' + p + ' tanpa dibagi 100. Persen berarti per 100.', v: [Tot * p] },
        { s: 'Jumlah seluruhnya dikurangi ' + p + '. Persen bukan mengurangi angka, tetapi mengambil bagian.', v: [Tot - p] },
        { s: 'Jumlah seluruhnya dibagi ' + p + ' saja. Persen berarti per 100, bukan per ' + p + '.', v: Tot % p === 0 ? [Tot / p] : [] },
      ], [kunci + b, kunci - b, kunci * 2, kunci + p, kunci + 1, kunci - 1, kunci + 2, kunci - 2, kunci + 5, kunci - 5, kunci + 10, kunci - 10], { min: 1, maks });
      const P = N(pct(p), p / 100, true);
      const S = N(tp.uang ? rp(Tot) : fmt(Tot), Tot, true);
      const segmen = tp.isi(P, S);
      sisip(segmen, tp.disTeks, dis);
      segmen.push(T(' '), Q(tp.tanya));
      const f = (x) => (tp.uang ? rp(x) : fmt(x));
      const u = Tot / b;
      const cek = 'Yang ditanya bagiannya: ' + pct(p) + ' dari ' + f(Tot) + '.<br>' + pct(p) + ' = ' + p + ' per 100 = ' + a + '/' + b +
        '<br>' + f(Tot) + ' : ' + b + ' = ' + f(u) + ', lalu ' + f(u) + ' × ' + a + ' = ' + f(kunci) +
        '<br>Jawabannya: <b>' + fmt(kunci) + '</b> ' + (tp.uang ? 'rupiah (' + rp(kunci) + ')' : tp.satuan) +
        '<br><small>Cek: bagian ' + f(kunci) + ' + sisa ' + f(sisaNilai) + ' = ' + f(Tot) + ' (' + pct(p) + ' + ' + pct(100 - p) + ' = 100%).</small>';
      return {
        jenis: 'bagian', tingkat, kode, ti, uang: tp.uang, total: Tot, ps: [p], p, kunci, sisaNilai, penting: 2,
        cerita0: tp.cerita0, kata: tp.kata, segmen, angkaPengecoh: dis,
        gambar: pilihanKotak([p], true), tanya4: { teks: tp.tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalBagian gagal');
  }

  function soalSisa(tingkat, pakai) {
    const L = LEVEL[tingkat];
    for (let coba = 0; coba < 1000; coba++) {
      let ti, Tot, ps, U;
      const cs = CONTOH.filter((c) => c.jenis === 'sisa' && c.t === tingkat);
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); ti = c.ti; Tot = c.T; ps = c.ps.slice(); U = c.U; }
      else {
        ti = acak(0, TEMPLAT_SISA.length - 1);
        const tp0 = TEMPLAT_SISA[ti];
        if (tp0.kembalian && tingkat === 1) continue;
        const np = Math.min(pilih(L.np), tp0.maxNp);
        ps = pilihPersen(L, np);
        Tot = jumlahT(tp0, L);
        if (tp0.kembalian) { U = Tot - dari(Tot, ps[0]) + pilih([2, 5, 10]) * 1000; }
      }
      const tp = TEMPLAT_SISA[ti], np = ps.length, jml = jumlah(ps), sisaP = 100 - jml;
      const bagian = ps.map((p) => dari(Tot, p));
      const sisa = dari(Tot, sisaP);
      if (!Number.isInteger(sisa) || bagian.some((x) => !Number.isInteger(x))) continue;
      const bayar = tp.kembalian ? sisa : null;
      const kunci = tp.kembalian ? U - bayar : sisa;
      const kode = 'sis-' + ti + '-' + Tot + '-' + ps.join('_') + (U ? '-' + U : '');
      if (pakai && pakai.has(kode)) continue;
      const terlarang = new Set([Tot, kunci, jml, sisaP].concat(ps));
      if (U) terlarang.add(U);
      const dis = ambilPengecoh(tingkat, tp.dis, terlarang);
      const maks = tp.uang ? 2000000 : 1000;
      const grup = [];
      let cad;
      if (tp.kembalian) {
        const potong = bagian[0];
        grup.push(
          { s: 'Itu potongan harganya. Yang ditanya kembalian: uang dikurangi harga yang dibayar.', v: [potong] },
          { s: 'Itu harga yang harus dibayar. Kembalian = uang yang diberikan dikurangi harga yang dibayar.', v: [bayar] },
          { s: 'Itu harga asli robot. Harganya sudah didiskon, hitung dulu harga yang dibayar.', v: [Tot] },
          { s: 'Uang dikurangi potongan saja. Yang dikurangkan dari uang adalah harga yang dibayar (setelah diskon).', v: [U - potong] },
          { s: 'Itu uang Bayu. Kembalian adalah sisanya setelah membayar.', v: [U] },
        );
        cad = [kunci + 1000, kunci - 1000, kunci * 2, kunci + potong, kunci + 2000, kunci - 2000];
      } else {
        grup.push(
          { s: 'Itu bagian yang disebut' + (np === 2 ? ' (kedua persen dijumlahkan)' : '') + ' (' + jml + '%), bukan sisanya.', v: [dari(Tot, jml)] },
          { s: 'Itu jumlah seluruhnya. Yang ditanya sisanya setelah bagian yang disebut diambil.', v: [Tot] },
          { s: 'Jumlah seluruhnya dikurangi angka persennya (' + jml + '). Ubah persen jadi bagian dulu: hitung ' + jml + '% dari jumlah seluruhnya.', v: [Tot - jml] },
          { s: 'Itu angka persen sisanya (' + sisaP + '%), belum dihitung dari jumlah seluruhnya.', v: [sisaP] },
          { s: 'Itu bagian pertama saja (' + ps[0] + '%). Yang ditanya sisanya.', v: [bagian[0]] },
        );
        if (np === 2) {
          grup.push({ s: 'Itu bagian kedua saja (' + ps[1] + '%). Yang ditanya sisanya.', v: [bagian[1]] });
          grup.push({ s: 'Satu bagian lupa dikurangkan. Kurangkan kedua bagian: 100% - ' + ps[0] + '% - ' + ps[1] + '% = ' + sisaP + '%.', v: [Tot - bagian[0], Tot - bagian[1]] });
        }
        cad = [kunci + 10, kunci - 10, kunci * 2, kunci + 1, kunci - 1, kunci + 2, kunci - 2, kunci + 5, kunci - 5];
      }
      const { opsi, sebab } = buatOpsi(kunci, grup, cad, { min: 1, maks });
      const Ps = ps.map((p) => N(pct(p), p / 100, true));
      const S = N(tp.uang ? rp(Tot) : fmt(Tot), Tot, true);
      const Un = U ? N(rp(U), U, true) : null;
      const segmen = tp.isi(Ps, S, Un);
      sisip(segmen, tp.disTeks, dis);
      const tanya = tp.tanya(np);
      segmen.push(T(' '), Q(tanya));
      const f = (x) => (tp.uang ? rp(x) : fmt(x));
      const [a, b] = sederhana(sisaP);
      let cek = 'Yang ditanya sisanya.<br>';
      if (tp.kembalian) {
        cek += 'Potongan: ' + pct(ps[0]) + ' dari ' + f(Tot) + ' = ' + f(bagian[0]) + '<br>Harga dibayar: ' + f(Tot) + ' − ' + f(bagian[0]) + ' = ' + f(bayar) +
          '<br>Kembalian: ' + f(U) + ' − ' + f(bayar) + ' = <b>' + fmt(kunci) + '</b> rupiah (' + rp(kunci) + ')' +
          '<br><small>Cek: potongan ' + f(bagian[0]) + ' + dibayar ' + f(bayar) + ' = ' + f(Tot) + '; dibayar ' + f(bayar) + ' + kembalian ' + f(kunci) + ' = ' + f(U) + '.</small>';
      } else {
        cek += (np === 2 ? 'Persen yang disebut: ' + ps[0] + '% + ' + ps[1] + '% = ' + jml + '%.<br>' : 'Persen yang disebut: ' + jml + '%.<br>') +
          'Sisanya: 100% − ' + jml + '% = ' + sisaP + '%, sama dengan ' + a + '/' + b + '.<br>' +
          f(Tot) + ' : ' + b + ' = ' + f(Tot / b) + ', lalu ' + f(Tot / b) + ' × ' + a + ' = ' + f(sisa) +
          '<br>Jawabannya: <b>' + fmt(kunci) + '</b> ' + (tp.uang ? 'rupiah (' + rp(kunci) + ')' : tp.satuan) +
          '<br><small>Cek: ' + bagian.map(f).join(' + ') + ' + sisa ' + f(sisa) + ' = ' + f(Tot) + '.</small>';
      }
      return {
        jenis: 'sisa', tingkat, kode, ti, uang: tp.uang, total: Tot, ps, np, sisaP, kunci, sisaNilai: sisa, uangBayar: U || null,
        penting: 1 + np + (U ? 1 : 0), cerita0: tp.cerita0(np), kata: tp.kata(np), segmen, angkaPengecoh: dis,
        gambar: pilihanKotak(ps, false), tanya4: { teks: tanya, satuan: tp.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalSisa gagal');
  }

  const data = {
    id: 'k4b7',
    jenis: [
      { id: 'bagian', nama: 'Mencari bagiannya', petunjuk: 'yang diketahui jumlah seluruhnya dan persennya, yang ditanya <b>bagian itu sendiri</b> (misalnya potongan harga).',
        gambarPetunjuk: 'Soal ini mencari <b>bagiannya</b>. Pilih kotak seratus yang bagian persennya diarsir, sisanya polos.' },
      { id: 'sisa', nama: 'Mencari sisanya', petunjuk: 'beberapa persen sudah disebut, yang ditanya <b>sisanya</b> (yang belum disebut, atau kembalian).',
        gambarPetunjuk: 'Soal ini mencari <b>sisanya</b>. Pilih kotak seratus yang bagian disebut berwarna penuh, sisanya diarsir.' },
    ],
    tingkat: ['persen 10, 20, 25, 50; satu persen; tanpa angka pengecoh', 'persen sampai 75; kadang dua persen; 1 angka pengecoh', 'persen kelipatan 5; dua persen, uang ribuan, kembalian; 2 angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Seratus persen itu semuanya. Sisanya = 100% dikurangi persen yang disebut. Persen dari bilangan: ubah ke pecahan, bagi dulu, baru kali.',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'sisa' ? soalSisa(tingkat, pakai) : soalBagian(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    LEVEL, CONTOH, TEMPLAT_BAGIAN, TEMPLAT_SISA,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b7 = data;
})(typeof window !== 'undefined' ? window : globalThis);
