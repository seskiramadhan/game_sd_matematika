// Mini game 🧱 Prima atau Bukan (Kelas 4 Bab 3).
// Semua jawaban dihitung oleh kode (isPrime). Logika bisa dites di Node: tools/cek-prima.js
(function (root) {
  // ---------- Logika (tanpa DOM) ----------
  function isPrime(n) {
    if (!Number.isInteger(n) || n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  }
  // pasangan faktor paling "persegi": p <= q, p * q = n, p sebesar mungkin
  function pasanganFaktor(n) {
    let p = 1;
    for (let d = 1; d * d <= n; d++) if (n % d === 0) p = d;
    return [p, n / p];
  }
  const MAKS = { 1: 20, 2: 50, 3: 100 };
  const MIN = { 1: 1, 2: 10, 3: 20 };
  const PENEKANAN = [6, 7, 8, 12];

  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rentang = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };

  // hasil kali 6, 7, 8, 12 (dengan pengali >= 2) dalam batas
  function hasilKaliPenekanan(min, maks) {
    const s = new Set();
    PENEKANAN.forEach((a) => { for (let b = 2; a * b <= maks; b++) if (a * b >= min) s.add(a * b); });
    return [...s].sort((x, y) => x - y);
  }

  // kategori angka untuk soal "Apakah n prima?"
  function kandidat(kategori, tingkat) {
    const min = MIN[tingkat], maks = MAKS[tingkat];
    if (kategori === 'prima') return rentang(Math.max(2, min), maks).filter(isPrime);
    if (kategori === 'penekanan') return hasilKaliPenekanan(min, maks);
    if (kategori === 'ganjil') return rentang(min, maks).filter((n) => n % 2 === 1 && n > 1 && !isPrime(n)); // ganjil tapi bukan prima: jebakan
    if (kategori === 'khusus') return [1, 2]; // 1 bukan prima, 2 prima
    return rentang(Math.max(4, min), maks).filter((n) => !isPrime(n));
  }

  function pilihKategori(tingkat) {
    const r = Math.random();
    if (r < 0.38) return 'prima';
    if (r < 0.73) return 'penekanan';
    if (r < 0.88) return 'ganjil';
    return tingkat === 1 ? 'khusus' : (Math.random() < 0.5 ? 'khusus' : 'ganjil');
  }

  function soalTanya(tingkat, pakai, kategori) {
    kategori = kategori || pilihKategori(tingkat);
    let calon = kandidat(kategori, tingkat).filter((n) => !pakai.has(n));
    if (!calon.length) calon = kandidat('lain', tingkat).filter((n) => !pakai.has(n));
    const n = pilih(calon);
    pakai.add(n);
    return { jenis: 'tanya', n, prima: isPrime(n), kategori, tingkat };
  }

  function soalKetuk(tingkat, pakaiAwal) {
    const maks = MAKS[tingkat], min = MIN[tingkat];
    let a;
    for (let coba = 0; coba < 20; coba++) {
      a = acak(min, maks - 10);
      if (!pakaiAwal.has(a)) break;
    }
    pakaiAwal.add(a);
    const angka = rentang(a, a + 10);
    return { jenis: 'ketuk', a, b: a + 10, angka, primaList: angka.filter(isPrime), tingkat };
  }

  function buatRonde(tingkat) {
    const pakai = new Set(), pakaiAwal = new Set();
    // pastikan campuran: minimal 1 prima dan 1 hasil kali 6/7/8/12 di soal 1-3
    const urut = ['prima', 'penekanan', null].sort(() => Math.random() - 0.5);
    const soal = urut.map((k) => soalTanya(tingkat, pakai, k || undefined));
    soal.push(soalKetuk(tingkat, pakaiAwal), soalKetuk(tingkat, pakaiAwal));
    return soal;
  }

  function soalMirip(soal, tingkat) {
    if (soal.jenis === 'tanya') {
      const kat = soal.n === 1 || soal.n === 2 ? 'khusus' : soal.prima ? 'prima' : (Math.random() < 0.6 ? 'penekanan' : 'ganjil');
      const pakai = new Set([soal.n]);
      return soalTanya(tingkat, pakai, kat);
    }
    return soalKetuk(tingkat, new Set([soal.a]));
  }

  function periksaKetuk(soal, dipilih) {
    const set = new Set(dipilih);
    const salahPilih = soal.angka.filter((n) => set.has(n) && !isPrime(n));
    const terlewat = soal.primaList.filter((n) => !set.has(n));
    return { benar: !salahPilih.length && !terlewat.length, salahPilih, terlewat, dipilih: [...set] };
  }

  const logika = { isPrime, pasanganFaktor, susunan, hasilKaliPenekanan, buatRonde, soalMirip, soalTanya, soalKetuk, periksaKetuk, MAKS, MIN, PENEKANAN };

  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const WARNA = ['#FF6384', '#3A86FF', '#FFC400', '#2BB673', '#9B5DE5', '#FF8A3D'];
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'tanya') {
      wadah.appendChild(el('div', 'soal-teks', 'Apakah bilangan ini <b>prima</b>?'));
      wadah.appendChild(el('div', 'soal-angka', String(soal.n)));
      const baris = el('div', 'pilihan');
      const ya = el('button', 'tombol ya', 'Prima');
      const tidak = el('button', 'tombol tidak', 'Bukan');
      ya.onclick = () => kirim({ pilih: true, benar: soal.prima === true });
      tidak.onclick = () => kirim({ pilih: false, benar: soal.prima === false });
      baris.append(ya, tidak);
      wadah.appendChild(baris);
      wadah.appendChild(el('div', 'ingat-kecil', 'Prima = hanya punya 2 faktor: 1 dan bilangan itu sendiri.'));
      return;
    }
    wadah.appendChild(el('div', 'soal-teks', 'Ketuk <b>semua</b> bilangan prima<br>di antara ' + soal.a + ' sampai ' + soal.b));
    const chips = el('div', 'chips');
    const dipilih = new Set();
    soal.angka.forEach((n) => {
      const c = el('button', 'chip', String(n));
      c.onclick = () => {
        if (dipilih.has(n)) { dipilih.delete(n); c.classList.remove('dipilih'); }
        else { dipilih.add(n); c.classList.add('dipilih'); }
        Suara.efek('pop');
      };
      chips.appendChild(c);
    });
    wadah.appendChild(chips);
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    cek.onclick = () => kirim(periksaKetuk(soal, [...dipilih]));
    wadah.appendChild(cek);
  }

  function pujian(soal) {
    if (soal.jenis === 'tanya') {
      if (soal.n === 1) return '1 bukan prima: faktornya hanya satu, yaitu 1.';
      if (soal.prima) return soal.n + ' hanya punya faktor 1 dan ' + soal.n + '.';
      const [p, q] = pasanganFaktor(soal.n);
      return soal.n + ' = ' + p + ' × ' + q + ', jadi bukan prima.';
    }
    return 'Primanya: ' + soal.primaList.join(', ') + '.';
  }

  // Susunan kotak untuk n: bukan prima -> p x q pas; prima (> 3) -> coba p baris, ada sisa.
  function susunan(n) {
    if (n > 3 && isPrime(n)) {
      let p = 2;
      for (let d = 2; d * d <= n; d++) if (n % d <= n % p) p = d;
      return { p, q: Math.floor(n / p), sisa: n % p };
    }
    const [p, q] = pasanganFaktor(n);
    return { p, q, sisa: 0 };
  }

  // Kotak-kotak n: mulai 1 baris, lalu pindah jadi persegi panjang p x q (sisa ditandai merah).
  function gambarKotak(n, wadah) {
    const kotak = el('div', 'kotak-wadah');
    wadah.appendChild(kotak);
    const W = kotak.clientWidth || 800, H = kotak.clientHeight || 220;
    const gap = 3;
    const { p, q, sisa } = susunan(n);
    const baris = p + (sisa ? 1 : 0);
    const satuBaris = Math.min(40, (W - gap * n) / n);
    const s = Math.min(40, (W - gap * q) / q, (H - gap * baris) / baris);
    const lebarBaris = n * (satuBaris + gap), x0 = (W - lebarBaris) / 2, y0 = (H - satuBaris) / 2;
    const gx = (W - q * (s + gap)) / 2, gy = (H - baris * (s + gap)) / 2;
    const isi = [];
    for (let i = 0; i < n; i++) {
      const lebih = i >= p * q;
      const k = el('div', 'kotak' + (lebih && p > 1 ? ' sisa' : ''));
      k.style.background = lebih && p > 1 ? '#C9C2B4' : WARNA[Math.floor(i / q) % WARNA.length];
      k.style.width = k.style.height = satuBaris + 'px';
      k.style.left = x0 + i * (satuBaris + gap) + 'px';
      k.style.top = y0 + 'px';
      kotak.appendChild(k);
      isi.push(k);
    }
    if (p > 1) {
      setTimeout(() => {
        isi.forEach((k, i) => {
          const r = Math.floor(i / q), c = i - r * q;
          k.style.transitionDelay = (r * 0.12) + 's';
          k.style.width = k.style.height = s + 'px';
          k.style.left = gx + c * (s + gap) + 'px';
          k.style.top = gy + r * (s + gap) + 'px';
        });
      }, 700);
    }
  }

  function teksKotak(n) {
    if (n === 1) return '<b>1</b> hanya punya <b>satu</b> faktor, yaitu 1. Bilangan prima harus punya tepat 2 faktor. Jadi <b>1 bukan prima</b>.';
    if (isPrime(n)) {
      const { p, sisa } = susunan(n);
      const coba = sisa ? 'Dicoba ' + p + ' baris: <b>sisa ' + sisa + '</b>, tidak pas. ' : '';
      return coba + '<b>' + n + '</b> kotak hanya pas disusun <b>1 baris</b>. Faktornya cuma 1 dan ' + n + '. Jadi <b>' + n + ' prima</b>' + (n === 2 ? ' (satu-satunya prima yang genap)' : '') + '.';
    }
    const [p, q] = pasanganFaktor(n);
    return '<b>' + n + '</b> kotak bisa disusun jadi <b>' + p + ' baris × ' + q + ' kotak</b>. Jadi ' + n + ' = ' + p + ' × ' + q + ', punya faktor lain selain 1 dan ' + n + '. <b>Bukan prima</b>.';
  }

  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'tanya') {
      wadah.appendChild(el('div', 'kotak-teks', teksKotak(soal.n)));
      gambarKotak(soal.n, wadah);
      return;
    }
    // ketuk semua: tunjukkan status tiap angka, lalu kotak untuk satu kesalahan
    const baris = el('div', 'baris-chip-alasan');
    const set = new Set(jawaban.dipilih);
    soal.angka.forEach((n) => {
      let k = 'chip redup';
      if (isPrime(n) && set.has(n)) k = 'chip ok';
      else if (isPrime(n)) k = 'chip terlewat';
      else if (set.has(n)) k = 'chip salah-pilih';
      baris.appendChild(el('div', k, String(n)));
    });
    wadah.appendChild(baris);
    const bagian = [];
    if (jawaban.salahPilih.length) bagian.push('Merah = bukan prima (' + jawaban.salahPilih.join(', ') + ').');
    if (jawaban.terlewat.length) bagian.push('Garis oranye = prima yang terlewat (' + jawaban.terlewat.join(', ') + ').');
    wadah.appendChild(el('div', 'kotak-teks', bagian.join(' ')));
    const contoh = jawaban.salahPilih.length ? jawaban.salahPilih[0] : jawaban.terlewat[0];
    wadah.appendChild(el('div', 'kotak-teks', teksKotak(contoh)));
    gambarKotak(contoh, wadah);
  }

  root.GamePrima = Object.assign({
    id: 'prima',
    tingkat: ['angka ≤ 20', 'angka ≤ 50', 'angka ≤ 100'],
    ingat: 'Bilangan prima hanya punya 2 faktor: 1 dan bilangan itu sendiri. Ingat: 1 bukan prima, 2 prima.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
