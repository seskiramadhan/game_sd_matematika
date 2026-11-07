// Mini game 🔄 Tukar Bentuk (Kelas 4 Bab 5): pecahan tidak murni ↔ pecahan campuran.
// Soal 1-3: "11/4 = ?" -> pilih bentuk campuran (bagi: hasil bagi = utuh, sisa = pembilang baru).
//           Pengecoh wajib: hasil bagi dan sisa tertukar.
// Soal 4-5: "2 3/8 = ?/8" -> isi pembilang dengan tombol angka: (utuh × penyebut) + pembilang.
//           Kesalahan yang dikenali: utuh + pembilang (lupa dikali penyebut), utuh × penyebut saja (lupa ditambah).
// Semua jawaban dihitung oleh kode. Cek logika: node tools/cek-bab5.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('../bab-4/pecahan.js') : root.Pecahan;
  const C = modul ? require('./campuran.js') : root.Campuran;
  const { senilai, pilih, kocok, acak } = P;
  const { nilai, keCampuran, keTidakMurni, PENYEBUT, MAKS_UTUH } = C;

  // ---------- Logika (tanpa DOM) ----------
  function pilihan(u, a, b) {
    const kunci = { u, a, b };
    const daftar = [kunci];
    const tambah = (c) => {
      if (c.u < 1 || c.a < 1 || c.a >= c.b) return false;
      if (daftar.some((d) => senilai(nilai(d), nilai(c)))) return false;
      daftar.push(c);
      return true;
    };
    tambah({ u: a, a: u, b, salah: 'tertukar' }); // hasil bagi dan sisa tertukar
    const lain = kocok([{ u: u + 1, a, b }, { u: u - 1, a, b }, { u, a: a + 1, b }, { u, a: a - 1, b }, { u, a: b - a, b }, { u: u + 1, a: a - 1, b }]);
    for (const c of lain) { if (daftar.length >= 4) break; tambah(c); }
    return { opsi: kocok(daftar), kunci };
  }

  // tidak murni -> campuran (pilih)
  function soalKeCampuran(tingkat, pakai) {
    for (let coba = 0; coba < 400; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const u = acak(1, MAKS_UTUH[tingkat]);
      const a = acak(1, b - 1);
      if (u >= b || u === a) continue; // supaya "tertukar" tetap pecahan campuran yang berbeda
      const n = keTidakMurni({ u, a, b });
      if (pakai && pakai.has(n + '/' + b)) continue;
      const { opsi, kunci } = pilihan(u, a, b);
      if (opsi.length < 4) continue;
      if (pakai) pakai.add(n + '/' + b);
      return { jenis: 'keCampuran', n, b, u, a, opsi, kunci, tingkat };
    }
    throw new Error('soalKeCampuran gagal');
  }

  // campuran -> tidak murni (isi pembilang)
  function soalKeTidakMurni(tingkat, pakai) {
    for (let coba = 0; coba < 400; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const u = acak(1, MAKS_UTUH[tingkat]);
      const a = acak(1, b - 1);
      const n = keTidakMurni({ u, a, b });
      if (pakai && pakai.has(n + '/' + b)) continue;
      if (pakai) pakai.add(n + '/' + b);
      return { jenis: 'keTidakMurni', n, b, u, a, tingkat };
    }
    throw new Error('soalKeTidakMurni gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalKeCampuran(tingkat, pakai), soalKeCampuran(tingkat, pakai), soalKeCampuran(tingkat, pakai), soalKeTidakMurni(tingkat, pakai), soalKeTidakMurni(tingkat, pakai)];
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.n + '/' + soal.b]);
    return soal.jenis === 'keCampuran' ? soalKeCampuran(tingkat, pakai) : soalKeTidakMurni(tingkat, pakai);
  }

  function periksaKeCampuran(soal, c) {
    const benar = c.u === soal.u && c.a === soal.a && c.b === soal.b;
    const jenisSalah = !benar && c.u === soal.a && c.a === soal.u && c.b === soal.b ? 'tertukar' : null;
    return { pilih: c, benar, jenisSalah };
  }
  function periksaKeTidakMurni(soal, x) {
    const benar = x === soal.n;
    let jenisSalah = null;
    if (!benar) {
      if (x === soal.u + soal.a) jenisSalah = 'lupaKali';
      else if (x === soal.u * soal.b) jenisSalah = 'lupaTambah';
    }
    return { isi: x, benar, jenisSalah };
  }

  const logika = { pilihan, soalKeCampuran, soalKeTidakMurni, buatRonde, soalMirip, periksaKeCampuran, periksaKeTidakMurni };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el } = P;
  const h = C.html;

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'keCampuran') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Ubah jadi pecahan <b class="biru">campuran</b>'));
      wadah.appendChild(el('div', 'tukar-soal', P.html([soal.n, soal.b]) + '<span class="sama">=</span><span class="tanya">?</span>'));
      const opsi = el('div', 'pec-opsi empat');
      soal.opsi.forEach((c) => {
        const t = el('button', 'tombol tombol-pec', h(c));
        t.onclick = () => kirim(periksaKeCampuran(soal, c));
        opsi.appendChild(t);
      });
      wadah.appendChild(opsi);
      return;
    }
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Ubah jadi pecahan <b class="biru">biasa</b>'));
    const baris = el('div', 'tukar-baris');
    const kiri = el('div', 'tukar-soal', h(soal) + '<span class="sama">=</span>' +
      '<span class="pec"><span class="pec-a"><span class="kotak-isi">?</span></span><span class="pec-b">' + soal.b + '</span></span>');
    const kotak = kiri.querySelector('.kotak-isi');
    const kanan = el('div', 'papan-kanan');
    let isi = '';
    const papan = C.papanAngka((v) => { isi = v; kotak.textContent = v || '?'; kotak.classList.toggle('terisi', !!v); cek.disabled = !v; }, { digit: 2 });
    const cek = el('button', 'tombol tombol-utama tombol-angka-cek', '✓ Cek');
    cek.disabled = true;
    cek.onclick = () => { if (isi) kirim(periksaKeTidakMurni(soal, Number(isi))); };
    papan.appendChild(cek);
    kanan.appendChild(papan);
    baris.append(kiri, kanan);
    wadah.appendChild(baris);
    wadah.appendChild(el('div', 'ingat-kecil', '(utuh × penyebut) + pembilang'));
  }

  function pujian(soal) {
    if (soal.jenis === 'keCampuran') return { html: soal.n + ' : ' + soal.b + ' = ' + soal.u + ' sisa ' + soal.a + ' → ' + P.html([soal.n, soal.b]) + ' = ' + h(soal) };
    return { html: '(' + soal.u + ' × ' + soal.b + ') + ' + soal.a + ' = ' + soal.n + ' → ' + h(soal) + ' = ' + P.html([soal.n, soal.b]) };
  }

  function gambar(soal) {
    return C.barisRoti(soal.u, soal.a, soal.b, {
      ukuranUtuh: soal.u >= 4 ? 70 : 84, ukuranSisa: soal.u >= 4 ? 70 : 84, plus: true,
      labelUtuh: () => soal.b + ' potong', labelSisa: (soal.jenis === 'keCampuran' ? 'sisa ' : '') + soal.a + ' potong',
    });
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'alasan-kolom');
    if (soal.jenis === 'keCampuran') {
      kolom.appendChild(el('div', 'alasan-hitung', soal.n + ' : ' + soal.b + ' = <b>' + soal.u + '</b> sisa <b class="merah">' + soal.a + '</b>'));
      kolom.appendChild(gambar(soal));
      let kata = 'Tiap <b>' + soal.b + '</b> potong dikumpulkan jadi 1 roti utuh: ' + soal.n + ' potong → <b>' + soal.u + '</b> utuh, sisa <b>' + soal.a + '</b> potong.<br>' +
        'Hasil bagi = bilangan besar, sisa = pembilang baru, penyebut tetap ' + soal.b + '. Jadi ' + P.html([soal.n, soal.b]) + ' = ' + h(soal) + '.';
      if (jawaban.jenisSalah === 'tertukar') kata += '<br>Kamu memilih ' + h(jawaban.pilih) + ': hasil bagi dan sisa <b>tertukar</b>.';
      kolom.appendChild(el('div', 'kotak-teks', kata));
      wadah.appendChild(kolom);
      return;
    }
    kolom.appendChild(el('div', 'alasan-hitung', '(' + soal.u + ' × ' + soal.b + ') + ' + soal.a + ' = ' + (soal.u * soal.b) + ' + ' + soal.a + ' = <b>' + soal.n + '</b>'));
    kolom.appendChild(gambar(soal));
    let kata = 'Tiap roti utuh = <b>' + soal.b + '</b> potong, jadi ' + soal.u + ' utuh = ' + soal.u + ' × ' + soal.b + ' = <b>' + (soal.u * soal.b) + '</b> potong. Tambah ' + soal.a + ' potong = <b>' + soal.n + '</b>. Jadi ' + h(soal) + ' = ' + P.html([soal.n, soal.b]) + '.';
    if (jawaban.jenisSalah === 'lupaKali') kata += '<br>Kamu menulis ' + jawaban.isi + ' = ' + soal.u + ' + ' + soal.a + ': utuhnya <b>lupa dikali</b> ' + soal.b + '.';
    else if (jawaban.jenisSalah === 'lupaTambah') kata += '<br>Kamu menulis ' + jawaban.isi + ': pembilang ' + soal.a + ' <b>belum ditambahkan</b>.';
    else kata += '<br>Kamu menulis ' + jawaban.isi + '.';
    kolom.appendChild(el('div', 'kotak-teks', kata));
    wadah.appendChild(kolom);
  }

  root.GameTukarBentuk = Object.assign({
    id: 'tukar-bentuk',
    tingkat: ['penyebut ≤ 6, utuh ≤ 3', 'penyebut ≤ 8', 'penyebut ≤ 12, utuh ≤ 5'],
    ingat: 'Pecahan biasa → campuran: bagi! 11/4: 11 : 4 = 2 sisa 3 → 2 3/4. Campuran → biasa: (utuh × penyebut) + pembilang.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
