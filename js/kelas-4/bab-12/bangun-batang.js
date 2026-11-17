// Mini game 🏗️ Bangun Batang (Kelas 4 Bab 12).
// Tabel data -> atur tinggi tiap batang dengan ▲ ▼ di baris tabel atau ketuk kolom batang di diagram -> "Sudah" memeriksa -> (tingkat 1 soal 5, tingkat 2 soal 3-5, tingkat 3 semua) satu pertanyaan tentang diagram itu.
// Tingkat 1: 4 batang skala 1 · 2: 4-5 batang skala 2, nilai ganjil di tengah garis · 3: 5 batang skala 5 (garis tiap 5 atau tiap 10, nilai 15 di tengah garis).
// Batang yang salah = soal salah (tanpa percobaan ulang); penjelasan memperlihatkan tinggi yang benar. Cek: node tools/cek-bab12.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const G = modul ? require('./grafik.js') : root.Grafik;
  const { acak, pilih, buatData, dataContoh, tanya, teksOpsi, kodeData } = G;

  // ---------- Logika (tanpa DOM) ----------
  const ADA_TANYA = { 1: [0, 0, 0, 0, 1], 2: [0, 0, 1, 1, 1], 3: [1, 1, 1, 1, 1] };
  const JENIS_TANYA = { 1: ['paling'], 2: ['selisih', 'paling', 'jumlah2'], 3: ['selisih', 'jumlah', 'paling', 'jumlah2'] };
  const CONTOH = {
    1: [['buah', 1, ['paling', { sub: 'banyak' }]]],
    2: [['buku', 2, ['jumlah', {}]], ['buku', 2, ['selisih', { i: 3, j: 0 }]]],
    3: [['kue', 5, ['selisih', { i: 3, j: 2 }]], ['kue', 5, ['jumlah', {}]]],
  };
  function dataBangun(tingkat) {
    const n = tingkat === 1 ? 4 : tingkat === 2 ? acak(4, 5) : 5;
    if (tingkat === 1) return buatData({ n, min: 1, maks: 8, langkah: 1, garis: 1 });
    if (tingkat === 2) return buatData({ n, min: 2, maks: 13, langkah: 1, garis: 2, ganjil: 2 });
    const garis = pilih([5, 10]);
    const d = buatData({ n, min: 5, maks: 30, langkah: 5, garis });
    if (garis === 10 && d.nilai.filter((v) => v % 10).length < 2) return dataBangun(tingkat);
    return d;
  }
  function soalDari(tingkat, indeks, bukanKode) {
    for (let c = 0; c < 400; c++) {
      let d, q = null;
      const ct = CONTOH[tingkat];
      if (Math.random() < 0.12) { const x = pilih(ct); d = dataContoh(x[0], x[1]); d.langkah = x[0] === 'kue' ? 5 : 1; q = tanya(d, x[2][0], x[2][1]); }
      else { d = dataBangun(tingkat); if (ADA_TANYA[tingkat][indeks]) q = tanya(d, pilih(JENIS_TANYA[tingkat]), {}); }
      const kode = 'bgn' + d.garis + ':' + kodeData(d, q);
      if (kode === bukanKode) continue;
      return { jenis: 'bangun', tingkat, indeks, d, q, kode };
    }
    throw new Error('soal bangun gagal');
  }
  function buatRonde(tingkat) {
    for (;;) {
      const r = [0, 1, 2, 3, 4].map((i) => soalDari(tingkat, i));
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
  }
  function soalMirip(soal, tingkat) { for (let i = 0; i < 100; i++) { const s = soalDari(tingkat, soal.indeks, soal.kode); if (s.kode !== soal.kode) return s; } return soal; }
  // tinggi batang benar bila sama dengan data; mengembalikan daftar indeks yang salah
  const batangSalah = (d, tinggi) => d.nilai.map((v, i) => (tinggi[i] === v ? -1 : i)).filter((i) => i >= 0);
  const periksaTinggi = (soal, tinggi) => { const s = batangSalah(soal.d, tinggi); return { benar: s.length === 0, tahap: 'batang', tinggi: tinggi.slice(), salah: s }; };
  const periksaTanya = (soal, kode) => ({ benar: kode === soal.q.kunci, tahap: 'tanya', pilih: kode });
  const logika = { ADA_TANYA, CONTOH, dataBangun, soalDari, buatRonde, soalMirip, batangSalah, periksaTinggi, periksaTanya };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, diagramSvg } = G;

  function tampilkan(soal, wadah, kirim) {
    const d = soal.d, n = d.cats.length, st = d.langkah, tinggi = d.cats.map(() => 0);
    const judul = el('div', 'soal-teks soal-sedang', '<b>' + d.judul + '</b><br>Buat diagram batangnya sesuai tabel.');
    wadah.appendChild(judul);
    const baris = el('div', 'jg-baris'), tabel = el('div', 'gb-tabel gb-data');
    let diagram = null, bawah = el('div', 'gb-bawah');
    const nomor = [], tombolAtur = [];
    const gambar = () => {
      const baru = diagramSvg(d, tinggi, { lebar: G.KECIL() ? 500 : 540, tinggi: G.KECIL() ? 250 : 290, ketuk: (i, v) => { if (selesai) return; atur(i, v); }, langkah: st });
      if (diagram) diagram.replaceWith(baru); diagram = baru;
    };
    let selesai = false;
    const atur = (i, v) => { v = Math.max(0, Math.min(d.ymax, v)); if (v === tinggi[i]) return; tinggi[i] = v; Suara.efek('pop'); nomor[i].textContent = ''; gambar(); };
    d.cats.forEach((c, i) => {
      const b = el('div', 'gb-baris');
      b.appendChild(el('div', 'gb-nama', '<span class="gb-chip" style="background:' + c.warna + '"></span>' + (c.ikon ? '<span class="gb-ikon">' + c.ikon + '</span>' : '') + c.nama));
      b.appendChild(el('div', 'gb-nilai', String(d.nilai[i])));
      const bawahT = el('button', 'tombol gb-ud', '▼'), atasT = el('button', 'tombol gb-ud', '▲');
      bawahT.onclick = () => { if (!selesai) atur(i, tinggi[i] - st); };
      atasT.onclick = () => { if (!selesai) atur(i, tinggi[i] + st); };
      nomor.push(el('span')); tombolAtur.push(bawahT, atasT);
      b.append(bawahT, atasT);
      tabel.appendChild(b);
    });
    gambar();
    const kanan = el('div', 'gb-kanan-diagram');
    kanan.appendChild(diagram);
    baris.append(tabel, kanan);
    wadah.appendChild(baris);

    const tombolSudah = el('button', 'tombol tombol-utama gb-cek', '✓ Sudah');
    bawah.append(tombolSudah, el('div', 'ingat-kecil', 'Tinggi batang = angka di tabel. Ketuk ▲ ▼ atau ketuk kolom batang.<br>' + (d.garis !== d.langkah ? 'Tiap ketukan ▲ naik ' + st + ', batang bisa di tengah garis.' : 'Skala: tiap garis naik ' + d.garis + '.')));
    wadah.appendChild(bawah);

    tombolSudah.onclick = () => {
      if (selesai) return;
      const hasil = periksaTinggi(soal, tinggi);
      if (!hasil.benar) { selesai = true; kirim(hasil); return; }
      selesai = true; tombolAtur.forEach((b) => { b.disabled = true; });
      if (!soal.q) { kirim(hasil); return; }
      // satu pertanyaan tentang diagram yang baru dibuat
      Suara.efek('ding');
      judul.innerHTML = '<b>Batangnya sudah pas!</b><br>' + soal.q.teks;
      bawah.innerHTML = '';
      const opsiEl = el('div', 'hs-opsi');
      soal.q.opsi.forEach((o) => {
        const b = el('button', 'tombol', (o.ikon ? o.ikon + ' ' : '') + o.teks);
        b.onclick = () => kirim(periksaTanya(soal, o.kode));
        opsiEl.appendChild(b);
      });
      bawah.appendChild(opsiEl);
    };
  }

  function pujian(soal) { return { html: soal.q ? soal.q.penjelasan : 'Semua batang sesuai tabel.' }; }

  function alasan(soal, jawaban, wadah) {
    const d = soal.d, baris = el('div', 'alasan-baris'), tempat = el('div', 'sudut-tempat'), teksEl = el('div', 'kotak-teks', '');
    if (jawaban.tahap === 'tanya') {
      const q = soal.q, sebab = q.sebab[jawaban.pilih];
      tempat.appendChild(diagramSvg(d, d.nilai, { lebar: 440, tinggi: 250, kecil: true, labelNilai: true, sorot: q.jenis === 'selisih' || q.jenis === 'jumlah2' ? [q.i, q.j] : q.jenis === 'paling' ? [Number(q.kunci)] : [] }));
      teksEl.innerHTML = 'Skala: tiap garis naik <b>' + d.garis + '</b>.<br>' + q.penjelasan + '.<br><small>' + (sebab || 'Kamu memilih ' + teksOpsi(q, jawaban.pilih) + '.') + '</small>';
    } else {
      tempat.appendChild(diagramSvg(d, jawaban.tinggi, { lebar: 440, tinggi: 250, kecil: true, target: d.nilai, salah: jawaban.salah }));
      const s = jawaban.salah.slice(0, 2).map((i) => '<b>' + d.cats[i].nama + '</b> = ' + d.nilai[i] + ' (kamu membuat ' + jawaban.tinggi[i] + ')');
      const i0 = jawaban.salah[0], pas = d.nilai[i0], lo = Math.floor(pas / d.garis) * d.garis;
      teksEl.innerHTML = 'Garis putus-putus hijau = tinggi yang benar.<br>' + s.join('<br>') + '<br><small>Skala: tiap garis naik ' + d.garis + '. ' + (pas % d.garis ? pas + ' ada di tengah antara ' + lo + ' dan ' + (lo + d.garis) + '.' : 'Cari angka ' + pas + ' di sumbu.') + '</small>';
    }
    baris.append(tempat, teksEl);
    wadah.appendChild(baris);
  }

  root.GameBangunBatang = Object.assign({
    id: 'bangun-batang',
    tingkat: ['4 batang, skala 1', 'skala 2, batang di tengah garis', 'skala 5, batang di tengah garis'],
    ingat: 'Tinggi batang = angka di tabel. Cari angkanya di sumbu, atur tinggi batang sampai tepat. Batang bisa berhenti di tengah antara dua garis.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
