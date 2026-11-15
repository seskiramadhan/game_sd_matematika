// Mini game 🔍 Cek Sifat (Kelas 4 Bab 10).
// Soal 1-3: segitiga berlabel (sisi cm / sudut derajat) -> jenisnya. Soal 4-5: segi empat di kertas bertitik -> nama paling khusus
// (kunci tunggal, keputusan Ayah: "benar sifatnya, tapi ada nama yang lebih tepat"); trapesium = tepat satu pasang sisi sejajar.
// Alat bantu: Cek sejajar (panah), Cek siku (kotak pojok), Cek sama panjang (garis kecil).
// Tingkat 1: segitiga menurut sisi + persegi/persegi panjang/jajargenjang/trapesium tegak · 2: + segitiga menurut sudut, belah ketupat, layang-layang miring ·
// 3: dua nama sekaligus, segitiga menurut sudut dari sisi, segi empat diputar, lengkapi titik keempat (D = A + C - B).
// Kunci bilangan bulat: a^2 + b^2 dibanding c^2, sudut bulat, vektor bulat (silang / titik / kuadrat panjang). Cek: node tools/cek-bab10.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bangun.js') : root.Bangun;
  const { acak, pilih, kocok, kurang, silang, dalamKertas, KOLOM, BARIS, TEKS_SISI, TEKS_SUDUT_SEGITIGA, TEKS_SE, jenisSisi, jenisSudutDariSisi, jenisSudutDariDerajat, jenisSisiDariDerajat, sifatSegiEmpat, jenisSegiEmpat, LEBIH_UMUM, titikKeempat, teksLangkah, bisaSegitiga } = B;

  // ---------- Logika (tanpa DOM) ----------
  const SISI3 = {
    'sama-sisi': [[3, 3, 3], [4, 4, 4], [5, 5, 5], [6, 6, 6], [7, 7, 7]],
    'sama-kaki': [[5, 5, 6], [5, 5, 8], [4, 4, 6], [6, 6, 5], [6, 6, 9], [7, 7, 5], [8, 8, 6], [5, 5, 3], [7, 7, 10]],
    sembarang: [[3, 4, 5], [4, 6, 7], [3, 5, 7], [6, 8, 10], [5, 7, 9], [4, 5, 8], [6, 7, 8], [5, 6, 10]],
  };
  const DERAJAT = [[70, 70, 40], [90, 45, 45], [30, 50, 100], [60, 60, 60], [50, 60, 70], [20, 40, 120], [80, 50, 50], [30, 30, 120], [90, 30, 60], [40, 60, 80], [55, 55, 70], [35, 35, 110], [100, 40, 40], [40, 50, 90]];
  const SUDUT_CM = [[3, 4, 5], [6, 8, 10], [4, 6, 7], [5, 6, 7], [6, 7, 8], [3, 5, 7], [4, 5, 8], [5, 6, 10]];
  const KUNCI_SISI = ['sama-sisi', 'sama-kaki', 'sembarang'], KUNCI_SUDUT = ['siku', 'lancip', 'tumpul'];
  const ARTI = {
    'sama-sisi': 'ketiga sisinya sama panjang', 'sama-kaki': 'dua sisinya sama panjang', sembarang: 'semua sisinya berbeda',
    siku: 'ada satu sudut 90°', lancip: 'semua sudut kurang dari 90°', tumpul: 'ada satu sudut lebih dari 90°',
  };
  const NAMA_SE4 = ['persegi', 'persegi-panjang', 'jajargenjang', 'trapesium'];
  const NAMA_SE6 = ['persegi', 'persegi-panjang', 'jajargenjang', 'belah-ketupat', 'layang-layang', 'trapesium'];

  const rot90 = (v, k) => { let r = v; for (let i = 0; i < k; i++) r = [-r[1], r[0]]; return r; };
  const tambah = (p, v, m = 1) => [p[0] + v[0] * m, p[1] + v[1] * m];
  function geser(pts) { // pindahkan ke kertas (acak) bila muat
    const x0 = Math.min(...pts.map((p) => p[0])), x1 = Math.max(...pts.map((p) => p[0])), y0 = Math.min(...pts.map((p) => p[1])), y1 = Math.max(...pts.map((p) => p[1]));
    if (x1 - x0 > KOLOM - 1 || y1 - y0 > BARIS - 1) return null;
    const ox = acak(0, KOLOM - 1 - (x1 - x0)) - x0, oy = acak(0, BARIS - 1 - (y1 - y0)) - y0;
    return pts.map((p) => [p[0] + ox, p[1] + oy]);
  }
  const luas2 = (P) => { let a = 0; for (let i = 0; i < P.length; i++) { const q = P[(i + 1) % P.length]; a += P[i][0] * q[1] - q[0] * P[i][1]; } return Math.abs(a); };

  const ARAH = [[1, 1], [1, -1], [2, 1], [1, 2], [2, -1], [1, -2]];
  function bangunSE(jenis, tingkat) {
    const miring = tingkat === 3 && Math.random() < 0.85;
    let pts;
    if (jenis === 'persegi') {
      if (!miring) { const s = acak(2, 4); pts = [[0, 0], [s, 0], [s, s], [0, s]]; }
      else { const u = [acak(1, 3), acak(1, 3)], v = rot90(u, 1); pts = [[0, 0], u, tambah(u, v), v]; }
    } else if (jenis === 'persegi-panjang') {
      if (!miring) { const w = acak(3, 6), h = acak(2, 4); pts = [[0, 0], [w, 0], [w, h], [0, h]]; }
      else { const e = pilih(ARAH), pq = pilih([[1, 2], [2, 1], [1, 3], [3, 1]]), u = [e[0] * pq[0], e[1] * pq[0]], v = rot90([e[0] * pq[1], e[1] * pq[1]], 1); pts = [[0, 0], u, tambah(u, v), v]; }
    } else if (jenis === 'jajargenjang') {
      if (!miring) { const b = acak(2, 5), h = acak(2, 3), k = pilih([-2, -1, 1, 2]); pts = [[0, 0], [b, 0], [b + k, h], [k, h]]; }
      else { const u = [acak(-3, 3), acak(-3, 3)], v = [acak(-3, 3), acak(-3, 3)]; pts = [[0, 0], u, tambah(u, v), v]; }
    } else if (jenis === 'belah-ketupat') {
      if (!miring) { const a = acak(2, 4), b = acak(1, 2); pts = [[0, b], [a, 0], [2 * a, b], [a, 2 * b]]; }
      else { const p = acak(1, 3), q = acak(1, 3), u = [p, q], v = [q, p]; pts = [[0, 0], u, tambah(u, v), v]; }
    } else if (jenis === 'layang-layang') {
      if (!miring) { const a = acak(1, 3), b1 = acak(1, 3), b2 = acak(1, 3); pts = [[a, 0], [2 * a, b1], [a, b1 + b2], [0, b1]]; }
      else { const e = pilih(ARAH), f = rot90(e, 1), a = acak(1, 2), b1 = acak(1, 2), b2 = acak(1, 3); pts = [tambah([0, 0], e, -b1), tambah([0, 0], f, a), tambah([0, 0], e, b2), tambah([0, 0], f, -a)]; }
    } else { // trapesium
      if (!miring) { const b = acak(3, 6), t = acak(1, b - 1), d = acak(-1, b - t + 1), h = acak(2, 3); pts = [[0, 0], [b, 0], [d + t, h], [d, h]]; }
      else { const u = pilih(ARAH), v = [acak(-2, 2), acak(-2, 2)], m = acak(2, 4), n = acak(1, 3); pts = [[0, 0], tambah([0, 0], u, m), tambah(tambah([0, 0], v), u, n), v]; }
    }
    pts = geser(pts);
    if (!pts || !pts.every(dalamKertas)) return null;
    if (new Set(pts.map((p) => p.join(','))).size !== 4 || luas2(pts) < 8) return null; // minimal 4 petak supaya gambar tidak terlalu kecil
    if (jenisSegiEmpat(pts) !== jenis) return null;
    if (miring && !pts.some((p, i) => { const d = kurang(pts[(i + 1) % 4], p); return d[0] !== 0 && d[1] !== 0; })) return null; // minimal satu sisi diagonal
    return pts;
  }
  function soalSE(tingkat, jenis, bukanKode) {
    const nama = jenis || pilih(tingkat === 1 ? NAMA_SE4 : NAMA_SE6);
    for (let i = 0; i < 20000; i++) {
      const pts = bangunSE(nama, tingkat);
      if (!pts) continue;
      const kode = 'e' + nama + pts.join(';');
      if (kode === bukanKode) continue;
      return { jenis: 'se', tingkat, nama, pts, kunci: nama, opsi: tingkat === 1 ? NAMA_SE4 : NAMA_SE6, kode };
    }
    throw new Error('gagal membuat segi empat ' + nama + ' t' + tingkat);
  }
  function soalTitikD(tingkat, bentuk) {
    const bnt = bentuk || pilih(['jajargenjang', 'persegi']);
    for (let i = 0; i < 20000; i++) {
      let u, w;
      if (bnt === 'persegi') { u = [acak(1, 3), acak(0, 3)]; w = rot90(u, Math.random() < 0.5 ? 1 : 3); } else { u = [acak(-3, 3), acak(-3, 3)]; w = [acak(-3, 3), acak(-3, 3)]; }
      if (silang(u, w) === 0) continue;
      const pts = geser([[0, 0], u, tambah(u, w), w]); // B, A, D, C
      if (!pts) continue;
      const Bt = pts[0], A = pts[1], D = pts[2], C = pts[3];
      if (![Bt, A, C, D].every(dalamKertas)) continue;
      return { jenis: 'titikD', tingkat, bentuk: bnt, A, B: Bt, C, kunci: D, kode: 'd' + bnt + [A, Bt, C].join(';') };
    }
    throw new Error('gagal titik keempat');
  }

  function soalTri(tingkat, mode, kunciDiminta) {
    if (mode === 'sisi') {
      const k = kunciDiminta || pilih(KUNCI_SISI), s = kocok(pilih(SISI3[k]));
      return { jenis: 'tri', mode, tingkat, sisi: s, rot: tingkat === 1 ? 0 : acak(0, 359), kunci: k, opsi: KUNCI_SISI, kode: 'ts' + s };
    }
    if (mode === 'sudut') {
      const d = kocok(pilih(DERAJAT)), k = jenisSudutDariDerajat(d);
      return { jenis: 'tri', mode, tingkat, sudut: d, rot: acak(0, 359), kunci: k, opsi: KUNCI_SUDUT, kode: 'tu' + d };
    }
    if (mode === 'sudutCm') {
      const s = kocok(pilih(SUDUT_CM)), k = jenisSudutDariSisi(s[0], s[1], s[2]);
      return { jenis: 'tri', mode, tingkat, sisi: s, rot: acak(0, 359), kunci: k, opsi: KUNCI_SUDUT, kode: 'tc' + s };
    }
    const d = kocok(pilih(DERAJAT));
    return { jenis: 'tri', mode: 'dua', tingkat, sudut: d, rot: acak(0, 359), kunci: { sisi: jenisSisiDariDerajat(d), sudut: jenisSudutDariDerajat(d) }, kode: 'td' + d };
  }

  function buatRonde(tingkat) {
    for (;;) {
      let r;
      if (tingkat === 1) {
        const k = kocok(KUNCI_SISI), n = kocok(NAMA_SE4);
        r = [soalTri(1, 'sisi', k[0]), soalTri(1, 'sisi', k[1]), soalTri(1, 'sisi', k[2]), soalSE(1, n[0]), soalSE(1, n[1])];
      } else if (tingkat === 2) {
        const k = kocok(KUNCI_SISI), n = kocok(NAMA_SE6);
        r = [soalTri(2, 'sisi', k[0]), soalTri(2, 'sisi', k[1]), soalTri(2, 'sudut'), soalSE(2, n[0]), soalSE(2, n[1])];
      } else {
        r = [soalTri(3, 'dua'), soalTri(3, 'dua'), soalTri(3, 'sudutCm'), soalSE(3), soalTitikD(3)];
      }
      if (new Set(r.map((s) => s.kode)).size !== 5) continue;
      if (tingkat === 3 && JSON.stringify(r[0].kunci) === JSON.stringify(r[1].kunci)) continue; // dua nama berbeda
      return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'tri') s = soalTri(tingkat, soal.mode, soal.mode === 'sisi' ? soal.kunci : undefined);
      else if (soal.jenis === 'se') s = soalSE(tingkat, soal.nama);
      else s = soalTitikD(tingkat, soal.bentuk);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  function periksa(soal, j) {
    if (soal.jenis === 'tri' && soal.mode === 'dua') return { benar: j.sisi === soal.kunci.sisi && j.sudut === soal.kunci.sudut, pilih: j };
    if (soal.jenis === 'titikD') return { benar: j[0] === soal.kunci[0] && j[1] === soal.kunci[1], pilih: j };
    return { benar: j === soal.kunci, pilih: j };
  }

  const logika = { SISI3, DERAJAT, SUDUT_CM, ARTI, NAMA_SE4, NAMA_SE6, bangunSE, soalSE, soalTitikD, soalTri, buatRonde, soalMirip, periksa, geser };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, segitigaSvg, lapisanTanda, svgEl, teks } = B;
  const G = root.Garis;
  const KECIL = () => window.innerHeight < 790;
  const WARNA_TOMBOL = { 'sama-sisi': '#3A86FF', 'sama-kaki': '#9B5DE5', sembarang: '#FF8A3D', siku: '#2BB673', lancip: '#3A86FF', tumpul: '#E04466' };
  const TEKS = Object.assign({}, TEKS_SISI, TEKS_SUDUT_SEGITIGA); // nama segitiga (kunci 'sembarang' berbeda dengan segi empat)
  const TE = TEKS_SE;
  const kecilTeks = (k) => TEKS[k].toLowerCase();

  function teksSoal(soal) {
    if (soal.jenis === 'tri') {
      if (soal.mode === 'sisi') return 'Segitiga ini <b>menurut sisinya</b> disebut apa?';
      if (soal.mode === 'dua') return 'Beri <b>dua nama</b> untuk segitiga ini: menurut sisinya dan menurut sudutnya.';
      return 'Segitiga ini <b>menurut sudutnya</b> disebut apa?' + (soal.mode === 'sudutCm' ? '<br><small>Gambar dibuat sesuai ukurannya.</small>' : '');
    }
    if (soal.jenis === 'se') return 'Bangun ini namanya apa? <small>Pilih nama yang <b>paling tepat</b>.</small>';
    return 'Ketuk titik <b class="merah">D</b> supaya <b>ABCD</b> menjadi <b>' + (soal.bentuk === 'persegi' ? 'persegi' : 'jajargenjang') + '</b>.';
  }
  const gambarTri = (soal, ukuran, o) => segitigaSvg(Object.assign({ sisi: soal.sisi, sudut: soal.sudut, tampil: soal.sisi ? 'sisi' : 'sudut', rot: soal.rot, ukuran }, o || {}));

  // kertas bertitik dengan bangun segi empat; alat: { sejajar, siku, sama }
  function gambarSE(pts, sp, alat, ekstra) {
    const f = sifatSegiEmpat(pts);
    return G.kertasSvg(Object.assign({
      kosong: true, sp,
      lapisan: (svg, px, py) => {
        const P = pts.map((p) => [px(p[0]), py(p[1])]);
        svg.appendChild(svgEl('polygon', { points: P.map((p) => p.join(',')).join(' '), fill: '#BFDCFF', 'fill-opacity': 0.7, stroke: '#1F2A44', 'stroke-width': 7, 'stroke-linejoin': 'round' }));
        lapisanTanda(svg, P, { kelasSisi: alat.sama ? f.kelasSisi : null, sejajar: alat.sejajar ? f.pasangSejajar : null, siku: alat.siku ? f.sikuDi : null, u: sp / 64 });
        P.forEach((p) => svg.appendChild(svgEl('circle', { cx: p[0], cy: p[1], r: 8, fill: '#1F2A44' })));
      },
    }, ekstra || {}));
  }

  function tampilkanSE(soal, wadah, kirim) {
    const sp = KECIL() ? 52 : 62;
    const alat = { sejajar: false, siku: false, sama: false };
    const tempat = el('div', 'sudut-tempat');
    const gambar = () => { tempat.innerHTML = ''; tempat.appendChild(gambarSE(soal.pts, sp, alat)); };
    gambar();
    const kanan = el('div', 'cs-alat');
    [['sejajar', '↗↗ Cek sejajar', 'Panah = sisi sejajar'], ['siku', '⊾ Cek siku', 'Kotak = sudut siku-siku (90°)'], ['sama', '| | Cek sama panjang', 'Garis kecil = sama panjang']].forEach(([k, label, ket]) => {
      const b = el('button', 'tombol tombol-bantu cs-tombol-alat', label + '<small>' + ket + '</small>');
      b.onclick = () => { alat[k] = !alat[k]; b.classList.toggle('dipilih', alat[k]); Suara.efek('pop'); gambar(); };
      kanan.appendChild(b);
    });
    const baris = el('div', 'tg-baris');
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
    const opsi = el('div', 'cs-opsi' + (soal.opsi.length === 6 ? ' enam' : ' empat'));
    soal.opsi.forEach((k) => {
      const b = el('button', 'tombol tombol-des', TE[k]);
      b.onclick = () => kirim(periksa(soal, k));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function tampilkanD(soal, wadah, kirim) {
    const sp = KECIL() ? 52 : 62;
    let hasil = null, sudah = false;
    const tempat = el('div', 'sudut-tempat');
    const gambar = () => {
      tempat.innerHTML = '';
      tempat.appendChild(gambarTitikD(soal, sp, hasil, false, (P) => {
        if (sudah || (P[0] === soal.A[0] && P[1] === soal.A[1]) || (P[0] === soal.B[0] && P[1] === soal.B[1]) || (P[0] === soal.C[0] && P[1] === soal.C[1])) { if (!sudah) Suara.efek('boing'); return; }
        sudah = true; hasil = periksa(soal, P); gambar(); kirim(hasil);
      }));
    };
    gambar();
    const kanan = el('div', 'cs-alat');
    kanan.appendChild(el('div', 'kertas-info', 'Dari <b>B</b> ke <b>A</b>: <b>' + teksLangkah(kurang(soal.A, soal.B)) + '</b>'));
    kanan.appendChild(el('div', 'ingat-kecil', 'Sisi yang berhadapan sejajar dan sama panjang.'));
    const baris = el('div', 'tg-baris');
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
  }
  // kertas: A, B, C bertitik + garis AB, BC ; D (hijau benar / merah pilihan)
  function gambarTitikD(soal, sp, hasil, penuh, ketuk) {
    const { A, B: Bt, C, kunci } = soal;
    return G.kertasSvg({
      kosong: true, sp, ketuk,
      lapisan: (svg, px, py) => {
        const S = (p) => [px(p[0]), py(p[1])];
        const lin = (p, q, warna, tebal, putus) => { const a = S(p), b = S(q); svg.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: warna, 'stroke-width': tebal, 'stroke-linecap': 'round', 'stroke-dasharray': putus || 'none' })); };
        if (penuh) { svg.appendChild(svgEl('polygon', { points: [A, Bt, C, kunci].map((p) => S(p).join(',')).join(' '), fill: '#2BB673', 'fill-opacity': 0.18 })); lin(C, kunci, '#2BB673', 6); lin(kunci, A, '#2BB673', 6); }
        if (hasil && !hasil.benar) { lin(C, hasil.pilih, '#E04466', 4, '8 6'); lin(hasil.pilih, A, '#E04466', 4, '8 6'); }
        lin(A, Bt, '#1F2A44', 7); lin(Bt, C, '#1F2A44', 7);
        [[A, 'A'], [Bt, 'B'], [C, 'C']].forEach(([p, h]) => { const s = S(p); svg.appendChild(svgEl('circle', { cx: s[0], cy: s[1], r: 9, fill: '#1F2A44' })); });
        const huruf = (p, h, dx, dy) => { const s = S(p); teks(svg, s[0] + dx, s[1] + dy, h, 26, '#1F2A44'); };
        // huruf menjauh dari pusat ABC
        const pusat = [(A[0] + Bt[0] + C[0]) / 3, (A[1] + Bt[1] + C[1]) / 3];
        [[A, 'A'], [Bt, 'B'], [C, 'C']].forEach(([p, h]) => { const d = [p[0] - pusat[0], -(p[1] - pusat[1])], l = Math.hypot(d[0], d[1]) || 1; huruf(p, h, (d[0] / l) * 24, (d[1] / l) * 24); });
        if (hasil) { const s = S(hasil.pilih); svg.appendChild(svgEl('circle', { cx: s[0], cy: s[1], r: 11, fill: hasil.benar ? '#2BB673' : '#E04466', stroke: '#fff', 'stroke-width': 2 })); teks(svg, s[0] + 18, s[1] - 18, 'D', 26, hasil.benar ? '#2BB673' : '#E04466'); }
        if (penuh) { const s = S(kunci); svg.appendChild(svgEl('circle', { cx: s[0], cy: s[1], r: 11, fill: '#2BB673', stroke: '#fff', 'stroke-width': 2 })); teks(svg, s[0] + 18, s[1] - 18, 'D', 26, '#2BB673'); }
      },
    });
  }

  function tampilkanTri(soal, wadah, kirim) {
    const ukuran = KECIL() ? 340 : 400;
    const dua = soal.mode === 'dua';
    const gambar = el('div', 'sudut-tempat');
    gambar.appendChild(gambarTri(soal, dua ? (KECIL() ? 270 : 330) : ukuran));
    const baris = el('div', 'jg-baris');
    baris.appendChild(gambar);
    wadah.appendChild(baris);
    const kolom = el('div', 'cs-dua-kolom');
    const tombol = (k, klik) => {
      const b = el('button', 'tombol tombol-jg', '<span>' + TEKS[k] + '</span><small>' + ARTI[k] + '</small>');
      b.style.setProperty('--wj', WARNA_TOMBOL[k]);
      b.onclick = () => klik(b, k);
      return b;
    };
    if (soal.mode !== 'dua') {
      const opsi = el('div', 'jg-opsi');
      soal.opsi.forEach((k) => opsi.appendChild(tombol(k, () => kirim(periksa(soal, k)))));
      wadah.appendChild(opsi);
      return;
    }
    const pil = { sisi: null, sudut: null };
    const cek = el('button', 'tombol tombol-utama cs-cek', '✔ Cek jawaban');
    cek.disabled = true;
    const sesuaikan = () => { cek.disabled = !(pil.sisi && pil.sudut); };
    const baris2 = (judul, daftar, kunci) => {
      const w = el('div', 'cs-dua'); w.appendChild(el('div', 'cs-dua-judul', judul));
      const o = el('div', 'jg-opsi');
      const semua = [];
      daftar.forEach((k) => { const b = tombol(k, (bt) => { pil[kunci] = k; semua.forEach((x) => x.classList.toggle('dipilih', x === bt)); Suara.efek('pop'); sesuaikan(); }); semua.push(b); o.appendChild(b); });
      w.appendChild(o); return w;
    };
    kolom.appendChild(baris2('Menurut sisinya:', KUNCI_SISI, 'sisi'));
    kolom.appendChild(baris2('Menurut sudutnya:', KUNCI_SUDUT, 'sudut'));
    cek.onclick = () => kirim(periksa(soal, { sisi: pil.sisi, sudut: pil.sudut }));
    kolom.appendChild(cek);
    baris.appendChild(kolom);
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    if (soal.jenis === 'tri') tampilkanTri(soal, wadah, kirim);
    else if (soal.jenis === 'se') tampilkanSE(soal, wadah, kirim);
    else tampilkanD(soal, wadah, kirim);
  }

  // ---------- umpan balik ----------
  const daftarCek = (baris) => '<div class="cek-daftar">' + baris.map((b, i) => '<div class="cek-baris" style="--i:' + i + '">' + b + '</div>').join('') + '</div>';
  const maks3 = (a) => Math.max(a[0], a[1], a[2]);
  const idxMaks = (a) => a.indexOf(maks3(a));
  function uraianSisi(k, nilai, satuan) {
    const [a, b, c] = nilai, t = (x) => x + satuan;
    if (k === 'sama-sisi') return ['3 sisi sama panjang: ' + t(a) + ' = ' + t(b) + ' = ' + t(c) + ' ✔', '→ <b>sama sisi</b>'];
    if (k === 'sama-kaki') { const dua = a === b ? a : a === c ? a : b; const lain = [a, b, c].find((x, i, arr) => arr.indexOf(x) === arr.lastIndexOf(x)); return ['Tepat 2 sisi sama panjang: ' + t(dua) + ' = ' + t(dua) + ' ✔', 'Sisi ketiga berbeda: ' + t(lain) + ' ✘', '→ <b>sama kaki</b>']; }
    return ['Tidak ada sisi yang sama panjang: ' + t(a) + ', ' + t(b) + ', ' + t(c) + ' ✘', '→ <b>sembarang</b>'];
  }
  function uraianSudut(k, d) {
    const m = maks3(d);
    if (k === 'siku') return ['Ada satu sudut tepat 90° (kotak pojok pas) ✔', '→ <b>siku-siku</b>'];
    if (k === 'lancip') return ['Sudut terbesar ' + m + '° → kurang dari 90° ✔', 'Semua sudut lebih sempit dari kotak pojok 90°', '→ <b>lancip</b>'];
    return ['Sudut terbesar ' + m + '° → lebih dari 90° ✔', 'Lebih lebar dari kotak pojok 90°', '→ <b>tumpul</b>'];
  }
  function alasanTri(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    const ukuran = KECIL() ? 270 : 320;
    let svg, uraian = [], pilihTeks;
    if (soal.mode === 'sisi') {
      svg = gambarTri(soal, ukuran, { tanda: true });
      uraian = uraianSisi(soal.kunci, soal.sisi, ' cm');
      pilihTeks = TEKS[jawaban.pilih];
    } else if (soal.mode === 'sudut' || soal.mode === 'sudutCm') {
      const sudut = soal.mode === 'sudut' ? soal.sudut : null, sisi = soal.sisi;
      const iMaks = soal.mode === 'sudut' ? idxMaks(sudut) : (idxMaks(sisi) + 2) % 3; // sudut terbesar: di depan sisi terpanjang
      const o = soal.kunci === 'siku' ? { siku: [iMaks] } : { banding: [iMaks] };
      svg = gambarTri(soal, ukuran, o);
      if (soal.mode === 'sudut') uraian = uraianSudut(soal.kunci, sudut);
      else uraian = ['Sudut terbesar ada di depan sisi terpanjang (' + maks3(sisi) + ' cm).', 'Tempelkan kotak pojok 90° (oranye): ' + (soal.kunci === 'siku' ? 'pas ✔' : soal.kunci === 'lancip' ? 'sudutnya lebih sempit ✔' : 'sudutnya lebih lebar ✔'), '→ <b>' + kecilTeks(soal.kunci) + '</b>'];
      pilihTeks = TEKS[jawaban.pilih];
    } else {
      const d = soal.sudut, iMaks = idxMaks(d), o = { tanda: true };
      if (soal.kunci.sudut === 'siku') o.siku = [iMaks]; else o.banding = [iMaks];
      svg = gambarTri(soal, ukuran, o);
      uraian = ['Menurut sisi: ' + (soal.kunci.sisi === 'sama-sisi' ? '3 sudut sama → 3 sisi sama' : soal.kunci.sisi === 'sama-kaki' ? '2 sudut sama → 2 sisi sama (garis kecil)' : 'semua sudut berbeda → semua sisi berbeda') + ' → <b>' + kecilTeks(soal.kunci.sisi) + '</b>',
        'Menurut sudut: sudut terbesar ' + maks3(d) + '° ' + (soal.kunci.sudut === 'siku' ? 'pas 90°' : soal.kunci.sudut === 'lancip' ? 'kurang dari 90°' : 'lebih dari 90°') + ' → <b>' + kecilTeks(soal.kunci.sudut) + '</b>',
        '→ <b>' + TEKS_SUDUT_SEGITIGA[soal.kunci.sudut].toLowerCase() + ' ' + kecilTeks(soal.kunci.sisi) + '</b>'];
      pilihTeks = TEKS[jawaban.pilih.sisi] + ' + ' + TEKS[jawaban.pilih.sudut].toLowerCase();
    }
    baris.appendChild(svg);
    baris.appendChild(el('div', 'kotak-teks', daftarCek(uraian) + '<small>Kamu memilih ' + pilihTeks + '. Jumlah ketiga sudut segitiga selalu 180°.</small>'));
    wadah.appendChild(baris);
  }

  const CIRI = { persegi: '4 sisi sama panjang dan 4 sudut siku-siku', 'persegi-panjang': '2 pasang sisi sejajar dan 4 sudut siku-siku', jajargenjang: '2 pasang sisi sejajar', 'belah-ketupat': '4 sisi sama panjang', 'layang-layang': '2 pasang sisi bersebelahan sama panjang', trapesium: 'tepat 1 pasang sisi sejajar' };
  function uraianSE(pts) {
    const f = sifatSegiEmpat(pts), k = jenisSegiEmpat(pts);
    const bar = [];
    bar.push((f.cacahSejajar ? f.cacahSejajar + ' pasang sisi sejajar ✔' : 'Tidak ada sisi sejajar ✘') + (f.cacahSejajar === 1 ? ' (tepat satu pasang)' : ''));
    bar.push((f.cacahSiku ? f.cacahSiku + ' sudut siku-siku ✔' : 'Tidak ada sudut siku-siku ✘'));
    if (f.semuaSama) bar.push('4 sisi sama panjang ✔');
    else if (f.layang) bar.push('2 pasang sisi bersebelahan sama panjang ✔');
    else if (f.kelasSisi[0] === f.kelasSisi[2] && f.kelasSisi[1] === f.kelasSisi[3]) bar.push('Sisi berhadapan sama panjang, 4 sisi tidak semua sama ✘');
    else bar.push('Tidak ada sisi yang sama panjang ✘');
    bar.push('→ <b>' + TE[k].toLowerCase() + '</b>');
    return bar;
  }
  function alasanSE(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    baris.appendChild(gambarSE(soal.pts, KECIL() ? 38 : 44, { sejajar: true, siku: true, sama: true }));
    let t = daftarCek(uraianSE(soal.pts));
    const p = jawaban.pilih;
    if ((LEBIH_UMUM[soal.kunci] || []).includes(p)) t += '<div class="cs-catatan">Benar sifatnya, tetapi ada nama yang <b>lebih tepat</b>: <b>' + TE[soal.kunci].toLowerCase() + '</b>.</div>';
    else if (soal.kunci === 'trapesium' && p === 'jajargenjang') t += '<div class="cs-catatan">Jajargenjang punya <b>dua</b> pasang sisi sejajar. Trapesium tepat <b>satu</b> pasang.</div>';
    t += '<small>Kamu memilih ' + TE[p] + ' (ciri: ' + CIRI[p] + ').</small>';
    baris.appendChild(el('div', 'kotak-teks', t));
    wadah.appendChild(baris);
  }
  function alasanD(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    baris.appendChild(gambarTitikD(soal, KECIL() ? 38 : 44, jawaban.pilih ? { pilih: jawaban.pilih, benar: false } : null, true, null));
    const lang = teksLangkah(kurang(soal.A, soal.B));
    baris.appendChild(el('div', 'kotak-teks', daftarCek(['Dari B ke A: <b>' + lang + '</b>.', 'Ikuti langkah yang <b>sama</b> dari C: <b>' + lang + '</b> → titik D (hijau).', 'Sisi DC sejajar dan sama panjang dengan AB ✔']) + '<small>Titik merah yang kamu ketuk membuat sisinya tidak sejajar.</small>'));
    wadah.appendChild(baris);
  }
  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'tri') return alasanTri(soal, jawaban, wadah);
    if (soal.jenis === 'se') return alasanSE(soal, jawaban, wadah);
    return alasanD(soal, jawaban, wadah);
  }
  function pujian(soal) {
    if (soal.jenis === 'tri') {
      if (soal.mode === 'sisi') { const u = uraianSisi(soal.kunci, soal.sisi, ' cm'); return { html: u[0].replace(/ [✔✘]/g, '') + ' ' + u[u.length - 1] }; }
      if (soal.mode === 'dua') return { html: '<b>' + TEKS_SUDUT_SEGITIGA[soal.kunci.sudut].toLowerCase() + ' ' + kecilTeks(soal.kunci.sisi) + '</b>' };
      return { html: 'Segitiga <b>' + kecilTeks(soal.kunci) + '</b>' };
    }
    if (soal.jenis === 'se') { const u = uraianSE(soal.pts); return { html: u.slice(0, -1).join(' · ').replace(/ [✔✘]/g, '') + ' → <b>' + TE[soal.kunci].toLowerCase() + '</b>' }; }
    return { html: 'D = A + C − B: sisi berhadapan sejajar dan sama panjang → <b>' + (soal.bentuk === 'persegi' ? 'persegi' : 'jajargenjang') + '</b>' };
  }

  root.GameCekSifat = Object.assign({
    id: 'cek-sifat',
    tingkat: ['segitiga menurut sisi, segi empat tegak', 'menurut sudut, belah ketupat & layang-layang', 'dua nama, diputar, lengkapi titik D'],
    ingat: 'Segitiga: menurut sisi (sama sisi, sama kaki, sembarang) dan menurut sudut (siku-siku, lancip, tumpul). Segi empat: lihat sisi sejajar, sudut siku, dan sisi sama panjang, lalu pilih nama yang paling tepat.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
