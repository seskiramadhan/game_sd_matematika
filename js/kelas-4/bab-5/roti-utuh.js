// Mini game 🥐 Roti Utuh (Kelas 4 Bab 5): pecahan campuran.
// Soal 1-3: gambar roti utuh + 1 roti terpotong -> "Berapa roti semuanya?" pilih pecahan campuran
//           (pengecoh: lupa menghitung yang utuh, pembilang/penyebut tertukar).
// Soal 4-5: "Susun 2 3/8 roti": tambah roti utuh, ketuk potongan roti terakhir, lalu Cek.
// Semua jawaban dihitung oleh kode. Cek logika: node tools/cek-bab5.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('../bab-4/pecahan.js') : root.Pecahan;
  const C = modul ? require('./campuran.js') : root.Campuran;
  const { senilai, pilih, kocok, acak } = P;
  const { nilai, PENYEBUT, MAKS_UTUH } = C;

  // ---------- Logika (tanpa DOM) ----------
  const MAKS_TOMBOL_UTUH = 6; // roti utuh paling banyak yang bisa ditambahkan anak

  function pilihan(u, a, b) {
    const kunci = { u, a, b };
    const daftar = [kunci];
    const tambah = (c) => {
      if (c.u < 0 || c.u > MAKS_UTUH[3] + 1 || c.a < 1 || c.b < 1) return false;
      if (daftar.some((d) => senilai(nilai(d), nilai(c)))) return false;
      daftar.push(c);
      return true;
    };
    tambah({ u: 0, a, b, salah: 'lupaUtuh' });  // tidak menghitung roti utuh
    tambah({ u, a: b, b: a, salah: 'tertukar' }); // pembilang & penyebut tertukar
    const lain = kocok([{ u: u + 1, a, b }, { u: u - 1, a, b }, { u, a: b - a, b }, { u, a: a + 1, b }, { u, a: a - 1, b }]
      .filter((c) => c.a < c.b && (c.u >= 1)));
    for (const c of lain) { if (daftar.length >= 4) break; tambah(c); }
    return { opsi: kocok(daftar), kunci };
  }

  function soalBaca(tingkat, pakai) {
    for (let coba = 0; coba < 300; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      if (b < 3) continue; // pembilang >= 2 supaya pengecoh "tertukar" berarti
      const u = acak(1, MAKS_UTUH[tingkat]);
      const a = acak(2, b - 1);
      const kode = u + ' ' + a + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      const { opsi, kunci } = pilihan(u, a, b);
      if (opsi.length < 4) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'baca', u, a, b, opsi, kunci, mulai: acak(0, b - 1), tingkat };
    }
    throw new Error('soalBaca gagal');
  }

  function soalSusun(tingkat, pakai) {
    for (let coba = 0; coba < 300; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const u = acak(1, MAKS_UTUH[tingkat]);
      const a = acak(1, b - 1);
      const kode = u + ' ' + a + '/' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'susun', u, a, b, tingkat };
    }
    throw new Error('soalSusun gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalSusun(tingkat, pakai), soalSusun(tingkat, pakai)];
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.u + ' ' + soal.a + '/' + soal.b]);
    return soal.jenis === 'baca' ? soalBaca(tingkat, pakai) : soalSusun(tingkat, pakai);
  }

  function periksaBaca(soal, c) {
    const benar = c.u === soal.u && c.a === soal.a && c.b === soal.b;
    let jenisSalah = null;
    if (!benar) {
      if (c.u === 0 && c.a === soal.a && c.b === soal.b) jenisSalah = 'lupaUtuh';
      else if (c.u === soal.u && c.a === soal.b && c.b === soal.a) jenisSalah = 'tertukar';
    }
    return { pilih: c, benar, jenisSalah };
  }
  // utuh: banyak roti utuh yang ditambahkan; potong: banyak potongan yang diwarnai di roti terakhir (dari b)
  function periksaSusun(soal, utuh, potong) {
    const benar = utuh * soal.b + potong === soal.u * soal.b + soal.a; // semua potong diwarnai = 1 roti utuh, tetap diterima
    return { utuh, potong, benar, utuhBeda: utuh !== soal.u, potongBeda: potong !== soal.a };
  }

  const logika = { MAKS_TOMBOL_UTUH, pilihan, soalBaca, soalSusun, buatRonde, soalMirip, periksaBaca, periksaSusun };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el } = P;
  const h = C.html;

  function ukuranGambar(n) { return n <= 3 ? 190 : n <= 4 ? 170 : 150; }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'baca') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Berapa roti <b class="merah">semuanya</b>?'));
      const n = soal.u + 1, U = ukuranGambar(n);
      const gambar = C.barisRoti(soal.u, soal.a, soal.b, { ukuranUtuh: U, mulai: soal.mulai });
      gambar.classList.add('roti-soal');
      if (n >= 5) gambar.classList.add('roti-dua-baris');
      wadah.appendChild(gambar);
      const opsi = el('div', 'pec-opsi empat');
      soal.opsi.forEach((c) => {
        const t = el('button', 'tombol tombol-pec', h(c));
        t.onclick = () => kirim(periksaBaca(soal, c));
        opsi.appendChild(t);
      });
      wadah.appendChild(opsi);
      return;
    }
    // susun
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Susun ' + h(soal, 'besar') + ' roti'));
    let utuh = 0;
    const dipilih = new Set();
    const baris = el('div', 'susun-baris');
    const kolomUtuh = el('div', 'susun-utuh');
    const kolomSisa = el('div', 'susun-sisa');
    baris.append(kolomUtuh, kolomSisa);
    const info = el('div', 'pec-hitung susun-info');
    const kurang = el('button', 'tombol', '− Roti utuh');
    const tambah = el('button', 'tombol tombol-roti', '+ Roti utuh');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const tombol = el('div', 'baris-tombol susun-tombol');
    tombol.append(kurang, tambah, cek);

    const gambar = () => {
      kolomUtuh.innerHTML = '';
      if (!utuh) kolomUtuh.appendChild(el('div', 'susun-kosong', 'Belum ada roti utuh'));
      for (let i = 0; i < utuh; i++) kolomUtuh.appendChild(C.roti(soal.b, soal.b, { ukuran: 104 }));
      kolomSisa.innerHTML = '';
      const svg = C.roti(soal.b, 0, { ukuran: 250, set: dipilih });
      svg.classList.add('bisa-ketuk');
      svg.addEventListener('click', (e) => {
        const g = e.target.closest('[data-i]');
        if (!g) return;
        const i = Number(g.getAttribute('data-i'));
        if (dipilih.has(i)) dipilih.delete(i); else dipilih.add(i);
        Suara.efek('pop');
        gambar();
      });
      kolomSisa.appendChild(svg);
      kolomSisa.appendChild(el('div', 'label-kecil', 'Ketuk potongan roti ini'));
      info.innerHTML = '<b>' + utuh + '</b> utuh + <b>' + dipilih.size + '</b> potong';
      kurang.disabled = utuh === 0;
      tambah.disabled = utuh >= MAKS_TOMBOL_UTUH;
    };
    kurang.onclick = () => { if (utuh > 0) { utuh--; Suara.efek('pop'); gambar(); } };
    tambah.onclick = () => { if (utuh < MAKS_TOMBOL_UTUH) { utuh++; Suara.efek('pop'); gambar(); } };
    cek.onclick = () => kirim(periksaSusun(soal, utuh, dipilih.size));
    wadah.appendChild(baris);
    wadah.appendChild(info);
    wadah.appendChild(tombol);
    gambar();
  }

  function pujian(soal, jawaban) {
    let s = soal.u + ' roti utuh + ' + P.html([soal.a, soal.b]) + ' = ' + h(soal);
    if (jawaban.potong === soal.b) s += '<br>(' + soal.b + ' potong = 1 roti utuh)';
    return { html: s };
  }

  function teksLangkah(soal) {
    return '1) Hitung roti <b>utuh</b> dulu: ada <b>' + soal.u + '</b> → bilangan bulat <b>' + soal.u + '</b>.<br>' +
      '2) Lalu potongannya: <b>' + soal.a + '</b> dari <b>' + soal.b + '</b> potong → ' + P.html([soal.a, soal.b]) + '.<br>' +
      'Jadi semuanya ' + h(soal) + '.';
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'alasan-kolom');
    if (soal.jenis === 'baca') {
      const U = soal.u >= 4 ? 70 : 84;
      kolom.appendChild(C.barisRoti(soal.u, soal.a, soal.b, {
        ukuranUtuh: U, ukuranSisa: 120, mulai: soal.mulai, nomor: true, plus: true,
        labelUtuh: (i) => 'utuh ke-' + (i + 1), labelSisa: soal.a + ' dari ' + soal.b + ' potong',
      }));
      let kata = teksLangkah(soal);
      if (jawaban.jenisSalah === 'lupaUtuh') kata += '<br>Kamu memilih ' + h(jawaban.pilih) + ': roti <b>utuh</b> belum dihitung.';
      else if (jawaban.jenisSalah === 'tertukar') kata += '<br>Kamu memilih ' + h(jawaban.pilih) + ': angka atas dan bawah <b>tertukar</b>.';
      kolom.appendChild(el('div', 'kotak-teks', kata));
      wadah.appendChild(kolom);
      return;
    }
    const baris = el('div', 'alasan-baris alasan-dua');
    const punyamu = el('div', 'alasan-gambar');
    const pu = Math.min(jawaban.utuh, MAKS_TOMBOL_UTUH);
    const kecil = (n) => (n >= 5 ? 46 : 58);
    if (pu || jawaban.potong) {
      punyamu.appendChild(C.barisRoti(pu, jawaban.potong, soal.b, { ukuranUtuh: kecil(pu), ukuranSisa: 84, plus: true, warnaSisa: '#FF8A3D' }));
    } else punyamu.appendChild(el('div', 'susun-kosong', 'kosong'));
    punyamu.appendChild(el('div', 'label-kecil', 'Punyamu:<br>' + pu + ' utuh + ' + jawaban.potong + ' potong'));
    const benar = el('div', 'alasan-gambar');
    benar.appendChild(C.barisRoti(soal.u, soal.a, soal.b, { ukuranUtuh: kecil(soal.u), ukuranSisa: 84, plus: true, warnaUtuh: '#2BB673', warnaSisa: '#2BB673' }));
    benar.appendChild(el('div', 'label-kecil', 'Yang benar:<br>' + soal.u + ' utuh + ' + soal.a + ' potong'));
    baris.append(punyamu, benar);
    const kolomAlasan = el('div', 'alasan-kolom');
    kolomAlasan.appendChild(baris);
    let kata = 'Bilangan <b>besar</b> = roti utuh: <b>' + soal.u + '</b>. Pecahan ' + P.html([soal.a, soal.b]) + ' = <b>' + soal.a + '</b> potong dari roti yang dipotong <b>' + soal.b + '</b>.';
    if (jawaban.utuhBeda) kata += '<br>Roti utuhmu ' + jawaban.utuh + ', seharusnya ' + soal.u + '.';
    if (jawaban.potongBeda) kata += '<br>Potonganmu ' + jawaban.potong + ', seharusnya ' + soal.a + '.';
    kolomAlasan.appendChild(el('div', 'kotak-teks', kata));
    wadah.appendChild(kolomAlasan);
  }

  root.GameRotiUtuh = Object.assign({
    id: 'roti-utuh',
    tingkat: ['penyebut ≤ 6, utuh ≤ 3', 'penyebut ≤ 8', 'penyebut ≤ 12, utuh ≤ 5'],
    ingat: 'Hitung roti utuh dulu: itu bilangan besarnya. Lalu potongannya jadi pecahan di sebelahnya, mis. 2 roti utuh + 3/8 = 2 3/8.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
