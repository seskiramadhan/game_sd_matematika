// Data 📖 Soal Cerita Kelas 4 Bab 4 (Pecahan 1) untuk mesin js/soal-cerita.js.
// Pesan inti (video Jago Soal Cerita Ep. 8): SIAPA LEBIH BANYAK? SAMAKAN PENYEBUT DULU. Utuhnya sama besar.
//   banding : "Siapa lebih banyak / panjang?" Jawaban NAMA TOKOH atau "Sama banyak" (labelOpsi: kode 1 = tokoh pertama, 2 = kedua, 3 = tokoh ketiga atau "sama").
//   selisih : "Lebih berapa?" Jawaban PECAHAN (kode = pembilang * 100 + penyebut, labelOpsi = pecahan bertumpuk).
// Tingkat 1: banding dua tokoh, penyebut sama atau satu kelipatan yang lain (4 dan 8, 3 dan 6).
// Tingkat 2: banding dan selisih, penyebut kelipatan persekutuan (3 dan 4, 4 dan 6), selisih sudah paling sederhana.
// Tingkat 3: banding TIGA tokoh (paling banyak / paling sedikit) dan selisih (60% harus disederhanakan), 1-2 angka pengecoh di Tandai.
// Pecahan = pasangan bilangan bulat [pembilang, penyebut] (proper, < 1 utuh); tanpa bilangan desimal. Penyebut <= 12, KPK <= 24.
// Langkah Gambar: model batang, tiap batang = 1 utuh (sama panjang), dipotong sama kecil sebanyak KPK; 2 pengecoh: batang beda panjang, potongan belum disamakan.
// Jebakan: pembilang/penyebut lebih besar BUKAN pecahan lebih besar (6/8 = 3/4).
// Contoh tetap (video Ep. 8 / Buku Saku), muncul sekitar 12%: botol jus 6/8 dan 3/4 (sama); pita 2/3 dan 3/4 m (selisih 1/12); roti 3/5 dan 1/2 (Rani lebih banyak 1/10).
// Tes: node tools/cek-soal-cerita-bab4.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok, fpb, kpk } = M;
  const FOKUS = [6, 7, 8, 12];

  const T = (t) => ({ k: 'teks', t });
  const pc = (a, d) => '<span class="pec"><span class="pec-a">' + a + '</span><span class="pec-b">' + d + '</span></span>';
  const N = (f) => ({ k: 'angka', t: pc(f[0], f[1]), nilai: f, penting: true });
  const P = (v) => ({ k: 'angka', t: String(v), nilai: v, penting: false }); // angka pengecoh
  const Q = (t) => ({ k: 'tanya', t });
  const kode = (f) => f[0] * 100 + f[1];
  const dekode = (c) => [Math.floor(c / 100), c % 100];
  const banding = (p, q) => Math.sign(p[0] * q[1] - q[0] * p[1]); // perkalian silang
  const adaFokus = (...a) => a.some((x) => FOKUS.includes(x));

  const ORANG = ['Dodi', 'Sari', 'Rani', 'Tono', 'Budi', 'Wati', 'Dewi', 'Agus', 'Lina', 'Joko', 'Maya', 'Eko', 'Tika', 'Bayu', 'Putri', 'Rafi'];
  // Templat cerita. pre/post mengapit pecahan; samar = kata pengganti pecahan di cerita tanpa angka; wh/vs/hi/lo membentuk kalimat tanya.
  const TPL = [
    { id: 'jus', orang: true, pre: 'minum ', post: ' botol jus', samar: 'sebagian', sama: 'Botol jus mereka sama besar.', wh: 'Siapa yang', vs: 'minum', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa botol selisih jus yang mereka minum?', satuan: 'botol' },
    { id: 'roti', orang: true, pre: 'makan ', post: ' roti', samar: 'sebagian', sama: 'Roti mereka sama besar.', wh: 'Siapa yang', vs: 'makan', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa roti selisih yang mereka makan?', satuan: 'roti' },
    { id: 'pita', orang: false, nama: ['Pita merah', 'Pita biru', 'Pita kuning', 'Pita hijau'], pre: 'panjangnya ', post: ' meter', samar: 'kurang dari satu', sama: '', wh: 'Pita mana yang', vs: '', hi: 'panjang', lo: 'pendek', samaLabel: 'Sama panjang', selisih: 'Berapa meter selisih panjang kedua pita?', satuan: 'meter' },
    { id: 'kebun', orang: true, pre: 'menanami ', post: ' kebun', samar: 'sebagian', sama: 'Kebun mereka sama luas.', wh: 'Siapa yang', vs: 'menanami bagian', hi: 'luas', lo: 'sempit', samaLabel: 'Sama luas', selisih: 'Berapa kebun selisih bagian yang mereka tanami?', satuan: 'kebun' },
    { id: 'lari', orang: true, pre: 'berlari ', post: ' kilometer', samar: 'kurang dari satu', sama: '', wh: 'Siapa yang', vs: 'berlari', hi: 'jauh', lo: 'dekat', samaLabel: 'Sama jauh', selisih: 'Berapa kilometer selisih jarak lari mereka?', satuan: 'kilometer' },
    { id: 'cokelat', orang: true, pre: 'menghabiskan ', post: ' batang cokelat', samar: 'sebagian', sama: 'Batang cokelat mereka sama besar.', wh: 'Siapa yang', vs: 'menghabiskan cokelat', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa batang selisih cokelat yang mereka habiskan?', satuan: 'batang' },
    { id: 'air', orang: true, pre: 'membawa ', post: ' liter air', samar: 'kurang dari satu', sama: '', wh: 'Siapa yang', vs: 'membawa air', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa liter selisih air yang mereka bawa?', satuan: 'liter' },
    { id: 'kue', orang: true, pre: 'memakan ', post: ' loyang kue', samar: 'sebagian', sama: 'Loyang kue mereka sama besar.', wh: 'Siapa yang', vs: 'memakan kue', hi: 'banyak', lo: 'sedikit', samaLabel: 'Sama banyak', selisih: 'Berapa loyang selisih kue yang mereka makan?', satuan: 'loyang' },
  ];
  const tpl = (id) => TPL.find((x) => x.id === id);
  const kalimat = (t, kata) => [t.wh, t.vs, kata].filter(Boolean).join(' ') + '?';
  const CONTOH = [
    { jenis: 'banding', tingkat: 1, tp: 'jus', nama: ['Dodi', 'Sari'], f: [[6, 8], [3, 4]] },
    { jenis: 'selisih', tingkat: 2, tp: 'pita', nama: ['Pita merah', 'Pita biru'], f: [[2, 3], [3, 4]] },
    { jenis: 'banding', tingkat: 2, tp: 'roti', nama: ['Rani', 'Tono'], f: [[3, 5], [1, 2]] },
    { jenis: 'selisih', tingkat: 2, tp: 'roti', nama: ['Rani', 'Tono'], f: [[3, 5], [1, 2]] },
  ];
  const DIS = [' Kejadian itu berlangsung {x} menit.', ' Ada {x} anak yang menonton.', ' Hari itu tanggal {x}.', ' Mereka mulai setelah {x} menit.'];

  // ---------- Pasangan penyebut ----------
  const pasangan = (ok) => { const a = []; for (let d = 2; d <= 12; d++) for (let e = d; e <= 12; e++) if (ok(d, e)) a.push([d, e]); return a; };
  const PAS1 = pasangan((d, e) => e > d && e % d === 0);                 // kelipatan: 4 dan 8, 3 dan 6
  const PAS2 = pasangan((d, e) => e % d !== 0 && kpk(d, e) <= 24);       // kelipatan persekutuan: 3 dan 4, 4 dan 6
  const PAS3 = pasangan((d, e) => e > d && kpk(d, e) <= 24);             // semua (selisih tingkat 3)
  const SET3 = [[2, 3, 4], [2, 4, 8], [3, 4, 6], [3, 6, 12], [4, 6, 12], [2, 3, 6], [4, 6, 8], [3, 4, 12], [6, 8, 12], [2, 4, 6], [3, 4, 8], [2, 6, 12], [4, 8, 12], [2, 3, 12]];
  const pilihPas = (daftar) => {
    const fk = daftar.filter((p) => adaFokus(p[0], p[1]));
    return Math.random() < 0.6 && fk.length ? pilih(fk) : pilih(daftar);
  };

  // Pecahan [a,d] proper
  const semuaPec = (d) => { const a = []; for (let n = 1; n < d; n++) a.push([n, d]); return a; };

  // ---------- Gambar: model batang (tanpa angka) ----------
  const W = { warna: ['#3A86FF', '#2BB673', '#FF8A3D'], teks: '#1F2A44', merah: '#FF6384', sisa: '#EAF7EF' };
  const svg = (isi) => '<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' + isi + '</svg>';
  // bars: [{ nama, n (banyak potongan), a (potongan terisi), len (0..1 panjang relatif), bobot (opsional, potongan tak sama besar) }]. sel = true: tandai selisih "?".
  function gambarBatang(bars, sel) {
    const jml = bars.length, h = jml === 3 ? 34 : 44, lab = 17, gap = jml === 3 ? 9 : 24, x0 = 20, lebar = 280;
    let s = '';
    const ujung = [];
    bars.forEach((b, i) => {
      const y = 8 + i * (h + lab + gap) + lab, w = lebar * b.len;
      const bobot = []; for (let k = 0; k < b.n; k++) bobot.push(b.bobot ? (k % 2 === 0 ? 1.8 : 0.5) : 1);
      const tot = bobot.reduce((p, q) => p + q, 0), xs = [x0];
      bobot.forEach((q) => xs.push(xs[xs.length - 1] + (q / tot) * w));
      s += '<text x="' + x0 + '" y="' + (y - 5) + '" font-size="14" font-weight="800" fill="' + W.teks + '">' + b.nama + '</text>';
      s += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + W.sisa + '"/>';
      s += '<rect x="' + x0 + '" y="' + y + '" width="' + (xs[b.a] - x0) + '" height="' + h + '" fill="' + W.warna[i] + '"/>';
      for (let k = 1; k < b.n; k++) s += '<line x1="' + xs[k] + '" y1="' + y + '" x2="' + xs[k] + '" y2="' + (y + h) + '" stroke="' + W.teks + '" stroke-width="' + (b.n > 12 ? 1.6 : 2.4) + '"/>';
      s += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="none" stroke="' + W.teks + '" stroke-width="3.5"/>';
      ujung.push({ x: xs[b.a], y, h });
    });
    if (sel && jml === 2) {
      const [kecil, besar] = ujung[0].x <= ujung[1].x ? [ujung[0], ujung[1]] : [ujung[1], ujung[0]];
      s += '<rect x="' + (kecil.x + 2) + '" y="' + (besar.y + 3) + '" width="' + Math.max(0, besar.x - kecil.x - 4) + '" height="' + (besar.h - 6) + '" rx="4" fill="#FFFFFF" fill-opacity=".55" stroke="' + W.merah + '" stroke-width="3.5" stroke-dasharray="7 5"/>';
      s += '<text x="' + ((kecil.x + besar.x) / 2) + '" y="' + (besar.y + besar.h / 2 + 8) + '" font-size="22" font-weight="800" text-anchor="middle" fill="' + W.merah + '">?</text>';
    }
    return svg(s);
  }
  // 3 pilihan: benar = batang sama panjang & dipotong sama kecil (KPK); salah 1 = batang beda panjang; salah 2 = potongan belum disamakan (penyebut masing-masing)
  function pilihanGambarB4(nama, fr, sel) {
    let L = 1; fr.forEach((f) => { L = kpk(L, f[1]); });
    const cm = (f) => f[0] * (L / f[1]);
    const lens = [1, 0.66, 0.83];
    const tepat = nama.map((nm, i) => ({ nama: nm, n: L, a: cm(fr[i]), len: 1 }));
    const beda = nama.map((nm, i) => ({ nama: nm, n: L, a: cm(fr[i]), len: lens[i] }));
    const semuaSama = fr.every((f) => f[1] === L);
    const tak = nama.map((nm, i) => ({ nama: nm, n: fr[i][1], a: fr[i][0], len: 1, bobot: semuaSama }));
    return {
      benar: 'b4-sama',
      pilihan: kocok([
        { id: 'b4-sama', ket: 'Model batang', mode: 'sama', L, svg: gambarBatang(tepat, sel) },
        { id: 'b4-beda', ket: 'Model batang', mode: 'beda', L, svg: gambarBatang(beda, sel) },
        { id: 'b4-tak', ket: 'Model batang', mode: 'tak', L, svg: gambarBatang(tak, sel) },
      ]),
    };
  }

  // ---------- Bagian cerita ----------
  function ambilNama(tp, n) {
    return kocok(tp.orang ? ORANG : tp.nama).slice(0, n);
  }
  function susun(tp, nama, fr, tanya, tingkat, terlarang) {
    const segmen = [];
    nama.forEach((n, i) => { segmen.push(T(n + ' ' + tp.pre), N(fr[i]), T(tp.post + '. ')); });
    if (tp.sama) segmen.push(T(tp.sama + ' '));
    const dis = [];
    if (tingkat === 3) {
      kocok(DIS).slice(0, acak(1, 2)).forEach((kal) => {
        let v; do { v = acak(13, 45); } while (terlarang.has(v) || dis.includes(v));
        dis.push(v);
        const [x, y] = kal.split('{x}'); segmen.push(T(x.replace(/^ /, '')), P(v), T(y + ' '));
      });
    }
    segmen.push(Q(tanya));
    const cerita0 = nama.map((n) => n + ' ' + tp.pre + tp.samar + tp.post + '. ').join('') + (tp.sama ? tp.sama + ' ' : '') + tanya;
    return { segmen, cerita0, dis, kataIsi: tp.pre + tp.samar + tp.post };
  }
  const konv = (f, L) => (f[1] === L ? pc(f[0], f[1]) : pc(f[0], f[1]) + ' = ' + pc(f[0] * (L / f[1]), L) + ' <small>(atas dan bawah × ' + (L / f[1]) + ')</small>');

  // ---------- BANDING dua tokoh (tingkat 1-2) ----------
  function soalBanding2(tingkat, pakai) {
    for (let coba = 0; coba < 3000; coba++) {
      let ct = null;
      if (Math.random() < 0.12) { const c = CONTOH.filter((x) => x.jenis === 'banding' && x.tingkat === tingkat); if (c.length) ct = pilih(c); }
      let tp, nama, fr;
      if (ct) { tp = tpl(ct.tp); nama = ct.nama; fr = ct.f; }
      else {
        tp = pilih(TPL);
        const [d0, e0] = pilihPas(tingkat === 1 ? PAS1 : PAS2);
        const [d, e] = Math.random() < 0.5 ? [d0, e0] : [e0, d0];
        const mauSama = Math.random() < 0.24;
        let kand = [];
        semuaPec(d).forEach((p) => semuaPec(e).forEach((q) => { if ((banding(p, q) === 0) === mauSama) kand.push([p, q]); }));
        if (!kand.length) continue;
        const trap = kand.filter(([p, q]) => p[0] !== q[0] && (p[0] > q[0]) !== (banding(p, q) > 0));
        if (!mauSama && trap.length && Math.random() < 0.55) kand = trap;
        fr = pilih(kand); nama = ambilNama(tp, 2);
      }
      const [p, q] = fr, L = kpk(p[1], q[1]), A = p[0] * (L / p[1]), C = q[0] * (L / q[1]);
      const kd = 'bd-' + tp.id + '-' + p[0] + '/' + p[1] + '-' + q[0] + '/' + q[1] + '-' + nama.join('+');
      if (pakai && pakai.has(kd)) continue;
      const hasil = Math.sign(A - C); // 1: tokoh 1 lebih banyak, -1: tokoh 2, 0: sama
      const kunci = hasil === 0 ? 3 : hasil > 0 ? 1 : 2;
      const labelOpsi = { 1: nama[0], 2: nama[1], 3: tp.samaLabel };
      const tanya = kalimat(tp, 'lebih ' + tp.hi);
      const sebab = {};
      [1, 2, 3].filter((k) => k !== kunci).forEach((k) => {
        let s = 'Samakan penyebutnya dulu: ' + (p[1] === q[1] ? 'penyebutnya sudah sama. ' : pc(p[0], p[1]) + ' = ' + pc(A, L) + ' dan ' + pc(q[0], q[1]) + ' = ' + pc(C, L) + '. ');
        const lebihAngka = k === 3 ? false : (k === 1 ? (p[0] > q[0] || p[1] > q[1]) : (q[0] > p[0] || q[1] > p[1]));
        if (lebihAngka) s += 'Angka atau penyebut yang lebih besar belum tentu pecahan yang lebih besar. ';
        s += hasil === 0 ? 'Keduanya sama besar.' : k === 3 ? 'Keduanya tidak sama: ' + nama[hasil > 0 ? 0 : 1] + ' lebih ' + tp.hi + '.' : nama[hasil > 0 ? 0 : 1] + ' yang lebih ' + tp.hi + '.';
        sebab[k] = s;
      });
      const { segmen, cerita0, dis, kataIsi } = susun(tp, nama, fr, tanya, tingkat, new Set([p[0], p[1], q[0], q[1], L, A, C]));
      const cek = 'Utuhnya sama besar. Samakan penyebut: KPK ' + p[1] + ' dan ' + q[1] + ' = ' + L + '.<br>' + nama[0] + ': ' + konv(p, L) + '<br>' + nama[1] + ': ' + konv(q, L) + '<br>' +
        pc(A, L) + (hasil === 0 ? ' sama dengan ' : hasil > 0 ? ' lebih dari ' : ' kurang dari ') + pc(C, L) + '. Jawaban: <b>' + labelOpsi[kunci] + '</b>' +
        '<br><small>Cek silang: ' + p[0] + ' × ' + q[1] + ' = ' + p[0] * q[1] + ' dan ' + q[0] + ' × ' + p[1] + ' = ' + q[0] * p[1] + '.</small>';
      return {
        jenis: 'banding', tingkat, kode: kd, mode: 'dua', tp: tp.id, nama, fr, L, A, C, hasil,
        cerita0, kata: [kataIsi, 'lebih ' + tp.hi],
        segmen, angkaPenting: [p, q], angkaPengecoh: dis, fokus: adaFokus(p[1], q[1]),
        arahAngka: 'pecahan penting', hintKurang: 'Masih ada pecahan penting yang belum kuning. Ketuk semua pecahan di cerita.',
        gambar: pilihanGambarB4(nama, fr, false), tanya4: { teks: tanya, satuan: '' },
        kunci, opsi: kocok([1, 2, 3]), labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalBanding2 gagal');
  }

  // ---------- BANDING tiga tokoh (tingkat 3) ----------
  function soalBanding3(pakai) {
    for (let coba = 0; coba < 4000; coba++) {
      const tp = pilih(TPL), dens = pilih(SET3);
      const fr = [0, 1, 2].map(() => { const d = pilih(dens); return [acak(1, d - 1), d]; });
      if (new Set(fr.map((f) => f[1])).size < 2) continue;
      if (banding(fr[0], fr[1]) === 0 || banding(fr[0], fr[2]) === 0 || banding(fr[1], fr[2]) === 0) continue;
      let L = 1; fr.forEach((f) => { L = kpk(L, f[1]); });
      if (L > 24) continue;
      const nama = ambilNama(tp, 3), cm = fr.map((f) => f[0] * (L / f[1]));
      const paling = Math.random() < 0.65 ? 'hi' : 'lo';
      const idx = [0, 1, 2].sort((x, y) => cm[y] - cm[x]), kunciIdx = paling === 'hi' ? idx[0] : idx[2];
      const kd = 'bd3-' + paling + '-' + tp.id + '-' + fr.map((f) => f[0] + '/' + f[1]).join('-') + '-' + nama.join('+');
      if (pakai && pakai.has(kd)) continue;
      const kunci = kunciIdx + 1, labelOpsi = { 1: nama[0], 2: nama[1], 3: nama[2] };
      const tanya = kalimat(tp, 'paling ' + tp[paling]);
      const daftarCm = nama.map((n, i) => n + ' ' + pc(fr[i][0], fr[i][1]) + ' = ' + pc(cm[i], L)).join(', ');
      const sebab = {};
      [1, 2, 3].filter((k) => k !== kunci).forEach((k) => {
        const i = k - 1, lebihAngka = fr[i][0] > fr[kunciIdx][0] || fr[i][1] > fr[kunciIdx][1];
        sebab[k] = 'Samakan penyebut jadi ' + L + ' dulu: ' + daftarCm + '. ' + (lebihAngka ? 'Angka atau penyebut yang lebih besar belum tentu pecahan yang lebih besar. ' : '') +
          nama[i] + ' bukan yang paling ' + tp[paling] + '.';
      });
      const { segmen, cerita0, dis, kataIsi } = susun(tp, nama, fr, tanya, 3, new Set(fr.flat().concat([L], cm)));
      const cek = 'Utuhnya sama besar. Samakan penyebut ke KPK-nya, yaitu ' + L + ':<br>' + nama.map((n, i) => n + ': ' + konv(fr[i], L)).join('<br>') + '<br>Yang paling ' + tp[paling] + ' adalah yang pembilangnya ' + (paling === 'hi' ? 'terbesar' : 'terkecil') + ' (' + pc(cm[kunciIdx], L) + '). Jawaban: <b>' + labelOpsi[kunci] + '</b>' +
        '<br><small>Urutan dari terbesar: ' + idx.map((i) => nama[i]).join(', ') + '.</small>';
      return {
        jenis: 'banding', tingkat: 3, kode: kd, mode: 'tiga', paling, tp: tp.id, nama, fr, L, cm,
        cerita0, kata: [kataIsi, 'paling ' + tp[paling]],
        segmen, angkaPenting: fr, angkaPengecoh: dis, fokus: adaFokus(...fr.map((f) => f[1])),
        arahAngka: 'pecahan penting', hintKurang: 'Masih ada pecahan penting yang belum kuning. Ketuk ketiga pecahan di cerita.',
        gambar: pilihanGambarB4(nama, fr, false), tanya4: { teks: tanya, satuan: '' },
        kunci, opsi: kocok([1, 2, 3]), labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalBanding3 gagal');
  }

  // ---------- SELISIH (tingkat 2-3) ----------
  function soalSelisih(tingkat, pakai) {
    for (let coba = 0; coba < 5000; coba++) {
      let ct = null;
      if (tingkat === 2 && Math.random() < 0.12) ct = pilih(CONTOH.filter((x) => x.jenis === 'selisih'));
      let tp, nama, fr, sed = false;
      if (ct) { tp = tpl(ct.tp); nama = ct.nama; fr = ct.f; }
      else {
        tp = pilih(TPL);
        const [d0, e0] = pilihPas(tingkat === 2 ? PAS2 : PAS3);
        const [d, e] = Math.random() < 0.5 ? [d0, e0] : [e0, d0];
        const kand = [];
        semuaPec(d).forEach((p) => semuaPec(e).forEach((q) => { if (banding(p, q) !== 0) kand.push([p, q]); }));
        fr = pilih(kand); nama = ambilNama(tp, 2);
        sed = tingkat === 3 && Math.random() < 0.6;
      }
      const [p, q] = fr, L = kpk(p[1], q[1]), A = p[0] * (L / p[1]), C = q[0] * (L / q[1]);
      const s = Math.abs(A - C), g = fpb(s, L);
      if (!ct && (g > 1) !== sed) continue; // tingkat 2 dan 3 biasa: sudah paling sederhana; tingkat 3 "sederhanakan": harus bisa disederhanakan
      const kd = 'sl-' + (sed ? 'sed-' : '') + tp.id + '-' + p[0] + '/' + p[1] + '-' + q[0] + '/' + q[1] + '-' + nama.join('+');
      if (pakai && pakai.has(kd)) continue;
      const besarIdx = A > C ? 0 : 1, bs = Math.max(A, C), kc = Math.min(A, C);
      const fb = fr[besarIdx], fk = fr[1 - besarIdx];
      const kp = [s / g, L / g]; // jawaban akhir
      const kunci = kode(kp);
      const eqv = (c) => { const x = dekode(c); return x[0] * kp[1] === kp[0] * x[1]; };
      const grup = [];
      const dn = Math.abs(fb[0] - fk[0]), dd = Math.abs(fb[1] - fk[1]);
      if (dn >= 1 && dd >= 1) grup.push({ s: 'Itu ' + pc(fb[0], fb[1]) + ' − ' + pc(fk[0], fk[1]) + ' dengan mengurangi angka atas dan angka bawah langsung. Penyebut tidak dikurangi: samakan penyebut dulu, lalu kurangi pembilangnya.', v: [kode([dn, dd])].filter((c) => !eqv(c)) });
      const mx = Math.max(p[1], q[1]);
      if (dn >= 1) grup.push({ s: 'Penyebut ' + p[1] + ' dan ' + q[1] + ' belum sama, jadi belum boleh langsung dikurangi. Samakan dulu jadi per ' + L + '.', v: [kode([dn, mx])].filter((c) => !eqv(c)) });
      grup.push({ s: 'Itu ' + pc(bs, L) + ', yaitu pecahan yang lebih besar saja. Yang ditanya selisih, jadi dikurangi: ' + bs + ' − ' + kc + '.', v: bs < L ? [kode([bs, L])].filter((c) => !eqv(c)) : [] });
      if (sed) grup.push({ s: 'Hasilnya benar, tetapi belum paling sederhana. Bagi atas dan bawah dengan ' + g + '.', v: [kode([s, L])] });
      if (bs + kc < L) grup.push({ s: 'Itu hasil menjumlah. Selisih berarti dikurangi.', v: [kode([bs + kc, L])].filter((c) => !eqv(c)) });
      const cadangan = [kode([kp[0] + 1, kp[1]]), kode([kp[0] + 2, kp[1]]), kode([kp[0], kp[1] + 1]), kode([kp[0], kp[1] + 2]), kode([kp[0] + 1, kp[1] + 1])].filter((c) => !eqv(c) && dekode(c)[0] >= 1);
      grup.push({ s: 'Belum tepat. Samakan penyebut jadi ' + L + ' dulu, lalu kurangi pembilangnya: ' + bs + ' − ' + kc + '.', v: cadangan });
      const hasilOpsi = M.buatOpsi(kunci, grup, cadangan, { min: 101, maks: 9999, n: 4 });
      const opsi = hasilOpsi.opsi, sebab = hasilOpsi.sebab;
      if (sed && !opsi.includes(kode([s, L]))) continue; // pengecoh "belum disederhanakan" wajib ada
      const labelOpsi = {}; opsi.forEach((o) => { const x = dekode(o); labelOpsi[o] = pc(x[0], x[1]); });
      const tanya = tp.selisih + (sed ? ' Tulis dalam bentuk paling sederhana.' : '');
      const { segmen, cerita0, dis, kataIsi } = susun(tp, nama, fr, tanya, tingkat, new Set([p[0], p[1], q[0], q[1], L, A, C, s, g]));
      const cek = 'Utuhnya sama besar. Samakan penyebut: KPK ' + p[1] + ' dan ' + q[1] + ' = ' + L + '.<br>' + nama[0] + ': ' + konv(p, L) + '<br>' + nama[1] + ': ' + konv(q, L) + '<br>' +
        'Selisih: ' + bs + ' − ' + kc + ' = ' + s + ', jadi ' + pc(s, L) + (g > 1 ? ' = ' + pc(kp[0], kp[1]) + ' <small>(bagi atas dan bawah dengan ' + g + ')</small>' : '') + '. Jawaban: <b>' + labelOpsi[kunci] + '</b> ' + tp.satuan +
        '<br><small>Cek: ' + pc(kc, L) + ' + ' + pc(s, L) + ' = ' + pc(bs, L) + '.</small>';
      return {
        jenis: 'selisih', tingkat, kode: kd, mode: sed ? 'sederhana' : 'biasa', tp: tp.id, nama, fr, L, A, C, s, g, besarIdx,
        cerita0, kata: [kataIsi, 'selisih'],
        segmen, angkaPenting: fr, angkaPengecoh: dis, fokus: adaFokus(p[1], q[1]),
        arahAngka: 'pecahan penting', hintKurang: 'Masih ada pecahan penting yang belum kuning. Ketuk kedua pecahan di cerita.',
        gambar: pilihanGambarB4(nama, fr, true), tanya4: { teks: tanya, satuan: tp.satuan },
        kunci, opsi, labelOpsi, sebab, cek,
      };
    }
    throw new Error('soalSelisih gagal');
  }

  const data = {
    id: 'k4b4',
    jenis: [
      { id: 'banding', nama: 'Bandingkan', petunjuk: 'yang ditanya <b>siapa yang lebih banyak</b> (atau lebih panjang, lebih jauh). Pecahannya dibandingkan.',
        gambarPetunjuk: 'Untuk membandingkan, batang harus <b>sama panjang</b> (utuhnya sama) dan dipotong <b>sama kecil</b>.' },
      { id: 'selisih', nama: 'Cari selisih', petunjuk: 'yang ditanya <b>selisihnya</b>: lebih berapa. Penyebut disamakan, lalu pembilangnya dikurangi.',
        gambarPetunjuk: 'Untuk mencari selisih, batang harus <b>sama panjang</b>, dipotong <b>sama kecil</b>, lalu bagian lebihnya ditandai.' },
    ],
    tingkat: ['dua tokoh, penyebut sama atau satu kelipatan yang lain', 'bandingkan dan cari selisih, penyebut berbeda (kelipatan persekutuan)', 'tiga tokoh, selisih yang harus disederhanakan, dan angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Siapa lebih banyak? Samakan penyebut dulu (utuhnya harus sama besar). Pembilang atau penyebut yang lebih besar belum tentu pecahan yang lebih besar. Selisih: kurangi pembilangnya, lalu sederhanakan.',
    jenisTingkat: (t) => (t === 1 ? ['banding'] : ['banding', 'selisih']),
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'selisih' ? soalSelisih(tingkat, pakai) : tingkat === 3 ? soalBanding3(pakai) : soalBanding2(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    TPL, CONTOH, FOKUS, PAS1, PAS2, PAS3, SET3, kode, dekode, pc,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b4 = data;
})(typeof window !== 'undefined' ? window : globalThis);
