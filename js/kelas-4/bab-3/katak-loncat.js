// Mini game 🐸 Katak Loncat (Kelas 4 Bab 3): kelipatan.
// Katak loncat n di garis bilangan: 0, n, 2n, 3n, ...
// Soal 1-3: ketuk tempat katak mendarat berikutnya. Soal 4-5: lanjutkan 2 loncatan lagi.
// Semua jawaban dihitung oleh kode. Logika bisa dites di Node: tools/cek-bab3.js
(function (root) {
  // ---------- Logika (tanpa DOM) ----------
  // besar loncatan per tingkat (tingkat 3: 7 dan 12 lebih sering)
  const LONCAT = {
    1: [2, 3, 4, 5],
    2: [6, 7, 8, 9, 6, 7, 8],
    3: [7, 7, 7, 8, 12, 12, 12],
  };
  // banyak loncatan yang sudah dilakukan katak sebelum soal (m)
  const SUDAH = { 1: [2, 5], 2: [2, 7], 3: [2, 8] };
  const MAKS_RENTANG = 30; // garis bilangan paling banyak 31 angka supaya nyaman diketuk

  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // jenis 'satu': ketuk 1 tempat; 'dua': lanjutkan 2 loncatan
  function buatSoal(tingkat, jenis, n, pakai) {
    n = n || pilih(LONCAT[tingkat]);
    const [mMin, mMaks] = SUDAH[tingkat];
    let m;
    for (let coba = 0; coba < 30; coba++) { m = acak(mMin, mMaks); if (!pakai || !pakai.has(n + ':' + m)) break; }
    if (pakai) pakai.add(n + ':' + m);
    const banyak = jenis === 'dua' ? 2 : 1;
    const target = [];
    for (let i = 1; i <= banyak; i++) target.push((m + i) * n);
    const katak = m * n;
    const mendarat = [];
    for (let i = 0; i <= m; i++) mendarat.push(i * n);
    // potongan garis bilangan: loncatan terakhir (bila muat) + loncatan yang ditanya + sedikit lebih
    const a = acak(1, 2);
    const b = n >= 10 ? acak(1, 3) : acak(2, 4);
    const lihatSebelumnya = banyak === 1 || 3 * n + a + b <= MAKS_RENTANG;
    let L = Math.max(0, (lihatSebelumnya ? (m - 1) * n : m * n) - a);
    const R = target[target.length - 1] + b;
    if (R - L > MAKS_RENTANG) L = R - MAKS_RENTANG;
    return { jenis, n, m, katak, target, mendarat, L, R, tingkat };
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    // soal 1-3: besar loncatan sebisa mungkin berbeda
    const ns = kocok([...new Set(LONCAT[tingkat])]);
    const soal = [0, 1, 2].map((i) => buatSoal(tingkat, 'satu', tingkat === 3 && i < 2 ? pilih(LONCAT[3]) : ns[i % ns.length], pakai));
    soal.push(buatSoal(tingkat, 'dua', null, pakai), buatSoal(tingkat, 'dua', null, pakai));
    return soal;
  }

  // soal mirip: besar loncatan sama (tabel perkalian yang sama), posisi lain
  function soalMirip(soal, tingkat) {
    return buatSoal(tingkat, soal.jenis, soal.n, new Set([soal.n + ':' + soal.m]));
  }

  function periksa(soal, dipilih) {
    const p = dipilih.slice().sort((x, y) => x - y);
    const benar = p.length === soal.target.length && p.every((v, i) => v === soal.target[i]);
    const salah = p.filter((v) => !soal.target.includes(v));
    return { benar, dipilih: p, salah };
  }

  const logika = { buatSoal, buatRonde, soalMirip, periksa, LONCAT, SUDAH, MAKS_RENTANG };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Garis bilangan L..R. Mengembalikan alat kecil untuk menandai & melompatkan katak.
  function buatGaris(wadah, soal, opsi) {
    opsi = opsi || {};
    const H = opsi.tinggi || 190;
    const g = el('div', 'garis' + (opsi.interaktif ? ' interaktif' : ''));
    g.style.height = H + 'px';
    wadah.appendChild(g);
    const W = g.clientWidth || 900;
    const pad = 22;
    const step = (W - 2 * pad) / (soal.R - soal.L);
    const yGaris = H - 52;
    const x = (v) => pad + (v - soal.L) * step;
    const digit = String(soal.R).length;
    const fs = Math.max(11, Math.min(19, Math.floor(step / (digit * 0.6))));

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'garis-svg'); svg.setAttribute('width', W); svg.setAttribute('height', H);
    g.appendChild(svg);
    const busur = (a, b, kelas) => {
      const p = document.createElementNS(SVGNS, 'path');
      const h = Math.min(H - 80, Math.max(30, step * soal.n * 0.45));
      p.setAttribute('d', 'M ' + x(a) + ' ' + (yGaris - 6) + ' Q ' + (x(a) + x(b)) / 2 + ' ' + (yGaris - 6 - 2 * h) + ' ' + x(b) + ' ' + (yGaris - 6));
      p.setAttribute('class', 'busur ' + (kelas || ''));
      svg.appendChild(p);
      return p;
    };
    for (let i = 1; i < soal.mendarat.length; i++) {
      if (soal.mendarat[i] > soal.L) busur(soal.mendarat[i - 1], soal.mendarat[i]);
    }
    g.appendChild(Object.assign(el('div', 'garis-batang'), { style: 'top:' + (yGaris - 3) + 'px' }));
    const tik = {};
    for (let v = soal.L; v <= soal.R; v++) {
      const t = el('div', 'tik' + (soal.mendarat.includes(v) ? ' mendarat' : ''));
      t.style.left = x(v) + 'px'; t.style.top = (yGaris - 10) + 'px';
      const label = el('div', 'tik-angka', String(v));
      label.style.fontSize = fs + 'px';
      t.appendChild(label);
      g.appendChild(t);
      tik[v] = t;
    }
    const katak = el('div', 'katak', '🐸');
    katak.style.left = x(soal.katak) + 'px';
    katak.style.top = (yGaris - 50) + 'px';
    g.appendChild(katak);

    let posisi = soal.katak;
    function lompat(ke, selesai, kelas) {
      const dari = posisi; posisi = ke;
      const h = Math.min(H - 90, Math.max(30, step * Math.abs(ke - dari) * 0.45));
      const x0 = x(dari), x1 = x(ke);
      busur(dari, ke, kelas);
      const anim = katak.animate([
        { left: x0 + 'px', transform: 'translateY(0)' },
        { left: (x0 + x1) / 2 + 'px', transform: 'translateY(' + (-h) + 'px) scale(1.15)' },
        { left: x1 + 'px', transform: 'translateY(0)' },
      ], { duration: 550, easing: 'ease-in-out' });
      katak.style.left = x1 + 'px';
      const akhir = () => { if (selesai) selesai(); };
      anim.onfinish = akhir;
    }
    function tandai(v, kelas, teks) {
      if (!tik[v]) return;
      tik[v].classList.add(kelas);
      if (teks) tik[v].appendChild(el('div', 'tik-tanda', teks));
    }
    return { el: g, x, step, tik, lompat, tandai, nilaiDari(clientX) {
      const r = g.getBoundingClientRect();
      const v = Math.round(soal.L + (clientX - r.left - pad) / step);
      return Math.max(soal.L, Math.min(soal.R, v));
    } };
  }

  function teksJejak(soal, isiTanya) {
    const d = soal.mendarat;
    const awal = d.length > 4 ? ['…'].concat(d.slice(-4)) : d.slice();
    const tanya = isiTanya || soal.target.map(() => '?');
    return awal.concat(tanya.map((t) => '<b class="tanya">' + t + '</b>')).join(' → ');
  }

  function tampilkan(soal, wadah, kirim) {
    const satu = soal.jenis === 'satu';
    wadah.appendChild(el('div', 'soal-teks katak-teks', satu
      ? 'Katak loncat <b class="biru">' + soal.n + '</b>-<b class="biru">' + soal.n + '</b>.<br>Ketuk tempat <b>mendarat berikutnya</b>!'
      : 'Katak loncat <b class="biru">' + soal.n + '</b>-<b class="biru">' + soal.n + '</b>.<br>Lanjutkan <b>2 loncatan</b> lagi!'));
    wadah.appendChild(el('div', 'jejak', teksJejak(soal)));
    const luar = el('div', 'garis-luar');
    wadah.appendChild(luar);
    const garis = buatGaris(luar, soal, { interaktif: true });
    const bawah = el('div', 'baris-tombol katak-bawah');
    const info = el('div', 'pilihan-info', satu ? 'Ketuk angka di garis.' : 'Ketuk 2 angka di garis.');
    const tombol = el('button', 'tombol tombol-utama', '🐸 Loncat!');
    tombol.disabled = true;
    bawah.append(info, tombol);
    wadah.appendChild(bawah);

    let dipilih = [];
    let kunci = false;
    const perlu = soal.target.length;
    function gambarPilihan() {
      Object.values(garis.tik).forEach((t) => { t.classList.remove('dipilih'); const b = t.querySelector('.tik-tanda'); if (b) b.remove(); });
      dipilih.forEach((v, i) => garis.tandai(v, 'dipilih', perlu > 1 ? String(i + 1) : '?'));
      info.innerHTML = dipilih.length ? 'Pilihanmu: <b>' + dipilih.join(' dan ') + '</b>' : (satu ? 'Ketuk angka di garis.' : 'Ketuk 2 angka di garis.');
      tombol.disabled = dipilih.length !== perlu;
    }
    garis.el.addEventListener('click', (e) => {
      if (kunci) return;
      const v = garis.nilaiDari(e.clientX);
      if (dipilih.includes(v)) dipilih = dipilih.filter((x) => x !== v);
      else if (dipilih.length < perlu) dipilih.push(v);
      else dipilih[dipilih.length - 1] = v;
      dipilih.sort((a, b) => a - b);
      Suara.efek('pop');
      gambarPilihan();
    });
    tombol.onclick = () => {
      if (kunci || dipilih.length !== perlu) return;
      kunci = true; tombol.disabled = true;
      const hasil = periksa(soal, dipilih);
      let i = 0;
      const berikut = () => {
        if (i >= hasil.dipilih.length) { setTimeout(() => kirim(hasil), 250); return; }
        const v = hasil.dipilih[i++];
        Suara.efek('pop');
        garis.lompat(v, berikut, soal.target.includes(v) ? 'benar' : 'salah');
      };
      berikut();
    };
  }

  function barisTabel(soal) {
    const akhir = soal.m + soal.target.length;
    const baris = el('div', 'tabel-baris');
    for (let k = Math.max(1, akhir - 4); k <= akhir; k++) {
      const v = k * soal.n;
      baris.appendChild(el('div', 'tabel-sel' + (soal.target.includes(v) ? ' sorot' : ''), k + ' × ' + soal.n + ' = ' + v));
    }
    return baris;
  }

  function pujian(soal) {
    return 'Kelipatan ' + soal.n + ': … ' + soal.mendarat.slice(-2).concat(soal.target).join(', ') + ' …';
  }

  function alasan(soal, jawaban, wadah) {
    let langkah = soal.katak, teks = [];
    soal.target.forEach((t) => { teks.push(langkah + ' + ' + soal.n + ' = <b>' + t + '</b>'); langkah = t; });
    wadah.appendChild(el('div', 'kotak-teks', 'Loncat ' + soal.n + ' artinya <b>tambah ' + soal.n + '</b>: ' + teks.join(', ') + '. Semua tempat mendarat adalah <b>kelipatan ' + soal.n + '</b>.'));
    const garis = buatGaris(wadah, soal, { tinggi: 150 });
    jawaban.salah.forEach((v) => garis.tandai(v, 'salah', '✗'));
    let i = 0;
    const berikut = () => {
      if (i >= soal.target.length) return;
      const v = soal.target[i++];
      garis.tandai(v, 'benar-tik');
      setTimeout(() => garis.lompat(v, berikut, 'benar'), 150);
    };
    setTimeout(berikut, 500);
    wadah.appendChild(barisTabel(soal));
  }

  root.GameKatakLoncat = Object.assign({
    id: 'katak-loncat',
    tingkat: ['loncat 2 – 5', 'loncat 6 – 9', 'loncat 7, 8, 12'],
    ingat: 'Katak loncat 7-7 mendarat di 7, 14, 21, 28, … Itulah kelipatan 7: tiap loncatan tambah 7.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
