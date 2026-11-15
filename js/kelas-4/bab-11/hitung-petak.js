// Mini game 🟦 Hitung Petak (Kelas 4 Bab 11).
// Soal 1-3: bangun di kertas petak -> KETUK petak untuk mengisinya (bernomor 1, 2, 3, ...; dua setengah petak diketuk berpasangan = 1) -> pilih luasnya.
// Soal 4-5: persegi panjang / persegi berlabel (petak tidak digambar, atau hanya baris & kolom pertama) -> pilih luas. Tingkat 3: cari sisi dari luas, pilih satuan.
// Tingkat 1: petak utuh, wajib ketuk tiap petak, persegi panjang kecil · 2: + setengah petak (segitiga, trapesium, jajargenjang), p x l cm / m · 3: pengecoh beda satuan (48 cm vs 48 cm²), luas -> sisi, pilih satuan.
// Kunci: jumlah kuartal petak / 4 (kode), p x l; pengecoh dari salah umum (setengah petak dihitung 1, keliling, p + l). Cek: node tools/cek-bab11.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const L = modul ? require('./luas.js') : root.Luas;
  const { acak, pilih, kocok, selDari, luasDariSel, kelilingPts, opsiSatuan, kuadrat, lurus, teksSatuan, teksNilai, bentukL, persegiPanjang, lebarTinggi } = L;

  // ---------- Logika (tanpa DOM) ----------
  const nilai = (v, u) => ({ kode: v + '|' + u, v, u, teks: teksNilai({ v, u }) });
  const dari = (o) => nilai(o.v, o.u);
  // pilihan (4) dengan kunci, pengecoh wajib (selalu masuk bila berbeda) dan pengecoh tambahan
  function opsiNilai(kunci, wajib, kand) {
    const id = (o) => o.v + '|' + o.u, set = [kunci];
    const tambah = (o) => { if (Number.isInteger(o.v) && o.v > 0 && set.length < 4 && !set.some((x) => id(x) === id(o))) set.push(o); };
    (wajib || []).forEach(tambah);
    kocok(kand || []).forEach(tambah);
    for (let d = 1; set.length < 4; d++) [kunci.v + d, kunci.v - d].forEach((v) => tambah({ v, u: kunci.u }));
    return kocok(set).map(dari);
  }

  // bentuk di kertas petak (hanya sisi mendatar / tegak atau diagonal 45 derajat)
  const balikX = (pts) => { const [W] = lebarTinggi(pts); return pts.map((p) => [W - p[0], p[1]]); };
  const bentukPenuh = (tingkat) => {
    if (tingkat === 1 && Math.random() < 0.65) { const w = acak(2, 5), h = acak(2, 4); if (w * h >= 6) return { jenis: 'persegi panjang', pts: persegiPanjang(w, h) }; }
    if (tingkat === 1) { const W = acak(3, 5), H = acak(3, 4); return { jenis: 'bangun L', pts: bentukL(W, H, acak(1, W - 1), acak(1, H - 1)) }; }
    if (Math.random() < 0.5) { const w = acak(4, 7), h = acak(3, 5); return { jenis: 'persegi panjang', pts: persegiPanjang(w, h) }; }
    const W = acak(4, 7), H = acak(3, 5); return { jenis: 'bangun L', pts: bentukL(W, H, acak(1, W - 1), acak(1, H - 1)) };
  };
  function bentukSetengah(tingkat) {
    const besar = tingkat === 3, tipe = pilih(['segitiga', 'trapesium', 'jajargenjang', 'sama-kaki']);
    let pts, jenis;
    if (tipe === 'segitiga') { const n = pilih(besar ? [6] : [4, 6]); pts = [[0, 0], [n, 0], [0, n]]; jenis = 'segitiga siku-siku'; }
    else if (tipe === 'trapesium') {
      for (;;) { const a = acak(6, besar ? 9 : 8), c = acak(1, besar ? 3 : 2); if (a - 2 * c >= 2) { pts = [[0, 0], [a, 0], [a - c, c], [c, c]]; break; } }
      jenis = 'trapesium';
    } else if (tipe === 'jajargenjang') { const a = acak(3, besar ? 6 : 5), c = acak(1, besar ? 3 : 2); pts = [[0, 0], [a, 0], [a + c, c], [c, c]]; jenis = 'jajargenjang'; }
    else { const k = pilih(besar ? [3, 4] : [2, 3]); pts = [[0, 0], [2 * k, 0], [k, k]]; jenis = 'segitiga sama kaki'; }
    if (Math.random() < 0.5) pts = balikX(pts);
    return { jenis, pts };
  }

  function soalPetak(tingkat, mode, bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      const b = mode === 'setengah' ? bentukSetengah(tingkat) : bentukPenuh(tingkat), sel = selDari(b.pts);
      if (sel.some((s) => s.q !== 4 && s.q !== 2)) continue; // hanya petak utuh dan setengah
      const half = sel.filter((s) => s.q === 2).length;
      if (half % 2) continue; // luas harus bilangan bulat
      const penuh = sel.filter((s) => s.q === 4).length, luas = luasDariSel(sel);
      const kode = 'k' + JSON.stringify(b.pts);
      if (kode === bukanKode) continue;
      const kel = kelilingPts(b.pts);
      const kand = [{ v: penuh, u: 'petak' }, { v: penuh + half, u: 'petak' }, { v: luas + 1, u: 'petak' }, { v: luas - 1, u: 'petak' }];
      if (kel) kand.push({ v: kel, u: 'petak' });
      const [W, H] = lebarTinggi(b.pts);
      return { jenis: 'petak', tingkat, bentuk: b.jenis, pts: b.pts, W, H, penuh, setengah: half, kunci: nilai(luas, 'petak').kode, luas, wajib: tingkat === 1, opsi: opsiNilai({ v: luas, u: 'petak' }, [], kand), kode };
    }
    throw new Error('soalPetak gagal');
  }

  const ANGKA_SERING = [6, 7, 8, 12];
  function angkaSisi(tingkat, min, maks) {
    if (tingkat >= 2 && Math.random() < 0.55) { const k = ANGKA_SERING.filter((x) => x >= min && x <= maks); if (k.length) return pilih(k); }
    return acak(min, maks);
  }
  function soalRumus(tingkat, bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      const p = tingkat === 1 ? acak(3, 8) : angkaSisi(tingkat, 4, 12), l = tingkat === 1 ? acak(2, 6) : angkaSisi(tingkat, 3, 9);
      if (p === l || p < l) continue;
      const satuan = tingkat === 1 ? 'cm' : pilih(['cm', 'm']), u = kuadrat(satuan), kode = 'r' + p + 'x' + l + satuan;
      if (kode === bukanKode) continue;
      const kunci = p * l, kel = 2 * (p + l);
      let opsi;
      if (tingkat < 3) opsi = opsiNilai({ v: kunci, u }, [{ v: p + l, u }, { v: kel, u }], [{ v: kunci + p, u }, { v: kunci - l, u }]);
      else opsi = opsiNilai({ v: kunci, u }, [{ v: kunci, u: satuan }, { v: kel, u: satuan }], [{ v: p + l, u }, { v: kunci + p, u }]);
      return { jenis: 'rumus', tingkat, p, l, satuan, grid: tingkat === 1 ? 'tepi' : 'tidak', kunci: nilai(kunci, u).kode, luas: kunci, keliling: kel, opsi, kode };
    }
    throw new Error('soalRumus gagal');
  }
  function soalPersegi(tingkat, bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      const s = tingkat === 1 ? acak(3, 6) : acak(4, 9), satuan = tingkat === 1 ? 'cm' : pilih(['cm', 'm']), u = kuadrat(satuan), kode = 's' + s + satuan;
      if (kode === bukanKode) continue;
      const kunci = s * s;
      return { jenis: 'persegi', tingkat, s, satuan, grid: 'tidak', kunci: nilai(kunci, u).kode, luas: kunci, opsi: opsiNilai({ v: kunci, u }, [{ v: 4 * s, u }], [{ v: 2 * s, u }, { v: kunci + s, u }, { v: kunci - s, u }]), kode };
    }
    throw new Error('soalPersegi gagal');
  }
  // tingkat 3: luas diketahui, cari sisi (kunci pakai satuan panjang)
  function soalCari(bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      const p = pilih([6, 7, 8, 9, 12]), l = acak(3, 9);
      if (p === l) continue;
      const satuan = pilih(['cm', 'm']), kode = 'c' + p + 'x' + l + satuan;
      if (kode === bukanKode) continue;
      const L2 = p * l, kunci = { v: l, u: satuan };
      return { jenis: 'cari', tingkat: 3, p, l, satuan, luasSoal: L2, kunci: nilai(l, satuan).kode, opsi: opsiNilai(kunci, [{ v: l, u: kuadrat(satuan) }], [{ v: L2 - p, u: satuan }, { v: L2 + p, u: satuan }, { v: p + l, u: satuan }]), kode };
    }
    throw new Error('soalCari gagal');
  }
  function soalPersegiLuas(bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      const s = acak(4, 12), satuan = pilih(['cm', 'm']), kode = 'q' + s + satuan;
      if (kode === bukanKode) continue;
      const L2 = s * s, kunci = { v: s, u: satuan };
      const kand = [{ v: L2 / 2, u: satuan }, { v: 4 * s, u: satuan }, { v: 2 * s, u: satuan }];
      if (L2 % 4 === 0) kand.push({ v: L2 / 4, u: satuan });
      return { jenis: 'persegiLuas', tingkat: 3, s, satuan, luasSoal: L2, kunci: nilai(s, satuan).kode, opsi: opsiNilai(kunci, [{ v: s, u: kuadrat(satuan) }], kand), kode };
    }
    throw new Error('soalPersegiLuas gagal');
  }
  // pilih satuan (tingkat 3)
  const BENDA_SATUAN = [
    { id: 'sampul', ikon: '📒', teks: 'Luas sampul buku tulis = 600', kunci: 'cm2', ket: '30 cm × 20 cm = 600 cm²' },
    { id: 'voli', ikon: '🏐', teks: 'Luas lapangan voli = 162', kunci: 'm2', ket: '18 m × 9 m = 162 m²' },
    { id: 'pagar', ikon: '🌳', teks: 'Panjang pagar yang mengelilingi kebun = 38', kunci: 'm', ket: '2 × (12 m + 7 m) = 38 m' },
    { id: 'meja', ikon: '🪑', teks: 'Keliling permukaan meja = 360', kunci: 'cm', ket: '2 × (120 cm + 60 cm) = 360 cm' },
    { id: 'kamar', ikon: '🛏️', teks: 'Luas lantai kamar = 12', kunci: 'm2', ket: '4 m × 3 m = 12 m²' },
    { id: 'kertas', ikon: '🖍️', teks: 'Keliling kertas gambar = 100', kunci: 'cm', ket: '2 × (30 cm + 20 cm) = 100 cm' },
    { id: 'kartu', ikon: '✉️', teks: 'Luas kartu pos = 150', kunci: 'cm2', ket: '15 cm × 10 cm = 150 cm²' },
    { id: 'halaman', ikon: '🏫', teks: 'Luas halaman sekolah = 400', kunci: 'm2', ket: '20 m × 20 m = 400 m²' },
    { id: 'tali', ikon: '🧺', teks: 'Panjang tali jemuran = 8', kunci: 'm', ket: 'tali = garis (panjang), jadi m' },
    { id: 'taman', ikon: '🌷', teks: 'Keliling taman = 36', kunci: 'm', ket: '2 × (10 m + 8 m) = 36 m' },
  ];
  const OPSI_SATUAN = [{ kode: 'cm', teks: 'cm' }, { kode: 'cm2', teks: 'cm²' }, { kode: 'm', teks: 'm' }, { kode: 'm2', teks: 'm²' }];
  function soalSatuan(bukanKode) {
    for (let coba = 0; coba < 100; coba++) {
      const b = pilih(BENDA_SATUAN);
      if (b.id === bukanKode) continue;
      return { jenis: 'satuan', tingkat: 3, benda: b.id, ikon: b.ikon, teksBenda: b.teks, ket: b.ket, kunci: b.kunci, opsi: OPSI_SATUAN, kode: b.id };
    }
    throw new Error('soalSatuan gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      let r;
      if (tingkat === 1) r = [soalPetak(1, 'penuh'), soalPetak(1, 'penuh'), soalPetak(1, 'penuh'), soalRumus(1), soalPersegi(1)];
      else if (tingkat === 2) r = [soalPetak(2, 'setengah'), soalPetak(2, 'setengah'), soalPetak(2, 'penuh'), soalRumus(2), soalPersegi(2)];
      else r = [soalPetak(3, 'setengah'), soalRumus(3), soalCari(), soalPersegiLuas(), soalSatuan()];
      if (new Set(r.map((s) => s.kode)).size !== 5) continue;
      return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'petak') s = soalPetak(tingkat, soal.setengah > 0 ? 'setengah' : 'penuh', soal.kode);
      else if (soal.jenis === 'rumus') s = soalRumus(tingkat, soal.kode);
      else if (soal.jenis === 'persegi') s = soalPersegi(tingkat, soal.kode);
      else if (soal.jenis === 'cari') s = soalCari(soal.kode);
      else if (soal.jenis === 'persegiLuas') s = soalPersegiLuas(soal.kode);
      else s = soalSatuan(soal.kode);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.kunci, pilih: kode });
  const teksOpsi = (soal, kode) => { const o = soal.opsi.find((x) => x.kode === kode); return o ? o.teks : kode; };

  // urutan mengisi untuk penjelasan: petak utuh (baris demi baris dari atas) lalu pasangan setengah petak
  function urutanIsi(pts) {
    const sel = selDari(pts).slice().sort((a, b) => b.j - a.j || a.i - b.i);
    const penuh = sel.filter((s) => s.q === 4), half = sel.filter((s) => s.q === 2), langkah = [];
    penuh.forEach((s, k) => langkah.push({ sel: [s], nomor: k + 1 }));
    for (let k = 0; k < half.length; k += 2) langkah.push({ sel: [half[k], half[k + 1]], nomor: penuh.length + k / 2 + 1 });
    return langkah;
  }
  const logika = { soalPetak, soalRumus, soalPersegi, soalCari, soalPersegiLuas, soalSatuan, BENDA_SATUAN, buatRonde, soalMirip, periksa, urutanIsi, opsiNilai };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, svgEl, teks, kanvas, polaPetak, garisPetak, isiSel, tepiBangun, labelSisi, ketukSel, petakMuat, batasGambar, semuaPojok, tandaSama, BIRU, MERAH, TINTA } = L;
  const KUNING = '#FFC400';

  function gambarBangun(soal, ukuranMaks) {
    const batas = ukuranMaks || batasGambar();
    const pts = soal.jenis === 'petak' ? soal.pts : soal.jenis === 'rumus' ? persegiPanjang(soal.p, soal.l) : soal.jenis === 'persegi' ? persegiPanjang(soal.s, soal.s) : soal.jenis === 'cari' ? persegiPanjang(soal.p, soal.l) : persegiPanjang(5, 5);
    const [W, H] = lebarTinggi(pts), m = soal.jenis === 'petak' ? 16 : 56, mx = soal.jenis === 'petak' ? 16 : soal.jenis === 'rumus' || soal.jenis === 'cari' ? 108 : 62;
    const u = petakMuat(W, H, batas.w, batas.h, m, soal.jenis === 'petak' ? 60 : 52, mx), K = kanvas(W, H, u, m, mx);
    polaPetak(K, pts);
    garisPetak(K, soal.jenis === 'petak' ? 'penuh' : (soal.grid || 'tidak'));
    tepiBangun(K, pts, TINTA, soal.jenis === 'petak' ? 5 : 6);
    if (soal.jenis !== 'petak') semuaPojok(K, pts);
    return { K, pts, W, H };
  }
  const kel = (soal, v) => v + ' ' + soal.satuan;

  function tandaBangun(soal, G) {
    const { K, pts } = G;
    if (soal.jenis === 'rumus') { labelSisi(K, pts, 0, 'p = ' + kel(soal, soal.p)); labelSisi(K, pts, 3, 'l = ' + kel(soal, soal.l), TINTA, 56); }
    else if (soal.jenis === 'persegi') { labelSisi(K, pts, 0, 's = ' + kel(soal, soal.s)); [0, 1, 2, 3].forEach((i) => L.tandaSama(K, pts, i)); }
    else if (soal.jenis === 'cari') { labelSisi(K, pts, 0, 'p = ' + kel(soal, soal.p)); labelSisi(K, pts, 3, 'l = ?', MERAH, 56); teks(K.label, K.lebar / 2, K.tinggi / 2, 'Luas = ' + teksNilai({ v: soal.luasSoal, u: kuadrat(soal.satuan) }), 24, '#1B6FE0'); }
    else if (soal.jenis === 'persegiLuas') { labelSisi(K, pts, 0, 's = ?', MERAH); [0, 1, 2, 3].forEach((i) => L.tandaSama(K, pts, i)); teks(K.label, K.lebar / 2, K.tinggi / 2, 'Luas = ' + teksNilai({ v: soal.luasSoal, u: kuadrat(soal.satuan) }), 24, '#1B6FE0'); }
  }

  function teksSoal(soal) {
    if (soal.jenis === 'petak') return soal.wajib ? 'Ketuk <b>semua petak</b> di dalam bangun ini, lalu pilih <b>luas</b>-nya.' : 'Hitung <b>luas</b> bangun ini. <small>Ketuk petak untuk membantu menghitung.</small>';
    if (soal.jenis === 'rumus') return 'Persegi panjang <b>p = ' + kel(soal, soal.p) + '</b>, <b>l = ' + kel(soal, soal.l) + '</b>.<br>Berapa <b>luas</b>-nya?';
    if (soal.jenis === 'persegi') return 'Persegi dengan sisi <b>' + kel(soal, soal.s) + '</b>.<br>Berapa <b>luas</b>-nya?';
    if (soal.jenis === 'cari') return 'Luas persegi panjang <b>' + teksNilai({ v: soal.luasSoal, u: kuadrat(soal.satuan) }) + '</b>. Panjangnya <b>' + kel(soal, soal.p) + '</b>.<br>Berapa <b>lebar</b>-nya?';
    if (soal.jenis === 'persegiLuas') return 'Luas persegi <b>' + teksNilai({ v: soal.luasSoal, u: kuadrat(soal.satuan) }) + '</b>.<br>Berapa <b>panjang sisi</b>-nya?';
    return 'Pilih <b>satuan</b> yang tepat:';
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    const baris = el('div', 'jg-baris');
    const tempat = el('div', 'sudut-tempat');
    const kanan = el('div', 'des-kanan lk-kanan');
    const info = el('div', 'hs-info lk-info', '');
    const opsiEl = el('div', 'hs-opsi');
    const tombol = [];
    if (soal.jenis === 'satuan') {
      tempat.appendChild(el('div', 'lk-benda', '<div class="lk-benda-ikon">' + soal.ikon + '</div><div class="lk-benda-teks">' + soal.teksBenda + ' <span class="lk-titik">…</span></div>'));
      kanan.append(el('div', 'lk-arti', '<b>Luas</b> = petak persegi di dalam bangun → <b>cm²</b>, <b>m²</b>.<br><b>Keliling</b> dan panjang = garis → <b>cm</b>, <b>m</b>.'));
    } else {
      const G = gambarBangun(soal), { K } = G;
      tempat.appendChild(K.svg);
      if (soal.jenis !== 'petak') {
        tandaBangun(soal, G);
        kanan.append(el('div', 'lk-arti', '<b>Luas</b> = banyak petak yang menutupi bagian dalam bangun. <b>1 ' + teksSatuan(kuadrat(soal.satuan || 'cm')) + '</b> = petak persegi bersisi 1 ' + (soal.satuan || 'cm') + '.'), el('div', 'ingat-kecil', soal.grid === 'tepi' ? 'Petak di baris & kolom pertama<br>sudah digambar. Kalikan!' : 'Gambar tidak sesuai ukuran.'));
      } else {
        const sel = selDari(soal.pts), total = sel.length;
        let c = 0, selesai = 0, menunggu = null;
        const diketuk = new Set();
        const perbarui = () => {
          const semua = diketuk.size >= total;
          info.innerHTML = 'Petak yang sudah dihitung: <b>' + c + '</b>' + (menunggu ? ' <span class="lk-setengah">+ ½</span>' : '') + (semua ? '<br>Semua petak sudah dihitung.<br>Sekarang pilih luasnya.' : '');
          if (soal.wajib) tombol.forEach((b) => { b.disabled = !semua; });
        };
        sel.forEach((s) => {
          ketukSel(K, s, () => {
            const id = s.i + ',' + s.j;
            if (diketuk.has(id)) return;
            diketuk.add(id); Suara.efek('pop');
            if (s.q === 4) { c++; isiSel(K, s, BIRU, 0.5, c); }
            else if (!menunggu) { menunggu = { s, g: isiSel(K, s, KUNING, 0.7, '½') }; }
            else { menunggu.g.remove(); c++; isiSel(K, menunggu.s, BIRU, 0.5, c); isiSel(K, s, BIRU, 0.5, c); menunggu = null; }
            perbarui();
          });
        });
        kanan.append(info, el('div', 'ingat-kecil', soal.setengah ? 'Dua <b>setengah</b> petak dijadikan <b>1</b> petak.<br>Ketuk dua setengah petak berurutan.' : 'Ketuk setiap petak.'));
        perbarui();
      }
    }
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol', o.teks);
      b.onclick = () => kirim(periksa(soal, o.kode));
      tombol.push(b); opsiEl.appendChild(b);
    });
    if (soal.jenis === 'petak' && soal.wajib) tombol.forEach((b) => { b.disabled = true; });
    wadah.appendChild(opsiEl);
  }

  function pujian(soal) {
    if (soal.jenis === 'petak') return { html: soal.setengah ? soal.penuh + ' utuh + ' + soal.setengah + ' setengah (' + soal.setengah + ' ÷ 2 = ' + soal.setengah / 2 + ') = <b>' + soal.luas + ' petak</b>' : 'Ada <b>' + soal.luas + ' petak</b>.' };
    if (soal.jenis === 'rumus') return { html: soal.p + ' × ' + soal.l + ' = <b>' + soal.luas + ' ' + teksSatuan(kuadrat(soal.satuan)) + '</b>' };
    if (soal.jenis === 'persegi') return { html: soal.s + ' × ' + soal.s + ' = <b>' + soal.luas + ' ' + teksSatuan(kuadrat(soal.satuan)) + '</b>' };
    if (soal.jenis === 'cari') return { html: soal.luasSoal + ' : ' + soal.p + ' = <b>' + soal.l + ' ' + soal.satuan + '</b>' };
    if (soal.jenis === 'persegiLuas') return { html: soal.s + ' × ' + soal.s + ' = ' + soal.luasSoal + ', jadi sisinya <b>' + soal.s + ' ' + soal.satuan + '</b>' };
    return { html: soal.ket + ' → <b>' + teksOpsi(soal, soal.kunci) + '</b>' };
  }

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    const tempat = el('div', 'sudut-tempat');
    const teksEl = el('div', 'kotak-teks', '');
    const salah = teksOpsi(soal, jawaban.pilih);
    if (soal.jenis === 'satuan') {
      tempat.appendChild(el('div', 'lk-benda lk-benda-kecil', '<div class="lk-benda-ikon">' + soal.ikon + '</div>'));
      teksEl.innerHTML = '<b>' + soal.teksBenda + ' ' + teksOpsi(soal, soal.kunci) + '</b><br>' + soal.ket + '.<br>Luas = petak persegi → cm² atau m². Keliling dan panjang = garis → cm atau m.<br><small>Kamu memilih ' + salah + '.</small>';
      baris.append(tempat, teksEl); wadah.appendChild(baris); return;
    }
    if (soal.jenis === 'cari' || soal.jenis === 'persegiLuas') {
      const G = gambarBangun(soal, { w: 420, h: 250 }); tandaBangun(soal, G); tempat.appendChild(G.K.svg);
      if (soal.jenis === 'cari') teksEl.innerHTML = 'Luas = p × l<br>' + soal.luasSoal + ' = ' + soal.p + ' × ?<br>' + soal.luasSoal + ' : ' + soal.p + ' = <b>' + soal.l + ' ' + soal.satuan + '</b><br><small>Sisi memakai satuan panjang (' + soal.satuan + '), bukan ' + teksSatuan(kuadrat(soal.satuan)) + '. Kamu memilih ' + salah + '.</small>';
      else teksEl.innerHTML = 'Luas persegi = s × s<br>' + soal.s + ' × ' + soal.s + ' = ' + soal.luasSoal + '<br>Jadi sisinya <b>' + soal.s + ' ' + soal.satuan + '</b>.<br><small>Kamu memilih ' + salah + '.</small>';
      baris.append(tempat, teksEl); wadah.appendChild(baris); return;
    }
    let G, langkah;
    if (soal.jenis === 'petak') {
      G = gambarBangun(soal, { w: 520, h: 270 }); langkah = urutanIsi(soal.pts);
    } else { // persegi panjang / persegi: isi baris demi baris
      const p = soal.jenis === 'rumus' ? soal.p : soal.s, l = soal.jenis === 'rumus' ? soal.l : soal.s;
      G = gambarBangun(Object.assign({}, soal, { grid: 'penuh' }), { w: 520, h: 270 }); tandaBangun(soal, G);
      langkah = []; for (let r = 0; r < l; r++) langkah.push({ sel: Array.from({ length: p }, (_, i) => ({ i, j: l - 1 - r, q: 4 })), baris: r + 1 });
    }
    tempat.appendChild(G.K.svg);
    let k = 0;
    const teksAwal = () => {
      if (soal.jenis === 'petak') return 'Petak dihitung satu per satu: <b>' + (k ? langkah[k - 1].nomor : 0) + '</b>' + (k >= langkah.length ? '' : '…');
      const p = soal.jenis === 'rumus' ? soal.p : soal.s;
      return k ? '<b>' + k + ' baris</b>, tiap baris <b>' + p + ' petak</b><br>' + k + ' × ' + p + ' = <b>' + k * p + '</b>' + (k >= langkah.length ? '' : '…') : 'Petak diisi baris demi baris…';
    };
    const akhir = () => {
      let t = '';
      if (soal.jenis === 'petak') {
        t = soal.setengah ? '<br>' + soal.penuh + ' petak utuh + ' + soal.setengah + ' setengah petak (2 setengah = 1 petak) = <b>' + soal.luas + ' petak</b>.' : '<br>Jadi luasnya <b>' + soal.luas + ' petak</b>.';
        const kelP = kelilingPts(soal.pts);
        if (kelP && jawaban.pilih === kelP + '|petak') t += '<br><small>' + kelP + ' itu <b>keliling</b> (jalan di tepi). Yang ditanya <b>luas</b> (petak di dalam).</small>';
        else if (soal.setengah && jawaban.pilih === (soal.penuh + soal.setengah) + '|petak') t += '<br><small>Dua setengah petak = 1 petak, bukan 2 petak.</small>';
        else if (soal.setengah && jawaban.pilih === soal.penuh + '|petak') t += '<br><small>Setengah petak juga dihitung ya.</small>';
        else t += '<br><small>Kamu memilih ' + salah + '.</small>';
      } else {
        const p = soal.jenis === 'rumus' ? soal.p : soal.s, l = soal.jenis === 'rumus' ? soal.l : soal.s, u = teksSatuan(kuadrat(soal.satuan));
        t = '<br>Luas = ' + (soal.jenis === 'rumus' ? 'p × l' : 's × s') + ' = ' + p + ' × ' + l + ' = <b>' + p * l + ' ' + u + '</b>.';
        const v = jawaban.pilih.split('|');
        if (Number(v[0]) === 2 * (p + l) && soal.jenis === 'rumus') t += '<br><small>' + v[0] + ' itu <b>keliling</b> (jalan di tepi). Yang ditanya <b>luas</b>.</small>';
        else if (Number(v[0]) === 4 * p && soal.jenis === 'persegi') t += '<br><small>' + v[0] + ' itu <b>keliling</b> (4 × s). Yang ditanya <b>luas</b>.</small>';
        else if (Number(v[0]) === p + l && soal.jenis === 'rumus') t += '<br><small>p + l bukan luas. Luas = petak di dalam: p × l.</small>';
        else if (Number(v[0]) === p * l && v[1] !== kuadrat(soal.satuan)) t += '<br><small>Angkanya benar, tetapi satuan luas itu <b>' + u + '</b> (petak persegi), bukan ' + teksSatuan(v[1]) + '.</small>';
        else t += '<br><small>Kamu memilih ' + salah + '.</small>';
      }
      return t;
    };
    teksEl.innerHTML = teksAwal();
    const t = setInterval(() => {
      if (!tempat.isConnected) { clearInterval(t); return; }
      const st = langkah[k++];
      st.sel.forEach((s) => {
        const full = soal.jenis === 'petak' ? (selDari(soal.pts).find((x) => x.i === s.i && x.j === s.j) || s) : s;
        isiSel(G.K, full, BIRU, 0.5, st.nomor != null ? st.nomor : (soal.jenis === 'petak' ? null : (st.baris - 1) * st.sel.length + s.i + 1));
      });
      Suara.efek('pop');
      teksEl.innerHTML = teksAwal() + (k >= langkah.length ? akhir() : '');
      if (k >= langkah.length) clearInterval(t);
    }, soal.jenis === 'petak' ? Math.max(120, Math.min(420, 4200 / langkah.length)) : 600);
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GameHitungPetak = Object.assign({
    id: 'hitung-petak',
    tingkat: ['petak utuh & persegi panjang kecil', 'setengah petak & rumus p × l', 'cari sisi, satuan cm² dan m²'],
    ingat: 'Luas = banyak petak persegi yang menutupi bagian dalam bangun. Dua setengah petak = 1 petak. Persegi panjang: p × l. Persegi: s × s. Satuan luas: cm², m².',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
