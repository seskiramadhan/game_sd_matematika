// Mini game ✂️ Potong Bangun (Kelas 4 Bab 11).
// Soal 1-3: bangun huruf L / T / U -> KETUK garis potong (2 cara, garis putus-putus) -> bangun terbelah jadi persegi panjang berwarna -> pilih luas tiap bagian -> pilih jumlahnya.
// Soal 4-5: JEBAKAN, dua bangun di kertas petak -> pilih: luas sama / keliling sama / dua-duanya sama / dua-duanya beda. Tingkat 3: "mana keliling paling pendek" dan "geser 1 petak".
// Tingkat 1: bangun L di kertas petak (luas bisa dicek dengan menghitung petak) · 2: L & T berlabel + jebakan dua persegi panjang · 3: L, T, U berlabel besar (cara kurang di penjelasan) + paling pendek + geser.
// Kunci: jumlah p x l tiap bagian (kode), dicek silang dengan hitungan petak, cara kurang dan keliling dari sisi. Cek: node tools/cek-bab11.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const L = modul ? require('./luas.js') : root.Luas;
  const { acak, pilih, kocok, jumlah, opsiAngka, acakL, acakT, acakU, luasBagian, luasKurang, persegiPanjang, bentukL, tangga, ukur, banding, OPSI_JEBAKAN, kuadrat, teksSatuan, kelilingPts, luasPts } = L;

  // ---------- Logika (tanpa DOM) ----------
  function soalPotong(tingkat, jenis, bukanKode) {
    for (let coba = 0; coba < 300; coba++) {
      let b;
      if (tingkat === 1) b = acakL(4, 6, 4, 5, 2);
      else if (jenis === 'T') b = acakT(7, 10, 5, 8);
      else if (jenis === 'U') b = acakU(8, 10, 6, 8);
      else b = tingkat === 2 ? acakL(6, 10, 5, 8, 2) : acakL(8, 10, 6, 8, 2);
      if (tingkat === 3 && jenis === 'T') b = acakT(8, 10, 6, 8);
      const kode = 'p' + b.jenis + JSON.stringify(b.pts);
      if (kode === bukanKode) continue;
      const satuan = tingkat === 1 ? 'petak' : pilih(['cm', 'm']);
      const luas = L.luasPts(b.pts);
      return { jenis: 'potong', tingkat, bentuk: b, grid: tingkat === 1, satuan, luas, kunci: luas, kode, nama: b.jenis };
    }
    throw new Error('soalPotong gagal');
  }
  const kalimatBagian = (b) => b.w + ' × ' + b.h + ' = ' + b.w * b.h;
  // pilihan luas satu bagian
  const opsiBagian = (b) => opsiAngka(b.w * b.h, [b.w + b.h, 2 * (b.w + b.h), b.w * b.h + b.w, b.w * b.h - b.h]);
  // pilihan luas keseluruhan
  function opsiTotal(soal, cara) {
    const b = soal.bentuk, bag = cara.bagian.map(luasBagian), total = jumlah(bag);
    const kand = [b.W * b.H, total + bag[0], total - bag[bag.length - 1], L.kelilingPts(b.pts)];
    if (bag.length > 2) kand.push(bag[0] + bag[1]);
    return opsiAngka(total, kand);
  }

  // ---------- Jebakan ----------
  const AREA_PASANG = [12, 16, 18, 20, 24, 30];
  const pasangFaktor = (a, wMaks) => { const r = []; for (let h = 2; h * h <= a; h++) if (a % h === 0 && a / h <= wMaks) r.push([a / h, h]); return r; };
  function pasangan(tipe) {
    for (let coba = 0; coba < 500; coba++) {
      let A, B;
      if (tipe === 'luasSama') {
        const a = pilih(AREA_PASANG), f = pasangFaktor(a, 10);
        if (f.length < 2) continue;
        const [x, y] = kocok(f).slice(0, 2); A = persegiPanjang(x[0], x[1]); B = persegiPanjang(y[0], y[1]);
      } else if (tipe === 'kelSama') {
        const S = acak(6, 9), w1 = acak(Math.ceil(S / 2), S - 1), w2 = acak(Math.ceil(S / 2), S - 1);
        if (w1 === w2) continue;
        A = persegiPanjang(w1, S - w1); B = persegiPanjang(w2, S - w2);
      } else if (tipe === 'beda') {
        A = persegiPanjang(acak(2, 8), acak(2, 5)); B = persegiPanjang(acak(2, 8), acak(2, 5));
      } else if (tipe === 'sama') { // bangun L dan persegi panjang yang luas & kelilingnya sama
        const W = acak(5, 8), H = acak(4, 6), w2 = acak(2, W - 2), h2 = acak(2, H - 2), Lp = bentukL(W, H, w2, h2), u = ukur(Lp);
        let ketemu = null;
        for (let w = 2; w <= u.keliling / 2 - 2; w++) { const h = u.keliling / 2 - w; if (w >= h && w * h === u.luas) ketemu = [w, h]; }
        if (!ketemu) continue;
        A = Lp; B = persegiPanjang(ketemu[0], ketemu[1]);
      } else { // geser: persegi panjang w x 3 dan tangga (satu petak pojok dipindah ke ujung baris bawah)
        const w = acak(3, 5);
        A = persegiPanjang(w, 3); B = tangga(w + 1, w, w - 1);
      }
      if (tipe !== 'sama' && Math.random() < 0.5) [A, B] = [B, A];
      const ua = ukur(A), ub = ukur(B);
      if (banding(ua, ub) !== (tipe === 'geser' ? 'luasSama' : tipe)) continue;
      const dx = Math.max(...A.map((p) => p[0])) > 10 || Math.max(...B.map((p) => p[0])) > 10;
      if (dx) continue;
      return { tipe, pts: [A, B], ukur: [ua, ub], kunci: banding(ua, ub) };
    }
    throw new Error('pasangan gagal ' + tipe);
  }
  function soalJebakan(tingkat, tipe, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const ps = pasangan(tipe), kode = 'j' + tipe + JSON.stringify(ps.pts);
      if (kode === bukanKode) continue;
      return { jenis: 'jebakan', tingkat, tipe, pts: ps.pts, ukur: ps.ukur, kunci: ps.kunci, opsi: kocok(OPSI_JEBAKAN.slice()), kode };
    }
    throw new Error('soalJebakan gagal');
  }
  // tingkat 3: luas sama (3 persegi panjang), mana keliling paling pendek
  const KELUARGA = { 12: [[12, 1], [6, 2], [4, 3]], 24: [[12, 2], [8, 3], [6, 4]], 36: [[12, 3], [9, 4], [6, 6]] };
  function soalPendek(bukanKode) {
    for (let coba = 0; coba < 100; coba++) {
      const luas = pilih([12, 24, 36]), kode = 'e' + luas;
      if (kode === bukanKode) continue;
      const bangun = kocok(KELUARGA[luas]).map(([w, h]) => ({ w, h, pts: persegiPanjang(w, h), keliling: 2 * (w + h) }));
      const min = Math.min(...bangun.map((x) => x.keliling)), kunci = 'b' + bangun.findIndex((x) => x.keliling === min);
      return { jenis: 'pendek', tingkat: 3, luas, bangun, kunci, opsi: bangun.map((_, i) => ({ kode: 'b' + i })), kode };
    }
    throw new Error('soalPendek gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      let r;
      if (tingkat === 1) { const t = kocok(['luasSama', 'kelSama']); r = [soalPotong(1), soalPotong(1), soalPotong(1), soalJebakan(1, t[0]), soalJebakan(1, t[1])]; }
      else if (tingkat === 2) { const j = kocok(['L', 'T', 'L']), t = kocok(['luasSama', 'kelSama', 'beda', 'sama']).slice(0, 2); r = [soalPotong(2, j[0]), soalPotong(2, j[1]), soalPotong(2, j[2]), soalJebakan(2, t[0]), soalJebakan(2, t[1])]; }
      else { const j = kocok(['L', 'T', 'U']); r = [soalPotong(3, j[0]), soalPotong(3, j[1]), soalPotong(3, j[2]), soalPendek(), soalJebakan(3, 'geser')]; }
      if (new Set(r.map((s) => s.kode)).size !== 5) continue;
      return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'potong') s = soalPotong(tingkat, soal.nama, soal.kode);
      else if (soal.jenis === 'jebakan') s = soalJebakan(tingkat, soal.tipe, soal.kode);
      else s = soalPendek(soal.kode);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.kunci, pilih: kode });
  const namaJebakan = (kode) => OPSI_JEBAKAN.find((o) => o.kode === kode).nama;

  const logika = { soalPotong, soalJebakan, soalPendek, pasangan, opsiBagian, opsiTotal, buatRonde, soalMirip, periksa, namaJebakan, KELUARGA, kalimatBagian };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { KECIL, el, svgEl, teks, kanvas, polaPetak, garisPetak, tepiBangun, labelSisi, ketukSisi, petakMuat, batasGambar, semuaPojok, bangunKecil, lebarTinggi, WARNA_BAGIAN, TINTA, MERAH, ORANYE } = L;
  const NAMA_WARNA = ['biru', 'jingga', 'hijau'], UNGU = '#9B5DE5';
  const satuanLuas = (soal) => (soal.grid ? 'petak' : teksSatuan(kuadrat(soal.satuan)));

  function gambarPotong(soal, { cara = null, garis = false, ukuranMaks = null, labelAktif = true } = {}) {
    const b = soal.bentuk, batas = ukuranMaks || batasGambar(), m = 50;
    const u = petakMuat(b.W, b.H, batas.w, batas.h, m, 52), K = kanvas(b.W, b.H, u, m);
    polaPetak(K, b.pts);
    if (cara) cara.bagian.forEach((g, k) => K.isi.appendChild(svgEl('rect', { x: K.px(g.x), y: K.py(g.y + g.h), width: g.w * u, height: g.h * u, fill: WARNA_BAGIAN[k % 3], 'fill-opacity': 0.4 })));
    if (soal.grid) garisPetak(K, 'penuh');
    tepiBangun(K, b.pts, TINTA, 6);
    semuaPojok(K, b.pts);
    if (cara) cara.garis.forEach((g) => K.tepi.appendChild(svgEl('line', { x1: K.px(g[0]), y1: K.py(g[1]), x2: K.px(g[2]), y2: K.py(g[3]), stroke: TINTA, 'stroke-width': 3, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' })));
    if (!soal.grid && labelAktif) L.lensDari(b.pts).forEach((x, i) => labelSisi(K, b.pts, i, String(x)));
    return K;
  }
  const dimBagian = (g) => g.w + ' × ' + g.h;
  const kotakWarna = (k) => '<span class="lk-chip" style="background:' + WARNA_BAGIAN[k % 3] + '"></span>';

  function tampilkanPotong(soal, wadah, kirim) {
    const b = soal.bentuk;
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Bangun huruf <b>' + b.jenis + '</b> ini dipotong jadi <b>persegi panjang</b>, lalu luasnya dijumlah.' + (soal.grid ? '' : ' <small>Ukuran dalam ' + soal.satuan + '.</small>')));
    const baris = el('div', 'jg-baris');
    const tempat = el('div', 'sudut-tempat');
    const kanan = el('div', 'des-kanan lk-kanan');
    const tanya = el('div', 'hs-info lk-info', 'Ketuk <b>garis putus-putus</b> untuk memotong bangun.');
    const sisa = el('div', 'lk-jumlah', '');
    const opsiEl = el('div', 'hs-opsi');
    const alat = el('div', 'lk-alat');
    kanan.append(tanya, sisa, el('div', 'ingat-kecil', 'Garis potong <b>bukan</b> bagian tepi bangun.'));
    baris.append(tempat, kanan);
    wadah.append(baris, alat, opsiEl);
    let K = gambarPotong(soal);
    const warnaCara = [ORANYE, UNGU];
    const garisPilih = () => {
      tempat.innerHTML = ''; K = gambarPotong(soal); tempat.appendChild(K.svg);
      b.cuts.forEach((c, ci) => c.garis.forEach((g) => {
        K.tepi.appendChild(svgEl('line', { x1: K.px(g[0]), y1: K.py(g[1]), x2: K.px(g[2]), y2: K.py(g[3]), stroke: warnaCara[ci], 'stroke-width': 6, 'stroke-dasharray': '12 8', 'stroke-linecap': 'round' }));
        const t = svgEl('line', { x1: K.px(g[0]), y1: K.py(g[1]), x2: K.px(g[2]), y2: K.py(g[3]), stroke: '#fff', 'stroke-opacity': 0, 'stroke-width': 36, 'stroke-linecap': 'round', class: 'lk-ketuk' });
        t.addEventListener('click', () => potong(c));
        K.atas.appendChild(t);
      }));
    };
    b.cuts.forEach((c, ci) => {
      const t = el('button', 'tombol tombol-bantu lk-potong', '✂️ ' + c.nama);
      t.style.borderBottom = '8px solid ' + warnaCara[ci];
      t.onclick = () => potong(c);
      alat.appendChild(t);
    });
    garisPilih();
    let cara = null, k = 0, jumlahBagian = [];
    function potong(c) {
      if (cara) return;
      cara = c; Suara.efek('pop'); alat.remove();
      tempat.innerHTML = ''; K = gambarPotong(soal, { cara }); tempat.appendChild(K.svg);
      tanyaBagian();
    }
    function pasang(teksTanya, opsi, uji) {
      tanya.innerHTML = teksTanya; opsiEl.innerHTML = '';
      opsi.forEach((v) => {
        const t = el('button', 'tombol', v + ' ' + satuanLuas(soal));
        t.onclick = () => uji(v);
        opsiEl.appendChild(t);
      });
    }
    function tanyaBagian() {
      const g = cara.bagian[k];
      sisa.innerHTML = jumlahBagian.length ? jumlahBagian.join(' + ') + ' + …' : '';
      pasang('Luas bagian <b>' + NAMA_WARNA[k] + '</b> ' + kotakWarna(k) + ' = ?', opsiBagian(g), (v) => {
        if (v !== luasBagian(g)) { kirim({ benar: false, pilih: v, tahap: k, potong: cara.id }); return; }
        Suara.efek('ding'); jumlahBagian.push(v); k++;
        if (k < cara.bagian.length) tanyaBagian(); else tanyaTotal();
      });
    }
    function tanyaTotal() {
      sisa.innerHTML = jumlahBagian.join(' + ') + ' = ?';
      pasang('Luas <b>seluruh bangun</b> = jumlah luas semua bagian.', opsiTotal(soal, cara), (v) => {
        kirim({ benar: v === soal.kunci, pilih: v, tahap: cara.bagian.length, potong: cara.id });
      });
    }
  }

  // kartu bangun (tombol atau diam) di kertas petak
  function kartuBangun(pts, opsi) { const d = el('div', 'lk-kartu-isi'); d.appendChild(bangunKecil(pts, opsi)); return d; }
  const kapital = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  function tampilkanJebakan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Bandingkan <b>luas</b> (petak di dalam) dan <b>keliling</b> (jalan di tepi) bangun A dan B.<br><small>Hitung petaknya dan jumlah sisinya, lalu pilih.</small>'));
    const baris = el('div', 'lk-dua');
    ['A', 'B'].forEach((h, i) => { const k = el('div', 'lk-kartu'); k.appendChild(el('div', 'lk-kartu-judul', 'Bangun ' + h)); k.appendChild(kartuBangun(soal.pts[i], { lebar: 300, tinggi: soal.tingkat === 1 ? 190 : 175, warna: i ? ORANYE : '#3A86FF' })); baris.appendChild(k); });
    wadah.appendChild(baris);
    const opsiEl = el('div', 'hs-opsi');
    soal.opsi.forEach((o) => { const t = el('button', 'tombol', o.nama); t.onclick = () => kirim(periksa(soal, o.kode)); opsiEl.appendChild(t); });
    wadah.appendChild(opsiEl);
  }
  function tampilkanPendek(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Ketiga bangun luasnya sama: <b>' + soal.luas + ' petak</b>.<br>Mana yang <b>kelilingnya paling pendek</b>? <small>Ketuk bangunnya.</small>'));
    const baris = el('div', 'lk-dua lk-tiga');
    soal.bangun.forEach((x, i) => {
      const t = el('button', 'tombol lk-kartu lk-kartu-tombol');
      t.appendChild(kartuBangun(x.pts, { lebar: 290, tinggi: 150, warna: WARNA_BAGIAN[i] }));
      t.onclick = () => kirim(periksa(soal, 'b' + i));
      baris.appendChild(t);
    });
    wadah.appendChild(baris);
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'potong') tampilkanPotong(soal, wadah, kirim);
    else if (soal.jenis === 'jebakan') tampilkanJebakan(soal, wadah, kirim);
    else tampilkanPendek(soal, wadah, kirim);
  }

  function pujian(soal) {
    if (soal.jenis === 'potong') return { html: 'Bagian-bagiannya dijumlah: <b>' + soal.kunci + ' ' + satuanLuas(soal) + '</b>' };
    if (soal.jenis === 'jebakan') return { html: namaJebakan(soal.kunci) + ': luas ' + soal.ukur[0].luas + ' dan ' + soal.ukur[1].luas + ', keliling ' + soal.ukur[0].keliling + ' dan ' + soal.ukur[1].keliling };
    const m = soal.bangun[Number(soal.kunci.slice(1))];
    return { html: 'Keliling paling pendek: ' + m.w + ' × ' + m.h + ' = <b>' + m.keliling + '</b>. Makin mirip persegi, makin pendek.' };
  }

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    const tempat = el('div', 'sudut-tempat');
    const teksEl = el('div', 'kotak-teks', '');
    if (soal.jenis === 'potong') {
      const b = soal.bentuk, cara = b.cuts.find((c) => c.id === jawaban.potong) || b.cuts[0], u = satuanLuas(soal);
      tempat.appendChild(gambarPotong(soal, { cara, ukuranMaks: { w: 480, h: KECIL() ? 250 : 290 } }).svg);
      const bag = cara.bagian.map((g, k) => kotakWarna(k) + ' ' + kalimatBagian(g)), total = jumlah(cara.bagian.map(luasBagian));
      let t = bag.join('<br>') + '<br>' + cara.bagian.map(luasBagian).join(' + ') + ' = <b>' + total + ' ' + u + '</b>';
      if (soal.tingkat === 3) t += '<br><small>Cara lain (kurang): ' + b.kurang.besar.w + ' × ' + b.kurang.besar.h + ' − ' + b.kurang.lubang.map((l) => l.w + ' × ' + l.h).join(' − ') + ' = <b>' + luasKurang(b.kurang) + '</b></small>';
      t += '<br><small>Kamu memilih ' + jawaban.pilih + '.</small>';
      teksEl.innerHTML = t;
    } else if (soal.jenis === 'jebakan') {
      const lt = el('div', 'lk-dua lk-dua-kecil');
      [0, 1].forEach((i) => { const k = el('div', 'lk-kartu'); k.appendChild(el('div', 'lk-kartu-judul', 'Bangun ' + 'AB'[i])); k.appendChild(kartuBangun(soal.pts[i], { lebar: 230, tinggi: 150, warna: i ? ORANYE : '#3A86FF' })); lt.appendChild(k); });
      tempat.appendChild(lt);
      const [a, c] = soal.ukur, sl = a.luas === c.luas, sk = a.keliling === c.keliling;
      teksEl.innerHTML = '<b>' + namaJebakan(soal.kunci) + '</b><br>' +
        'Luas: ' + a.luas + ' dan ' + c.luas + ' → <span class="' + (sl ? 'lk-sama' : 'lk-beda') + '">' + (sl ? 'sama' : 'beda') + '</span><br>' +
        'Keliling: ' + a.keliling + ' dan ' + c.keliling + ' → <span class="' + (sk ? 'lk-sama' : 'lk-beda') + '">' + (sk ? 'sama' : 'beda') + '</span><br>' +
        '<small>Luas sama belum tentu keliling sama (dan sebaliknya). Kamu memilih "' + namaJebakan(jawaban.pilih) + '".</small>';
    } else {
      const lt = el('div', 'lk-dua lk-dua-kecil lk-tiga');
      soal.bangun.forEach((x, i) => { const k = el('div', 'lk-kartu'); k.appendChild(kartuBangun(x.pts, { lebar: 200, tinggi: 110, warna: WARNA_BAGIAN[i] })); k.appendChild(el('div', 'lk-kartu-judul', x.w + ' × ' + x.h + '<br><small>keliling ' + x.keliling + '</small>')); lt.appendChild(k); });
      tempat.appendChild(lt);
      const m = soal.bangun[Number(soal.kunci.slice(1))];
      teksEl.innerHTML = 'Keliling = 2 × (p + l). Luas sama, tetapi kelilingnya beda.<br><b>' + m.w + ' × ' + m.h + '</b> paling pendek: ' + m.keliling + '.<br><small>Makin mirip persegi, makin pendek kelilingnya.</small>';
    }
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GamePotongBangun = Object.assign({
    id: 'potong-bangun',
    tingkat: ['bangun L di kertas petak', 'bangun L & T berlabel, jebakan', 'L, T, U besar, keliling paling pendek'],
    ingat: 'Bangun gabungan dipotong jadi persegi panjang, luasnya dijumlah. Garis potong bukan bagian keliling. Luas sama belum tentu keliling sama.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
