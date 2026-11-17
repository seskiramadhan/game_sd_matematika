// Mesin bersama 📖 Soal Cerita (semua bab). Objek global: GameSoalCerita.
// Tiap soal dipandu 4 langkah: 1 Baca (cerita tanpa angka, "ini soal apa?") · 2 Tandai (ketuk angka penting + kalimat tanya)
// · 3 Gambar (pilih gambar yang cocok) · 4 Hitung dan Cek (pilihan ganda, lalu layar cek).
// Penilaian bintang: soal dihitung BENAR bila langkah 4 benar pada percobaan pertama. Salah di langkah 1-3 hanya memunculkan
// petunjuk lalu anak mencoba lagi (tidak mengurangi bintang). Soal yang salah diulang di akhir ronde oleh mesin ronde (js/engine.js).
//
// Memakai di bab lain: buat file data js/kelas-<k>/bab-<n>/soal-cerita-data.js yang mengisi
//   window.SoalCeritaData['k<k>b<n>'] = { jenis, tingkat, ingat, buatSoal }  (lihat js/kelas-4/bab-3/soal-cerita-data.js)
// lalu di bab.js:  game: () => GameSoalCerita.untuk(window.SoalCeritaData.k4b3)
// Bentuk data:
//   jenis: [{ id, nama, petunjuk, gambar }]   gambar = id gambar yang cocok ('garis' | 'bagi' | 'batang' | id buatan sendiri)
//   buatSoal(tingkat, jenisId, pakai:Set) -> soal (lihat tools/cek-soal-cerita.js untuk bentuk & pemeriksaan):
//     { jenis, kode, cerita0 (tanpa digit), kata:[frasa kunci di cerita0], segmen:[{k:'teks'|'angka'|'tanya', t, penting?}],
//       gambar:{ benar:id, pilihan:[{ id, ket, svg }] }, tanya4:{ teks, satuan }, kunci, opsi:[4 angka], sebab:{angka:'teks'}, cek:'html' }
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;

  // ---------- Logika (tanpa DOM) ----------
  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const faktor = (n) => { const f = []; for (let d = 1; d <= n; d++) if (n % d === 0) f.push(d); return f; };
  const fpb = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
  const kpk = (a, b) => (a / fpb(a, b)) * b;
  const kelipatan = (n, sampai) => { const k = []; for (let m = n; m <= sampai; m += n) k.push(m); return k; };
  // daftar "1, 2, 3, ..." dipendekkan bila terlalu panjang
  const daftar = (arr, maks) => (arr.length > (maks || 10) ? arr.slice(0, maks || 10).join(', ') + ', ...' : arr.join(', '));

  // Susun 4 pilihan: kunci + 3 pengecoh. grup = [{ s:'sebab salah', v:[nilai...] }], cadangan = pengisi tanpa sebab.
  // Hasil: { opsi:[4 angka diacak], sebab:{ nilai:'teks' } }
  function buatOpsi(kunci, grup, cadangan, o) {
    o = o || {};
    const maks = o.maks == null ? 200 : o.maks, min = o.min == null ? 1 : o.min, n = o.n || 4;
    const ok = (v) => Number.isInteger(v) && v >= min && v <= maks && v !== kunci;
    const pakai = new Map();
    const g = grup.map((x) => ({ s: x.s, v: kocok(Array.from(new Set(x.v)).filter(ok)) })).filter((x) => x.v.length);
    for (const x of kocok(g)) { if (pakai.size >= n - 1) break; const v = x.v.find((y) => !pakai.has(y)); if (v !== undefined) pakai.set(v, x.s); }
    for (const x of g) for (const v of x.v) if (pakai.size < n - 1 && !pakai.has(v)) pakai.set(v, x.s);
    for (const v of kocok(cadangan || [])) if (pakai.size < n - 1 && ok(v) && !pakai.has(v)) pakai.set(v, '');
    if (pakai.size < n - 1) throw new Error('pengecoh kurang untuk ' + kunci);
    const sebab = {}; pakai.forEach((s, v) => { if (s) sebab[v] = s; });
    return { opsi: kocok([kunci].concat(Array.from(pakai.keys()))), sebab };
  }

  // Campuran jenis dalam satu ronde: 3 soal satu jenis + 2 soal jenis lain (urutan diacak), untuk 2 jenis; umum untuk n jenis.
  function urutanJenis(ids, jumlah) {
    const hasil = [];
    const awal = kocok(ids);
    awal.forEach((id) => hasil.push(id));
    while (hasil.length < jumlah) hasil.push(pilih(ids));
    return kocok(hasil).slice(0, jumlah);
  }

  // ---------- Gambar skema (SVG; tanpa angka jawaban) ----------
  const WARNA = { biru: '#3A86FF', oranye: '#FF8A3D', hijau: '#2BB673', merah: '#FF6384', kuning: '#FFC400', teks: '#1F2A44' };
  const svg = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  const GAMBAR = {
    // dua katak loncat dengan langkah berbeda dari 0, bertemu di satu titik
    garis() {
      let s = '<line x1="20" y1="100" x2="304" y2="100" stroke="' + WARNA.teks + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<text x="20" y="130" font-size="18" font-weight="700" text-anchor="middle" fill="' + WARNA.teks + '">0</text>';
      for (let i = 1; i <= 3; i++) { // katak atas: 3 loncatan (di atas garis)
        const x1 = 20 + (i - 1) * 80, x2 = 20 + i * 80;
        s += '<path d="M' + x1 + ' 100 Q' + (x1 + x2) / 2 + ' 38 ' + x2 + ' 100" fill="none" stroke="' + WARNA.biru + '" stroke-width="5" stroke-linecap="round"/>';
        s += '<circle cx="' + x2 + '" cy="100" r="7" fill="' + WARNA.biru + '"/>';
      }
      for (let i = 1; i <= 4; i++) { // katak bawah: 4 loncatan (di bawah garis)
        const x1 = 20 + (i - 1) * 60, x2 = 20 + i * 60;
        s += '<path d="M' + x1 + ' 100 Q' + (x1 + x2) / 2 + ' 150 ' + x2 + ' 100" fill="none" stroke="' + WARNA.oranye + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 9"/>';
        s += '<circle cx="' + x2 + '" cy="100" r="5" fill="' + WARNA.oranye + '"/>';
      }
      s += '<circle cx="260" cy="100" r="15" fill="none" stroke="' + WARNA.merah + '" stroke-width="5"/>';
      s += '<text x="22" y="48" font-size="30">🐸</text><text x="22" y="182" font-size="30">🐸</text>';
      return svg(s);
    },
    // sekumpulan benda dibagi sama rata ke beberapa wadah (kantong / amplop / piring)
    bagi() {
      let s = '';
      for (let i = 0; i < 3; i++) {
        const x = 24 + i * 100;
        s += '<path d="M' + x + ' 88 H' + (x + 80) + ' L' + (x + 70) + ' 172 Q' + (x + 40) + ' 184 ' + (x + 10) + ' 172 Z" fill="#FFE3A6" stroke="#E0A800" stroke-width="4" stroke-linejoin="round"/>';
        s += '<circle cx="' + (x + 24) + '" cy="130" r="9" fill="' + WARNA.kuning + '" stroke="#E0A800" stroke-width="2"/><circle cx="' + (x + 56) + '" cy="130" r="9" fill="' + WARNA.kuning + '" stroke="#E0A800" stroke-width="2"/>';
        s += '<circle cx="' + (x + 24) + '" cy="154" r="9" fill="' + WARNA.merah + '"/><circle cx="' + (x + 56) + '" cy="154" r="9" fill="' + WARNA.merah + '"/>';
      }
      s += '<text x="160" y="52" font-size="22" font-weight="700" text-anchor="middle" fill="' + WARNA.teks + '">isi tiap wadah sama</text>';
      s += '<path d="M138 62 L160 78 L182 62" fill="none" stroke="' + WARNA.teks + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
      return svg(s);
    },
    // model batang: dua batang dibandingkan, selisihnya ditanyakan
    batang() {
      let s = '<rect x="20" y="40" width="270" height="42" rx="8" fill="' + WARNA.biru + '"/>';
      s += '<rect x="20" y="104" width="170" height="42" rx="8" fill="' + WARNA.hijau + '"/>';
      s += '<rect x="190" y="104" width="100" height="42" rx="8" fill="none" stroke="' + WARNA.merah + '" stroke-width="4" stroke-dasharray="9 7"/>';
      s += '<text x="240" y="134" font-size="30" font-weight="800" text-anchor="middle" fill="' + WARNA.merah + '">?</text>';
      return svg(s);
    },
  };


  // Model batang pecahan: batang dibagi n bagian, `arsir` bagian pertama dipakai (diarsir), sisanya ditandai (garis putus-putus).
  // o.tidakSama = bagian dibuat tidak sama besar (gambar pengecoh). Tanpa angka di gambar.
  let _bp = 0;
  GAMBAR.batangPecahan = function (n, arsir, o) {
    o = o || {};
    const id = 'bp' + (++_bp), x0 = 20, lebar = 280, y = 38, tinggi = 62;
    const bobot = []; for (let i = 0; i < n; i++) bobot.push(o.tidakSama ? (i % 2 === 0 ? 1.7 : 0.55) : 1);
    const jml = bobot.reduce((p, q) => p + q, 0);
    const xs = [x0]; bobot.forEach((w) => xs.push(xs[xs.length - 1] + (w / jml) * lebar));
    let s = '<defs><pattern id="' + id + '" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="' + WARNA.oranye + '"/><rect width="5" height="12" fill="#FFB877"/></pattern></defs>';
    s += '<rect x="' + x0 + '" y="' + y + '" width="' + (xs[arsir] - x0) + '" height="' + tinggi + '" fill="url(#' + id + ')"/>';
    if (arsir < n) {
      s += '<rect x="' + xs[arsir] + '" y="' + y + '" width="' + (x0 + lebar - xs[arsir]) + '" height="' + tinggi + '" fill="#EAF7EF"/>';
      s += '<rect x="' + (xs[arsir] + 3) + '" y="' + (y + 3) + '" width="' + (x0 + lebar - xs[arsir] - 6) + '" height="' + (tinggi - 6) + '" rx="6" fill="none" stroke="' + WARNA.merah + '" stroke-width="4" stroke-dasharray="9 6"/>';
    }
    for (let i = 1; i < n; i++) s += '<line x1="' + xs[i] + '" y1="' + y + '" x2="' + xs[i] + '" y2="' + (y + tinggi) + '" stroke="' + WARNA.teks + '" stroke-width="3"/>';
    s += '<rect x="' + x0 + '" y="' + y + '" width="' + lebar + '" height="' + tinggi + '" rx="8" fill="none" stroke="' + WARNA.teks + '" stroke-width="4"/>';
    s += '<rect x="40" y="134" width="30" height="22" rx="4" fill="url(#' + id + ')" stroke="' + WARNA.teks + '" stroke-width="2"/><text x="78" y="152" font-size="18" font-weight="700" fill="' + WARNA.teks + '">dipakai</text>';
    s += '<rect x="178" y="134" width="30" height="22" rx="4" fill="#EAF7EF" stroke="' + WARNA.merah + '" stroke-width="3" stroke-dasharray="6 4"/><text x="216" y="152" font-size="18" font-weight="700" fill="' + WARNA.teks + '">sisa</text>';
    return svg(s);
  };
  // Tiga pilihan model batang untuk pecahan arsir/n: 1 benar + 3 jenis salah (dipilih 2): bagian tertukar, jumlah bagian keliru, bagian tidak sama besar.
  function pilihanBatang(n, arsir) {
    const benar = { id: 'p-benar', ket: 'Model batang', n, arsir, tidakSama: false, svg: GAMBAR.batangPecahan(n, arsir) };
    const salah = [
      { id: 'p-tukar', ket: 'Model batang', n, arsir: n - arsir, tidakSama: false },
      { id: 'p-n', ket: 'Model batang', n: n + 1, arsir, tidakSama: false },
      { id: 'p-beda', ket: 'Model batang', n, arsir, tidakSama: true },
    ];
    const dua = kocok(salah).slice(0, 2);
    dua.forEach((p) => { p.svg = GAMBAR.batangPecahan(p.n, p.arsir, { tidakSama: p.tidakSama }); });
    return { benar: benar.id, pilihan: kocok([benar].concat(dua)) };
  }


  // Kotak seratus (10 kolom): segs = persen bagian yang disebut, diisi berurutan dari kiri atas. o.bagian = true: bagian itu yang ditanya (diarsir),
  // sisanya polos; o.bagian = false: bagian disebut berwarna penuh, SISANYA yang ditanya (diarsir). o.n = banyak sel (100, atau 90 untuk gambar pengecoh).
  GAMBAR.kotakPersen = function (segs, o) {
    o = o || {};
    const n = o.n || 100, id = 'kp' + (++_bp), kol = 10, sel = 15, x0 = 14, y0 = 14;
    const warna = [WARNA.oranye, WARNA.biru];
    let s = '<defs><pattern id="' + id + '" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="' + WARNA.merah + '"/><rect width="4" height="10" fill="#FFB3C1"/></pattern></defs>';
    const batas = []; let jml = 0; segs.forEach((p) => { jml += p; batas.push(jml); });
    for (let i = 0; i < n; i++) {
      const bx = x0 + (i % kol) * sel, by = y0 + Math.floor(i / kol) * sel;
      let isi = '#F3F5FA', k = batas.findIndex((b) => i < b);
      if (o.bagian) { if (k >= 0) isi = 'url(#' + id + ')'; }
      else if (k >= 0) isi = warna[k % 2]; else isi = 'url(#' + id + ')';
      s += '<rect x="' + bx + '" y="' + by + '" width="' + (sel - 1.5) + '" height="' + (sel - 1.5) + '" rx="2" fill="' + isi + '"/>';
    }
    const tinggi = Math.ceil(n / kol) * sel;
    s += '<rect x="' + (x0 - 1) + '" y="' + (y0 - 1) + '" width="' + (kol * sel) + '" height="' + tinggi + '" rx="4" fill="none" stroke="' + WARNA.teks + '" stroke-width="3"/>';
    let ly = 42;
    const leg = (isi, teks) => { s += '<rect x="186" y="' + ly + '" width="26" height="22" rx="4" fill="' + isi + '" stroke="' + WARNA.teks + '" stroke-width="2"/><text x="220" y="' + (ly + 18) + '" font-size="17" font-weight="700" fill="' + WARNA.teks + '">' + teks + '</text>'; ly += 34; };
    if (o.bagian) { leg('url(#' + id + ')', 'ditanya'); leg('#F3F5FA', 'sisa'); }
    else { segs.forEach((p, i) => leg(warna[i % 2], 'disebut')); leg('url(#' + id + ')', 'ditanya'); }
    return svg(s);
  };
  // Tiga pilihan kotak seratus: 1 cocok + 2 pengecoh (persen tertukar, kotak bukan 100 sel, persen bergeser 10). Tanpa angka di gambar.
  function pilihanKotak(segs, bagian) {
    const jml = segs.reduce((a, b) => a + b, 0);
    const geser = segs.slice(); geser[0] = geser[0] + 10 + (jml - segs[0]) <= 100 ? geser[0] + 10 : geser[0] - 10;
    const tukar = segs.length === 1 ? [100 - segs[0]] : segs.slice().reverse();
    const kunci = (c) => JSON.stringify([c.n, c.segs, c.bagian]);
    const benar = { id: 'k-benar', ket: 'Kotak seratus', n: 100, segs: segs.slice(), bagian };
    const calon = [
      { id: 'k-tukar', ket: 'Kotak seratus', n: 100, segs: tukar, bagian },
      { id: 'k-90', ket: 'Kotak seratus', n: 90, segs: segs.slice(), bagian },
      { id: 'k-geser', ket: 'Kotak seratus', n: 100, segs: geser, bagian },
    ].filter((c) => kunci(c) !== kunci(benar));
    const dua = kocok(calon).slice(0, 2);
    [benar].concat(dua).forEach((c) => { c.svg = GAMBAR.kotakPersen(c.segs, { n: c.n, bagian: c.bagian }); });
    return { benar: benar.id, pilihan: kocok([benar].concat(dua)) };
  }

  // Denah berpetak p kolom x l baris. mode 'tepi' = jalan di tepi disorot (keliling), 'isi' = semua petak diisi (luas),
  // 'L' = bangun L (pojok kanan atas c x d dibuang) diisi. Tanpa angka di gambar.
  GAMBAR.denah = function (p, l, mode, o) {
    o = o || {};
    const sel = Math.min(Math.floor(250 / p), Math.floor(140 / l), 34);
    const w = sel * p, h = sel * l, x0 = Math.round((320 - w) / 2), y0 = Math.round((190 - h) / 2);
    const c = o.c || 0, d = o.d || 0;
    let s = '';
    for (let r = 0; r < l; r++) for (let k = 0; k < p; k++) {
      const potong = mode === 'L' && k >= p - c && r < d;
      const isi = mode === 'tepi' ? '#F3F5FA' : potong ? '#FFFFFF' : (mode === 'L' ? '#BFEBD3' : '#BFD8FF');
      s += '<rect x="' + (x0 + k * sel) + '" y="' + (y0 + r * sel) + '" width="' + sel + '" height="' + sel + '" fill="' + isi + '" stroke="#9AA6C0" stroke-width="1.5"/>';
    }
    if (mode === 'tepi') {
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="' + WARNA.oranye + '" stroke-width="7" stroke-linejoin="round"/>';
      s += '<text x="' + (x0 + 6) + '" y="' + (y0 - 4) + '" font-size="24">🐜</text>';
    } else if (mode === 'L') {
      const X = x0 + (p - c) * sel, Y = y0 + d * sel;
      s += '<path d="M' + x0 + ' ' + y0 + ' H' + X + ' V' + Y + ' H' + (x0 + w) + ' V' + (y0 + h) + ' H' + x0 + ' Z" fill="none" stroke="' + WARNA.teks + '" stroke-width="4" stroke-linejoin="round"/>';
      s += '<rect x="' + X + '" y="' + y0 + '" width="' + (c * sel) + '" height="' + (d * sel) + '" fill="none" stroke="' + WARNA.merah + '" stroke-width="3" stroke-dasharray="6 5"/>';
    } else {
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" fill="none" stroke="' + WARNA.teks + '" stroke-width="4"/>';
    }
    return svg(s);
  };
  // Tiga gambar denah: jalan di tepi / petak diisi penuh / bentuk L. benar = 'tepi' | 'isi' | 'L'. (c, d) = pojok yang dibuang untuk bentuk L.
  function pilihanDenah(benar, p, l, c, d) {
    const cc = c || Math.max(1, Math.floor(p / 3)), dd = d || Math.max(1, Math.floor(l / 2));
    const KET2 = { tepi: 'Jalan di tepi', isi: 'Petak diisi penuh', L: 'Bentuk L berpetak' };
    const pilihan = ['tepi', 'isi', 'L'].map((m) => ({ id: m, ket: KET2[m], mode: m, p, l, svg: GAMBAR.denah(p, l, m, { c: cc, d: dd }) }));
    return { benar, pilihan: kocok(pilihan) };
  }

  // Diagram batang bernomor sumbu (skala). d = { nama:[...], nilai:[...], garis (jarak garis sumbu), ymax }.
  // o.sorot = [indeks batang yang disorot; batang lain dipudarkan]; o.mode: 'beda' (dua batang dibandingkan: selisih ditandai "?"),
  // 'gabung' (batang yang disorot ditambah: tanda +), 'satu' (satu batang saja). Tanpa o: semua batang biasa. Tinggi batang = nilai asli.
  const WARNA_BATANG = ['#3A86FF', '#FF8A3D', '#2BB673', '#9B5DE5', '#FF6384'];
  GAMBAR.diagramBatang = function (d, o) {
    o = o || {};
    const n = d.nama.length, kiri = 34, kanan = 8, atas = 12, bawah = 38, pw = 320 - kiri - kanan, ph = 190 - atas - bawah, kol = pw / n;
    const y = (v) => atas + ph - (v / d.ymax) * ph, bw = Math.min(kol * 0.58, 52), cx = (i) => kiri + i * kol + kol / 2;
    const sorot = o.sorot || null, tampak = (i) => !sorot || sorot.includes(i);
    let s = '<rect x="1" y="1" width="318" height="188" rx="14" fill="#FFFFFF" stroke="#E9DFCB" stroke-width="3"/>';
    for (let v = 0; v <= d.ymax; v += d.garis) {
      s += '<line x1="' + kiri + '" y1="' + y(v) + '" x2="' + (320 - kanan) + '" y2="' + y(v) + '" stroke="' + (v === 0 ? WARNA.teks : '#C9D6E8') + '" stroke-width="' + (v === 0 ? 3 : 1.4) + '"/>';
      s += '<text x="' + (kiri - 6) + '" y="' + (y(v) + 4) + '" font-size="11" font-weight="700" text-anchor="end" fill="#4A5878">' + v + '</text>';
    }
    s += '<line x1="' + kiri + '" y1="' + (atas - 4) + '" x2="' + kiri + '" y2="' + y(0) + '" stroke="' + WARNA.teks + '" stroke-width="3"/>';
    d.nilai.forEach((v, i) => {
      const x = cx(i) - bw / 2, ada = tampak(i);
      s += '<rect x="' + x + '" y="' + y(v) + '" width="' + bw + '" height="' + (y(0) - y(v)) + '" rx="4" fill="' + WARNA_BATANG[i % 5] + '" fill-opacity="' + (ada ? 0.95 : 0.28) + '"' + (sorot && ada ? ' stroke="#E0A800" stroke-width="4"' : '') + '/>';
      const kata = d.nama[i].split(' ');
      kata.forEach((k, j) => { s += '<text x="' + cx(i) + '" y="' + (190 - bawah + 14 + j * 12) + '" font-size="' + (kol < 58 ? 10 : 11.5) + '" font-weight="700" text-anchor="middle" fill="' + WARNA.teks + '" fill-opacity="' + (ada ? 1 : 0.45) + '">' + k + '</text>'; });
    });
    if (sorot && o.mode === 'beda' && sorot.length === 2) {
      const [a, b] = d.nilai[sorot[0]] >= d.nilai[sorot[1]] ? sorot : [sorot[1], sorot[0]], kecil = d.nilai[b];
      s += '<line x1="' + (cx(b) - bw / 2) + '" y1="' + y(kecil) + '" x2="' + (cx(a) + bw / 2) + '" y2="' + y(kecil) + '" stroke="' + WARNA.merah + '" stroke-width="3" stroke-dasharray="7 5"/>';
      s += '<rect x="' + (cx(a) - bw / 2 + 3) + '" y="' + (y(d.nilai[a]) + 2) + '" width="' + (bw - 6) + '" height="' + Math.max(0, y(kecil) - y(d.nilai[a]) - 4) + '" rx="3" fill="#FFFFFF" fill-opacity="0.55" stroke="' + WARNA.merah + '" stroke-width="3" stroke-dasharray="6 4"/>';
      s += '<text x="' + cx(a) + '" y="' + ((y(d.nilai[a]) + y(kecil)) / 2 + 8) + '" font-size="24" font-weight="800" text-anchor="middle" fill="' + WARNA.merah + '">?</text>';
    } else if (sorot && o.mode === 'gabung') {
      const urut = sorot.slice().sort((p, q) => p - q);
      for (let k = 0; k + 1 < urut.length; k++) s += '<text x="' + ((cx(urut[k]) + cx(urut[k + 1])) / 2) + '" y="' + (y(0) - 8) + '" font-size="26" font-weight="800" text-anchor="middle" fill="' + WARNA.teks + '" stroke="#FFFFFF" stroke-width="4" paint-order="stroke">+</text>';
    }
    return svg(s);
  };

  // Tiga pilihan gambar standar (garis, bagi, batang) dengan keterangan. benarId = id gambar yang cocok.
  const KET = {
    garis: 'Dua katak loncat dari 0',
    bagi: 'Dibagi sama rata ke wadah',
    batang: 'Dua batang dibandingkan',
  };
  function pilihanGambar(benarId, ekstra) {
    const ids = ['garis', 'bagi', 'batang'];
    const pilihan = ids.map((id) => ({ id, ket: KET[id], svg: GAMBAR[id]() }));
    (ekstra || []).forEach((e) => pilihan.push(e));
    return { benar: benarId, pilihan: kocok(pilihan) };
  }

  // ---------- Pembuatan game dari data bab ----------
  function untuk(data) {
    const idJenis = data.jenis.map((j) => j.id);
    const jenisDari = (id) => data.jenis.find((j) => j.id === id);

    function buatRonde(tingkat) {
      const pakai = new Set();
      return urutanJenis(idJenis, 5).map((id) => data.buatSoal(tingkat, id, pakai));
    }
    function soalMirip(soal, tingkat) {
      return data.buatSoal(tingkat, soal.jenis, new Set([soal.kode]));
    }
    const periksa = (soal, pilihan) => ({ pilih: pilihan, benar: pilihan === soal.kunci });

    // ---------- Tampilan (browser) ----------
    const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
    const efek = (n) => { try { if (root.Suara) root.Suara.efek(n); } catch (e) { /* abaikan */ } };
    const NAMA_LANGKAH = ['Baca', 'Tandai', 'Gambar', 'Hitung dan Cek'];
    const PUJI = [
      'Kamu membaca dulu sebelum menghitung!',
      'Kamu menandai dulu sebelum menghitung!',
      'Gambar yang tepat bikin soal lebih mudah!',
    ];

    function tampilkan(soal, wadah, kirim) {
      const kotak = el('div', 'sc');
      const bilah = el('div', 'sc-bilah');
      const puji = el('div', 'sc-puji');
      const isi = el('div', 'sc-isi');
      const petunjuk = el('div', 'sc-petunjuk');
      petunjuk.hidden = true;
      kotak.append(bilah, puji, isi, petunjuk);
      wadah.appendChild(kotak);
      let salah4 = null; // pilihan salah pertama di langkah 4

      const hint = (html) => { petunjuk.innerHTML = html; petunjuk.hidden = !html; };
      function gambarBilah(aktif) {
        bilah.innerHTML = '';
        NAMA_LANGKAH.forEach((n, i) => {
          const c = el('div', 'sc-langkah' + (i < aktif ? ' selesai' : i === aktif ? ' aktif' : ''), '<b>' + (i < aktif ? '✓' : i + 1) + '</b><span>' + n + '</span>');
          bilah.appendChild(c);
        });
      }
      function langkah(i, pujiTeks) {
        gambarBilah(i); hint(''); isi.innerHTML = '';
        puji.textContent = pujiTeks ? '✓ ' + pujiTeks : '';
        [langkahBaca, langkahTandai, langkahGambar, langkahHitung][i]();
      }

      // --- 1 Baca ---
      function langkahBaca() {
        const cerita = el('div', 'sc-cerita', soal.cerita0);
        isi.append(cerita, el('div', 'sc-tanya', 'Ini soal apa?'));
        const baris = el('div', 'sc-baris');
        data.jenis.forEach((j) => {
          const b = el('button', 'tombol sc-besar', j.nama);
          b.onclick = () => {
            if (j.id === soal.jenis) { efek('pop'); langkah(1, PUJI[0]); return; }
            efek('boing');
            b.disabled = true;
            let h = soal.cerita0;
            soal.kata.forEach((k) => { h = h.split(k).join('<mark>' + k + '</mark>'); });
            cerita.innerHTML = h;
            hint('Belum tepat. Cari kata kuncinya di cerita:<br>' + data.jenis.map((x) => '<b>' + x.nama + '</b>: ' + x.petunjuk).join('<br>'));
          };
          baris.appendChild(b);
        });
        isi.appendChild(baris);
      }

      // --- 2 Tandai ---
      function langkahTandai() {
        isi.appendChild(el('div', 'sc-arah', 'Ketuk <span class="tok-contoh angka">' + (soal.arahAngka || 'angka penting') + '</span> dan <span class="tok-contoh tanya">kalimat pertanyaan</span>, lalu tekan Sudah.'));
        const cerita = el('div', 'sc-cerita sc-tandai');
        const tok = [];
        soal.segmen.forEach((s) => {
          if (s.k === 'teks') { cerita.appendChild(document.createTextNode(s.t)); return; }
          const b = el('button', 'sc-tok ' + s.k, s.t);
          b.onclick = () => { efek('pop'); b.classList.toggle('tanda'); hint(''); };
          tok.push({ s, b });
          cerita.appendChild(b);
        });
        isi.appendChild(cerita);
        if (soal.diagram) isi.appendChild(el('div', 'sc-diagram', soal.diagram));
        const sudah = el('button', 'tombol tombol-utama sc-sudah', 'Sudah ✓');
        sudah.onclick = () => {
          const dipilih = (t) => t.b.classList.contains('tanda');
          const lebih = tok.filter((t) => t.s.k === 'angka' && !t.s.penting && dipilih(t));
          const kurang = tok.filter((t) => t.s.k === 'angka' && t.s.penting && !dipilih(t));
          const tanyaKurang = tok.filter((t) => t.s.k === 'tanya' && !dipilih(t));
          if (lebih.length) { efek('boing'); hint('<b>' + lebih[0].s.t + '</b> tidak dipakai untuk menghitung, jadi tidak perlu ditandai. Ketuk lagi untuk melepas.'); return; }
          if (kurang.length) { efek('boing'); hint(soal.hintKurang || 'Masih ada angka penting yang belum kuning. Angka penting = angka yang dipakai untuk menghitung.'); return; }
          if (tanyaKurang.length) { efek('boing'); hint('Kalimat pertanyaan belum biru. Ketuk kalimat yang bertanya "kapan" atau "berapa".'); return; }
          efek('ding'); langkah(2, PUJI[1]);
        };
        isi.appendChild(sudah);
      }

      // --- 3 Gambar ---
      function langkahGambar() {
        isi.appendChild(el('div', 'sc-tanya', 'Gambar mana yang cocok untuk soal ini?'));
        const baris = el('div', 'sc-gambar-baris');
        soal.gambar.pilihan.forEach((p) => {
          const b = el('button', 'sc-gambar', p.svg + '<span>' + p.ket + '</span>');
          b.onclick = () => {
            if (p.id === soal.gambar.benar) { b.classList.add('ok'); efek('ding'); setTimeout(() => langkah(3, PUJI[2]), 650); return; }
            efek('boing'); b.classList.add('salah'); b.disabled = true;
            hint('Gambar itu untuk soal lain. ' + (jenisDari(soal.jenis).gambarPetunjuk || 'Soal ini tentang <b>' + jenisDari(soal.jenis).nama + '</b>, cari gambar yang cocok.'));
          };
          baris.appendChild(b);
        });
        isi.appendChild(baris);
      }

      // --- 4 Hitung dan Cek ---
      function langkahHitung() {
        const ringkas = el('div', 'sc-cerita sc-kecil');
        ringkas.innerHTML = soal.segmen.map((s) => (s.k === 'teks' ? s.t : '<b class="sc-m-' + s.k + '">' + s.t + '</b>')).join('');
        isi.append(ringkas);
        if (soal.diagram) isi.appendChild(el('div', 'sc-diagram', soal.diagram));
        isi.append(el('div', 'sc-tanya', soal.tanya4.teks));
        const baris = el('div', 'sc-opsi');
        soal.opsi.forEach((o) => {
          const b = el('button', 'tombol sc-besar', fmt(o) + (soal.tanya4.satuan ? ' <small>' + soal.tanya4.satuan + '</small>' : ''));
          b.onclick = () => {
            if (o === soal.kunci) {
              efek('ding');
              baris.querySelectorAll('button').forEach((x) => { x.disabled = true; });
              b.classList.add('ok');
              tampilCek();
              return;
            }
            efek('boing'); b.disabled = true; b.classList.add('salah');
            if (salah4 === null) salah4 = o;
            hint('<b>' + fmt(o) + '</b>: ' + (soal.sebab[o] || 'Belum tepat.') + ' Coba hitung lagi.');
          };
          baris.appendChild(b);
        });
        isi.appendChild(baris);
      }
      function tampilCek() {
        hint('');
        isi.classList.add('sc-cek-mode'); // cerita ringkas disembunyikan supaya Lanjut tetap terlihat di iPad
        const cek = el('div', 'sc-cek', '<div class="sc-cek-judul">Cek jawabannya</div>' + soal.cek);
        const lanjut = el('button', 'tombol tombol-utama', 'Lanjut ▶');
        lanjut.onclick = () => kirim(salah4 === null ? { benar: true, pilih: soal.kunci } : periksa(soal, salah4));
        isi.append(cek, lanjut);
        puji.textContent = '✓ ' + (salah4 === null ? 'Empat langkah sekaligus: baca, tandai, gambar, hitung. Hebat!' : 'Kamu sabar mencoba lagi sampai ketemu!');
        gambarBilah(4);
      }

      langkah(0);
    }

    function alasan(soal, jawaban, wadah) {
      const sebab = soal.sebab[jawaban.pilih];
      wadah.appendChild(el('div', 'des-alasan',
        '<div class="kotak-teks"><small>Di langkah Hitung, pilihan pertamamu ' + fmt(jawaban.pilih) + (sebab ? ': ' + sebab : '.') + '</small></div>' +
        '<div class="kotak-teks sc-cek-kecil">' + soal.cek + '</div>'));
    }
    function pujian(soal) { return { html: 'Jawabannya <b>' + fmt(soal.kunci) + (soal.tanya4.satuan ? ' ' + soal.tanya4.satuan : '') + '</b>, langkahnya lengkap!' }; }

    return { id: 'soal-cerita', tingkat: data.tingkat, ingat: data.ingat, buatRonde, soalMirip, periksa, tampilkan, alasan, pujian };
  }

  const alat = { acak, pilih, kocok, fmt, faktor, fpb, kpk, kelipatan, daftar, buatOpsi, urutanJenis, pilihanGambar, pilihanBatang, pilihanKotak, pilihanDenah, GAMBAR };
  const api = Object.assign({ untuk }, alat);
  if (modul) module.exports = api; else root.GameSoalCerita = api;
})(typeof window !== 'undefined' ? window : globalThis);
