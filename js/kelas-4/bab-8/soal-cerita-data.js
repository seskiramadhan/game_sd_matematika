// Data 📖 Soal Cerita Kelas 4 Bab 8 (Sudut) untuk mesin js/soal-cerita.js.
// Pesan inti: BERAPA DERAJAT, SUDUT APA? Derajat bilangan bulat. Lancip < 90°, siku-siku = 90°, tumpul 90°-180°, lurus = 180°.
//   sudut (Besar & jenis sudut): jenis  (T1) = derajat diketahui, sebut jenisnya (jawaban: Lancip / Siku-siku / Tumpul / Lurus);
//                                jumlah (T2-T3) = dua bukaan dijumlah, jawaban "derajat, jenis" (mis. "110°, tumpul");
//                                sisa   (T3) = 180° atau 90° dikurangi bagian yang diketahui;
//                                busur  (T3) = busur menunjuk dua angka (x dan 180 - x); "lebih sempit / lebih lebar dari pojok buku" memilih salah satunya.
//   putar (Arah putar): menghadap ke mana? ke kanan = searah jarum jam, ke kiri = berlawanan; arah utama U, T, S, B = indeks 0-3 (mod 4).
//                       T1: satu putaran (1/4 atau 1/2), jawaban arah akhir atau derajat putaran.
//                       T2: dua putaran searah, jawaban "arah akhir, total derajat" (mis. "Timur, 270°").
//                       T3: putaran kanan lalu kiri, jawaban arah akhir.
// Pengecoh: lupa menjumlah (ambil satu bukaan), jenis salah di batas (90° bukan lancip), mengurangi padahal menambah,
//           putar ke arah sebaliknya, 1/4 dikira 25°, berhenti di putaran pertama. Tingkat 3 + 1-2 angka pengecoh di Tandai.
// Gambar: sudut dengan bukaan berwarna + kotak pojok 90° pembanding; atau mawar arah dengan panah putaran. 3 pilihan, tepat satu cocok
//   (data-* di SVG dipakai skrip cek). Kunci: derajat bilangan bulat, arah = indeks 0-3 mod 4.
// Contoh tetap (video Ep. 11 / Buku Saku), muncul sekitar 12% di Tingkat 2: Pintu Kelas 70° + 40° = 110° tumpul; pintu lain 50° + 40° = 90° siku-siku;
//   Pak Tani menghadap Selatan, 1/2 putaran kanan lalu 1/4 putaran kanan: Timur, 180° + 90° = 270°.
// Tes: node tools/cek-soal-cerita-bab8.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok, buatOpsi } = M;

  const T = (t) => ({ k: 'teks', t });
  const N = (v) => ({ k: 'angka', t: v + '°', nilai: v, penting: true });
  const NB = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: true }); // angka skala busur (tanpa tanda derajat)
  const PECAH = { 90: '¼', 180: '½', 270: '¾' };
  const NF = (d) => ({ k: 'angka', t: PECAH[d], nilai: d, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false });
  const Q = (t) => ({ k: 'tanya', t });

  const JN = ['lancip', 'siku-siku', 'tumpul', 'lurus'];
  const jenisIdx = (d) => (d < 90 ? 0 : d === 90 ? 1 : d < 180 ? 2 : 3);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const AR = ['Utara', 'Timur', 'Selatan', 'Barat'];
  const mod4 = (n) => ((n % 4) + 4) % 4;
  const jelasJenis = (d) => d + '° ' + (d < 90 ? 'kurang dari 90°, jadi lancip.' : d === 90 ? 'tepat sama dengan pojok 90°, jadi siku-siku.' : d < 180 ? 'lebih dari 90° tetapi kurang dari 180°, jadi tumpul.' : 'membentuk garis lurus, jadi sudut lurus.');
  const kod = (d) => d * 10 + jenisIdx(d); // kode jawaban "derajat, jenis"
  const labKod = (c) => Math.floor(c / 10) + '°, ' + JN[c % 10];
  const ORANG = ['Ayu', 'Bima', 'Citra', 'Dimas', 'Rina', 'Tono'];

  // ---------- Templat cerita ----------
  const TJ = [ // dua bukaan dijumlah
    { id: 'pintu', nama: ['kelas', 'kamar', 'dapur', 'gudang'], tpl: (n) => ['Pintu ' + n + ' dibuka ', '{a}', '. Lalu pintu itu dibuka lagi ', '{b}', '. '], q: 'Berapa derajat bukaan pintu seluruhnya, dan sudut apa itu?' },
    { id: 'laptop', nama: ORANG, tpl: (n) => ['Layar laptop ' + n + ' dibuka ', '{a}', '. Lalu layar itu didorong lagi ', '{b}', '. '], q: 'Berapa derajat bukaan layar seluruhnya, dan sudut apa itu?' },
    { id: 'jendela', nama: ORANG, tpl: (n) => ['Jendela rumah ' + n + ' dibuka ', '{a}', '. Angin membuatnya terbuka lagi ', '{b}', '. '], q: 'Berapa derajat bukaan jendela seluruhnya, dan sudut apa itu?' },
    { id: 'gunting', nama: ORANG, tpl: (n) => ['Gunting milik ' + n + ' dibuka ', '{a}', '. Lalu dibuka lagi ', '{b}', '. '], q: 'Berapa derajat bukaan gunting seluruhnya, dan sudut apa itu?' },
  ];
  const TS = [ // sisa dari 180 atau 90
    { id: 'lipat', total: 180, tpl: () => ['Pintu lipat bisa terbuka sampai lurus, yaitu ', '{t}', '. Sekarang pintu itu sudah terbuka ', '{a}', '. '], q: 'Berapa derajat sisa bukaannya sampai lurus, dan sudut apa itu?' },
    { id: 'meja', total: 180, tpl: (n) => ['Daun meja lipat ' + n + ' bisa dibuka sampai datar, yaitu ', '{t}', '. Sekarang daun meja sudah terbuka ', '{a}', '. '], q: 'Berapa derajat sisa bukaannya sampai datar, dan sudut apa itu?' },
    { id: 'pojok', total: 90, tpl: () => ['Sebuah pojok ruangan berbentuk siku-siku, yaitu ', '{t}', '. Sebuah lemari menutupi ', '{a}', ' dari pojok itu. '], q: 'Berapa derajat sisa pojok yang belum tertutup, dan sudut apa itu?' },
  ];
  const TB = [ // busur
    { id: 'segitiga', benda: 'penggaris segitiga' }, { id: 'atap', benda: 'atap rumah mainan' }, { id: 'kue', benda: 'potongan kue' }, { id: 'foto', benda: 'bingkai foto' },
  ];
  const TT = [ // jenis (derajat diketahui)
    { id: 'pintu', nama: ['kelas', 'kamar', 'dapur', 'gudang'], tpl: (n) => ['Pintu ' + n + ' dibuka ', '{a}', '. '], q: 'Sudut apa yang terbentuk oleh bukaan pintu itu?' },
    { id: 'laptop', nama: ORANG, tpl: (n) => ['Layar laptop ' + n + ' terbuka ', '{a}', '. '], q: 'Sudut apa yang terbentuk oleh layar itu?' },
    { id: 'kipas', nama: ORANG, tpl: (n) => ['Kipas lipat milik ' + n + ' dibuka ', '{a}', '. '], q: 'Sudut apa yang terbentuk oleh kipas itu?' },
  ];
  const SUBJEK = ['Pak Tani', 'Bu Guru', 'Pak Polisi', 'Rina', 'Bima', 'Pak Satpam'];
  const BUKA = [(s, a) => s + ' menghadap ke ' + a + '. ', (s, a) => s + ' berdiri di lapangan dan menghadap ke ' + a + '. ', (s, a) => s + ' berdiri di tengah halaman, menghadap ke ' + a + '. '];
  const DIS = [{ k: ' Kejadian itu pada tanggal {x}.', lo: 11, hi: 28 }, { k: ' Ada {x} anak yang menonton.', lo: 11, hi: 45 }, { k: ' Semua itu berlangsung {x} menit.', lo: 11, hi: 45 }];
  const CONTOH = [
    { jenis: 'sudut', mode: 'jumlah', tp: 'pintu', nama: 'kelas', xs: [70, 40] },
    { jenis: 'sudut', mode: 'jumlah', tp: 'pintu', nama: 'kamar', xs: [50, 40] },
    { jenis: 'putar', mode: 'dua', subjek: 'Pak Tani', buka: 0, start: 2, langkah: [{ d: 180, kanan: true }, { d: 90, kanan: true }] },
  ];

  // ---------- Gambar (string SVG; atribut data-* dibaca skrip cek) ----------
  const W = { biru: '#3A86FF', oranye: '#FF8A3D', merah: '#FF6384', teks: '#1F2A44', hijau: '#2BB673' };
  const svg = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  const r1 = (x) => Math.round(x * 10) / 10;
  const rad = (d) => (d * Math.PI) / 180;
  const VX = 160, VY = 170, R = 118;
  const ptS = (deg, r) => [r1(VX + r * Math.cos(rad(deg))), r1(VY - r * Math.sin(rad(deg)))];
  function sektor(a0, a1, isi, garis, putus) {
    const p0 = ptS(a0, R), p1 = ptS(a1, R);
    return '<path d="M' + VX + ' ' + VY + ' L' + p0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 0 ' + p1.join(' ') + ' Z" fill="' + isi + '" fill-opacity="0.32" stroke="' + garis + '" stroke-width="4"' + (putus ? ' stroke-dasharray="9 7"' : '') + '/>';
  }
  const tekG = (x, y, t, w) => '<text x="' + x + '" y="' + y + '" font-size="20" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="' + (w || W.teks) + '" stroke="#FFFFFF" stroke-width="4" paint-order="stroke">' + t + '</text>';
  // susun: 'seq' (bukaan bersambung) | 'tumpuk' (semua mulai dari kaki yang sama) | 'sisa' (bagian pertama + sisa putus-putus sampai total)
  function sudutSvg(susun, bagian, total, o) {
    o = o || {};
    const lab = o.label !== false;
    let s = '<g data-model="sudut" data-susun="' + susun + '" data-bagian="' + bagian.join(',') + '" data-total="' + (total || '') + '">';
    const warna = [W.biru, W.oranye];
    let c = 0;
    if (susun === 'seq') bagian.forEach((b, i) => { s += sektor(c, c + b, warna[i], warna[i]); if (lab) s += tekG(...ptS(c + b / 2, R * 0.6), b + '°'); c += b; });
    else if (susun === 'tumpuk') bagian.forEach((b, i) => { s += sektor(0, b, warna[i], warna[i]); if (lab) s += tekG(...ptS(b / 2, R * (i ? 0.78 : 0.45)), b + '°'); });
    else { s += sektor(0, bagian[0], W.biru, W.biru); s += sektor(bagian[0], total, W.merah, W.merah, true); if (lab) { s += tekG(...ptS(bagian[0] / 2, R * 0.6), bagian[0] + '°'); s += tekG(...ptS((bagian[0] + total) / 2, R * 0.6), '?', W.merah); } }
    const ujung = susun === 'tumpuk' ? Math.max(...bagian) : susun === 'sisa' ? total : bagian.reduce((p, q) => p + q, 0);
    s += '<line x1="' + VX + '" y1="' + VY + '" x2="' + ptS(0, R + 6)[0] + '" y2="' + VY + '" stroke="' + W.teks + '" stroke-width="5" stroke-linecap="round"/>';
    if (ujung >= 180) s += '<line x1="' + VX + '" y1="' + VY + '" x2="' + (VX - R - 6) + '" y2="' + VY + '" stroke="' + W.teks + '" stroke-width="5" stroke-linecap="round"/>';
    const e = ptS(ujung, R + 6);
    if (ujung < 180) s += '<line x1="' + VX + '" y1="' + VY + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="' + W.teks + '" stroke-width="5" stroke-linecap="round"/>';
    // kotak pojok 90 derajat pembanding
    s += '<path d="M' + (VX + 30) + ' ' + VY + ' V' + (VY - 30) + ' H' + VX + '" fill="none" stroke="' + W.oranye + '" stroke-width="3" stroke-dasharray="5 4"/>';
    s += '<circle cx="' + VX + '" cy="' + VY + '" r="6" fill="' + W.teks + '"/>';
    s += '<path d="M14 14 h16 v16" fill="none" stroke="' + W.oranye + '" stroke-width="3" stroke-dasharray="5 4"/><text x="38" y="26" font-size="14" font-weight="700" fill="' + W.teks + '">pojok 90°</text>';
    return svg(s + '</g>');
  }
  const SUDUT_LAIN = (a) => (a === 90 ? 45 : a === 180 ? 90 : 180 - a);

  // mawar arah: U atas, T kanan, S bawah, B kiri. Bearing searah jarum jam dari atas.
  const CX = 160, CY = 98, RR = 58;
  const ptM = (b, r) => [r1(CX + r * Math.sin(rad(b))), r1(CY - r * Math.cos(rad(b)))];
  function mawarSvg(start, langkah) {
    let s = '<g data-model="mawar" data-start="' + AR[start] + '" data-langkah="' + langkah.map((l) => (l.kanan ? 'R' : 'L') + l.d).join(',') + '">';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + RR + '" fill="#FFFFFF" stroke="' + W.teks + '" stroke-width="3"/>';
    ['U', 'T', 'S', 'B'].forEach((h, i) => { const p = ptM(i * 90, RR + 20); s += '<line x1="' + ptM(i * 90, RR - 8)[0] + '" y1="' + ptM(i * 90, RR - 8)[1] + '" x2="' + ptM(i * 90, RR)[0] + '" y2="' + ptM(i * 90, RR)[1] + '" stroke="' + W.teks + '" stroke-width="3"/>' + tekG(p[0], p[1], h); });
    let b = start * 90;
    langkah.forEach((l, i) => {
      const r = 26 + i * 13, e = b + (l.kanan ? l.d : -l.d), p0 = ptM(b, r), p1 = ptM(e, r), w = i ? W.biru : W.oranye;
      s += '<path d="M' + p0.join(' ') + ' A' + r + ' ' + r + ' 0 ' + (l.d > 180 ? 1 : 0) + ' ' + (l.kanan ? 1 : 0) + ' ' + p1.join(' ') + '" fill="none" stroke="' + w + '" stroke-width="5" stroke-linecap="round"/>';
      const tb = e + (l.kanan ? 90 : -90), dx = Math.sin(rad(tb)), dy = -Math.cos(rad(tb)), px = -dy, py = dx;
      const tip = [r1(p1[0] + 8 * dx), r1(p1[1] + 8 * dy)], b1 = [r1(p1[0] - 3 * dx + 7 * px), r1(p1[1] - 3 * dy + 7 * py)], b2 = [r1(p1[0] - 3 * dx - 7 * px), r1(p1[1] - 3 * dy - 7 * py)];
      s += '<polygon points="' + tip.join(',') + ' ' + b1.join(',') + ' ' + b2.join(',') + '" fill="' + w + '"/>';
      b = e;
    });
    const m = ptM(start * 90, RR);
    s += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="8" fill="' + W.hijau + '" stroke="' + W.teks + '" stroke-width="2"/>';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="4" fill="' + W.teks + '"/>';
    s += '<circle cx="18" cy="18" r="7" fill="' + W.hijau + '" stroke="' + W.teks + '" stroke-width="2"/><text x="30" y="19" font-size="14" font-weight="700" dominant-baseline="central" fill="' + W.teks + '">mulai</text>';
    return svg(s + '</g>');
  }

  // ---------- Pembantu ----------
  function rakit(tpl, vals) { // tpl: ['teks', '{a}', ...]; vals: { a: {tok, kosong} }
    const segmen = []; let cerita0 = '';
    tpl.forEach((p) => {
      const m = /^\{(\w)\}$/.exec(p);
      if (m) { segmen.push(vals[m[1]].tok); cerita0 += vals[m[1]].kosong; } else { segmen.push(T(p)); cerita0 += p; }
    });
    return { segmen, cerita0 };
  }
  const derKosong = (v) => ({ tok: N(v), kosong: 'sekian derajat' });
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
  function hasilOpsi(kunci, grup, cadangan, labFn) {
    const h = buatOpsi(kunci, grup, cadangan, { min: 0, maks: 99999, n: 4 });
    h.opsi.forEach((o) => { if (o !== kunci && !h.sebab[o]) h.sebab[o] = 'Belum tepat. Hitung dulu besarnya, lalu bandingkan dengan 90° untuk menentukan jenisnya.'; });
    const labelOpsi = {}; h.opsi.forEach((o) => { labelOpsi[o] = labFn(o); });
    return { opsi: h.opsi, sebab: h.sebab, labelOpsi };
  }
  const jenisBesar = { id: 'sudut', nama: 'Besar & jenis sudut', petunjuk: 'yang ditanya <b>berapa derajat</b> dan <b>sudut apa</b> (lancip, siku-siku, tumpul, lurus). Bukaan digabung, dikurangi, atau dibaca dari busur.',
    gambarPetunjuk: 'Untuk soal sudut, gambar yang cocok memperlihatkan <b>bukaan sudut</b> dengan besar yang pas (bandingkan dengan kotak pojok 90°), bukan arah mata angin.' };
  const jenisPutar = { id: 'putar', nama: 'Arah putar', petunjuk: 'ada orang yang <b>memutar badan</b> dan ditanya <b>menghadap ke mana</b> atau berapa derajat putarannya. Kanan = searah jarum jam.',
    gambarPetunjuk: 'Untuk soal memutar badan, gambar yang cocok adalah <b>mawar arah</b> dengan panah putaran yang <b>searah</b> dengan ceritanya (kanan = searah jarum jam).' };

  // ---------- SUDUT ----------
  function soalSudut(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      let mode, a, b, tot, s, nama, tp, ct = null;
      if (tingkat === 2 && Math.random() < 0.12) ct = pilih(CONTOH.filter((x) => x.jenis === 'sudut'));
      if (ct) { mode = 'jumlah'; tp = TJ.find((x) => x.id === ct.tp); nama = ct.nama; [a, b] = ct.xs; }
      else if (tingkat === 1) { mode = 'jenis'; tp = pilih(TT); nama = pilih(tp.nama); const r = Math.random(); a = r < 0.16 ? 90 : r < 0.3 ? 180 : pilih([20, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150, 160, 170]); }
      else {
        mode = tingkat === 2 ? 'jumlah' : pilih(['sisa', 'sisa', 'busur', 'busur', 'jumlah']);
        if (mode === 'jumlah') {
          tp = pilih(TJ); nama = pilih(tp.nama);
          const r = Math.random();
          if (r < 0.22) { a = acak(2, 16) * 5; b = 90 - a; } else if (r < 0.32) { a = acak(4, 32) * 5; b = 180 - a; } else { do { a = acak(2, 30) * 5; b = acak(2, 30) * 5; } while (a + b > 180 || a + b < 30); }
        } else if (mode === 'sisa') {
          tp = pilih(TS); nama = pilih(ORANG); tot = tp.total;
          a = tot === 90 ? acak(2, 16) * 5 : acak(4, 34) * 5;
        } else { tp = pilih(TB); nama = pilih(ORANG); s = Math.random() < 0.5 ? acak(4, 16) * 5 : acak(20, 32) * 5; }
      }
      const kd = 'sd-' + mode + '-' + tp.id + '-' + nama + '-' + [a, b, tot, s].join('.');
      if (pakai && pakai.has(kd)) continue;
      let kunci, opsi, labelOpsi, sebab = {}, segmen, cerita0, tanya, kata, cek, gambar, penting;
      if (mode === 'jenis') {
        const idx = jenisIdx(a);
        ({ segmen, cerita0 } = rakit(tp.tpl(nama), { a: derKosong(a) })); tanya = tp.q; kata = 'Sudut apa'; penting = [a];
        cerita0 += tanya; kunci = idx + 1; opsi = [1, 2, 3, 4]; labelOpsi = { 1: 'Lancip', 2: 'Siku-siku', 3: 'Tumpul', 4: 'Lurus' };
        [0, 1, 2, 3].filter((j) => j !== idx).forEach((j) => {
          sebab[j + 1] = 'Bukan ' + JN[j] + '. ' + jelasJenis(a) + (a === 90 ? ' Ingat: 90° bukan lancip dan bukan tumpul.' : '');
        });
        cek = 'Bandingkan dengan pojok 90° (kotak jeruk).<br>' + jelasJenis(a) + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
        gambar = { benar: 'sudut-benar', pilihan: kocok([{ id: 'sudut-benar', ket: 'Sudut', svg: sudutSvg('seq', [a], 0) }, { id: 'sudut-lain', ket: 'Sudut', svg: sudutSvg('seq', [SUDUT_LAIN(a)], 0) }, { id: 'mawar', ket: 'Mawar arah', svg: mawarSvg(acak(0, 3), [{ d: pilih([90, 180]), kanan: Math.random() < 0.5 }]) }]) };
      } else if (mode === 'jumlah') {
        const total = a + b, tt = total;
        ({ segmen, cerita0 } = rakit(tp.tpl(nama), { a: derKosong(a), b: derKosong(b) })); tanya = tp.q; kata = 'lagi'; penting = [a, b];
        cerita0 += tanya; kunci = kod(tt);
        const jn = [0, 1, 2, 3].filter((j) => j !== jenisIdx(tt)).map((j) => tt * 10 + j);
        const grup = [
          { s: 'Itu baru satu bukaan. Kedua bukaan <b>digabung</b>: ditambah.', v: [kod(a), kod(b)] },
          { s: tt === 90 ? 'Besarnya benar, tetapi 90° bukan lancip dan bukan tumpul: tepat siku-siku.' : 'Besarnya benar, tetapi jenisnya keliru. ' + jelasJenis(tt), v: jn },
          { s: 'Itu hasil mengurangi. Dua bukaan yang digabung dijumlah, bukan dikurangi.', v: a === b ? [] : [kod(Math.abs(a - b))] },
        ];
        const cad = []; [10, -10, 5, -5, 20].forEach((d) => { if (tt + d >= 5 && tt + d <= 180) cad.push(kod(tt + d)); });
        ({ opsi, sebab, labelOpsi } = hasilOpsi(kunci, grup, cad, labKod));
        cek = 'Dua bukaan digabung, jadi dijumlah: <b>' + a + '° + ' + b + '° = ' + tt + '°</b>.<br>' + jelasJenis(tt) + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
        const pil = [{ id: 'sudut-benar', ket: 'Sudut', svg: sudutSvg('seq', [a, b], 0) }, { id: 'sudut-tumpuk', ket: 'Sudut', svg: sudutSvg('tumpuk', [a, b], 0) }, { id: 'mawar', ket: 'Mawar arah', svg: mawarSvg(acak(0, 3), [{ d: pilih([90, 180]), kanan: Math.random() < 0.5 }]) }];
        gambar = { benar: 'sudut-benar', pilihan: kocok(pil) };
      } else if (mode === 'sisa') {
        const r = tot - a;
        ({ segmen, cerita0 } = rakit(tp.tpl(nama), { t: derKosong(tot), a: derKosong(a) })); tanya = tp.q; kata = 'sisa'; penting = [tot, a];
        cerita0 += tanya; kunci = kod(r);
        const lain = tot === 90 ? 180 : 90;
        const jn = [0, 1, 2, 3].filter((j) => j !== jenisIdx(r)).map((j) => r * 10 + j);
        const grup = [
          { s: 'Itu bagian yang sudah diketahui (' + a + '°). Yang ditanya <b>sisanya</b>: ' + tot + '° dikurangi ' + a + '°.', v: [kod(a)] },
          { s: r === 90 ? 'Besarnya benar, tetapi 90° bukan lancip dan bukan tumpul: tepat siku-siku.' : 'Besarnya benar, tetapi jenisnya keliru. ' + jelasJenis(r), v: jn },
          { s: 'Itu dikurangi dari ' + lain + '°. Totalnya di soal ini ' + tot + '°.', v: lain - a >= 5 ? [kod(lain - a)] : [] },
        ];
        const cad = []; [10, -10, 5, -5].forEach((d) => { if (r + d >= 5 && r + d <= 180) cad.push(kod(r + d)); });
        ({ opsi, sebab, labelOpsi } = hasilOpsi(kunci, grup, cad, labKod));
        cek = 'Sisa = total dikurangi bagian yang diketahui: <b>' + tot + '° - ' + a + '° = ' + r + '°</b>.<br>' + jelasJenis(r) + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
        gambar = { benar: 'sisa-benar', pilihan: kocok([{ id: 'sisa-benar', ket: 'Sudut', svg: sudutSvg('sisa', [a], tot) }, { id: 'sisa-lain', ket: 'Sudut', svg: sudutSvg('sisa', [a], lain) }, { id: 'mawar', ket: 'Mawar arah', svg: mawarSvg(acak(0, 3), [{ d: pilih([90, 180]), kanan: Math.random() < 0.5 }]) }]) };
      } else { // busur
        const o = 180 - s, sempit = s < 90, kecil = Math.min(s, o), besar = Math.max(s, o);
        const urut = Math.random() < 0.5 ? [kecil, besar] : [besar, kecil];
        const tpl = [nama + ' mengukur sudut pada ' + tp.benda + ' dengan busur derajat. Kaki kedua menunjuk dua angka, yaitu ', '{x}', ' dan ', '{y}', '. Sudut itu ' + (sempit ? 'lebih sempit' : 'lebih lebar') + ' daripada pojok buku (siku-siku). '];
        ({ segmen, cerita0 } = rakit(tpl, { x: { tok: NB(urut[0]), kosong: 'sekian' }, y: { tok: NB(urut[1]), kosong: 'sekian' } })); tanya = 'Berapa derajat besar sudutnya, dan sudut apa itu?'; kata = 'busur'; penting = urut;
        cerita0 += tanya; kunci = kod(s);
        const jn = [0, 1, 2, 3].filter((j) => j !== jenisIdx(s)).map((j) => s * 10 + j);
        const grup = [
          { s: 'Itu angka dari skala yang satunya. Tebak dulu: sudutnya ' + (sempit ? 'lebih sempit dari pojok buku, jadi kurang dari 90°' : 'lebih lebar dari pojok buku, jadi lebih dari 90°') + '.', v: [kod(o)] },
          { s: 'Besarnya benar, tetapi jenisnya keliru. ' + jelasJenis(s), v: jn },
        ];
        const cad = []; [10, -10, 5, -5].forEach((d) => { if (s + d >= 5 && s + d < 90 === sempit && s + d !== 90) cad.push(kod(s + d)); });
        ({ opsi, sebab, labelOpsi } = hasilOpsi(kunci, grup, cad.concat([kod(s + 20), kod(s - 20)].filter((c) => Math.floor(c / 10) >= 5 && Math.floor(c / 10) <= 175)), labKod));
        cek = 'Tebak dulu: sudutnya ' + (sempit ? 'lebih sempit dari pojok buku (kurang dari 90°), jadi lancip' : 'lebih lebar dari pojok buku (lebih dari 90°), jadi tumpul') + '. Dua angka itu ' + kecil + ' dan ' + besar + ' (jumlahnya 180). Pilih yang ' + (sempit ? 'kurang dari 90' : 'lebih dari 90') + ': <b>' + s + '°</b>.<br>' + jelasJenis(s) + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
        gambar = { benar: 'sudut-benar', pilihan: kocok([{ id: 'sudut-benar', ket: 'Sudut', svg: sudutSvg('seq', [s], 0, { label: false }) }, { id: 'sudut-lain', ket: 'Sudut', svg: sudutSvg('seq', [o], 0, { label: false }) }, { id: 'mawar', ket: 'Mawar arah', svg: mawarSvg(acak(0, 3), [{ d: pilih([90, 180]), kanan: Math.random() < 0.5 }]) }]) };
      }
      const dis = sisipDis(segmen, tingkat, new Set(penting));
      segmen.push(Q(tanya));
      return {
        jenis: 'sudut', tingkat, kode: kd, mode, tp: tp.id, nama, a, b, tot, s,
        cerita0, kata: [kata], segmen, angkaPenting: penting.slice(), angkaPengecoh: dis,
        arahAngka: 'angka penting', hintKurang: 'Masih ada angka penting yang belum kuning. Ketuk semua angka yang dipakai untuk menghitung.',
        gambar, tanya4: { teks: tanya, satuan: '' },
        kunci, opsi, labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalSudut gagal');
  }

  // ---------- PUTAR ----------
  const lanjut = (i, l) => mod4(i + (l.kanan ? 1 : -1) * (l.d / 90));
  const teksStep = (l) => PECAH[l.d] + ' putaran ' + (l.kanan ? 'kanan' : 'kiri') + ' (' + l.d + '°)';
  function soalPutar(tingkat, pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      let ct = null, subjek, buka, start, langkah, mode;
      if (tingkat === 2 && Math.random() < 0.12) ct = pilih(CONTOH.filter((x) => x.jenis === 'putar'));
      if (ct) { subjek = ct.subjek; buka = ct.buka; start = ct.start; langkah = ct.langkah.map((l) => Object.assign({}, l)); mode = ct.mode; }
      else {
        subjek = pilih(SUBJEK); buka = acak(0, 2); start = acak(0, 3);
        if (tingkat === 1) { langkah = [{ d: pilih([90, 180]), kanan: Math.random() < 0.7 }]; mode = Math.random() < 0.5 ? 'arah' : 'derajat'; }
        else if (tingkat === 2) { const k = Math.random() < 0.7; langkah = pilih([[90, 90], [90, 180], [180, 90], [180, 90]]).map((d) => ({ d, kanan: k })); mode = 'dua'; }
        else { let d1, d2; do { d1 = pilih([90, 180, 270]); d2 = pilih([90, 180, 270]); } while (d1 === d2); const k = Math.random() < 0.5; langkah = [{ d: d1, kanan: k }, { d: d2, kanan: !k }]; mode = 'arah'; }
      }
      const kd = 'pt-' + mode + '-' + subjek + '-' + buka + '-' + start + '-' + langkah.map((l) => (l.kanan ? 'R' : 'L') + l.d).join('');
      if (pakai && pakai.has(kd)) continue;
      const jalan = [start]; langkah.forEach((l) => jalan.push(lanjut(jalan[jalan.length - 1], l)));
      const akhir = jalan[jalan.length - 1], total = langkah.reduce((p, l) => p + l.d, 0);
      const balik = langkah.map((l) => Object.assign({}, l, { kanan: !l.kanan }));
      const tabel = [start]; balik.forEach((l) => tabel.push(lanjut(tabel[tabel.length - 1], l))); const arahBalik = tabel[tabel.length - 1];
      const sama = langkah.map((l) => Object.assign({}, l, { kanan: true })); const js = [start]; sama.forEach((l) => js.push(lanjut(js[js.length - 1], l))); const arahSemuaKanan = js[js.length - 1];
      const setelah1 = jalan[1];
      // teks cerita
      const tpl = [BUKA[buka](subjek, AR[start]) + (langkah.length === 1 ? 'Ia memutar badan ' : 'Ia memutar badan ')];
      const vals = {}; const kata = ['putaran'];
      langkah.forEach((l, i) => {
        const key = 'abc'[i]; vals[key] = { tok: NF(l.d), kosong: 'sekian' };
        tpl.push('{' + key + '}');
        tpl.push(' putaran ke ' + (l.kanan ? 'kanan (searah jarum jam). ' : 'kiri (berlawanan jarum jam). ') + (i < langkah.length - 1 ? 'Lalu ia memutar badan ' + (langkah[i + 1].kanan === l.kanan ? 'lagi ' : '') : ''));
      });
      const { segmen, cerita0: c0 } = rakit(tpl, vals);
      let tanya, kunci, opsi, labelOpsi = {}, sebab = {}, cek;
      const garis = langkah.map((l, i) => 'Putaran ke-' + (i + 1) + ': dari ' + AR[jalan[i]] + ', ' + teksStep(l) + ', menghadap ' + AR[jalan[i + 1]] + '.').join('<br>');
      const sebabArah = (w) => (langkah.length > 1 && w === setelah1 && w !== akhir ? 'Itu arah setelah putaran pertama saja. Masih ada putaran berikutnya.'
        : w === arahBalik ? 'Itu kalau putarannya ke arah sebaliknya. Kanan = searah jarum jam, kiri = berlawanan jarum jam.'
        : langkah.length > 1 && !langkah.every((l) => l.kanan === langkah[0].kanan) && w === arahSemuaKanan ? 'Itu kalau kedua putaran ke kanan. Putaran ke kiri membuat arahnya mundur.'
        : 'Belum tepat. Putar langkah demi langkah dari ' + AR[start] + ': tiap ¼ putaran (90°) pindah ke mata angin berikutnya.');
      if (mode === 'arah') {
        tanya = 'Sekarang ia menghadap ke arah mana?'; kunci = akhir + 1; opsi = [1, 2, 3, 4]; AR.forEach((n, i) => { labelOpsi[i + 1] = n; });
        [0, 1, 2, 3].filter((w) => w !== akhir).forEach((w) => { sebab[w + 1] = sebabArah(w); });
        cek = 'Kanan = searah jarum jam: Utara, Timur, Selatan, Barat. Kiri = kebalikannya.<br>' + garis + '<br>Jawaban: <b>' + AR[akhir] + '</b>';
      } else if (mode === 'derajat') {
        const d = langkah[0].d; kunci = d;
        const grup = [
          { s: PECAH[d] + ' putaran bukan ' + d / 90 * 25 + '°. Satu putaran penuh 360°, jadi ' + PECAH[d] + ' putaran = ' + d + '°.', v: [d / 90 * 25] },
          { s: 'Itu putaran yang lain. ¼ putaran = 90°, ½ putaran = 180°.', v: [d === 90 ? 180 : 90] },
          { s: 'Itu satu putaran penuh atau lebih. Yang diputar hanya ' + PECAH[d] + ' putaran.', v: [360, 270] },
        ];
        ({ opsi, sebab, labelOpsi } = hasilOpsi(kunci, grup, [45, 135, 60, 120], (o) => o + '°'));
        tanya = 'Berapa derajat putarannya?';
        cek = '1 putaran penuh = 360°. ' + PECAH[d] + ' putaran = ' + d + '° (360° ' + (d === 90 ? 'dibagi 4' : 'dibagi 2') + ').<br>' + garis + '<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
      } else { // dua: arah akhir + total derajat
        const kodeA = (i, t) => i * 1000 + t, labA = (c) => AR[Math.floor(c / 1000)] + ', ' + (c % 1000) + '°';
        kunci = kodeA(akhir, total);
        const d1 = langkah[0].d, d2 = langkah[1].d;
        const grup = [
          { s: 'Itu arah setelah putaran pertama saja. Masih ada putaran berikutnya, jadi totalnya dijumlah.', v: [kodeA(setelah1, d1)] },
          { s: 'Itu kalau putarannya ke arah sebaliknya. Kanan = searah jarum jam, kiri = berlawanan.', v: [kodeA(arahBalik, total)] },
          { s: 'Arahnya benar, tetapi totalnya salah. Total putaran = jumlah semua putaran: ' + d1 + '° + ' + d2 + '°.', v: [kodeA(akhir, d1), kodeA(akhir, d2), kodeA(akhir, Math.abs(d1 - d2))] },
        ];
        const cad = []; for (let i = 0; i < 4; i++) [d1, d2, total, Math.abs(d1 - d2)].forEach((t) => cad.push(kodeA(i, t)));
        ({ opsi, sebab, labelOpsi } = hasilOpsi(kunci, grup, cad, labA));
        opsi.forEach((o) => { if (o !== kunci && sebab[o] && /^Belum tepat\./.test(sebab[o])) sebab[o] = 'Belum tepat. Putar satu per satu dari ' + AR[start] + ', lalu jumlahkan derajat semua putaran.'; });
        tanya = 'Sekarang ia menghadap ke arah mana, dan berapa derajat seluruh putarannya?';
        cek = 'Kanan = searah jarum jam: Utara, Timur, Selatan, Barat.<br>' + garis + '<br>Total putaran: <b>' + langkah.map((l) => l.d + '°').join(' + ') + ' = ' + total + '°</b>.<br>Jawaban: <b>' + labelOpsi[kunci] + '</b>';
      }
      const cerita0 = c0 + tanya;
      const pil = [{ id: 'mawar-benar', ket: 'Mawar arah', svg: mawarSvg(start, langkah) }, { id: 'mawar-balik', ket: 'Mawar arah', svg: mawarSvg(start, balik) }];
      if (Math.random() < 0.5) pil.push({ id: 'sudut', ket: 'Sudut', svg: sudutSvg('seq', [pilih([30, 40, 50, 60, 70]), pilih([30, 40, 50, 60])], 0) });
      else { const ubah = langkah.map((l) => Object.assign({}, l, { d: l.d === 90 ? 180 : 90 })); pil.push({ id: 'mawar-jumlah', ket: 'Mawar arah', svg: mawarSvg(start, ubah) }); }
      const penting = langkah.map((l) => l.d);
      const dis = sisipDis(segmen, tingkat, new Set(penting));
      segmen.push(Q(tanya));
      return {
        jenis: 'putar', tingkat, kode: kd, mode, subjek, start, langkah, akhir, total,
        cerita0, kata, segmen, angkaPenting: penting, angkaPengecoh: dis,
        arahAngka: 'putaran (pecahan) penting', hintKurang: 'Masih ada putaran yang belum kuning. Ketuk semua pecahan putaran (¼, ½, ¾) di cerita.',
        gambar: { benar: 'mawar-benar', pilihan: kocok(pil) }, tanya4: { teks: tanya, satuan: '' },
        kunci, opsi, labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalPutar gagal');
  }

  const data = {
    id: 'k4b8',
    jenis: [jenisBesar, jenisPutar],
    tingkat: ['jenis sudut dari derajat, satu putaran ¼ atau ½', 'dua bukaan dijumlah, dua putaran searah (arah akhir dan total derajat)', 'sisa dari 180° atau 90°, membaca busur, putaran kanan lalu kiri, dan angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Berapa derajat, sudut apa? Hitung derajatnya dulu, lalu bandingkan dengan pojok 90°: kurang = lancip, sama = siku-siku, lebih = tumpul, 180° = lurus. Kanan = searah jarum jam; ¼ putaran = 90°.',
    jenisTingkat: () => ['sudut', 'putar'],
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'putar' ? soalPutar(tingkat, pakai) : soalSudut(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    CONTOH, JN, AR, ORANG,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b8 = data;
})(typeof window !== 'undefined' ? window : globalThis);
