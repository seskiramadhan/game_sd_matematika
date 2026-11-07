// Mini game 🎯 Bulatkan! (Kelas 4 Bab 1): pembulatan & penaksiran.
// Soal 1-3: "34.567 dibulatkan ke ribuan terdekat?" (pilih) · Soal 4: teka-teki batas "bilangan mana yang dibulatkan ke puluhan jadi 48.270?" (pilih semua yang cocok)
// Soal 5: taksiran "4.980 + 3.020 ≈ ?" (bulatkan dulu baru hitung; pengecoh: hasil asli).
// Tingkat 1: ke puluhan · 2: ke ratusan · 3: ke ribuan (+ batas, taksiran jumlah & selisih).
// Jebakan yang dilatih: 5 ke atas naik (4 ke bawah turun), pembulatan ke atas melewati angka 9 (49.700 -> 50.000), taksiran bukan hasil asli.
// Semua jawaban dihitung kode. Cek logika: node tools/cek-bab1.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bilangan.js') : root.Bilangan;
  const { fmt, acak, pilih, kocok, bulatkan } = B;

  // ---------- Logika (tanpa DOM) ----------
  const TEMPAT_P = { 1: 10, 2: 100, 3: 1000 };
  const NAMA_P = { 10: 'puluhan', 100: 'ratusan', 1000: 'ribuan' };
  const BATAS = { 1: 9999, 2: 99999, 3: 99999 };       // bilangan di soal; hasil pembulatan boleh sampai 100.000
  const HASIL_MAX = { 1: 10000, 2: 100000, 3: 100000 };
  const tambahUnik = (daftar, v, larang, maks) => { if (Number.isInteger(v) && v >= 0 && v <= maks && !larang.includes(v) && !daftar.includes(v)) daftar.push(v); };

  // ---- soal "bulatkan" ----
  function soalBulat(tingkat, pakai, penentuMau) {
    const p = TEMPAT_P[tingkat], q = p / 10;
    for (let coba = 0; coba < 800; coba++) {
      const penentu = penentuMau != null ? penentuMau : pilih([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
      let depan = tingkat === 3 ? acak(10, 99) : acak(10, 999);
      if (tingkat === 3 && Math.random() < 0.3) depan = pilih([19, 29, 39, 49, 59, 69, 79, 89, 99]); // bulat ke atas melewati angka 9
      if (tingkat === 2 && Math.random() < 0.25) depan = acak(1, 99) * 10 + 9;
      const n = depan * p + penentu * q + (q > 1 ? acak(0, q - 1) : 0);
      if (n > BATAS[tingkat] || n < 100) continue;
      const kode = 'r' + n;
      if (pakai && pakai.has(kode)) continue;
      const kunci = bulatkan(n, p), lo = Math.floor(n / p) * p, hi = lo + p;
      const larang = [kunci, n], salah = [];
      // pengecoh 1: arah yang salah (lupa aturan 5 ke atas)
      tambahUnik(salah, kunci === hi ? lo : hi, larang, HASIL_MAX[tingkat]);
      // pengecoh 2: dibulatkan ke tempat yang salah (lebih besar)
      tambahUnik(salah, bulatkan(n, p * 10), larang.concat(salah), HASIL_MAX[tingkat]);
      // pengecoh 3: tempat lebih kecil (atau belum dibulatkan)
      tambahUnik(salah, q > 1 ? bulatkan(n, q) : n, larang.concat(salah), HASIL_MAX[tingkat]);
      // cadangan
      [hi + p, lo - p, kunci + p, kunci - p].forEach((v) => tambahUnik(salah, v, larang.concat(salah), HASIL_MAX[tingkat]));
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'bulat', tingkat, p, n, penentu, kunci, lo, hi, opsi: kocok([kunci].concat(salah.slice(0, 3))), kode };
    }
    throw new Error('soalBulat gagal');
  }

  // ---- teka-teki batas: pilih semua yang dibulatkan jadi T ----
  function soalBatas(tingkat, pakai) {
    const p = TEMPAT_P[tingkat], h = p / 2;
    for (let coba = 0; coba < 800; coba++) {
      const target = (tingkat === 3 ? acak(10, 98) : acak(10, 999)) * p;
      if (target < 100 || target + p > 99999) continue;
      const kode = 't' + target;
      if (pakai && pakai.has(kode)) continue;
      const dalamLo = target - h, dalamHi = target + h - 1;
      const benar = [], salah = [];
      const jumlahBenar = pilih([2, 3, 3]);
      if (Math.random() < 0.6) tambahUnik(benar, dalamLo, [], 1e9);   // tepat di batas bawah (5 ke atas naik)
      if (Math.random() < 0.6) tambahUnik(benar, dalamHi, [], 1e9);   // tepat di batas atas
      tambahUnik(benar, target, [], 1e9);
      let g = 0;
      while (benar.length < jumlahBenar && g++ < 60) tambahUnik(benar, acak(dalamLo, dalamHi), [], 1e9);
      if (benar.length > jumlahBenar) benar.length = jumlahBenar;
      // salah: tepat di luar batas dan satu di luar jauh
      const luarBawah = dalamLo - 1, luarAtas = dalamHi + 1;
      salah.push(luarBawah, luarAtas);
      g = 0;
      while (salah.length < 6 - benar.length && g++ < 80) {
        const v = Math.random() < 0.5 ? acak(target - p, luarBawah - 1) : acak(luarAtas + 1, target + p);
        tambahUnik(salah, v, benar, 1e9);
      }
      if (benar.length + salah.length !== 6) continue;
      if (benar.some((v) => bulatkan(v, p) !== target) || salah.some((v) => bulatkan(v, p) === target)) continue;
      if (pakai) pakai.add(kode);
      const opsi = benar.concat(salah).sort((a, b) => a - b);
      return { jenis: 'batas', tingkat, p, target, dalamLo, dalamHi, opsi, kunciSet: benar.slice().sort((a, b) => a - b), kode };
    }
    throw new Error('soalBatas gagal');
  }

  // ---- taksiran ----
  function soalTaksir(tingkat, pakai) {
    const p = tingkat === 1 ? 100 : 1000;
    for (let coba = 0; coba < 2000; coba++) {
      const minus = tingkat === 3 && Math.random() < 0.5;
      let a, b;
      if (tingkat === 1) { a = acak(1010, 4990); b = acak(1010, 4990); }
      else if (tingkat === 2) { a = acak(1010, 49990); b = acak(1010, 49990); }
      else if (minus) { a = acak(20000, 99990); b = acak(2010, a - 4000); }
      else { a = acak(10010, 59990); b = acak(10010, 99990 - a); }
      if (a % p === 0 || b % p === 0) continue;
      if (!minus && a + b > 100000) continue;
      const ra = bulatkan(a, p), rb = bulatkan(b, p);
      const kunci = minus ? ra - rb : ra + rb, asli = minus ? a - b : a + b;
      if (kunci === asli || kunci <= 0 || kunci > 100000) continue;
      const kode = 'x' + a + (minus ? '-' : '+') + b;
      if (pakai && pakai.has(kode)) continue;
      const larang = [kunci], salah = [];
      tambahUnik(salah, asli, larang, 100000);                                              // hasil asli (belum ditaksir)
      tambahUnik(salah, minus ? ra - b : ra + b, larang.concat(salah), 100000);             // hanya satu yang dibulatkan
      tambahUnik(salah, minus ? a - rb : a + rb, larang.concat(salah), 100000);
      const bawah = (x) => Math.floor(x / p) * p;
      tambahUnik(salah, minus ? bawah(a) - bawah(b) : bawah(a) + bawah(b), larang.concat(salah), 100000); // selalu dibulatkan ke bawah
      tambahUnik(salah, kunci + p, larang.concat(salah), 100000);
      tambahUnik(salah, kunci - p, larang.concat(salah), 100000);
      if (salah.length < 3 || salah[0] !== asli) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'taksir', tingkat, p, minus, a, b, ra, rb, kunci, asli, opsi: kocok([kunci].concat(salah.slice(0, 3))), kode };
    }
    throw new Error('soalTaksir gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    const penentu = kocok([pilih([5, 6, 7, 8, 9]), pilih([1, 2, 3, 4]), pilih([5, 4, 5, 9])]);
    return penentu.map((x) => soalBulat(tingkat, pakai, x)).concat([soalBatas(tingkat, pakai), soalTaksir(tingkat, pakai)]);
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'bulat') return soalBulat(tingkat, pakai, soal.penentu >= 5 ? pilih([5, 6, 7, 8, 9]) : pilih([1, 2, 3, 4]));
    if (soal.jenis === 'batas') return soalBatas(tingkat, pakai);
    return soalTaksir(tingkat, pakai);
  }

  const periksaPilih = (soal, v) => ({ pilihan: v, benar: v === soal.kunci });
  const sameSet = (a, b) => a.length === b.length && a.slice().sort((x, y) => x - y).every((v, i) => v === b.slice().sort((x, y) => x - y)[i]);
  const periksaBatas = (soal, dipilih) => ({ dipilih, benar: sameSet(dipilih, soal.kunciSet) });

  const logika = { TEMPAT_P, NAMA_P, BATAS, HASIL_MAX, soalBulat, soalBatas, soalTaksir, buatRonde, soalMirip, periksaPilih, periksaBatas, sameSet };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, svgEl, garisBulat } = B;
  const FONT = 'Poppins, sans-serif';

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'bulat') {
      wadah.appendChild(el('div', 'soal-teks', '<span class="bil-angka bil-raksasa">' + fmt(soal.n) + '</span>'));
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'dibulatkan ke <b class="biru">' + NAMA_P[soal.p] + '</b> terdekat jadi?'));
    } else if (soal.jenis === 'taksir') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Taksir hasilnya. Bulatkan dulu ke <b class="biru">' + NAMA_P[soal.p] + '</b>, baru hitung.'));
      wadah.appendChild(el('div', 'soal-teks', '<span class="bil-angka bil-besar-teks">' + fmt(soal.a) + (soal.minus ? ' − ' : ' + ') + fmt(soal.b) + ' ≈ ?</span>'));
    } else {
      tampilBatas(soal, wadah, kirim);
      return;
    }
    const baris = el('div', 'bil-opsi');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-bil', fmt(o));
      b.onclick = () => kirim(periksaPilih(soal, o));
      baris.appendChild(b);
    });
    wadah.appendChild(baris);
  }

  function tampilBatas(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Bilangan mana yang dibulatkan ke <b class="biru">' + NAMA_P[soal.p] + '</b> jadi <b class="merah">' + fmt(soal.target) + '</b>?<br><small class="ket-kecil">Boleh lebih dari satu. Ketuk semua yang cocok.</small>'));
    const dipilih = [];
    const baris = el('div', 'bil-opsi bil-opsi-enam');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const gambar = () => { cek.disabled = !dipilih.length; };
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-bil tombol-cek', fmt(o));
      b.onclick = () => {
        const i = dipilih.indexOf(o);
        if (i >= 0) dipilih.splice(i, 1); else dipilih.push(o);
        b.classList.toggle('dipilih', i < 0);
        Suara.efek('pop'); gambar();
      };
      baris.appendChild(b);
    });
    cek.onclick = () => { if (dipilih.length) kirim(periksaBatas(soal, dipilih.slice())); };
    wadah.append(baris, cek);
    gambar();
  }

  function pujian(soal) {
    if (soal.jenis === 'bulat') return { html: fmt(soal.n) + ' ≈ <b>' + fmt(soal.kunci) + '</b>' };
    if (soal.jenis === 'batas') return { html: 'Dari <b>' + fmt(soal.dalamLo) + '</b> sampai <b>' + fmt(soal.dalamHi) + '</b>' };
    return { html: fmt(soal.ra) + (soal.minus ? ' − ' : ' + ') + fmt(soal.rb) + ' = <b>' + fmt(soal.kunci) + '</b>' };
  }

  function garisBatas(soal) {
    const p = soal.p, T = soal.target, lo = T - p, hi = T + p;
    const W = 900, X0 = 80, X1 = 820, yG = 70;
    const x = (v) => X0 + ((v - lo) / (hi - lo)) * (X1 - X0);
    const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' 150', class: 'bil-garis-svg' });
    svg.appendChild(svgEl('rect', { x: x(soal.dalamLo), y: yG - 24, width: x(soal.dalamHi + 1) - x(soal.dalamLo), height: 48, rx: 8, fill: '#D6F2E3' }));
    svg.appendChild(svgEl('line', { x1: X0 - 30, y1: yG, x2: X1 + 30, y2: yG, stroke: '#1F2A44', 'stroke-width': 6, 'stroke-linecap': 'round' }));
    const tik = (v, teks, warna, y2, ukuran) => {
      svg.appendChild(svgEl('line', { x1: x(v), y1: yG - 16, x2: x(v), y2: yG + 16, stroke: warna, 'stroke-width': 4 }));
      const t = svgEl('text', { x: x(v), y: y2, 'text-anchor': 'middle', 'font-size': ukuran || 22, 'font-weight': 800, fill: warna, 'font-family': FONT }); t.textContent = teks; svg.appendChild(t);
    };
    tik(lo, fmt(lo), '#1F2A44', yG + 46); tik(hi, fmt(hi), '#1F2A44', yG + 46); tik(T, fmt(T), '#E04466', yG + 46);
    tik(soal.dalamLo, fmt(soal.dalamLo), '#178A52', yG - 34, 20); tik(soal.dalamHi, fmt(soal.dalamHi), '#178A52', yG - 34, 20);
    const t = svgEl('text', { x: x(T), y: yG + 76, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: '#178A52', 'font-family': FONT }); t.textContent = 'daerah yang dibulatkan ke ' + fmt(T); svg.appendChild(t);
    return svg;
  }

  function alasan(soal, jawaban, wadah) {
    const k = el('div', 'des-alasan');
    if (soal.jenis === 'bulat') {
      const q = soal.p / 10, tempatPenentu = q === 1 ? 'satuan' : NAMA_P[q];
      const naik = soal.penentu >= 5;
      k.appendChild(el('div', 'kotak-teks', 'Lihat angka di <b>' + tempatPenentu + '</b>: angka penentunya <b class="merah">' + soal.penentu + '</b>.<br>' +
        (naik ? '5 ke atas → <b>naik</b> ke ' + fmt(soal.kunci) + '.' : '0 sampai 4 → <b>turun</b> ke ' + fmt(soal.kunci) + '.') +
        '<br><small>Kamu memilih ' + fmt(jawaban.pilihan) + '. Titik tengahnya ' + fmt(soal.lo + soal.p / 2) + '.</small>'));
      k.appendChild(el('div', 'bil-gambar')).appendChild(garisBulat(soal.n, soal.lo, soal.hi));
    } else if (soal.jenis === 'batas') {
      k.appendChild(el('div', 'kotak-teks', 'Yang dibulatkan ke ' + fmt(soal.target) + ' hanya yang <b>dari ' + fmt(soal.dalamLo) + ' sampai ' + fmt(soal.dalamHi) + '</b>.<br><small>' + fmt(soal.dalamLo - 1) + ' masih turun, ' + fmt(soal.dalamHi + 1) + ' sudah naik.</small>'));
      k.appendChild(el('div', 'bil-gambar')).appendChild(garisBatas(soal));
      const baris = el('div', 'bil-chip-baris');
      soal.opsi.forEach((o) => {
        const ok = soal.kunciSet.includes(o), pilihnya = jawaban.dipilih.includes(o);
        baris.appendChild(el('span', 'bil-chip ' + (ok ? 'ok' : 'tidak') + (pilihnya !== ok ? ' keliru' : ''), fmt(o) + ' → ' + fmt(bulatkan(o, soal.p)) + (pilihnya !== ok ? (ok ? ' (lupa)' : ' (salah)') : '')));
      });
      k.appendChild(baris);
    } else {
      const op = soal.minus ? ' − ' : ' + ';
      k.appendChild(el('div', 'kotak-teks', 'Bulatkan <b>dulu</b>, baru hitung:<br>' + fmt(soal.a) + ' ≈ <b>' + fmt(soal.ra) + '</b> dan ' + fmt(soal.b) + ' ≈ <b>' + fmt(soal.rb) + '</b>' +
        (jawaban.pilihan === soal.asli ? '<br><small>' + fmt(soal.asli) + ' adalah hasil asli, bukan taksiran.</small>' : '')));
      k.appendChild(el('div', 'alasan-hitung', fmt(soal.ra) + op + fmt(soal.rb) + ' = <b>' + fmt(soal.kunci) + '</b>'));
    }
    wadah.appendChild(k);
  }

  root.GameBulatkan = Object.assign({
    id: 'bulatkan',
    tingkat: ['ke puluhan', 'ke ratusan', 'ke ribuan'],
    ingat: 'Lihat angka di sebelah kanan tempat yang dibulatkan: 5 ke atas naik, 4 ke bawah turun. Taksiran: bulatkan dulu, baru hitung.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
