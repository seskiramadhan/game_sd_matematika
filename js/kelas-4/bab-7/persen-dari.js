// Mini game 🏷️ Persen dari… (Kelas 4 Bab 7): persen dari suatu banyak.
// Soal 1-3: "25% dari 80 permen = ?" dengan model pita (pilihan ganda).
// Soal 4-5: cerita pendek original (diskon toko, murid di kelas, isi kebun), pilihan ganda.
// Tingkat 1: 50% & 10% dari 10-200 · 2: 25%, 20%, 5% · 3: 15%, 35%, 75%, 30%.
// Banyaknya dipilih supaya hasil selalu bulat (kelipatan 100 / fpb(p,100)). Semua dihitung dengan bilangan bulat.
// Cek logika: node tools/cek-bab7.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('./persen.js') : root.Persen;
  const { acak, pilih, kocok, opsiBilangan, langkahBanyak, jmlBagian, bagianTerwarna, ribuan } = P;

  // ---------- Logika (tanpa DOM) ----------
  const PERSEN = [null, [50, 10], [25, 20, 5], [15, 35, 75, 30]];
  const BENDA = ['permen', 'kelereng', 'stiker', 'kue', 'kancing', 'manik-manik', 'buku', 'apel'];
  // cerita: rentang banyak (diskon dalam ribuan rupiah)
  const CERITA = {
    diskon: { lo: 20, hi: 200, barang: ['tas', 'sepatu', 'jaket', 'kotak pensil', 'topi', 'sepeda mini'] },
    murid: { lo: 20, hi: 40 },
    kebun: { lo: 20, hi: 120, pohon: ['mangga', 'jambu', 'rambutan', 'jeruk', 'pepaya'] },
  };

  function banyakCocok(p, lo, hi) {
    const step = langkahBanyak(p), daftar = [];
    for (let b = Math.ceil(lo / step) * step; b <= hi; b += step) daftar.push(b);
    return daftar;
  }

  function opsiHasil(p, b, kunci) {
    return opsiBilangan(kunci, [{ v: b - kunci, salah: 'sisa' }, { v: p, salah: 'sama' }, { v: kunci * 2, salah: 'dekat' }, { v: kunci + 10, salah: 'dekat' }, { v: kunci + 5, salah: 'dekat' },
      { v: kunci - 5, salah: 'dekat' }, { v: kunci * 10, salah: 'dekat' }, { v: Math.floor(kunci / 2), salah: 'dekat' }, { v: kunci + 1, salah: 'dekat' }]);
  }

  function soalModel(tingkat, pakai, pakaiP) {
    for (let c = 0; c < 500; c++) {
      const p = pilih(PERSEN[tingkat]);
      if (pakaiP && pakaiP.has(p)) continue;
      const daftar = banyakCocok(p, tingkat === 1 ? 10 : 20, 200);
      const b = pilih(daftar), kode = 'm' + p + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      const kunci = (p * b) / 100;
      const opsi = opsiHasil(p, b, kunci);
      if (!opsi) continue;
      if (pakai) pakai.add(kode);
      if (pakaiP) pakaiP.add(p);
      return { jenis: 'model', tingkat, p, b, benda: pilih(BENDA), kunci, opsi, kode };
    }
    throw new Error('soalModel gagal');
  }

  function soalCerita(tingkat, nama, pakai) {
    const C = CERITA[nama];
    for (let c = 0; c < 500; c++) {
      const p = pilih(PERSEN[tingkat]);
      const daftar = banyakCocok(p, C.lo, C.hi);
      if (!daftar.length) continue;
      const b = pilih(daftar), kode = 'c' + nama + p + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      const kunci = (p * b) / 100;
      const opsi = opsiHasil(p, b, kunci);
      if (!opsi) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'cerita', cerita: nama, tingkat, p, b, kunci, opsi, kode, benda: nama === 'diskon' ? pilih(C.barang) : nama === 'kebun' ? pilih(C.pohon) : '' };
    }
    throw new Error('soalCerita gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      const pakai = new Set(), pakaiP = new Set();
      const nama = kocok(['diskon', 'murid', 'kebun']).slice(0, 2);
      const r = [soalModel(tingkat, pakai, null), soalModel(tingkat, pakai, null), soalModel(tingkat, pakai, null), soalCerita(tingkat, nama[0], pakai), soalCerita(tingkat, nama[1], pakai)];
      if (new Set(r.slice(0, 3).map((s) => s.kunci)).size > 1) return r;
    }
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    return soal.jenis === 'model' ? soalModel(tingkat, pakai, null) : soalCerita(tingkat, soal.cerita, pakai);
  }

  const periksaPilih = (soal, o) => ({ benar: o.v === soal.kunci, pilih: o });

  const logika = { PERSEN, CERITA, banyakCocok, buatRonde, soalModel, soalCerita, soalMirip, periksaPilih };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, pitaN } = P;
  const html = (p, k) => root.Pecahan.html(p, k);
  const MERAH = '#E04466';

  // teks angka sesuai cerita (diskon dalam rupiah; banyak dalam ribuan)
  const angka = (soal, v) => (soal.cerita === 'diskon' ? 'Rp ' + ribuan(v * 1000) : String(v));

  function teksSoal(soal) {
    if (soal.jenis === 'model') return '<b class="merah">' + soal.p + '%</b> dari <b>' + soal.b + ' ' + soal.benda + '</b> = ?';
    if (soal.cerita === 'diskon') return 'Toko Sinar menjual ' + soal.benda + ' seharga <b>Rp ' + ribuan(soal.b * 1000) + '</b>. Hari ini ada diskon <b class="merah">' + soal.p + '%</b>.<br>Berapa rupiah <b>potongan harganya</b>?';
    if (soal.cerita === 'murid') return 'Di kelas 4B ada <b>' + soal.b + ' murid</b>. Sebanyak <b class="merah">' + soal.p + '%</b> murid suka sepak bola.<br>Berapa murid yang suka sepak bola?';
    return 'Kebun Bu Ani ditanami <b>' + soal.b + ' pohon</b>. Sebanyak <b class="merah">' + soal.p + '%</b> pohonnya pohon ' + soal.benda + '.<br>Berapa pohon ' + soal.benda + ' di kebun itu?';
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    if (soal.jenis === 'model') {
      const n = jmlBagian(soal.p);
      const g = el('div', 'persen-pita');
      g.appendChild(pitaN(n, bagianTerwarna(soal.p), 520, 60, MERAH));
      g.appendChild(el('div', 'ingat-kecil', 'Seluruh pita = 100% = ' + soal.b + ' ' + soal.benda + '. Bagian merah = ' + soal.p + '%.'));
      wadah.appendChild(g);
    }
    const opsi = el('div', 'des-opsi');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-des', angka(soal, o.v));
      b.onclick = () => kirim(periksaPilih(soal, o));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  // ---------- umpan balik ----------
  const pujian = (soal) => ({ html: soal.p + '% dari ' + angka(soal, soal.b) + ' = <b>' + angka(soal, soal.kunci) + '</b>' });

  const PETUNJUK = {
    sisa: 'Itu bagian yang <b>sisa</b>, bukan bagian yang diminta.',
    sama: 'Angka persen bukan hasilnya. Persen itu <b>per seratus</b> dari banyaknya.',
    dekat: 'Hitung lagi dengan pita: bagi dulu, lalu jumlahkan bagian yang diminta.',
  };

  function alasan(soal, jawaban, wadah) {
    const p = soal.p, b = soal.b, n = jmlBagian(p), k = bagianTerwarna(p), tiap = b / n;
    const g = 100 / n;
    const baris = el('div', 'alasan-baris alasan-kolom');
    baris.appendChild(pitaN(n, k, Math.min(480, n * 48), 46, MERAH));
    const kata = el('div', 'kotak-teks',
      'Pita dipotong jadi <b>' + n + ' bagian</b> sama besar (tiap bagian = ' + g + '%).<br>' +
      'Tiap bagian = ' + angka(soal, b) + ' &divide; ' + n + ' = <b>' + angka(soal, tiap) + '</b>.<br>' +
      p + '% = <span class="merah-t"><b>' + k + ' bagian</b></span>: ' + k + ' &times; ' + angka(soal, tiap) + ' = <b>' + angka(soal, soal.kunci) + '</b>');
    const o = jawaban.pilih;
    if (o && o.salah && PETUNJUK[o.salah]) kata.innerHTML += '<br><small>Kamu memilih ' + angka(soal, o.v) + '. ' + PETUNJUK[o.salah] + '</small>';
    baris.appendChild(kata);
    wadah.appendChild(baris);
  }

  root.GamePersenDari = Object.assign({
    id: 'persen-dari',
    tingkat: ['50% dan 10%', '25%, 20%, 5%', '15%, 35%, 75%, 30%'],
    ingat: 'Persen dari: potong dulu jadi bagian sama besar. 10% = bagi 10. 50% = bagi 2. 25% = bagi 4.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
