// Mini game 📊 Baca Batang (Kelas 4 Bab 12).
// Piktogram (tingkat 1, 1 gambar = 1 atau 2) dan diagram batang skala 1 / 2 / 5; batang bisa berhenti di antara dua garis (7 pada skala 2).
// Pertanyaan: nilai, paling banyak / sedikit, selisih, jumlah (dua batang atau semua). 4 pilihan, pengecoh dari salah umum.
// Tingkat 1: piktogram + skala 1 · 2: skala 2 dengan nilai ganjil · 3: skala 5 dan skala 2, jumlah semua, contoh buku dan kue.
// Cek: node tools/cek-bab12.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('./grafik.js') : root.Grafik;
  const { acak, pilih, buatData, dataContoh, tanya, periksa, teksOpsi, kodeData } = G;

  // ---------- Logika (tanpa DOM) ----------
  // slot: [bentuk, jenis pertanyaan]; bentuk: 'pikto' | 'g1' | 'g2' | 'g5' | 'g25' (acak skala 5 atau skala 2)
  const SLOT = {
    1: [['pikto', 'nilai'], ['pikto', 'paling'], ['g1', 'nilai'], ['g1', 'paling'], ['g1', 'selisih']],
    2: [['g2', 'nilai'], ['g2', 'paling'], ['g2', 'selisih'], ['g2', 'jumlah2'], ['g2', 'nilai']],
    3: [['g25', 'nilai'], ['g25', 'selisih'], ['g25', 'jumlah'], ['g25', 'paling'], ['g25', 'selisih']],
  };
  // contoh yang sama dengan video & Buku Saku: [data, garis, tingkat minimal, pertanyaan]
  const CONTOH = [
    ['buku', 2, 2, ['paling', { sub: 'banyak' }]], ['buku', 2, 2, ['paling', { sub: 'sedikit' }]], ['buku', 2, 2, ['selisih', { i: 3, j: 0 }]], ['buku', 2, 2, ['jumlah', {}]],
    ['kue', 5, 3, ['selisih', { i: 3, j: 2 }]], ['kue', 5, 3, ['jumlah', {}]], ['buah', 2, 2, ['jumlah', {}]],
  ];
  function dataBentuk(tingkat, bentuk) {
    const n = acak(4, 5);
    if (bentuk === 'pikto') { const st = pilih([1, 2]); const d = buatData({ n, min: st === 1 ? 1 : 2, maks: st === 1 ? 8 : 12, langkah: st, garis: st }); d.pikto = true; return d; }
    if (bentuk === 'g1') return buatData({ n, min: 1, maks: 10, langkah: 1, garis: 1 });
    if (bentuk === 'g2') return buatData({ n, min: 2, maks: tingkat === 2 ? 14 : 19, langkah: 1, garis: 2, ganjil: 2 });
    if (bentuk === 'g5') return buatData({ n, min: 5, maks: 30, langkah: 5, garis: 5 });
    return dataBentuk(tingkat, pilih(['g5', 'g5', 'g2']));
  }
  function soalDari(tingkat, slot, bukanKode) {
    for (let c = 0; c < 400; c++) {
      let d, q;
      const ct = CONTOH.filter((x) => x[2] <= tingkat);
      if (tingkat >= 2 && Math.random() < 0.12 && ct.length) {
        const x = pilih(ct); d = dataContoh(x[0], x[1]); q = tanya(d, x[3][0], x[3][1]);
      } else {
        d = dataBentuk(tingkat, slot[0]);
        const o = {};
        if (slot[1] === 'nilai' && d.garis > 1 && !d.pikto) { const gjl = d.nilai.map((v, i) => (v % d.garis ? i : -1)).filter((i) => i >= 0); if (gjl.length && Math.random() < 0.75) o.i = pilih(gjl); }
        q = tanya(d, slot[1], o);
      }
      const kode = (d.pikto ? 'p' : 'b') + d.garis + ':' + kodeData(d, q);
      if (kode === bukanKode) continue;
      return { jenis: 'baca', tingkat, slot, d, q, kode };
    }
    throw new Error('soal baca gagal');
  }
  function buatRonde(tingkat) {
    for (;;) {
      const r = SLOT[tingkat].map((s) => soalDari(tingkat, s));
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
  }
  function soalMirip(soal, tingkat) { for (let i = 0; i < 100; i++) { const s = soalDari(tingkat, soal.slot, soal.kode); if (s.kode !== soal.kode) return s; } return soal; }
  const logika = { SLOT, CONTOH, dataBentuk, soalDari, buatRonde, soalMirip, periksa };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, diagramSvg, piktogram } = G;

  function tampilkan(soal, wadah, kirim) {
    const d = soal.d, q = soal.q;
    wadah.appendChild(el('div', 'soal-teks soal-sedang', '<b>' + d.judul + '</b><br>' + q.teks));
    const baris = el('div', 'jg-baris'), kanan = el('div', 'des-kanan lk-kanan');
    const gambar = d.pikto ? piktogram(d, d.garis, {}) : diagramSvg(d, d.nilai, {});
    kanan.appendChild(el('div', 'lk-arti', d.pikto ? '<b>Cara baca</b>: hitung gambarnya, lalu kalikan dengan nilai <b>satu gambar</b>.' : '<b>Skala</b> = nilai tiap garis di sumbu. Di sini tiap garis naik <b>' + d.garis + '</b>.<br>Lihat angka di sumbu, bukan banyak kotak.'));
    if (!d.pikto && q.jenis === 'nilai' && d.nilai[q.i] % d.garis) kanan.appendChild(el('div', 'ingat-kecil', 'Batang berhenti di antara dua garis.<br>Lihat garis di bawah dan di atasnya.'));
    baris.append(gambar, kanan);
    wadah.appendChild(baris);
    const opsiEl = el('div', 'hs-opsi');
    q.opsi.forEach((o) => {
      const b = el('button', 'tombol', (o.ikon ? o.ikon + ' ' : '') + o.teks);
      b.onclick = () => kirim(periksa(soal, o.kode));
      opsiEl.appendChild(b);
    });
    wadah.appendChild(opsiEl);
  }

  function pujian(soal) { return { html: soal.q.penjelasan }; }

  function alasan(soal, jawaban, wadah) {
    const d = soal.d, q = soal.q, baris = el('div', 'alasan-baris'), tempat = el('div', 'sudut-tempat'), teksEl = el('div', 'kotak-teks', '');
    const sorot = q.jenis === 'selisih' || q.jenis === 'jumlah2' ? [q.i, q.j] : q.jenis === 'paling' ? [Number(q.kunci)] : q.jenis === 'nilai' ? [q.i] : [];
    if (d.pikto) tempat.appendChild(piktogram(d, d.garis, { angka: true, sorot: q.i }));
    else tempat.appendChild(diagramSvg(d, d.nilai, { lebar: 440, tinggi: 250, kecil: true, sorot, bantu: q.jenis === 'nilai' ? q.i : undefined, labelNilai: q.jenis !== 'nilai' }));
    const pilihTeks = teksOpsi(q, jawaban.pilih), sebab = q.sebab[jawaban.pilih];
    let t = d.pikto ? 'Satu gambar = <b>' + d.garis + '</b>.<br>' : 'Skala: tiap garis naik <b>' + d.garis + '</b>.<br>';
    if (q.jenis === 'nilai' && !d.pikto && d.nilai[q.i] % d.garis) { const lo = Math.floor(d.nilai[q.i] / d.garis) * d.garis; t += 'Batang berhenti di antara <b>' + lo + '</b> dan <b>' + (lo + d.garis) + '</b>, tepat di tengah.<br>'; }
    t += q.penjelasan + '.<br><small>' + (sebab || 'Kamu memilih ' + pilihTeks + '.') + '</small>';
    teksEl.innerHTML = t;
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GameBacaBatang = Object.assign({
    id: 'baca-batang',
    tingkat: ['piktogram & skala 1', 'skala 2, batang di antara dua garis', 'skala 5, selisih & jumlah'],
    ingat: 'Baca skala dulu: tiap garis di sumbu naik berapa. Nilai batang dibaca dari angka di sumbu. Selisih = dikurangi, jumlah = ditambah.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
