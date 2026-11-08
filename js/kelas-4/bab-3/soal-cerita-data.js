// Data 📖 Soal Cerita Kelas 4 Bab 3 (Faktor & Kelipatan) untuk mesin js/soal-cerita.js.
// Dua jenis: KELIPATAN (bersama lagi -> KPK <= 60) dan FAKTOR (bagi sama rata, paling banyak -> FPB >= 2).
// Semua jawaban dihitung kode (KPK/FPB lewat soal-cerita.js). Tes: node tools/cek-soal-cerita.js
// Contoh tetap (sama dengan video & Buku Saku): lampu 6 dan 8 detik -> 24 detik (tingkat 1);
// 24 stiker bintang dan 32 stiker hati -> 8 amplop (tingkat 2). Masing-masing muncul sebagai soal contoh dengan peluang sekitar 12% per soal.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, fmt, faktor, fpb, kpk, kelipatan, daftar, buatOpsi, pilihanGambar } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (n, penting) => ({ k: 'angka', t: fmt(n), penting: !!penting });
  const Q = (t) => ({ k: 'tanya', t });

  // ---------- Rentang angka per tingkat ----------
  const KEL = { 1: { lo: 3, hi: 12, maks: 36 }, 2: { lo: 3, hi: 15, maks: 60 }, 3: { lo: 4, hi: 30, maks: 60 } };
  const FAK = { 1: { lo: 4, hi: 12 }, 2: { lo: 12, hi: 48 }, 3: { lo: 24, hi: 96 } };
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 }; // angka yang tidak perlu ditandai

  const cache = {};
  function pasangKel(t) {
    if (cache['k' + t]) return cache['k' + t];
    const { lo, hi, maks } = KEL[t], sama = [], prima = [];
    for (let a = lo; a <= hi; a++) for (let b = a + 1; b <= hi; b++) {
      if (b % a === 0 || kpk(a, b) > maks) continue;
      (fpb(a, b) > 1 ? sama : prima).push([a, b]);
    }
    return (cache['k' + t] = { sama, prima }); // sama: KPK < hasil kali; prima: saling prima (KPK = hasil kali)
  }
  function pasangFak(t) {
    if (cache['f' + t]) return cache['f' + t];
    const { lo, hi } = FAK[t], s = [];
    for (let a = lo; a <= hi; a++) for (let b = a + 1; b <= hi; b++) {
      if (b % a === 0 || fpb(a, b) < 2) continue;
      s.push([a, b]);
    }
    return (cache['f' + t] = s);
  }
  // pilih pasangan dengan FPB dipilih rata dulu (supaya jawaban tidak melulu 2)
  function pilihFpb(pasang) {
    const per = {};
    pasang.forEach((p) => { (per[fpb(p[0], p[1])] = per[fpb(p[0], p[1])] || []).push(p); });
    return pilih(per[pilih(Object.keys(per))]);
  }
  // angka pengecoh: tidak boleh sama dengan angka penting atau jawaban
  function ambilPengecoh(tingkat, pembuat, terlarang) {
    const dis = [];
    for (let i = 0; i < BANYAK_PENGECOH[tingkat]; i++) {
      let v, n = 0;
      do { v = pembuat[i](); n++; } while (terlarang.has(v) && n < 100);
      terlarang.add(v); dis.push(v);
    }
    return dis;
  }

  // ---------- KELIPATAN ----------
  // Tiap templat: cerita tanpa angka (cerita0), satuan, pembuat angka pengecoh (dis), dan susunan segmen cerita lengkap.
  const TEMPLAT_KEL = [
    {
      satuan: 'detik', tanya: 'Pada detik ke berapa kedua lampu berkedip bersama lagi?',
      cerita0: 'Dua lampu hias dinyalakan bersamaan. Lampu merah berkedip dengan jeda tetap, lampu hijau juga, tetapi jedanya berbeda. Keduanya berkedip terus-menerus. Kapan keduanya berkedip bersama lagi?',
      kata: ['terus-menerus', 'bersama lagi'],
      dis: [() => acak(6, 9), () => acak(10, 30)],
      segmen: (a, b, d) => [].concat(
        d[0] ? [T('Dua lampu hias dinyalakan bersamaan pada pukul '), N(d[0]), T(' malam.')] : [T('Dua lampu hias dinyalakan bersamaan.')],
        [T(' Lampu merah berkedip setiap '), N(a, true), T(' detik, lampu hijau setiap '), N(b, true), T(' detik, terus-menerus.')],
        d[1] ? [T(' Tali lampunya sepanjang '), N(d[1]), T(' meter.')] : [],
        [T(' '), Q('Pada detik ke berapa kedua lampu berkedip bersama lagi?')]),
    },
    {
      satuan: 'menit', tanya: 'Setelah berapa menit kedua bel berbunyi bersama lagi?',
      cerita0: 'Dua bel di sekolah berbunyi bersamaan pagi tadi. Bel pertama dan bel kedua berbunyi dengan jeda tetap, tetapi jedanya berbeda. Keduanya berbunyi terus-menerus. Kapan keduanya berbunyi bersama lagi?',
      kata: ['terus-menerus', 'bersama lagi'],
      dis: [() => acak(6, 9), () => acak(2, 5)],
      segmen: (a, b, d) => [].concat(
        d[0] ? [T('Dua bel di sekolah berbunyi bersamaan pada pukul '), N(d[0]), T(' pagi.')] : [T('Dua bel di sekolah berbunyi bersamaan pagi tadi.')],
        [T(' Bel pertama berbunyi setiap '), N(a, true), T(' menit, bel kedua setiap '), N(b, true), T(' menit, terus-menerus.')],
        d[1] ? [T(' Di sekolah itu ada '), N(d[1]), T(' bel lain di aula.')] : [],
        [T(' '), Q('Setelah berapa menit kedua bel berbunyi bersama lagi?')]),
    },
    {
      satuan: 'menit', tanya: 'Setelah berapa menit kedua bus berangkat bersama lagi?',
      cerita0: 'Dua bus berangkat bersamaan dari terminal. Bus Biru dan Bus Hijau berangkat dengan jeda tetap, tetapi jedanya berbeda. Mereka terus berangkat sepanjang hari. Kapan keduanya berangkat bersama lagi?',
      kata: ['terus berangkat', 'bersama lagi'],
      dis: [() => acak(5, 8), () => acak(20, 40)],
      segmen: (a, b, d) => [].concat(
        d[0] ? [T('Dua bus berangkat bersamaan dari terminal pada pukul '), N(d[0]), T(' pagi.')] : [T('Dua bus berangkat bersamaan dari terminal.')],
        [T(' Bus Biru berangkat setiap '), N(a, true), T(' menit, Bus Hijau setiap '), N(b, true), T(' menit. Mereka terus berangkat sepanjang hari.')],
        d[1] ? [T(' Tiap bus memuat '), N(d[1]), T(' penumpang.')] : [],
        [T(' '), Q('Setelah berapa menit kedua bus berangkat bersama lagi?')]),
    },
  ];

  function soalKelipatan(tingkat, pakai) {
    for (let coba = 0; coba < 1000; coba++) {
      let a, b, ti;
      if (tingkat === 1 && Math.random() < 0.12) { a = 6; b = 8; ti = 0; } // contoh tetap
      else {
        const { sama, prima } = pasangKel(tingkat);
        [a, b] = pilih(prima.length && Math.random() < 0.3 ? prima : sama);
        ti = acak(0, TEMPLAT_KEL.length - 1);
      }
      const kode = 'kel-' + a + '-' + b + '-' + ti;
      if (pakai && pakai.has(kode)) continue;
      const kunci = kpk(a, b), g = fpb(a, b), tp = TEMPLAT_KEL[ti];
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([a, b, kunci]));
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu hasil kali ' + a + ' × ' + b + '. Memang bersama, tetapi ada yang lebih awal (KPK).', v: [a * b] },
        { s: 'Itu kelipatan ' + b + ' saja, belum kelipatan ' + a + '.', v: kelipatan(b, 4 * kunci).filter((m) => m % a !== 0) },
        { s: 'Itu kelipatan ' + a + ' saja, belum kelipatan ' + b + '.', v: kelipatan(a, 4 * kunci).filter((m) => m % b !== 0) },
        { s: 'Itu jumlah ' + a + ' + ' + b + '. Soal ini minta kelipatan yang sama.', v: [a + b] },
        { s: 'Itu selisih kedua angka, bukan kelipatan yang sama.', v: [b - a] },
        { s: 'Itu faktor persekutuan terbesar (FPB). Soal ini tentang kelipatan, bukan faktor.', v: g > 1 ? [g] : [] },
      ], [kunci + a, kunci + b, kunci - a, kunci - b, kunci + 10, kunci - 10], { min: 2, maks: 200 });
      const cek = 'Kelipatan ' + a + ': ' + daftar(kelipatan(a, kunci), 12) + '<br>Kelipatan ' + b + ': ' + daftar(kelipatan(b, kunci), 12) +
        '<br>Sama pertama kali: <b>' + kunci + '</b> ' + tp.satuan +
        '<br><small>' + kunci + ' : ' + a + ' = ' + (kunci / a) + ' dan ' + kunci + ' : ' + b + ' = ' + (kunci / b) + ', tanpa sisa.</small>';
      return {
        jenis: 'kelipatan', tingkat, kode, a, b, cerita0: tp.cerita0, kata: tp.kata,
        segmen: tp.segmen(a, b, dis), angkaPenting: [a, b], angkaPengecoh: dis,
        gambar: pilihanGambar('garis'), tanya4: { teks: tp.tanya, satuan: tp.satuan },
        kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalKelipatan gagal');
  }

  // ---------- FAKTOR ----------
  // disTeks: kalimat pengecoh dengan tanda {x} untuk angka
  const TEMPLAT_FAK = [
    { benda1: 'stiker bintang', benda2: 'stiker hati', e1: 'bintang', e2: 'hati', wadah: 'amplop', pelaku: 'Ibu', semua: 'stiker',
      dis: [() => 5 * acak(2, 10), () => acak(3, 9)], disTeks: [' Ibu membeli stiker itu dengan uang {x} ribu rupiah.', ' Amplopnya bergambar {x} bunga kecil.'] },
    { benda1: 'kelereng merah', benda2: 'kelereng biru', e1: 'merah', e2: 'biru', wadah: 'kantong', pelaku: 'Dodi', semua: 'kelereng',
      dis: [() => 5 * acak(2, 10), () => acak(3, 9)], disTeks: [' Dodi mendapat kelereng itu sejak {x} hari lalu.', ' Kantongnya dijahit dengan {x} warna benang.'] },
    { benda1: 'permen cokelat', benda2: 'permen stroberi', e1: 'cokelat', e2: 'stroberi', wadah: 'kotak', pelaku: 'Kak Rina', semua: 'permen',
      dis: [() => 5 * acak(2, 10), () => acak(3, 9)], disTeks: [' Kak Rina membeli permen itu dengan uang {x} ribu rupiah.', ' Kotaknya diikat dengan {x} pita.'] },
  ];
  const huruf = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function soalFaktor(tingkat, pakai) {
    for (let coba = 0; coba < 1000; coba++) {
      let a, b, ti;
      if (tingkat === 2 && Math.random() < 0.12) { a = 24; b = 32; ti = 0; } // contoh tetap
      else { [a, b] = pilihFpb(pasangFak(tingkat)); ti = acak(0, TEMPLAT_FAK.length - 1); }
      const kode = 'fak-' + a + '-' + b + '-' + ti;
      if (pakai && pakai.has(kode)) continue;
      const tp = TEMPLAT_FAK[ti], kunci = fpb(a, b), k = kpk(a, b);
      const dis = ambilPengecoh(tingkat, tp.dis, new Set([a, b, kunci]));
      const fa = faktor(a), fb = faktor(b), persekutuan = fa.filter((x) => b % x === 0);
      const tanya = 'Paling banyak ada berapa ' + tp.wadah + '?';
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Itu faktor persekutuan, tetapi bukan yang terbesar. Masih bisa lebih banyak ' + tp.wadah + '.', v: persekutuan.filter((x) => x < kunci) },
        { s: 'Itu banyak ' + tp.benda1 + ' di tiap ' + tp.wadah + ', bukan banyak ' + tp.wadah + '.', v: [a / kunci] },
        { s: 'Itu banyak ' + tp.benda2 + ' di tiap ' + tp.wadah + ', bukan banyak ' + tp.wadah + '.', v: [b / kunci] },
        { s: 'Itu KPK. Soal ini tentang membagi (faktor), bukan kelipatan.', v: [k] },
        { s: 'Itu selisih ' + a + ' dan ' + b + '. Yang dicari faktor yang sama.', v: [b - a] },
        { s: 'Itu faktor ' + a + ' saja. ' + b + ' tidak habis dibagi itu, jadi ada sisa.', v: fa.filter((x) => x > 1 && b % x !== 0) },
        { s: 'Itu faktor ' + b + ' saja. ' + a + ' tidak habis dibagi itu, jadi ada sisa.', v: fb.filter((x) => x > 1 && a % x !== 0) },
      ], [kunci + 1, kunci + 2, kunci - 1, kunci * 2, kunci + 4], { min: 1, maks: 200 });
      const cek = 'Faktor ' + a + ': ' + daftar(fa, 12) + '<br>Faktor ' + b + ': ' + daftar(fb, 12) +
        '<br>Faktor yang sama: ' + daftar(persekutuan, 12) + '. Yang terbesar: <b>' + kunci + '</b> ' + tp.wadah +
        '<br><small>' + a + ' : ' + kunci + ' = ' + (a / kunci) + ' ' + tp.e1 + ' dan ' + b + ' : ' + kunci + ' = ' + (b / kunci) + ' ' + tp.e2 + ' di tiap ' + tp.wadah + ', tanpa sisa.</small>';
      const segmen = [T(tp.pelaku + ' punya '), N(a, true), T(' ' + tp.benda1 + ' dan '), N(b, true),
        T(' ' + tp.benda2 + '. Semua ' + tp.semua + ' dibagi sama rata ke ' + tp.wadah + ', tanpa sisa. Isi tiap ' + tp.wadah + ' harus sama.')];
      dis.forEach((v, i) => { const [depan, belakang] = tp.disTeks[i].split('{x}'); segmen.push(T(depan), N(v), T(belakang)); });
      segmen.push(T(' '), Q(tanya));
      return {
        jenis: 'faktor', tingkat, kode, a, b,
        cerita0: tp.pelaku + ' punya ' + tp.benda1 + ' dan ' + tp.benda2 + '. Semua ' + tp.semua + ' dibagi sama rata ke ' + tp.wadah + ', tanpa sisa. Isi tiap ' + tp.wadah + ' harus sama. ' + tanya,
        kata: ['sama rata', 'tanpa sisa', 'Paling banyak'],
        segmen, angkaPenting: [a, b], angkaPengecoh: dis,
        gambar: pilihanGambar('bagi'), tanya4: { teks: tanya, satuan: tp.wadah },
        kunci, opsi, sebab, cek,
      };
    }
    throw new Error('soalFaktor gagal');
  }

  const data = {
    id: 'k4b3',
    jenis: [
      { id: 'kelipatan', nama: 'Kelipatan', petunjuk: '"bersama lagi", "terus-menerus": kejadian yang berulang.', gambarPetunjuk: 'Soal ini tentang <b>kelipatan</b>: ada yang berulang terus. Gambar mana yang menunjukkan loncatan berulang?' },
      { id: 'faktor', nama: 'Faktor', petunjuk: '"sama rata", "tanpa sisa", "paling banyak".', gambarPetunjuk: 'Soal ini tentang <b>faktor</b>: membagi sama rata tanpa sisa. Gambar mana yang menunjukkan pembagian ke wadah?' },
    ],
    tingkat: ['angka kecil, tanpa angka pengecoh', 'angka lebih besar, 1 angka pengecoh', 'angka besar, 2 angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. "Bersama lagi" = kelipatan. "Sama rata, tanpa sisa, paling banyak" = faktor.',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'kelipatan' ? soalKelipatan(tingkat, pakai) : soalFaktor(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    KEL, FAK,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b3 = data;
})(typeof window !== 'undefined' ? window : globalThis);
