// Mini game 🍬 Bagi Rata (Kelas 4 Bab 3): faktor.
// Soal 1-3: "N permen dibagi ke k piring, rata?" -> Rata / Ada sisa.
// Soal 4-5: "Ketuk semua faktor N" (chip angka).
// Semua jawaban dihitung oleh kode. Logika bisa dites di Node: tools/cek-bab3.js
(function (root) {
  // ---------- Logika (tanpa DOM) ----------
  const MAKS = { 1: 24, 2: 48, 3: 100 };
  const MIN = { 1: 6, 2: 10, 3: 24 };
  // banyak piring per tingkat (angka 6, 7, 8, 12 diulang supaya lebih sering muncul)
  const PIRING = {
    1: [2, 3, 4, 5, 6, 6],
    2: [3, 4, 5, 6, 6, 7, 7, 8, 8, 9],
    3: [4, 5, 6, 6, 7, 7, 8, 8, 9, 10, 12, 12],
  };
  const MAKS_PER_PIRING = 16; // supaya permen masih bisa digambar di piring
  const MAKS_CHIP = 16;
  const PENEKANAN = [6, 7, 8, 12];

  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function faktor(n) {
    const f = [];
    for (let d = 1; d <= n; d++) if (n % d === 0) f.push(d);
    return f;
  }
  // pasangan faktor: [[1, n], [2, n/2], ...] dengan a <= b
  function pasangan(n) {
    const p = [];
    for (let d = 1; d * d <= n; d++) if (n % d === 0) p.push([d, n / d]);
    return p;
  }
  const isPenekanan = (n) => PENEKANAN.some((a) => n % a === 0 && n > a);

  // Soal "rata?": piring k, hasil bagi q, sisa r. N = k*q + r.
  function soalRata(tingkat, mauRata, pakai) {
    for (let coba = 0; coba < 200; coba++) {
      const k = pilih(PIRING[tingkat]);
      const qMaks = Math.min(MAKS_PER_PIRING, Math.floor(MAKS[tingkat] / k));
      const qMin = Math.max(1, Math.ceil(MIN[tingkat] / k));
      if (qMaks < qMin) continue;
      const q = acak(Math.max(qMin, 2), qMaks);
      const r = mauRata ? 0 : acak(1, k - 1);
      const n = k * q + r;
      if (n > MAKS[tingkat] || n < MIN[tingkat]) continue;
      if (pakai && pakai.has(n + ':' + k)) continue;
      if (pakai) pakai.add(n + ':' + k);
      return { jenis: 'rata', n, k, q: Math.floor(n / k), sisa: n % k, rata: n % k === 0, tingkat };
    }
    throw new Error('soalRata gagal');
  }

  // calon N untuk "ketuk semua faktor": bukan prima (>= 4 faktor), dalam batas.
  // Hasil kali 6, 7, 8, 12 diberi bobot 3.
  function calonFaktor(tingkat) {
    const min = tingkat === 1 ? 8 : tingkat === 2 ? 18 : 40;
    const daftar = [];
    for (let n = min; n <= MAKS[tingkat]; n++) {
      if (faktor(n).length < 4) continue;
      const bobot = isPenekanan(n) ? 3 : 1;
      for (let i = 0; i < bobot; i++) daftar.push(n);
    }
    return daftar;
  }

  function soalFaktor(tingkat, pakai) {
    const calon = calonFaktor(tingkat).filter((n) => !pakai || !pakai.has(n));
    const n = pilih(calon.length ? calon : calonFaktor(tingkat));
    if (pakai) pakai.add(n);
    const f = faktor(n);
    let angka;
    if (n <= 12) {
      angka = [];
      for (let i = 1; i <= n; i++) angka.push(i);
    } else {
      const total = Math.min(MAKS_CHIP, Math.max(12, f.length + 4));
      const fs = new Set(f);
      const kecil = [], dekat = new Set();
      for (let d = 2; d <= Math.min(12, n - 1); d++) if (!fs.has(d)) kecil.push(d);
      f.filter((x) => x > 12 && x < n).forEach((x) => [x - 1, x + 1, x - 2, x + 2].forEach((y) => { if (y > 12 && y < n && !fs.has(y)) dekat.add(y); }));
      const pengecoh = [];
      const ambil = (arr) => { const a = kocok(arr).filter((x) => !pengecoh.includes(x)); if (a.length) pengecoh.push(a[0]); };
      while (f.length + pengecoh.length < total) {
        const sebelum = pengecoh.length;
        if (pengecoh.length % 2 === 0 || !dekat.size) ambil(kecil); else ambil([...dekat]);
        if (pengecoh.length === sebelum) { ambil(kecil.concat([...dekat])); }
        if (pengecoh.length === sebelum) break;
      }
      angka = f.concat(pengecoh).sort((a, b) => a - b);
    }
    return { jenis: 'faktor', n, angka, faktorList: f, tingkat };
  }

  function buatRonde(tingkat) {
    const pakai = new Set(), pakaiN = new Set();
    const pola = kocok([true, false, Math.random() < 0.5]);
    const soal = pola.map((r) => soalRata(tingkat, r, pakai));
    soal.push(soalFaktor(tingkat, pakaiN), soalFaktor(tingkat, pakaiN));
    return soal;
  }

  function soalMirip(soal, tingkat) {
    if (soal.jenis === 'rata') return soalRata(tingkat, soal.rata, new Set([soal.n + ':' + soal.k]));
    return soalFaktor(tingkat, new Set([soal.n]));
  }

  function periksaFaktor(soal, dipilih) {
    const set = new Set(dipilih);
    const salahPilih = soal.angka.filter((x) => set.has(x) && soal.n % x !== 0);
    const terlewat = soal.faktorList.filter((x) => !set.has(x));
    return { benar: !salahPilih.length && !terlewat.length, salahPilih, terlewat, dipilih: [...set] };
  }

  const logika = { faktor, pasangan, soalRata, soalFaktor, calonFaktor, buatRonde, soalMirip, periksaFaktor, isPenekanan, MAKS, MIN, PIRING, MAKS_PER_PIRING, MAKS_CHIP };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const WARNA = ['#FF6384', '#3A86FF', '#FFC400', '#2BB673', '#9B5DE5', '#FF8A3D'];
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };

  function permen(i) {
    const p = el('div', 'permen');
    p.style.background = WARNA[i % WARNA.length];
    return p;
  }

  // n permen dibagi satu per satu ke k piring; sisa dilingkari merah.
  function gambarPiring(n, k, wadah, opsi) {
    opsi = opsi || {};
    const q = Math.floor(n / k), sisa = n % k;
    const area = el('div', 'piring-area');
    wadah.appendChild(area);
    const W = Math.max(300, (area.clientWidth || 800) - 10);
    const perBaris = opsi.satuBaris ? k + (sisa ? 1 : 0) : Math.min(k + (sisa ? 1 : 0), 6);
    const D = Math.max(56, Math.min(opsi.maksD || 112, Math.floor((W - 12 * perBaris) / perBaris)));
    const kolom = Math.max(1, Math.ceil(Math.sqrt(Math.max(q, sisa, 1))));
    const titik = Math.max(6, Math.min(22, Math.floor((D * 0.66) / kolom) - 2));
    const jeda = Math.min(0.18, 2.2 / Math.max(1, q)); // seluruh pembagian selesai dalam ± 2 detik
    for (let j = 0; j < k; j++) {
      const piring = el('div', 'piring');
      piring.style.width = piring.style.height = D + 'px';
      const isi = el('div', 'piring-isi');
      isi.style.gridTemplateColumns = 'repeat(' + kolom + ', ' + titik + 'px)';
      for (let r = 0; r < q; r++) {
        const p = permen(r * k + j);
        p.style.width = p.style.height = titik + 'px';
        p.style.animationDelay = (0.3 + r * jeda + j * jeda / k) + 's';
        isi.appendChild(p);
      }
      piring.appendChild(isi);
      if (opsi.label !== false) piring.appendChild(el('div', 'piring-label', String(q)));
      area.appendChild(piring);
    }
    if (sisa) {
      const s = el('div', 'piring sisa-lingkar');
      s.style.width = s.style.height = D + 'px';
      const isi = el('div', 'piring-isi');
      isi.style.gridTemplateColumns = 'repeat(' + kolom + ', ' + titik + 'px)';
      for (let i = 0; i < sisa; i++) {
        const p = permen(q * k + i);
        p.style.width = p.style.height = titik + 'px';
        p.style.animationDelay = (0.4 + q * jeda) + 's';
        isi.appendChild(p);
      }
      s.appendChild(isi);
      s.appendChild(el('div', 'piring-label sisa', 'sisa ' + sisa));
      s.style.animationDelay = (0.5 + q * jeda) + 's';
      area.appendChild(s);
    }
    return area;
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'rata') {
      wadah.appendChild(el('div', 'soal-teks', '<b class="biru">' + soal.n + '</b> permen dibagi ke <b class="biru">' + soal.k + '</b> piring.<br>Bisa <b>rata</b>?'));
      const baris = el('div', 'piring-kosong');
      for (let j = 0; j < soal.k; j++) baris.appendChild(el('div', 'piring kecil'));
      wadah.appendChild(baris);
      const pil = el('div', 'pilihan');
      const ya = el('button', 'tombol ya', 'Rata');
      const tidak = el('button', 'tombol tidak', 'Ada sisa');
      ya.onclick = () => kirim({ pilih: true, benar: soal.rata === true });
      tidak.onclick = () => kirim({ pilih: false, benar: soal.rata === false });
      pil.append(ya, tidak);
      wadah.appendChild(pil);
      wadah.appendChild(el('div', 'ingat-kecil', 'Rata = semua piring dapat sama banyak, tidak ada sisa.'));
      return;
    }
    wadah.appendChild(el('div', 'soal-teks', 'Ketuk <b>semua</b> faktor dari <b class="biru">' + soal.n + '</b>'));
    const chips = el('div', 'chips');
    const dipilih = new Set();
    soal.angka.forEach((x) => {
      const c = el('button', 'chip', String(x));
      c.onclick = () => {
        if (dipilih.has(x)) { dipilih.delete(x); c.classList.remove('dipilih'); }
        else { dipilih.add(x); c.classList.add('dipilih'); }
        Suara.efek('pop');
      };
      chips.appendChild(c);
    });
    wadah.appendChild(chips);
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    cek.onclick = () => kirim(periksaFaktor(soal, [...dipilih]));
    wadah.appendChild(cek);
  }

  function teksBagi(n, k) {
    const q = Math.floor(n / k), s = n % k;
    if (!s) return n + ' : ' + k + ' = ' + q + ', <b>rata</b> tanpa sisa. Jadi <b>' + k + ' faktor dari ' + n + '</b>.';
    return n + ' : ' + k + ' = ' + q + ' <b>sisa ' + s + '</b>. Ada sisa, jadi ' + k + ' <b>bukan faktor</b> ' + n + '.';
  }
  const teksPasangan = (n) => 'Pasangan faktor ' + n + ': ' + pasangan(n).map(([a, b]) => a + ' × ' + b).join(', ') + '.';

  function pujian(soal) {
    if (soal.jenis === 'rata') return teksBagi(soal.n, soal.k).replace(/<[^>]+>/g, '');
    return teksPasangan(soal.n);
  }

  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'rata') {
      wadah.appendChild(el('div', 'kotak-teks', '<b>' + soal.n + '</b> permen dibagi satu-satu ke ' + soal.k + ' piring: ' + teksBagi(soal.n, soal.k)));
      gambarPiring(soal.n, soal.k, wadah);
      return;
    }
    const baris = el('div', 'baris-chip-alasan');
    const set = new Set(jawaban.dipilih);
    soal.angka.forEach((x) => {
      const fk = soal.n % x === 0;
      let k = 'chip redup';
      if (fk && set.has(x)) k = 'chip ok';
      else if (fk) k = 'chip terlewat';
      else if (set.has(x)) k = 'chip salah-pilih';
      baris.appendChild(el('div', k, String(x)));
    });
    wadah.appendChild(baris);
    const bagian = [];
    if (jawaban.salahPilih.length) bagian.push('Merah = bukan faktor (' + jawaban.salahPilih.join(', ') + ').');
    if (jawaban.terlewat.length) bagian.push('Garis oranye = faktor yang terlewat (' + jawaban.terlewat.join(', ') + ').');
    wadah.appendChild(el('div', 'kotak-teks', bagian.join(' ') + '<br>' + teksPasangan(soal.n)));
    // contoh dengan piring: salah pilih yang kecil, atau faktor terlewat (pakai pasangan yang kecil)
    let k = jawaban.salahPilih.find((x) => x <= 12);
    if (k == null && jawaban.terlewat.length) { const f = jawaban.terlewat[0]; k = Math.min(f, soal.n / f); }
    if (k == null && jawaban.salahPilih.length) {
      wadah.appendChild(el('div', 'kotak-teks', teksBagi(soal.n, jawaban.salahPilih[0])));
      return;
    }
    if (k == null) return;
    if (k === 1) { wadah.appendChild(el('div', 'kotak-teks', 'Ingat: <b>1</b> dan <b>' + soal.n + '</b> selalu faktor dari ' + soal.n + '.')); return; }
    if (k > 12) { wadah.appendChild(el('div', 'kotak-teks', teksBagi(soal.n, k))); return; }
    wadah.appendChild(el('div', 'kotak-teks', teksBagi(soal.n, k)));
    gambarPiring(soal.n, k, wadah, { satuBaris: true, maksD: 96 });
  }

  root.GameBagiRata = Object.assign({
    id: 'bagi-rata',
    tingkat: ['permen ≤ 24', 'permen ≤ 48', 'permen ≤ 100'],
    ingat: 'Kalau permen bisa dibagi rata tanpa sisa, banyak piringnya adalah faktor dari banyak permen.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
