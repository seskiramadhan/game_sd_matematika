// Mini game 📏 Garis Desimal (Kelas 4 Bab 6): letak desimal di garis bilangan.
// Soal 1-3: "Ketuk letak 0,37": garis di-zoom bertahap (0-1 dibagi 10, lalu 10 lagi), lalu ketuk titiknya.
// Soal 4-5: garis dengan 3 titik, pilih desimal untuk titik bertanda "?".
// Tingkat 1: 0-1 persepuluhan · 2: 0-1 perseratusan · 3: 0-3 perseratusan.
// Nilai dihitung dalam "mil" (perseribuan, bilangan bulat). Cek logika: node tools/cek-bab6.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const D = modul ? require('./desimal.js') : root.Desimal;
  const { des, teks, minimal, lit, senilai, teksMil, pilihPengecoh, acak, pilih, kocok } = D;

  // ---------- Logika (tanpa DOM) ----------
  const BATAS = { 1: 1000, 2: 1000, 3: 3000 };      // ujung kanan garis (mil)
  const SELANG = { 1: 200, 2: 130, 3: 300 };         // jarak minimal antar titik (supaya label tidak bertumpuk)
  const dari = (m, d) => D.dariMil(m, d);

  // nilai yang diketuk: t1 persepuluhan (0,1..0,9); t2 perseratusan 0,11..0,99 (bukan kelipatan 0,1); t3 0..3 (mis. 1,05 / 2,37)
  function nilaiKetuk(tingkat) {
    if (tingkat === 1) return acak(1, 9) * 100;
    if (tingkat === 2) { for (;;) { const k = acak(11, 99); if (k % 10) return k * 10; } }
    for (;;) {
      const u = acak(0, 2), f = Math.random() < 0.25 ? acak(1, 9) : acak(11, 99);
      if (f % 10 === 0) continue;
      return u * 1000 + f * 10;
    }
  }
  const dKetuk = (tingkat) => (tingkat === 1 ? 1 : 2);

  function soalKetuk(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const m = nilaiKetuk(tingkat), kode = 'k' + m;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'ketuk', tingkat, mil: m, d: dKetuk(tingkat), kunci: minimal(m), kode };
    }
    throw new Error('soalKetuk gagal');
  }

  // nilai titik bertanda di soal baca. t3: x,y5 (di tengah dua tik persepuluhan) supaya butuh perseratusan
  function nilaiTanya(tingkat) {
    if (tingkat === 1) return acak(1, 9) * 100;
    if (tingkat === 2) { for (;;) { const k = acak(11, 99); if (k % 10) return k * 10; } }
    return acak(0, 2) * 1000 + acak(0, 9) * 100 + 50;
  }
  function nilaiInfo(tingkat) {
    if (tingkat === 1) return acak(1, 9) * 100;
    if (tingkat === 2) return acak(3, 97) * 10;
    return acak(1, 29) * 100;
  }
  function pengecohBaca(m, tingkat) {
    const kunci = minimal(m), u = Math.floor(m / 1000), sisa = m % 1000;
    if (tingkat === 1) {
      const n = m / 100;
      return [des(n - 1, 1, 'dekat'), des(n + 1, 1, 'dekat'), des(n, 2, 'seratus'), lit(1, String(n), 'dekat'), lit(n, '0', 'utuh')];
    }
    if (tingkat === 2) {
      const k = m / 10, a = Math.floor(k / 10), b = k % 10;
      return [minimal(a * 100, 'kiri'), minimal((a + 1) * 100, 'kanan'), lit(0, String(b) + String(a), 'balik'), lit(a, String(b), 'utuh'), des(k + 1, 2, 'dekat'), des(k - 1, 2, 'dekat')];
    }
    const t = Math.floor(sisa / 100);
    return [minimal(u * 1000 + t * 100, 'kiri'), minimal(u * 1000 + (t + 1) * 100, 'kanan'), lit(u, '5' + String(t), 'balik'), lit(u, '5', 'tengah'), minimal(m + 100, 'dekat'), minimal(m - 100, 'dekat')];
  }

  function soalBaca(tingkat, pakai) {
    for (let coba = 0; coba < 800; coba++) {
      const m = nilaiTanya(tingkat), kode = 'b' + m;
      if (pakai && pakai.has(kode)) continue;
      const nilai = [m];
      let ulang = false;
      for (let i = 0; i < 2 && !ulang; i++) {
        let ok = false;
        for (let k = 0; k < 60 && !ok; k++) {
          const v = nilaiInfo(tingkat);
          if (nilai.every((x) => Math.abs(x - v) >= SELANG[tingkat])) { nilai.push(v); ok = true; }
        }
        if (!ok) ulang = true;
      }
      if (ulang) continue;
      const kunci = minimal(m);
      const salah = pilihPengecoh(kunci, pengecohBaca(m, tingkat).filter((x) => x.n > 0), 3);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kode);
      const titik = nilai.slice().sort((a, b) => a - b);
      return { jenis: 'baca', tingkat, mil: m, d: dKetuk(tingkat), titik, tanya: titik.indexOf(m), kunci, opsi: kocok([kunci].concat(salah)), kode };
    }
    throw new Error('soalBaca gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalKetuk(tingkat, pakai), soalKetuk(tingkat, pakai), soalKetuk(tingkat, pakai), soalBaca(tingkat, pakai), soalBaca(tingkat, pakai)];
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    return soal.jenis === 'ketuk' ? soalKetuk(tingkat, pakai) : soalBaca(tingkat, pakai);
  }
  const periksaKetuk = (soal, v) => ({ benar: v === soal.mil, v });
  const periksaBaca = (soal, opsi) => ({ benar: senilai(opsi, soal.kunci), pilih: opsi });

  // Tahap ketuk: dari rentang {lo, hi} -> apakah sudah tahap tik, dan berapa bagiannya.
  function tahap(rentang, d) {
    const W = rentang.hi - rentang.lo, langkah = Math.pow(10, 3 - d);
    const akhir = W / langkah <= 10;
    return { akhir, bagian: akhir ? W / langkah : (W > 1000 ? W / 1000 : 10), langkah };
  }
  // rantai zoom ke nilai m: [satuan] lalu (bila d = 2) [persepuluhan]
  function rantai(m, d) {
    const u = Math.floor(m / 1000) * 1000, r = [{ lo: u, hi: u + 1000, d: 1 }];
    if (d >= 2) { const t = Math.floor(m / 100) * 100; r.push({ lo: t, hi: t + 100, d: 2 }); }
    return r;
  }

  const logika = { BATAS, SELANG, soalKetuk, soalBaca, buatRonde, soalMirip, periksaKetuk, periksaBaca, tahap, rantai };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, garisSvg, garisBertingkat } = D;

  function titikBaca(soal) {
    return soal.titik.map((v, i) => (i === soal.tanya ? { v, teks: '?', jenis: 'tanya' } : { v, teks: teks(minimal(v)), jenis: 'info' }));
  }
  function opsiGarisBaca(soal) {
    const t = soal.tingkat;
    const o = { lo: 0, hi: BATAS[t], titik: titikBaca(soal), d: 1 };
    if (t === 1) o.bagian = 10;
    else if (t === 2) Object.assign(o, { bagian: 10, kecil: 10, labelSemua: true, labelKecil: true });
    else Object.assign(o, { bagian: 30, labelTiap: 5 });
    return o;
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'baca') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Berapa nilai titik <b class="kuning-t">?</b> di garis?'));
      const luar = el('div', 'garis-des-wadah');
      luar.appendChild(garisSvg(opsiGarisBaca(soal)).svg);
      wadah.appendChild(luar);
      const opsi = el('div', 'des-opsi des-opsi-baris');
      soal.opsi.forEach((o) => {
        const b = el('button', 'tombol tombol-des', teks(o));
        b.onclick = () => kirim(periksaBaca(soal, o));
        opsi.appendChild(b);
      });
      wadah.appendChild(opsi);
      return;
    }
    // ---- ketuk bertahap ----
    const nama = teks(soal.kunci);
    const petunjuk = el('div', 'soal-teks soal-sedang');
    const jejak = el('div', 'ingat-kecil');
    const luar = el('div', 'garis-des-wadah garis-ketuk');
    const bawah = el('div', 'baris-tombol des-bawah');
    const info = el('div', 'pilihan-info');
    const balik = el('button', 'tombol', '↩ Perluas');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    bawah.append(balik, info, cek);
    wadah.append(petunjuk, jejak, luar, bawah);
    const awal = { lo: 0, hi: BATAS[soal.tingkat] };
    let tumpuk = [awal], pilihV = null, kunci = false, tampilan = null;

    function gambar() {
      const r = tumpuk[tumpuk.length - 1], th = tahap(r, soal.d);
      const opsi = { lo: r.lo, hi: r.hi, bagian: th.bagian, d: th.akhir ? soal.d : (r.hi - r.lo > 1000 ? 0 : 1), atas: 66, labelSemua: !th.akhir, segmen: !th.akhir, titik: [] };
      if (th.akhir && pilihV != null) opsi.titik = [{ v: pilihV, teks: teksMil(pilihV, soal.d), jenis: 'pilih' }];
      luar.innerHTML = '';
      tampilan = garisSvg(opsi);
      luar.appendChild(tampilan.svg);
      petunjuk.innerHTML = th.akhir
        ? 'Ketuk letak <b class="biru">' + nama + '</b> tepat di garis.'
        : 'Ketuk <b>bagian</b> tempat <b class="biru">' + nama + '</b> berada.';
      jejak.innerHTML = tumpuk.length > 1 ? 'Garis diperbesar: dari <b>' + teksMil(r.lo, soal.d) + '</b> sampai <b>' + teksMil(r.hi, soal.d) + '</b>' : (th.akhir ? 'Hitung tik dari ujung kiri.' : '&nbsp;');
      info.innerHTML = pilihV != null ? 'Pilihanmu: <b>' + teksMil(pilihV, soal.d) + '</b>' : (th.akhir ? 'Ketuk satu tik.' : 'Ketuk satu bagian.');
      cek.disabled = pilihV == null;
      balik.style.visibility = tumpuk.length > 1 ? 'visible' : 'hidden';
    }
    luar.addEventListener('click', (e) => {
      if (kunci || !tampilan) return;
      const r = tumpuk[tumpuk.length - 1], th = tahap(r, soal.d);
      const v = tampilan.info.keNilai(e.clientX);
      const sel = (r.hi - r.lo) / th.bagian;
      if (th.akhir) {
        const i = Math.max(0, Math.min(th.bagian, Math.round((v - r.lo) / sel)));
        pilihV = r.lo + i * sel;
      } else {
        const i = Math.max(0, Math.min(th.bagian - 1, Math.floor((v - r.lo) / sel)));
        tumpuk.push({ lo: r.lo + i * sel, hi: r.lo + (i + 1) * sel }); pilihV = null;
      }
      Suara.efek('pop');
      gambar();
    });
    balik.onclick = () => { if (kunci || tumpuk.length < 2) return; tumpuk.pop(); pilihV = null; Suara.efek('pop'); gambar(); };
    cek.onclick = () => { if (kunci || pilihV == null) return; kunci = true; kirim(periksaKetuk(soal, pilihV)); };
    gambar();
  }

  // ---------- umpan balik ----------
  function pujian(soal) {
    return { html: 'Letaknya: <b>' + teks(soal.kunci) + '</b>' };
  }

  const PETUNJUK = {
    kiri: 'Itu tik di <b>kiri</b> titik, bukan titiknya.', kanan: 'Itu tik di <b>kanan</b> titik, bukan titiknya.',
    balik: 'Angkanya <b>terbalik</b>.', utuh: 'Angka di depan koma itu bilangan <b>utuh</b>; titik ini belum sampai ke sana.',
    seratus: 'Itu perseratusan (garis dibagi 100), padahal garisnya dibagi 10.', tengah: 'Titik ada di antara dua tik, bukan di tik itu.',
  };

  function alasan(soal, jawaban, wadah) {
    const m = soal.mil, d = soal.d, ra = rantai(m, d);
    const salahMil = soal.jenis === 'ketuk' ? jawaban.v : (jawaban.pilih ? D.mil(jawaban.pilih) : null);
    const salahTeks = soal.jenis === 'ketuk' ? teksMil(jawaban.v, d) : teks(jawaban.pilih);
    ra.forEach((r, i) => { r.titik = []; });
    const terakhir = ra[ra.length - 1];
    terakhir.titik.push({ v: m, teks: teks(soal.kunci), jenis: 'benar' });
    if (salahMil != null && salahMil !== m) {
      const taruh = [terakhir].concat(ra.length > 1 ? [ra[0]] : []).find((r) => salahMil >= r.lo && salahMil <= r.hi);
      if (taruh) taruh.titik.push({ v: salahMil, teks: salahTeks, jenis: 'salah' });
    }
    let kata;
    const t1 = teksMil(ra[0].lo, 1), t2 = teksMil(ra[0].hi, 1);
    if (d === 1) {
      kata = 'Garis dari <b>0</b> sampai <b>1</b> dibagi <b>10 bagian</b> sama besar. Tiap bagian = <b>0,1</b>.<br>Titik ke-<b>' + (m / 100) + '</b> dari 0 → <b>' + teks(soal.kunci) + '</b>.';
    } else {
      const tengah = terakhir.lo, b = (m - tengah) / 10;
      kata = 'Garis dari <b>' + t1 + '</b> sampai <b>' + t2 + '</b> dibagi 10 bagian: tiap bagian = <b>0,1</b>. Titik ada di antara <b>' + teksMil(terakhir.lo, 1) + '</b> dan <b>' + teksMil(terakhir.hi, 1) + '</b>.<br>' +
        'Bagian itu dibagi 10 lagi: tiap bagian = <b>0,01</b>. Titik ke-<b>' + b + '</b> setelah ' + teksMil(terakhir.lo, 1) + ' → ' + teks(D.dariMil(terakhir.lo, 2)) + ' + ' + teks(des(b, 2)) + ' = <b>' + teks(soal.kunci) + '</b>.';
    }
    const kotak = el('div', 'kotak-teks', kata);
    if (soal.jenis === 'baca' && jawaban.pilih && PETUNJUK[jawaban.pilih.salah]) kotak.innerHTML += '<br><small>Kamu memilih ' + teks(jawaban.pilih) + '. ' + PETUNJUK[jawaban.pilih.salah] + '</small>';
    wadah.appendChild(kotak);
    const luar = el('div', 'garis-des-wadah garis-alasan');
    luar.appendChild(garisBertingkat(ra));
    wadah.appendChild(luar);
  }

  root.GameGarisDesimal = Object.assign({
    id: 'garis-desimal',
    tingkat: ['0 – 1 (persepuluhan)', '0 – 1 (perseratusan)', '0 – 3 (perseratusan)'],
    ingat: 'Garis 0 sampai 1 dibagi 10 bagian: tiap bagian 0,1. Bagi lagi 10: tiap bagian 0,01. Ketuk bagian dulu, lalu cari titiknya.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
