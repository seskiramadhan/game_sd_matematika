// Mini game 🧮 Tabel Kilat (Kelas 4 Bab 2): fakta perkalian + perkalian puluhan/ratusan/ribuan.
// Soal 1-3: "7 × 12 = ?" (tingkat 3: "400 × 7"). Soal 4: kali puluhan/ratusan/ribuan (4 × 7, lalu tambah nol). Soal 5: keluarga fakta "84 : 7 = ?".
// Tingkat 1: fakta sampai 10 (+ puluhan × 1 angka) · 2: sampai 12 termasuk 11 (+ ratusan) · 3: ratusan & ribuan × 1 angka.
// Angka 6, 7, 8, 12 muncul lebih sering (70% soal memuat salah satunya). Pengecoh = kesalahan khas. Semua jawaban dihitung kode.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const H = modul ? require('./hitung.js') : root.HitungB2;
  const { fmt, pilih, pasangFaktor, buatOpsi } = H;
  const P10 = (k) => Math.pow(10, k);
  const HI = { 1: 10, 2: 12, 3: 12 }; // batas faktor soal fakta / keluarga (tingkat 3 keluarga memakai faktor sampai 9)

  // ---------- Logika (tanpa DOM) ----------
  function soalFakta(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const [a, b] = pasangFaktor(2, HI[tingkat]);
      const kode = 'f' + Math.min(a, b) + 'x' + Math.max(a, b);
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const k = a * b, balik = Number(String(k).split('').reverse().join(''));
      const { opsi, sebab } = buatOpsi(k, [
        { s: 'Itu hasil kali di sebelahnya (kurang atau lebih satu kelompok).', v: [k - a, k + a, k - b, k + b] },
        { s: 'Hampir! Puluhannya meleset (selisih 10).', v: [k - 10, k + 10] },
        { s: 'Angkanya tertukar tempat.', v: [balik] },
      ], [k - 1, k + 1, k - 2, k + 2, k + 20, k - 20], { maks: 200 });
      return { jenis: 'fakta', tingkat, a, b, kunci: k, opsi, sebab, kode };
    }
    throw new Error('soalFakta gagal');
  }

  function soalNol(tingkat, pakai, kk) {
    const k = kk || (tingkat === 1 ? 1 : tingkat === 2 ? 2 : pilih([2, 3]));
    for (let coba = 0; coba < 500; coba++) {
      const [d, m] = pasangFaktor(2, 9);
      const kode = 'n' + d + 'x' + m + 'z' + k;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const inti = d * m, kunci = inti * P10(k), a = d * P10(k);
      const { opsi, sebab } = buatOpsi(kunci, [
        { w: true, s: 'Nolnya kurang: setelah ' + d + ' × ' + m + ' = ' + inti + ', tambahkan SEMUA nol (' + k + ' nol).', v: [inti * P10(k - 1)] },
        { w: true, s: 'Nolnya kelebihan: hanya ' + k + ' nol yang ditambahkan.', v: [inti * P10(k + 1)] },
        { s: 'Perkalian ' + d + ' × ' + m + ' salah hitung.', v: [(inti - m) * P10(k), (inti + m) * P10(k), (inti - d) * P10(k), (inti + d) * P10(k)] },
      ], [kunci - P10(k), kunci + P10(k), kunci + 2 * P10(k), kunci - 2 * P10(k)]);
      return { jenis: 'nol', tingkat, k, d, m, a, inti, kunci, opsi, sebab, kode };
    }
    throw new Error('soalNol gagal');
  }

  function soalKeluarga(tingkat, pakai) {
    const z = tingkat === 3 ? pilih([2, 3]) : 0;
    const hi = tingkat === 3 ? 9 : HI[tingkat];
    for (let coba = 0; coba < 500; coba++) {
      const [f1, f2] = pasangFaktor(2, hi);
      const kode = 'k' + Math.min(f1, f2) + 'x' + Math.max(f1, f2) + 'z' + z;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const dibagi = f1 * f2 * P10(z), pembagi = f2, kunci = f1 * P10(z);
      const { opsi, sebab } = buatOpsi(kunci, [
        { s: 'Nolnya tidak pas: bagi dulu ' + (f1 * f2) + ' : ' + pembagi + ' = ' + f1 + ', lalu bawa nolnya.', v: [kunci * 10, kunci / 10] },
        { s: 'Hampir! Faktanya meleset satu.', v: [(f1 - 1) * P10(z), (f1 + 1) * P10(z)] },
        { s: 'Itu pembagi lain dalam keluarga fakta yang sama.', v: [pembagi * P10(z)] },
      ], [kunci + 1, kunci - 1, kunci + 2, kunci + 10, kunci - 10], { maks: 100000 });
      return { jenis: 'keluarga', tingkat, z, f1, f2, dibagi, pembagi, kunci, opsi, sebab, kode };
    }
    throw new Error('soalKeluarga gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    if (tingkat === 3) {
      return [soalNol(3, pakai, 2), soalNol(3, pakai, 3), soalNol(3, pakai, pilih([2, 3])), soalNol(3, pakai, 3), soalKeluarga(3, pakai)];
    }
    return [soalFakta(tingkat, pakai), soalFakta(tingkat, pakai), soalFakta(tingkat, pakai), soalNol(tingkat, pakai), soalKeluarga(tingkat, pakai)];
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'fakta') return soalFakta(tingkat, pakai);
    if (soal.jenis === 'nol') return soalNol(tingkat, pakai, soal.k);
    return soalKeluarga(tingkat, pakai);
  }
  const periksa = (soal, pilihan) => ({ pilih: pilihan, benar: pilihan === soal.kunci });
  // trik pecah: faktor terbesar dipecah (11+ -> 10 + sisa; 6..10 -> 5 + sisa; kecil -> dua bagian)
  function pecah(a, b) {
    const besar = Math.max(a, b), kecil = Math.min(a, b);
    const p = besar >= 11 ? 10 : besar >= 6 ? 5 : Math.ceil(besar / 2);
    return { kecil, besar, p, r: besar - p, hasilP: kecil * p, hasilR: kecil * (besar - p) };
  }

  const logika = { HI, soalFakta, soalNol, soalKeluarga, buatRonde, soalMirip, periksa, pecah };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tombolOpsi } = H;

  function teksSoal(s) {
    if (s.jenis === 'fakta') return '<span class="b2-soal">' + s.a + ' × ' + s.b + ' = ?</span>';
    if (s.jenis === 'nol') return '<span class="b2-soal">' + fmt(s.a) + ' × ' + s.m + ' = ?</span>';
    return '<span class="b2-soal">' + fmt(s.dibagi) + ' : ' + s.pembagi + ' = ?</span>';
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks', teksSoal(soal)));
    if (soal.jenis === 'nol') wadah.appendChild(el('div', 'ingat-kecil', 'Kali angka depannya dulu, lalu tambah nolnya.'));
    if (soal.jenis === 'keluarga') wadah.appendChild(el('div', 'ingat-kecil', 'Ingat keluarga fakta: ? × ' + soal.pembagi + ' = ' + fmt(soal.dibagi)));
    wadah.appendChild(tombolOpsi(soal.opsi.map((o) => ({ nilai: o, label: fmt(o) })), (nilai) => kirim(periksa(soal, nilai))));
  }

  function pujian(soal) {
    if (soal.jenis === 'fakta') return { html: soal.a + ' × ' + soal.b + ' = <b>' + soal.kunci + '</b>' };
    if (soal.jenis === 'nol') return { html: soal.d + ' × ' + soal.m + ' = ' + soal.inti + ', tambah ' + soal.k + ' nol: <b>' + fmt(soal.kunci) + '</b>' };
    return { html: fmt(soal.dibagi) + ' : ' + soal.pembagi + ' = <b>' + fmt(soal.kunci) + '</b>' };
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'des-alasan');
    const sebab = soal.sebab[jawaban.pilih];
    const salah = '<small>Kamu memilih ' + fmt(jawaban.pilih) + '.' + (sebab ? ' ' + sebab : '') + '</small>';
    if (soal.jenis === 'fakta') {
      const t = pecah(soal.a, soal.b);
      kolom.appendChild(el('div', 'kotak-teks', '<b>Trik pecah:</b> ' + soal.a + ' × ' + soal.b + ' = ' + t.kecil + ' × ' + t.p + ' + ' + t.kecil + ' × ' + t.r + ' = ' + t.hasilP + ' + ' + t.hasilR + ' = <b>' + soal.kunci + '</b><br>' + salah));
      const kotak = el('div', 'b2-pecah');
      const k1 = el('div', 'b2-pecah-isi a', t.kecil + ' × ' + t.p + '<b>= ' + t.hasilP + '</b>');
      k1.style.flexGrow = String(t.p);
      const k2 = el('div', 'b2-pecah-isi b', t.kecil + ' × ' + t.r + '<b>= ' + t.hasilR + '</b>');
      k2.style.flexGrow = String(Math.max(t.r, 1.5));
      kotak.append(k1, k2);
      kolom.appendChild(kotak);
    } else if (soal.jenis === 'nol') {
      const nol = '0'.repeat(soal.k);
      kolom.appendChild(el('div', 'kotak-teks', '<b>Kali angka depan, lalu tambah nol:</b><br>' + soal.d + ' × ' + soal.m + ' = ' + soal.inti + ' &nbsp;→&nbsp; tambah ' + soal.k + ' nol &nbsp;→&nbsp; <b>' + fmt(soal.kunci) + '</b><br>' + salah));
      kolom.appendChild(el('div', 'b2-nol', '<span class="b2-nol-a">' + soal.d + '<i>' + nol + '</i></span> × ' + soal.m + ' = <span class="b2-nol-a">' + soal.inti + '<i>' + nol + '</i></span> = ' + fmt(soal.kunci)));
    } else {
      kolom.appendChild(el('div', 'kotak-teks', '<b>Keluarga fakta:</b> ' + soal.f1 + ' × ' + soal.f2 + ' = ' + (soal.f1 * soal.f2) + ', jadi ' + (soal.f1 * soal.f2) + ' : ' + soal.pembagi + ' = ' + soal.f1 + '.' + (soal.z ? '<br>Tambah ' + soal.z + ' nol: ' + fmt(soal.dibagi) + ' : ' + soal.pembagi + ' = <b>' + fmt(soal.kunci) + '</b>' : '') + '<br>' + salah));
      kolom.appendChild(el('div', 'b2-nol', fmt(soal.kunci) + ' × ' + soal.pembagi + ' = ' + fmt(soal.dibagi)));
    }
    wadah.appendChild(kolom);
  }

  root.GameTabelKilat = Object.assign({
    id: 'tabel-kilat',
    tingkat: ['fakta sampai 10', 'fakta sampai 12', 'ratusan & ribuan × 1 angka'],
    ingat: 'Tidak hafal? Pecah! 7 × 12 = 7 × 10 + 7 × 2. Kali puluhan/ratusan: kali angka depannya, lalu tambah nolnya.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
