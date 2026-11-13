// Alat bersama Bab 7 (Persentase): format Indonesia (koma desimal, % menempel), hitung dengan bilangan bulat,
// bentuk persen / pecahan / desimal, pengecoh, gambar pita bagian sama.
// Persen disimpan sebagai bilangan bulat 0-100. Nilai persen yang tidak bulat (3,7% / 0,37%) ditulis "mp" =
// per-sepuluh-ribu (hundredths of a percent): 37% = 3700, 3,7% = 370, 0,37% = 37. Tidak ada floating point.
// Cek logika: node tools/cek-bab7.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const D = modul ? require('../bab-6/desimal.js') : root.Desimal;
  const { des, teks: teksDes, minimal, acak, pilih, kocok } = D;

  // ---------- Logika (tanpa DOM) ----------
  const fpb = (a, b) => (b ? fpb(b, a % b) : a);
  // mp (per-sepuluh-ribu) -> teks: 3700 -> "37%", 370 -> "3,7%", 37 -> "0,37%"
  function teksMp(m) {
    const bulat = Math.floor(m / 100), sisa = m % 100;
    if (!sisa) return bulat + '%';
    const s = String(sisa).padStart(2, '0').replace(/0$/, '');
    return bulat + ',' + s + '%';
  }
  const teksPersen = (p) => p + '%';
  // pecahan paling sederhana dari p/100
  const pecahanPersen = (p) => { const g = fpb(p, 100); return [p / g, 100 / g]; };
  // desimal dari p persen: 50 -> 0,5 ; 5 -> 0,05 ; 100 -> 1
  const desimalPersen = (p) => (p === 100 ? des(1, 0) : minimal(p * 10));
  const jmlBagian = (p) => 100 / fpb(p, 100); // pita dipotong sama besar: tiap bagian = fpb(p,100)%
  const bagianTerwarna = (p) => p / fpb(p, 100);

  // bentuk: { j: 'p'|'f'|'d', ... }; nilainya sebagai pecahan [pembilang, penyebut] untuk perbandingan (bilangan bulat)
  const bentukPersen = (m, salah) => ({ j: 'p', m, salah });
  const bentukPecahan = (a, b, salah) => ({ j: 'f', a, b, salah });
  const bentukDesimal = (x, salah) => Object.assign({ j: 'd' }, x, { salah });
  function nilai(x) {
    if (x.j === 'p') return [x.m, 10000];
    if (x.j === 'f') return [x.a, x.b];
    return [D.mil(x), 1000];
  }
  const senilai = (x, y) => { const a = nilai(x), b = nilai(y); return a[0] * b[1] === b[0] * a[1]; };
  function teksBentuk(x) {
    if (x.j === 'p') return teksMp(x.m);
    if (x.j === 'f') return x.a + '/' + x.b;
    return teksDes(x);
  }
  const bentukDariPersen = (j, p) => (j === 'p' ? bentukPersen(p * 100) : j === 'f' ? bentukPecahan(...pecahanPersen(p)) : bentukDesimal(desimalPersen(p)));

  // pilih sampai 'jumlah' pengecoh dari kandidat: tidak senilai dengan kunci / satu sama lain, tidak kembar teks
  function pilihBentuk(kunci, kandidat, jumlah) {
    const dipakai = [kunci], hasil = [];
    for (const c of kandidat) {
      if (hasil.length >= jumlah) break;
      if (!c) continue;
      if (c.j === 'p' && (c.m <= 0 || c.m > 10000)) continue;
      if (c.j === 'f' && (c.a <= 0 || c.b <= 0 || c.a > c.b * 2 || c.b > 100)) continue;
      if (c.j === 'd' && (c.n <= 0 || c.d > 3 || c.d < 1 || (c.d === 1 && c.n % 10 === 0) || D.mil(c) > 3000)) continue;
      if (dipakai.some((x) => senilai(x, c) || teksBentuk(x) === teksBentuk(c))) continue;
      dipakai.push(c); hasil.push(c);
    }
    return hasil;
  }

  // pengecoh persen untuk nilai asli p% (jebakan: 0,5 vs 5%; 37% vs 3,7% / 0,37% / 63%)
  function pengecohPersen(p, tak) {
    const c = [];
    if (tak) c.push(bentukPersen(p * 100, 'berwarna')); // untuk soal "tidak berwarna": persen yang berwarna
    c.push(bentukPersen(p * 10, 'persepuluh'), bentukPersen(p, 'perseratus'));
    if (!tak) c.push(bentukPersen((100 - p) * 100, 'sisa'));
    c.push(bentukPersen((p + 10) * 100, 'dekat'), bentukPersen((p - 10) * 100, 'dekat'), bentukPersen((p + 1) * 100, 'dekat'), bentukPersen((p - 1) * 100, 'dekat'),
      bentukPersen((p + 5) * 100, 'dekat'), bentukPersen((p - 5) * 100, 'dekat'), bentukPersen(5000, 'dekat'), bentukPersen(9900, 'dekat'));
    return c;
  }
  // pengecoh desimal untuk p%: 5% -> 0,5 (salah) ; 35% -> 3,5 / 0,035
  function pengecohDesimal(p) {
    return [
      minimal(p * 100, 'kali10'), minimal(p, 'bagi10'), minimal((100 - p) * 10, 'sisa'),
      minimal(p * 10 + 100, 'dekat'), minimal(p * 10 - 100, 'dekat'), minimal(p * 10 + 50, 'dekat'), minimal(p * 10 - 50, 'dekat'), minimal(p * 10 + 10, 'dekat'),
    ].filter((x) => x.n > 0).map((x) => Object.assign({ j: 'd' }, x));
  }
  function pengecohPecahan(p) {
    const [a, b] = pecahanPersen(p);
    return [bentukPecahan(a, p, 'terbalik'), bentukPecahan(b - a, b, 'sisa'), bentukPecahan(a, b * 2, 'dekat'), bentukPecahan(a + 1, b, 'dekat'),
      bentukPecahan(a, 10, 'dekat'), bentukPecahan(a, b + 1, 'dekat'), bentukPecahan(a, 5, 'dekat')];
  }
  const pengecohTujuan = (j, p) => (j === 'p' ? pengecohPersen(p) : j === 'f' ? pengecohPecahan(p) : pengecohDesimal(p));
  // pilihan ganda "tukar": kunci + 3 pengecoh, diacak
  function opsiTukar(ke, p) {
    const kunci = bentukDariPersen(ke, p);
    const salah = pilihBentuk(kunci, pengecohTujuan(ke, p), 3);
    return salah.length === 3 ? { kunci, opsi: kocok([kunci].concat(salah)) } : null;
  }

  // pilihan bilangan (pembilang, hasil persen dari ...): kunci + 3 pengecoh bilangan bulat
  function opsiBilangan(kunci, kandidat) {
    const hasil = [];
    for (const c of kandidat) {
      if (hasil.length >= 3) break;
      if (!(c.v > 0) || c.v === kunci || hasil.some((x) => x.v === c.v)) continue;
      hasil.push(c);
    }
    return hasil.length === 3 ? kocok([{ v: kunci }].concat(hasil)) : null;
  }

  // kolom penuh + sisa kotak (10x10), seperti Bab 6
  const kolomSisa = (n) => ({ kolom: Math.floor(n / 10), sisa: n % 10 });
  // kelipatan terkecil banyak agar p% dari banyak itu bulat
  const langkahBanyak = (p) => 100 / fpb(p, 100);
  const persenDari = (p, banyak) => (p * banyak) / 100; // dipakai hanya bila p*banyak habis dibagi 100
  // angka dengan titik ribuan: 20000 -> "20.000"
  const ribuan = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const logika = { fpb, teksMp, teksPersen, pecahanPersen, desimalPersen, jmlBagian, bagianTerwarna, bentukPersen, bentukPecahan, bentukDesimal,
    nilai, senilai, teksBentuk, bentukDariPersen, pilihBentuk, pengecohPersen, pengecohDesimal, pengecohPecahan, opsiTukar, opsiBilangan,
    kolomSisa, langkahBanyak, persenDari, ribuan, acak, pilih, kocok, D };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  // Pita n bagian sama besar, k bagian pertama berwarna
  function pitaN(n, k, lebar, tinggi, warna) {
    const W = lebar, T = tinggi, s = W / n;
    const svg = svgEl('svg', { viewBox: '-3 -3 ' + (W + 6) + ' ' + (T + 6), width: W + 6, height: T + 6, class: 'gambar-pita' });
    svg.appendChild(svgEl('rect', { x: -2, y: -2, width: W + 4, height: T + 4, rx: 10, fill: '#C9BFAA' }));
    for (let i = 0; i < n; i++) svg.appendChild(svgEl('rect', { x: i * s, y: 0, width: s, height: T, stroke: '#C9BFAA', 'stroke-width': 2, fill: i < k ? warna : '#FFFFFF' }));
    return svg;
  }
  // html sebuah bentuk (pecahan bertumpuk memakai Pecahan.html)
  function htmlBentuk(x, kelas) {
    if (x.j === 'f') return root.Pecahan.html([x.a, x.b], kelas);
    return teksBentuk(x);
  }
  root.Persen = Object.assign({ pitaN, htmlBentuk, el, svgEl }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
