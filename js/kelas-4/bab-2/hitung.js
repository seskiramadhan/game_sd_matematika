// Alat bersama Bab 2 (Perkalian & Pembagian sampai 100.000): format titik ribuan, angka acak dengan bobot 6/7/8/12,
// pembuat pilihan jawaban dengan pengecoh "kesalahan khas", tombol pilihan.
// Semua jawaban dihitung kode. Cek logika: node tools/cek-bab2.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;

  // ---------- Logika (tanpa DOM) ----------
  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // 2800 -> "2.800"

  // Angka yang lebih sering muncul (latihan tabel perkalian): 6, 7, 8, 12
  const FOKUS = [6, 7, 8, 12];
  // Pasangan faktor [a, b] dalam lo..hi: 70% soal memuat paling sedikit satu angka fokus, 30% soal tanpa angka fokus.
  function pasangFaktor(lo, hi) {
    const semua = []; for (let i = lo; i <= hi; i++) semua.push(i);
    const f = semua.filter((x) => FOKUS.includes(x)), bukan = semua.filter((x) => !FOKUS.includes(x));
    let a, b;
    if (f.length && bukan.length > 1 && Math.random() >= 0.7) { a = pilih(bukan); b = pilih(bukan); }
    else { a = pilih(f.length ? f : semua); b = pilih(semua); }
    return Math.random() < 0.5 ? [a, b] : [b, a];
  }
  const adaFokus = (a, b) => FOKUS.includes(a) || FOKUS.includes(b);
  const nolDepan = (n) => Number(String(n).replace(/0+$/, '')); // 2800 -> 28
  const banyakNol = (n) => String(n).length - String(n).replace(/0+$/, '').length;

  // Susun 4 pilihan: kunci + 3 pengecoh. grup = [{ s: 'sebab salah', v: [nilai...], w: true (wajib ikut) }, ...] (satu dari tiap grup dulu), cadangan = nilai pengisi.
  // Hasil: { opsi: [4 angka diacak], sebab: { nilai: 'teks' } }
  function buatOpsi(kunci, grup, cadangan, o) {
    o = o || {};
    const maks = o.maks == null ? 100000 : o.maks, min = o.min == null ? 1 : o.min, n = o.n || 4;
    const ok = (v) => Number.isInteger(v) && v >= min && v <= maks && v !== kunci;
    const pakai = new Map();
    const g = grup.map((x) => ({ s: x.s, w: !!x.w, v: kocok(x.v.filter(ok)) })).filter((x) => x.v.length);
    // grup bertanda w (wajib) selalu ikut; sisanya dipilih acak, satu nilai per grup
    for (const x of kocok(g.filter((y) => y.w)).concat(kocok(g.filter((y) => !y.w)))) { if (pakai.size >= n - 1) break; const v = x.v.find((y) => !pakai.has(y)); if (v !== undefined) pakai.set(v, x.s); }
    for (const x of g) for (const v of x.v) if (pakai.size < n - 1 && !pakai.has(v)) pakai.set(v, x.s);
    for (const v of kocok(cadangan || [])) if (pakai.size < n - 1 && ok(v) && !pakai.has(v)) pakai.set(v, '');
    if (pakai.size < n - 1) throw new Error('pengecoh kurang untuk ' + kunci);
    const sebab = {}; pakai.forEach((s, v) => { sebab[v] = s; });
    return { opsi: kocok([kunci].concat(Array.from(pakai.keys()))), sebab };
  }

  const logika = { acak, pilih, kocok, fmt, FOKUS, pasangFaktor, adaFokus, nolDepan, banyakNol, buatOpsi };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  // Baris tombol pilihan. daftar: [{ nilai, label }]; onPilih(nilai, tombol)
  function tombolOpsi(daftar, onPilih, kelas) {
    const w = el('div', 'b2-opsi ' + (kelas || ''));
    daftar.forEach((d) => {
      const b = el('button', 'tombol tombol-b2', d.label);
      b.onclick = () => onPilih(d.nilai, b);
      w.appendChild(b);
    });
    return w;
  }
  root.HitungB2 = Object.assign({ el, tombolOpsi }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
