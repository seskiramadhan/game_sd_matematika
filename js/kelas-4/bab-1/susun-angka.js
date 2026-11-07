// Mini game 🧱 Susun Angka (Kelas 4 Bab 1): nilai tempat, membaca & menulis bilangan.
// Soal 1-3 (urutan diacak): blok nilai tempat -> pilih bilangannya · "Angka 2 pada 62.408 bernilai?" · tulisan -> pilih angka.
// Soal 4-5: susun sendiri: ketuk + / - tiap tempat sampai = bilangan (ada angka 0 di tengah, mis. 30.015).
// Tingkat 1: <= 9.999 · 2: <= 99.999 (nol di tengah) · 3: <= 100.000 (nol di tengah, banyak).
// Semua jawaban dihitung kode. Cek logika: node tools/cek-bab1.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bilangan.js') : root.Bilangan;
  const { fmt, kata, TEMPAT, digitDi, pengecohAngka, acak, pilih, kocok } = B;

  // ---------- Logika (tanpa DOM) ----------
  const BATAS = { 1: 9999, 2: 99999, 3: 100000 };
  const KOLOM = { 1: 4, 2: 5, 3: 5 };
  const nolTengah = (n) => String(n).slice(1, -1).split('').filter((c) => c === '0').length;

  // bilangan acak sesuai tingkat; tengah = jumlah minimal angka 0 di tengah (bukan angka pertama)
  function angkaAcak(tingkat, tengah) {
    const k = KOLOM[tingkat];
    for (let c = 0; c < 2000; c++) {
      let s = String(acak(1, 9));
      for (let i = 1; i < k; i++) s += String(acak(0, 9));
      const n = Number(s);
      if (nolTengah(n) < tengah) continue;
      if (tingkat === 3 && nolTengah(n) === 0 && Math.random() < 0.7) continue;
      if (n % 1000 === 0 && Math.random() < 0.8) continue;
      return n;
    }
    throw new Error('angkaAcak gagal');
  }
  const tengahMin = (tingkat) => (tingkat === 1 ? (Math.random() < 0.6 ? 1 : 0) : tingkat === 2 ? (Math.random() < 0.8 ? 1 : 0) : (Math.random() < 0.5 ? 2 : 1));

  function soalBlok(tingkat, pakai) {
    for (let c = 0; c < 500; c++) {
      const n = angkaAcak(tingkat, tengahMin(tingkat)), kode = 'b' + n;
      if (pakai && pakai.has(kode)) continue;
      const salah = pengecohAngka(n, BATAS[tingkat]);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      const hitung = {}; for (let k = 0; k < KOLOM[tingkat]; k++) hitung[k] = digitDi(n, k);
      return { jenis: 'blok', tingkat, n, hitung, kolom: KOLOM[tingkat], kunci: n, opsi: kocok([n].concat(salah)), kode };
    }
    throw new Error('soalBlok gagal');
  }

  function soalNilai(tingkat, pakai) {
    for (let c = 0; c < 800; c++) {
      const n = angkaAcak(tingkat, tingkat === 1 ? 0 : 1), kol = KOLOM[tingkat];
      const digit = String(n).split('').map(Number);
      // pilih tempat dengan angka bukan 0 yang hanya muncul sekali di bilangan ini
      const kandidat = [];
      for (let k = 0; k < kol; k++) { const d = digitDi(n, k); if (d > 0 && digit.filter((x) => x === d).length === 1) kandidat.push(k); }
      if (!kandidat.length) continue;
      const k = pilih(kandidat), d = digitDi(n, k), kode = 'n' + n + '@' + k;
      if (pakai && pakai.has(kode)) continue;
      // pengecoh: angka yang sama di tempat lain (2, 20.000, 200 ...); utamakan satuan & tempat tetangga
      const lain = [];
      for (let j = 0; j < kol; j++) if (j !== k) lain.push(j);
      const pri = kocok(lain.filter((j) => j === 0 || j === k + 1 || j === k - 1));
      const sisa = kocok(lain.filter((j) => !pri.includes(j)));
      const pilihJ = pri.concat(sisa).slice(0, 3);
      if (pilihJ.length < 3) continue;
      if (pakai) pakai.add(kode);
      const kunci = d * TEMPAT[k].n;
      return { jenis: 'nilai', tingkat, n, digit: d, tempat: k, kunci, opsi: kocok([kunci].concat(pilihJ.map((j) => d * TEMPAT[j].n))), kode };
    }
    throw new Error('soalNilai gagal');
  }

  function soalKata(tingkat, pakai) {
    for (let c = 0; c < 500; c++) {
      let n = angkaAcak(tingkat, tengahMin(tingkat));
      if (tingkat === 3 && Math.random() < 0.1) n = 100000;
      const kode = 'k' + n;
      if (pakai && pakai.has(kode)) continue;
      // pengecoh khas "bagian ribuan + sisa": 30.015 -> 30.150 (sisa digeser), 3.015 / 30.105
      const rb = Math.floor(n / 1000), r = n % 1000, ekstra = [];
      if (r > 0 && r < 100) ekstra.push(rb * 1000 + r * 10, rb * 100 + r);
      const salah = pengecohAngka(n, BATAS[tingkat], ekstra);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'kata', tingkat, n, kata: kata(n), kunci: n, opsi: kocok([n].concat(salah)), kode };
    }
    throw new Error('soalKata gagal');
  }

  function soalSusun(tingkat, pakai, tampil) {
    for (let c = 0; c < 500; c++) {
      const n = angkaAcak(tingkat, tingkat === 1 ? 1 : tingkat === 2 ? 1 : 2), kode = 's' + n;
      if (nolTengah(n) < 1) continue;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'susun', tingkat, n, kolom: KOLOM[tingkat], tampil: tampil || (Math.random() < 0.5 ? 'kata' : 'angka'), kata: kata(n), kunci: n, kode };
    }
    throw new Error('soalSusun gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    const tiga = kocok([soalBlok, soalNilai, soalKata]).map((f) => f(tingkat, pakai));
    return tiga.concat([soalSusun(tingkat, pakai, 'kata'), soalSusun(tingkat, pakai, 'angka')]);
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'blok') return soalBlok(tingkat, pakai);
    if (soal.jenis === 'nilai') return soalNilai(tingkat, pakai);
    if (soal.jenis === 'kata') return soalKata(tingkat, pakai);
    return soalSusun(tingkat, pakai, soal.tampil);
  }

  // jumlah yang disusun: hitung = array jumlah per tempat (indeks 0 = satuan)
  const jumlahSusun = (hitung) => hitung.reduce((t, c, k) => t + c * TEMPAT[k].n, 0);
  const periksaPilih = (soal, pilihan) => ({ pilihan, benar: pilihan === soal.kunci });
  const periksaSusun = (soal, hitung) => ({ hitung, total: jumlahSusun(hitung), benar: jumlahSusun(hitung) === soal.n });

  const logika = { BATAS, KOLOM, soalBlok, soalNilai, soalKata, soalSusun, buatRonde, soalMirip, periksaPilih, periksaSusun, jumlahSusun, nolTengah };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tabelTempat, blokTempat, NAMA_PENDEK, WARNA_TEMPAT } = B;

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'susun') return tampilSusun(soal, wadah, kirim);
    if (soal.jenis === 'blok') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Blok ini mewakili bilangan berapa?'));
      wadah.appendChild(el('div', 'bil-gambar')).appendChild(blokTempat(soal.hitung, soal.kolom));
    } else if (soal.jenis === 'nilai') {
      wadah.appendChild(el('div', 'soal-teks', 'Angka <b class="merah">' + soal.digit + '</b> pada bilangan'));
      const baris = el('div', 'bil-besar');
      String(soal.n).split('').forEach((ch, i, arr) => {
        const pos = arr.length - 1 - i;
        baris.appendChild(el('span', 'bil-ch' + (pos === soal.tempat ? ' tanda' : ''), ch));
        if (pos > 0 && pos % 3 === 0) baris.appendChild(el('span', 'bil-titik', '.'));
      });
      wadah.appendChild(baris);
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'bernilai berapa?'));
    } else {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Tulis dengan angka:'));
      wadah.appendChild(el('div', 'bil-kata', soal.kata));
    }
    const baris = el('div', 'bil-opsi');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-bil', fmt(o));
      b.onclick = () => kirim(periksaPilih(soal, o));
      baris.appendChild(b);
    });
    wadah.appendChild(baris);
  }

  function tampilSusun(soal, wadah, kirim) {
    const kol = soal.kolom, hitung = new Array(kol).fill(0);
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Susun bilangan ini dengan blok:'));
    wadah.appendChild(el('div', soal.tampil === 'kata' ? 'bil-kata' : 'bil-kata bil-kata-angka', soal.tampil === 'kata' ? soal.kata : fmt(soal.n)));
    const papan = el('div', 'susun-papan');
    const total = el('div', 'susun-total');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const kolomEl = [];
    const gambar = () => {
      kolomEl.forEach((k, i) => {
        const tempat = kol - 1 - i, h = hitung[tempat];
        k.angka.textContent = h;
        k.tiles.innerHTML = '';
        for (let t = 0; t < h; t++) k.tiles.appendChild(el('span', 'susun-tile'));
        k.tambah.disabled = h >= 9; k.kurang.disabled = h <= 0;
        k.box.classList.toggle('kosong', h === 0);
      });
      total.innerHTML = 'Bilangan yang kamu susun: <b>' + fmt(jumlahSusun(hitung)) + '</b>';
      cek.disabled = jumlahSusun(hitung) === 0;
    };
    for (let i = 0; i < kol; i++) {
      const tempat = kol - 1 - i;
      const box = el('div', 'susun-kolom');
      box.style.setProperty('--wt', WARNA_TEMPAT[tempat]);
      const kepala = el('div', 'susun-kepala', '<b>' + fmt(TEMPAT[tempat].n) + '</b><small>' + TEMPAT[tempat].nama + '</small>');
      const tambah = el('button', 'tombol susun-tambah', '+');
      const angka = el('div', 'susun-angka', '0');
      const tiles = el('div', 'susun-tiles');
      const kurang = el('button', 'tombol susun-kurang', '−');
      tambah.onclick = () => { if (hitung[tempat] < 9) { hitung[tempat]++; Suara.efek('pop'); gambar(); } };
      kurang.onclick = () => { if (hitung[tempat] > 0) { hitung[tempat]--; Suara.efek('pop'); gambar(); } };
      box.append(kepala, tambah, angka, tiles, kurang);
      papan.appendChild(box);
      kolomEl.push({ box, tambah, kurang, angka, tiles });
    }
    cek.onclick = () => kirim(periksaSusun(soal, hitung.slice()));
    wadah.append(papan, total, cek);
    gambar();
  }

  // baris "30.000 + 0 + 0 + 10 + 5" untuk bilangan n dengan kol kolom
  function jumlahTeks(n, kol) {
    const bag = [];
    for (let k = kol - 1; k >= 0; k--) bag.push(fmt(digitDi(n, k) * TEMPAT[k].n));
    return bag.join(' + ');
  }

  function pujian(soal) {
    return { html: fmt(soal.n) + ' = ' + kata(soal.n) };
  }

  function alasan(soal, jawaban, wadah) {
    const kol = soal.kolom || KOLOM[soal.tingkat], n = soal.n;
    const k = el('div', 'des-alasan');
    let teks = '';
    let sorot;
    if (soal.jenis === 'blok') {
      teks = 'Hitung tiap tempat, lalu jumlahkan:<br><b>' + jumlahTeks(n, kol) + ' = ' + fmt(n) + '</b>';
      if (nolTengah(n) > 0) teks += '<br><small>Tempat yang kosong tetap ditulis <b>0</b>: ' + fmt(n) + ', bukan ' + fmt(Number(String(n).replace(/(?!^)0/, ''))) + '.</small>';
    } else if (soal.jenis === 'nilai') {
      sorot = kol - 1 - soal.tempat;
      teks = 'Angka <b>' + soal.digit + '</b> ada di tempat <b>' + TEMPAT[soal.tempat].nama + '</b>.<br>Nilainya <b>' + soal.digit + ' × ' + fmt(TEMPAT[soal.tempat].n) + ' = ' + fmt(soal.kunci) + '</b>.';
    } else if (soal.jenis === 'kata') {
      const rb = Math.floor(n / 1000) * 1000, r = n % 1000;
      teks = '<b>' + (rb ? kata(rb) + '</b> = ' + fmt(rb) : '') + (r ? (rb ? ',  <b>' : '<b>') + kata(r) + '</b> = ' + fmt(r) : '') + '<br>Jadi <b>' + fmt(n) + '</b>.';
      if (nolTengah(n) > 0) teks += '<br><small>Tempat yang tidak disebut diisi <b>0</b>.</small>';
    } else {
      teks = 'Kamu menyusun <b>' + fmt(jawaban.total) + '</b>. Yang diminta <b>' + fmt(n) + '</b>:<br><b>' + jumlahTeks(n, kol) + '</b><br><small>Tempat yang kosong tidak diberi blok (0).</small>';
    }
    k.appendChild(el('div', 'kotak-teks', teks));
    const tab = el('div', 'tabel-wadah', tabelTempat([n], { kolom: kol, sorotKolom: sorot }));
    k.appendChild(tab);
    wadah.appendChild(k);
  }

  root.GameSusunAngka = Object.assign({
    id: 'susun-angka',
    tingkat: ['sampai 9.999', 'sampai 99.999 (ada nol di tengah)', 'sampai 100.000'],
    ingat: 'Setiap angka punya nilai sesuai tempatnya. Tempat yang kosong tetap ditulis 0: tiga puluh ribu lima belas = 30.015.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
