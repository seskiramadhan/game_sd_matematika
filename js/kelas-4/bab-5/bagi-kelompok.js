// Mini game 🍓 Bagi Kelompok (Kelas 4 Bab 5): pecahan dari kelompok (bagi dulu, lalu kali).
// Soal 1-3: "3/4 dari 20 stroberi = ?" -> pilih jawaban (pengecoh wajib: hanya dibagi / dikali tanpa dibagi).
// Soal 4-5: ketuk tumpukan stroberi untuk membagi rata ke b kelompok, lalu ketuk kelompok yang diambil.
// Semua jawaban dihitung oleh kode. Cek logika: node tools/cek-bab5.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('../bab-4/pecahan.js') : root.Pecahan;
  const C = modul ? require('./campuran.js') : root.Campuran;
  const { pilih, kocok, acak } = P; // P.fpb dipakai untuk pecahan paling sederhana

  // ---------- Logika (tanpa DOM) ----------
  const MAKS_JUMLAH = { 1: 24, 2: 48, 3: 96 };
  // penyebut = banyak kelompok (6, 7, 8, 12 diulang supaya lebih sering). Minimal 3 supaya pembilang >= 2.
  const PENYEBUT = {
    1: [3, 3, 4, 4, 5, 6, 6, 6, 8, 8],
    2: [3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 12, 12],
    3: [4, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 10, 12, 12, 12],
  };
  // isi tiap kelompok untuk soal membagi (supaya piring tetap terbaca & ketukan tidak terlalu banyak)
  const MAKS_ISI_BAGIKAN = { 1: 6, 2: 8, 3: 10 };

  function pilihan(a, b, N) {
    const k = N / b, jawab = a * k;
    const daftar = [jawab];
    const tambah = (x) => { if (!Number.isInteger(x) || x < 1 || daftar.includes(x)) return false; daftar.push(x); return true; };
    tambah(k);       // hanya dibagi (lupa dikali pembilang)
    tambah(a * N);   // dikali pembilang tanpa dibagi
    const lain = kocok([N - jawab, (a + 1) * k, (a - 1) * k, jawab + k, N]);
    for (const x of lain) { if (daftar.length >= 4) break; tambah(x); }
    return kocok(daftar);
  }

  function dasar(tingkat, maksIsi, pakai) {
    for (let coba = 0; coba < 400; coba++) {
      const b = pilih(PENYEBUT[tingkat]);
      const kMaks = Math.min(Math.floor(MAKS_JUMLAH[tingkat] / b), maksIsi || 99);
      if (kMaks < 2) continue;
      const k = acak(2, kMaks);
      const a = acak(2, b - 1);
      if (P.fpb(a, b) !== 1) continue; // pecahan paling sederhana (2/4 ditulis 1/2)
      const N = b * k;
      const kode = a + '/' + b + ' dari ' + N;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { a, b, N, k, jawab: a * k };
    }
    throw new Error('soal bagi kelompok gagal');
  }

  function soalPilih(tingkat, pakai) {
    for (let coba = 0; coba < 50; coba++) {
      const s = dasar(tingkat, 0, pakai);
      const opsi = pilihan(s.a, s.b, s.N);
      if (opsi.length < 4) continue;
      return Object.assign({ jenis: 'pilih', opsi, tingkat }, s);
    }
    throw new Error('soalPilih gagal');
  }
  function soalBagikan(tingkat, pakai) {
    return Object.assign({ jenis: 'bagikan', tingkat }, dasar(tingkat, MAKS_ISI_BAGIKAN[tingkat], pakai));
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalPilih(tingkat, pakai), soalPilih(tingkat, pakai), soalPilih(tingkat, pakai), soalBagikan(tingkat, pakai), soalBagikan(tingkat, pakai)];
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.a + '/' + soal.b + ' dari ' + soal.N]);
    return soal.jenis === 'pilih' ? soalPilih(tingkat, pakai) : soalBagikan(tingkat, pakai);
  }

  function periksaPilih(soal, x) {
    const benar = x === soal.jawab;
    let jenisSalah = null;
    if (!benar) {
      if (x === soal.k) jenisSalah = 'hanyaBagi';
      else if (x === soal.a * soal.N) jenisSalah = 'kaliSaja';
      else if (x === soal.N - soal.jawab) jenisSalah = 'sisa';
    }
    return { pilih: x, benar, jenisSalah };
  }
  // diambil: banyak kelompok yang diketuk
  function periksaBagikan(soal, diambil) {
    const benar = diambil === soal.a;
    let jenisSalah = null;
    if (!benar) jenisSalah = diambil === 1 ? 'hanyaBagi' : diambil === soal.b - soal.a ? 'sisa' : null;
    return { diambil, benar, jenisSalah };
  }

  const logika = { MAKS_JUMLAH, PENYEBUT, MAKS_ISI_BAGIKAN, pilihan, soalPilih, soalBagikan, buatRonde, soalMirip, periksaPilih, periksaBagikan };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el } = P;
  const ang = C.angka;
  const stroberi = (n) => '<span class="buah">🍓</span>'.repeat(n);

  // isi piring: stroberi satu-satu (<= 12) atau ringkas "🍓 × n"
  function isiPiring(n) {
    return n <= 12 ? '<div class="buah-isi">' + stroberi(n) + '</div>' : '<div class="buah-ringkas">🍓 × ' + n + '</div>';
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'pilih') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Berapa stroberi?'));
      wadah.appendChild(el('div', 'tukar-soal kelompok-soal', P.html([soal.a, soal.b]) + '<span class="kata">dari</span>' + ang(soal.N) + '<span class="buah besar">🍓</span><span class="sama">=</span><span class="tanya">?</span>'));
      const opsi = el('div', 'pec-opsi empat');
      soal.opsi.forEach((x) => {
        const t = el('button', 'tombol tombol-pec', ang(x));
        t.onclick = () => kirim(periksaPilih(soal, x));
        opsi.appendChild(t);
      });
      wadah.appendChild(opsi);
      wadah.appendChild(el('div', 'ingat-kecil', 'Bagi dulu jadi ' + soal.b + ' kelompok, lalu ambil ' + soal.a + ' kelompok.'));
      return;
    }
    // bagikan
    const judul = el('div', 'soal-teks soal-sedang', P.html([soal.a, soal.b], 'pec-besar') + ' dari ' + soal.N + ' stroberi');
    wadah.appendChild(judul);
    let putaran = 0;
    const diambil = new Set();
    const baris = el('div', 'bagi-baris');
    const tumpukan = el('button', 'tumpukan');
    const kolomPiring = el('div', 'piring-grid');
    kolomPiring.style.gridTemplateColumns = 'repeat(' + (soal.b <= 4 ? soal.b : Math.ceil(soal.b / 2)) + ', auto)';
    baris.append(tumpukan, kolomPiring);
    const info = el('div', 'pec-hitung bagi-info');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const tombol = el('div', 'baris-tombol bagi-tombol');
    tombol.append(cek);

    const gambar = () => {
      const sisa = soal.N - putaran * soal.b;
      tumpukan.innerHTML = sisa ? '<span class="buah besar">🍓</span><b>' + sisa + '</b><small>Ketuk untuk membagi</small>' : '<b>Habis!</b><small>tiap kelompok ' + soal.k + '</small>';
      tumpukan.classList.toggle('habis', !sisa);
      kolomPiring.innerHTML = '';
      for (let i = 0; i < soal.b; i++) {
        const p = el('button', 'kelompok' + (diambil.has(i) ? ' diambil' : '') + (sisa ? '' : ' siap'), isiPiring(putaran));
        p.onclick = () => {
          if (sisa) { Suara.efek('boing'); App.toast('Bagi dulu sampai habis ya.'); return; }
          if (diambil.has(i)) diambil.delete(i); else diambil.add(i);
          Suara.efek('pop');
          gambar();
        };
        kolomPiring.appendChild(p);
      }
      if (sisa) info.innerHTML = 'Bagi rata ke <b>' + soal.b + '</b> kelompok';
      else info.innerHTML = 'Ambil ' + P.html([soal.a, soal.b]) + ': diambil <b>' + diambil.size + '</b> kelompok = <b>' + diambil.size * soal.k + '</b> stroberi';
      cek.disabled = !!sisa || diambil.size === 0;
    };
    tumpukan.onclick = () => {
      if (putaran * soal.b >= soal.N) return;
      putaran++;
      Suara.efek('pop');
      gambar();
    };
    cek.onclick = () => kirim(periksaBagikan(soal, diambil.size));
    wadah.appendChild(baris);
    wadah.appendChild(info);
    wadah.appendChild(tombol);
    gambar();
  }

  function pujian(soal) {
    return { html: soal.N + ' : ' + soal.b + ' = ' + soal.k + ', lalu ' + soal.a + ' × ' + soal.k + ' = ' + soal.jawab + ' → ' + P.html([soal.a, soal.b]) + ' dari ' + soal.N + ' = ' + soal.jawab };
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'alasan-kolom');
    kolom.appendChild(el('div', 'alasan-hitung', '1) ' + soal.N + ' : ' + soal.b + ' = <b>' + soal.k + '</b> &nbsp; 2) ' + soal.a + ' × ' + soal.k + ' = <b>' + soal.jawab + '</b>'));
    const grid = el('div', 'piring-alasan');
    for (let i = 0; i < soal.b; i++) {
      const p = el('div', 'kelompok kecil' + (i < soal.a ? ' diambil' : ''), isiPiring(soal.k));
      grid.appendChild(p);
    }
    kolom.appendChild(grid);
    let kata = 'Bagi dulu: ' + soal.N + ' stroberi dibagi rata ke <b>' + soal.b + '</b> kelompok (penyebut) → tiap kelompok <b>' + soal.k + '</b>. ' +
      'Lalu ambil <b>' + soal.a + '</b> kelompok (pembilang): ' + soal.a + ' × ' + soal.k + ' = <b>' + soal.jawab + '</b>.';
    if (jawaban.jenisSalah === 'hanyaBagi') kata += '<br>Kamu ' + (soal.jenis === 'pilih' ? 'memilih ' + soal.k : 'mengambil 1 kelompok') + ': baru <b>dibagi</b>, belum dikali ' + soal.a + '.';
    else if (jawaban.jenisSalah === 'kaliSaja') kata += '<br>Kamu memilih ' + ang(jawaban.pilih) + ' = ' + soal.a + ' × ' + soal.N + ': dikali tanpa <b>dibagi</b> dulu.';
    else if (jawaban.jenisSalah === 'sisa') kata += '<br>Kamu ' + (soal.jenis === 'pilih' ? 'memilih ' + jawaban.pilih : 'mengambil ' + jawaban.diambil + ' kelompok') + ': itu yang <b>tidak</b> diambil.';
    else if (soal.jenis === 'bagikan') kata += '<br>Kamu mengambil ' + jawaban.diambil + ' kelompok, seharusnya ' + soal.a + '.';
    kolom.appendChild(el('div', 'kotak-teks', kata));
    wadah.appendChild(kolom);
  }

  root.GameBagiKelompok = Object.assign({
    id: 'bagi-kelompok',
    tingkat: ['jumlah ≤ 24', 'jumlah ≤ 48', 'jumlah ≤ 96'],
    ingat: 'Pecahan dari kelompok: bagi dulu, lalu kali. 3/4 dari 20: 20 : 4 = 5, lalu 3 × 5 = 15.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
