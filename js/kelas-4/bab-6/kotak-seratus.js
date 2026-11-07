// Mini game 🟦 Kotak Seratus (Kelas 4 Bab 6): persepuluhan & perseratusan, pecahan -> desimal.
// Soal 1-3: kotak 10x10 (atau pita 10 bagian) diwarnai -> pilih desimalnya (pengecoh: 3,7 / 0,307 / 0,73 untuk 0,37).
// Soal 4-5: warnai sendiri sampai nilainya = desimal (atau pecahan) yang diminta.
// Tingkat 1: persepuluhan (pita) · 2: perseratusan (kotak 10x10) · 3: + pecahan (1/2, 1/4, 3/4, 2/5, 7/20...).
// Semua jawaban dihitung kode (bilangan bulat). Cek logika: node tools/cek-bab6.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const D = modul ? require('./desimal.js') : root.Desimal;
  const { des, teks, mil, senilai, minimal, pilihPengecoh, pengecohSeratus, pengecohSepuluh, pengecohPecahan, dariPecahan, acak, pilih, kocok } = D;

  // ---------- Logika (tanpa DOM) ----------
  const PECAHAN = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [1, 20], [3, 20], [7, 20], [9, 20], [11, 20], [13, 20], [17, 20]];
  const kosongSepuluh = (k) => k % 10 === 0;

  function soalBaca(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      let kunci, kandidat, bentuk, n;
      if (tingkat === 1) {
        n = acak(1, 9); bentuk = 'pita';
        kunci = des(n, 1); kandidat = pengecohSepuluh(n);
      } else {
        n = acak(11, 99); if (kosongSepuluh(n)) continue; bentuk = 'kotak';
        kunci = des(n, 2); kandidat = pengecohSeratus(n);
      }
      const kode = 'b' + bentuk + n;
      if (pakai && pakai.has(kode)) continue;
      const salah = pilihPengecoh(kunci, kandidat, 3);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'baca', bentuk, tingkat, n, kunci, opsi: kocok([kunci].concat(salah)), kode };
    }
    throw new Error('soalBaca gagal');
  }

  function soalPecahan(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const [a, b] = pilih(PECAHAN);
      const kode = 'p' + a + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      const kunci = dariPecahan(a, b);
      const salah = pilihPengecoh(kunci, pengecohPecahan(a, b, mil(kunci)), 3);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'pecahan', bentuk: 'kotak', tingkat, a, b, n: (a * 100) / b, kunci, opsi: kocok([kunci].concat(salah)), kode };
    }
    throw new Error('soalPecahan gagal');
  }

  function soalWarnai(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      if (tingkat === 1) {
        const n = acak(1, 9), kode = 'wpita' + n;
        if (pakai && pakai.has(kode)) continue;
        if (pakai) pakai.add(kode);
        return { jenis: 'warnai', bentuk: 'pita', tingkat, n, kunci: des(n, 1), kode };
      }
      if (tingkat === 2) {
        const n = acak(11, 99);
        if (kosongSepuluh(n)) continue;
        const kode = 'wkotak' + n;
        if (pakai && pakai.has(kode)) continue;
        if (pakai) pakai.add(kode);
        return { jenis: 'warnai', bentuk: 'kotak', tingkat, n, kunci: des(n, 2), kode };
      }
      const [a, b] = pilih(PECAHAN);
      const kode = 'w' + a + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'warnai', bentuk: 'kotak', tingkat, a, b, n: (a * 100) / b, kunci: dariPecahan(a, b), kode };
    }
    throw new Error('soalWarnai gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    if (tingkat < 3) return [soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalWarnai(tingkat, pakai), soalWarnai(tingkat, pakai)];
    return [soalPecahan(tingkat, pakai), soalPecahan(tingkat, pakai), soalBaca(2, pakai), soalWarnai(tingkat, pakai), soalWarnai(tingkat, pakai)].map((s) => Object.assign(s, { tingkat }));
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'baca') return Object.assign(soalBaca(tingkat < 3 ? tingkat : 2, pakai), { tingkat });
    if (soal.jenis === 'pecahan') return soalPecahan(tingkat, pakai);
    return soalWarnai(tingkat, pakai);
  }

  const periksaPilih = (soal, opsi) => ({ benar: senilai(opsi, soal.kunci), pilih: opsi });
  const periksaWarnai = (soal, jumlah) => ({ benar: jumlah === soal.n, jumlah });

  const logika = { PECAHAN, soalBaca, soalPecahan, soalWarnai, buatRonde, soalMirip, periksaPilih, periksaWarnai };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, kotakSeratus, pita } = D;
  const html = (p, k) => root.Pecahan.html(p, k);
  const BIRU = '#3A86FF', ORANYE = '#FF8A3D';
  const ukuranKotak = () => (window.innerHeight < 790 ? 270 : 310);

  function gambarSoal(soal, wadah) {
    // gambar diwarnai: kotak/pita sebanyak n
    const w = (i) => (i < soal.n ? BIRU : null);
    if (soal.bentuk === 'pita') { const g = pita({ lebar: 520, tinggi: 70, warnaFn: w }); wadah.appendChild(g.svg); return; }
    wadah.appendChild(kotakSeratus({ ukuran: ukuranKotak(), warnaFn: w }).svg);
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'warnai') return tampilWarnai(soal, wadah, kirim);
    if (soal.jenis === 'pecahan') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Pecahan ini sama dengan <b class="biru">berapa desimal</b>?'));
      wadah.appendChild(el('div', 'des-baris', html([soal.a, soal.b], 'pec-raksasa') + '<span class="des-sama">=</span><span class="kotak-tanda">?</span>'));
    } else {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', soal.bentuk === 'pita'
        ? 'Pita dibagi <b>10 bagian</b> sama besar.<br>Berapa bagian yang <b class="biru">berwarna</b>? <small>(tulis desimal)</small>'
        : 'Ada <b>100 kotak</b> kecil.<br>Berapa bagian yang <b class="biru">berwarna</b>? <small>(tulis desimal)</small>'));
      const baris = el('div', 'des-baris');
      gambarSoal(soal, baris);
      wadah.appendChild(baris);
    }
    const opsi = el('div', 'des-opsi');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-des', teks(o));
      b.onclick = () => kirim(periksaPilih(soal, o));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function tampilWarnai(soal, wadah, kirim) {
    const pitaMode = soal.bentuk === 'pita';
    const target = soal.a ? html([soal.a, soal.b], 'pec-besar') : '<b class="biru">' + teks(soal.kunci) + '</b>';
    wadah.appendChild(el('div', 'soal-teks soal-sedang', soal.a
      ? 'Warnai <span class="warna-pec">' + html([soal.a, soal.b], 'pec-besar') + '</span> dari kotak seratus.'
      : (pitaMode ? 'Warnai pita sampai nilainya ' : 'Warnai kotak sampai nilainya ') + target + '.'));
    const baris = el('div', 'des-baris des-warnai');
    const kanan = el('div', 'des-kanan');
    const info = el('div', 'pec-hitung');
    const hapus = el('button', 'tombol', '↺ Hapus');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    let diwarnai = new Set(), jumlahPita = 0;
    const hitung = () => (pitaMode ? jumlahPita : diwarnai.size);
    let gambar;
    const segarkan = () => {
      if (pitaMode) gambar.warnai((i) => (i < jumlahPita ? BIRU : null));
      else gambar.warnai((i) => (diwarnai.has(i) ? BIRU : null));
      const h = hitung();
      info.innerHTML = 'Terwarnai: <b>' + h + '</b> dari ' + (pitaMode ? 10 : 100) + (pitaMode ? ' bagian' : ' kotak');
      cek.disabled = h === 0;
    };
    if (pitaMode) {
      gambar = pita({ lebar: 520, tinggi: 70, onKetuk: (i) => { jumlahPita = jumlahPita === i + 1 ? i : i + 1; Suara.efek('pop'); segarkan(); } });
      baris.appendChild(gambar.svg);
    } else {
      gambar = kotakSeratus({
        ukuran: ukuranKotak(), kolomTombol: true,
        onKetuk: (i) => { if (diwarnai.has(i)) diwarnai.delete(i); else diwarnai.add(i); Suara.efek('pop'); segarkan(); },
        onKolom: (c) => {
          const kol = []; for (let r = 0; r < 10; r++) kol.push(c * 10 + r);
          if (kol.every((i) => diwarnai.has(i))) kol.forEach((i) => diwarnai.delete(i)); else kol.forEach((i) => diwarnai.add(i));
          Suara.efek('pop'); segarkan();
        },
      });
      baris.appendChild(gambar.svg);
    }
    hapus.onclick = () => { diwarnai = new Set(); jumlahPita = 0; Suara.efek('pop'); segarkan(); };
    cek.onclick = () => { if (hitung() > 0) kirim(periksaWarnai(soal, hitung())); };
    const tombol = el('div', 'baris-tombol des-tombol');
    tombol.append(hapus, cek);
    kanan.append(info, tombol);
    if (!pitaMode) kanan.appendChild(el('div', 'ingat-kecil', 'Ketuk <b>▼</b> untuk mewarnai 1 kolom (10 kotak).<br>Ketuk satu kotak untuk mewarnai / menghapus.'));
    else kanan.appendChild(el('div', 'ingat-kecil', 'Ketuk bagian terakhir yang mau diwarnai.'));
    baris.appendChild(kanan);
    wadah.appendChild(baris);
    segarkan();
  }

  // ---------- umpan balik ----------
  function pujian(soal) {
    if (soal.jenis === 'pecahan' || (soal.jenis === 'warnai' && soal.a)) {
      return { html: html([soal.a, soal.b]) + ' = <b>' + soal.n + '</b>/100 = <b>' + teks(soal.kunci) + '</b>' };
    }
    if (soal.bentuk === 'pita') return { html: soal.n + ' dari 10 bagian = ' + html([soal.n, 10]) + ' = <b>' + teks(soal.kunci) + '</b>' };
    return { html: soal.n + ' dari 100 kotak = <b>' + teks(soal.kunci) + '</b>' };
  }

  const PETUNJUK = {
    utuh: (soal) => (soal.bentuk === 'pita' ? 'Angka di depan koma itu bilangan <b>utuh</b>. Pita ini belum penuh satu pun.' : 'Angka di depan koma itu bilangan <b>utuh</b>. Kotak ini belum penuh satu pun.'),
    nol: () => 'Itu perseribuan (1000 bagian): jauh lebih kecil.',
    balik: () => 'Angkanya <b>terbalik</b>. Persepuluhan dulu, baru perseratusan.',
    sisa: () => 'Itu bagian yang <b>tidak</b> berwarna.',
    seratus: () => 'Itu perseratusan. Pita ini dibagi <b>10</b>, bukan 100.',
    pisah: () => 'Pecahan tidak boleh ditulis dengan koma begitu saja. Ubah dulu penyebutnya jadi <b>10</b> atau <b>100</b>.',
    gabung: () => 'Pecahan tidak boleh digabung begitu saja. Ubah dulu penyebutnya jadi <b>10</b> atau <b>100</b>.',
    penyebut: () => 'Penyebut bukan angka di belakang koma. Ubah dulu penyebutnya jadi <b>10</b> atau <b>100</b>.',
  };

  function alasan(soal, jawaban, wadah) {
    const n = soal.n;
    const baris = el('div', 'alasan-baris');
    let gambar, kata;
    if (soal.bentuk === 'pita') {
      gambar = pita({ lebar: 400, tinggi: 56, warnaFn: (i) => (i < n ? BIRU : null) }).svg;
      kata = '<b>' + n + ' bagian</b> berwarna dari 10 bagian = ' + html([n, 10]) + ' = <b>' + teks(soal.kunci) + '</b>.';
    } else {
      const { kolom, sisa } = D.kolomSisa(n);
      gambar = kotakSeratus({ ukuran: 220, warnaFn: (i) => (i < kolom * 10 ? BIRU : i < n ? ORANYE : null) }).svg;
      if (soal.a) {
        const f = 100 / soal.b;
        kata = 'Bagi 100 kotak jadi ' + soal.b + ' bagian sama besar: tiap bagian <b>' + f + ' kotak</b>.<br>' + html([soal.a, soal.b]) + ' = ' + soal.a + ' &times; ' + f + ' = <b>' + n + '</b> kotak = ' + html([n, 100]) + ' = <b>' + teks(soal.kunci) + '</b>.';
      } else {
        kata = '<span class="biru-t"><b>' + kolom + ' kolom</b> penuh</span> = ' + kolom + ' persepuluhan = ' + teks(des(kolom, 1)) + '<br>' +
          (sisa ? '<span class="oranye-t"><b>' + sisa + ' kotak</b></span> lagi = ' + sisa + ' perseratusan = ' + teks(des(sisa, 2)) + '<br>' : '') +
          'Jumlahnya: <b>' + teks(soal.kunci) + '</b>';
      }
    }
    const kolomKata = el('div', 'kotak-teks', kata);
    if (soal.jenis === 'warnai') kolomKata.innerHTML += '<br><small>Kamu mewarnai ' + jawaban.jumlah + ' ' + (soal.bentuk === 'pita' ? 'bagian' : 'kotak') + ', padahal harus ' + n + '.</small>';
    else if (jawaban.pilih && PETUNJUK[jawaban.pilih.salah]) kolomKata.innerHTML += '<br><small>Kamu memilih ' + teks(jawaban.pilih) + '. ' + PETUNJUK[jawaban.pilih.salah](soal) + '</small>';
    baris.append(gambar, kolomKata);
    wadah.appendChild(baris);
  }

  root.GameKotakSeratus = Object.assign({
    id: 'kotak-seratus',
    tingkat: ['persepuluhan', 'perseratusan', 'dari pecahan'],
    ingat: 'Satu kotak besar dibagi 100. Satu kolom (10 kotak) = 0,1. Satu kotak kecil = 0,01. Jadi 37 kotak = 0,37.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
