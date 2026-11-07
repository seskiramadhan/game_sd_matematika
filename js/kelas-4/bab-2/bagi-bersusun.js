// Mini game 🍰 Bagi Bersusun (Kelas 4 Bab 2): pembagian bersusun (porogapit) dengan pembagi 1 angka, sisa, dan cek dengan perkalian.
// Soal 1-3: porogapit per langkah ("86 : 6": ambil angka, muat berapa kali?, lalu sisa akhir). Soal 4: cek 6 × 14 + 2 = ? . Soal 5: pilih hasil yang benar (q sisa r).
// Tingkat 1: tanpa sisa (2 angka) · 2: bersisa (2-3 angka) · 3: 3-4 angka (ada nol di hasil bagi, ada sisa).
// Jebakan: sisa harus lebih kecil dari pembagi; angka 0 di hasil bagi; cek = pembagi × hasil + sisa. Semua jawaban dihitung kode.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const H = modul ? require('./hitung.js') : root.HitungB2;
  const { fmt, pilih, acak, kocok, buatOpsi } = H;

  // ---------- Logika (tanpa DOM) ----------
  // Langkah-langkah porogapit. Tiap langkah: { ambil, q, kali, sisa } (q = satu angka hasil bagi).
  function langkahBagi(a, b) {
    const dig = String(a).split('').map(Number), langkah = [];
    let r = 0, mulai = false, hasil = '';
    for (let i = 0; i < dig.length; i++) {
      const cur = r * 10 + dig[i];
      if (!mulai && cur < b && i < dig.length - 1) { r = cur; continue; }
      mulai = true;
      const q = Math.floor(cur / b);
      langkah.push({ ambil: cur, q, kali: q * b, sisa: cur - q * b });
      r = cur - q * b; hasil += q;
    }
    return { langkah, q: Number(hasil), r };
  }

  const PEMBAGI_FOKUS = [6, 7, 8];
  function pembagiAcak() { // pembagi 1 angka; 70% memakai 6, 7, 8
    return Math.random() < 0.7 ? pilih(PEMBAGI_FOKUS) : pilih([2, 3, 4, 5, 9]);
  }
  // spes: { digit: 2..4 (atau [..]), sisa: bool, nolQ: bool }
  function buatAB(spes) {
    for (let coba = 0; coba < 20000; coba++) {
      const d = Array.isArray(spes.digit) ? pilih(spes.digit) : spes.digit, b = pembagiAcak();
      let a = acak(Math.pow(10, d - 1), Math.pow(10, d) - 1);
      if (!spes.sisa) a -= a % b; else if (a % b === 0) continue;
      if (a < Math.pow(10, d - 1) || a < 2 * b) continue;
      const { q } = langkahBagi(a, b);
      if (spes.nolQ && !/0/.test(String(q).slice(1))) continue;
      return { a, b };
    }
    throw new Error('buatAB gagal');
  }

  function soalBagi(tingkat, spes, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const { a, b } = buatAB(spes);
      const kode = 'b' + a + ':' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const { langkah, q, r } = langkahBagi(a, b);
      // pilihan tiap langkah (satu angka hasil bagi, 0..9)
      const pil = langkah.map((l) => buatOpsi(l.q, [
        { s: 'terlalu besar', v: [l.q + 1] },
        { s: 'masih muat lagi', v: [l.q - 1] },
        { s: 'meleset', v: [l.q + 2, l.q - 2] },
      ], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], { min: 0, maks: 9 }).opsi);
      const sisaOpsi = r > 0 ? buatOpsi(r, [
        { w: true, s: 'Sisa tidak boleh sama atau lebih besar dari pembagi.', v: [r + b] },
        { s: 'Meleset satu.', v: [r + 1, r - 1] },
        { s: 'Meleset dua.', v: [r + 2, r - 2] },
      ], [r + 2, r - 2, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { min: 0, maks: 2 * b }) : null;
      return { jenis: 'bagi', tingkat, a, b, q, r, langkah, pilihan: pil, sisaOpsi: sisaOpsi && sisaOpsi.opsi, sisaSebab: sisaOpsi && sisaOpsi.sebab, kunci: q, kode };
    }
    throw new Error('soalBagi gagal');
  }

  function soalCek(tingkat, spes, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const { a, b } = buatAB(spes);
      const kode = 'c' + a + ':' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const q = Math.floor(a / b), r = a % b, bq = b * q;
      const { opsi, sebab } = buatOpsi(a, [
        { w: true, s: 'Sisanya lupa ditambahkan.', v: r ? [bq] : [] },
        { s: 'Sisanya dikurangi, padahal harus ditambah.', v: r ? [bq - r] : [] },
        { s: 'Perkalian ' + b + ' × ' + fmt(q) + ' salah hitung (selisih 10).', v: [a + 10, a - 10] },
        { s: 'Itu hasil menjumlahkan, bukan mengalikan.', v: [b + q + r] },
      ], [a + 1, a - 1, a + 2, a - 2, a + b, a - b, a + 100]);
      return { jenis: 'cek', tingkat, a, b, q, r, kunci: a, opsi, sebab, kode };
    }
    throw new Error('soalCek gagal');
  }

  const benarPasang = (a, b, q, r) => r >= 0 && r < b && q >= 0 && b * q + r === a;
  function soalBenar(tingkat, spes, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const { a, b } = buatAB(spes);
      const kode = 'p' + a + ':' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const q = Math.floor(a / b), r = a % b;
      const kandidat = [
        { q: q - 1, r: r + b, s: 'Sisanya (' + (r + b) + ') tidak boleh sama atau lebih besar dari pembagi (' + b + '): masih bisa dibagi lagi.' },
        { q, r: r + 1, s: 'Dicek dengan perkalian, hasilnya tidak sama dengan ' + fmt(a) + '.' },
        { q, r: r > 0 ? r - 1 : b - 1, s: 'Dicek dengan perkalian, hasilnya tidak sama dengan ' + fmt(a) + '.' },
        { q: q + 1, r, s: 'Dicek dengan perkalian, hasilnya tidak sama dengan ' + fmt(a) + '.' },
        { q: q - 1, r, s: 'Dicek dengan perkalian, hasilnya tidak sama dengan ' + fmt(a) + '.' },
        { q, r: 0, s: 'Sisanya terlupa.' },
        { q: q + 1, r: Math.max(r - b, 0) + 1, s: 'Dicek dengan perkalian, hasilnya tidak sama dengan ' + fmt(a) + '.' },
      ];
      const pakaiK = new Map();
      const sah = kandidat.filter((x) => !benarPasang(a, b, x.q, x.r) && x.q >= 0 && x.r >= 0 && x.r <= 2 * b);
      // satu dari tiap alasan dulu: kandidat pertama (sisa >= pembagi) wajib bila ada
      const urut = sah.filter((x, i) => x.r >= b && i === 0).concat(kocok(sah.filter((x) => !(x.r >= b))), sah.filter((x) => x.r >= b));
      for (const x of urut) { const key = x.q + '|' + x.r; if (!pakaiK.has(key) && pakaiK.size < 3) pakaiK.set(key, x); }
      if (pakaiK.size < 3) continue;
      const opsi = kocok([{ q, r, benar: true }].concat(Array.from(pakaiK.values()).map((x) => ({ q: x.q, r: x.r, s: x.s }))));
      return { jenis: 'benar', tingkat, a, b, q, r, kunci: q + '|' + r, opsi, kode };
    }
    throw new Error('soalBenar gagal');
  }

  const SPES = {
    1: { tanpa: [{ digit: 2, sisa: false }, { digit: 2, sisa: false }, { digit: 2, sisa: false }], cek: { digit: 2, sisa: false } },
    2: { tanpa: [{ digit: 2, sisa: true }, { digit: 3, sisa: true }, { digit: [2, 3], sisa: true }], cek: { digit: [2, 3], sisa: true } },
    3: { tanpa: [{ digit: 3, sisa: false }, { digit: 4, sisa: true }, { digit: 4, sisa: true, nolQ: true }], cek: { digit: [3, 4], sisa: true } },
  };
  function buatRonde(tingkat) {
    const pakai = new Set(), S = SPES[tingkat];
    return [
      soalBagi(tingkat, S.tanpa[0], pakai), soalBagi(tingkat, S.tanpa[1], pakai), soalBagi(tingkat, S.tanpa[2], pakai),
      soalCek(tingkat, S.cek, pakai), soalBenar(tingkat, S.cek, pakai),
    ];
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]), S = SPES[tingkat];
    if (soal.jenis === 'bagi') {
      // soal mirip: tipe sama (ada sisa / tidak ada sisa, nol di hasil bagi atau tidak)
      const spes = { digit: String(soal.a).length, sisa: soal.r > 0, nolQ: /0/.test(String(soal.q).slice(1)) };
      return soalBagi(tingkat, spes, pakai);
    }
    return soal.jenis === 'cek' ? soalCek(tingkat, S.cek, pakai) : soalBenar(tingkat, S.cek, pakai);
  }
  const periksaLangkah = (soal, i, pilihan) => (i < soal.langkah.length ? pilihan === soal.langkah[i].q : pilihan === soal.r);
  const periksaCek = (soal, pilihan) => ({ pilih: pilihan, benar: pilihan === soal.kunci });
  const periksaBenar = (soal, kunci) => ({ pilih: kunci, benar: kunci === soal.kunci });
  const sisaSoal = (soal) => soal.r > 0;

  const logika = { langkahBagi, buatAB, soalBagi, soalCek, soalBenar, buatRonde, soalMirip, periksaLangkah, periksaCek, periksaBenar, benarPasang, sisaSoal, SPES };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tombolOpsi } = H;
  const labelPasang = (q, r) => fmt(q) + (r > 0 ? ' sisa ' + r : '');

  function barisLangkah(soal, i, l, sorot) {
    const t = 'Ambil <b>' + fmt(l.ambil) + '</b>: ' + soal.b + ' muat <b>' + l.q + '</b> kali (' + l.q + ' × ' + soal.b + ' = ' + fmt(l.kali) + '), sisa ' + l.sisa;
    return el('div', 'b2-langkah' + (sorot ? ' salah' : ''), '<span class="no">' + (i + 1) + '</span><span>' + t + '</span>');
  }

  function tampilBagi(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks', '<span class="b2-soal">' + fmt(soal.a) + ' : ' + soal.b + ' = ?</span>'));
    const jejak = el('div', 'b2-jejak'), hasilBaris = el('div', 'b2-hasil-sementara'), bawah = el('div', 'b2-bawah');
    wadah.append(hasilBaris, jejak, bawah);
    const n = soal.langkah.length, total = n + (soal.r > 0 ? 1 : 0);
    let selesai = false, q = '';
    function langkah(i) {
      jejak.innerHTML = ''; bawah.innerHTML = '';
      hasilBaris.innerHTML = 'Hasil bagi sementara: <b>' + (q || '…') + '</b>';
      for (let k = 0; k < Math.min(i, n); k++) jejak.appendChild(barisLangkah(soal, k, soal.langkah[k]));
      let tanya, opsi;
      if (i < n) { const l = soal.langkah[i]; tanya = 'Langkah ' + (i + 1) + '. Ambil <b>' + fmt(l.ambil) + '</b>: ' + soal.b + ' muat berapa kali?'; opsi = soal.pilihan[i]; }
      else { tanya = 'Semua angka sudah dibagi. Berapa <b>sisanya</b>?'; opsi = soal.sisaOpsi; }
      bawah.appendChild(el('div', 'b2-tanya', tanya));
      bawah.appendChild(tombolOpsi(opsi.map((o) => ({ nilai: o, label: String(o) })), (nilai) => {
        if (selesai) return;
        if (periksaLangkah(soal, i, nilai)) {
          if (i + 1 >= total) { selesai = true; kirim({ benar: true }); return; }
          if (i < n) q += nilai;
          Suara.efek('pop'); langkah(i + 1);
        } else { selesai = true; kirim({ benar: false, langkah: i, pilih: nilai }); }
      }));
    }
    langkah(0);
  }

  function tampilCek(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', '<b>' + fmt(soal.a) + ' : ' + soal.b + ' = ' + labelPasang(soal.q, soal.r) + '</b>'));
    wadah.appendChild(el('div', 'soal-teks', '<span class="b2-soal">' + soal.b + ' × ' + fmt(soal.q) + (soal.r ? ' + ' + soal.r : '') + ' = ?</span>'));
    wadah.appendChild(el('div', 'ingat-kecil', 'Cek dengan perkalian: pembagi × hasil bagi' + (soal.r ? ' + sisa' : '') + ' harus kembali ke bilangan semula.'));
    wadah.appendChild(tombolOpsi(soal.opsi.map((o) => ({ nilai: o, label: fmt(o) })), (nilai) => kirim(periksaCek(soal, nilai))));
  }

  function tampilBenar(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks', '<span class="b2-soal">' + fmt(soal.a) + ' : ' + soal.b + ' = ?</span>'));
    wadah.appendChild(el('div', 'ingat-kecil', 'Mana hasil yang benar? Cek: pembagi × hasil bagi + sisa = bilangan semula, dan sisa harus lebih kecil dari pembagi.'));
    wadah.appendChild(tombolOpsi(soal.opsi.map((o) => ({ nilai: o.q + '|' + o.r, label: labelPasang(o.q, o.r) })), (nilai) => kirim(periksaBenar(soal, nilai)), 'dua'));
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'bagi') return tampilBagi(soal, wadah, kirim);
    return soal.jenis === 'cek' ? tampilCek(soal, wadah, kirim) : tampilBenar(soal, wadah, kirim);
  }

  function pujian(soal) {
    if (soal.jenis === 'cek') return { html: soal.b + ' × ' + fmt(soal.q) + (soal.r ? ' + ' + soal.r : '') + ' = <b>' + fmt(soal.a) + '</b>' };
    return { html: fmt(soal.a) + ' : ' + soal.b + ' = <b>' + labelPasang(soal.q, soal.r) + '</b>' };
  }

  function penjelasanCek(a, b, q, r) {
    return b + ' × ' + fmt(q) + ' = ' + fmt(b * q) + (r ? ', lalu + ' + r + ' = <b>' + fmt(a) + '</b>' : ' = <b>' + fmt(a) + '</b>');
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'des-alasan');
    if (soal.jenis === 'bagi') {
      const salahDi = jawaban.langkah;
      soal.langkah.forEach((l, i) => {
        if (i > salahDi) return;
        kolom.appendChild(barisLangkah(soal, i, l, i === salahDi));
      });
      let teks;
      if (salahDi < soal.langkah.length) {
        const l = soal.langkah[salahDi], c = jawaban.pilih;
        teks = 'Kamu memilih ' + c + ': ' + c + ' × ' + soal.b + ' = ' + fmt(c * soal.b) + (c * soal.b > l.ambil ? ', lebih besar dari ' + fmt(l.ambil) + ' (terlalu besar).' : ', sisanya ' + fmt(l.ambil - c * soal.b) + ' masih ' + (l.ambil - c * soal.b >= soal.b ? 'bisa dibagi lagi (sisa harus lebih kecil dari ' + soal.b + ').' : 'kurang dari pembagi, tapi bukan hasil terbaik.'));
        teks += '<br>Dihitung ulang: ' + l.q + ' × ' + soal.b + ' = ' + fmt(l.kali) + ', sisa ' + fmt(l.ambil) + ' − ' + fmt(l.kali) + ' = <b>' + l.sisa + '</b>.';
      } else {
        teks = 'Kamu memilih sisa ' + jawaban.pilih + '. ' + (soal.sisaSebab[jawaban.pilih] || '') + '<br>Sisanya adalah angka yang tersisa di langkah terakhir: <b>' + soal.r + '</b>.';
      }
      kolom.appendChild(el('div', 'kotak-teks', teks + '<br><b>' + fmt(soal.a) + ' : ' + soal.b + ' = ' + labelPasang(soal.q, soal.r) + '</b> &nbsp;<small>Cek: ' + penjelasanCek(soal.a, soal.b, soal.q, soal.r) + '</small>'));
    } else if (soal.jenis === 'cek') {
      kolom.appendChild(el('div', 'kotak-teks', '<b>' + penjelasanCek(soal.a, soal.b, soal.q, soal.r) + '</b><br><small>Kamu memilih ' + fmt(jawaban.pilih) + '. ' + (soal.sebab[jawaban.pilih] || '') + '</small>'));
    } else {
      const baris = soal.opsi.map((o) => {
        const ok = benarPasang(soal.a, soal.b, o.q, o.r);
        return '<div class="b2-cek ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✓' : '✗') + ' ' + labelPasang(o.q, o.r) + ': ' + soal.b + ' × ' + fmt(o.q) + ' + ' + o.r + ' = ' + fmt(soal.b * o.q + o.r) + (o.r >= soal.b ? ' (sisa ≥ pembagi!)' : '') + '</div>';
      }).join('');
      kolom.appendChild(el('div', 'kotak-teks', 'Cek tiap pilihan: <b>pembagi × hasil bagi + sisa</b> harus = ' + fmt(soal.a) + ', dan sisa lebih kecil dari ' + soal.b + '.'));
      kolom.appendChild(el('div', 'b2-cek-daftar', baris));
    }
    wadah.appendChild(kolom);
  }

  root.GameBagiBersusun = Object.assign({
    id: 'bagi-bersusun',
    tingkat: ['tanpa sisa', 'bersisa', 'bilangan 3-4 angka'],
    ingat: 'Porogapit: ambil angka, muat berapa kali?, kurangi, turunkan angka berikutnya. Sisa harus lebih kecil dari pembagi. Cek: pembagi × hasil + sisa.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
