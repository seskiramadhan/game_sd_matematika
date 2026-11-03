// Mini game 🍫 Cokelat Kembar (Kelas 4 Bab 4): pecahan senilai & menyederhanakan.
// Soal 1-3: "a/b sama dengan?" -> pilih pecahan senilai (pengecoh: atas & bawah DITAMBAH bilangan sama, hanya satu yang dikali).
// Soal 4-5: "Sederhanakan sampai habis": ketuk bilangan pembagi berulang kali, lalu "Sudah paling sederhana".
//           Berhenti di tengah (mis. 12/16 -> 6/8) = belum selesai.
// Semua jawaban dihitung oleh kode (FPB). Cek logika: node tools/cek-bab4.js
(function (root) {
  const P = (typeof module !== 'undefined' && module.exports) ? require('./pecahan.js') : root.Pecahan;
  const { fpb, sederhana, senilai, faktorPrima, kocok, pilihBobot, PENEKANAN } = P;

  // ---------- Logika (tanpa DOM) ----------
  const MAKS = { 1: 8, 2: 12, 3: 24 };
  const MIN_PENYEBUT_BESAR = { 1: 2, 2: 6, 3: 10 }; // penyebut terbesar di soal minimal segini (supaya tingkat terasa beda)
  const PEMBAGI = [2, 3, 4, 5, 6, 7, 8, 9];
  const tekan = (b) => PENEKANAN.includes(b);

  // semua pasangan (soal, jawaban) senilai dalam batas tingkat; salah satu penyebut kelipatan yang lain
  function daftarSenilai(tingkat) {
    const B = MAKS[tingkat], hasil = [];
    for (let y = 2; y <= B; y++) for (let x = 1; x < y; x++) {
      if (fpb(x, y) !== 1) continue;
      const kMaks = Math.floor(B / y);
      for (let k1 = 1; k1 <= kMaks; k1++) for (let k2 = 1; k2 <= kMaks; k2++) {
        if (k1 === k2 || (k2 % k1 && k1 % k2)) continue;
        const q = [x * k1, y * k1], j = [x * k2, y * k2];
        if (Math.max(q[1], j[1]) < MIN_PENYEBUT_BESAR[tingkat]) continue;
        hasil.push([[q, j], tekan(q[1]) || tekan(j[1]) ? 3 : 1]);
      }
    }
    return hasil;
  }
  const CACHE = {};
  const senilaiT = (t) => CACHE['s' + t] || (CACHE['s' + t] = daftarSenilai(t));

  function pengecoh(q, j, B) {
    const [a, b] = q, [c, d] = j;
    const sah = (p) => Number.isInteger(p[0]) && Number.isInteger(p[1]) && p[0] >= 1 && p[0] < p[1] && p[1] <= B;
    const tambah = [], lain = [];
    const m = d - b; // selisih penyebut
    tambah.push([a + m, b + m]);          // atas & bawah ditambah bilangan yang sama
    tambah.push([c, b + (c - a)]);        // pembilang benar, penyebut ditambah selisih yang sama
    tambah.push([a + m, d]);              // penyebut benar, pembilang ditambah selisih penyebut
    lain.push([c, b], [a, d]);            // hanya satu yang dikali / dibagi
    lain.push([c + 1, d], [c - 1, d], [c, d + 1], [c, d - 1], [c + 2, d]);
    const hasil = [];
    const coba = (p, jenis) => {
      if (!sah(p) || senilai(p, q) || hasil.some((h) => senilai(h.p, p))) return false;
      hasil.push({ p, jenis });
      return true;
    };
    // pengecoh "ditambah" selalu ada bila mungkin
    for (const p of kocok(tambah)) if (coba(p, 'tambah')) break;
    for (const p of kocok(lain.slice(0, 2))) { if (hasil.length >= 3) break; coba(p, 'satu'); }
    for (const p of kocok(lain.slice(2).concat(tambah))) { if (hasil.length >= 3) break; coba(p, tambah.includes(p) ? 'tambah' : 'dekat'); }
    return hasil;
  }

  function soalSenilai(tingkat, pakai) {
    const B = MAKS[tingkat];
    for (let coba = 0; coba < 300; coba++) {
      const [q, j] = pilihBobot(senilaiT(tingkat));
      const kunci = q[0] + '/' + q[1];
      if (pakai && pakai.has(kunci)) continue;
      const salah = pengecoh(q, j, B);
      if (salah.length < 3) continue;
      if (pakai) pakai.add(kunci);
      const opsi = kocok([{ p: j, jenis: 'benar' }].concat(salah));
      return { jenis: 'senilai', q, j, opsi, tingkat };
    }
    throw new Error('soalSenilai gagal');
  }

  // pecahan yang bisa disederhanakan; FPB hanya memuat faktor 2, 3, 5, 7 (ada di tombol pembagi)
  function daftarSederhana(tingkat) {
    const B = MAKS[tingkat], hasil = [];
    const bMin = { 1: 4, 2: 6, 3: 10 }[tingkat];
    for (let b = bMin; b <= B; b++) for (let a = 1; a < b; a++) {
      const g = fpb(a, b);
      if (g === 1) continue;
      if (!faktorPrima(g).every((f) => f <= 7)) continue;
      const majemuk = faktorPrima(g)[0] !== g; // FPB bukan bilangan prima (4, 6, 8, 9, ...)
      const s = sederhana([a, b]);
      let w = majemuk ? 3 : 1; // FPB bukan prima: ada jebakan "berhenti di tengah"
      if (tekan(b) || tekan(s[1])) w *= 2;
      hasil.push([[a, b], w]);
    }
    return hasil;
  }
  const sederhanaT = (t) => CACHE['d' + t] || (CACHE['d' + t] = daftarSederhana(t));

  function soalSederhana(tingkat, pakai) {
    for (let coba = 0; coba < 300; coba++) {
      const p = pilihBobot(sederhanaT(tingkat));
      const kunci = 'd' + p[0] + '/' + p[1];
      if (pakai && pakai.has(kunci)) continue;
      if (pakai) pakai.add(kunci);
      return { jenis: 'sederhana', p, akhir: sederhana(p), fpb: fpb(p[0], p[1]), tingkat };
    }
    throw new Error('soalSederhana gagal');
  }

  function buatRonde(tingkat) {
    const pakai = new Set();
    return [soalSenilai(tingkat, pakai), soalSenilai(tingkat, pakai), soalSenilai(tingkat, pakai), soalSederhana(tingkat, pakai), soalSederhana(tingkat, pakai)];
  }

  function soalMirip(soal, tingkat) {
    if (soal.jenis === 'senilai') return soalSenilai(tingkat, new Set([soal.q[0] + '/' + soal.q[1]]));
    return soalSederhana(tingkat, new Set(['d' + soal.p[0] + '/' + soal.p[1]]));
  }

  function periksaSenilai(soal, o) { return { pilih: o.p, jenisSalah: o.jenis, benar: senilai(o.p, soal.q) && o.p[1] !== soal.q[1] }; }

  // langkah: array bilangan pembagi yang diketuk berurutan; selesai: anak menekan "sudah paling sederhana"
  function jalankan(p, langkah) {
    let s = p.slice();
    const jejak = [s.slice()];
    for (const d of langkah) {
      if (s[0] % d || s[1] % d) return { s, jejak, salahBagi: d };
      s = [s[0] / d, s[1] / d];
      jejak.push(s.slice());
    }
    return { s, jejak, salahBagi: null };
  }
  function periksaSederhana(soal, langkah, selesai) {
    const r = jalankan(soal.p, langkah);
    if (r.salahBagi) return { benar: false, alasan: 'pembagi', d: r.salahBagi, sekarang: r.s, jejak: r.jejak };
    if (!selesai) return null; // belum dijawab
    if (fpb(r.s[0], r.s[1]) !== 1) return { benar: false, alasan: 'berhenti', sekarang: r.s, jejak: r.jejak };
    return { benar: true, sekarang: r.s, jejak: r.jejak };
  }
  // jalan "sampai habis" dengan pembagi prima terkecil berulang (untuk ditunjukkan saat salah)
  function jalanHabis(p) {
    const jejak = [p.slice()], bagi = [];
    let s = p.slice();
    while (fpb(s[0], s[1]) > 1) {
      const d = faktorPrima(fpb(s[0], s[1]))[0];
      s = [s[0] / d, s[1] / d];
      bagi.push(d); jejak.push(s.slice());
    }
    return { jejak, bagi };
  }

  const logika = { MAKS, PEMBAGI, daftarSenilai, daftarSederhana, pengecoh, soalSenilai, soalSederhana, buatRonde, soalMirip, periksaSenilai, periksaSederhana, jalankan, jalanHabis };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, html, batang, barisBatang } = P;
  const COK = { cokelat: true };

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'senilai') {
      wadah.appendChild(el('div', 'soal-teks', html(soal.q, 'pec-besar') + ' sama dengan?'));
      wadah.appendChild(batang(soal.q, Object.assign({ lebar: 460, tinggi: 54 }, COK)));
      const opsi = el('div', 'pec-opsi empat');
      soal.opsi.forEach((o) => {
        const t = el('button', 'tombol tombol-pec', html(o.p));
        t.onclick = () => kirim(periksaSenilai(soal, o));
        opsi.appendChild(t);
      });
      wadah.appendChild(opsi);
      return;
    }
    const langkah = [];
    wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Sederhanakan <b class="merah">sampai habis</b>'));
    const jejak = el('div', 'jejak-pec');
    const gambar = el('div', 'batang-wadah');
    const label = el('div', 'ingat-kecil', 'Bagi atas <b>dan</b> bawah dengan:');
    const chips = el('div', 'chips chips-pembagi');
    const selesai = el('button', 'tombol tombol-utama', '✓ Sudah paling sederhana');
    const gambarUlang = () => {
      const r = jalankan(soal.p, langkah);
      jejak.innerHTML = r.jejak.map((p, i) => (i ? '<span class="panah">' + '= ' + '</span>' : '') + html(p, i === r.jejak.length - 1 ? 'pec-besar sekarang' : 'pec-besar redup')).join(' ');
      gambar.innerHTML = '';
      gambar.appendChild(batang(r.s, Object.assign({ lebar: 460, tinggi: 46 }, COK)));
    };
    PEMBAGI.forEach((d) => {
      const c = el('button', 'chip', ':' + d);
      c.onclick = () => {
        langkah.push(d);
        const hasil = periksaSederhana(soal, langkah, false);
        if (hasil) { kirim(Object.assign(hasil, { langkah: langkah.slice() })); return; }
        Suara.efek('pop');
        gambarUlang();
      };
      chips.appendChild(c);
    });
    selesai.onclick = () => kirim(Object.assign(periksaSederhana(soal, langkah, true), { langkah: langkah.slice() }));
    const kotak = el('div', 'sederhana-wadah');
    kotak.append(jejak, gambar, label, chips, selesai);
    wadah.appendChild(kotak);
    gambarUlang();
  }

  const rantai = (jejak, bagi) => jejak.map((p, i) => (i ? ' <span class="panah">=</span> ' : '') + html(p)).join('') +
    (bagi && bagi.length ? ' <small>(dibagi ' + bagi.join(', lalu ') + ')</small>' : '');

  function pujian(soal, jawaban) {
    if (soal.jenis === 'senilai') {
      const [a, b] = soal.q, [c, d] = soal.j;
      const kata = d > b ? 'atas & bawah dikali ' + d / b : 'atas & bawah dibagi ' + b / d;
      return { html: html(soal.q) + ' = ' + html(soal.j) + ' (' + kata + ')' };
    }
    return { html: 'Sampai habis! ' + rantai(jawaban.jejak) };
  }

  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'senilai') {
      const [a, b] = soal.q, [c, d] = soal.j;
      const kata = d > b
        ? 'Atas dan bawah <b>dikali ' + d / b + '</b>: ' + a + ' × ' + d / b + ' = ' + c + ', ' + b + ' × ' + d / b + ' = ' + d + '.'
        : 'Atas dan bawah <b>dibagi ' + b / d + '</b>: ' + a + ' : ' + b / d + ' = ' + c + ', ' + b + ' : ' + b / d + ' = ' + d + '.';
      let catatan = '';
      if (jawaban.jenisSalah === 'tambah') catatan = '<br>' + html(jawaban.pilih) + ' didapat dengan <b>menambah</b>. Menambah tidak membuat senilai: harus <b>dikali</b> atau <b>dibagi</b> bilangan yang sama.';
      else if (jawaban.jenisSalah === 'satu') catatan = '<br>' + html(jawaban.pilih) + ': hanya satu angka yang diubah. Atas <b>dan</b> bawah harus diubah bersama.';
      wadah.appendChild(el('div', 'kotak-teks', html(soal.q) + ' = ' + html(soal.j) + '. ' + kata + catatan));
      const b1 = el('div', 'batang-tumpuk');
      b1.appendChild(barisBatang(soal.q, Object.assign({ lebar: 440, tinggi: 34, label: 'soal' }, COK)));
      b1.appendChild(barisBatang(soal.j, Object.assign({ lebar: 440, tinggi: 34, label: '✓ sama' }, COK)));
      b1.appendChild(barisBatang(jawaban.pilih, { lebar: 440, tinggi: 34, warna: '#E04466', label: 'pilihanmu' }));
      wadah.appendChild(b1);
      return;
    }
    const habis = jalanHabis(soal.p);
    let kata;
    if (jawaban.alasan === 'berhenti') {
      const s = jawaban.sekarang, g = fpb(s[0], s[1]);
      kata = 'Hampir! Kamu sudah sampai ' + html(s) + ', tapi <b>belum habis</b>: ' + s[0] + ' dan ' + s[1] + ' masih bisa dibagi ' + g + '.';
    } else {
      const s = jawaban.sekarang, d = jawaban.d;
      const tidak = [s[0], s[1]].filter((x) => x % d);
      kata = html(s) + ': ' + tidak.join(' dan ') + ' tidak bisa dibagi ' + d + ' (ada sisa). Pilih bilangan yang membagi atas <b>dan</b> bawah.';
    }
    wadah.appendChild(el('div', 'kotak-teks', kata));
    wadah.appendChild(el('div', 'kotak-teks rantai', 'Sampai habis: ' + rantai(habis.jejak, habis.bagi) +
      (soal.fpb > 3 && habis.bagi.length > 1 ? '<br><small>Cara cepat: langsung bagi ' + soal.fpb + ' (bilangan terbesar yang membagi ' + soal.p[0] + ' dan ' + soal.p[1] + ').</small>' : '')));
    const b1 = el('div', 'batang-tumpuk');
    b1.appendChild(barisBatang(soal.p, Object.assign({ lebar: 440, tinggi: 30 }, COK)));
    b1.appendChild(barisBatang(soal.akhir, Object.assign({ lebar: 440, tinggi: 30, label: '✓ sama' }, COK)));
    wadah.appendChild(b1);
  }

  root.GameCokelatKembar = Object.assign({
    id: 'cokelat-kembar',
    tingkat: ['penyebut ≤ 8', 'penyebut ≤ 12', 'penyebut ≤ 24'],
    ingat: 'Pecahan senilai: atas dan bawah dikali atau dibagi bilangan yang sama (bukan ditambah). Sederhanakan sampai tidak bisa dibagi lagi.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
