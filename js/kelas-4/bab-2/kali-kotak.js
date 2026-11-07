// Mini game 🟦 Kali Kotak (Kelas 4 Bab 2): perkalian bersusun lewat model luas (kotak).
// Soal 1-3: 23 × 14 dipecah jadi kotak (20×10, 20×4, 3×10, 3×4): isi tiap kotak, lalu jumlahkan semuanya.
// Soal 4: perkalian bersusun lengkap (baris-baris hasil kali terlihat), pilih hasil akhir. Soal 5: sama, tanpa baris (hitung sendiri).
// Tingkat 1: 2 angka × 1 angka · 2: 2 angka × 2 angka · 3: 3 angka × 2 angka (kotak: 3 angka × puluhan, 3 angka × satuan).
// Jebakan: nol terlupa di kotak puluhan, lupa menggeser baris puluhan (92 + 23 = 115), lupa simpan. Semua jawaban dihitung kode.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const H = modul ? require('./hitung.js') : root.HitungB2;
  const { fmt, pilih, acak, kocok, nolDepan, banyakNol, buatOpsi } = H;
  const P10 = (k) => Math.pow(10, k);

  // ---------- Logika (tanpa DOM) ----------
  // 234 -> [200, 30, 4]
  const bagian = (n) => { const s = String(n), h = []; for (let i = 0; i < s.length; i++) if (s[i] !== '0') h.push(Number(s[i]) * P10(s.length - 1 - i)); return h; };
  // kalikan, tulis satuan, lupa simpan: 47 × 6 -> 242 (benar: 282)
  function lupaSimpan(a, m) {
    const s = String(a).split('').reverse().map(Number); let hasil = 0;
    s.forEach((d, i) => { const p = d * m; hasil += (i === s.length - 1 ? p : p % 10) * P10(i); });
    return hasil;
  }

  function buatAngka(tingkat) {
    for (let coba = 0; coba < 2000; coba++) {
      let a, b;
      if (tingkat === 1) { a = acak(12, 99); b = Math.random() < 0.6 ? pilih([6, 7, 8]) : acak(3, 9); if (a % 10 < 2) continue; }
      else if (tingkat === 2) { a = acak(12, 99); b = acak(12, 99); if (a % 10 === 0 || b % 10 < 2) continue; if (Math.random() < 0.5 && ![6, 7, 8].includes(b % 10)) continue; }
      else { a = acak(112, 999); b = acak(12, 99); if (a % 10 === 0 || b % 10 < 2) continue; if (Math.random() < 0.5 && ![6, 7, 8].includes(b % 10)) continue; }
      if (a * b > 100000) continue;
      return [a, b];
    }
    throw new Error('buatAngka gagal');
  }

  // opsi untuk satu kotak p × q
  function opsiKotak(p, q) {
    const kunci = p * q, zn = banyakNol(p) + banyakNol(q), cp = nolDepan(p), cq = nolDepan(q), inti = cp * cq;
    return buatOpsi(kunci, [
      { w: zn > 0, s: 'Nolnya terlupa: kali angka depannya, lalu tambahkan nol (' + zn + ' nol).', v: [inti, inti * P10(Math.max(zn - 1, 0)), kunci / 10] },
      { s: 'Nolnya kelebihan.', v: [kunci * 10] },
      { s: 'Perkalian angka depan salah hitung.', v: [(inti - cq) * P10(zn), (inti + cq) * P10(zn), (inti - cp) * P10(zn), (inti + cp) * P10(zn)] },
      { s: 'Itu hasil menjumlahkan, bukan mengalikan.', v: [p + q] },
    ], [kunci + 1, kunci - 1, kunci + 10, kunci - 10, kunci + 2, kunci + 20]);
  }
  function opsiJumlah(sel) {
    const kunci = sel.reduce((t, x) => t + x, 0);
    return buatOpsi(kunci, [
      { w: true, s: 'Ada kotak yang lupa dijumlahkan.', v: sel.map((x) => kunci - x) },
      { s: 'Menjumlahkan dengan salah letak (selisih 10 atau 100).', v: [kunci + 10, kunci - 10, kunci + 100, kunci - 100] },
      { s: 'Satu kotak terhitung dua kali.', v: sel.map((x) => kunci + x) },
    ], [kunci + 1, kunci - 1, kunci + 20, kunci - 20, kunci + 1000]);
  }

  function soalKotak(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      const [a, b] = buatAngka(tingkat);
      const kode = a + 'x' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const baris = tingkat === 3 ? [a] : bagian(a), kolom = tingkat === 1 ? [b] : bagian(b);
      const sel = [];
      baris.forEach((p, i) => kolom.forEach((q, j) => { const o = opsiKotak(p, q); sel.push({ i, j, p, q, kunci: p * q, opsi: o.opsi, sebab: o.sebab }); }));
      const jum = opsiJumlah(sel.map((s) => s.kunci));
      return { jenis: 'kotak', tingkat, a, b, baris, kolom, sel, kunci: a * b, jumlah: { kunci: a * b, opsi: jum.opsi, sebab: jum.sebab }, kode };
    }
    throw new Error('soalKotak gagal');
  }

  function soalSusun(tingkat, pakai, tampilBaris) {
    for (let coba = 0; coba < 500; coba++) {
      const [a, b] = buatAngka(tingkat);
      const kode = 's' + a + 'x' + b;
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      const kunci = a * b;
      let baris, grup, cad = [kunci + 10, kunci - 10, kunci + 100, kunci - 100, kunci + 1, kunci - 1];
      if (tingkat === 1) {
        const sat = a % 10, pul = a - sat;
        baris = [{ ket: sat + ' × ' + b, nilai: sat * b, geser: false }, { ket: pul + ' × ' + b, nilai: pul * b, geser: true }];
        grup = [
          { w: true, s: 'Lupa menyimpan angka puluhan dari hasil kali satuan.', v: [lupaSimpan(a, b)] },
          { s: 'Salah menambahkan simpanan (selisih 10).', v: [kunci + 10, kunci - 10] },
          { s: 'Hanya hasil kali satuan yang dihitung.', v: [sat * b] },
          { s: 'Hanya hasil kali puluhan yang dihitung.', v: [pul * b] },
        ];
      } else {
        const sat = b % 10, pul = b - sat, r1 = a * sat, r2 = a * pul;
        baris = [{ ket: a + ' × ' + sat, nilai: r1, geser: false }, { ket: a + ' × ' + pul / 10 + ' (geser satu tempat)', nilai: r2, geser: true }];
        grup = [
          { w: true, s: 'Lupa menggeser baris puluhan: ' + fmt(r1) + ' + ' + fmt(r2 / 10) + ' (seharusnya ' + fmt(r2) + ').', v: [r1 + r2 / 10] },
          { s: 'Baris puluhan digeser terlalu jauh.', v: [r1 + r2 * 10] },
          { s: 'Baris puluhan terlupa dijumlahkan.', v: [r1, r2] },
          { s: 'Salah menjumlahkan kedua baris (selisih 10 atau 100).', v: [kunci + 10, kunci - 10, kunci + 100, kunci - 100] },
        ];
      }
      const { opsi, sebab } = buatOpsi(kunci, grup, cad);
      return { jenis: 'susun', tingkat, tampilBaris: !!tampilBaris, a, b, baris, kunci, opsi, sebab, kode };
    }
    throw new Error('soalSusun gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalKotak(tingkat, pakai), soalKotak(tingkat, pakai), soalKotak(tingkat, pakai), soalSusun(tingkat, pakai, true), soalSusun(tingkat, pakai, false)];
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    return soal.jenis === 'kotak' ? soalKotak(tingkat, pakai) : soalSusun(tingkat, pakai, soal.tampilBaris);
  }
  // jawaban soal 'susun': nilai yang dipilih. soal 'kotak': diperiksa per langkah (isi kotak ke-i atau jumlah)
  const periksaSusun = (soal, pilihan) => ({ pilih: pilihan, benar: pilihan === soal.kunci });
  const periksaLangkah = (soal, langkah, pilihan) => pilihan === (langkah < soal.sel.length ? soal.sel[langkah].kunci : soal.jumlah.kunci);

  const logika = { bagian, lupaSimpan, buatAngka, soalKotak, soalSusun, buatRonde, soalMirip, periksaSusun, periksaLangkah };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tombolOpsi } = H;
  const WARNA = ['#FFE3C8', '#D6F2E3', '#DCE8FF', '#F0E0FF', '#FFF3B8', '#FFD9E1'];

  // grid model luas. diisi: array nilai per kotak (null = belum), aktif: indeks kotak yang sedang ditanya, salah: indeks kotak yang salah
  function gambarGrid(soal, diisi, aktif, salah) {
    const t = el('table', 'b2-grid');
    const kepala = el('tr'); kepala.appendChild(el('th', 'sudut', '×'));
    soal.kolom.forEach((q) => kepala.appendChild(el('th', '', fmt(q))));
    t.appendChild(kepala);
    soal.baris.forEach((p, i) => {
      const tr = el('tr'); tr.appendChild(el('th', '', fmt(p)));
      soal.kolom.forEach((q, j) => {
        const idx = i * soal.kolom.length + j, nilai = diisi[idx];
        const td = el('td', (idx === aktif ? 'aktif ' : '') + (idx === salah ? 'salah ' : '') + (nilai != null ? 'isi' : ''), '<small>' + fmt(p) + ' × ' + fmt(q) + '</small><b>' + (nilai != null ? fmt(nilai) : '?') + '</b>');
        td.style.background = nilai != null || idx === aktif ? WARNA[idx % WARNA.length] : '#fff';
        tr.appendChild(td);
      });
      t.appendChild(tr);
    });
    return t;
  }

  function tampilKotak(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Pecah jadi kotak: <b>' + fmt(soal.a) + ' × ' + fmt(soal.b) + '</b>'));
    const tengah = el('div', 'b2-tengah');
    const bawah = el('div', 'b2-bawah');
    wadah.append(tengah, bawah);
    const diisi = soal.sel.map(() => null), n = soal.sel.length;
    let selesai = false;
    function langkah(i) {
      tengah.innerHTML = ''; bawah.innerHTML = '';
      tengah.appendChild(gambarGrid(soal, diisi, i < n ? i : -1));
      let tanya, opsi;
      if (i < n) { const s = soal.sel[i]; tanya = 'Kotak <b>' + fmt(s.p) + ' × ' + fmt(s.q) + '</b> = ?'; opsi = s.opsi; }
      else { tanya = '<span class="b2-jumlah">' + diisi.map(fmt).join(' + ') + ' = ?</span>'; opsi = soal.jumlah.opsi; }
      bawah.appendChild(el('div', 'b2-tanya', tanya));
      bawah.appendChild(tombolOpsi(opsi.map((o) => ({ nilai: o, label: fmt(o) })), (nilai) => {
        if (selesai) return;
        if (periksaLangkah(soal, i, nilai)) {
          if (i < n) { diisi[i] = soal.sel[i].kunci; Suara.efek('pop'); langkah(i + 1); }
          else { selesai = true; kirim({ benar: true }); }
        } else { selesai = true; kirim({ benar: false, langkah: i, pilih: nilai }); }
      }));
    }
    langkah(0);
  }

  // perkalian bersusun (tabel kanan-rata). barisHasil: tampilkan baris sementara?
  function gambarSusun(soal, tampilBaris, hasil, ketHasil) {
    const t = el('table', 'b2-susun');
    t.appendChild(el('tr', '', '<td class="op"></td><td class="nilai">' + fmt(soal.a) + '</td><td class="ket"></td>'));
    t.appendChild(el('tr', 'garis-bawah', '<td class="op">×</td><td class="nilai">' + fmt(soal.b) + '</td><td class="ket"></td>'));
    if (tampilBaris) {
      soal.baris.forEach((r, i) => {
        const nilai = r.geser ? fmt(r.nilai / 10) + '<span class="nol-geser">0</span>' : fmt(r.nilai);
        t.appendChild(el('tr', i === soal.baris.length - 1 ? 'garis-bawah' : '', '<td class="op">' + (i ? '+' : '') + '</td><td class="nilai">' + nilai + '</td><td class="ket">' + r.ket + '</td>'));
      });
    } else {
      t.lastChild.classList.add('garis-bawah');
    }
    t.appendChild(el('tr', '', '<td class="op"></td><td class="nilai hasil">' + (hasil != null ? fmt(hasil) : '?') + '</td><td class="ket">' + (ketHasil || '') + '</td>'));
    return t;
  }

  function tampilSusun(soal, wadah, kirim) {
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Kali bersusun: <b>' + fmt(soal.a) + ' × ' + fmt(soal.b) + '</b>'));
    wadah.appendChild(el('div', 'b2-tengah', ''));
    wadah.lastChild.appendChild(gambarSusun(soal, soal.tampilBaris, null));
    if (!soal.tampilBaris) wadah.appendChild(el('div', 'ingat-kecil', 'Kali satuannya, kali puluhannya (geser satu tempat), lalu jumlahkan.'));
    wadah.appendChild(tombolOpsi(soal.opsi.map((o) => ({ nilai: o, label: fmt(o) })), (nilai) => kirim(periksaSusun(soal, nilai))));
  }

  function tampilkan(soal, wadah, kirim) { return soal.jenis === 'kotak' ? tampilKotak(soal, wadah, kirim) : tampilSusun(soal, wadah, kirim); }

  function pujian(soal) {
    if (soal.jenis === 'kotak') return { html: soal.sel.map((s) => fmt(s.kunci)).join(' + ') + ' = <b>' + fmt(soal.kunci) + '</b>' };
    return { html: fmt(soal.a) + ' × ' + fmt(soal.b) + ' = <b>' + fmt(soal.kunci) + '</b>' };
  }

  function alasan(soal, jawaban, wadah) {
    const kolom = el('div', 'des-alasan');
    if (soal.jenis === 'kotak') {
      const n = soal.sel.length;
      const diisi = soal.sel.map((s) => s.kunci);
      if (jawaban.langkah < n) {
        const s = soal.sel[jawaban.langkah];
        kolom.appendChild(el('div', 'kotak-teks', 'Kotak <b>' + fmt(s.p) + ' × ' + fmt(s.q) + ' = ' + fmt(s.kunci) + '</b>.<br><small>Kamu memilih ' + fmt(jawaban.pilih) + '. ' + (s.sebab[jawaban.pilih] || '') + '</small>'));
        kolom.appendChild(el('div', 'b2-tengah', '')); kolom.lastChild.appendChild(gambarGrid(soal, diisi, -1, jawaban.langkah));
      } else {
        kolom.appendChild(el('div', 'kotak-teks', 'Jumlahkan semua kotak: <b>' + soal.sel.map((s) => fmt(s.kunci)).join(' + ') + ' = ' + fmt(soal.kunci) + '</b>.<br><small>Kamu memilih ' + fmt(jawaban.pilih) + '. ' + (soal.jumlah.sebab[jawaban.pilih] || '') + '</small>'));
        kolom.appendChild(el('div', 'b2-tengah', '')); kolom.lastChild.appendChild(gambarGrid(soal, diisi, -1));
      }
    } else {
      kolom.appendChild(el('div', 'kotak-teks', '<b>' + fmt(soal.a) + ' × ' + fmt(soal.b) + ' = ' + fmt(soal.kunci) + '</b><br><small>Kamu memilih ' + fmt(jawaban.pilih) + '. ' + (soal.sebab[jawaban.pilih] || '') + '</small>'));
      kolom.appendChild(el('div', 'b2-tengah', '')); kolom.lastChild.appendChild(gambarSusun(soal, true, soal.kunci, '= ' + soal.baris.map((r) => fmt(r.nilai)).join(' + ')));
    }
    wadah.appendChild(kolom);
  }

  root.GameKaliKotak = Object.assign({
    id: 'kali-kotak',
    tingkat: ['2 angka × 1 angka', '2 angka × 2 angka', '3 angka × 2 angka'],
    ingat: 'Pecah bilangan menurut nilai tempatnya jadi kotak: 23 × 14 = 20×10 + 20×4 + 3×10 + 3×4. Baris puluhan digeser satu tempat.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
