// Mini game 🔄 Tukar Bentuk (Kelas 4 Bab 7): persen <-> pecahan <-> desimal.
// Soal 1-3: cocokkan pasangan (50% = 1/2 = 0,5): pilih bentuk yang sama nilainya dari 4 pilihan.
// Soal 4-5: isi bentuk yang hilang (3/4 = …% · 0,2 = …% · 30% = …/10), pilihan ganda.
// Tingkat 1: 50%, 25%, 75%, 10% · 2: k/5, k/10, k/20 · 3: campuran tiga arah + desimal 2 angka (0,35).
// Semua jawaban dihitung kode (bilangan bulat). Cek logika: node tools/cek-bab7.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const P = modul ? require('./persen.js') : root.Persen;
  const { acak, pilih, kocok, pecahanPersen, desimalPersen, teksBentuk, opsiTukar, opsiBilangan, bentukDariPersen, teksMp, fpb } = P;

  // ---------- Logika (tanpa DOM) ----------
  const L1 = [10, 25, 50, 75];
  const L2 = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  const L3 = L2.concat([2, 4, 6, 8, 12, 16, 24, 32, 36, 44]);
  const POOL = [null, L1, L2, L3];
  const PASANGAN_12 = ['p>f', 'p>d', 'd>p', 'f>p'];
  const PASANGAN_3 = ['p>f', 'p>d', 'd>p', 'f>p', 'f>d', 'd>f'];
  const PENYEBUT = { 1: [2, 4, 10], 2: [5, 10, 20], 3: [20, 25, 50, 10, 5] };

  function soalTukar(tingkat, pakaiP, pasang, pakai) {
    const pool = POOL[tingkat];
    for (let c = 0; c < 500; c++) {
      const p = pilih(pool);
      if (pakaiP && pakaiP.has(p)) continue;
      const [dari, ke] = pasang.split('>');
      const kode = 't' + pasang + p;
      if (pakai && pakai.has(kode)) continue;
      const o = opsiTukar(ke, p);
      if (!o) continue;
      if (pakaiP) pakaiP.add(p);
      if (pakai) pakai.add(kode);
      return { jenis: 'tukar', tingkat, p, dari, ke, sumber: bentukDariPersen(dari, p), kunci: o.kunci, opsi: o.opsi, kode };
    }
    throw new Error('soalTukar gagal');
  }

  function soalIsi(tingkat, sub, pakai) {
    const pool = POOL[tingkat];
    for (let c = 0; c < 500; c++) {
      const p = pilih(pool);
      const kode = 'i' + sub + p;
      if (pakai && pakai.has(kode)) continue;
      if (sub === 'pb') {
        const bs = PENYEBUT[tingkat].filter((b) => (p * b) % 100 === 0 && (p * b) / 100 >= 1);
        if (!bs.length) continue;
        const b = pilih(bs), a = (p * b) / 100;
        const opsi = opsiBilangan(a, [{ v: p, salah: 'sama' }, { v: b - a, salah: 'sisa' }, { v: a + 1, salah: 'dekat' }, { v: a - 1, salah: 'dekat' }, { v: a * 2, salah: 'dekat' }, { v: a + 2, salah: 'dekat' }, { v: a * 10, salah: 'dekat' }]);
        if (!opsi) continue;
        if (pakai) pakai.add(kode);
        return { jenis: 'isi', sub, tingkat, p, a, b, kunci: a, opsi, kode };
      }
      const o = opsiTukar('p', p);
      if (!o) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'isi', sub, tingkat, p, sumber: bentukDariPersen(sub === 'fp' ? 'f' : 'd', p), kunci: p * 100, opsi: o.opsi, kode };
    }
    throw new Error('soalIsi gagal');
  }

  function buatRonde(tingkat) {
    for (;;) {
      const pakai = new Set(), pakaiP = new Set();
      const pasang = kocok(tingkat === 3 ? PASANGAN_3 : PASANGAN_12).slice(0, 3);
      const sub = kocok(['fp', 'dp', 'pb']).slice(0, 2);
      const r = pasang.map((x) => soalTukar(tingkat, pakaiP, x, pakai)).concat(sub.map((x) => soalIsi(tingkat, x, pakai)));
      if (new Set(r.slice(0, 3).map((s) => teksBentuk(s.kunci))).size > 1) return r;
    }
  }

  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'tukar') return soalTukar(tingkat, null, soal.dari + '>' + soal.ke, pakai);
    return soalIsi(tingkat, soal.sub, pakai);
  }

  function periksaPilih(soal, o) {
    if (soal.jenis === 'tukar') return { benar: P.senilai(o, soal.sumber), pilih: o };
    if (soal.sub === 'pb') return { benar: o.v === soal.kunci, pilih: o };
    return { benar: o.m === soal.kunci, pilih: o };
  }

  const logika = { L1, L2, L3, buatRonde, soalTukar, soalIsi, soalMirip, periksaPilih };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, htmlBentuk } = P;
  const html = (p, k) => root.Pecahan.html(p, k);
  const NAMA = { p: 'persen', f: 'pecahan', d: 'desimal' };

  function tampilkan(soal, wadah, kirim) {
    let kepala, kiri;
    if (soal.jenis === 'tukar') {
      kepala = 'Ubah ke bentuk <b class="merah">' + NAMA[soal.ke] + '</b>.<br><small>Pilih yang nilainya sama.</small>';
      kiri = '<span class="des-angka des-raksasa">' + htmlBentuk(soal.sumber, soal.dari === 'f' ? 'pec-raksasa' : '') + '</span><span class="des-sama">=</span><span class="kotak-tanda">?</span>';
    } else if (soal.sub === 'pb') {
      kepala = 'Isi bagian yang hilang.';
      kiri = '<span class="des-angka des-raksasa">' + soal.p + '%</span><span class="des-sama">=</span><span class="des-angka des-raksasa">' + root.Pecahan.html(['?', soal.b], 'pec-raksasa') + '</span>';
    } else {
      kepala = 'Isi bagian yang hilang.';
      kiri = '<span class="des-angka des-raksasa">' + htmlBentuk(soal.sumber, soal.sub === 'fp' ? 'pec-raksasa' : '') + '</span><span class="des-sama">=</span><span class="kotak-tanda">?</span><span class="des-angka des-raksasa">%</span>';
    }
    wadah.appendChild(el('div', 'soal-teks soal-sedang', kepala));
    wadah.appendChild(el('div', 'des-baris', kiri));
    const opsi = el('div', 'des-opsi');
    soal.opsi.forEach((o) => {
      let isi;
      if (soal.jenis === 'tukar') isi = htmlBentuk(o);
      else if (soal.sub === 'pb') isi = String(o.v);
      else isi = teksMp(o.m).replace('%', '');
      const b = el('button', 'tombol tombol-des', isi);
      b.onclick = () => kirim(periksaPilih(soal, o));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  // ---------- umpan balik ----------
  function jawabanTeks(soal) {
    const p = soal.p, [a, b] = pecahanPersen(p);
    return html([a, b]) + ' = <b>' + p + '%</b> = <b>' + teksBentuk(P.bentukDesimal(desimalPersen(p))) + '</b>';
  }
  const pujian = (soal) => ({ html: jawabanTeks(soal) });

  const PETUNJUK = {
    persepuluh: 'Hati-hati koma! Persen = per <b>100</b>. 50% = 0,5 tetapi 5% = 0,05.',
    perseratus: 'Hati-hati koma! Persen = per <b>100</b>. 50% = 0,5 tetapi 5% = 0,05.',
    kali10: 'Hati-hati koma! Persen = per <b>100</b>. 50% = 0,5 tetapi 5% = 0,05.',
    bagi10: 'Hati-hati koma! Persen = per <b>100</b>. 50% = 0,5 tetapi 5% = 0,05.',
    sisa: 'Itu bagian sisanya, bukan bagian itu sendiri.',
    terbalik: 'Pembilang dan penyebut tertukar.',
    sama: 'Angka persen tidak boleh dipakai langsung sebagai pembilang.',
  };

  function alasan(soal, jawaban, wadah) {
    const p = soal.p, [a, b] = pecahanPersen(p), k = 100 / b;
    const d = teksBentuk(P.bentukDesimal(desimalPersen(p)));
    const baris = el('div', 'alasan-baris');
    const isi = el('div', 'kotak-teks',
      'Ubah penyebutnya jadi <b>100</b>:<br>' +
      html([a, b]) + ' = ' + html([a + ' &times; ' + k, b + ' &times; ' + k]) + ' = ' + html([p, 100]) + ' (&times; ' + k + ' atas dan bawah)<br>' +
      html([p, 100]) + ' = <b>' + p + '%</b> (persen = per seratus) = <b>' + d + '</b>');
    const o = jawaban.pilih;
    if (o && o.salah && PETUNJUK[o.salah]) {
      const dipilih = soal.jenis === 'isi' ? (soal.sub === 'pb' ? o.v : teksMp(o.m).replace('%', '')) : teksBentuk(o);
      isi.innerHTML += '<br><small>Kamu memilih ' + dipilih + '. ' + PETUNJUK[o.salah] + '</small>';
    }
    baris.appendChild(isi);
    wadah.appendChild(baris);
  }

  root.GameTukarPersen = Object.assign({
    id: 'tukar-persen',
    tingkat: ['50%, 25%, 75%, 10%', 'per 5, 10, 20', 'campuran tiga arah'],
    ingat: 'Persen = per seratus. 50% = 50/100 = 1/2 = 0,5. Hati-hati: 5% = 0,05, bukan 0,5.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
