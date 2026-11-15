// Mini game 🧩 Susun Bangun (Kelas 4 Bab 10).
// Soal 1-3: bayangan (siluet) di kertas petak + potongan -> ketuk potongan, lalu ketuk tempatnya; tombol ↻ putar 90° dan ⇋ balik (seret tidak dipakai).
// Soal 4-5: "bangun mana yang TIDAK bisa dibuat dari potongan ini?" (4 gambar) atau "bangun hasil susunan, namanya?" (menyambung 🔍 Cek Sifat).
// Tingkat 1: 2 segitiga siku-siku sama kaki -> persegi, segitiga besar, jajargenjang · 2: segitiga + persegi (3-4 potongan) -> trapesium, persegi panjang, jajargenjang, rumah ·
// 3: 7 potongan tangram -> persegi, segitiga, jajargenjang, trapesium siku-siku; hanya putar 90°, potongan jajargenjang boleh perlu dibalik.
// Kunci: luas dalam seperempat petak (tiap petak dibagi dua diagonal); potongan cocok <=> himpunan kuartal sama (titik uji bilangan bulat). Cek: node tools/cek-bab10.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const B = modul ? require('./bangun.js') : root.Bangun;
  const { acak, pilih, kocok, POTONGAN, PUZZLE, PUZZLE_BESAR, PENGECOH, kk, kuartalPoligon, luasPetak, ubahPoligon, selesaikan, carriTempat, geserPoligon, kuartalDari, kuartalDiPoint, namaBangun } = B;

  // ---------- Logika (tanpa DOM) ----------
  const luasSil = (sil) => luasPetak(kuartalPoligon(sil));
  const luasPot = (id) => luasPetak(kuartalPoligon(POTONGAN[id].pts));
  const BATAS = { 1: 3, 2: 3, 3: 5 };
  const KIRAL = ['jajar2']; // potongan yang bayangan cerminnya berbeda (perlu ⇋ bila awalnya terbalik)

  function terpasangDariSolusi(solusi) {
    return solusi.map((s) => ({ id: s.id, pts: geserPoligon(ubahPoligon(POTONGAN[s.id].pts, s.rot, s.balik), s.tx, s.ty), warna: POTONGAN[s.id].warna, luas: luasPot(s.id) }));
  }
  function bangunSusun(pz) { // pz dari PUZZLE / PUZZLE_BESAR
    const sol = selesaikan(kuartalDari(pz.sil), pz.p);
    if (!sol) throw new Error('puzzle tidak bisa disusun ' + pz.id);
    return sol;
  }
  function soalSusun(tingkat, bukanId) {
    const kand = PUZZLE.filter((p) => p.t === tingkat && p.id !== bukanId);
    const pz = pilih(kand);
    const awal = pz.p.map((id) => ({ rot: acak(0, 3), balik: tingkat === 3 && KIRAL.includes(id) ? Math.random() < 0.5 : false }));
    return { jenis: 'susun', tingkat, puzzle: pz.id, sil: pz.sil, p: pz.p, awal, batas: BATAS[tingkat], solusi: bangunSusun(pz), kode: 's' + pz.id + awal.map((a) => a.rot + (a.balik ? 'b' : '')).join('') };
  }

  const kunciPotongan = (daftar) => daftar.slice().sort().join(',');
  function soalTidakBisa(tingkat) {
    const potongan = tingkat === 1 ? ['seg2', 'seg2'] : tingkat === 2 ? ['seg2', 'pers2', 'seg2'] : ['seg4', 'seg4'];
    const bisa = (tingkat === 3 ? PUZZLE_BESAR : PUZZLE.filter((p) => p.t === tingkat && kunciPotongan(p.p) === kunciPotongan(potongan))).slice();
    const total = potongan.reduce((a, id) => a + luasPot(id), 0);
    const salah = pilih(PENGECOH.filter((c) => luasSil(c.sil) !== total));
    const opsi = kocok(bisa.map((b) => ({ id: b.id, sil: b.sil, bisa: true, p: b.p })).concat([{ id: salah.id, sil: salah.sil, bisa: false }]));
    return { jenis: 'tidakBisa', tingkat, potongan, total, opsi, kunci: salah.id, luasSalah: luasSil(salah.sil), kode: 'x' + tingkat + opsi.map((o) => o.id).join(',') };
  }
  const NAMA_PILIHAN = ['Segitiga', 'Persegi', 'Persegi panjang', 'Jajargenjang', 'Trapesium', 'Belah ketupat', 'Layang-layang', 'Segi lima'];
  function soalNama(tingkat, bukanId, pastiId) {
    const kand = PUZZLE.filter((p) => p.t === tingkat && p.id !== bukanId), pz = pastiId ? PUZZLE.find((p) => p.id === pastiId) : pilih(kand);
    const kunci = namaBangun(pz.sil);
    const salah = kocok(NAMA_PILIHAN.filter((n) => n !== kunci)).slice(0, 3);
    return { jenis: 'nama', tingkat, puzzle: pz.id, sil: pz.sil, p: pz.p, solusi: bangunSusun(pz), kunci, opsi: kocok([kunci].concat(salah)), kode: 'n' + pz.id };
  }
  function buatRonde(tingkat) {
    for (;;) {
      const t = PUZZLE.filter((p) => p.t === tingkat).map((p) => p.id);
      const urut = kocok(t);
      const susun = urut.slice(0, 3).map((id) => { for (let i = 0; i < 500; i++) { const s = soalSusun(tingkat); if (s.puzzle === id) return s; } return soalSusun(tingkat); });
      const nama = soalNama(tingkat, null, urut[3] || pilih(urut)), bisaTidak = soalTidakBisa(tingkat);
      const r = tingkat === 3 ? susun.concat([nama, bisaTidak]) : susun.concat([bisaTidak, nama]);
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'susun') s = soalSusun(tingkat, soal.puzzle);
      else if (soal.jenis === 'nama') s = soalNama(tingkat, soal.puzzle);
      else s = soalTidakBisa(tingkat);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.kunci, pilih: kode });

  const logika = { luasSil, luasPot, BATAS, terpasangDariSolusi, soalSusun, soalTidakBisa, soalNama, buatRonde, soalMirip, periksa, NAMA_PILIHAN };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, papanSvg, potonganSvg } = B;
  const KECIL = () => window.innerHeight < 790;
  const kapital = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const CIRI = { Segitiga: '3 sisi dan 3 titik sudut', Persegi: '4 sisi sama panjang dan 4 sudut siku-siku', 'Persegi panjang': '2 pasang sisi sejajar dan 4 sudut siku-siku', Jajargenjang: '2 pasang sisi sejajar', Trapesium: 'tepat 1 pasang sisi sejajar', 'Belah ketupat': '4 sisi sama panjang', 'Layang-layang': '2 pasang sisi bersebelahan sama panjang', 'Segi lima': '5 sisi dan 5 titik sudut' };
  const jumlahTeks = (daftar) => daftar.map((d) => d.luas).join(' + ') + ' = ' + daftar.reduce((a, d) => a + d.luas, 0) + ' petak';

  function skalaPapan(sil, lebarMaks, tinggiMaks) {
    const W = Math.max(...sil.map((p) => p[0])), H = Math.max(...sil.map((p) => p[1]));
    return Math.max(34, Math.min(78, Math.floor(Math.min((lebarMaks - 28) / W, (tinggiMaks - 28) / H))));
  }

  function tampilkanSusun(soal, wadah, kirim) {
    const kecil = KECIL();
    const target = new Set(kuartalDari(soal.sil).map((k) => kk(k[0], k[1], k[2])));
    const totalKuartal = target.size;
    const skala = skalaPapan(soal.sil, kecil ? 470 : 560, kecil ? 250 : 290), skalaBaki = kecil ? 22 : 26;
    const isi = new Set();
    const pot = soal.p.map((id, i) => ({ id, idx: i, rot: soal.awal[i].rot, balik: soal.awal[i].balik, pasang: null }));
    let sel = 0, miss = 0, sudah = false;
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Isi bayangan abu-abu dengan potongan.<br><small>Ketuk potongan, lalu ketuk tempatnya di kertas petak.</small>'));
    const baris = el('div', 'sb-baris');
    const tempatPapan = el('div', 'sudut-tempat');
    const baki = el('div', 'sb-baki');
    baris.append(tempatPapan, baki);
    wadah.appendChild(baris);
    const info = el('div', 'sb-info', '');
    const kontrol = el('div', 'sb-kontrol');
    const bPutar = el('button', 'tombol tombol-bantu', '↻ Putar 90°'), bBalik = el('button', 'tombol tombol-bantu', '⇋ Balik'), bUlang = el('button', 'tombol tombol-bantu', '↺ Ulang'), bTunjuk = el('button', 'tombol tombol-bantu', '💡 Tunjukkan');
    kontrol.append(bPutar, bBalik, bUlang, bTunjuk, info);
    wadah.appendChild(kontrol);

    const maju = () => { sel = pot.findIndex((p) => !p.pasang); if (sel < 0) sel = null; };
    function gambarPapan() {
      tempatPapan.innerHTML = '';
      const terpasang = pot.filter((p) => p.pasang).map((p) => ({ pts: p.pasang.pts, warna: POTONGAN[p.id].warna }));
      tempatPapan.appendChild(papanSvg({ sil: soal.sil, terpasang, skala, ketuk: tapPapan }));
    }
    function gambarBaki() {
      baki.innerHTML = '';
      pot.forEach((p, i) => {
        const b = el('button', 'sb-potong' + (p.pasang ? ' terpakai' : '') + (i === sel ? ' dipilih' : ''));
        b.appendChild(potonganSvg({ pts: ubahPoligon(POTONGAN[p.id].pts, p.rot, p.balik), warna: POTONGAN[p.id].warna, skala: skalaBaki, kotak: [kecil ? 104 : 124, kecil ? 92 : 108] }));
        b.onclick = () => { if (sudah) return; if (p.pasang) return; sel = i; Suara.efek('pop'); gambarBaki(); };
        baki.appendChild(b);
      });
    }
    function perbarui() {
      info.innerHTML = 'Salah tempat: <b>' + Math.min(miss, soal.batas) + '</b> dari ' + soal.batas;
      gambarPapan(); gambarBaki();
    }
    function tapPapan(fx, fy) {
      if (sudah) return;
      const q = kuartalDiPoint(fx, fy), key = kk(q[0], q[1], q[2]);
      if (!target.has(key)) { return; }
      if (isi.has(key)) { // ketuk potongan yang sudah terpasang: angkat kembali
        const p = pot.find((x) => x.pasang && x.pasang.kunci.has(key));
        if (p) { p.pasang.kunci.forEach((k) => isi.delete(k)); p.pasang = null; sel = p.idx; Suara.efek('pop'); perbarui(); }
        return;
      }
      if (sel === null || pot[sel].pasang) { Suara.efek('boing'); info.innerHTML = 'Pilih potongan dulu, lalu ketuk tempatnya.'; return; }
      const p = pot[sel];
      const hasil = carriTempat(p.id, p.rot, p.balik, q, target, isi, fx, fy);
      if (!hasil) {
        miss++; Suara.efek('boing'); perbarui();
        if (miss > soal.batas) { sudah = true; kirim({ benar: false, miss, gagal: true }); }
        return;
      }
      const kunci = new Set(hasil.kuartal.map((k) => kk(k[0] + hasil.tx, k[1] + hasil.ty, k[2])));
      kunci.forEach((k) => isi.add(k));
      p.pasang = { pts: geserPoligon(hasil.pts, hasil.tx, hasil.ty), kunci };
      Suara.efek('ding'); maju(); perbarui();
      if (isi.size === totalKuartal) { sudah = true; kirim({ benar: miss <= soal.batas, miss }); }
    }
    bPutar.onclick = () => { if (sudah || sel === null) return; pot[sel].rot = (pot[sel].rot + 1) % 4; Suara.efek('pop'); gambarBaki(); };
    bBalik.onclick = () => { if (sudah || sel === null) return; pot[sel].balik = !pot[sel].balik; Suara.efek('pop'); gambarBaki(); };
    bUlang.onclick = () => { if (sudah) return; pot.forEach((p) => { p.pasang = null; }); isi.clear(); sel = 0; Suara.efek('pop'); perbarui(); };
    bTunjuk.onclick = () => { if (sudah) return; sudah = true; kirim({ benar: false, miss, menyerah: true }); };
    perbarui();
  }

  function tampilkanPilihan(soal, wadah, kirim) {
    const kecil = KECIL();
    if (soal.jenis === 'tidakBisa') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Dari potongan ini, bangun mana yang <b>tidak bisa</b> dibuat?'));
      const baki = el('div', 'sb-baki sb-baki-datar');
      soal.potongan.forEach((id) => { const b = el('div', 'sb-potong tetap'); b.appendChild(potonganSvg({ pts: POTONGAN[id].pts, warna: POTONGAN[id].warna, skala: kecil ? 24 : 30, kotak: [kecil ? 112 : 140, kecil ? 76 : 92] })); baki.appendChild(b); });
      wadah.appendChild(baki);
      const opsi = el('div', 'sb-pilihan');
      soal.opsi.forEach((o) => {
        const b = el('button', 'tombol sb-kartu');
        b.appendChild(papanSvg({ sil: o.sil, skala: Math.min(kecil ? 28 : 34, Math.floor((kecil ? 170 : 200) / Math.max(...o.sil.map((p) => p[0]))), Math.floor((kecil ? 110 : 130) / Math.max(...o.sil.map((p) => p[1])))) }));
        b.onclick = () => kirim(periksa(soal, o.id));
        opsi.appendChild(b);
      });
      wadah.appendChild(opsi);
      return;
    }
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Potongan-potongan disusun menjadi bangun ini.<br>Namanya apa?'));
    const baris = el('div', 'jg-baris');
    baris.appendChild(papanSvg({ sil: soal.sil, terpasang: terpasangDariSolusi(soal.solusi), skala: skalaPapan(soal.sil, kecil ? 400 : 480, kecil ? 190 : 230) }));
    wadah.appendChild(baris);
    const opsi = el('div', 'hs-opsi');
    soal.opsi.forEach((n) => { const b = el('button', 'tombol tombol-des', n); b.onclick = () => kirim(periksa(soal, n)); opsi.appendChild(b); });
    wadah.appendChild(opsi);
  }

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'susun') tampilkanSusun(soal, wadah, kirim);
    else tampilkanPilihan(soal, wadah, kirim);
  }

  function pujian(soal) {
    if (soal.jenis === 'susun') {
      const t = terpasangDariSolusi(soal.solusi), nama = namaBangun(soal.sil).toLowerCase();
      return { html: jumlahTeks(t) + ' → bangun <b>' + nama + '</b>' };
    }
    if (soal.jenis === 'tidakBisa') return { html: 'Bangun itu ' + soal.luasSalah + ' petak, potongan hanya ' + soal.total + ' petak → <b>tidak bisa</b>.' };
    return { html: '<b>' + soal.kunci + '</b>: ' + CIRI[soal.kunci] };
  }

  function alasan(soal, jawaban, wadah) {
    const kecil = KECIL();
    const baris = el('div', 'alasan-baris');
    if (soal.jenis === 'susun' || soal.jenis === 'nama') {
      const t = terpasangDariSolusi(soal.solusi).map((x) => Object.assign(x, { muncul: true }));
      baris.appendChild(papanSvg({ sil: soal.sil, terpasang: t, skala: skalaPapan(soal.sil, kecil ? 360 : 430, kecil ? 190 : 220), petak: true }));
      const nama = namaBangun(soal.sil);
      if (soal.jenis === 'susun') baris.appendChild(el('div', 'kotak-teks', 'Potongan bergerak ke tempat yang benar. Angka = luas tiap potongan (petak).<br><b>' + jumlahTeks(t) + '</b><br>Hasilnya <b>' + nama.toLowerCase() + '</b>.' + (jawaban.gagal ? '<br><small>Salah tempat terlalu banyak.</small>' : jawaban.menyerah ? '' : '')));
      else baris.appendChild(el('div', 'kotak-teks', 'Bangun ini <b>' + nama.toLowerCase() + '</b>: ' + CIRI[nama] + '.<br><small>Kamu memilih ' + jawaban.pilih + ' (' + (CIRI[jawaban.pilih] || '') + ').</small>'));
    } else {
      const pilihan = soal.opsi.find((o) => o.id === jawaban.pilih), salah = soal.opsi.find((o) => o.id === soal.kunci);
      const s1 = pilihan.p ? terpasangDariSolusi(selesaikan(kuartalDari(pilihan.sil), pilihan.p)).map((x) => Object.assign(x, { muncul: true })) : [];
      const sk = Math.min(kecil ? 30 : 36, Math.floor(180 / Math.max(...pilihan.sil.map((p) => p[0]))));
      baris.appendChild(papanSvg({ sil: pilihan.sil, terpasang: s1, skala: sk, petak: true }));
      baris.appendChild(papanSvg({ sil: salah.sil, skala: Math.min(sk, Math.floor(180 / Math.max(...salah.sil.map((p) => p[0])))) }));
      const luasPotong = soal.potongan.map((id) => luasPot(id));
      baris.appendChild(el('div', 'kotak-teks', 'Bangun di kiri (pilihanmu) <b>bisa</b> disusun dari potongan itu.<br>Potongan: <b>' + luasPotong.join(' + ') + ' = ' + soal.total + ' petak</b>.<br>Bangun kedua <b>' + soal.luasSalah + ' petak</b>: luasnya tidak sama, jadi <b>tidak bisa</b> dibuat.'));
    }
    wadah.appendChild(baris);
  }

  root.GameSusunBangun = Object.assign({
    id: 'susun-bangun',
    tingkat: ['2 segitiga jadi bangun baru', 'segitiga + persegi (3-4 potongan)', '7 potongan tangram'],
    ingat: 'Bangun besar bisa disusun dari bangun kecil. Luasnya tetap sama walau susunannya berubah (hitung dengan petak). Putar dan balik potongan sampai pas.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
