// Alat bersama Bab 4 (Pecahan): hitung (FPB, KPK, sederhanakan, bandingkan) + gambar (pecahan bertumpuk, pizza/kue, batang).
// Pecahan ditulis sebagai [pembilang, penyebut]. Bagian logika bisa di-require di Node (tools/cek-bab4.js).
(function (root) {
  // ---------- Logika ----------
  function fpb(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
  const kpk = (a, b) => (a / fpb(a, b)) * b;
  const sederhana = (p) => { const g = fpb(p[0], p[1]); return [p[0] / g, p[1] / g]; };
  // -1 bila p < q, 0 bila senilai, 1 bila p > q (perkalian silang, tanpa desimal)
  const bandingkan = (p, q) => Math.sign(p[0] * q[1] - q[0] * p[1]);
  const senilai = (p, q) => bandingkan(p, q) === 0;
  const sama = (p, q) => p[0] === q[0] && p[1] === q[1];
  const teks = (p) => p[0] + '/' + p[1];
  // faktor prima suatu bilangan (tanpa ulang)
  function faktorPrima(n) {
    const f = [];
    for (let d = 2; d <= n; d++) if (n % d === 0) { f.push(d); while (n % d === 0) n /= d; }
    return f;
  }

  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // pilih dengan bobot: daftar [[nilai, bobot], ...]
  function pilihBobot(daftar) {
    const total = daftar.reduce((s, x) => s + x[1], 0);
    let r = Math.random() * total;
    for (const [v, w] of daftar) { r -= w; if (r < 0) return v; }
    return daftar[daftar.length - 1][0];
  }
  const PENEKANAN = [6, 7, 8, 12];
  // susunan kue persegi panjang untuk penyebut besar: baris x kolom paling "persegi" (kolom >= baris)
  function susunanKue(b) {
    let r = 1;
    for (let d = 1; d * d <= b; d++) if (b % d === 0) r = d;
    return [r, b / r];
  }

  const logika = { fpb, kpk, sederhana, bandingkan, senilai, sama, teks, faktorPrima, acak, pilih, kocok, pilihBobot, susunanKue, PENEKANAN };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };

  // pecahan bertumpuk: pembilang di atas garis, penyebut di bawah
  const html = (p, kelas) => '<span class="pec' + (kelas ? ' ' + kelas : '') + '"><span class="pec-a">' + p[0] + '</span><span class="pec-b">' + p[1] + '</span></span>';

  // Pizza (b <= 12) atau kue persegi panjang (b > 12). diwarnai: Set indeks potongan.
  // opsi: ukuran (px), nomor (tulis nomor 1..b, yang diwarnai lebih dulu), urutNomor (array indeks sesuai urutan nomor)
  function potongan(b, diwarnai, opsi) {
    opsi = opsi || {};
    const U = opsi.ukuran || 260;
    const warna = opsi.warna || '#FF6B4A';
    const isi = (i) => (diwarnai.has(i) ? warna : '#FFE8B0');
    const nomorKe = {};
    if (opsi.nomor) {
      const m = opsi.mulai || 0, kunci = (i) => (i - m + b) % b; // nomor berurutan mulai dari potongan 'mulai'
      const urut = [...diwarnai].sort((x, y) => kunci(x) - kunci(y)).concat([...Array(b).keys()].filter((i) => !diwarnai.has(i)).sort((x, y) => kunci(x) - kunci(y)));
      urut.forEach((i, k) => { nomorKe[i] = k + 1; });
    }
    const huruf = (x, y, i, ukuranHuruf) => {
      if (!opsi.nomor) return null;
      const t = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': ukuranHuruf, 'font-weight': 800,
        fill: diwarnai.has(i) ? '#fff' : '#8A7A5C', 'pointer-events': 'none', 'font-family': 'Poppins, sans-serif' });
      t.textContent = nomorKe[i];
      return t;
    };
    if (b <= 12) {
      const svg = svgEl('svg', { viewBox: '0 0 200 200', width: U, height: U, class: 'gambar-pizza' });
      svg.appendChild(svgEl('circle', { cx: 100, cy: 100, r: 97, fill: '#D9902F' }));
      const r = 86, c = 100;
      for (let i = 0; i < b; i++) {
        const a0 = -Math.PI / 2 + (2 * Math.PI * i) / b, a1 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / b;
        const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0), x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
        const d = 'M ' + c + ' ' + c + ' L ' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A ' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' Z';
        const g = svgEl('g', { 'data-i': i, class: 'potong' });
        g.appendChild(svgEl('path', { d, fill: isi(i), stroke: '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
        // topping kecil di potongan yang diwarnai
        if (diwarnai.has(i) && !opsi.nomor) {
          const am = (a0 + a1) / 2;
          g.appendChild(svgEl('circle', { cx: c + r * 0.62 * Math.cos(am), cy: c + r * 0.62 * Math.sin(am), r: Math.max(4, Math.min(10, 60 / b)), fill: '#C83A2A', 'pointer-events': 'none' }));
        }
        const am = (a0 + a1) / 2;
        const t = huruf(c + r * 0.68 * Math.cos(am), c + r * 0.68 * Math.sin(am), i, b > 8 ? 15 : 20);
        if (t) g.appendChild(t);
        svg.appendChild(g);
      }
      return svg;
    }
    const [R, K] = susunanKue(b);
    const s = 200 / K, H = s * R;
    const svg = svgEl('svg', { viewBox: '-6 -6 212 ' + (H + 12), width: U, height: (U * (H + 12)) / 212, class: 'gambar-kue' });
    svg.appendChild(svgEl('rect', { x: -5, y: -5, width: 210, height: H + 10, rx: 10, fill: '#B5763A' }));
    for (let i = 0; i < b; i++) {
      const x = (i % K) * s, y = Math.floor(i / K) * s;
      const g = svgEl('g', { 'data-i': i, class: 'potong' });
      g.appendChild(svgEl('rect', { x: x + 1.5, y: y + 1.5, width: s - 3, height: s - 3, rx: 4, fill: isi(i) }));
      const t = huruf(x + s / 2, y + s / 2, i, Math.min(18, s * 0.45));
      if (t) g.appendChild(t);
      svg.appendChild(g);
    }
    return svg;
  }

  // Batang pecahan / cokelat: b potongan sama panjang dalam lebar tetap, a potongan pertama diwarnai.
  // opsi: lebar, tinggi, warna, kosong, garis, cokelat (gaya batang cokelat)
  function batang(p, opsi) {
    opsi = opsi || {};
    const [a, b] = p;
    const W = opsi.lebar || 520, T = opsi.tinggi || 44;
    const warna = opsi.warna || (opsi.cokelat ? '#7B4A2D' : '#3A86FF');
    const kosong = opsi.kosong || (opsi.cokelat ? '#EADBC8' : '#E9E2D2');
    const svg = svgEl('svg', { viewBox: '0 0 ' + (W + 4) + ' ' + (T + 4), width: W + 4, height: T + 4, class: 'gambar-batang' });
    const w = W / b;
    svg.appendChild(svgEl('rect', { x: 1, y: 1, width: W + 2, height: T + 2, rx: 8, fill: opsi.cokelat ? '#5C351F' : '#C9BFAA' }));
    for (let i = 0; i < b; i++) {
      svg.appendChild(svgEl('rect', { x: 2 + i * w + 1, y: 3, width: Math.max(1, w - 2), height: T - 2, rx: Math.min(6, w / 4), fill: i < a ? warna : kosong }));
      if (opsi.cokelat && i < a && w > 14) svg.appendChild(svgEl('rect', { x: 2 + i * w + 4, y: 6, width: Math.max(1, w - 8), height: 5, rx: 2, fill: 'rgba(255,255,255,.18)' }));
    }
    return svg;
  }

  // baris "label + batang": dipakai di layar alasan
  function barisBatang(p, opsi) {
    opsi = opsi || {};
    const r = el('div', 'baris-batang' + (opsi.kelas ? ' ' + opsi.kelas : ''));
    r.appendChild(el('div', 'label-batang', html(p) + (opsi.label ? '<small>' + opsi.label + '</small>' : '')));
    r.appendChild(batang(p, opsi));
    return r;
  }

  root.Pecahan = Object.assign({ html, potongan, batang, barisBatang, el }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
