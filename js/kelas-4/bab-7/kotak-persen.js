// Mini game 🟥 Kotak Persen (Kelas 4 Bab 7): persen = per seratus.
// Soal 1-3: kotak 10x10 diwarnai -> pilih persennya (pengecoh: 3,7% / 0,37% / 63% = bagian tak berwarna).
// Soal 4-5: warnai sendiri sampai = p% (tombol ▼ per kolom = 10%, atau ketuk kotak).
// Tingkat 1: kelipatan 10% · 2: 1-99% sembarang · 3: + 1%, 100%, dan "berapa persen yang tidak berwarna?".
// Semua jawaban dihitung kode (bilangan bulat). Cek logika: node tools/cek-bab7.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('./persen.js') : root.Persen;
  const { acak, pilih, kocok, teksMp, pilihBentuk, pengecohPersen, bentukPersen } = P;

  // ---------- Logika (tanpa DOM) ----------
  const bukanKelipatan10 = (p) => p % 10 !== 0;
  function ambilP(tingkat, jenis, pakai) {
    for (let c = 0; c < 500; c++) {
      let p;
      if (tingkat === 1) p = acak(1, 9) * 10;
      else if (tingkat === 2) p = acak(1, 99);
      else p = jenis === 'sisa' ? acak(11, 89) : jenis === 'khusus' ? pilih([1, 100]) : jenis === 'warnaiKhusus' ? acak(1, 100) : acak(11, 99);
      if (tingkat === 2 && jenis === 'baca' && p % 10 === 0) continue; // tingkat 2: sembarang, bukan kelipatan 10
      if (tingkat >= 2 && jenis !== 'khusus' && p === 100) { if (jenis !== 'warnaiKhusus') continue; }
      const kode = jenis + p;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { p, kode };
    }
    throw new Error('ambilP gagal');
  }

  function soalBaca(tingkat, jenis, pakai) {
    for (let c = 0; c < 200; c++) {
      const { p, kode } = ambilP(tingkat, jenis === 'sisa' ? 'sisa' : jenis === 'khusus' ? 'khusus' : 'baca', new Set());
      const kodeLengkap = (jenis === 'sisa' ? 's' : 'b') + p;
      if (pakai && pakai.has(kodeLengkap)) continue;
      const tak = jenis === 'sisa';
      const kunciP = tak ? 100 - p : p;
      const kunci = bentukPersen(kunciP * 100);
      // bila "tidak berwarna": pengecoh dihitung dari nilai kunci, ditambah persen berwarna sebagai jebakan utama
      const kandidat = tak ? [bentukPersen(p * 100, 'berwarna')].concat(pengecohPersen(kunciP, true).filter((x) => x.salah !== 'berwarna')) : pengecohPersen(p, false);
      const salah = pilihBentuk(kunci, kandidat, 3);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kodeLengkap);
      return { jenis: tak ? 'sisa' : 'baca', tingkat, p, kunci: kunciP * 100, opsi: kocok([kunci].concat(salah)), kode: kodeLengkap };
    }
    throw new Error('soalBaca gagal');
  }

  function soalWarnai(tingkat, jenis, pakai) {
    for (let c = 0; c < 200; c++) {
      const { p } = ambilP(tingkat, jenis, new Set());
      const kode = 'w' + p;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'warnai', tingkat, p, kunci: p, kode };
    }
    throw new Error('soalWarnai gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      const pakai = new Set();
      let r;
      if (tingkat < 3) r = [soalBaca(tingkat, 'baca', pakai), soalBaca(tingkat, 'baca', pakai), soalBaca(tingkat, 'baca', pakai), soalWarnai(tingkat, 'warnai', pakai), soalWarnai(tingkat, 'warnai', pakai)];
      else r = [soalBaca(3, 'khusus', pakai), soalBaca(3, 'sisa', pakai), soalBaca(3, 'baca', pakai), soalWarnai(3, 'warnaiKhusus', pakai), soalWarnai(3, 'warnai', pakai)];
      if (new Set(r.slice(0, 3).map((s) => s.kunci)).size > 1) return r;
    }
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'baca') return soalBaca(tingkat, tingkat === 3 ? 'baca' : 'baca', pakai);
    if (soal.jenis === 'sisa') return soalBaca(3, 'sisa', pakai);
    return soalWarnai(tingkat, tingkat === 3 ? 'warnai' : 'warnai', pakai);
  }

  const periksaPilih = (soal, opsi) => ({ benar: opsi.m === soal.kunci, pilih: opsi });
  const periksaWarnai = (soal, jumlah) => ({ benar: jumlah === soal.p, jumlah });

  const logika = { buatRonde, soalBaca, soalWarnai, soalMirip, periksaPilih, periksaWarnai };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el } = P;
  const D = root.Desimal;
  const MERAH = '#E04466', ORANYE = '#FF8A3D';
  const ukuranKotak = () => (window.innerHeight < 790 ? 270 : 310);

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'warnai') return tampilWarnai(soal, wadah, kirim);
    wadah.appendChild(el('div', 'soal-teks soal-sedang', soal.jenis === 'sisa'
      ? 'Ada <b>100 kotak</b> kecil.<br>Berapa persen yang <b class="merah">TIDAK berwarna</b>?'
      : 'Ada <b>100 kotak</b> kecil.<br>Berapa persen yang <b class="merah">berwarna</b>?'));
    const baris = el('div', 'des-baris');
    baris.appendChild(D.kotakSeratus({ ukuran: ukuranKotak(), warnaFn: (i) => (i < soal.p ? MERAH : null) }).svg);
    wadah.appendChild(baris);
    const opsi = el('div', 'des-opsi');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-des', teksMp(o.m));
      b.onclick = () => kirim(periksaPilih(soal, o));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function tampilWarnai(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Warnai kotak sampai <b class="merah">' + soal.p + '%</b>.'));
    const baris = el('div', 'des-baris des-warnai');
    const kanan = el('div', 'des-kanan');
    const info = el('div', 'pec-hitung');
    const hapus = el('button', 'tombol', '↺ Hapus');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    let diwarnai = new Set();
    let gambar;
    const segarkan = () => {
      gambar.warnai((i) => (diwarnai.has(i) ? MERAH : null));
      info.innerHTML = 'Terwarnai: <b>' + diwarnai.size + '</b> dari 100 kotak';
      cek.disabled = diwarnai.size === 0;
    };
    gambar = D.kotakSeratus({
      ukuran: ukuranKotak(), kolomTombol: true,
      onKetuk: (i) => { if (diwarnai.has(i)) diwarnai.delete(i); else diwarnai.add(i); Suara.efek('pop'); segarkan(); },
      onKolom: (c) => {
        const kol = []; for (let r = 0; r < 10; r++) kol.push(c * 10 + r);
        if (kol.every((i) => diwarnai.has(i))) kol.forEach((i) => diwarnai.delete(i)); else kol.forEach((i) => diwarnai.add(i));
        Suara.efek('pop'); segarkan();
      },
    });
    baris.appendChild(gambar.svg);
    hapus.onclick = () => { diwarnai = new Set(); Suara.efek('pop'); segarkan(); };
    cek.onclick = () => { if (diwarnai.size > 0) kirim(periksaWarnai(soal, diwarnai.size)); };
    const tombol = el('div', 'baris-tombol des-tombol');
    tombol.append(hapus, cek);
    kanan.append(info, tombol, el('div', 'ingat-kecil', 'Ketuk <b>▼</b> untuk mewarnai 1 kolom (10 kotak).<br>Ketuk satu kotak untuk mewarnai / menghapus.'));
    baris.appendChild(kanan);
    wadah.appendChild(baris);
    segarkan();
  }

  // ---------- umpan balik ----------
  function pujian(soal) {
    if (soal.jenis === 'sisa') return { html: 'Berwarna ' + soal.p + ', tidak berwarna ' + (100 - soal.p) + ' dari 100 kotak = <b>' + (100 - soal.p) + '%</b>' };
    return { html: soal.p + ' dari 100 kotak = <b>' + soal.p + '%</b>' };
  }

  const PETUNJUK = {
    persepuluh: () => 'Persen itu <b>per seratus</b>: 100 kotak, bukan 10. Satu kotak = 1%.',
    perseratus: () => 'Itu terlalu kecil. Ada banyak kotak yang berwarna, bukan satu saja.',
    sisa: () => 'Itu bagian yang <b>tidak</b> berwarna.',
    berwarna: () => 'Itu bagian yang <b>berwarna</b>, padahal yang ditanya yang tidak berwarna.',
    dekat: () => 'Hitung lagi dengan teliti: 1 kolom = 10 kotak = 10%.',
  };

  function alasan(soal, jawaban, wadah) {
    const n = soal.p;
    const { kolom, sisa } = P.kolomSisa(n);
    const baris = el('div', 'alasan-baris');
    const gambar = D.kotakSeratus({ ukuran: 220, warnaFn: (i) => (i < kolom * 10 ? MERAH : i < n ? ORANYE : null) }).svg;
    let kata = (kolom ? '<span class="merah-t"><b>' + kolom + ' kolom</b> penuh</span> = ' + kolom + ' &times; 10% = ' + (kolom * 10) + '%<br>' : '') +
      (sisa ? '<span class="oranye-t"><b>' + sisa + ' kotak</b></span> lagi = ' + sisa + '%<br>' : '') +
      'Jumlahnya: <b>' + n + '%</b>';
    if (soal.jenis === 'sisa') kata += '<br>Yang tidak berwarna: 100 &minus; ' + n + ' = <b>' + (100 - n) + '%</b>';
    const kolomKata = el('div', 'kotak-teks', kata);
    if (soal.jenis === 'warnai') kolomKata.innerHTML += '<br><small>Kamu mewarnai ' + jawaban.jumlah + ' kotak, padahal harus ' + n + '.</small>';
    else if (jawaban.pilih && PETUNJUK[jawaban.pilih.salah]) kolomKata.innerHTML += '<br><small>Kamu memilih ' + teksMp(jawaban.pilih.m) + '. ' + PETUNJUK[jawaban.pilih.salah]() + '</small>';
    baris.append(gambar, kolomKata);
    wadah.appendChild(baris);
  }

  root.GameKotakPersen = Object.assign({
    id: 'kotak-persen',
    tingkat: ['kelipatan 10%', '1–99%', 'termasuk 1% dan 100%'],
    ingat: 'Persen artinya per seratus. 100 kotak = 100%. Satu kotak = 1%. Satu kolom (10 kotak) = 10%.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
