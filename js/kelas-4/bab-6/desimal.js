// Alat bersama Bab 6 (Desimal): format koma Indonesia, hitung (bilangan bulat, tanpa floating point),
// gambar (kotak seratus 10x10, pita 10 bagian, garis bilangan dengan zoom, tabel nilai tempat).
// Nilai desimal ditulis { n, d }: n bilangan bulat dalam satuan 10^-d (d = 1..3), mis. { n: 75, d: 2 } -> "0,75".
// "Mil" = nilai dalam perseribuan (bilangan bulat) untuk membandingkan. Cek logika: node tools/cek-bab6.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('../bab-4/pecahan.js') : root.Pecahan;
  const { acak, pilih, kocok, pilihBobot } = P;

  // ---------- Logika (tanpa DOM) ----------
  const P10 = [1, 10, 100, 1000];
  const des = (n, d, salah) => (salah ? { n, d, salah } : { n, d });
  const mil = (x) => x.n * P10[3 - x.d];
  // Teks Indonesia: koma, tidak pernah titik. d angka di belakang koma dipertahankan (0,60 tetap 0,60).
  function teks(x) {
    const { n, d } = x;
    if (d === 0) return String(n);
    return Math.floor(n / P10[d]) + ',' + String(n % P10[d]).padStart(d, '0');
  }
  // dari mil dengan d angka di belakang koma (mil harus habis dibagi 10^(3-d))
  const dariMil = (m, d, salah) => des(m / P10[3 - d], d, salah);
  // bentuk paling pendek (tanpa nol di belakang), minimal 1 angka di belakang koma
  const minimal = (m, salah) => dariMil(m, m % 100 === 0 ? 1 : m % 10 === 0 ? 2 : 3, salah);
  // tulis angka dari teks: lit(3, '4') -> "3,4"; lit(0, '307') -> "0,307"
  const lit = (bulat, pecah, salah) => des(Number(String(bulat) + pecah), pecah.length, salah);
  const banding = (a, b) => Math.sign(mil(a) - mil(b));
  const senilai = (a, b) => mil(a) === mil(b);
  const sama = (a, b) => a.n === b.n && a.d === b.d; // sama persis (termasuk jumlah angka)
  // teks nilai mil dengan d angka di belakang koma; bilangan bulat ditulis tanpa koma (0 dan 1 di garis)
  const teksMil = (m, d) => (m % 1000 === 0 ? String(m / 1000) : teks(dariMil(m, d)));
  // pecahan a/b (b habis membagi 1000) -> desimal bentuk paling pendek
  const dariPecahan = (a, b) => minimal((a * 1000) / b);
  const SIMBOL = { '-1': '<', '0': '=', '1': '>' };

  // pilih sampai 'jumlah' pengecoh dari daftar kandidat: nilainya harus beda dari kunci dan satu sama lain
  function pilihPengecoh(kunci, kandidat, jumlah) {
    const dipakai = [kunci], hasil = [];
    for (const c of kandidat) {
      if (hasil.length >= (jumlah || 3)) break;
      if (!c || c.n <= 0 || c.d > 3 || c.d < 1) continue;
      if (dipakai.some((x) => senilai(x, c))) continue;
      dipakai.push(c); hasil.push(c);
    }
    return hasil;
  }

  // pengecoh untuk k perseratus (11..99): 0,37 -> 3,7 / 0,307 / 0,73 / 0,63 (yang tidak berwarna)
  function pengecohSeratus(k) {
    const a = Math.floor(k / 10), b = k % 10;
    return [
      lit(a, String(b), 'utuh'),
      lit(0, String(a) + '0' + String(b), 'nol'),
      lit(0, String(b) + String(a), 'balik'),
      des(100 - k, 2, 'sisa'),
      des(k + 1, 2, 'dekat'), des(k - 1, 2, 'dekat'), des(k + 10, 2, 'dekat'),
    ];
  }
  // pengecoh untuk k persepuluh (1..9)
  function pengecohSepuluh(k) {
    return [
      des(k, 2, 'seratus'),          // 0,03
      des(10 - k, 1, 'sisa'),        // 0,7 (bagian yang tidak berwarna)
      lit(k, '0', 'utuh'),           // 3,0
      des(k + 1, 1, 'dekat'), des(k - 1, 1, 'dekat'), lit(1, String(k), 'dekat'),
    ];
  }
  // pengecoh pecahan a/b -> desimal: 3/4 -> 3,4 / 0,34 / 0,4 / 0,25
  function pengecohPecahan(a, b, kunciMil) {
    return [
      lit(a, String(b), 'pisah'),
      lit(0, String(a) + String(b), 'gabung'),
      lit(0, String(b), 'penyebut'),
      minimal(1000 - kunciMil, 'sisa'),
      minimal(kunciMil + 100, 'dekat'), minimal(kunciMil - 100, 'dekat'),
    ].filter((x) => x.n >= 0 && x.d <= 3);
  }

  // kotak seratus diwarnai urut kolom: n kotak -> kolom penuh + sisa kotak
  const kolomSisa = (n) => ({ kolom: Math.floor(n / 10), sisa: n % 10 });

  const logika = { P10, des, mil, teks, dariMil, minimal, lit, banding, senilai, sama, teksMil, dariPecahan, SIMBOL,
    pilihPengecoh, pengecohSeratus, pengecohSepuluh, pengecohPecahan, kolomSisa, acak, pilih, kocok, pilihBobot };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  const FONT = 'Poppins, sans-serif';

  // Kotak seratus 10x10, diwarnai urut kolom (indeks i: kolom = i div 10, baris = i mod 10).
  // opsi: ukuran, warnaFn(i) -> warna|null, kolomTombol (baris tombol kolom di atas), onKetuk(i), onKolom(c)
  function kotakSeratus(opsi) {
    const U = opsi.ukuran || 300, atas = opsi.kolomTombol ? 30 : 0, s = U / 10;
    const svg = svgEl('svg', { viewBox: '-3 -3 ' + (U + 6) + ' ' + (U + atas + 6), width: U + 6, height: U + atas + 6, class: 'gambar-kotak' });
    svg.appendChild(svgEl('rect', { x: -2, y: atas - 2, width: U + 4, height: U + 4, rx: 6, fill: '#C9BFAA' }));
    const sel = [];
    for (let i = 0; i < 100; i++) {
      const r = svgEl('rect', { x: Math.floor(i / 10) * s, y: atas + (i % 10) * s, width: s, height: s, stroke: '#C9BFAA', 'stroke-width': 1.5, 'data-i': i, class: 'kotak-sel' });
      svg.appendChild(r); sel.push(r);
    }
    if (opsi.kolomTombol) {
      for (let c = 0; c < 10; c++) {
        svg.appendChild(svgEl('rect', { x: c * s + 1, y: 0, width: s - 2, height: atas - 4, rx: 7, fill: '#FFE3A3', stroke: '#E0A800', 'stroke-width': 1.5, 'data-k': c, class: 'kotak-kolom' }));
        const t = svgEl('text', { x: c * s + s / 2, y: (atas - 4) / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 14, fill: '#8A5A00', 'pointer-events': 'none', 'font-family': FONT, 'font-weight': 800 });
        t.textContent = '▼';
        svg.appendChild(t);
      }
    }
    const warnai = (fn) => sel.forEach((r, i) => r.setAttribute('fill', fn(i) || '#FFFFFF'));
    warnai(opsi.warnaFn || (() => null));
    svg.addEventListener('click', (e) => {
      const t = e.target.closest ? e.target.closest('[data-i],[data-k]') : null;
      if (!t) return;
      if (t.dataset.i != null && opsi.onKetuk) opsi.onKetuk(Number(t.dataset.i));
      else if (t.dataset.k != null && opsi.onKolom) opsi.onKolom(Number(t.dataset.k));
    });
    return { svg, warnai };
  }

  // Pita 10 bagian (bagian ke-i dari kiri). opsi: lebar, tinggi, warnaFn(i), onKetuk(i)
  function pita(opsi) {
    const W = opsi.lebar || 560, T = opsi.tinggi || 70, s = W / 10;
    const svg = svgEl('svg', { viewBox: '-3 -3 ' + (W + 6) + ' ' + (T + 6), width: W + 6, height: T + 6, class: 'gambar-pita' });
    svg.appendChild(svgEl('rect', { x: -2, y: -2, width: W + 4, height: T + 4, rx: 10, fill: '#C9BFAA' }));
    const sel = [];
    for (let i = 0; i < 10; i++) {
      const r = svgEl('rect', { x: i * s, y: 0, width: s, height: T, stroke: '#C9BFAA', 'stroke-width': 2, 'data-i': i, class: 'kotak-sel' });
      svg.appendChild(r); sel.push(r);
    }
    const warnai = (fn) => sel.forEach((r, i) => r.setAttribute('fill', fn(i) || '#FFFFFF'));
    warnai(opsi.warnaFn || (() => null));
    svg.addEventListener('click', (e) => {
      const t = e.target.closest ? e.target.closest('[data-i]') : null;
      if (t && opsi.onKetuk) opsi.onKetuk(Number(t.dataset.i));
    });
    return { svg, warnai };
  }

  // Garis bilangan lo..hi (dalam mil) dengan 'bagian' bagian sama besar.
  // opsi: labelSemua, labelTiap (label tiap k tik), d (angka di belakang koma untuk label), kecil (jumlah tik kecil per bagian), titik [{v, teks, jenis}],
  //       segmen (pita bagian untuk ketuk), sorot [{lo, hi}], atas (ruang gelembung di atas garis)
  const WARNA_TITIK = {
    tanya: ['#FFC400', '#E0A800', '#1F2A44'], info: ['#FFFFFF', '#3A86FF', '#1F2A44'], pilih: ['#FFC400', '#E0A800', '#1F2A44'],
    benar: ['#2BB673', '#178A52', '#FFFFFF'], salah: ['#E04466', '#B8264A', '#FFFFFF'],
  };
  const LEBAR_G = 900, X0 = 45, X1 = 855;
  function gambarGaris(induk, opsi, y0) {
    const { lo, hi } = opsi, bagian = opsi.bagian || 10, d = opsi.d || 1;
    const atas = opsi.atas == null ? ((opsi.titik && opsi.titik.length) ? 66 : 14) : opsi.atas;
    const yG = y0 + atas + 26;
    const x = (v) => X0 + ((v - lo) / (hi - lo)) * (X1 - X0);
    const g = svgEl('g', {});
    induk.appendChild(g);
    const langkah = (hi - lo) / bagian;
    (opsi.sorot || []).forEach((s) => g.appendChild(svgEl('rect', { x: x(s.lo), y: yG - 34, width: x(s.hi) - x(s.lo), height: 68, rx: 8, fill: '#FFD98A', opacity: 0.75 })));
    if (opsi.segmen) {
      for (let i = 0; i < bagian; i++) g.appendChild(svgEl('rect', { x: x(lo + i * langkah) + 1, y: yG - 40, width: x(lo + (i + 1) * langkah) - x(lo + i * langkah) - 2, height: 100, rx: 12, fill: i % 2 ? '#FFEFC9' : '#FFF8E6', stroke: '#F0DFB8', 'stroke-width': 2, 'data-bagian': i }));
    }
    g.appendChild(svgEl('line', { x1: X0 - 14, y1: yG, x2: X1 + 14, y2: yG, stroke: '#1F2A44', 'stroke-width': 6, 'stroke-linecap': 'round' }));
    for (let i = 0; i <= bagian; i++) {
      const v = lo + i * langkah;
      g.appendChild(svgEl('line', { x1: x(v), y1: yG - 15, x2: x(v), y2: yG + 15, stroke: '#1F2A44', 'stroke-width': 3.5 }));
      if (opsi.labelSemua || i === 0 || i === bagian || (opsi.labelTiap && i % opsi.labelTiap === 0)) {
        const t = svgEl('text', { x: x(v), y: yG + 44, 'text-anchor': 'middle', 'font-size': opsi.labelKecil ? 19 : 22, 'font-weight': 700, fill: '#1F2A44', 'font-family': FONT });
        t.textContent = teksMil(v, d);
        g.appendChild(t);
      }
      if (opsi.kecil && i < bagian) {
        for (let j = 1; j < opsi.kecil; j++) {
          const vk = v + (langkah * j) / opsi.kecil;
          const tengah = opsi.kecil % 2 === 0 && j === opsi.kecil / 2;
          g.appendChild(svgEl('line', { x1: x(vk), y1: yG - (tengah ? 12 : 8), x2: x(vk), y2: yG + (tengah ? 12 : 8), stroke: '#1F2A44', 'stroke-width': tengah ? 2.5 : 1.6, opacity: 0.8 }));
        }
      }
    }
    (opsi.titik || []).forEach((p) => {
      const [isi, tepi, huruf] = WARNA_TITIK[p.jenis || 'info'];
      const px = x(p.v), w = Math.max(52, 15 * String(p.teks).length + 28), bx = Math.max(2, Math.min(LEBAR_G - w - 2, px - w / 2));
      g.appendChild(svgEl('line', { x1: px, y1: y0 + 42, x2: px, y2: yG, stroke: tepi, 'stroke-width': 3, 'stroke-dasharray': '4 4' }));
      g.appendChild(svgEl('circle', { cx: px, cy: yG, r: 10, fill: isi, stroke: tepi, 'stroke-width': 4 }));
      g.appendChild(svgEl('rect', { x: bx, y: y0 + 4, width: w, height: 38, rx: 19, fill: isi, stroke: tepi, 'stroke-width': 3 }));
      const t = svgEl('text', { x: bx + w / 2, y: y0 + 24, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 22, 'font-weight': 800, fill: huruf, 'font-family': FONT });
      t.textContent = p.teks;
      g.appendChild(t);
    });
    return { x, yG, tinggi: atas + 26 + 60, g };
  }
  function garisSvg(opsi, tinggi) {
    const svg = svgEl('svg', { viewBox: '0 0 ' + LEBAR_G + ' ' + (tinggi || 170), class: 'garis-desimal-svg' });
    const info = gambarGaris(svg, opsi, 0);
    svg.setAttribute('viewBox', '0 0 ' + LEBAR_G + ' ' + (tinggi || info.tinggi + 10));
    // ubah posisi klien -> nilai (mil) & indeks bagian
    info.kePosisi = (clientX) => { const r = svg.getBoundingClientRect(); return ((clientX - r.left) / r.width) * LEBAR_G; };
    info.keNilai = (clientX) => opsi.lo + ((info.kePosisi(clientX) - X0) / (X1 - X0)) * (opsi.hi - opsi.lo);
    return { svg, info };
  }

  // Beberapa garis bertingkat (zoom): rentang[i] = {lo, hi, d, titik, labelKecil}; bagian yang di-zoom disorot & disambung.
  function garisBertingkat(rentang) {
    const svg = svgEl('svg', { viewBox: '0 0 ' + LEBAR_G + ' 100', class: 'garis-desimal-svg' });
    let y = 0; const infos = [];
    rentang.forEach((r, i) => {
      const nxt = rentang[i + 1];
      const info = gambarGaris(svg, Object.assign({ bagian: 10, labelSemua: true, labelKecil: true, sorot: nxt ? [{ lo: nxt.lo, hi: nxt.hi }] : [] }, r), y);
      info.yAwal = y; infos.push(info);
      y += info.tinggi;
      if (nxt) {
        // sambungan zoom: dari bagian yang disorot ke garis berikutnya
        y += 10;
        const a = info.x(nxt.lo), b = info.x(nxt.hi);
        const atas2 = nxt.titik && nxt.titik.length ? 66 : 14, yAtas = info.yG + 52, yBawah = y + atas2 + 26 - 22;
        const x2 = (v) => X0 + ((v - nxt.lo) / (nxt.hi - nxt.lo)) * (X1 - X0);
        svg.insertBefore(svgEl('path', { d: 'M ' + a + ' ' + yAtas + ' L ' + x2(nxt.lo) + ' ' + yBawah + ' L ' + x2(nxt.hi) + ' ' + yBawah + ' L ' + b + ' ' + yAtas + ' Z',
          fill: '#FFD98A', opacity: 0.35, stroke: '#E0A800', 'stroke-width': 2, 'stroke-dasharray': '6 5' }), svg.firstChild);
      }
    });
    svg.setAttribute('viewBox', '0 0 ' + LEBAR_G + ' ' + y);
    return svg;
  }

  // Tabel nilai tempat: baris-baris desimal sejajar; nol tambahan (padding) diberi warna lain.
  // daftar [{x:{n,d}}], opsi: sorotKolom (0 = satuan, 1.. = angka di belakang koma)
  function tabelTempat(daftar, opsi) {
    opsi = opsi || {};
    const dm = Math.max(1, ...daftar.map((o) => o.d));
    const NAMA = ['Satuan', 'Persepuluhan', 'Perseratusan', 'Perseribuan'];
    let h = '<table class="tabel-tempat"><thead><tr><th></th><th>' + NAMA[0] + '</th><th></th>';
    for (let k = 1; k <= dm; k++) h += '<th class="' + (opsi.sorotKolom === k ? 'sorot' : '') + '">' + NAMA[k] + '</th>';
    h += '</tr></thead><tbody>';
    daftar.forEach((x) => {
      const bulat = Math.floor(x.n / P10[x.d]), pecah = String(x.n % P10[x.d]).padStart(x.d, '0');
      h += '<tr><td class="asli">' + teks(x) + '</td><td class="' + (opsi.sorotKolom === 0 ? 'sorot' : '') + '">' + bulat + '</td><td class="koma">,</td>';
      for (let k = 1; k <= dm; k++) h += '<td class="' + (k > x.d ? 'nol-tambah ' : '') + (opsi.sorotKolom === k ? 'sorot' : '') + '">' + (k <= x.d ? pecah[k - 1] : '0') + '</td>';
      h += '</tr>';
    });
    return h + '</tbody></table>';
  }
  // kolom pertama yang berbeda antara dua desimal (0 = satuan), atau -1 bila senilai
  function kolomBeda(a, b) {
    const dm = Math.max(a.d, b.d), ma = mil(a), mb = mil(b);
    if (Math.floor(ma / 1000) !== Math.floor(mb / 1000)) return 0;
    for (let k = 1; k <= dm; k++) if (Math.floor(ma / P10[3 - k]) % 10 !== Math.floor(mb / P10[3 - k]) % 10) return k;
    return -1;
  }

  root.Desimal = Object.assign({ kotakSeratus, pita, garisSvg, garisBertingkat, tabelTempat, kolomBeda, el, svgEl, LEBAR_G, X0, X1 }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
