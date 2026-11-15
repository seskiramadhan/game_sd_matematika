// Mini game 🔷 Hitung Sisi (Kelas 4 Bab 10).
// Soal 1-3: bangun besar -> KETUK tiap titik sudut (diberi nomor), lalu pilih namanya (jumlah titik sudut = jumlah sisi = nama segi-n).
// Soal 4-5: benda sekitar (tepi disorot) -> pilih nama; tingkat 2-3 soal 5: beraturan atau tidak (sisi sama DAN sudut sama).
// Tingkat 1: segitiga-segi enam, cembung, tidak diputar · 2: sampai segi delapan, diputar acak + beraturan vs tidak · 3: bangun cekung (L, panah, U, T, tangga, bintang) + pengecoh "bukan segi banyak".
// Kunci: jumlah titik = panjang daftar titik templat; beraturan = sisiSama dan sudutSama (data templat). Cek: node tools/cek-bab10.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bangun.js') : root.Bangun;
  const { acak, pilih, kocok, BANGUN, BANGUN_ID, BENDA, NAMA_N, putarTitik } = B;

  // ---------- Logika (tanpa DOM) ----------
  const cembung = (t) => !t.cekung;
  const DAFTAR_T = {
    1: BANGUN.filter((t) => cembung(t) && t.n <= 6),
    2: BANGUN.filter((t) => cembung(t) && t.n <= 8),
    3: BANGUN.filter((t) => t.cekung),
  };
  const BUKAN = [
    { id: 'lingkaran', nama: 'lingkaran', alasan: 'Lingkaran tidak punya sisi lurus dan tidak punya titik sudut.' },
    { id: 'setengah', nama: 'setengah lingkaran', alasan: 'Ada satu sisi yang <b>melengkung</b>. Semua sisi segi banyak harus garis lurus.' },
    { id: 'terbuka', nama: 'garis patah terbuka', alasan: 'Bangun ini <b>tidak tertutup</b>: ada ujung yang belum bertemu. Segi banyak harus tertutup.' },
    { id: 'daun', nama: 'daun', alasan: 'Tepinya <b>melengkung</b>, bukan garis lurus.' },
  ];

  const namaN = (n) => NAMA_N[n];
  function opsiNama(kunci, bukan) {
    const kand = [];
    for (let n = 3; n <= 10; n++) if (n !== kunci) kand.push(n);
    kand.sort((a, b) => Math.abs(a - kunci) - Math.abs(b - kunci) || Math.random() - 0.5);
    const banyak = bukan ? 2 : 3;
    const o = [kunci].concat(kand.slice(0, banyak)).map((n) => ({ kode: n, nama: namaN(n) }));
    if (bukan) o.push({ kode: 'bukan', nama: 'Bukan segi banyak' });
    return kocok(o);
  }
  const putarAcak = (tingkat) => (tingkat === 1 ? 0 : acak(0, 359));

  function soalHitung(tingkat, bukanId) {
    const daftar = DAFTAR_T[tingkat].filter((t) => t.id !== bukanId);
    const t = pilih(daftar), rot = putarAcak(tingkat);
    return { jenis: 'hitung', tingkat, templat: t.id, rot, kunci: t.n, opsi: opsiNama(t.n, false), kode: 'h' + t.id + rot };
  }
  function soalBukan(tingkat) {
    const b = pilih(BUKAN);
    const opsi = kocok([{ kode: 'bukan', nama: 'Bukan segi banyak' }].concat(kocok([3, 4, 5, 6, 8]).slice(0, 3).map((x) => ({ kode: x, nama: namaN(x) }))));
    return { jenis: 'bukan', tingkat, bukan: b.id, kunci: 'bukan', opsi, kode: 'x' + b.id };
  }
  function soalBenda(tingkat, bukanId) {
    const b = pilih(BENDA.filter((x) => x.id !== bukanId)), t = BANGUN_ID[b.templat];
    return { jenis: 'benda', tingkat, benda: b.id, templat: t.id, rot: 0, kunci: t.n, opsi: opsiNama(t.n, false), kode: 'b' + b.id }; // benda tidak diputar (hiasannya diam)
  }
  const OPSI_BERATURAN = [{ kode: true, nama: 'Beraturan' }, { kode: false, nama: 'Tidak beraturan' }];
  function soalBeraturan(tingkat, bukanId) {
    // gabungan benda & bangun cembung; kunci dari data templat (sisiSama dan sudutSama)
    const butir = BENDA.map((b) => ({ id: 'b' + b.id, benda: b.id, templat: BANGUN_ID[b.templat].id, nama: b.nama }))
      .concat(DAFTAR_T[2].filter((t) => t.n >= 3).map((t) => ({ id: 't' + t.id, benda: null, templat: t.id, nama: t.nama })));
    const ya = butir.filter((x) => BANGUN_ID[x.templat].beraturan), tidak = butir.filter((x) => !BANGUN_ID[x.templat].beraturan);
    for (let i = 0; i < 50; i++) {
      const x = pilih(Math.random() < 0.5 ? ya : tidak);
      if (x.id === bukanId) continue;
      const t = BANGUN_ID[x.templat];
      return { jenis: 'beraturan', tingkat, butir: x.id, benda: x.benda, templat: t.id, rot: x.benda ? 0 : putarAcak(tingkat), nama: x.nama, kunci: t.beraturan, opsi: kocok(OPSI_BERATURAN.slice()), kode: 'r' + x.id };
    }
    return soalBeraturan(tingkat, null);
  }

  function buatRonde(tingkat) {
    for (;;) {
      let r;
      if (tingkat === 1) {
        r = [soalHitung(1), soalHitung(1), soalHitung(1), soalBenda(1), soalBenda(1)];
      } else if (tingkat === 2) {
        r = [soalHitung(2), soalHitung(2), soalHitung(2), soalBenda(2), soalBeraturan(2)];
      } else {
        r = [soalHitung(3), soalHitung(3), soalBukan(3), soalBenda(3), soalBeraturan(3)];
      }
      if (new Set(r.map((s) => s.kode)).size !== 5) continue;
      if (tingkat < 3 && new Set(r.filter((s) => s.jenis === 'hitung').map((s) => s.kunci)).size < 2) continue; // jumlah titik sudut beragam
      return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'hitung') s = soalHitung(tingkat, soal.templat);
      else if (soal.jenis === 'bukan') s = soalBukan(tingkat);
      else if (soal.jenis === 'benda') s = soalBenda(tingkat, soal.benda);
      else s = soalBeraturan(tingkat, soal.butir);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.kunci, pilih: kode });

  const logika = { DAFTAR_T, BUKAN, soalHitung, soalBukan, soalBenda, soalBeraturan, buatRonde, soalMirip, periksa, namaN };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, svgEl, poligonSvg } = B;
  const KECIL = () => window.innerHeight < 790;
  const UKURAN = () => (KECIL() ? 300 : 340);
  const WARNA_SISI = ['#3A86FF', '#FF8A3D'];

  const titikSoal = (soal) => putarTitik(BANGUN_ID[soal.templat].pts, soal.rot);
  function dekorBenda(b, t) {
    const dalam = [], atas = [];
    if (b.id === 'stop') atas.push({ tag: 'text', isi: 'STOP', attr: { x: 0, y: 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 62, 'font-weight': 800, fill: '#fff', 'font-family': 'Poppins, sans-serif' } });
    if (b.lubang) { // lubang di tengah: mur (lingkaran), penggaris (segitiga kecil)
      if (b.id === 'mur') atas.push({ tag: 'circle', attr: { cx: 0, cy: 0, r: 44, fill: '#FFFFFF', stroke: '#1F2A44', 'stroke-width': 5 } });
      else atas.push({ tag: 'polygon', attr: { points: '-60,40 28,40 -60,-34', fill: '#FFFFFF', stroke: '#1F2A44', 'stroke-width': 4 } });
    }
    if (b.kisi) { atas.push({ tag: 'line', attr: { x1: 0, y1: -88, x2: 0, y2: 88, stroke: '#1F2A44', 'stroke-width': 6 } }); atas.push({ tag: 'line', attr: { x1: -88, y1: 0, x2: 88, y2: 0, stroke: '#1F2A44', 'stroke-width': 6 } }); }
    return { dalam, atas };
  }
  function gambarSoal(soal, opsi) {
    const ukuran = opsi.ukuran || UKURAN();
    if (soal.jenis === 'bukan') return gambarBukan(soal.bukan, ukuran);
    const t = BANGUN_ID[soal.templat], pts = titikSoal(soal);
    const o = Object.assign({ pts, ukuran, isi: '#BFDCFF' }, opsi.o || {});
    if (soal.jenis === 'benda' || (soal.jenis === 'beraturan' && soal.benda)) {
      const b = BENDA.find((x) => x.id === soal.benda);
      o.isi = b.warna; o.tebal = 9; o.titik = false; o.dekorAtas = dekorBenda(b, t).atas;
    }
    return poligonSvg(o);
  }
  function gambarBukan(id, ukuran) {
    const svg = svgEl('svg', { viewBox: '-165 -165 330 330', width: ukuran, height: ukuran, class: 'gambar-bangun' });
    svg.appendChild(svgEl('rect', { x: -163, y: -163, width: 326, height: 326, rx: 24, fill: '#FFFFFF', stroke: '#E9DFCB', 'stroke-width': 3 }));
    const st = { fill: '#BFDCFF', 'fill-opacity': 0.85, stroke: '#1F2A44', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    if (id === 'lingkaran') svg.appendChild(svgEl('circle', Object.assign({ cx: 0, cy: 0, r: 110 }, st)));
    else if (id === 'setengah') svg.appendChild(svgEl('path', Object.assign({ d: 'M -115 55 L 115 55 A 115 115 0 0 0 -115 55 Z' }, st)));
    else if (id === 'daun') svg.appendChild(svgEl('path', Object.assign({ d: 'M -105 70 C -110 -60 40 -110 110 -85 C 100 10 60 110 -105 70 Z' }, st)));
    else svg.appendChild(svgEl('path', Object.assign({ d: 'M -100 70 L -60 -70 L 0 40 L 60 -70 L 100 60 L 100 -10', fill: 'none' }, { stroke: '#1F2A44', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })));
    return svg;
  }

  const kapital = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  function teksSoal(soal) {
    if (soal.jenis === 'hitung') return 'Ketuk <b>semua titik sudut</b> bangun ini, lalu pilih namanya.';
    if (soal.jenis === 'bukan') return 'Bangun ini namanya apa? <small>Hati-hati: ada yang bukan segi banyak.</small>';
    if (soal.jenis === 'benda') { const b = BENDA.find((x) => x.id === soal.benda); return '<b>' + kapital(b.nama) + '</b>: tepi yang tebal membentuk bangun apa?'; }
    return 'Apakah <b>' + soal.nama + '</b> ini segi banyak <b>beraturan</b>?<br><small>Beraturan = semua sisi sama panjang <b>dan</b> semua sudut sama besar.</small>';
  }

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', teksSoal(soal)));
    const baris = el('div', 'jg-baris');
    const tempat = el('div', 'sudut-tempat');
    const opsiEl = el('div', 'hs-opsi');
    const tombol = [];
    let diketuk = [];
    const kanan = el('div', 'des-kanan');
    const info = el('div', 'hs-info', '');
    const wajibKetuk = soal.jenis === 'hitung';
    const pts = soal.jenis === 'bukan' ? null : titikSoal(soal);
    const gambar = () => {
      tempat.innerHTML = '';
      const o = { nomor: diketuk, ketuk: wajibKetuk ? (i) => { if (diketuk.includes(i)) return; diketuk.push(i); Suara.efek('pop'); gambar(); perbarui(); } : null };
      if (diketuk.length) o.sisiWarna = (i) => (diketuk.includes(i) && diketuk.includes((i + 1) % pts.length) ? WARNA_SISI[i % 2] : '#1F2A44');
      tempat.appendChild(gambarSoal(soal, { o }));
    };
    const perbarui = () => {
      if (!wajibKetuk) return;
      const semua = diketuk.length >= pts.length;
      info.innerHTML = semua ? 'Semua titik sudut sudah diketuk: <b>' + diketuk.length + '</b>.<br>Sekarang pilih namanya.' : 'Titik sudut yang sudah diketuk: <b>' + diketuk.length + '</b>';
      tombol.forEach((b) => { b.disabled = !semua; });
    };
    gambar();
    if (wajibKetuk) kanan.append(info, el('div', 'ingat-kecil', 'Ketuk setiap titik merah.<br>Jumlah titik sudut = jumlah sisi.'));
    else kanan.append(el('div', 'ingat-kecil', soal.jenis === 'beraturan' ? 'Garis kecil di sisi = sama panjang.<br>Lengkung di sudut = sama besar.' : 'Hitung titik sudutnya<br>(tempat dua sisi bertemu).'));
    baris.append(tempat, kanan);
    wadah.appendChild(baris);
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-des', o.nama);
      b.onclick = () => kirim(periksa(soal, o.kode));
      tombol.push(b); opsiEl.appendChild(b);
    });
    if (soal.opsi.length === 2) opsiEl.classList.add('dua');
    wadah.appendChild(opsiEl);
    perbarui();
  }

  const namaOpsi = (soal, kode) => { const o = soal.opsi.find((x) => x.kode === kode); return o ? o.nama : String(kode); };
  function pujian(soal) {
    if (soal.jenis === 'hitung' || soal.jenis === 'benda') return { html: soal.kunci + ' sisi, ' + soal.kunci + ' titik sudut → <b>' + namaN(soal.kunci).toLowerCase() + '</b>' };
    if (soal.jenis === 'bukan') return { html: BUKAN.find((b) => b.id === soal.bukan).alasan };
    return { html: ALASAN_BERATURAN(BANGUN_ID[soal.templat]) };
  }
  function ALASAN_BERATURAN(t) {
    if (t.beraturan) return 'Semua sisi sama panjang <b>dan</b> semua sudut sama besar → <b>beraturan</b>.';
    if (t.sisiSama) return 'Semua sisinya sama panjang, tetapi <b>sudutnya tidak semua sama</b> → <b>tidak beraturan</b>. (Beraturan harus sisi sama <b>dan</b> sudut sama.)';
    if (t.sudutSama) return 'Semua sudutnya sama besar, tetapi <b>sisinya tidak semua sama</b> → <b>tidak beraturan</b>. (Beraturan harus sisi sama <b>dan</b> sudut sama.)';
    return 'Sisinya tidak semua sama dan sudutnya tidak semua sama → <b>tidak beraturan</b>.';
  }

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    const tempat = el('div', 'sudut-tempat');
    const ukuran = KECIL() ? 270 : 320;
    const teksEl = el('div', 'kotak-teks', '');
    if (soal.jenis === 'bukan') {
      tempat.appendChild(gambarBukan(soal.bukan, ukuran));
      teksEl.innerHTML = BUKAN.find((b) => b.id === soal.bukan).alasan + '<br>Jadi ini <b>bukan segi banyak</b>.<br><small>Kamu memilih ' + namaOpsi(soal, jawaban.pilih) + '.</small>';
    } else if (soal.jenis === 'beraturan') {
      tempat.appendChild(gambarSoal(soal, { ukuran, o: { tandaSisi: true, tandaSudut: true, titik: false } }));
      teksEl.innerHTML = ALASAN_BERATURAN(BANGUN_ID[soal.templat]) + '<br><small>Garis kecil merah = sisi sama panjang. Lengkung berwarna sama = sudut sama besar.<br>Kamu memilih ' + namaOpsi(soal, jawaban.pilih) + '.</small>';
    } else {
      const pts = titikSoal(soal), n = pts.length;
      let k = 0;
      const gambar = () => {
        tempat.innerHTML = '';
        const o = { nomor: Array.from({ length: k }, (_, i) => i), sisiWarna: (i) => (i < k - 1 || (k === n && i === n - 1) ? WARNA_SISI[i % 2] : '#1F2A44') };
        tempat.appendChild(gambarSoal(soal, { ukuran, o: Object.assign(o, soal.jenis === 'benda' ? { titik: true } : {}) }));
        teksEl.innerHTML = 'Hitung titik sudutnya satu per satu: <b>' + k + '</b>' + (k >= n ? '<br>' + n + ' sisi, ' + n + ' titik sudut → <b>' + namaN(n).toLowerCase() + '</b>.' : '…');
        if (k >= n) teksEl.innerHTML += '<br><small>Kamu memilih ' + namaOpsi(soal, jawaban.pilih) + '.</small>';
      };
      gambar();
      const t = setInterval(() => {
        if (!tempat.isConnected) { clearInterval(t); return; }
        k++; Suara.efek('pop'); gambar();
        if (k >= n) clearInterval(t);
      }, 520);
    }
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GameHitungSisi = Object.assign({
    id: 'hitung-sisi',
    tingkat: ['segitiga sampai segi enam', 'sampai segi delapan, diputar, beraturan', 'bangun cekung & bukan segi banyak'],
    ingat: 'Segi banyak: bangun tertutup yang sisinya garis lurus. Jumlah sisi = jumlah titik sudut. Beraturan: semua sisi sama panjang dan semua sudut sama besar.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
