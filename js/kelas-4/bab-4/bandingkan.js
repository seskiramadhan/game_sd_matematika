// Mini game ⚖️ Mana Lebih Besar (Kelas 4 Bab 4): membandingkan & mengurutkan pecahan.
// Soal 1-3: "a/b ☐ c/d" -> ketuk <, =, atau >.
// Soal 4-5: urutkan 3-4 pecahan dari yang terkecil (ketuk berurutan).
// Tingkat 1: penyebut sama · 2: pembilang sama · 3: beda keduanya (samakan penyebut).
// Jebakan yang dilatih: "penyebut besar = pecahan lebih besar" (padahal penyebut besar = potongan kecil).
// Semua jawaban dihitung oleh kode (perkalian silang / KPK). Cek logika: node tools/cek-bab4.js
(function (root) {
  const P = (typeof module !== 'undefined' && module.exports) ? require('./pecahan.js') : root.Pecahan;
  const { kpk, bandingkan, senilai, acak, pilih, kocok } = P;

  // ---------- Logika (tanpa DOM) ----------
  const PENYEBUT = [3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 10, 12, 12, 12];
  const MAKS_PENYEBUT = 12, MAKS_SAMA = 24; // penyebut yang disamakan (KPK) paling besar 24
  const PENYEBUT_URUT3 = [6, 8, 10, 12, 12, 12, 18, 20, 24, 24];

  function soalBanding(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      let p, q;
      if (tingkat === 1) {
        const b = pilih(PENYEBUT);
        const a = acak(1, b - 1), c = acak(1, b - 1);
        if (a === c) continue;
        p = [a, b]; q = [c, b];
      } else if (tingkat === 2) {
        const b = pilih(PENYEBUT), d = pilih(PENYEBUT);
        if (b === d) continue;
        const a = acak(1, Math.min(b, d) - 1);
        p = [a, b]; q = [a, d];
      } else {
        const b = pilih(PENYEBUT), d = pilih(PENYEBUT);
        if (b === d || kpk(b, d) > MAKS_SAMA) continue;
        const a = acak(1, b - 1);
        let c;
        if (Math.random() < 0.2) {
          if ((a * d) % b) continue; // mau "=" tapi tidak bisa
          c = (a * d) / b;
        } else {
          c = acak(1, d - 1);
          if (senilai([a, b], [c, d])) continue;
          // sebagian besar soal: pecahan berpenyebut besar justru lebih kecil (melawan anggapan keliru)
          const besarLebihKecil = bandingkan(b > d ? [a, b] : [c, d], b > d ? [c, d] : [a, b]) < 0;
          if (Math.random() < 0.65 && !besarLebihKecil) continue;
        }
        if (a === c) continue;
        p = [a, b]; q = [c, d];
      }
      const kunci = p.join('/') + ' ' + q.join('/');
      if (pakai && pakai.has(kunci)) continue;
      if (pakai) pakai.add(kunci);
      return { jenis: 'banding', p, q, tanda: bandingkan(p, q), tingkat };
    }
    throw new Error('soalBanding gagal');
  }

  const pembagi = (n) => { const d = []; for (let i = 2; i <= n; i++) if (n % i === 0) d.push(i); return d; };

  function soalUrut(tingkat, pakai) {
    for (let coba = 0; coba < 500; coba++) {
      let daftar;
      if (tingkat === 1) {
        const b = pilih(PENYEBUT.filter((x) => x >= 5));
        daftar = kocok([...Array(b - 1).keys()].map((i) => i + 1)).slice(0, 4).map((a) => [a, b]);
      } else if (tingkat === 2) {
        const a = acak(1, 3), n = Math.random() < 0.5 ? 3 : 4;
        const dens = [...new Set(kocok(PENYEBUT.filter((x) => x > a)))].slice(0, n);
        daftar = dens.map((b) => [a, b]);
      } else {
        const D = pilih(PENYEBUT_URUT3);
        const dens = kocok(pembagi(D)).slice(0, 3);
        if (dens.length < 3 || dens.some((x) => x > MAKS_PENYEBUT)) continue;
        daftar = dens.map((b) => [acak(1, b - 1), b]);
        const pembilang = new Set(daftar.map((x) => x[0]));
        if (pembilang.size < 2) continue;
      }
      if (daftar.length < 3) continue;
      // nilai harus berbeda semua (tidak ada yang senilai)
      let beda = true;
      for (let i = 0; i < daftar.length; i++) for (let j = i + 1; j < daftar.length; j++) if (senilai(daftar[i], daftar[j])) beda = false;
      if (!beda) continue;
      const urut = daftar.slice().sort(bandingkan);
      if (sudahUrut(daftar)) daftar = kocok(daftar);
      if (sudahUrut(daftar)) daftar.reverse();
      const kunci = 'u' + urut.map((x) => x.join('/')).join(' ');
      if (pakai && pakai.has(kunci)) continue;
      if (pakai) pakai.add(kunci);
      return { jenis: 'urut', daftar, urut, sama: daftar.map((x) => x[1]).reduce(kpk), tingkat };
    }
    throw new Error('soalUrut gagal');
  }
  function sudahUrut(arr) { for (let i = 1; i < arr.length; i++) if (bandingkan(arr[i - 1], arr[i]) >= 0) return false; return true; }

  function buatRonde(tingkat) {
    const pakai = new Set();
    const ronde = [soalBanding(tingkat, pakai), soalBanding(tingkat, pakai), soalBanding(tingkat, pakai)];
    // jawaban soal 1-3 jangan semuanya sama (mis. semua "<")
    if (tingkat < 3 && new Set(ronde.map((s) => s.tanda)).size === 1) { const s = ronde[2]; [s.p, s.q] = [s.q, s.p]; s.tanda = -s.tanda; }
    ronde.push(soalUrut(tingkat, pakai), soalUrut(tingkat, pakai));
    return ronde;
  }

  function soalMirip(soal, tingkat) {
    if (soal.jenis === 'banding') return soalBanding(tingkat, new Set([soal.p.join('/') + ' ' + soal.q.join('/')]));
    return soalUrut(tingkat, new Set(['u' + soal.urut.map((x) => x.join('/')).join(' ')]));
  }

  function periksaBanding(soal, tanda) { return { tanda, benar: tanda === soal.tanda }; }
  function periksaUrut(soal, urutan) {
    return { urutan, benar: urutan.length === soal.daftar.length && sudahUrut(urutan) };
  }

  const logika = { PENYEBUT, MAKS_PENYEBUT, MAKS_SAMA, soalBanding, soalUrut, buatRonde, soalMirip, periksaBanding, periksaUrut, sudahUrut };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, html, barisBatang } = P;
  const SIMBOL = { '-1': '<', '0': '=', '1': '>' };
  const KATA = { '-1': 'lebih kecil', '0': 'sama', '1': 'lebih besar' };
  const WARNA = ['#3A86FF', '#FF8A3D', '#9B5DE5', '#2BB673'];

  function tampilkan(soal, wadah, kirim) {
    if (soal.jenis === 'banding') {
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Isi kotaknya: <b>&lt;</b>, <b>=</b>, atau <b>&gt;</b>?'));
      wadah.appendChild(el('div', 'banding-baris', html(soal.p, 'pec-raksasa') + '<span class="kotak-tanda">?</span>' + html(soal.q, 'pec-raksasa')));
      const baris = el('div', 'pilihan pilihan-tanda');
      [-1, 0, 1].forEach((t) => {
        const b = el('button', 'tombol tombol-tanda', SIMBOL[t] + '<small>' + KATA[t] + '</small>');
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
        const s = el('button', 'kartu-slot' + (p ? ' isi' : ''), (p ? html(p) : '') + '<small>' + (i === 0 ? 'terkecil' : i === soal.daftar.length - 1 ? 'terbesar' : i + 1) + '</small>');
        if (p) s.onclick = () => { urutan.splice(i, 1); Suara.efek('pop'); gambar(); };
        slot.appendChild(s);
      });
      kolam.innerHTML = '';
      soal.daftar.forEach((p) => {
        const dipakai = urutan.includes(p);
        const k = el('button', 'tombol tombol-pec' + (dipakai ? ' terpakai' : ''), html(p));
        k.onclick = () => { if (urutan.includes(p)) return; urutan.push(p); Suara.efek('pop'); gambar(); };
        kolam.appendChild(k);
      });
      cek.disabled = urutan.length < soal.daftar.length;
    };
    cek.onclick = () => { if (urutan.length === soal.daftar.length) kirim(periksaUrut(soal, urutan.slice())); };
    wadah.append(slot, kolam, cek);
    wadah.appendChild(el('div', 'ingat-kecil', 'Ketuk pecahan satu per satu, mulai yang terkecil. Ketuk kotak atas untuk membatalkan.'));
    gambar();
  }

  // batang-batang sejajar, dipotong menjadi penyebut yang sama bila perlu
  function batangSejajar(daftar, wadah, samakan) {
    const K = daftar.map((x) => x[1]).reduce(kpk);
    const tumpuk = el('div', 'batang-tumpuk');
    daftar.forEach((p, i) => {
      const q = samakan ? [p[0] * K / p[1], K] : p;
      const r = barisBatang(q, { lebar: 440, tinggi: 30, warna: WARNA[i % WARNA.length] });
      if (samakan) r.querySelector('.label-batang').innerHTML = html(p) + '<span class="panah">=</span>' + html(q);
      tumpuk.appendChild(r);
    });
    wadah.appendChild(tumpuk);
  }

  function kalimat(soal) {
    const { p, q, tanda } = soal;
    const hasil = html(p) + ' <b>' + SIMBOL[tanda].replace('<', '&lt;').replace('>', '&gt;') + '</b> ' + html(q);
    if (p[1] === q[1]) return 'Penyebut sama (' + p[1] + ' potong), bandingkan pembilangnya: ' + p[0] + ' ' + (p[0] > q[0] ? '&gt;' : '&lt;') + ' ' + q[0] + '. Jadi ' + hasil + '.';
    if (p[0] === q[0]) {
      const besar = p[1] > q[1] ? p : q;
      return 'Pembilang sama. <b>Penyebut besar = potongan kecil</b>: dipotong ' + besar[1] + ' lebih kecil dari dipotong ' + (besar === p ? q[1] : p[1]) + '. Jadi ' + hasil + '.';
    }
    const K = kpk(p[1], q[1]);
    const p2 = [p[0] * K / p[1], K], q2 = [q[0] * K / q[1], K];
    return 'Samakan penyebutnya dulu: ' + html(p) + ' = ' + html(p2) + ', ' + html(q) + ' = ' + html(q2) + '. Jadi ' + hasil + '.';
  }

  function pujian(soal) {
    if (soal.jenis === 'banding') {
      const t = soal.p[0] === soal.q[0] && soal.p[1] !== soal.q[1] ? ' Penyebut besar = potongan kecil.' : '';
      return { html: html(soal.p) + ' <b>' + SIMBOL[soal.tanda].replace('<', '&lt;').replace('>', '&gt;') + '</b> ' + html(soal.q) + t };
    }
    return { html: soal.urut.map((x) => html(x)).join(' &lt; ') };
  }

  function alasan(soal, jawaban, wadah) {
    if (soal.jenis === 'banding') {
      wadah.appendChild(el('div', 'kotak-teks', kalimat(soal) + (soal.p[1] !== soal.q[1] && soal.p[0] !== soal.q[0] ? '' : '') +
        '<br><small>Kamu memilih "' + SIMBOL[jawaban.tanda].replace('<', '&lt;').replace('>', '&gt;') + '". Lihat panjang batangnya:</small>'));
      batangSejajar([soal.p, soal.q], wadah, soal.p[1] !== soal.q[1] && soal.p[0] !== soal.q[0]);
      return;
    }
    const sama = new Set(soal.daftar.map((x) => x[1])).size === 1;
    const pembilangSama = new Set(soal.daftar.map((x) => x[0])).size === 1;
    let kata = 'Urutan yang benar: ' + soal.urut.map((x) => html(x)).join(' &lt; ') + '.';
    if (sama) kata += '<br><small>Penyebut sama: urutkan pembilangnya.</small>';
    else if (pembilangSama) kata += '<br><small>Pembilang sama: penyebut paling besar = potongan paling kecil.</small>';
    else kata += '<br><small>Samakan penyebutnya jadi ' + soal.sama + ', lalu urutkan pembilangnya.</small>';
    wadah.appendChild(el('div', 'kotak-teks', kata));
    batangSejajar(soal.urut, wadah, !sama && !pembilangSama);
  }

  root.GameBandingkan = Object.assign({
    id: 'bandingkan',
    tingkat: ['penyebut sama', 'pembilang sama', 'beda keduanya'],
    ingat: 'Penyebut sama: lihat pembilangnya. Pembilang sama: penyebut besar = potongan kecil. Beda semua: samakan penyebutnya dulu.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
