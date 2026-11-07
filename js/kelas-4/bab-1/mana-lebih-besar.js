// Mini game 🏔️ Mana Lebih Besar (Kelas 4 Bab 1): membandingkan & mengurutkan bilangan cacah.
// Soal 1-3: "38.540 ☐ 38.504" -> ketuk <, =, atau >.  Soal 4-5: urutkan 4 bilangan (terkecil dulu / terbesar dulu).
// Tingkat 1: 4 angka · 2: 5 angka beda di ribuan (+ bentuk panjang & beda jumlah angka) · 3: 5 angka beda di puluhan/satuan.
// Jebakan yang dilatih: nol di tengah (3.015 < 3.105), bandingkan dari KIRI (38.540 > 38.504), bentuk panjang (30.000 + 50 + 4 = 30.054, bukan 30.504).
// Semua jawaban dihitung kode. Cek logika: node tools/cek-bab1.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bilangan.js') : root.Bilangan;
  const { fmt, TEMPAT, acak, pilih, kocok } = B;

  // ---------- Logika (tanpa DOM) ----------
  const BATAS = { 1: 9999, 2: 99999, 3: 100000 };
  const tanda = (a, b) => Math.sign(a - b); // -1: a < b, 0: sama, 1: a > b
  const SIMBOL = { '-1': '<', '0': '=', '1': '>' };

  // dua bilangan k angka yang angka pertama berbedanya di kolom 'kb' (0 = paling kiri)
  function pasangBeda(k, kb) {
    const awal = [acak(1, 9)];
    for (let i = 1; i < k; i++) awal.push(acak(0, 9));
    const a = awal.slice(), b = awal.slice();
    do { b[kb] = kb === 0 ? acak(1, 9) : acak(0, 9); } while (b[kb] === a[kb]);
    for (let i = kb + 1; i < k; i++) b[i] = acak(0, 9);
    return [Number(a.join('')), Number(b.join(''))];
  }
  const adaNol = (n) => /0/.test(String(n).slice(1));
  const kolomBeda = (a, b) => {
    const kol = Math.max(String(a).length, String(b).length), x = String(a).padStart(kol, ' '), y = String(b).padStart(kol, ' ');
    for (let c = 0; c < kol; c++) if (x[c] !== y[c]) return c;
    return -1;
  };
  // bentuk panjang: 30.054 -> [30000, 50, 4]
  const bagian = (n) => { const s = String(n), h = []; for (let i = 0; i < s.length; i++) if (s[i] !== '0') h.push(Number(s[i]) * Math.pow(10, s.length - 1 - i)); return h; };

  // jenis: 'angka' (dua bilangan biasa), 'nol' (angka dengan 0 di tengah), 'bentuk' (bentuk panjang vs bilangan), 'panjang' (beda jumlah angka)
  function soalBanding(tingkat, jenis, pakai, kb) {
    for (let coba = 0; coba < 800; coba++) {
      let p, q, parts = null;
      const k = tingkat === 1 ? 4 : 5;
      if (jenis === 'bentuk') {
        const n = tingkat === 1 ? acak(1010, 9999) : acak(10100, 99999);
        if (!adaNol(n) || bagian(n).length < 2) continue;
        let ps = bagian(n);
        if (Math.random() < 0.5) { // sama persis
          p = n;
        } else { // salah letak: satu bagian digeser satu tempat (50 -> 500 atau 500 -> 50)
          const i = acak(0, ps.length - 1), turun = ps[i] >= 10 && Math.random() < 0.5;
          ps = ps.slice(); ps[i] = turun ? ps[i] / 10 : ps[i] * 10;
          p = ps.reduce((t, x) => t + x, 0);
          if (p === n || p > BATAS[tingkat] || new Set(ps).size < ps.length) continue;
        }
        if (p === n) ps = bagian(n);
        q = n; parts = ps;
      } else if (jenis === 'panjang') {
        // 9.870 dan 10.002: lebih banyak angka = lebih besar
        const a = acak(1000, 9999), b = acak(10000, 10999);
        [p, q] = [a, b];
        if (tingkat === 3 && Math.random() < 0.3) { p = 99999 - acak(0, 20); q = 100000; }
      } else {
        const kk = kb == null ? 0 : kb;
        [p, q] = pasangBeda(k, kk);
        if (jenis === 'nol' && !(adaNol(p) || adaNol(q))) continue;
      }
      if (jenis !== 'bentuk' && p === q) continue;
      if (Math.max(p, q) > BATAS[tingkat]) continue;
      if (jenis !== 'bentuk' && Math.random() < 0.5) [p, q] = [q, p];
      const kode = jenis === 'bentuk' ? 'f' + (parts || []).join('+') + '|' + q : [p, q].sort((x, y) => x - y).join('|');
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'banding', tingkat, pola: jenis, kb: kb == null ? null : kb, p, q, parts, tanda: tanda(p, q), kode };
    }
    throw new Error('soalBanding gagal ' + jenis);
  }

  // spesifikasi 3 soal pertama per tingkat: [jenis, kolomBeda]
  const POLA = {
    1: () => [['nol', 1], [pilih([['angka', 0], ['angka', 2]]), null], ['angka', pilih([0, 1, 2, 3])]].map(norm),
    2: () => [['nol', 1], [pilih(['bentuk', 'panjang', 'bentuk']), 1], ['angka', pilih([0, 1, 2])]].map(norm),
    3: () => [['nol', 3], [pilih(['bentuk', 'bentuk', 'panjang']), 3], ['angka', pilih([3, 4, 3])]].map(norm),
  };
  function norm(s) { // [ 'jenis', kb ] atau [ ['jenis', kb], null ]
    if (Array.isArray(s[0])) return s[0];
    return s;
  }

  function banyakBanding(tingkat, pakai) {
    for (let coba = 0; coba < 80; coba++) {
      const kumpul = new Set(pakai);
      const hasil = POLA[tingkat]().map(([j, kb]) => soalBanding(tingkat, j, kumpul, kb));
      if (new Set(hasil.map((s) => s.tanda)).size === 1) continue; // jawaban tidak boleh semua sama
      kumpul.forEach((x) => pakai.add(x));
      return hasil;
    }
    throw new Error('banyakBanding gagal');
  }

  function soalUrut(tingkat, pakai, arah) {
    arah = arah || (Math.random() < 0.5 ? 'kecil' : 'besar');
    const k = tingkat === 1 ? 4 : 5, depan = tingkat === 3 ? 3 : 1;
    for (let coba = 0; coba < 800; coba++) {
      const awal = []; for (let i = 0; i < depan; i++) awal.push(i === 0 ? acak(1, 9) : acak(0, 9));
      const daftar = [];
      let g = 0;
      while (daftar.length < 4 && g++ < 200) {
        const a = awal.slice(); for (let i = depan; i < k; i++) a.push(acak(0, 9));
        const n = Number(a.join(''));
        if (n <= BATAS[tingkat] && !daftar.includes(n)) daftar.push(n);
      }
      if (daftar.length < 4) continue;
      if (!daftar.some(adaNol)) continue;
      const urut = daftar.slice().sort((x, y) => (arah === 'kecil' ? x - y : y - x));
      const kode = 'u' + arah + urut.join(' ');
      if (pakai && pakai.has(kode)) continue;
      let acakan = kocok(daftar);
      if (sudahUrut(acakan, arah)) acakan = acakan.slice().reverse();
      if (sudahUrut(acakan, arah)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'urut', tingkat, arah, daftar: acakan, urut, kode };
    }
    throw new Error('soalUrut gagal');
  }
  function sudahUrut(arr, arah) { for (let i = 1; i < arr.length; i++) if (arah === 'kecil' ? arr[i - 1] >= arr[i] : arr[i - 1] <= arr[i]) return false; return true; }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return banyakBanding(tingkat, pakai).concat([soalUrut(tingkat, pakai, 'kecil'), soalUrut(tingkat, pakai, 'besar')]);
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'banding') return soalBanding(tingkat, soal.pola, pakai, soal.kb);
    return soalUrut(tingkat, pakai, soal.arah);
  }

  const periksaBanding = (soal, t) => ({ tanda: t, benar: t === soal.tanda });
  const periksaUrut = (soal, urutan) => ({ urutan, benar: urutan.length === soal.daftar.length && sudahUrut(urutan, soal.arah) });

  const logika = { BATAS, soalBanding, soalUrut, buatRonde, soalMirip, periksaBanding, periksaUrut, sudahUrut, kolomBeda, bagian, POLA, SIMBOL };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tabelTempat, NAMA_PENDEK } = B;
  const KATA = { '-1': 'lebih kecil', '0': 'sama', '1': 'lebih besar' };
  const lambang = (t) => SIMBOL[t].replace('<', '&lt;').replace('>', '&gt;');
  const angka = (n, kelas) => '<span class="bil-angka ' + (kelas || '') + '">' + fmt(n) + '</span>';
  const bentuk = (parts) => '<span class="bil-bentuk">' + parts.map(fmt).join(' + ') + '</span>';

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'banding') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Isi kotaknya: <b>&lt;</b>, <b>=</b>, atau <b>&gt;</b>?'));
      const kiri = soal.parts ? bentuk(soal.parts) : angka(soal.p, 'bil-raksasa');
      wadah.appendChild(el('div', 'banding-baris', kiri + '<span class="kotak-tanda">?</span>' + angka(soal.q, 'bil-raksasa')));
      const baris = el('div', 'pilihan pilihan-tanda');
      [-1, 0, 1].forEach((t) => {
        const b = el('button', 'tombol tombol-tanda', lambang(t) + '<small>' + KATA[t] + '</small>');
        b.onclick = () => kirim(periksaBanding(soal, t));
        baris.appendChild(b);
      });
      wadah.appendChild(baris);
      return;
    }
    const kecil = soal.arah === 'kecil';
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Urutkan dari yang <b class="' + (kecil ? 'biru' : 'merah') + '">' + (kecil ? 'terkecil' : 'terbesar') + '</b>'));
    const urutan = [];
    const slot = el('div', 'urut-slot');
    const kolam = el('div', 'urut-kolam');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const gambar = () => {
      slot.innerHTML = '';
      soal.daftar.forEach((_, i) => {
        const p = urutan[i];
        const s = el('button', 'kartu-slot' + (p != null ? ' isi' : ''), (p != null ? angka(p) : '') + '<small>' + (i === 0 ? (kecil ? 'terkecil' : 'terbesar') : i === soal.daftar.length - 1 ? (kecil ? 'terbesar' : 'terkecil') : i + 1) + '</small>');
        if (p != null) s.onclick = () => { urutan.splice(i, 1); Suara.efek('pop'); gambar(); };
        slot.appendChild(s);
      });
      kolam.innerHTML = '';
      soal.daftar.forEach((p) => {
        const dipakai = urutan.includes(p);
        const k = el('button', 'tombol tombol-pec tombol-bil-kecil' + (dipakai ? ' terpakai' : ''), fmt(p));
        k.onclick = () => { if (urutan.includes(p)) return; urutan.push(p); Suara.efek('pop'); gambar(); };
        kolam.appendChild(k);
      });
      cek.disabled = urutan.length < soal.daftar.length;
    };
    cek.onclick = () => { if (urutan.length === soal.daftar.length) kirim(periksaUrut(soal, urutan.slice())); };
    wadah.append(slot, kolam, cek);
    wadah.appendChild(el('div', 'ingat-kecil', 'Ketuk angka satu per satu, mulai yang ' + (kecil ? 'terkecil' : 'terbesar') + '. Ketuk kotak atas untuk membatalkan.'));
    gambar();
  }

  function pujian(soal) {
    if (soal.jenis === 'banding') return { html: (soal.parts ? soal.parts.map(fmt).join(' + ') + ' = ' + fmt(soal.p) : fmt(soal.p)) + ' <b>' + lambang(soal.tanda) + '</b> ' + fmt(soal.q) };
    return { html: soal.urut.map(fmt).join(soal.arah === 'kecil' ? ' &lt; ' : ' &gt; ') };
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'des-alasan');
    if (soal.jenis === 'banding') {
      const { p, q } = soal, kol = Math.max(String(p).length, String(q).length), c = kolomBeda(p, q);
      let teks = '';
      if (soal.parts) teks += 'Tulis bentuk panjang jadi satu bilangan: <b>' + soal.parts.map(fmt).join(' + ') + ' = ' + fmt(p) + '</b>.<br>';
      if (c < 0) teks += 'Angkanya sama persis, jadi ' + fmt(p) + ' <b>=</b> ' + fmt(q) + '.';
      else if (String(p).length !== String(q).length) {
        const lebih = String(p).length > String(q).length ? p : q;
        teks += '<b>' + fmt(lebih) + '</b> punya lebih banyak angka (' + String(lebih).length + ' angka), jadi lebih besar. ' + fmt(p) + ' <b>' + lambang(soal.tanda) + '</b> ' + fmt(q) + '.';
      } else {
        const x = String(p)[c], y = String(q)[c];
        teks += 'Bandingkan dari <b>kiri</b>. Angka yang sama dilewati, yang pertama beda ada di <b>' + NAMA_PENDEK[kol - 1 - c].toLowerCase() + '</b>: ' + x + ' ' + (x > y ? '&gt;' : '&lt;') + ' ' + y + '.<br>Jadi ' + fmt(p) + ' <b>' + lambang(soal.tanda) + '</b> ' + fmt(q) + '.';
      }
      teks += '<br><small>Kamu memilih "' + lambang(jawaban.tanda) + '".</small>';
      kolom.appendChild(el('div', 'kotak-teks', teks));
      kolom.appendChild(el('div', 'tabel-wadah', tabelTempat([p, q], { kolom: kol, sorotKolom: c < 0 ? undefined : c, samaDepan: c < 0 ? kol : c })));
    } else {
      kolom.appendChild(el('div', 'kotak-teks', 'Urutan yang benar: <b>' + soal.urut.map(fmt).join(soal.arah === 'kecil' ? ' &lt; ' : ' &gt; ') + '</b>.<br><small>Bandingkan dari kiri: angka yang pertama beda menentukan.</small>'));
      kolom.appendChild(el('div', 'tabel-wadah', tabelTempat(soal.urut, { kolom: Math.max(...soal.urut.map((x) => String(x).length)) })));
    }
    wadah.appendChild(kolom);
  }

  root.GameBilManaLebihBesar = Object.assign({
    id: 'mana-lebih-besar',
    tingkat: ['4 angka', '5 angka, beda di ribuan', '5 angka, beda di puluhan atau satuan'],
    ingat: 'Bandingkan dari KIRI. Angka yang sama dilewati; angka pertama yang beda menentukan. Angka 0 tetap dihitung: 3.015 < 3.105.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
