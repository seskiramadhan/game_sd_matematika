// Mini game 🔍 Baca Busur (Kelas 4 Bab 8).
// Soal 1-3: busur SVG 2 skala + sudut, kaki kedua menunjuk 2 angka -> pilih besar sudut.
// Soal 4-5: bentuk sudut: putar kaki (tombol ◀ ▶ ±STEP/±1°) sampai = target, lalu ✔.
// Tingkat 1: kelipatan 10°, sisi R · 2: kelipatan 5°, sisi R atau L · 3: sembarang 1°, busur diputar (rho acak).
// Semua jawaban bilangan bulat. Cek logika: node tools/cek-bab8.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('./sudut.js') : root.Sudut;
  const { acak, pilih, kocok, jenisSudut, busur } = S;

  // ---------- Logika (tanpa DOM) ----------
  const STEP = { 1: 10, 2: 5, 3: 1 };
  const KAND = {
    1: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
    2: (() => { const a = []; for (let i = 10; i <= 170; i += 5) a.push(i); return a; })(),
    3: (() => { const a = []; for (let i = 5; i <= 175; i++) a.push(i); return a; })(),
  };
  const JENIS = (d) => (d < 90 ? 'lancip' : d === 90 ? 'siku' : 'tumpul');

  function soalBaca(tingkat, jenis) {
    const pool = jenis ? KAND[tingkat].filter((d) => JENIS(d) === jenis) : KAND[tingkat];
    const s = pilih(pool.length ? pool : KAND[tingkat]);
    const sisi = tingkat === 1 ? 'R' : pilih(['R', 'L']);
    const rho = tingkat === 3 ? acak(-40, 40) : 0;
    const b = busur(rho, sisi, s);
    const lain = 180 - s; // pengecoh skala lain (sama dengan s bila s=90)
    const ekstra = kocok(KAND[tingkat].filter((x) => x !== s && x !== lain));
    const basis = lain !== s ? [s, lain] : [s];
    const opsi = kocok([...basis, ...ekstra].slice(0, 4));
    return { jenis: 'baca', tingkat, s, sisi, rho, b, kunci: s, opsi, kode: 'b' + s + sisi + rho };
  }

  function soalBuat(tingkat) {
    const s = pilih(KAND[tingkat]);
    const sisi = tingkat === 1 ? 'R' : pilih(['R', 'L']);
    const rho = tingkat === 3 ? acak(-40, 40) : 0;
    return { jenis: 'buat', tingkat, s, sisi, rho, step: STEP[tingkat], kunci: s, kode: 'u' + s + sisi + rho };
  }

  function tigaJenis(tingkat) {
    for (;;) {
      const soal = [soalBaca(tingkat, 'lancip'), soalBaca(tingkat, 'siku'), soalBaca(tingkat, 'tumpul')];
      const kocok3 = kocok(soal);
      if (new Set(kocok3.map((x) => x.kode)).size === 3) return kocok3;
    }
  }

  function buatRonde(tingkat) {
    for (;;) {
      const soal = tigaJenis(tingkat);
      const b1 = soalBuat(tingkat), b2 = soalBuat(tingkat);
      if (b1.kode === b2.kode) continue;
      const ronde = [...soal, b1, b2];
      if (new Set(ronde.map((s) => s.kode)).size === 5) return ronde;
    }
  }

  function soalMirip(soal, tingkat) {
    for (;;) {
      const s = soal.jenis === 'baca' ? soalBaca(tingkat) : soalBuat(tingkat);
      if (s.kode !== soal.kode) return s;
    }
  }

  const periksaBaca = (soal, pilihan) => ({ benar: pilihan === soal.kunci, pilih: pilihan });
  const periksaBuat = (soal, jawab)   => ({ benar: jawab === soal.kunci,   pilih: jawab });

  const logika = { STEP, KAND, buatRonde, soalBaca, soalBuat, soalMirip, periksaBaca, periksaBuat };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, busurSvg } = S;
  const KECIL = () => window.innerHeight < 790;

  function tampilkan(soal, wadah, kirim) {
    const ukuran = KECIL() ? 340 : 400;
    if (soal.jenis !== 'buat') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Sudut merah besarnya berapa?'));
      const wrap = el('div', 'sudut-tempat'); wrap.style.justifyContent = 'center';
      wrap.appendChild(busurSvg({ b: soal.b, ukuran }));
      wadah.appendChild(wrap);
      const j = jenisSudut(soal.s);
      wadah.appendChild(el('div', 'ingat-kecil',
        'Sudut ini ' + (j === 'siku' ? 'pas 90°' : j === 'lancip' ? 'lancip (< 90°)' : 'tumpul (> 90°)') +
        '. Pakai skala yang mulai dari 0 di kaki hitam.'));
      const opsi = el('div', 'des-opsi des-opsi-baris tiga');
      soal.opsi.forEach((v) => {
        const b = el('button', 'tombol tombol-des', v + '°');
        b.onclick = () => kirim(periksaBaca(soal, v));
        opsi.appendChild(b);
      });
      wadah.appendChild(opsi);
      return;
    }
    // soal buat: putar kaki
    wadah.appendChild(el('div', 'soal-teks soal-sedang',
      'Buat sudut <b class="merah">' + soal.s + '°</b> dengan memutar kaki merah.'));
    const step = soal.step;
    let sekarang = soal.sisi === 'R'
      ? (soal.s + step <= 179 ? soal.s + step : soal.s - step)
      : (soal.s - step >= 1 ? soal.s - step : soal.s + step);
    sekarang = Math.max(1, Math.min(179, sekarang));
    const bWrap = el('div', 'sudut-tempat'); bWrap.style.justifyContent = 'center';
    const gambarBusur = () => {
      bWrap.innerHTML = '';
      bWrap.appendChild(busurSvg({ b: busur(soal.rho, soal.sisi, sekarang), ukuran }));
    };
    gambarBusur();
    wadah.appendChild(bWrap);
    const tunjuk = el('div', 'ingat-kecil', sekarang + '°');
    const geser = (d) => {
      sekarang = Math.max(1, Math.min(179, sekarang + d));
      tunjuk.textContent = sekarang + '°';
      gambarBusur();
    };
    const baris = el('div', 'putar-baris');
    const bBL = el('button', 'tombol tombol-des tombol-putar', '◀◀ ' + step + '°'); bBL.onclick = () => geser(-step);
    const b1L = el('button', 'tombol tombol-des tombol-putar', '◀ 1°');           b1L.onclick = () => geser(-1);
    const b1R = el('button', 'tombol tombol-des tombol-putar', '1° ▶');           b1R.onclick = () => geser(1);
    const bBR = el('button', 'tombol tombol-des tombol-putar', step + '° ▶▶');    bBR.onclick = () => geser(step);
    const cek = el('button', 'tombol tombol-utama', '✔ Cek');
    cek.onclick = () => kirim(periksaBuat(soal, sekarang));
    baris.append(bBL, b1L, tunjuk, b1R, bBR);
    wadah.append(baris, cek);
  }

  function pujian(soal) {
    return { html: 'Sudut ' + soal.s + '\xb0 — ' +
      (soal.sisi === 'R' ? 'skala <b class="biru-t2">dalam (biru)</b>' : 'skala <b class="oranye-t2">luar (oranye)</b>') +
      ' mulai dari 0.' };
  }

  function alasan(soal, jawaban, wadah) {
    const ukuran = KECIL() ? 320 : 380;
    const bWrap = el('div', 'sudut-tempat'); bWrap.style.justifyContent = 'center';
    const b = soal.jenis === 'baca' ? soal.b : busur(soal.rho, soal.sisi, soal.s);
    bWrap.appendChild(busurSvg({ b, sorot: true, ukuran }));
    wadah.appendChild(bWrap);
    const j = jenisSudut(soal.s);
    const kata = 'Tebak dulu: lancip atau tumpul? Sudut ' + soal.s + '\xb0 adalah <b>' +
      (j === 'lancip' ? 'lancip (< 90\xb0)' : j === 'tumpul' ? 'tumpul (> 90\xb0)' : 'siku-siku (90\xb0)') +
      '</b>.<br>Skala yang mulai dari 0 di kaki hitam: <b class="' +
      (soal.sisi === 'R' ? 'biru-t2">dalam (biru)' : 'oranye-t2">luar (oranye)') +
      '</b>. Angka ' + soal.s + '\xb0 disorot hijau.' +
      (soal.jenis !== 'buat' ? '<br><small>Kamu memilih ' + jawaban.pilih + '\xb0.</small>' : '');
    wadah.appendChild(el('div', 'kotak-teks', kata));
  }

  root.GameBacaBusur = Object.assign({
    id: 'baca-busur',
    tingkat: ['kelipatan 10\xb0', 'kelipatan 5\xb0, kiri/kanan', 'sembarang 1\xb0, busur diputar'],
    ingat: 'Cari skala yang mulai dari 0 di kaki hitam (pertama). Baca angka yang ditunjuk kaki merah di skala itu.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
