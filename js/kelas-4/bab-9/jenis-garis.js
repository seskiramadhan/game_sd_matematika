// Mini game 🛤️ Jenis Garis (Kelas 4 Bab 9).
// Soal 1-3: dua garis (diputar acak, huruf A-B dan C-D) -> pilih Sejajar / Berpotongan / Tegak lurus.
// Soal 4-5: gambar benda (rel, jendela berkisi, zebra cross, gunting, tanda tambah, tangga) dengan 2 tepi disorot (tingkat 3 soal 5: tiga garis a, b, c).
// Tegak lurus = berpotongan siku-siku; kunci tunggal "Tegak lurus" (memilih "Berpotongan" untuk garis siku dianggap salah, dengan penjelasan).
// Tingkat 1: garis mendatar/tegak, berpotongan 30-60° · 2: diputar acak, berpotongan dekat 90° · 3: garis putus / hampir sejajar (perlu Perpanjang) + tiga garis.
// Kunci gambar bebas dari selisih sudut derajat bulat (mod 180); benda dari vektor bulat (silang/titik). Cek: node tools/cek-bab9.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('./garis.js') : root.Garis;
  const { acak, pilih, kocok, TEKS_JENIS, SIMBOL, ARTI, jenisSudutGaris, jenisVektor, arah, tambah, potong, kurang, silang, titikKali } = G;
  const S = modul ? require('../bab-8/sudut.js') : root.Sudut;
  const { ambilHuruf } = S;

  // ---------- Logika (tanpa DOM) ----------
  const WARNA1 = '#1F2A44', WARNA2 = '#2A7BE8', MERAH = '#E04466', ABU = '#9AA4B8';
  const KUNCI3 = ['sejajar', 'berpotongan', 'tegak'];
  const rad = (d) => (d * Math.PI) / 180;
  const rect = (r) => Math.abs(r[0]) <= 218 && Math.abs(r[1]) <= 138;

  function segmen(P, th, a, b) { const u = arah(th); return { p: tambah(P, u, -a), q: tambah(P, u, b) }; }
  function titikLabel(g) {
    return [[g.p, g.q], [g.q, g.p]].map(([e, lain]) => { const d = kurang(e, lain), n = Math.hypot(d[0], d[1]); return tambah(e, [d[0] / n, d[1] / n], 21); });
  }

  function cobaGaris(tingkat, kunci) {
    const M = [acak(-12, 12), acak(-10, 10)];
    const t1 = tingkat === 1 ? pilih([0, 90]) : acak(0, 179);
    let delta;
    if (kunci === 'sejajar') delta = 0;
    else if (kunci === 'tegak') delta = 90;
    else if (tingkat === 1) delta = pilih([30, 35, 40, 45, 50, 55, 60, 120, 125, 130, 135, 140, 145, 150]);
    else if (tingkat === 2) delta = pilih([75, 80, 85, 95, 100, 105]);
    else delta = pilih([-1, 1]) * acak(6, 12);
    const t2 = t1 + delta;
    if (jenisSudutGaris(t1, t2) !== kunci) return null;
    const u1 = arah(t1), u2 = arah(t2);
    const a1 = acak(60, 95), b1 = acak(60, 95), a2 = acak(60, 95), b2 = acak(60, 95);
    let L1, L2, zoom = 1, luar = false;
    if (tingkat === 3 && kunci !== 'sejajar') {
      zoom = 3; luar = true;
      const s = pilih([-1, 1]) * (kunci === 'tegak' ? acak(135, 170) : acak(280, 430));
      const X = tambah(M, u1, s);
      L1 = segmen(M, t1, a1, b1);
      if (kunci === 'tegak') {
        const sg = pilih([-1, 1]), g = acak(35, 60), L = acak(70, 100);
        L2 = { p: tambah(X, u2, sg > 0 ? g : -(g + L)), q: tambah(X, u2, sg > 0 ? g + L : -g) };
      } else {
        const tp = titikKali(kurang(M, X), u2);
        L2 = { p: tambah(X, u2, tp - a2), q: tambah(X, u2, tp + b2) };
        if (Math.abs(X[0]) <= 246 && Math.abs(X[1]) <= 166) return null; // titik potong harus di luar gambar
      }
    } else if (kunci === 'sejajar') {
      const g = tingkat === 3 ? acak(45, 75) : acak(56, 90), n = [Math.sin(rad(t1)), Math.cos(rad(t1))];
      L1 = segmen(tambah(M, n, g / 2), t1, a1, b1);
      L2 = segmen(tambah(M, n, -g / 2), t2, a2, b2);
    } else {
      const X = [M[0] + acak(-20, 20), M[1] + acak(-15, 15)];
      L1 = segmen(X, t1, a1, b1); L2 = segmen(X, t2, a2, b2);
    }
    const [h1, h2, h3, h4] = ambilHuruf(4);
    const garis = [
      Object.assign({ warna: WARNA1, lebar: 7, titikUjung: true, huruf: [h1, h2] }, L1),
      Object.assign({ warna: WARNA2, lebar: 7, titikUjung: true, huruf: [h3, h4] }, L2),
    ];
    if (!garis.every((g) => titikLabel(g).every(rect))) return null;
    return { jenis: 'garis', tingkat, kunci, t1, t2, luar, huruf: [h1 + h2, h3 + h4], spec: { garis, fokus: [0, 1], zoom, kunci }, kode: 'g' + kunci + t1 + ':' + t2 + h1 + h2 + h3 + h4 };
  }
  function soalGaris(tingkat, kunci) {
    for (let i = 0; i < 20000; i++) { const s = cobaGaris(tingkat, kunci); if (s) return s; }
    throw new Error('gagal membuat garis ' + tingkat + kunci);
  }

  // tiga garis a, b, c
  const TEKS_TIGA = {
    'dua-tegak': 'Garis <b>a</b> tegak lurus garis <b>c</b>. Garis <b>b</b> juga tegak lurus garis <b>c</b>.<br>Garis <b>a</b> dan garis <b>b</b> …?',
    'dua-sejajar': 'Garis <b>a</b> sejajar garis <b>c</b>. Garis <b>b</b> juga sejajar garis <b>c</b>.<br>Garis <b>a</b> dan garis <b>b</b> …?',
    'sejajar-tegak': 'Garis <b>a</b> sejajar garis <b>c</b>. Garis <b>b</b> tegak lurus garis <b>c</b>.<br>Garis <b>a</b> dan garis <b>b</b> …?',
  };
  const ALASAN_TIGA = {
    'dua-tegak': 'a dan b sama-sama tegak lurus pada c, jadi arahnya sama. Diperpanjang, keduanya tidak pernah bertemu → <b>sejajar</b>.',
    'dua-sejajar': 'a dan b sama-sama sejajar dengan c, jadi arahnya sama dengan c dan satu sama lain → <b>sejajar</b>.',
    'sejajar-tegak': 'a sejajar c, dan b tegak lurus c, jadi b juga membentuk sudut siku-siku dengan a → <b>tegak lurus</b>.',
  };
  function soalTiga() {
    for (;;) {
      const varian = pilih(Object.keys(TEKS_TIGA));
      const th = acak(0, 179), uc = arah(th), n = [Math.sin(rad(th)), Math.cos(rad(th))];
      const M = [acak(-10, 10), acak(-8, 8)];
      const c = segmen(M, th, 115, 115);
      let ta, tb, a, b;
      if (varian === 'dua-tegak') {
        ta = tb = th + 90;
        a = segmen(tambah(M, uc, -acak(55, 100)), ta, 70, 70); b = segmen(tambah(M, uc, acak(55, 100)), tb, 70, 70);
      } else if (varian === 'dua-sejajar') {
        ta = tb = th;
        const g1 = acak(45, 70), g2 = acak(45, 70);
        a = segmen(tambah(M, n, g1), ta, 105, 105); b = segmen(tambah(M, n, -g2), tb, 105, 105);
      } else {
        ta = th; tb = th + 90;
        const g1 = acak(45, 70);
        a = segmen(tambah(M, n, g1), ta, 105, 105);
        b = segmen(tambah(M, uc, acak(-60, 60)), tb, g1 + 30, 50); // arah tb = -n: ujung p ke sisi +n (menuju a)
      }
      const L = [[a, 'a', WARNA1], [b, 'b', WARNA2], [c, 'c', ABU]].map(([s, nama, warna]) => {
        const lp = titikLabel(Object.assign({}, s, {}))[1];
        return Object.assign({ warna, lebar: nama === 'c' ? 6 : 7, label: nama, labelPos: lp }, s);
      });
      if (!L.every((g) => titikLabel(g).every(rect))) continue;
      return { jenis: 'tiga', tingkat: 3, varian, kunci: jenisSudutGaris(ta, tb), ta, tb, spec: { garis: L, fokus: [0, 1], zoom: 1 }, kode: 'k' + varian + th + ':' + ta + ':' + tb };
    }
  }

  // ---------- Benda sehari-hari (koordinat bulat 480 x 320; dipusatkan saat digambar) ----------
  const T = (p) => [p[0] - 240, p[1] - 160];
  const dekorRect = (x, y, w, h, fill, stroke) => ({ tag: 'rect', attr: { x: x - 240, y: y - 160, width: w, height: h, rx: 10, fill, stroke: stroke || 'none', 'stroke-width': 3 } });
  const dekorCirc = (x, y, r, fill, stroke) => ({ tag: 'circle', attr: { cx: x - 240, cy: y - 160, r, fill: fill || 'none', stroke: stroke || ABU, 'stroke-width': 6 } });
  const BENDA = [
    { id: 'rel', nama: 'rel kereta api', warna: ABU, dekor: [dekorRect(20, 85, 440, 150, '#EFE6D2')],
      garis: { r1: [[30, 120], [450, 120]], r2: [[30, 200], [450, 200]], s1: [[90, 95], [90, 225]], s2: [[190, 95], [190, 225]], s3: [[290, 95], [290, 225]], s4: [[390, 95], [390, 225]] },
      pasangan: [['r1', 'r2'], ['r1', 's1'], ['s1', 's2'], ['r2', 's3'], ['s2', 's4']] },
    { id: 'jendela', nama: 'jendela berkisi', warna: ABU, dekor: [dekorRect(100, 40, 280, 240, '#DDEBFF')],
      garis: { l: [[100, 40], [100, 280]], r: [[380, 40], [380, 280]], t: [[100, 40], [380, 40]], b: [[100, 280], [380, 280]], v1: [[170, 40], [170, 280]], v2: [[240, 40], [240, 280]], v3: [[310, 40], [310, 280]], h1: [[100, 110], [380, 110]], h2: [[100, 180], [380, 180]] },
      pasangan: [['v1', 'v2'], ['v1', 'h1'], ['h1', 'h2'], ['l', 'r'], ['t', 'v3'], ['h2', 'v2']] },
    { id: 'zebra', nama: 'zebra cross', warna: '#FFFFFF', dekor: [dekorRect(10, 60, 460, 200, '#6B7280')],
      garis: { e1: [[10, 60], [470, 60]], e2: [[10, 260], [470, 260]], z1: [[200, 90], [320, 90]], z2: [[200, 130], [320, 130]], z3: [[200, 170], [320, 170]], z4: [[200, 210], [320, 210]], st: [[140, 160], [140, 250]] },
      pasangan: [['z1', 'z2'], ['z2', 'z4'], ['z1', 'e1'], ['z3', 'st'], ['e2', 'st']] },
    { id: 'gunting', nama: 'gunting terbuka', warna: ABU, dekor: [dekorCirc(52, 48, 30), dekorCirc(52, 272, 30)],
      garis: { b1: [[60, 40], [420, 280]], b2: [[60, 280], [420, 40]], meja: [[20, 304], [460, 304]] },
      pasangan: [['b1', 'b2'], ['b1', 'meja']] },
    { id: 'tambah', nama: 'tanda tambah', warna: ABU, dekor: [dekorRect(60, 20, 360, 280, '#FFF4F6'), dekorRect(215, 50, 50, 220, '#FFD6DE'), dekorRect(110, 135, 260, 50, '#FFD6DE')],
      garis: { v: [[240, 50], [240, 270]], h: [[110, 160], [370, 160]], alas: [[60, 300], [420, 300]] },
      pasangan: [['v', 'h'], ['v', 'alas'], ['h', 'alas']] },
    { id: 'atap', nama: 'atap rumah', warna: ABU, dekor: [{ tag: 'polygon', attr: { points: '-180,100 0,-100 180,100', fill: '#FFE9D1', stroke: 'none' } }],
      garis: { kiri: [[60, 260], [240, 60]], kanan: [[240, 60], [420, 260]], alas: [[60, 260], [420, 260]] },
      pasangan: [['kiri', 'kanan'], ['kiri', 'alas'], ['kanan', 'alas']] },
    { id: 'tangga', nama: 'tangga', warna: ABU, dekor: [],
      garis: { s1: [[140, 260], [217, 29]], s2: [[260, 300], [337, 69]], k1: [[160, 200], [280, 240]], k2: [[185, 125], [305, 165]], k3: [[210, 50], [330, 90]] },
      pasangan: [['s1', 's2'], ['k1', 's1'], ['k1', 'k2'], ['k3', 's2'], ['k2', 'k3']] },
  ];
  const vek = (g) => kurang(g[1], g[0]);
  function bangunBenda(b, pasang) {
    const [i1, i2] = pasang;
    const kunci = jenisVektor(vek(b.garis[i1]), vek(b.garis[i2]));
    const garis = Object.keys(b.garis).map((id) => {
      const [p, q] = b.garis[id].map(T);
      const f = id === i1 ? 1 : id === i2 ? 2 : 0;
      return { id, f, p, q, warna: f === 1 ? MERAH : f === 2 ? WARNA2 : b.warna, lebar: f ? 10 : 7 };
    }).sort((x, y) => x.f - y.f); // garis yang disorot digambar paling atas
    const urut = garis;
    const fokus = [urut.findIndex((g) => g.f === 1), urut.findIndex((g) => g.f === 2)];
    return { jenis: 'benda', benda: b.id, nama: b.nama, pasangan: [i1, i2], kunci, kode: 'b' + b.id + i1 + i2, spec: { garis: urut, fokus, zoom: 1, dekor: b.dekor, kunci } };
  }
  function soalBenda(tingkat, kunci, bukanId) {
    const kandidat = [];
    BENDA.forEach((b) => { if (b.id !== bukanId) b.pasangan.forEach((ps) => { if (!kunci || jenisVektor(vek(b.garis[ps[0]]), vek(b.garis[ps[1]])) === kunci) kandidat.push([b, ps]); }); });
    if (!kandidat.length) BENDA.forEach((b) => b.pasangan.forEach((ps) => { if (!kunci || jenisVektor(vek(b.garis[ps[0]]), vek(b.garis[ps[1]])) === kunci) kandidat.push([b, ps]); }));
    const [b, ps] = pilih(kandidat);
    const o = bangunBenda(b, Math.random() < 0.5 ? ps : [ps[1], ps[0]]);
    o.tingkat = tingkat;
    return o;
  }

  function tigaGaris(tingkat) {
    for (;;) {
      let ks;
      if (tingkat === 1) ks = kocok(KUNCI3);
      else ks = [pilih(KUNCI3), pilih(KUNCI3), pilih(KUNCI3)];
      if (new Set(ks).size < 2) continue;
      const r = ks.map((k) => soalGaris(tingkat, k));
      if (new Set(r.map((s) => s.kode)).size === 3) return r;
    }
  }
  function buatRonde(tingkat) {
    for (;;) {
      const tiga = tigaGaris(tingkat);
      const s4 = soalBenda(tingkat);
      const s5 = tingkat === 3 ? soalTiga() : soalBenda(tingkat, null, s4.benda);
      const ronde = tiga.concat([s4, s5]);
      if (new Set(ronde.map((s) => s.kode)).size === 5) return ronde;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'garis') s = soalGaris(tingkat, soal.kunci);
      else if (soal.jenis === 'tiga') s = soalTiga();
      else s = soalBenda(tingkat, soal.kunci, soal.benda);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, pilihan) => ({ benar: pilihan === soal.kunci, pilih: pilihan });

  const logika = { BENDA, buatRonde, soalGaris, soalTiga, soalBenda, soalMirip, periksa, TEKS_TIGA };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, adeganSvg } = G;
  const WARNA_TOMBOL = { sejajar: '#3A86FF', berpotongan: '#9B5DE5', tegak: '#2BB673' };
  const KECIL = () => window.innerHeight < 790;

  function teksSoal(soal) {
    if (soal.jenis === 'garis') return 'Garis <b>' + soal.huruf[0] + '</b> dan garis <b>' + soal.huruf[1] + '</b> termasuk jenis apa?';
    if (soal.jenis === 'tiga') return TEKS_TIGA[soal.varian];
    return 'Pada gambar <b>' + soal.nama + '</b>, dua garis yang disorot (<b class="merah">merah</b> dan <b class="biru">biru</b>) termasuk jenis apa?';
  }

  function tampilkan(soal, wadah, kirim) {
    const ukuran = KECIL() ? 400 : 470;
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    const baris = el('div', 'jg-baris');
    const tempat = el('div', 'sudut-tempat');
    let panjang = false;
    const gambar = () => { tempat.innerHTML = ''; tempat.appendChild(adeganSvg(soal.spec, { perpanjang: panjang, pojok: false, ukuran })); };
    gambar();
    const kanan = el('div', 'des-kanan');
    const bantu = el('button', 'tombol tombol-bantu', '↔ Perpanjang');
    bantu.onclick = () => { panjang = !panjang; bantu.classList.toggle('dipilih', panjang); bantu.textContent = panjang ? '↩ Kembali' : '↔ Perpanjang'; Suara.efek('pop'); gambar(); };
    kanan.append(bantu, el('div', 'ingat-kecil', 'Ragu? Perpanjang kedua garis,<br>lalu lihat: bertemu atau tidak?'));
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
    const opsi = el('div', 'jg-opsi');
    KUNCI3.forEach((k) => {
      const b = el('button', 'tombol tombol-jg', '<span>' + TEKS_JENIS[k] + (SIMBOL[k] ? ' <span class="simbol">' + SIMBOL[k] + '</span>' : '') + '</span><small>' + ARTI[k] + '</small>');
      b.style.setProperty('--wj', WARNA_TOMBOL[k]);
      b.onclick = () => kirim(periksa(soal, k));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function pujian(soal) {
    const k = soal.kunci;
    if (soal.jenis === 'garis') {
      const [g1, g2] = soal.huruf;
      const rel = k === 'sejajar' ? 'garis ' + g1 + ' ∥ garis ' + g2 : k === 'tegak' ? 'garis ' + g1 + ' ⊥ garis ' + g2 : 'garis ' + g1 + ' dan garis ' + g2;
      return { html: rel + ' → <b>' + TEKS_JENIS[k].toLowerCase() + '</b>' };
    }
    if (soal.jenis === 'tiga') return { html: ALASAN_TIGA[soal.varian] };
    return { html: 'Dua garis itu <b>' + TEKS_JENIS[k].toLowerCase() + '</b>' + (SIMBOL[k] ? ' (' + SIMBOL[k] + ')' : '') + ': ' + ARTI[k] + '.' };
  }

  function alasan(soal, jawaban, wadah) {
    const k = soal.kunci;
    const baris = el('div', 'alasan-baris');
    baris.appendChild(adeganSvg(soal.spec, { perpanjang: true, pojok: k !== 'sejajar', ukuran: KECIL() ? 290 : 340 }));
    let t = '';
    if (soal.jenis === 'tiga') t = ALASAN_TIGA[soal.varian] + '<br>Garis fokus diperpanjang (putus-putus).';
    else if (k === 'sejajar') t = 'Kedua garis diperpanjang (putus-putus): <b>tidak pernah bertemu</b> → <b>sejajar</b> (∥).';
    else if (k === 'berpotongan') t = 'Diperpanjang, kedua garis <b>bertemu di satu titik</b> (kuning). Pojok 90° (oranye) <b>tidak pas</b> dengan garis kedua → <b>berpotongan</b>.';
    else t = 'Kedua garis bertemu di satu titik (kuning) dan pojok 90° (oranye) <b>pas</b> → <b>tegak lurus</b> (⊥).';
    if (soal.jenis !== 'tiga') {
      if (k === 'tegak' && jawaban.pilih === 'berpotongan') t += '<br>Tegak lurus <b>juga berpotongan</b>, tetapi sudutnya siku-siku (90°), jadi namanya lebih khusus: <b>tegak lurus</b>.';
      if (k === 'berpotongan' && jawaban.pilih === 'sejajar') t += '<br>Garis yang di layar belum bersentuhan belum tentu sejajar: <b>perpanjang dulu</b>.';
    }
    baris.appendChild(el('div', 'kotak-teks', t + '<br><small>Kamu memilih ' + TEKS_JENIS[jawaban.pilih] + '.</small>'));
    wadah.appendChild(baris);
  }

  root.GameJenisGaris = Object.assign({
    id: 'jenis-garis',
    tingkat: ['garis lurus mendatar/tegak', 'diputar, dekat 90°', 'garis putus & tiga garis'],
    ingat: 'Sejajar: tidak pernah bertemu walau diperpanjang. Berpotongan: bertemu di satu titik. Tegak lurus: berpotongan dan membentuk sudut siku-siku (90°).',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
