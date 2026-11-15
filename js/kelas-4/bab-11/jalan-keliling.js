// Mini game 🐾 Jalan Keliling (Kelas 4 Bab 11).
// Soal 1-3: bangun berlabel -> KETUK tiap sisi (Garuda berjalan di tepi, angkanya masuk ke deret penjumlahan) -> pilih kelilingnya (4 pilihan).
// Soal 4-5: persegi panjang / persegi hanya berlabel p dan l (atau s) -> pilih keliling. Tingkat 3: keliling diketahui -> cari sisi yang hilang.
// Tingkat 1: segitiga & segi empat, sisi <= 12 cm · 2: segi lima/enam, bangun L di kertas petak, p dan l sampai 15 · 3: bangun L berlabel (2 sisi tanpa label) + cari sisi hilang.
// Kunci: jumlah panjang sisi (kode); pengecoh dari salah umum (satu sisi terlewat, p + l, luas). Cek: node tools/cek-bab11.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const L = modul ? require('./luas.js') : root.Luas;
  const { acak, pilih, kocok, jumlah, POLI, opsiAngka, bentukL, lensDari } = L;

  // ---------- Logika (tanpa DOM) ----------
  const satuanAcak = (tingkat) => (tingkat === 1 ? 'cm' : pilih(['cm', 'm']));

  function soalPoli(tingkat, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const n = tingkat === 1 ? pilih([3, 4, 4]) : pilih([5, 6]);
      const idx = acak(0, POLI[n].length - 1), pts = POLI[n][idx];
      let lens;
      if (tingkat === 1) {
        lens = Array.from({ length: n }, () => acak(3, 12));
        if (n === 3) { const [a, b, c] = lens.slice().sort((x, y) => x - y); if (a + b <= c) continue; } // segitiga harus bisa dibuat
      } else lens = Array.from({ length: n }, () => acak(2, 9));
      if (new Set(lens).size < Math.min(n, 3)) continue; // sisi jangan terlalu seragam (supaya terlewat satu sisi terlihat)
      const kode = 'p' + n + '-' + lens.join('-');
      if (kode === bukanKode) continue;
      const total = jumlah(lens);
      const kand = lens.map((x) => total - x).concat([total + 1, total - 1, total + 2]);
      return { jenis: 'ketuk', tingkat, bentuk: 'poli', n, pts, lens, tanya: [], grid: false, satuan: 'cm', kunci: total, opsi: opsiAngka(total, kand), kode };
    }
    throw new Error('soalPoli gagal');
  }
  function soalLGrid(tingkat, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const W = acak(4, 7), H = acak(4, 5), w2 = acak(1, W - 2), h2 = acak(1, H - 2);
      if (W - w2 < 2 || H - h2 < 2) continue; // lekukan >= 2 x 2
      const pts = bentukL(W, H, w2, h2), lens = lensDari(pts), total = jumlah(lens);
      const kode = 'g' + [W, H, w2, h2].join('-');
      if (kode === bukanKode) continue;
      const kand = lens.map((x) => total - x).concat([L.luasPts(pts), total / 2, total + 1]);
      return { jenis: 'ketuk', tingkat, bentuk: 'Lgrid', pts, lens, tanya: [], grid: true, satuan: 'satuan', kunci: total, opsi: opsiAngka(total, kand), kode };
    }
    throw new Error('soalLGrid gagal');
  }
  function soalLBerlabel(tingkat, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const W = acak(7, 10), H = acak(6, 8), w2 = acak(2, W - 3), h2 = acak(2, H - 3);
      if (W - w2 < 3 || H - h2 < 3) continue; // lekukan >= 3 x 3 supaya label dua sisi dalam tidak bertumpuk
      const pts = bentukL(W, H, w2, h2), lens = lensDari(pts), total = jumlah(lens);
      const kode = 'L' + [W, H, w2, h2].join('-');
      if (kode === bukanKode) continue;
      const kand = lens.map((x) => total - x).concat([lens[0] + lens[1] + lens[4] + lens[5], total + 1, total - 2]); // melupakan dua sisi "?" = jumlah sisi berlabel
      // sisi 2 (mendatar dalam) = W - w2, sisi 3 (tegak dalam) = H - h2
      const hint = { 2: 'Sisi ini = sisi bawah (' + W + ') dikurangi sisi atas (' + w2 + ').', 3: 'Sisi ini = sisi kiri (' + H + ') dikurangi sisi kanan bawah (' + h2 + ').' };
      return { jenis: 'ketuk', tingkat, bentuk: 'L', pts, lens, tanya: [2, 3], hint, grid: false, satuan: pilih(['cm', 'm']), kunci: total, opsi: opsiAngka(total, kand), kode };
    }
    throw new Error('soalLBerlabel gagal');
  }
  function soalPL(tingkat, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const maks = tingkat === 1 ? 9 : 15, min = tingkat === 1 ? 3 : 4;
      const p = acak(min, maks), l = acak(min, Math.min(maks, tingkat === 1 ? 9 : 10));
      if (p === l) continue;
      const kode = 'r' + p + 'x' + l;
      if (kode === bukanKode) continue;
      const kunci = 2 * (p + l);
      return { jenis: 'pl', tingkat, p, l, satuan: satuanAcak(tingkat), kunci, opsi: opsiAngka(kunci, [p + l, p * l, 2 * p + l, p + 2 * l, kunci + 2]), kode };
    }
    throw new Error('soalPL gagal');
  }
  function soalPersegi(tingkat, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      const s = tingkat === 1 ? acak(3, 9) : acak(4, 14), kode = 's' + s;
      if (kode === bukanKode) continue;
      const kunci = 4 * s;
      return { jenis: 'persegi', tingkat, s, satuan: satuanAcak(tingkat), kunci, opsi: opsiAngka(kunci, [s * s, 2 * s, 3 * s, s + 4, 2 * s + 2]), kode };
    }
    throw new Error('soalPersegi gagal');
  }
  // cari sisi hilang (tingkat 3): persegi panjang, persegi, segitiga
  function soalHilang(tipe, bukanKode) {
    for (let coba = 0; coba < 200; coba++) {
      let s;
      if (tipe === 'pp') {
        const p = acak(5, 14), l = acak(3, 12);
        if (p === l) continue;
        const K = 2 * (p + l);
        s = { tipe, K, p, kunci: l, kode: 'hpp' + K + '-' + p, hint: K + ' : 2 = ' + K / 2 + ', lalu ' + K / 2 + ' − ' + p, opsi: opsiAngka(l, [K / 2, K - p, K - 2 * p, p + l + 2]) };
      } else if (tipe === 'persegi') {
        const x = acak(4, 15), K = 4 * x;
        s = { tipe, K, kunci: x, kode: 'hs' + K, hint: K + ' : 4 = ' + x, opsi: opsiAngka(x, [K / 2, K - 4, x * x, K / 4 + 4]) };
      } else {
        const a = acak(4, 12), b = acak(4, 12), c = acak(3, 12);
        const [x, y, z] = [a, b, c].sort((u, v) => u - v);
        if (x + y <= z) continue;
        const K = a + b + c;
        s = { tipe, K, a, b, kunci: c, kode: 'ht' + K + '-' + a + '-' + b, hint: K + ' − ' + a + ' − ' + b, opsi: opsiAngka(c, [K - a, K - b, a + b, K - a - b + 2]) };
      }
      if (s.kode === bukanKode) continue;
      return Object.assign({ jenis: 'hilang', tingkat: 3, satuan: pilih(['cm', 'm']) }, s);
    }
    throw new Error('soalHilang gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      let r;
      if (tingkat === 1) r = [soalPoli(1), soalPoli(1), soalPoli(1), soalPL(1), soalPersegi(1)];
      else if (tingkat === 2) r = [soalPoli(2), soalPoli(2), soalLGrid(2), soalPL(2), soalPersegi(2)];
      else r = [soalLBerlabel(3), soalLBerlabel(3), soalHilang('pp'), soalHilang('persegi'), soalHilang('segitiga')];
      if (new Set(r.map((s) => s.kode)).size !== 5) continue;
      return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'ketuk') s = soal.bentuk === 'poli' ? soalPoli(tingkat, soal.kode) : soal.bentuk === 'Lgrid' ? soalLGrid(tingkat, soal.kode) : soalLBerlabel(tingkat, soal.kode);
      else if (soal.jenis === 'pl') s = soalPL(tingkat, soal.kode);
      else if (soal.jenis === 'persegi') s = soalPersegi(tingkat, soal.kode);
      else s = soalHilang(soal.tipe, soal.kode);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.kunci, pilih: kode });
  // untuk penjelasan: apakah pilihan salah akibat melewatkan satu sisi / memilih setengah keliling
  function dugaanSalah(soal, pilihan) {
    if (soal.jenis === 'ketuk') {
      const i = soal.lens.findIndex((x) => soal.kunci - x === pilihan);
      if (i >= 0) return { jenis: 'lewat', sisi: [i] };
      if (soal.kunci === 2 * pilihan) return { jenis: 'setengah' };
      return null;
    }
    if (soal.jenis === 'pl') {
      if (pilihan === soal.p + soal.l) return { jenis: 'setengah', sisi: [2, 3] };
      if (pilihan === soal.p * soal.l) return { jenis: 'luas' };
      if (pilihan === 2 * soal.p + soal.l) return { jenis: 'lewat', sisi: [3] };
      if (pilihan === soal.p + 2 * soal.l) return { jenis: 'lewat', sisi: [2] };
      return null;
    }
    if (soal.jenis === 'persegi') {
      if (pilihan === soal.s * soal.s) return { jenis: 'luas' };
      if (pilihan === 3 * soal.s) return { jenis: 'lewat', sisi: [3] };
      if (pilihan === 2 * soal.s) return { jenis: 'setengah', sisi: [2, 3] };
      return null;
    }
    return null;
  }
  const kalimatHitung = (soal) => {
    if (soal.jenis === 'ketuk') return soal.lens.join(' + ') + ' = ' + soal.kunci;
    if (soal.jenis === 'pl') return soal.p + ' + ' + soal.l + ' + ' + soal.p + ' + ' + soal.l + ' = ' + soal.kunci;
    if (soal.jenis === 'persegi') return [soal.s, soal.s, soal.s, soal.s].join(' + ') + ' = ' + soal.kunci;
    return '';
  };

  const logika = { soalPoli, soalLGrid, soalLBerlabel, soalPL, soalPersegi, soalHilang, buatRonde, soalMirip, periksa, dugaanSalah, kalimatHitung };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, kanvas, polaPetak, garisPetak, tepiBangun, sisiGaris, labelSisi, ketukSisi, garudaJalan, petakMuat, batasGambar, semuaPojok, tandaSama, svgEl, teks, ORANYE, MERAH, TINTA, persegiPanjang } = L;
  const ORANYE_TUA = '#E8731F';

  // Bangun untuk satu soal: { K, pts, lens, edgeLabel(i, nilai?) }
  function bentukSoal(soal, opsiGbr) {
    opsiGbr = opsiGbr || {};
    const batas = batasGambar();
    let pts, tampil;
    if (soal.jenis === 'ketuk') pts = soal.pts;
    else if (soal.jenis === 'pl') pts = persegiPanjang(soal.p, soal.l);
    else if (soal.jenis === 'persegi') pts = persegiPanjang(soal.s, soal.s);
    else if (soal.tipe === 'segitiga') pts = POLI[3][0];
    else if (soal.tipe === 'persegi') pts = persegiPanjang(5, 5);
    else pts = persegiPanjang(soal.p, soal.K / 2 - soal.p);
    const [W, H] = L.lebarTinggi(pts), m = 48, mx = soal.jenis === 'pl' || (soal.jenis === 'hilang' && soal.tipe === 'pp') ? 108 : 62;
    const u = petakMuat(W, H, batas.w, batas.h, m, soal.jenis === 'ketuk' && soal.grid ? 56 : 48, mx);
    const K = kanvas(W, H, u, m, mx);
    if (soal.grid) { polaPetak(K, pts); garisPetak(K, 'penuh'); }
    else K.dasar.appendChild(svgEl('path', { d: pts.map((p, i) => (i ? 'L' : 'M') + ' ' + K.px(p[0]) + ' ' + K.py(p[1])).join(' ') + ' Z', fill: '#F2F8FF' }));
    tepiBangun(K, pts, TINTA, 6);
    if (soal.grid || soal.bentuk === 'L' || soal.jenis === 'pl' || soal.jenis === 'persegi' || soal.jenis === 'hilang' && soal.tipe !== 'segitiga') semuaPojok(K, pts);
    return { K, pts, tampil };
  }
  const teksPanjang = (soal, v) => v + (soal.satuan === 'satuan' ? '' : ' ' + soal.satuan);
  const teksKel = (soal, v) => v + ' ' + soal.satuan;

  function labelTetap(soal, B) {
    const { K, pts } = B;
    if (soal.jenis === 'ketuk') {
      if (!soal.grid) soal.lens.forEach((x, i) => { if (!soal.tanya.includes(i)) B[i] = labelSisi(K, pts, i, teksPanjang(soal, x)); else B[i] = labelSisi(K, pts, i, '?', MERAH); });
    } else if (soal.jenis === 'pl') {
      labelSisi(K, pts, 0, 'p = ' + teksKel(soal, soal.p));
      labelSisi(K, pts, 3, 'l = ' + teksKel(soal, soal.l), TINTA, 56);
    } else if (soal.jenis === 'persegi') {
      labelSisi(K, pts, 0, 's = ' + teksKel(soal, soal.s));
      [0, 1, 2, 3].forEach((i) => tandaSama(K, pts, i));
    } else if (soal.tipe === 'pp') {
      labelSisi(K, pts, 0, 'p = ' + teksKel(soal, soal.p));
      labelSisi(K, pts, 3, 'l = ?', MERAH, 56);
    } else if (soal.tipe === 'persegi') {
      labelSisi(K, pts, 0, 's = ?', MERAH);
      [0, 1, 2, 3].forEach((i) => tandaSama(K, pts, i));
    } else { // segitiga: dua sisi diketahui, satu "?"
      labelSisi(K, pts, 0, teksKel(soal, soal.a));
      labelSisi(K, pts, 1, teksKel(soal, soal.b));
      labelSisi(K, pts, 2, '?', MERAH);
    }
  }

  function teksSoal(soal) {
    if (soal.jenis === 'ketuk') return soal.grid ? 'Ketuk <b>tiap sisi</b> bangun ini (hitung petaknya), lalu pilih <b>keliling</b>-nya.' : 'Ketuk <b>semua sisi</b> bangun ini, lalu pilih <b>keliling</b>-nya.';
    if (soal.jenis === 'pl') return 'Persegi panjang <b>p = ' + teksKel(soal, soal.p) + '</b>, <b>l = ' + teksKel(soal, soal.l) + '</b>.<br>Berapa <b>keliling</b>-nya?';
    if (soal.jenis === 'persegi') return 'Persegi dengan sisi <b>' + teksKel(soal, soal.s) + '</b>.<br>Berapa <b>keliling</b>-nya?';
    if (soal.tipe === 'pp') return 'Keliling persegi panjang <b>' + teksKel(soal, soal.K) + '</b>, panjangnya <b>' + teksKel(soal, soal.p) + '</b>.<br>Berapa <b>lebar</b>-nya?';
    if (soal.tipe === 'persegi') return 'Keliling persegi <b>' + teksKel(soal, soal.K) + '</b>.<br>Berapa <b>panjang sisi</b>-nya?';
    return 'Keliling segitiga <b>' + teksKel(soal, soal.K) + '</b>. Dua sisinya <b>' + teksKel(soal, soal.a) + '</b> dan <b>' + teksKel(soal, soal.b) + '</b>.<br>Berapa <b>sisi ketiga</b>?';
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    const baris = el('div', 'jg-baris');
    const tempat = el('div', 'sudut-tempat');
    const kanan = el('div', 'des-kanan lk-kanan');
    const info = el('div', 'hs-info lk-info', '');
    const jumlahEl = el('div', 'lk-jumlah', '');
    const opsiEl = el('div', 'hs-opsi');
    const B = bentukSoal(soal);
    labelTetap(soal, B);
    tempat.appendChild(B.K.svg);
    const tombol = [];
    const ketuk = soal.jenis === 'ketuk';
    if (ketuk) {
      const { K, pts } = B, n = pts.length, garuda = garudaJalan(K), diketuk = [], urut = [];
      let menunggu = null;
      const perbarui = () => {
        const semua = diketuk.length >= n;
        jumlahEl.innerHTML = urut.length ? urut.join(' + ') + (semua ? ' = <b>?</b>' : ' + …') : '';
        info.innerHTML = semua ? 'Semua sisi sudah dijalani.<br>Sekarang pilih kelilingnya.' : (menunggu !== null ? '' : 'Sisi yang sudah dijalani: <b>' + diketuk.length + '</b> dari ' + n);
        tombol.forEach((b) => { b.disabled = !semua; });
      };
      const tandai = (i) => {
        diketuk.push(i); urut.push(soal.lens[i]); Suara.efek('pop');
        sisiGaris(K, pts, i, ORANYE);
        garuda.ke(pts[i][0], pts[i][1], diketuk.length === 1);
        setTimeout(() => garuda.ke(pts[(i + 1) % n][0], pts[(i + 1) % n][1]), 40);
        if (soal.grid || soal.tanya.includes(i)) { if (B[i]) B[i].remove(); labelSisi(K, pts, i, teksPanjang(soal, soal.lens[i]), ORANYE_TUA); }
        menunggu = null; perbarui();
      };
      const tanyaPanjang = (i) => {
        menunggu = i;
        info.innerHTML = '';
        info.appendChild(el('div', '', 'Sisi yang tidak ada angkanya: berapa panjangnya?'));
        const baris2 = el('div', 'lk-mini-opsi');
        const pil = opsiAngka(soal.lens[i], [soal.lens[i] + 1, soal.lens[i] - 1, soal.lens[(i + 2) % n], soal.lens[(i + 4) % n]]);
        const petunjuk = el('div', 'lk-petunjuk', '');
        pil.forEach((v) => {
          const b = el('button', 'tombol tombol-bantu', String(v));
          b.onclick = () => {
            if (v === soal.lens[i]) { Suara.efek('ding'); tandai(i); }
            else { Suara.efek('boing'); b.disabled = true; petunjuk.innerHTML = soal.hint[i]; }
          };
          baris2.appendChild(b);
        });
        info.append(baris2, petunjuk);
      };
      for (let i = 0; i < n; i++) {
        ketukSisi(K, pts, i, (j) => {
          if (diketuk.includes(j)) return;
          if (soal.tanya.includes(j)) tanyaPanjang(j); else tandai(j);
        });
      }
      kanan.append(info, jumlahEl, el('div', 'ingat-kecil', soal.grid ? 'Ketuk setiap sisi.<br>Hitung berapa petak panjangnya.' : 'Ketuk setiap sisi satu per satu.<br><small>Gambar tidak sesuai ukuran.</small>'));
      perbarui();
    } else {
      kanan.append(soal.jenis === 'hilang' ? el('div', 'lk-jumlah lk-kel-besar', 'Keliling = ' + teksKel(soal, soal.K)) : el('div', 'lk-arti', '<b>Keliling</b> = panjang jalan mengelilingi tepi bangun sampai kembali ke awal.'), el('div', 'ingat-kecil', soal.jenis === 'hilang' ? 'Gambar tidak sesuai ukuran.' : 'Ada berapa sisi?<br>Jangan ada yang terlewat.'));
    }
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
    soal.opsi.forEach((v) => {
      const b = el('button', 'tombol', teksKel(soal, v));
      b.onclick = () => kirim(periksa(soal, v));
      tombol.push(b); opsiEl.appendChild(b);
    });
    if (ketuk) tombol.forEach((b) => { b.disabled = true; });
    wadah.appendChild(opsiEl);
  }

  function pujian(soal) {
    if (soal.jenis === 'ketuk') return { html: kalimatHitung(soal).replace(/ = (\d+)$/, ' = <b>$1</b> ') + (soal.satuan === 'satuan' ? 'satuan' : soal.satuan) };
    if (soal.jenis === 'pl') return { html: '2 × (' + soal.p + ' + ' + soal.l + ') = <b>' + soal.kunci + ' ' + soal.satuan + '</b>' };
    if (soal.jenis === 'persegi') return { html: '4 × ' + soal.s + ' = <b>' + soal.kunci + ' ' + soal.satuan + '</b>' };
    return { html: soal.hint + ' = <b>' + soal.kunci + ' ' + soal.satuan + '</b>' };
  }

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    const tempat = el('div', 'sudut-tempat');
    const teksEl = el('div', 'kotak-teks', '');
    if (soal.jenis === 'hilang') {
      const B = bentukSoal(soal); labelTetap(soal, B);
      tempat.appendChild(B.K.svg);
      teksEl.innerHTML = 'Keliling = jumlah semua sisi.<br>' + soal.hint + ' = <b>' + teksKel(soal, soal.kunci) + '</b>.<br><small>Cek: kelilingnya jadi ' + teksKel(soal, soal.K) + '. Kamu memilih ' + teksKel(soal, jawaban.pilih) + '.</small>';
      baris.append(tempat, teksEl); wadah.appendChild(baris); return;
    }
    const B = bentukSoal(soal), { K, pts } = B, n = pts.length;
    const lens = soal.jenis === 'ketuk' ? soal.lens : soal.jenis === 'pl' ? [soal.p, soal.l, soal.p, soal.l] : [soal.s, soal.s, soal.s, soal.s];
    tempat.appendChild(K.svg);
    if (soal.jenis === 'ketuk' && !soal.grid) lens.forEach((x, i) => { labelSisi(K, pts, i, teksPanjang(soal, x), ORANYE_TUA); });
    const garuda = garudaJalan(K), duga = dugaanSalah(soal, jawaban.pilih);
    let k = 0, urut = [];
    const gambar = () => {
      const selesai = k >= n;
      teksEl.innerHTML = 'Garuda berjalan di tepi, sisi demi sisi:<br><b>' + (urut.length ? urut.join(' + ') : '…') + (selesai ? ' = ' + soal.kunci + ' ' + (soal.satuan === 'satuan' ? '' : soal.satuan) : ' + …') + '</b>';
      if (selesai) {
        if (soal.jenis === 'pl') teksEl.innerHTML += '<br>Cara cepat: <b>2 × (' + soal.p + ' + ' + soal.l + ') = ' + soal.kunci + '</b>';
        if (soal.jenis === 'persegi') teksEl.innerHTML += '<br>Cara cepat: <b>4 × ' + soal.s + ' = ' + soal.kunci + '</b>';
        let tambah = '';
        if (duga && duga.jenis === 'lewat') tambah = 'Pilihanmu ' + jawaban.pilih + ' belum menghitung satu sisi (yang berkedip merah).';
        else if (duga && duga.jenis === 'setengah') tambah = 'Pilihanmu ' + jawaban.pilih + ' baru <b>setengah jalan</b>: masih ada sisi lain yang belum dihitung.';
        else if (duga && duga.jenis === 'luas') tambah = 'Pilihanmu ' + jawaban.pilih + ' itu <b>luas</b> (petak di dalam). Yang ditanya <b>keliling</b> (jalan di tepi).';
        else tambah = 'Kamu memilih ' + jawaban.pilih + '.';
        teksEl.innerHTML += '<br><small>' + tambah + '</small>';
        if (duga && duga.sisi) duga.sisi.forEach((i) => { const g = sisiGaris(K, pts, i, MERAH, 11); g.setAttribute('class', 'lk-kedip'); });
        garuda.hilang();
        return;
      }
    };
    gambar();
    const t = setInterval(() => {
      if (!tempat.isConnected) { clearInterval(t); return; }
      const i = k;
      sisiGaris(K, pts, i, ORANYE);
      if (soal.jenis !== 'ketuk' || soal.grid) labelSisi(K, pts, i, soal.jenis === 'ketuk' ? teksPanjang(soal, lens[i]) : teksKel(soal, lens[i]), ORANYE_TUA);
      garuda.ke(pts[i][0], pts[i][1], i === 0);
      setTimeout(() => garuda.ke(pts[(i + 1) % n][0], pts[(i + 1) % n][1]), 40);
      urut.push(lens[i]); k++; Suara.efek('pop'); gambar();
      if (k >= n) clearInterval(t);
    }, 700);
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }
  const KECIL_ = () => window.innerHeight < 790;

  root.GameJalanKeliling = Object.assign({
    id: 'jalan-keliling',
    tingkat: ['segitiga & segi empat', 'segi lima, segi enam, bangun L, p dan l', 'sisi yang hilang & bangun L'],
    ingat: 'Keliling = panjang jalan mengelilingi tepi bangun = jumlah panjang semua sisi. Persegi panjang: 2 × (p + l). Persegi: 4 × s. Satuan: cm atau m.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
