// Alat bersama Bab 5 (Pecahan 2): pecahan campuran.
// Pecahan campuran ditulis sebagai { u, a, b } = u a/b (u utuh, a/b pecahan murni). Pecahan biasa tetap [a, b] (pecahan.js Bab 4).
// Bagian logika bisa di-require di Node (tools/cek-bab5.js).
(function (root) {
  const P = (typeof module !== 'undefined' && module.exports) ? require('../bab-4/pecahan.js') : root.Pecahan;

  // tidak murni n/b -> campuran: bagi, hasil bagi = utuh, sisa = pembilang baru
  const keCampuran = (n, b) => ({ u: Math.floor(n / b), a: n % b, b });
  // campuran -> tidak murni: (utuh x penyebut) + pembilang
  const keTidakMurni = (c) => c.u * c.b + c.a;
  // nilai sebagai pecahan [pembilang, penyebut] (untuk cek senilai)
  const nilai = (c) => [c.u * c.b + c.a, c.b];
  const teks = (c) => (c.u ? c.u + (c.a ? ' ' : '') : '') + (c.a || !c.u ? c.a + '/' + c.b : '');
  // angka format Indonesia (1.056)
  const angka = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // penyebut per tingkat untuk Roti Utuh & Tukar Bentuk (6, 7, 8, 12 diulang supaya lebih sering)
  const PENYEBUT = {
    1: [2, 3, 3, 4, 4, 5, 6, 6, 6, 6],
    2: [3, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
    3: [4, 5, 6, 6, 7, 7, 8, 8, 9, 10, 12, 12, 12],
  };
  const MAKS_PENYEBUT = { 1: 6, 2: 8, 3: 12 };
  const MAKS_UTUH = { 1: 3, 2: 4, 3: 5 };

  const logika = { keCampuran, keTidakMurni, nilai, teks, angka, PENYEBUT, MAKS_PENYEBUT, MAKS_UTUH };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  // u a/b: bilangan bulat besar + pecahan bertumpuk di sebelahnya. a = 0 -> hanya bilangan bulat; u = 0 -> hanya pecahan.
  function html(c, kelas) {
    const k = 'campuran' + (kelas ? ' ' + kelas : '');
    if (!c.u) return '<span class="' + k + '">' + P.html([c.a, c.b]) + '</span>';
    return '<span class="' + k + '"><span class="utuh">' + c.u + '</span>' + (c.a ? P.html([c.a, c.b]) : '') + '</span>';
  }

  // Roti bundar: utuh (semua potongan berwarna) atau sebagian. Memakai gambar pizza Bab 4 dengan warna roti.
  const WARNA_ROTI = '#E8912A';
  function roti(b, banyak, opsi) {
    const o = { warna: WARNA_ROTI, topping: '#9C5418' };
    for (const k in opsi || {}) if (opsi[k] !== undefined) o[k] = opsi[k];
    opsi = o;
    const s = new Set(); for (let i = 0; i < banyak; i++) s.add(i);
    return P.potongan(b, opsi.set || s, opsi);
  }

  // Baris roti: u roti utuh + (bila a > 0) 1 roti dengan a dari b potong berwarna.
  // o: ukuranUtuh, ukuranSisa, labelUtuh(i) -> html, labelSisa (html), nomor (nomori potongan sisa), mulai, plus (tanda + di antara)
  function barisRoti(u, a, b, o) {
    o = o || {};
    const wadah = P.el('div', 'roti-baris');
    const item = (svg, label) => {
      const d = P.el('div', 'roti-item');
      d.appendChild(svg);
      if (label != null) d.appendChild(P.el('div', 'label-kecil', label));
      return d;
    };
    for (let i = 0; i < u; i++) wadah.appendChild(item(roti(b, b, { ukuran: o.ukuranUtuh || 90, warna: o.warnaUtuh }), o.labelUtuh ? o.labelUtuh(i) : null));
    if (a > 0) {
      if (u > 0 && o.plus) wadah.appendChild(P.el('div', 'roti-plus', '+'));
      const set = new Set(); for (let i = 0; i < a; i++) set.add(((o.mulai || 0) + i) % b);
      wadah.appendChild(item(roti(b, a, { ukuran: o.ukuranSisa || o.ukuranUtuh || 90, set, nomor: o.nomor, mulai: o.mulai || 0, warna: o.warnaSisa }), o.labelSisa != null ? o.labelSisa : null));
    }
    return wadah;
  }

  // Papan angka 0-9 untuk mengisi jawaban. kirim(nilai) dipanggil saat ✓ Cek. maks digit = digit.
  function papanAngka(onUbah, opsi) {
    opsi = opsi || {};
    const digit = opsi.digit || 2;
    let isi = '';
    const papan = P.el('div', 'papan-angka');
    const ubah = () => onUbah(isi);
    [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0].forEach((k) => {
      const t = P.el('button', 'tombol tombol-angka' + (k === '⌫' ? ' hapus' : ''), String(k));
      t.onclick = () => {
        if (k === '⌫') isi = isi.slice(0, -1);
        else if (isi.length < digit && !(isi === '' && k === 0)) isi += k;
        else { if (window.Suara) Suara.efek('boing'); return; }
        if (window.Suara) Suara.efek('pop');
        ubah();
      };
      papan.appendChild(t);
    });
    return papan;
  }

  root.Campuran = Object.assign({ html, roti, barisRoti, papanAngka, WARNA_ROTI }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
