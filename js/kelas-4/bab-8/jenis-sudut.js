// Mini game 📐 Jenis Sudut (Kelas 4 Bab 8).
// Soal 1-3: sudut digambar (diputar acak) -> pilih Lancip / Siku-siku / Tumpul (tingkat 3 + Lurus).
// Soal 4-5: sudut berlabel 3 titik -> pilih namanya (titik sudut selalu di TENGAH). Tingkat 3: dua sudut bertanda x dan y.
// Tingkat 1: sudut jelas (20-70, 90, 110-160) · 2: dekat 90 (75-85, 95-105) · 3: + sudut lurus 180 dan nama dengan huruf kecil.
// Semua jawaban dihitung kode. Cek logika: node tools/cek-bab8.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('./sudut.js') : root.Sudut;
  const { acak, pilih, kocok, jenisSudut, TEKS_JENIS, ambilHuruf, namaSudut } = S;

  // ---------- Logika (tanpa DOM) ----------
  const NILAI = {
    1: { lancip: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70], siku: [90], tumpul: [110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160] },
    2: { lancip: [75, 80, 85], siku: [90], tumpul: [95, 100, 105] },
    3: { lancip: [10, 15, 20, 30, 40, 50, 60, 70, 75, 80, 85], siku: [90], tumpul: [95, 100, 105, 110, 120, 130, 140, 150, 160, 170], lurus: [180] },
  };
  const JENIS_PILIHAN = { 1: ['lancip', 'siku', 'tumpul'], 2: ['lancip', 'siku', 'tumpul'], 3: ['lancip', 'siku', 'tumpul', 'lurus'] };

  function soalJenis(tingkat, jenis, d) {
    if (d == null) d = pilih(NILAI[tingkat][jenis]);
    return { jenis: 'jenis', tingkat, d, a1: acak(0, 359), kunci: jenis, opsi: JENIS_PILIHAN[tingkat].slice(), kode: 'j' + d };
  }

  // nama sudut dari tiga huruf: A V B, V = titik sudut
  const PERMUTASI = (a, v, b) => [[a, v, b], [b, v, a], [v, a, b], [b, a, v], [v, b, a], [a, b, v]];
  function soalNama(tingkat) {
    const [A, V, B] = ambilHuruf(3);
    const d = pilih(NILAI[tingkat].lancip.concat(NILAI[tingkat].tumpul, NILAI[tingkat].siku));
    const a1 = acak(0, 359);
    const p = PERMUTASI(A, V, B);
    const benar = Math.random() < 0.5 ? p[0] : p[1];
    const salah = kocok(p.slice(2)).slice(0, 3);
    const opsi = kocok([benar].concat(salah)).map((x) => ({ huruf: x, nama: namaSudut(x[0], x[1], x[2]) }));
    return { jenis: 'nama', tingkat, d, a1, V, A, B, kunci: namaSudut(benar[0], benar[1], benar[2]), opsi, kode: 'n' + A + V + B };
  }
  // tingkat 3: dua sudut berbagi titik sudut Q; sinar P (a), R (a+alfa), S (a+alfa+beta); sudut x = PQR, y = RQS
  function soalNama2() {
    const [P, Q, R, Sx] = ambilHuruf(4);
    const alfa = acak(5, 17) * 5, beta = acak(5, 17) * 5;
    if (alfa + beta > 170) return soalNama2();
    const a = acak(0, 359);
    const tanya = Math.random() < 0.5 ? 'x' : 'y';
    const pasang = tanya === 'x' ? [P, R] : [R, Sx];
    const lain = tanya === 'x' ? [R, Sx] : [P, R];
    const urut = (pr) => (Math.random() < 0.5 ? [pr[0], Q, pr[1]] : [pr[1], Q, pr[0]]);
    const benar = urut(pasang), sudutLain = urut(lain), gabungan = urut([P, Sx]);
    const salahTitik = pilih([[pasang[0], pasang[1], Q], [Q, pasang[0], pasang[1]], [pasang[1], pasang[0], Q]]);
    const semua = [benar, sudutLain, gabungan, salahTitik];
    const opsi = kocok(semua).map((x) => ({ huruf: x, nama: namaSudut(x[0], x[1], x[2]) }));
    return { jenis: 'nama2', tingkat: 3, P, Q, R, Sx, alfa, beta, a, tanya, pasang, kunci: namaSudut(benar[0], benar[1], benar[2]), opsi, kode: 'm' + P + Q + R + Sx + tanya, d: tanya === 'x' ? alfa : beta };
  }

  function tigaJenis(tingkat) {
    const kunci = JENIS_PILIHAN[tingkat];
    for (;;) {
      let js;
      if (tingkat === 1) js = kocok(['lancip', 'siku', 'tumpul']);
      else if (tingkat === 2) js = [pilih(kunci), pilih(kunci), pilih(kunci)];
      else js = kocok(['lurus', pilih(['lancip', 'siku', 'tumpul']), pilih(['lancip', 'siku', 'tumpul'])]);
      const r = js.map((j) => soalJenis(tingkat, j));
      if (new Set(js).size > 1 && new Set(r.map((s) => s.kode)).size === 3) return r;
    }
  }

  function buatRonde(tingkat) {
    for (;;) {
      const r = tigaJenis(tingkat);
      const n1 = tingkat === 3 ? soalNama2() : soalNama(tingkat);
      const n2 = tingkat === 3 ? soalNama2() : soalNama(tingkat);
      if (n1.kode === n2.kode) continue;
      return r.concat([n1, n2]);
    }
  }
  function soalMirip(soal, tingkat) {
    if (soal.jenis === 'jenis') {
      for (;;) { const s = soalJenis(tingkat, soal.kunci); if (s.kode !== soal.kode || NILAI[tingkat][soal.kunci].length === 1) return s; }
    }
    return soal.jenis === 'nama2' ? soalNama2() : soalNama(tingkat);
  }
  const periksaJenis = (soal, pilihan) => ({ benar: pilihan === soal.kunci, pilih: pilihan });
  const periksaNama = (soal, opsi) => ({ benar: opsi.nama === soal.kunci, pilih: opsi });

  const logika = { NILAI, buatRonde, soalJenis, soalNama, soalNama2, soalMirip, periksaJenis, periksaNama };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, sudutSvg } = S;
  const WARNA = { lancip: '#2BB673', siku: '#3A86FF', tumpul: '#9B5DE5', lurus: '#FF8A3D' };
  const KECIL = () => window.innerHeight < 790;

  function gambarJenis(soal, pojok, ukuran) {
    const a1 = soal.a1, a2 = soal.a1 + soal.d;
    return sudutSvg({
      sinar: [{ a: a1 }, { a: a2 }], lengkung: [{ a: a1, s: soal.d, warna: '#E04466' }], pojok: pojok ? a1 : null, ukuran,
    });
  }
  function gambarNama(soal, sorot, ukuran) {
    if (soal.jenis === 'nama') {
      return sudutSvg({ sinar: [{ a: soal.a1, huruf: soal.A }, { a: soal.a1 + soal.d, huruf: soal.B }], lengkung: [{ a: soal.a1, s: soal.d, warna: '#E04466' }], hurufTitik: soal.V, sorotTitik: sorot, ukuran });
    }
    const { a, alfa, beta } = soal;
    return sudutSvg({
      sinar: [{ a, huruf: soal.P }, { a: a + alfa, huruf: soal.R }, { a: a + alfa + beta, huruf: soal.Sx }],
      lengkung: [{ a, s: alfa, warna: '#3A86FF', r: 56, teks: 'x' }, { a: a + alfa, s: beta, warna: '#E04466', r: 56, teks: 'y' }],
      hurufTitik: soal.Q, sorotTitik: sorot, ukuran,
    });
  }

  function tampilkan(soal, wadah, kirim) {
    const ukuran = KECIL() ? 250 : 290;
    if (soal.jenis === 'jenis') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Sudut ini termasuk jenis apa?'));
      const baris = el('div', 'des-baris');
      let pojok = false;
      const tempat = el('div', 'sudut-tempat');
      const gambar = () => { tempat.innerHTML = ''; tempat.appendChild(gambarJenis(soal, pojok, ukuran)); };
      const bantu = el('button', 'tombol tombol-bantu', '📐 Pakai pojok kartu');
      bantu.onclick = () => { pojok = !pojok; bantu.classList.toggle('dipilih', pojok); Suara.efek('pop'); gambar(); };
      gambar();
      const kanan = el('div', 'des-kanan');
      kanan.append(bantu, el('div', 'ingat-kecil', 'Pojok kartu = sudut 90°.<br>Bandingkan dengan sudut ini.'));
      baris.append(tempat, kanan);
      wadah.appendChild(baris);
      const opsi = el('div', 'des-opsi des-opsi-baris' + (soal.opsi.length === 3 ? ' tiga' : ''));
      soal.opsi.forEach((j) => {
        const b = el('button', 'tombol tombol-des tombol-jenis', TEKS_JENIS[j]);
        b.style.setProperty('--wj', WARNA[j]);
        b.onclick = () => kirim(periksaJenis(soal, j));
        opsi.appendChild(b);
      });
      wadah.appendChild(opsi);
      return;
    }
    wadah.appendChild(el('div', 'soal-teks soal-sedang', soal.jenis === 'nama2'
      ? 'Sudut yang bertanda <b class="' + (soal.tanya === 'x' ? 'biru' : 'merah') + '">' + soal.tanya + '</b> namanya…'
      : 'Pilih nama sudut yang <b class="merah">merah</b>.'));
    const baris = el('div', 'des-baris');
    baris.appendChild(gambarNama(soal, false, ukuran));
    wadah.appendChild(baris);
    const opsi = el('div', 'des-opsi des-opsi-baris');
    soal.opsi.forEach((o) => {
      const b = el('button', 'tombol tombol-des', o.nama);
      b.onclick = () => kirim(periksaNama(soal, o));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  // ---------- umpan balik ----------
  function pujian(soal) {
    if (soal.jenis === 'jenis') {
      const d = soal.d;
      return { html: d === 180 ? 'Satu garis lurus: <b>180°</b> = Lurus' : d + '° ' + (d === 90 ? '= 90°' : d < 90 ? '&lt; 90°' : '&gt; 90°') + ' → <b>' + TEKS_JENIS[soal.kunci] + '</b>' };
    }
    return { html: 'Titik sudut di tengah: <b>' + soal.kunci + '</b>' };
  }

  const KATA_JENIS = {
    lancip: 'Lebih <b>sempit</b> dari pojok 90° → <b>lancip</b> (kurang dari 90°).',
    siku: 'Pas dengan pojok 90° → <b>siku-siku</b> (tepat 90°).',
    tumpul: 'Lebih <b>lebar</b> dari pojok 90° → <b>tumpul</b> (antara 90° dan 180°).',
    lurus: 'Kedua kaki membentuk <b>satu garis lurus</b> → sudut <b>lurus</b> (180°).',
  };

  function alasan(soal, jawaban, wadah) {
    const baris = el('div', 'alasan-baris');
    if (soal.jenis === 'jenis') {
      baris.appendChild(gambarJenis(soal, soal.kunci !== 'lurus', 220));
      const k = el('div', 'kotak-teks', 'Tempelkan pojok 90° (garis oranye) pada satu kaki.<br>' + KATA_JENIS[soal.kunci] + '<br><small>Sudut ini besarnya ' + soal.d + '°. Kamu memilih ' + TEKS_JENIS[jawaban.pilih] + '.</small>');
      baris.appendChild(k);
    } else {
      baris.appendChild(gambarNama(soal, true, 220));
      let kata = 'Titik sudut selalu ditulis di <b>tengah</b> nama.<br>Di sini titik sudutnya <b class="merah">' + (soal.V || soal.Q) + '</b> (lingkaran kuning)';
      if (soal.jenis === 'nama2') {
        const p = soal.pasang;
        kata += ', sudut <b>' + soal.tanya + '</b> dibatasi garis ' + soal.Q + p[0] + ' dan ' + soal.Q + p[1] + '.<br>Namanya ∠' + p[0] + soal.Q + p[1] + ' atau ∠' + p[1] + soal.Q + p[0] + '.';
      } else kata += ', jadi namanya <b>' + soal.kunci + '</b> (boleh juga dibaca dari arah sebaliknya).';
      baris.appendChild(el('div', 'kotak-teks', kata + '<br><small>Kamu memilih ' + jawaban.pilih.nama + '.</small>'));
    }
    wadah.appendChild(baris);
  }

  root.GameJenisSudut = Object.assign({
    id: 'jenis-sudut',
    tingkat: ['sudut jelas', 'dekat 90°', 'ada sudut lurus & huruf x, y'],
    ingat: 'Lancip kurang dari 90°, siku-siku tepat 90°, tumpul lebih dari 90°. Titik sudut selalu di tengah nama: ∠PQR.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
