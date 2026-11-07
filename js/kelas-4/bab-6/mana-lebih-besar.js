// Mini game ⚖️ Mana Lebih Besar (Kelas 4 Bab 6): membandingkan & mengurutkan desimal.
// Soal 1-3: "0,5 ☐ 0,45" -> ketuk <, =, atau >.  Soal 4-5: urutkan 3-4 desimal dari terkecil (ketuk berurutan).
// Tingkat 1: persepuluhan · 2: 1-2 angka di belakang koma (campuran) · 3: sampai perseribuan.
// Jebakan yang dilatih: "angka lebih panjang = lebih besar" (0,45 < 0,5), 0,6 = 0,60, 2,05 < 2,5.
// Semua jawaban dihitung kode (bilangan bulat perseribuan). Cek logika: node tools/cek-bab6.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const D = modul ? require('./desimal.js') : root.Desimal;
  const { des, teks, mil, lit, minimal, banding, senilai, SIMBOL, acak, pilih, kocok, pilihBobot } = D;

  // ---------- Logika (tanpa DOM) ----------
  const intAcak = () => pilih([0, 0, 0, 1, 1, 2, 3]);
  const digitAkhir = () => acak(1, 9);       // angka terakhir tidak boleh 0 (kecuali jenis "sama")
  const f = (...a) => a.join('');

  // pasangan [A, B] menurut jenis; jenis: acak1, panjang, sama, nol, acak2, panjang3, sama3, nol3, acak3
  function pasang(jenis) {
    const i = intAcak();
    let x, y, z, p, q, r;
    switch (jenis) {
      case 'acak1': { // persepuluhan, kadang bagian utuhnya beda
        x = acak(1, 9); y = acak(1, 9);
        if (Math.random() < 0.25) return [lit(i, f(x)), lit(pilih([0, 1, 2, 3].filter((v) => v !== i)), f(y))];
        if (x === y) y = x === 9 ? 8 : x + 1;
        return [lit(i, f(x)), lit(i, f(y))];
      }
      case 'panjang': // 0,5 dan 0,45: angka lebih panjang, tapi lebih kecil
        x = acak(2, 9); y = acak(1, x - 1); z = digitAkhir();
        return [lit(i, f(x)), lit(i, f(y, z))];
      case 'sama': x = acak(1, 9); return [lit(i, f(x)), lit(i, f(x, 0))]; // 0,6 dan 0,60
      case 'nol': z = acak(1, 9); x = acak(1, 9); return [lit(i, f(0, z)), lit(i, f(x))]; // 2,05 dan 2,5
      case 'acak2': {
        const la = pilih([1, 2, 2]), lb = pilih([2, 2, 1]);
        const gen = (l) => (l === 1 ? f(acak(1, 9)) : f(acak(0, 9), digitAkhir()));
        const j = Math.random() < 0.15 ? i + 1 : i;
        return [lit(i, gen(la)), lit(j, gen(lb))];
      }
      case 'panjang3': { // 0,5 (atau 0,52) dan 0,499: lebih panjang tapi lebih kecil
        x = acak(2, 9); y = acak(1, x - 1);
        const A = Math.random() < 0.5 ? f(x) : f(x, acak(1, 9));
        return [lit(i, A), lit(i, f(y, acak(0, 9), digitAkhir()))];
      }
      case 'sama3': { // 0,45 dan 0,450
        const a = Math.random() < 0.5 ? f(acak(1, 9)) : f(acak(1, 9), digitAkhir());
        const lb = acak(a.length + 1, 3);
        return [lit(i, a), lit(i, a + '0'.repeat(lb - a.length))];
      }
      case 'nol3': // 0,45 dan 0,405 (atau 0,4 dan 0,045)
        p = acak(1, 9); q = digitAkhir();
        return Math.random() < 0.65 ? [lit(i, f(p, q)), lit(i, f(p, 0, q))] : [lit(i, f(p)), lit(i, f(0, p, q))];
      case 'acak3': { // 0,34 dan 0,347 / 0,34 dan 0,327
        p = acak(1, 9); q = digitAkhir(); r = digitAkhir();
        const q2 = Math.random() < 0.5 ? q : acak(0, 9);
        return [lit(i, f(p, q)), lit(i, f(p, q2, r))];
      }
    }
    throw new Error('jenis tidak dikenal ' + jenis);
  }

  function soalBanding(tingkat, jenis, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      let [a, b] = pasang(jenis);
      const sama = senilai(a, b);
      if (sama !== (jenis === 'sama' || jenis === 'sama3')) continue; // hanya jenis "sama" yang boleh "="
      if (a.n === b.n && a.d === b.d) continue;                       // tulisan harus beda
      if (Math.max(a.d, b.d) > 3) continue;
      if (Math.random() < 0.5) [a, b] = [b, a];
      const kode = [teks(a), teks(b)].sort().join('|');
      if (pakai && pakai.has(kode)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'banding', tingkat, pola: jenis, p: a, q: b, tanda: banding(a, b), kode };
    }
    throw new Error('soalBanding gagal ' + jenis);
  }

  const POLA = {
    1: [['acak1'], ['acak1'], ['acak1']],
    2: [['panjang'], [['nol', 3], ['sama', 3], ['acak2', 2], ['panjang', 2]], [['acak2', 3], ['nol', 2], ['sama', 2], ['panjang', 2]]],
    3: [['panjang3'], [['nol3', 3], ['sama3', 3], ['acak3', 2]], [['acak3', 3], ['nol3', 2], ['panjang3', 2], ['sama3', 1]]],
  };
  const jenisPola = (spec) => (Array.isArray(spec[0]) ? pilihBobot(spec) : pilih(spec));

  function banyakBanding(tingkat, pakai) {
    for (let coba = 0; coba < 60; coba++) {
      const kumpul = new Set(pakai);
      const hasil = POLA[tingkat].map((spec) => soalBanding(tingkat, jenisPola(spec), kumpul));
      if (new Set(hasil.map((s) => s.tanda)).size === 1) continue; // jawaban tidak boleh semua sama
      kumpul.forEach((k) => pakai.add(k));
      return hasil;
    }
    throw new Error('banyakBanding gagal');
  }

  function soalUrut(tingkat, pakai) {
    for (let coba = 0; coba < 800; coba++) {
      const i = intAcak(), n = tingkat === 1 ? 4 : acak(3, 4);
      let daftar = [];
      if (tingkat === 1) {
        const dig = kocok([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n);
        const campur = Math.random() < 0.3;
        daftar = dig.map((x) => lit(campur ? i + acak(0, 1) : i, f(x)));
      } else {
        // pasangan jebakan: yang lebih pendek tapi lebih besar (0,5 dan 0,45)
        const x = acak(2, 9), y = acak(1, x - 1);
        if (tingkat === 2) daftar.push(lit(i, f(x)), lit(i, f(y, digitAkhir())));
        else daftar.push(lit(i, Math.random() < 0.5 ? f(x) : f(x, acak(1, 9))), lit(i, f(y, acak(0, 9), digitAkhir())));
        let g = 0;
        while (daftar.length < n && g++ < 80) {
          const j = Math.random() < 0.25 ? i + 1 : i;
          const m = tingkat === 2 ? j * 1000 + acak(1, 99) * 10 : j * 1000 + acak(1, 999);
          if (m % 1000 === 0) continue;
          const v = minimal(m);
          if (daftar.some((u) => senilai(u, v))) continue;
          daftar.push(v);
        }
        if (daftar.length < n) continue;
      }
      let beda = true;
      for (let a = 0; a < daftar.length; a++) for (let b = a + 1; b < daftar.length; b++) if (senilai(daftar[a], daftar[b])) beda = false;
      if (!beda) continue;
      const urut = daftar.slice().sort((a, b) => mil(a) - mil(b));
      const kode = 'u' + urut.map(teks).join(' ');
      if (pakai && pakai.has(kode)) continue;
      daftar = kocok(daftar);
      if (sudahUrut(daftar)) daftar = daftar.slice().reverse();
      if (sudahUrut(daftar)) continue;
      if (pakai) pakai.add(kode);
      return { jenis: 'urut', tingkat, daftar, urut, kode };
    }
    throw new Error('soalUrut gagal');
  }
  function sudahUrut(arr) { for (let i = 1; i < arr.length; i++) if (mil(arr[i - 1]) >= mil(arr[i])) return false; return true; }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return banyakBanding(tingkat, pakai).concat([soalUrut(tingkat, pakai), soalUrut(tingkat, pakai)]);
  }
  function soalMirip(soal, tingkat) {
    const pakai = new Set([soal.kode]);
    if (soal.jenis === 'banding') {
      // pola sama dengan soal asal (mis. "panjang") supaya jebakannya tetap dilatih
      return soalBanding(tingkat, soal.pola, pakai);
    }
    return soalUrut(tingkat, pakai);
  }

  const periksaBanding = (soal, tanda) => ({ tanda, benar: tanda === soal.tanda });
  const periksaUrut = (soal, urutan) => ({ urutan, benar: urutan.length === soal.daftar.length && sudahUrut(urutan) });

  const logika = { soalBanding, soalUrut, buatRonde, soalMirip, periksaBanding, periksaUrut, sudahUrut, pasang, POLA };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, kotakSeratus, tabelTempat, kolomBeda } = D;
  const KATA = { '-1': 'lebih kecil', '0': 'sama', '1': 'lebih besar' };
  const lambang = (t) => SIMBOL[t].replace('<', '&lt;').replace('>', '&gt;');
  const NAMA_KOLOM = ['satuan', 'persepuluhan', 'perseratusan', 'perseribuan'];
  const BIRU = '#3A86FF', ORANYE = '#FF8A3D';
  const angka = (x, kelas) => '<span class="des-angka ' + (kelas || '') + '">' + teks(x) + '</span>';

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'banding') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Isi kotaknya: <b>&lt;</b>, <b>=</b>, atau <b>&gt;</b>?'));
      wadah.appendChild(el('div', 'banding-baris', angka(soal.p, 'des-raksasa') + '<span class="kotak-tanda">?</span>' + angka(soal.q, 'des-raksasa')));
      const baris = el('div', 'pilihan pilihan-tanda');
      [-1, 0, 1].forEach((t) => {
        const b = el('button', 'tombol tombol-tanda', lambang(t) + '<small>' + KATA[t] + '</small>');
        b.onclick = () => kirim(periksaBanding(soal, t));
        baris.appendChild(b);
      });
      wadah.appendChild(baris);
      return;
    }
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Urutkan dari yang <b class="biru">terkecil</b>'));
    const urutan = [];
    const slot = el('div', 'urut-slot');
    const kolam = el('div', 'urut-kolam');
    const cek = el('button', 'tombol tombol-utama', '✓ Cek');
    const gambar = () => {
      slot.innerHTML = '';
      soal.daftar.forEach((_, i) => {
        const p = urutan[i];
        const s = el('button', 'kartu-slot' + (p ? ' isi' : ''), (p ? angka(p) : '') + '<small>' + (i === 0 ? 'terkecil' : i === soal.daftar.length - 1 ? 'terbesar' : i + 1) + '</small>');
        if (p) s.onclick = () => { urutan.splice(i, 1); Suara.efek('pop'); gambar(); };
        slot.appendChild(s);
      });
      kolam.innerHTML = '';
      soal.daftar.forEach((p) => {
        const dipakai = urutan.includes(p);
        const k = el('button', 'tombol tombol-pec tombol-des-kecil' + (dipakai ? ' terpakai' : ''), teks(p));
        k.onclick = () => { if (urutan.includes(p)) return; urutan.push(p); Suara.efek('pop'); gambar(); };
        kolam.appendChild(k);
      });
      cek.disabled = urutan.length < soal.daftar.length;
    };
    cek.onclick = () => { if (urutan.length === soal.daftar.length) kirim(periksaUrut(soal, urutan.slice())); };
    wadah.append(slot, kolam, cek);
    wadah.appendChild(el('div', 'ingat-kecil', 'Ketuk angka satu per satu, mulai yang terkecil. Ketuk kotak atas untuk membatalkan.'));
    gambar();
  }

  const dariMil0 = (x) => D.dariMil(mil(x) % 1000, Math.max(1, x.d));
  const nolTambah = (x, d) => des(x.n * Math.pow(10, d - x.d), d);

  function pujian(soal) {
    if (soal.jenis === 'banding') {
      const t = soal.tanda;
      const dm = Math.max(soal.p.d, soal.q.d);
      const pad = soal.p.d !== soal.q.d ? '<br><small>(' + teks(nolTambah(soal.p, dm)) + ' ' + lambang(t) + ' ' + teks(nolTambah(soal.q, dm)) + ')</small>' : '';
      return { html: teks(soal.p) + ' <b>' + lambang(t) + '</b> ' + teks(soal.q) + pad };
    }
    return { html: soal.urut.map(teks).join(' &lt; ') };
  }

  // gambar kotak seratus untuk bagian di belakang koma (dm <= 2): kolom penuh biru, sisa oranye
  function kotakBagian(x, dm, judul) {
    const k = (mil(x) % 1000) / 10; // perseratus
    const { kolom } = D.kolomSisa(k);
    const w = el('div', 'alasan-gambar');
    w.appendChild(kotakSeratus({ ukuran: 190, warnaFn: (i) => (i < kolom * 10 ? BIRU : i < k ? ORANYE : null) }).svg);
    w.appendChild(el('div', 'label-kecil', judul));
    if (Math.floor(mil(x) / 1000)) w.appendChild(el('div', 'label-kecil redup', 'yang diwarnai: ' + teks(dariMil0(x))));
    return w;
  }

  function kalimatBanding(soal) {
    const { p, q, tanda } = soal;
    const dm = Math.max(p.d, q.d), kb = kolomBeda(p, q);
    const hasil = teks(p) + ' <b>' + lambang(tanda) + '</b> ' + teks(q);
    let kata = '';
    const utuhSama = Math.floor(mil(p) / 1000) === Math.floor(mil(q) / 1000);
    if (utuhSama && Math.floor(mil(p) / 1000) > 0) kata += 'Bagian utuhnya sama (' + Math.floor(mil(p) / 1000) + '), jadi lihat bagian di belakang koma.<br>';
    if (kb === 0) {
      const a = Math.floor(mil(p) / 1000), b = Math.floor(mil(q) / 1000);
      return 'Lihat bagian <b>utuhnya</b> dulu: ' + a + ' ' + (a > b ? '&gt;' : '&lt;') + ' ' + b + '. Jadi ' + hasil + '.';
    }
    if (p.d !== q.d) {
      const pendek = p.d < q.d ? p : q;
      kata += 'Samakan banyak angka di belakang koma: <b>' + teks(pendek) + '</b> = <b>' + teks(nolTambah(pendek, dm)) + '</b> (tambah nol di belakang).<br>';
    }
    if (kb === -1) return kata + 'Nol di belakang tidak mengubah nilai. Jadi ' + hasil + '.';
    const pp = nolTambah(p, dm), qq = nolTambah(q, dm);
    const dig = (x) => Math.floor(mil(x) / Math.pow(10, 3 - kb)) % 10;
    return kata + 'Banding dari kiri: beda pertama di <b>' + NAMA_KOLOM[kb] + '</b>, ' + dig(pp) + ' ' + (dig(pp) > dig(qq) ? '&gt;' : '&lt;') + ' ' + dig(qq) + '. Jadi ' + hasil + '.';
  }

  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'banding') {
      const { p, q } = soal, dm = Math.max(p.d, q.d), kb = kolomBeda(p, q);
      const kolom = el('div', 'des-alasan');
      kolom.appendChild(el('div', 'kotak-teks', kalimatBanding(soal) + '<br><small>Kamu memilih "' + lambang(jawaban.tanda) + '".</small>'));
      const samaUtuh = Math.floor(mil(p) / 1000) === Math.floor(mil(q) / 1000);
      if (dm <= 2 && samaUtuh) {
        const baris = el('div', 'alasan-baris alasan-gambar-baris');
        baris.append(kotakBagian(p, dm, teks(nolTambah(p, dm))), kotakBagian(q, dm, teks(nolTambah(q, dm))));
        kolom.appendChild(baris);
      } else {
        const w = el('div', 'tabel-wadah', tabelTempat([p, q], { sorotKolom: kb }));
        kolom.appendChild(w);
      }
      wadah.appendChild(kolom);
      return;
    }
    const kolom = el('div', 'des-alasan');
    kolom.appendChild(el('div', 'kotak-teks', 'Urutan yang benar: ' + soal.urut.map(teks).join(' &lt; ') + '.<br><small>Samakan banyak angka di belakang koma, lalu bandingkan dari kiri.</small>'));
    kolom.appendChild(el('div', 'tabel-wadah', tabelTempat(soal.urut)));
    wadah.appendChild(kolom);
  }

  root.GameManaLebihBesar = Object.assign({
    id: 'mana-lebih-besar',
    tingkat: ['persepuluhan', '1 – 2 angka di belakang koma', 'sampai perseribuan'],
    ingat: 'Samakan banyak angka di belakang koma (0,5 = 0,50), lalu bandingkan dari kiri. Angka lebih panjang belum tentu lebih besar!',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
