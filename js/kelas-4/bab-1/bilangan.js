// Alat bersama Bab 1 (Bilangan Cacah sampai 100.000): format titik ribuan Indonesia, angka -> kata,
// pengecoh angka (nol di tengah, tukar angka), nilai tempat, pembulatan, tabel nilai tempat, blok, garis bilangan.
// Semua bilangan adalah bilangan bulat biasa. Cek logika: node tools/cek-bab1.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;

  // ---------- Logika (tanpa DOM) ----------
  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // 62408 -> "62.408" (titik ribuan, tidak pernah koma)
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // ---- angka -> kata Bahasa Indonesia ----
  const SATUAN = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  function kataDuaAngka(n) { // 1..99
    if (n < 10) return SATUAN[n];
    if (n === 10) return 'sepuluh';
    if (n === 11) return 'sebelas';
    if (n < 20) return SATUAN[n - 10] + ' belas';
    const p = Math.floor(n / 10), s = n % 10;
    return SATUAN[p] + ' puluh' + (s ? ' ' + SATUAN[s] : '');
  }
  function kataTiga(n) { // 1..999
    const r = Math.floor(n / 100), sisa = n % 100;
    const bag = [];
    if (r) bag.push(r === 1 ? 'seratus' : SATUAN[r] + ' ratus');
    if (sisa) bag.push(kataDuaAngka(sisa));
    return bag.join(' ');
  }
  function kata(n) {
    if (n === 0) return 'nol';
    const rb = Math.floor(n / 1000), sisa = n % 1000;
    const bag = [];
    if (rb === 1) bag.push('seribu'); else if (rb > 1) bag.push(kataTiga(rb) + ' ribu');
    if (sisa) bag.push(kataTiga(sisa));
    return bag.join(' ');
  }

  // ---- nilai tempat ----
  const TEMPAT = [{ nama: 'satuan', n: 1 }, { nama: 'puluhan', n: 10 }, { nama: 'ratusan', n: 100 }, { nama: 'ribuan', n: 1000 }, { nama: 'puluh ribuan', n: 10000 }, { nama: 'ratus ribuan', n: 100000 }];
  const digitDi = (n, k) => Math.floor(n / TEMPAT[k].n) % 10; // k = 0 satuan, 1 puluhan, ...
  const banyakAngka = (n) => String(n).length;

  // pembulatan: p = 10, 100, 1000 (5 ke atas naik)
  const bulatkan = (n, p) => Math.floor((n + p / 2) / p) * p;
  // pembanding independen untuk cek (lewat teks digit, bukan rumus yang sama)
  const bulatkanTeks = (n, p) => {
    const s = String(n), k = String(p).length - 1; // jumlah nol
    const depan = s.length > k ? Number(s.slice(0, s.length - k)) : 0;
    const penentu = s.length >= k ? Number(s[s.length - k]) : 0;
    return (penentu >= 5 ? depan + 1 : depan) * p;
  };

  // Pengecoh untuk bilangan 'kunci' dalam rentang 1..batas. Prioritas: salah nol, geser, tukar angka, ubah satu angka.
  function pengecohAngka(kunci, batas, ekstra) {
    const s = String(kunci), grup = { nol: [], geser: [], tukar: [], ubah: [] };
    const tambah = (g, v) => { if (Number.isInteger(v) && v > 0 && v <= batas && v !== kunci) grup[g].push(v); };
    for (let i = 1; i < s.length; i++) if (s[i] === '0') {
      tambah('nol', Number(s.slice(0, i) + s.slice(i + 1)));            // 30.015 -> 3.015
      if (i + 1 < s.length && s[i + 1] !== '0') tambah('nol', Number(s.slice(0, i) + s[i + 1] + '0' + s.slice(i + 2))); // 30.015 -> 30.105
    }
    (ekstra || []).forEach((v) => tambah('geser', v));
    tambah('geser', kunci * 10);
    for (const q of [10, 100, 1000]) if (kunci % q === 0) tambah('geser', kunci / q);
    for (let i = 0; i + 1 < s.length; i++) if (s[i] !== s[i + 1] && !(i === 0 && s[i + 1] === '0')) tambah('tukar', Number(s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2)));
    for (let i = 0; i < s.length; i++) for (const dd of [-1, 1]) { const d = Number(s[i]) + dd; if (d >= 0 && d <= 9 && !(i === 0 && d === 0)) tambah('ubah', Number(s.slice(0, i) + d + s.slice(i + 1))); }
    const hasil = [], ada = new Set([kunci]);
    const ambil = (g) => { for (const v of kocok(grup[g])) if (!ada.has(v)) { ada.add(v); hasil.push(v); return true; } return false; };
    ambil('nol'); ambil('geser'); ambil('tukar'); ambil('ubah');
    for (const g of ['nol', 'geser', 'tukar', 'ubah']) while (hasil.length < 3 && ambil(g));
    return hasil.slice(0, 3);
  }

  const logika = { acak, pilih, kocok, fmt, kata, kataTiga, TEMPAT, digitDi, banyakAngka, bulatkan, bulatkanTeks, pengecohAngka };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  const FONT = 'Poppins, sans-serif';
  const NAMA_PENDEK = ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan', 'Puluh ribuan', 'Ratus ribuan'];
  const WARNA_TEMPAT = ['#FF8A3D', '#FFC400', '#2BB673', '#3A86FF', '#9B5DE5', '#E04466'];

  // Tabel nilai tempat. daftar: bilangan; opsi: kolom (jumlah kolom, default sesuai terpanjang), sorotKolom (indeks dari KIRI yang disorot),
  // samaDepan (jumlah kolom paling kiri yang sama -> hijau)
  function tabelTempat(daftar, opsi) {
    opsi = opsi || {};
    const kol = opsi.kolom || Math.max(...daftar.map(banyakAngka));
    let h = '<table class="bil-tabel"><thead><tr><th></th>';
    for (let c = 0; c < kol; c++) h += '<th class="' + (opsi.sorotKolom === c ? 'sorot' : '') + '">' + NAMA_PENDEK[kol - 1 - c] + '</th>';
    h += '</tr></thead><tbody>';
    daftar.forEach((x) => {
      const s = String(x).padStart(kol, ' ');
      h += '<tr><td class="asli">' + fmt(x) + '</td>';
      for (let c = 0; c < kol; c++) {
        const ch = s[c];
        let kelas = '';
        if (ch === ' ') kelas = 'kosong';
        else if (opsi.sorotKolom === c) kelas = 'sorot';
        else if (opsi.samaDepan && c < opsi.samaDepan) kelas = 'sama';
        else if (ch === '0') kelas = 'nol';
        h += '<td class="' + kelas + '">' + (ch === ' ' ? '' : ch) + '</td>';
      }
      h += '</tr>';
    });
    return h + '</tbody></table>';
  }

  // Blok nilai tempat: satu kolom per tempat (dari kiri), tiap kolom menumpuk 'banyak' kotak kecil.
  // hitung: { 0: satuan, 1: puluhan, ... }
  function blokTempat(hitung, kolom, opsi) {
    opsi = opsi || {};
    const W = 150, ukuran = opsi.ukuran || 22, G = 3, tinggiMax = 3 * (ukuran + G) + 78;
    const svg = svgEl('svg', { viewBox: '0 0 ' + (W * kolom) + ' ' + tinggiMax, class: 'bil-blok-svg' });
    svg.style.width = Math.min(W * kolom, opsi.lebar || 750) + 'px';
    for (let c = 0; c < kolom; c++) {
      const k = kolom - 1 - c, banyak = hitung[k] || 0, x0 = c * W;
      svg.appendChild(svgEl('rect', { x: x0 + 8, y: 4, width: W - 16, height: tinggiMax - 8, rx: 14, fill: '#FFFFFF', stroke: '#E4D8C0', 'stroke-width': 2 }));
      for (let i = 0; i < banyak; i++) {
        const cols = 3, r = Math.floor(i / cols), q = i % cols, bw = (W - 40 - (cols - 1) * G) / cols;
        svg.appendChild(svgEl('rect', { x: x0 + 20 + q * (bw + G), y: tinggiMax - 64 - (r + 1) * (ukuran + G), width: bw, height: ukuran, rx: 5, fill: WARNA_TEMPAT[k], stroke: 'rgba(0,0,0,.15)', 'stroke-width': 1.5 }));
      }
      if (!banyak) { const t = svgEl('text', { x: x0 + W / 2, y: tinggiMax - 80, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#C9BFAA', 'font-family': FONT }); t.textContent = '0'; svg.appendChild(t); }
      const lab = svgEl('text', { x: x0 + W / 2, y: tinggiMax - 36, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#1F2A44', 'font-family': FONT }); lab.textContent = fmt(TEMPAT[k].n); svg.appendChild(lab);
      const lab2 = svgEl('text', { x: x0 + W / 2, y: tinggiMax - 14, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 600, fill: '#6B7388', 'font-family': FONT }); lab2.textContent = TEMPAT[k].nama; svg.appendChild(lab2);
    }
    return svg;
  }

  // Garis bilangan pembulatan: lo, hi (dua kelipatan terdekat), titik n, titik tengah ditandai.
  function garisBulat(n, lo, hi) {
    const W = 900, X0 = 90, X1 = 810, yG = 96;
    const x = (v) => X0 + ((v - lo) / (hi - lo)) * (X1 - X0);
    const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' 184', class: 'bil-garis-svg' });
    const tengah = (lo + hi) / 2;
    svg.appendChild(svgEl('rect', { x: x(lo), y: yG - 26, width: x(tengah) - x(lo), height: 52, rx: 8, fill: '#FFE3C8', opacity: 0.85 }));
    svg.appendChild(svgEl('rect', { x: x(tengah), y: yG - 26, width: x(hi) - x(tengah), height: 52, rx: 8, fill: '#D6F2E3', opacity: 0.95 }));
    svg.appendChild(svgEl('line', { x1: X0 - 30, y1: yG, x2: X1 + 30, y2: yG, stroke: '#1F2A44', 'stroke-width': 6, 'stroke-linecap': 'round' }));
    const tik = (v, teksV, warna) => {
      svg.appendChild(svgEl('line', { x1: x(v), y1: yG - 18, x2: x(v), y2: yG + 18, stroke: warna || '#1F2A44', 'stroke-width': 5 }));
      const t = svgEl('text', { x: x(v), y: yG + 50, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 800, fill: warna || '#1F2A44', 'font-family': FONT }); t.textContent = teksV; svg.appendChild(t);
    };
    tik(lo, fmt(lo)); tik(hi, fmt(hi)); tik(tengah, fmt(tengah), '#E04466');
    const tm = svgEl('text', { x: x(tengah), y: yG + 76, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: '#E04466', 'font-family': FONT }); tm.textContent = 'titik tengah'; svg.appendChild(tm);
    const px = x(n);
    svg.appendChild(svgEl('circle', { cx: px, cy: yG, r: 11, fill: '#FFC400', stroke: '#E0A800', 'stroke-width': 4 }));
    const w = Math.max(96, 14 * fmt(n).length + 30), bx = Math.max(4, Math.min(W - w - 4, px - w / 2));
    svg.appendChild(svgEl('line', { x1: px, y1: 52, x2: px, y2: yG - 11, stroke: '#E0A800', 'stroke-width': 3, 'stroke-dasharray': '4 4' }));
    svg.appendChild(svgEl('rect', { x: bx, y: 14, width: w, height: 38, rx: 19, fill: '#FFC400', stroke: '#E0A800', 'stroke-width': 3 }));
    const tn = svgEl('text', { x: bx + w / 2, y: 34, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 22, 'font-weight': 800, fill: '#1F2A44', 'font-family': FONT }); tn.textContent = fmt(n); svg.appendChild(tn);
    return svg;
  }

  root.Bilangan = Object.assign({ tabelTempat, blokTempat, garisBulat, el, svgEl, NAMA_PENDEK, WARNA_TEMPAT }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
