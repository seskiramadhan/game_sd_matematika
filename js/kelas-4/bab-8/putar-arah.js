// Mini game 🧭 Putar Arah (Kelas 4 Bab 8).
// Soal 1-3 (tuju): Garuda menghadap arah X, perintah "putar Y° ke kanan/kiri" -> ketuk arah baru di mawar.
// Soal 4-5 (hitung): "dari A ke B putar kanan, berapa derajat?" -> pilih ganda.
// Tingkat 1: 4 arah (U/T/S/B), 90° & 180°, kanan saja · 2: 4 arah, 90/180/270°, kiri & kanan · 3: 8 arah, 45-315°.
// Indeks arah: 0=U 1=TL 2=T 3=TG 4=S 5=BD 6=B 7=BL (searah jarum jam). Tidak ada float di kunci.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('./sudut.js') : root.Sudut;
  const { acak, pilih, kocok, mod, ARAH, NAMA_ARAH, putarArah, derajatPutar, teksPutar, teksArah } = S;

  // ---------- Logika (tanpa DOM) ----------
  const ARAH_T12 = [0, 2, 4, 6];
  const ARAH_T3  = [0, 1, 2, 3, 4, 5, 6, 7];
  const DEG_T1   = [90, 180];
  const DEG_T2   = [90, 180, 270];
  const DEG_T3   = [45, 90, 135, 180, 225, 270, 315];

  function arahSet(t) { return t < 3 ? ARAH_T12 : ARAH_T3; }
  function degSet(t)  { return t === 1 ? DEG_T1 : t === 2 ? DEG_T2 : DEG_T3; }

  function soalPutar(tingkat) {
    const set = arahSet(tingkat);
    const degs = degSet(tingkat);
    const kanan = tingkat === 1 ? true : Math.random() < 0.5;
    for (;;) {
      const dari = pilih(set);
      const d = pilih(degs);
      const ke = putarArah(dari, d, kanan);
      if (set.includes(ke) && ke !== dari) {
        return { jenis: 'putar', tingkat, dari, d, kanan, ke, kunci: ke, kode: 'p' + dari + d + (kanan ? 'R' : 'L') };
      }
    }
  }

  function soalBerapa(tingkat) {
    const set = arahSet(tingkat);
    const degs = degSet(tingkat);
    for (;;) {
      const dari = pilih(set);
      const ke = pilih(set.filter((x) => x !== dari));
      const kanan = tingkat === 1 ? true : Math.random() < 0.5;
      const d = derajatPutar(dari, ke, kanan);
      if (!degs.includes(d)) continue;
      const lain = kocok(degs.filter((x) => x !== d)).slice(0, 3);
      const opsi = kocok([d, ...lain].slice(0, 4));
      return { jenis: 'berapa', tingkat, dari, ke, kanan, d, kunci: d, opsi, kode: 'q' + dari + ke + (kanan ? 'R' : 'L') };
    }
  }

  function tigaPutar(tingkat) {
    for (;;) {
      const soal = [soalPutar(tingkat), soalPutar(tingkat), soalPutar(tingkat)];
      if (new Set(soal.map((s) => s.ke)).size > 1 && new Set(soal.map((s) => s.kode)).size === 3) return soal;
    }
  }

  function buatRonde(tingkat) {
    for (;;) {
      const soal = tigaPutar(tingkat);
      const h1 = soalBerapa(tingkat), h2 = soalBerapa(tingkat);
      if (h1.kode === h2.kode) continue;
      const ronde = [...soal, h1, h2];
      if (new Set(ronde.map((s) => s.kode)).size === 5) return ronde;
    }
  }

  function soalMirip(soal, tingkat) {
    for (;;) {
      const s = soal.jenis === 'berapa' ? soalBerapa(tingkat) : soalPutar(tingkat);
      if (s.kode !== soal.kode) return s;
    }
  }

  const periksaPutar  = (soal, i) => ({ benar: i === soal.kunci, pilih: i });
  const periksaBerapa = (soal, d) => ({ benar: d === soal.kunci, pilih: d });

  const logika = { buatRonde, soalPutar, soalBerapa, soalMirip, periksaPutar, periksaBerapa };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, mawar } = S;
  const KECIL = () => window.innerHeight < 790;

  function tampilkan(soal, wadah, kirim) {
    const ukuran = KECIL() ? 300 : 350;
    const set = arahSet(soal.tingkat);
    if (soal.jenis === 'putar') {
      const arahTeks = teksPutar(soal.d) + ' ke ' + (soal.kanan ? 'kanan' : 'kiri');
      wadah.appendChild(el('div', 'soal-teks soal-sedang',
        'Garuda menghadap <b>' + teksArah(soal.dari) + '</b>, lalu <b>' + arahTeks + '</b>.<br>Sekarang menghadap ke mana?'));
      const m = mawar({ ukuran, semua: set, aktif: true, bearing: soal.dari * 45,
        onKetuk: (i) => kirim(periksaPutar(soal, i)) });
      m.tandai(soal.dari, 'mulai');
      wadah.appendChild(m.el);
      return;
    }
    // soal hitung
    const arahK = soal.kanan ? 'kanan' : 'kiri';
    wadah.appendChild(el('div', 'soal-teks soal-sedang',
      'Garuda putar ke <b>' + arahK + '</b> dari <b>' + teksArah(soal.dari) + '</b> ke <b>' + teksArah(soal.ke) + '</b>.<br>Berapa derajat?'));
    const m = mawar({ ukuran, semua: set, aktif: false, bearing: soal.dari * 45 });
    m.tandai(soal.dari, 'mulai');
    m.tandai(soal.ke, 'tujuan');
    wadah.appendChild(m.el);
    const opsi = el('div', 'des-opsi des-opsi-baris');
    soal.opsi.forEach((v) => {
      const b = el('button', 'tombol tombol-des', v + '\xb0');
      b.onclick = () => kirim(periksaBerapa(soal, v));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function pujian(soal) {
    if (soal.jenis === 'putar') {
      return { html: teksArah(soal.dari) + ' + ' + teksPutar(soal.d) + ' ke ' + (soal.kanan ? 'kanan' : 'kiri') + ' → <b>' + teksArah(soal.ke) + '</b>' };
    }
    return { html: teksArah(soal.dari) + ' → ' + teksArah(soal.ke) + ' (ke ' + (soal.kanan ? 'kanan' : 'kiri') + ') = <b>' + soal.d + '\xb0</b>' };
  }

  function alasan(soal, jawaban, wadah) {
    const ukuran = KECIL() ? 280 : 320;
    const set = arahSet(soal.tingkat);
    const m = mawar({ ukuran, semua: set, aktif: false, bearing: soal.dari * 45 });
    m.tandai(soal.dari, 'mulai');
    m.tandai(soal.ke, 'benar-arah');
    if (soal.jenis === 'putar' && jawaban.pilih !== soal.ke) m.tandai(jawaban.pilih, 'salah-arah');
    wadah.appendChild(m.el);
    const arahK = soal.kanan ? 'kanan' : 'kiri';
    const langkah = el('div', 'putar-langkah');
    langkah.innerHTML =
      '<div class="langkah ada">Mulai: <b>' + teksArah(soal.dari) + '</b></div>' +
      '<div class="langkah ada">Putar ke ' + arahK + ': <b>' + teksPutar(soal.d) + '</b> = ' + soal.d + '\xf7' + '45 = ' + (soal.d / 45) + ' langkah</div>' +
      '<div class="langkah ada">Sampai: <b>' + teksArah(soal.ke) + '</b></div>';
    wadah.appendChild(langkah);
    setTimeout(() => { if (m.setPanah) m.setPanah(soal.ke * 45); }, 400);
  }

  root.GamePutarArah = Object.assign({
    id: 'putar-arah',
    tingkat: ['4 arah, \xbc & \xbd putaran', '4 arah, kiri & kanan', '8 arah, 45\xb0 – 315\xb0'],
    ingat: '\xbc putaran = 90\xb0, \xbd = 180\xb0, \xbe = 270\xb0. Kanan = searah jarum jam. 8 arah: U → TL → T → TG → S → BD → B → BL.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
