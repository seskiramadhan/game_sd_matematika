// Mini game 📝 Catat Turus (Kelas 4 Bab 12).
// Soal 1-3: benda muncul satu per satu atau sekumpulan -> KETUK benda, turus bertambah di baris kategorinya (ikat 5 = 4 garis + 1 miring) -> pilih jumlah satu kategori / jumlah semua.
// Soal 4-5 (tingkat 3: soal 2-5): tabel turus sudah jadi -> ubah turus jadi angka, paling banyak, selisih, jumlah.
// Tingkat 1: 2-3 kategori, <= 5 benda per kategori, tabel turus <= 9 · 2: 3 kategori sampai 20 benda, tabel 4 kategori <= 12 · 3: baca tabel (jumlah sampai 40), contoh buah kesukaan.
// Kunci dihitung kode dari data; pengecoh dari salah umum (ikat dihitung 1 atau 4, selisih ditukar jumlah, kategori terlewat). Cek: node tools/cek-bab12.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('./grafik.js') : root.Grafik;
  const { acak, pilih, kocok, jumlah, buatData, dataContoh, tanya, periksa, teksOpsi, kodeData, turusPecah } = G;

  // ---------- Logika (tanpa DOM) ----------
  const CATAT = {
    1: () => buatData({ tipe: 'kat', n: acak(2, 3), min: 1, maks: 5, unikExtrem: false, maksJumlah: 12, minJumlah: 4 }),
    2: () => buatData({ tipe: 'kat', n: 3, min: 2, maks: 9, unikExtrem: false, maksJumlah: 20, minJumlah: 12 }),
    3: () => buatData({ tipe: 'kat', n: 3, min: 3, maks: 9, unikExtrem: false, maksJumlah: 26, minJumlah: 18 }),
  };
  const TABEL = {
    1: () => buatData({ n: acak(3, 4), min: 2, maks: 9, tipe: 'kat' }),
    2: () => buatData({ n: 4, min: 3, maks: 12, tipe: 'kat', maksJumlah: 30 }),
    3: () => buatData({ n: acak(4, 5), min: 3, maks: 12, tipe: 'kat', maksJumlah: 40 }),
  };
  // daftar slot per tingkat: [jenis soal, jenis pertanyaan]
  const SLOT = {
    1: [['catat', 'kat'], ['catat', 'kat'], ['catat', 'total'], ['tabel', 'turus'], ['tabel', 'turus']],
    2: [['catat', 'kat'], ['catat', 'total'], ['catat', 'kat'], ['tabel', 'jumlah'], ['tabel', 'paling']],
    3: [['catat', 'total'], ['tabel', 'paling'], ['tabel', 'selisih'], ['tabel', 'jumlah'], ['tabel', 'selisih']],
  };
  const buatTanya = (d, qj) => (qj === 'kat' ? tanya(d, 'turus', {}) : qj === 'total' ? tanya(d, 'jumlah', {}) : tanya(d, qj, {}));

  function soalDari(tingkat, slot, bukanKode) {
    for (let c = 0; c < 300; c++) {
      let d, q, jenis = slot[0];
      if (jenis === 'tabel' && tingkat >= 2 && Math.random() < 0.12) { // contoh buah kesukaan (sama dengan video & Buku Saku): jumlah 28 / paling banyak mangga
        d = dataContoh('buah', 1); q = Math.random() < 0.5 ? tanya(d, 'jumlah', {}) : tanya(d, 'paling', { sub: 'banyak' });
      } else { d = (jenis === 'catat' ? CATAT : TABEL)[tingkat](); q = buatTanya(d, slot[1]); }
      const kode = jenis + ':' + kodeData(d, q);
      if (kode === bukanKode) continue;
      const items = [];
      if (jenis === 'catat') d.nilai.forEach((v, i) => { for (let k = 0; k < v; k++) items.push(i); });
      return { jenis, tingkat, slot, d, q, items: kocok(items), mode: jenis === 'catat' && tingkat === 1 ? pilih(['satu', 'kumpulan']) : 'kumpulan', kode };
    }
    throw new Error('soal turus gagal');
  }
  function buatRonde(tingkat) {
    for (;;) {
      const r = SLOT[tingkat].map((s) => soalDari(tingkat, s));
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
  }
  function soalMirip(soal, tingkat) { for (let i = 0; i < 100; i++) { const s = soalDari(tingkat, soal.slot, soal.kode); if (s.kode !== soal.kode) return s; } return soal; }
  const logika = { SLOT, soalDari, buatRonde, soalMirip, periksa: (soal, kode) => periksa(soal, kode) };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, tabelTurus, turusSvg } = G;

  function tampilkan(soal, wadah, kirim) {
    const d = soal.d, catat = soal.jenis === 'catat';
    wadah.appendChild(el('div', 'soal-teks soal-sedang', (catat ? 'Ketuk setiap benda: satu benda = satu <b>turus</b>.<br>Lalu jawab: ' : '<b>' + d.judul + '</b><br>') + soal.q.teks));
    const baris = el('div', 'jg-baris');
    const kiri = el('div', 'gb-kiri');
    const hitung = d.cats.map(() => 0);
    let tabel = tabelTurus(d, catat ? hitung : d.nilai, {});
    const opsiEl = el('div', 'hs-opsi'), tombol = [];
    const info = el('div', 'hs-info gb-info', '');
    if (catat) {
      let k = 0;
      const total = soal.items.length;
      const area = el('div', 'gb-area' + (soal.mode === 'satu' ? ' gb-satu' : ''));
      const selesai = () => { tombol.forEach((b) => { b.disabled = false; }); info.innerHTML = 'Semua benda sudah dicatat.<br>Sekarang pilih jawabannya.'; };
      const catatBenda = (i) => {
        k++; hitung[i]++; Suara.efek('pop');
        const baru = tabelTurus(d, hitung, {}); tabel.replaceWith(baru); tabel = baru;
        info.innerHTML = 'Sudah dicatat: <b>' + k + '</b> dari ' + total;
        return k >= total;
      };
      if (soal.mode === 'kumpulan') {
        soal.items.forEach((i) => {
          const b = el('button', 'gb-benda', d.cats[i].ikon);
          b.onclick = () => { if (b.disabled) return; b.disabled = true; b.classList.add('gb-sudah'); if (catatBenda(i)) selesai(); };
          area.appendChild(b);
        });
        info.innerHTML = 'Sudah dicatat: <b>0</b> dari ' + total;
      } else {
        const tampil = () => {
          area.innerHTML = '';
          if (k >= total) return;
          const i = soal.items[k], b = el('button', 'gb-benda gb-besar', d.cats[i].ikon);
          b.onclick = () => { if (b.disabled) return; b.disabled = true; const sel = catatBenda(i); if (sel) { area.innerHTML = '<div class="gb-selesai">✓</div>'; selesai(); } else tampil(); };
          area.append(b, el('div', 'gb-urut', 'Benda ke-' + (k + 1) + ' dari ' + total));
        };
        tampil();
        info.innerHTML = 'Sudah dicatat: <b>0</b> dari ' + total;
      }
      kiri.append(area, info);
    } else {
      kiri.append(el('div', 'lk-arti', '<b>Turus</b>: tiap garis = 1 benda.<br><svg width="56" height="30" viewBox="0 0 56 30" style="vertical-align:middle"><g stroke="#1F2A44" stroke-width="4" stroke-linecap="round"><line x1="6" y1="4" x2="6" y2="26"/><line x1="16" y1="4" x2="16" y2="26"/><line x1="26" y1="4" x2="26" y2="26"/><line x1="36" y1="4" x2="36" y2="26"/><line x1="2" y1="24" x2="42" y2="6"/></g></svg> = <b>1 ikat = 5</b>'));
    }
    baris.append(kiri, tabel);
    wadah.appendChild(baris);
    soal.q.opsi.forEach((o) => {
      const b = el('button', 'tombol', o.teks);
      b.onclick = () => kirim(periksa(soal, o.kode));
      tombol.push(b); opsiEl.appendChild(b);
    });
    if (catat) tombol.forEach((b) => { b.disabled = true; });
    wadah.appendChild(opsiEl);
  }

  function pujian(soal) {
    const d = soal.d;
    if (soal.q.jenis === 'turus') { const t = turusPecah(d.nilai[soal.q.i]); return { html: t.ikat ? t.ikat + ' ikat × 5 + ' + t.sisa + ' = <b>' + d.nilai[soal.q.i] + '</b>' : soal.q.penjelasan }; }
    return { html: soal.q.penjelasan };
  }

  function alasan(soal, jawaban, wadah) {
    const d = soal.d, q = soal.q, baris = el('div', 'alasan-baris'), tempat = el('div', 'sudut-tempat'), teksEl = el('div', 'kotak-teks', '');
    tempat.appendChild(tabelTurus(d, d.nilai, { angka: true, kecil: true, sorot: q.jenis === 'turus' || q.jenis === 'nilai' ? q.i : undefined }));
    const pilihTeks = teksOpsi(q, jawaban.pilih), sebab = q.sebab[jawaban.pilih];
    let t = 'Satu <b>ikat</b> = 4 garis tegak + 1 garis miring = <b>5</b>.<br>' + q.penjelasan + '.';
    t += '<br><small>' + (sebab || 'Kamu memilih ' + pilihTeks + '.') + '</small>';
    teksEl.innerHTML = t;
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GameCatatTurus = Object.assign({
    id: 'catat-turus',
    tingkat: ['ketuk benda, 2-3 kategori', 'ketuk benda, baca tabel turus', 'baca tabel: paling banyak, selisih, jumlah'],
    ingat: 'Turus: satu benda satu garis. Lima garis jadi satu ikat (4 garis tegak + 1 garis miring) = 5. Jumlah = ikat × 5 + sisa.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
