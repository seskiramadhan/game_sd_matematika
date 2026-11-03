// Mini game 🍕 Potong Pizza (Kelas 4 Bab 4): pembilang & penyebut.
// Soal 1-3: pizza/kue dipotong b, a potong diwarnai -> pilih pecahannya (pengecoh: terbalik, sisa bagian).
// Soal 4-5: "Warnai a/b pizza": ketuk potongan sampai pas, lalu Cek.
// Semua jawaban dihitung oleh kode. Cek logika: node tools/cek-bab4.js
(function (root) {
  const P = (typeof module !== 'undefined' && module.exports) ? require('./pecahan.js') : root.Pecahan;
  const { senilai, pilih, kocok, acak } = P;

  // ---------- Logika (tanpa DOM) ----------
  const MAKS = { 1: 8, 2: 12, 3: 24 };
  // penyebut per tingkat (6, 7, 8, 12 diulang supaya lebih sering). > 12 digambar sebagai kue persegi panjang.
  const PENYEBUT = {
    1: [3, 4, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    2: [4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 10, 12, 12, 12],
    3: [6, 7, 8, 8, 9, 10, 12, 12, 12, 14, 15, 16, 16, 18, 20, 24, 24],
  };

  function pilihan(a, b) {
    const benar = [a, b];
    const daftar = [benar];
    const tambah = (p) => {
      if (p[0] < 1 || p[1] < 2 || p[0] > MAKS[3] || (p[0] > b && p[1] !== a)) return false;
      if (daftar.some((q) => senilai(p, q))) return false;
      daftar.push(p);
      return true;
    };
    daftar.push([b, a]);  // terbalik (selalu ada; boleh berpenyebut 1)
    tambah([b - a, b]);   // sisa bagian (yang tidak diwarnai)
    const lain = kocok([[a, b - a], [a + 1, b], [a - 1, b], [b - a, a], [a + 2, b]]);
    for (const p of lain) { if (daftar.length >= 4) break; tambah(p); }
    return { opsi: kocok(daftar), kunci: benar };
  }

  function soalBaca(tingkat, pakai) {
    for (let coba = 0; coba < 200; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const a = acak(1, b - 1);
      if (2 * a === b) continue; // sisa = yang diwarnai, pengecoh tidak berguna
      if (pakai && pakai.has(a + '/' + b)) continue;
      if (pakai) pakai.add(a + '/' + b);
      const { opsi, kunci } = pilihan(a, b);
      if (opsi.length < 4) continue;
      return { jenis: 'baca', a, b, opsi, kunci, mulai: b <= 12 ? acak(0, b - 1) : 0, tingkat };
    }
    throw new Error('soalBaca gagal');
  }

  function soalWarnai(tingkat, pakai) {
    for (let coba = 0; coba < 200; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const a = acak(1, b - 1);
      if (pakai && pakai.has(a + '/' + b)) continue;
      if (pakai) pakai.add(a + '/' + b);
      return { jenis: 'warnai', a, b, tingkat };
    }
    throw new Error('soalWarnai gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalBaca(tingkat, pakai), soalWarnai(tingkat, pakai), soalWarnai(tingkat, pakai)];
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.a + '/' + soal.b]);
    return soal.jenis === 'baca' ? soalBaca(tingkat, pakai) : soalWarnai(tingkat, pakai);
  }

  function periksaBaca(soal, p) {
    let jenisSalah = null;
    if (p[0] === soal.b && p[1] === soal.a) jenisSalah = 'terbalik';
    else if (p[0] === soal.b - soal.a && p[1] === soal.b) jenisSalah = 'sisa';
    return { pilih: p, benar: p[0] === soal.a && p[1] === soal.b, jenisSalah };
  }
  function periksaWarnai(soal, dipilih) {
    const set = new Set(dipilih);
    return { dipilih: [...set], banyak: set.size, benar: set.size === soal.a };
  }

  const logika = { MAKS, PENYEBUT, pilihan, soalBaca, soalWarnai, buatRonde, soalMirip, periksaBaca, periksaWarnai };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, html, potongan } = P;
  const benda = (b) => (b <= 12 ? 'pizza' : 'kue');
  // potongan yang diwarnai: berurutan mulai dari 'mulai'
  const setWarna = (soal) => { const s = new Set(); for (let i = 0; i < soal.a; i++) s.add((soal.mulai + i) % soal.b); return s; };

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'baca') {
      wadah.appendChild(el('div', 'soal-teks', 'Berapa bagian ' + benda(soal.b) + ' yang <b class="merah">diwarnai</b>?'));
      const baris = el('div', 'pec-baris');
      const kiri = el('div', 'pec-gambar');
      kiri.appendChild(potongan(soal.b, setWarna(soal), { ukuran: soal.b <= 12 ? 290 : 330 }));
      const opsi = el('div', 'pec-opsi');
      soal.opsi.forEach((p) => {
        const t = el('button', 'tombol tombol-pec', html(p));
        t.onclick = () => kirim(periksaBaca(soal, p));
        opsi.appendChild(t);
      });
      baris.append(kiri, opsi);
      wadah.appendChild(baris);
      return;
    }
    wadah.appendChild(el('div', 'soal-teks', 'Warnai ' + html([soal.a, soal.b], 'pec-besar') + ' ' + benda(soal.b)));
    const baris = el('div', 'pec-baris');
    const dipilih = new Set();
    const kiri = el('div', 'pec-gambar');
    const gambar = () => {
      kiri.innerHTML = '';
      const svg = potongan(soal.b, dipilih, { ukuran: soal.b <= 12 ? 340 : 380 });
      svg.classList.add('bisa-ketuk');
      svg.addEventListener('click', (e) => {
        const g = e.target.closest('[data-i]');
        if (!g) return;
        const i = Number(g.getAttribute('data-i'));
        if (dipilih.has(i)) dipilih.delete(i); else dipilih.add(i);
        Suara.efek('pop');
        gambar();
      });
      kiri.appendChild(svg);
      hitung.innerHTML = 'Diwarnai:<br><b>' + dipilih.size + '</b> potong';
    };
    const kanan = el('div', 'pec-kanan');
    const hitung = el('div', 'pec-hitung');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    cek.onclick = () => kirim(periksaWarnai(soal, [...dipilih]));
    kanan.append(hitung, cek);
    baris.append(kiri, kanan);
    wadah.appendChild(baris);
    wadah.appendChild(el('div', 'ingat-kecil', 'Ketuk potongan untuk mewarnai. Ketuk lagi untuk menghapus.'));
    gambar();
  }

  function teksAturan(a, b) {
    return 'Angka <b>atas</b> (pembilang) = yang diwarnai: <b>' + a + '</b> potong. Angka <b>bawah</b> (penyebut) = semua potongan: <b>' + b + '</b>.';
  }

  function pujian(soal) {
    return { html: benda(soal.b)[0].toUpperCase() + benda(soal.b).slice(1) + ' dipotong ' + soal.b + ', ' + soal.a + ' diwarnai: ' + html([soal.a, soal.b]) };
  }

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    if (soal.jenis === 'baca') {
      baris.appendChild(potongan(soal.b, setWarna(soal), { ukuran: 190, nomor: true, mulai: soal.mulai }));
      const kanan = el('div', 'kotak-teks');
      let kata = 'Hitung satu-satu. ' + teksAturan(soal.a, soal.b) + '<br>Jadi ' + html([soal.a, soal.b]) + '.';
      if (jawaban.jenisSalah === 'terbalik') kata += '<br>Kamu memilih ' + html(jawaban.pilih) + ': atas dan bawah <b>tertukar</b>.';
      else if (jawaban.jenisSalah === 'sisa') kata += '<br>Kamu memilih ' + html(jawaban.pilih) + ': itu bagian yang <b>tidak</b> diwarnai.';
      kanan.innerHTML = kata;
      baris.appendChild(kanan);
      wadah.appendChild(baris);
      return;
    }
    const punyamu = el('div', 'alasan-gambar');
    punyamu.appendChild(potongan(soal.b, new Set(jawaban.dipilih), { ukuran: 170, nomor: true }));
    punyamu.appendChild(el('div', 'label-kecil', 'Punyamu: ' + jawaban.banyak + ' potong'));
    const benar = el('div', 'alasan-gambar');
    const s = new Set(); for (let i = 0; i < soal.a; i++) s.add(i);
    benar.appendChild(potongan(soal.b, s, { ukuran: 170, nomor: true, warna: '#2BB673' }));
    benar.appendChild(el('div', 'label-kecil', 'Yang benar: ' + soal.a + ' potong'));
    const kata = el('div', 'kotak-teks', html([soal.a, soal.b]) + ': ' + teksAturan(soal.a, soal.b) +
      '<br>Kamu mewarnai ' + jawaban.banyak + ' potong, ' + (jawaban.banyak > soal.a ? 'kelebihan ' + (jawaban.banyak - soal.a) : 'kurang ' + (soal.a - jawaban.banyak)) + '.');
    baris.append(punyamu, benar, kata);
    wadah.appendChild(baris);
  }

  root.GamePotongPizza = Object.assign({
    id: 'potong-pizza',
    tingkat: ['penyebut ≤ 8', 'penyebut ≤ 12', 'penyebut ≤ 24'],
    ingat: 'Angka bawah (penyebut) = banyak potongan semuanya. Angka atas (pembilang) = potongan yang diwarnai. Makin banyak potongan, makin kecil tiap potong.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
