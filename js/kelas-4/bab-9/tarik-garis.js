// Mini game ✏️ Tarik Garis (Kelas 4 Bab 9).
// Kertas bertitik 10x6. Soal 1-3: garis AB + titik C -> ketuk satu titik supaya garis dari C SEJAJAR AB.
// Soal 4-5: sama, tetapi garis dari C harus TEGAK LURUS AB. Semua titik di garis yang benar diterima.
// Tingkat 1: langkah mendatar/tegak (3,0), (0,2) · 2: miring 1:1 (2,2) · 3: miring 2:1 dan 3:1 (2,1), (3,1).
// Kunci: sejajar <=> perkalian silang = 0, tegak lurus <=> perkalian titik = 0 (vektor bulat, tanpa float). Cek: node tools/cek-bab9.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('./garis.js') : root.Garis;
  const { acak, pilih, kurang, silang, sama, dalamKertas, titikKunci, teksLangkah } = G;

  // ---------- Logika (tanpa DOM) ----------
  const VEKTOR = {
    1: [[2, 0], [3, 0], [4, 0], [0, 2], [0, 3]],
    2: [[2, 2], [3, 3], [2, -2], [3, -3]],
    3: [[2, 1], [1, 2], [2, -1], [1, -2], [3, 1], [1, 3], [3, -1], [1, -3]],
  };
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const sederhana = (v) => { const g = gcd(v[0], v[1]); return [v[0] / g, v[1] / g]; };
  // arah garis tegak lurus: v diputar 90 derajat searah jarum jam (x, y) -> (y, -x); contoh (2,1) -> (1,-2)
  const putar = (v) => [v[1], -v[0]];

  function soalTarik(tingkat, rel) {
    for (let i = 0; i < 20000; i++) {
      let v = pilih(VEKTOR[tingkat]);
      if (Math.random() < 0.5) v = [-v[0], -v[1]];
      const A = [acak(0, 9), acak(0, 5)], B = [A[0] + v[0], A[1] + v[1]];
      if (!dalamKertas(B)) continue;
      const C = [acak(0, 9), acak(0, 5)];
      if (sama(C, A) || sama(C, B) || silang(kurang(C, A), v) === 0) continue; // C tidak di garis AB
      const kunci = titikKunci(v, C, rel);
      if (kunci.length < 1) continue;
      return { jenis: 'tarik', tingkat, rel, A, B, C, v, kunci, kode: 't' + rel + A + B + C };
    }
    throw new Error('gagal membuat soal tarik ' + tingkat + rel);
  }
  function buatRonde(tingkat) {
    for (;;) {
      const r = [soalTarik(tingkat, 'sejajar'), soalTarik(tingkat, 'sejajar'), soalTarik(tingkat, 'sejajar'), soalTarik(tingkat, 'tegak'), soalTarik(tingkat, 'tegak')];
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) { const s = soalTarik(tingkat, soal.rel); if (s.kode !== soal.kode) return s; }
    return soal;
  }
  const periksa = (soal, P) => ({ benar: soal.kunci.some((q) => sama(q, P)), P });

  const logika = { VEKTOR, sederhana, putar, soalTarik, buatRonde, soalMirip, periksa };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, kertasSvg } = G;
  const KECIL = () => window.innerHeight < 790;
  const TEKS_REL = { sejajar: 'sejajar', tegak: 'tegak lurus' };

  function tampilkan(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang',
      'Tarik garis dari <b class="merah">C</b> yang <b>' + TEKS_REL[soal.rel] + '</b> dengan garis AB.<br>Ketuk satu titik yang dilalui garis itu.'));
    const tempat = el('div', 'sudut-tempat');
    let panjang = false, sudah = false, hasil = null;
    const sp = 64;
    const gambar = () => {
      tempat.innerHTML = '';
      const o = { A: soal.A, B: soal.B, C: soal.C, sp, perpanjangAB: panjang };
      if (hasil) { o.tarik = { P: hasil.P, warna: hasil.benar ? '#2BB673' : '#E04466' }; }
      else o.ketuk = (P) => {
        if (sudah) return;
        const h = periksa(soal, P);
        if (sama(P, soal.C)) { Suara.efek('boing'); return; } // mengetuk C sendiri bukan jawaban
        sudah = true; hasil = h; gambar(); kirim(h);
      };
      tempat.appendChild(kertasSvg(o));
    };
    gambar();
    const baris = el('div', 'tg-baris');
    const bantu = el('button', 'tombol tombol-bantu', '↔ Perpanjang AB');
    bantu.onclick = () => { panjang = !panjang; bantu.classList.toggle('dipilih', panjang); Suara.efek('pop'); gambar(); };
    const info = el('div', 'kertas-info', 'Langkah AB: <b>' + teksLangkah(soal.v) + '</b>');
    baris.append(info, bantu);
    wadah.append(tempat, baris);
  }

  function pujian(soal, jawaban) {
    const w = sederhana(kurang(jawaban.P, soal.C));
    return { html: 'Dari C: ' + teksLangkah(w) + (soal.rel === 'sejajar' ? ' = arah yang sama dengan AB → <b>sejajar</b> (∥)' : ' = AB yang diputar siku-siku → <b>tegak lurus</b> (⊥)') };
  }

  function alasan(soal, jawaban, wadah) {
    const { A, B, C, v } = soal;
    const arahBenar = soal.rel === 'sejajar' ? v : putar(v);
    const P = [C[0] + arahBenar[0], C[1] + arahBenar[1]];
    const o = { A, B, C, sp: KECIL() ? 40 : 46, perpanjangAB: true, tarik: { P, warna: '#2BB673' }, kunciTampil: soal.kunci, pilihanSalah: jawaban.P };
    if (soal.rel === 'tegak') {
      // titik potong garis AB dengan garis dari C (hanya untuk gambar pojok; bukan kunci)
      const w = arahBenar, t = silang(kurang(C, A), w) / silang(v, w);
      const X = [A[0] + t * v[0], A[1] + t * v[1]];
      const nv = Math.hypot(v[0], v[1]), nw = Math.hypot(w[0], w[1]);
      o.pojok = { X, e1: [v[0] / nv, v[1] / nv], e2: [w[0] / nw, w[1] / nw] };
    }
    const baris = el('div', 'alasan-baris');
    baris.appendChild(kertasSvg(o));
    const pv = sederhana(v), pb = sederhana(arahBenar), pp = sederhana(kurang(jawaban.P, C));
    let t = 'Langkah AB: <b>' + teksLangkah(v) + '</b>.<br>';
    if (soal.rel === 'sejajar') t += 'Garis sejajar punya langkah yang <b>sama</b>. Dari C: <b>' + teksLangkah(pb) + '</b> berulang (titik hijau).';
    else t += 'Garis tegak lurus punya langkah yang <b>diputar</b> (angkanya ditukar, satu arah dibalik): dari C <b>' + teksLangkah(pb) + '</b> berulang (titik hijau). Pojok 90° (oranye) pas.';
    t += '<br><small>Kamu memilih titik merah: dari C ' + teksLangkah(pp) + '.</small>';
    baris.appendChild(el('div', 'kotak-teks', t));
    wadah.appendChild(baris);
  }

  root.GameTarikGaris = Object.assign({
    id: 'tarik-garis',
    tingkat: ['langkah mendatar/tegak', 'miring 1:1', 'miring 2:1 dan 3:1'],
    ingat: 'Sejajar: langkahnya sama dengan AB. Tegak lurus: langkahnya diputar (2 kanan 1 atas menjadi 1 kanan 2 bawah).',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
