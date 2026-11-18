// Data 📖 Soal Cerita Kelas 4 Bab 9 (Garis & Sudut) untuk mesin js/soal-cerita.js.
// Pesan inti: GARIS LURUS = 180°, SILANG = BERSEBERANGAN SAMA BESAR. Derajat bilangan bulat.
//   lurus   (Sudut di garis lurus): sudut-sudut berjajar di satu garis lurus; yang dicari = 180° - jumlah yang diketahui.
//                                   T1: 1 sudut diketahui; T2: 2 sudut; T3: 3 sudut. Pengecoh: 360° dipakai, 90° dipakai, lupa salah satu sudut, menjumlah saja.
//   silang  (Perempatan / silang): dua garis lurus berpotongan, satu sudut diketahui. T2: satu sudut ditanya (seberang = sama, sebelah = 180° - itu);
//                                  T3: ketiga sudut lainnya sekaligus, jawaban "seberang, sebelah, sebelah" (mis. 55°, 125°, 125°).
//                                  Pengecoh: seberang dikira 180° - x, sebelah dikira sama, dihitung dari 90° atau 360°.
//   sejajar (Sejajar atau tegak lurus?, hanya T1): tiga jalan / rel / selokan, hitung pasangan. Tidak pernah bertemu = sejajar,
//                                  memotong tepat 90° = tegak lurus, lainnya hanya berpotongan. 3 garis = 3 pasang.
// Tingkat 3 + 1-2 angka pengecoh di Tandai. Gambar: sudut berwarna di garis lurus (+ "?"), dua garis bersilang, atau denah garis;
//   3 pilihan, tepat satu cocok (data-* di SVG dipakai skrip cek). Pengecoh gambar: garis patah (tidak lurus), tanda seberang salah, bentuk lain.
// Contoh tetap (video Ep. 12 / Buku Saku), muncul sekitar 12% di tingkat yang cocok: Tali Lampu 40° dan 85° -> 55° (T2);
//   Perempatan Jalan Cemara dan Dahlia 55° -> 55°, 125°, 125° dan dua penggaris 70° -> 70°, 110°, 110° (T3);
//   denah Mawar, Melati, Kenanga -> 1 pasang sejajar, 2 pasang tegak lurus (T1).
// Tes: node tools/cek-soal-cerita-bab9.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok, buatOpsi } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (v) => ({ k: 'angka', t: v + '°', nilai: v, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false });
  const Q = (t) => ({ k: 'tanya', t });
  const ORANG = ['Pak Joko', 'Bu Ani', 'Rina', 'Bima', 'Citra', 'Dimas'];
  const PASANG = [['Cemara', 'Dahlia'], ['Kenari', 'Mawar'], ['Jati', 'Anggrek'], ['Pinus', 'Melati']];

  // ---------- Templat ----------
  const TA = [ // sudut berjajar di garis lurus
    { id: 'tali', intro: (n) => n + ' memasang tali lampu dari satu paku pada balok kayu yang lurus. Tali-tali itu membagi sisi balok menjadi sudut-sudut yang berjajar. ' },
    { id: 'jalan', intro: () => 'Dari satu titik di sebuah jalan yang lurus, keluar beberapa jalan cabang. Jalan-jalan cabang itu membuat sudut-sudut yang berjajar di satu sisi jalan lurus. ' },
    { id: 'lampu', intro: () => 'Lampu sorot di tepi panggung yang lurus menyinari beberapa arah dari satu titik. Sinar-sinar itu membuat sudut-sudut yang berjajar di sisi panggung yang lurus. ' },
    { id: 'kue', intro: (n) => n + ' memotong kue setengah lingkaran dari satu titik di sisi lurusnya. Potongan-potongannya membuat sudut-sudut yang berjajar di sepanjang sisi lurus. ' },
  ];
  const TX = [ // dua garis lurus berpotongan
    { id: 'perempatan', mk: (p) => ['Jalan ' + p[0] + ' dan Jalan ' + p[1] + ' sama-sama lurus dan berpotongan di sebuah perempatan. Salah satu sudut pertemuannya ', '{a}', '. '] },
    { id: 'penggaris', mk: () => ['Dua penggaris yang lurus disilangkan sehingga berpotongan di satu titik. Salah satu sudut yang terbentuk ', '{a}', '. '] },
    { id: 'pita', mk: () => ['Dua pita yang lurus pada sebuah kado berpotongan di tengah tutupnya. Salah satu sudut di antara kedua pita itu ', '{a}', '. '] },
    { id: 'tongkat', mk: () => ['Dua tongkat pramuka yang lurus disilangkan dan berpotongan di satu titik. Salah satu sudutnya ', '{a}', '. '] },
    { id: 'rel', mk: () => ['Dua rel kereta yang lurus berpotongan di sebuah persimpangan. Salah satu sudut perpotongannya ', '{a}', '. '] },
  ];
  const KIND = ['Jalan', 'Rel', 'Selokan'];
  const NAMA3 = [['Mawar', 'Melati', 'Kenanga'], ['Cemara', 'Dahlia', 'Anggrek'], ['Kenari', 'Jati', 'Pinus'], ['Apel', 'Jeruk', 'Mangga']];
  const TRI = [[50, 60, 70], [40, 60, 80], [45, 65, 70], [55, 55, 70], [35, 65, 80], [30, 70, 80]];
  const CONTOH = [
    { jenis: 'lurus', tp: 'tali', nama: 'Pak Joko', xs: [40, 85] },
    { jenis: 'silang', tp: 'perempatan', pasang: ['Cemara', 'Dahlia'], x: 55 },
    { jenis: 'silang', tp: 'penggaris', pasang: ['Cemara', 'Dahlia'], x: 70 },
    { jenis: 'sejajar', cfg: 'S', kind: 'Jalan', nama3: ['Mawar', 'Melati', 'Kenanga'] },
  ];
  const DIS = [{ k: ' Kejadian itu pada tanggal {x}.', lo: 11, hi: 28 }, { k: ' Ada {x} anak yang menonton.', lo: 11, hi: 45 }, { k: ' Semua itu berlangsung {x} menit.', lo: 11, hi: 45 }];

  // ---------- Gambar (string SVG; atribut data-* dibaca skrip cek) ----------
  const W = { biru: '#3A86FF', oranye: '#FF8A3D', merah: '#FF6384', teks: '#1F2A44', hijau: '#2BB673' };
  const svg = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  const r1 = (x) => Math.round(x * 10) / 10;
  const rad = (d) => (d * Math.PI) / 180;
  const tekG = (x, y, t, w) => '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="19" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="' + (w || W.teks) + '" stroke="#FFFFFF" stroke-width="4" paint-order="stroke">' + t + '</text>';
  const tekK = (x, y, t) => '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="13" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="' + W.teks + '" stroke="#FFFFFF" stroke-width="4" paint-order="stroke">' + t + '</text>';
  // titik pada sudut deg (berlawanan jarum jam, 0 = ke kanan) dari pusat (vx, vy)
  const pt = (vx, vy, deg, r) => [r1(vx + r * Math.cos(rad(deg))), r1(vy - r * Math.sin(rad(deg)))];
  function sektor(vx, vy, R, a0, a1, isi, garis, putus) {
    const p0 = pt(vx, vy, a0, R), p1 = pt(vx, vy, a1, R);
    return '<path d="M' + vx + ' ' + vy + ' L' + p0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 0 ' + p1.join(' ') + ' Z" fill="' + isi + '" fill-opacity="0.3" stroke="' + garis + '" stroke-width="3"' + (putus ? ' stroke-dasharray="8 6"' : '') + '/>';
  }
  const garisT = (p, q, w) => '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="' + (w || W.teks) + '" stroke-width="5" stroke-linecap="round"/>';

  // sudut berjajar di garis lurus: angka terakhir = yang ditanya ("?"). bengkok = garis tidak lurus (pengecoh gambar)
  function lurusSvg(angka, bengkok) {
    const VX = 160, VY = 168, R = 122, tanya = angka.length - 1;
    const bag = angka.slice();
    if (bengkok) bag[tanya] += bag[tanya] > 45 ? -35 : 40;
    let s = '<g data-model="lurus" data-bagian="' + angka.slice(0, tanya).join(',') + '" data-lurus="' + (bengkok ? 0 : 1) + '">';
    let c = 0;
    bag.forEach((b, i) => {
      const warna = i === tanya ? W.merah : i % 2 ? W.oranye : W.biru;
      s += sektor(VX, VY, R, c, c + b, warna, warna, i === tanya);
      s += tekG(...pt(VX, VY, c + b / 2, R * (i % 2 ? 0.8 : 0.52)), i === tanya ? '?' : b + '°', i === tanya ? W.merah : null);
      if (i < tanya) s += garisT([VX, VY], pt(VX, VY, c + b, R + 4));
      c += b;
    });
    s += garisT([VX, VY], [VX + R + 6, VY]);
    s += garisT([VX, VY], bengkok ? pt(VX, VY, c, R + 6) : [VX - R - 6, VY]);
    return svg(s + '<circle cx="' + VX + '" cy="' + VY + '" r="6" fill="' + W.teks + '"/></g>');
  }

  // dua garis lurus bersilang; sudut x diketahui (biru), tanda: seberang | sebelah | semua
  function silangSvg(x, tanda) {
    const VX = 160, VY = 95, R = 84;
    const L2 = Math.min(138, 86 / Math.sin(rad(x)));
    let s = '<g data-model="silang" data-x="' + x + '" data-tanda="' + tanda + '">';
    [[0, x], [x, 180], [180, 180 + x], [180 + x, 360]].forEach((a, i) => {
      const dik = i === 0, tanyaIni = (i === 2 && tanda !== 'sebelah') || (i === 1 && tanda !== 'seberang') || (i === 3 && tanda === 'semua');
      const warna = dik ? W.biru : tanyaIni ? W.merah : '#9AA5BD';
      s += sektor(VX, VY, R, a[0], a[1], warna, warna, tanyaIni);
      const besar = a[1] - a[0];
      if (dik || tanyaIni) s += tekG(...pt(VX, VY, (a[0] + a[1]) / 2, besar < 60 ? R * 0.74 : R * 0.6), dik ? x + '°' : '?', dik ? null : W.merah);
    });
    s += garisT([VX - 140, VY], [VX + 140, VY]);
    s += garisT(pt(VX, VY, x + 180, L2), pt(VX, VY, x, L2));
    return svg(s + '<circle cx="' + VX + '" cy="' + VY + '" r="6" fill="' + W.teks + '"/></g>');
  }

  // denah garis: tiga garis (cfg S, 2, 3, 4) dipotong kotak gambar
  const BOX = { x0: 14, y0: 32, x1: 306, y1: 176 };
  function klip(px, py, dx, dy) {
    let tmin = -1e9, tmax = 1e9;
    [[dx, BOX.x0 - px, BOX.x1 - px], [dy, BOX.y0 - py, BOX.y1 - py]].forEach(([d, a, b]) => {
      if (Math.abs(d) < 1e-9) return;
      let t1 = a / d, t2 = b / d; if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    });
    return [[px + tmin * dx, py + tmin * dy], [px + tmax * dx, py + tmax * dy]];
  }
  const SJ = { S: [1, 2], '2': [1, 0], '3': [0, 1], '4': [0, 0] }; // [pasang sejajar, pasang tegak lurus]
  function denahSvg(cfg, ang, nama) {
    const warna = [W.biru, W.oranye, W.hijau];
    const d = (deg) => [Math.cos(rad(deg)), -Math.sin(rad(deg))];
    let g; // tiga garis: [titik x, titik y, arah x, arah y]
    if (cfg === 'S') g = [[160, 62, 1, 0], [160, 140, 1, 0], [160, 100, 0, -1]];
    else if (cfg === '2') g = [[160, 62, 1, 0], [160, 140, 1, 0], [160, 100].concat(d(ang[0]))];
    else if (cfg === '3') g = [[160, 48, 1, 0], [110, 100, 0, 1], [150, 48].concat(d(ang[1]))];
    else g = [[40, 160].concat(d(ang[0])), [40, 160, 1, 0], [220, 160].concat(d(180 - ang[1]))];
    let s = '<g data-model="denah" data-s="' + SJ[cfg][0] + '" data-t="' + SJ[cfg][1] + '">';
    g.forEach((ln, i) => {
      const [a, b] = klip(ln[0], ln[1], ln[2], ln[3]);
      s += '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" stroke="' + warna[i] + '" stroke-width="6" stroke-linecap="round"/>';
    });
    nama.forEach((n, i) => { s += '<circle cx="' + (28 + i * 100) + '" cy="14" r="6" fill="' + warna[i] + '"/>' + '<text x="' + (40 + i * 100) + '" y="15" font-size="14" font-weight="800" dominant-baseline="central" fill="' + W.teks + '">' + n + '</text>'; });
    return svg(s + '</g>');
  }

  // ---------- Pembantu ----------
  function rakit(tpl, vals) {
    const segmen = []; let cerita0 = '';
    tpl.forEach((p) => {
      const m = /^\{(\w)\}$/.exec(p);
      if (m) { segmen.push(vals[m[1]]); cerita0 += 'sekian derajat'; } else { segmen.push(T(p)); cerita0 += p; }
    });
    return { segmen, cerita0 };
  }
  const derVals = (arr) => { const v = {}; arr.forEach((x, i) => { v['abcdef'[i]] = N(x); }); return v; };
  function sisipDis(segmen, tingkat, terlarang) {
    const dis = [];
    if (tingkat === 3) {
      kocok(DIS).slice(0, acak(1, 2)).forEach((d) => {
        let v; do { v = acak(d.lo, d.hi); } while (terlarang.has(v) || dis.includes(v));
        dis.push(v);
        const [x, y] = d.k.split('{x}'); segmen.push(T(x.replace(/^ /, '')), P(v), T(y + ' '));
      });
    }
    return dis;
  }
  // opsi 4 pilihan; pilihan tanpa sebab diberi sebab umum
  function opsiDari(kunci, grup, cad, o, umum) {
    const h = buatOpsi(kunci, grup, cad, o);
    h.opsi.forEach((v) => { if (v !== kunci && !h.sebab[v]) h.sebab[v] = umum; });
    return h;
  }
  const jenisLurus = { id: 'lurus', nama: 'Sudut di garis lurus', petunjuk: 'beberapa sudut <b>berjajar di satu garis lurus</b> (balok, jalan, tali). Garis lurus = 180°, yang ditanya sudut yang tersisa.',
    gambarPetunjuk: 'Untuk soal ini, gambar yang cocok memperlihatkan sudut-sudut yang berjajar di <b>satu garis lurus</b>, bukan garis yang patah dan bukan dua garis bersilang.' };
  const jenisSilang = { id: 'silang', nama: 'Perempatan / silang', petunjuk: '<b>dua garis lurus berpotongan</b>. Sudut yang berseberangan sama besar; sudut di sebelahnya 180° dikurangi sudut itu.',
    gambarPetunjuk: 'Untuk soal ini, gambar yang cocok adalah <b>dua garis lurus bersilang</b>, dengan tanda ? di sudut yang ditanya (seberang atau sebelah).' };
  const jenisSejajar = { id: 'sejajar', nama: 'Sejajar atau tegak lurus?', petunjuk: 'ada beberapa <b>jalan atau garis</b> dan ditanya <b>berapa pasang</b>: tidak pernah bertemu = sejajar; memotong tepat 90° = tegak lurus.',
    gambarPetunjuk: 'Untuk soal ini, gambar yang cocok adalah <b>denah garis</b> dengan jumlah pasangan sejajar dan tegak lurus yang sama seperti di cerita.' };

  // ---------- LURUS ----------
  function soalLurus(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      const ct = tingkat === 2 && Math.random() < 0.12 ? CONTOH[0] : null;
      const n = tingkat;
      const tp = ct ? TA.find((x) => x.id === ct.tp) : pilih(TA), nama = ct ? ct.nama : pilih(ORANG);
      let xs;
      if (ct) xs = ct.xs.slice();
      else do { xs = []; for (let i = 0; i < n; i++) xs.push(n === 1 ? acak(4, 32) * 5 : n === 2 ? acak(4, 16) * 5 : acak(5, 13) * 5); } while (xs.reduce((p, q) => p + q, 0) > 160 || (n === 1 && xs[0] === 90));
      const kd = 'ln-' + tp.id + '-' + nama + '-' + xs.join('.');
      if (pakai && pakai.has(kd)) continue;
      const sum = xs.reduce((p, q) => p + q, 0), r = 180 - sum;
      const tpl = [tp.intro(nama), 'Sudut pertama ', '{a}'];
      if (n === 2) tpl.push(' dan sudut kedua ', '{b}'); else if (n === 3) tpl.push(', sudut kedua ', '{b}', ', dan sudut ketiga ', '{c}');
      tpl.push('. Satu sudut lagi di garis lurus itu belum diukur. ');
      const { segmen, cerita0: c0 } = rakit(tpl, derVals(xs));
      const tanya = 'Berapa derajat sudut yang belum diukur?';
      const grup = [
        { s: 'Itu dihitung dari 360° (satu putaran penuh). Garis lurus hanya 180°.', v: [360 - sum] },
        { s: 'Itu dihitung dari 90° (siku-siku). Garis lurus sebesar 180°.', v: [90 - sum] },
        { s: 'Itu jumlah sudut yang sudah diketahui. Yang ditanya sudut sisanya: 180° dikurangi jumlah itu.', v: [sum] },
      ];
      if (n > 1) grup.push({ s: 'Itu hanya mengurangkan satu sudut dari 180°. Semua sudut yang sudah diketahui harus dikurangkan.', v: xs.map((k) => 180 - k) });
      const h = opsiDari(r, grup, [r + 10, r - 10, r + 5, r - 5, r + 20], { min: 5, maks: 360, n: 4 }, 'Belum tepat. Kurangkan semua sudut yang diketahui dari 180°.');
      const cek = 'Garis lurus = 180°. Sudut yang tersisa: 180° - ' + xs.join('° - ') + '° = <b>' + r + '°</b>.<br>Cek: ' + xs.join('° + ') + '° + ' + r + '° = 180°';
      const pil = [{ id: 'lurus-benar', ket: 'Sudut', svg: lurusSvg(xs.concat([r]), false) }, { id: 'lurus-patah', ket: 'Sudut', svg: lurusSvg(xs.concat([r]), true) }, { id: 'silang', ket: 'Garis bersilang', svg: silangSvg(pilih([40, 50, 60, 70, 110, 120]), 'seberang') }];
      const dis = sisipDis(segmen, tingkat, new Set(xs));
      segmen.push(Q(tanya));
      return {
        jenis: 'lurus', tingkat, kode: kd, tp: tp.id, nama, xs, r, dariContoh: !!ct,
        cerita0: c0 + tanya, kata: ['lurus'], segmen, angkaPenting: xs.slice(), angkaPengecoh: dis,
        arahAngka: 'besar sudut (derajat)', hintKurang: 'Masih ada sudut yang belum kuning. Ketuk semua sudut yang sudah diketahui (yang berderajat).',
        gambar: { benar: 'lurus-benar', pilihan: kocok(pil) }, tanya4: { teks: tanya, satuan: '°' },
        kunci: r, opsi: h.opsi, sebab: h.sebab, cek,
      };
    }
    throw new Error('soalLurus gagal');
  }

  // ---------- SILANG ----------
  const K3 = (p, q) => p * 1000 + q;
  const lab3 = (c) => Math.floor(c / 1000) + '°, ' + (c % 1000) + '°, ' + (c % 1000) + '°';
  const XS = []; for (let v = 25; v <= 155; v += 5) if (v !== 90) XS.push(v);
  function soalSilang(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      const mode = tingkat === 3 ? 'semua' : pilih(['seberang', 'sebelah']);
      const ct = tingkat === 3 && Math.random() < 0.12 ? pilih(CONTOH.filter((c) => c.jenis === 'silang')) : null;
      const tp = ct ? TX.find((x) => x.id === ct.tp) : pilih(TX), pasang = ct ? ct.pasang : pilih(PASANG), x = ct ? ct.x : pilih(XS);
      const kd = 'sl-' + mode + '-' + tp.id + '-' + (tp.id === 'perempatan' ? pasang.join('') : '') + '-' + x;
      if (pakai && pakai.has(kd)) continue;
      const y = 180 - x, g90 = Math.abs(90 - x);
      const { segmen, cerita0: c0 } = rakit(tp.mk(pasang), derVals([x]));
      const tanya = mode === 'seberang' ? 'Berapa derajat sudut yang berseberangan dengan sudut itu?' : mode === 'sebelah' ? 'Berapa derajat sudut di sebelah sudut itu?' : 'Berapa derajat ketiga sudut lainnya (seberang, sebelah, sebelah)?';
      let kunci, h, labelOpsi, cek;
      if (mode === 'seberang') {
        kunci = x;
        h = opsiDari(kunci, [{ s: 'Itu sudut di sebelahnya (180° dikurangi sudut itu). Sudut yang berseberangan sama besar.', v: [y] }, { s: 'Itu dihitung dari 90°. Dua garis lurus yang bersilang berpasangan sampai 180°, bukan 90°.', v: [g90] }, { s: 'Itu dihitung dari 360°. Pasangan sudut di satu garis lurus berjumlah 180°.', v: [360 - x] }], [x + 10, x - 10, y + 10], { min: 5, maks: 360, n: 4 }, 'Belum tepat. Sudut yang berseberangan sama besar.');
        cek = 'Dua garis lurus berpotongan: sudut yang berseberangan sama besar.<br>Seberang dari ' + x + '° adalah <b>' + x + '°</b>.<br>Cek: ' + x + '° + ' + y + '° + ' + x + '° + ' + y + '° = 360°';
      } else if (mode === 'sebelah') {
        kunci = y;
        h = opsiDari(kunci, [{ s: 'Itu besar sudut yang diketahui. Sudut di sebelahnya berjajar dengannya di satu garis lurus, jadi jumlahnya 180°.', v: [x] }, { s: 'Itu dihitung dari 90°. Garis lurus = 180°.', v: [g90] }, { s: 'Itu dihitung dari 360°. Dua sudut yang berjajar di garis lurus berjumlah 180°.', v: [360 - x] }], [y + 10, y - 10, x + 10], { min: 5, maks: 360, n: 4 }, 'Belum tepat. Sudut di sebelahnya = 180° dikurangi sudut itu.');
        cek = 'Sudut di sebelahnya berjajar dengan sudut itu di satu garis lurus: 180° - ' + x + '° = <b>' + y + '°</b>.<br>Cek: ' + x + '° + ' + y + '° = 180°';
      } else {
        kunci = K3(x, y);
        h = opsiDari(kunci, [
          { s: 'Terbalik. Sudut seberang sama besar dengan yang diketahui; sudut di sebelahnya 180° dikurangi sudut itu.', v: [K3(y, x)] },
          { s: 'Sudut di sebelah tidak sama besar. Sudut di sebelah berjajar di garis lurus: 180° dikurangi sudut yang diketahui.', v: [K3(x, x)] },
          { s: 'Sudut seberang bukan 180° dikurangi sudut itu. Yang berseberangan sama besar.', v: [K3(y, y)] },
          { s: 'Itu dihitung dari 90°. Pasangan sudut di garis lurus berjumlah 180°.', v: [K3(x, g90)] },
        ], [K3(x, 360 - x), K3(x, y + 10), K3(x, y - 10)], { min: 0, maks: 1000000, n: 4 }, 'Belum tepat. Seberang sama besar; sebelah = 180° dikurangi sudut itu.');
        labelOpsi = {}; h.opsi.forEach((o) => { labelOpsi[o] = lab3(o); });
        cek = 'Seberang sama besar: <b>' + x + '°</b>. Sebelah: 180° - ' + x + '° = <b>' + y + '°</b> (dua sudut).<br>Cek: ' + x + '° + ' + y + '° + ' + x + '° + ' + y + '° = 360°<br>Jawaban: <b>' + lab3(kunci) + '</b>';
      }
      if (mode !== 'semua') cek += '<br>Jawaban: <b>' + kunci + '°</b>';
      const sal = { seberang: 'sebelah', sebelah: 'seberang', semua: 'seberang' }[mode];
      const pil = [{ id: 'silang-benar', ket: 'Garis bersilang', svg: silangSvg(x, mode) }, { id: 'silang-salah', ket: 'Garis bersilang', svg: silangSvg(x, sal) }, { id: 'lurus', ket: 'Sudut', svg: lurusSvg([x, y], false) }];
      const dis = sisipDis(segmen, tingkat, new Set([x]));
      segmen.push(Q(tanya));
      return {
        jenis: 'silang', tingkat, kode: kd, mode, tp: tp.id, pasang, x, dariContoh: !!ct,
        cerita0: c0 + tanya, kata: ['berpotongan'], segmen, angkaPenting: [x], angkaPengecoh: dis,
        arahAngka: 'besar sudut (derajat)', hintKurang: 'Masih ada sudut yang belum kuning. Ketuk sudut yang sudah diketahui (yang berderajat).',
        gambar: { benar: 'silang-benar', pilihan: kocok(pil) }, tanya4: { teks: tanya, satuan: mode === 'semua' ? '' : '°' },
        kunci, opsi: h.opsi, labelOpsi, sebab: h.sebab, cek,
      };
    }
    throw new Error('soalSilang gagal');
  }

  // ---------- SEJAJAR ----------
  const KS = (s, t) => 100 + s * 10 + t;
  const labS = (c) => Math.floor((c - 100) / 10) + ' pasang sejajar, ' + ((c - 100) % 10) + ' pasang tegak lurus';
  const NAMA_REL = { sejajar: 'sejajar', tegak: 'tegak lurus', miring: 'hanya berpotongan' };
  function soalSejajar(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      const ct = Math.random() < 0.12 ? CONTOH.find((c) => c.jenis === 'sejajar') : null;
      const cfg = ct ? ct.cfg : pilih(['S', 'S', '2', '3', '4']);
      const kind = ct ? ct.kind : pilih(KIND), nm = ct ? ct.nama3 : pilih(NAMA3);
      const f = nm.map((n) => kind + ' ' + n);
      let tpl, ang, rel; // rel: hubungan pasangan 0-1, 0-2, 1-2
      if (cfg === 'S' || cfg === '2') {
        const th = cfg === 'S' ? 90 : pilih([30, 40, 45, 50, 60, 70, 80]); ang = [th, th];
        tpl = [f[0] + ' dan ' + f[1] + ' tidak pernah bertemu. ' + f[2] + ' memotong ' + f[0] + ' dengan sudut ', '{a}', ' dan memotong ' + f[1] + ' dengan sudut ', '{b}', '. '];
        rel = cfg === 'S' ? ['sejajar', 'tegak', 'tegak'] : ['sejajar', 'miring', 'miring'];
      } else if (cfg === '3') {
        const th = pilih([20, 30, 40, 50, 60, 70]); ang = [90, th, 90 - th];
        tpl = [f[0] + ' dan ' + f[1] + ' berpotongan dengan sudut ', '{a}', '. ' + f[2] + ' memotong ' + f[0] + ' dengan sudut ', '{b}', ' dan memotong ' + f[1] + ' dengan sudut ', '{c}', '. '];
        rel = ['tegak', 'miring', 'miring'];
      } else {
        ang = pilih(TRI).slice();
        tpl = [f[0] + ' dan ' + f[1] + ' berpotongan dengan sudut ', '{a}', '. ' + f[1] + ' dan ' + f[2] + ' berpotongan dengan sudut ', '{b}', '. ' + f[0] + ' dan ' + f[2] + ' berpotongan dengan sudut ', '{c}', '. '];
        rel = ['miring', 'miring', 'miring'];
      }
      const kd = 'sj-' + cfg + '-' + kind + '-' + nm.join('') + '-' + ang.join('.');
      if (pakai && pakai.has(kd)) continue;
      const [s, t] = SJ[cfg];
      const { segmen, cerita0: c0 } = rakit(tpl, derVals(ang));
      const tanya = 'Berapa pasang ' + kind.toLowerCase() + ' yang sejajar, dan berapa pasang yang tegak lurus?';
      const kunci = KS(s, t);
      const v2 = []; if (s + t + 1 <= 3) v2.push(KS(s, t + 1)); v2.push(KS(0, s + t));
      const v3 = []; if (t >= 1) v3.push(KS(s, t - 1)); if (s >= 1) v3.push(KS(s - 1, t));
      const h = opsiDari(kunci, [
        { s: 'Terbalik. Sejajar = tidak pernah bertemu; tegak lurus = berpotongan tepat 90°.', v: [KS(t, s)] },
        { s: 'Hanya yang berpotongan tepat 90° yang tegak lurus. Pasangan yang berpotongan dengan sudut lain hanya berpotongan, tidak dihitung.', v: v2 },
        { s: 'Ada pasangan yang terlewat. Periksa ketiga pasangan: pertama dan kedua, pertama dan ketiga, kedua dan ketiga.', v: v3 },
      ], [KS(1, 1), KS(0, 2), KS(2, 1), KS(0, 3), KS(1, 0), KS(0, 0), KS(1, 2)], { min: 100, maks: 133, n: 4 }, 'Belum tepat. Periksa ketiga pasangan satu per satu: tidak bertemu = sejajar, tepat 90° = tegak lurus.');
      const labelOpsi = {}; h.opsi.forEach((o) => { labelOpsi[o] = labS(o); });
      const pas = [[0, 1], [0, 2], [1, 2]].map((p, i) => nm[p[0]] + ' dan ' + nm[p[1]] + ': ' + NAMA_REL[rel[i]]);
      const cek = 'Ada 3 pasang. ' + pas.join('; ') + '.<br>Tidak pernah bertemu = sejajar, tepat 90° = tegak lurus.<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
      const cL = pilih(['S', '2', '3', '4'].filter((c) => c !== cfg));
      const angL = cL === 'S' ? [90, 90] : cL === '2' ? [pilih([40, 60]), 0] : cL === '3' ? [90, pilih([30, 40]), 0] : pilih(TRI).slice();
      const pil = [{ id: 'denah-benar', ket: 'Denah garis', svg: denahSvg(cfg, ang, nm) }, { id: 'denah-lain', ket: 'Denah garis', svg: denahSvg(cL, angL, nm) }, { id: 'lurus', ket: 'Sudut', svg: lurusSvg([pilih([40, 50, 60, 70]), pilih([30, 40, 50])], false) }];
      const dis = sisipDis(segmen, tingkat, new Set(ang));
      segmen.push(Q(tanya));
      return {
        jenis: 'sejajar', tingkat, kode: kd, cfg, kind, nama3: nm, ang, s, t, dariContoh: !!ct,
        cerita0: c0 + tanya, kata: ['pasang'], segmen, angkaPenting: ang.slice(), angkaPengecoh: dis,
        arahAngka: 'sudut pertemuan (derajat)', hintKurang: 'Masih ada sudut yang belum kuning. Ketuk semua sudut pertemuan yang berderajat.',
        gambar: { benar: 'denah-benar', pilihan: kocok(pil) }, tanya4: { teks: tanya, satuan: '' },
        kunci, opsi: h.opsi, labelOpsi, sebab: h.sebab, cek,
      };
    }
    throw new Error('soalSejajar gagal');
  }

  const data = {
    id: 'k4b9',
    jenis: [jenisLurus, jenisSilang, jenisSejajar],
    tingkat: ['sejajar atau tegak lurus (hitung pasangan) dan satu sudut di garis lurus', 'dua sudut diketahui di garis lurus, dan satu sudut di perempatan (seberang atau sebelah)', 'tiga sudut diketahui di garis lurus, ketiga sudut di perempatan sekaligus, dan angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Garis lurus = 180°: kurangkan semua sudut yang diketahui. Dua garis lurus bersilang: sudut berseberangan sama besar, sudut di sebelahnya 180° dikurangi sudut itu (empat sudut berjumlah 360°). Tidak pernah bertemu = sejajar; tepat 90° = tegak lurus.',
    jenisTingkat: (tingkat) => (tingkat === 1 ? ['sejajar', 'lurus'] : tingkat === 2 ? ['lurus', 'silang'] : ['silang', 'lurus']),
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'silang' ? soalSilang(tingkat, pakai) : jenisId === 'sejajar' ? soalSejajar(tingkat, pakai) : soalLurus(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    CONTOH, ORANG, PASANG, SJ,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b9 = data;
})(typeof window !== 'undefined' ? window : globalThis);
