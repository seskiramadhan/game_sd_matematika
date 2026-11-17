// Data 📖 Soal Cerita Kelas 4 Bab 12 (Grafik Batang) untuk mesin js/soal-cerita.js.
// Dua jenis (video Jago Soal Cerita Ep. 5, "Lebih Banyak atau Seluruhnya?"):
//   SELISIH: "lebih banyak / lebih sedikit / selisih" -> dua batang dibandingkan, dikurangi (besar - kecil).
//   SELURUH: "seluruhnya / jumlah / semuanya" -> batang digabung, ditambah (semua batang; di tingkat 3 kadang hanya dua batang).
// Angka TIDAK ada di cerita: anak membaca diagram batang dan harus membaca SKALA dulu (tiap garis bernilai 1, 2, 5, atau 10).
// Langkah Tandai: ketuk nama batang yang dipakai (kuning) + kalimat tanya (biru). Langkah Gambar: pilih diagram yang tepat
// (dua batang dibandingkan = tanda ?, batang digabung = tanda +). Semua kunci bilangan bulat, dihitung kode.
// Tes: node tools/cek-soal-cerita-bab12.js
// Contoh tetap (sama dengan video Ep. 5 / Buku Saku, data.py), muncul sekitar 12% pada tingkat 2:
//   Kue Bu Ani skala 5 (Senin 15, Selasa 20, Rabu 10, Kamis 25): Kamis lebih banyak dari Rabu 15; seluruhnya 70.
//   Olahraga skala 2 (Bola 9, Renang 6, Bulu tangkis 12, Voli 3): jumlah 30; Bulu tangkis lebih banyak dari Renang 6.
//   Sepeda skala 5 (Ali 10, Dini 25, Eka 15): selisih Dini dan Eka 10.
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const M = modul ? require('../../soal-cerita.js') : root.GameSoalCerita;
  const { acak, pilih, kocok, fmt, buatOpsi, GAMBAR } = M;

  const T = (t) => ({ k: 'teks', t });
  const A = (t) => ({ k: 'angka', t: String(t), penting: true }); // nama batang yang dipakai (ditandai kuning)
  const Q = (t) => ({ k: 'tanya', t });
  const BANYAK_PENGECOH = { 1: 0, 2: 1, 3: 2 };
  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const jumlah = (a) => a.reduce((x, y) => x + y, 0);

  // Rentang per tingkat. n = banyak batang, skala = pilihan jarak garis, nilai = kelipatan separuh skala (skala 2 dan 10) atau skala (1, 5).
  const LEVEL = {
    1: { n: [2, 2], skala: [1, 2], min: 3, maks: 16 },
    2: { n: [3, 4], skala: [5], min: 5, maks: 40 },
    3: { n: [4, 5], skala: [5, 10], min: 10, maks: 80 },
  };

  // aw = awalan nama batang di kalimat ('hari '). benda = yang dihitung; verba = kata kerja di pertanyaan.
  const TOPIK = [
    { id: 'kue', tokoh: 'Bu Ani', benda: 'kue', satuan: 'kue', verba: 'terjual', aw: 'hari ', nama: HARI, intro: 'Bu Ani menjual kue setiap hari. Diagram batang menunjukkan banyak kue yang terjual.',
      semua: ['Berapa kue yang terjual seluruhnya?', 'Berapa jumlah kue yang terjual?'] },
    { id: 'botol', tokoh: 'Pak Guru', benda: 'botol', satuan: 'botol', verba: 'terkumpul', aw: 'hari ', nama: HARI, intro: 'Murid-murid mengumpulkan botol bekas setiap hari untuk didaur ulang. Diagram batang menunjukkan banyak botol yang terkumpul.',
      semua: ['Berapa botol yang terkumpul seluruhnya?', 'Berapa jumlah botol yang terkumpul?'] },
    { id: 'perpus', tokoh: 'Bu Rina', benda: 'anak', satuan: 'anak', verba: 'datang', aw: 'hari ', nama: HARI, intro: 'Perpustakaan sekolah dikunjungi anak-anak setiap hari. Diagram batang menunjukkan banyak anak yang datang.',
      semua: ['Berapa anak yang datang seluruhnya?', 'Berapa jumlah anak yang datang?'] },
    { id: 'eslilin', tokoh: 'Pak Dedi', benda: 'es lilin', satuan: 'es lilin', verba: 'terjual', aw: 'hari ', nama: HARI, intro: 'Koperasi sekolah menjual es lilin setiap hari. Diagram batang menunjukkan banyak es lilin yang terjual.',
      semua: ['Berapa es lilin yang terjual seluruhnya?', 'Berapa jumlah es lilin yang terjual?'] },
    { id: 'sampah', tokoh: 'Bu Wati', benda: 'kantong', satuan: 'kantong', verba: 'terkumpul', aw: 'hari ', nama: HARI, intro: 'Petugas kebersihan mengumpulkan kantong sampah plastik setiap hari. Diagram batang menunjukkan banyak kantong yang terkumpul.',
      semua: ['Berapa kantong yang terkumpul seluruhnya?', 'Berapa jumlah kantong yang terkumpul?'] },
    { id: 'hewan', tokoh: 'Pak Budi', benda: 'murid', satuan: 'murid', verba: 'memilih', aw: '', nama: ['Kucing', 'Ikan', 'Burung', 'Kelinci', 'Hamster'], intro: 'Pak Budi bertanya hewan peliharaan kesukaan murid kelas empat. Diagram batang menunjukkan banyak murid yang memilih tiap hewan.',
      semua: ['Berapa murid seluruhnya?', 'Berapa jumlah murid yang ikut memilih?'] },
    { id: 'olahraga', tokoh: 'Bu Sari', benda: 'murid', satuan: 'murid', verba: 'memilih', aw: '', nama: ['Bola', 'Renang', 'Bulu tangkis', 'Voli', 'Basket'], intro: 'Bu Sari bertanya olahraga kesukaan murid. Diagram batang menunjukkan banyak murid yang memilih tiap olahraga.',
      semua: ['Berapa murid seluruhnya?', 'Berapa jumlah murid yang ikut memilih?'] },
    { id: 'buah', tokoh: 'Bu Lina', benda: 'murid', satuan: 'murid', verba: 'memilih', aw: '', nama: ['Mangga', 'Jeruk', 'Pisang', 'Apel', 'Semangka'], intro: 'Bu Lina bertanya buah kesukaan murid. Diagram batang menunjukkan banyak murid yang memilih tiap buah.',
      semua: ['Berapa murid seluruhnya?', 'Berapa jumlah murid yang ikut memilih?'] },
    { id: 'sepeda', tokoh: 'Pak Anwar', benda: 'sepeda', satuan: 'sepeda', verba: 'milik', aw: '', nama: ['Ali', 'Dini', 'Eka', 'Fajar', 'Gita'], intro: 'Beberapa anak di kampung punya sepeda. Diagram batang menunjukkan banyak sepeda milik tiap anak.',
      semua: ['Berapa sepeda seluruhnya?', 'Berapa jumlah sepeda yang dimiliki anak-anak itu?'] },
  ];
  const adaTopik = (id) => TOPIK.find((t) => t.id === id);
  const pelaku = (t) => (t.intro.startsWith(t.tokoh) ? 'Ia' : t.tokoh);

  // Contoh video (muncul sekitar 12% di tingkat 2). X = batang yang lebih tinggi (selisih), Y = yang lebih pendek.
  const CONTOH = [
    { jenis: 'selisih', topik: 'kue', nama: ['Senin', 'Selasa', 'Rabu', 'Kamis'], nilai: [15, 20, 10, 25], garis: 5, X: 3, Y: 2, sub: 'banyak' },
    { jenis: 'seluruh', topik: 'kue', nama: ['Senin', 'Selasa', 'Rabu', 'Kamis'], nilai: [15, 20, 10, 25], garis: 5 },
    { jenis: 'seluruh', topik: 'olahraga', nama: ['Bola', 'Renang', 'Bulu tangkis', 'Voli'], nilai: [9, 6, 12, 3], garis: 2 },
    { jenis: 'selisih', topik: 'olahraga', nama: ['Bola', 'Renang', 'Bulu tangkis', 'Voli'], nilai: [9, 6, 12, 3], garis: 2, X: 2, Y: 1, sub: 'banyak' },
    { jenis: 'selisih', topik: 'sepeda', nama: ['Ali', 'Dini', 'Eka'], nilai: [10, 25, 15], garis: 5, X: 1, Y: 2, sub: 'selisih' },
  ];

  // ---------- data diagram ----------
  function buatDiagram(tingkat, topik) {
    const L = LEVEL[tingkat];
    const n = acak(L.n[0], L.n[1]);
    const garis = pilih(L.skala);
    const nama = topik.aw ? topik.nama.slice(0, n) : kocok(topik.nama).slice(0, n);
    // nilai: kelipatan skala; skala 2 dan 10 boleh tepat di tengah (9 pada skala 2, 35 pada skala 10). Semua nilai berbeda.
    const langkah = garis === 1 ? 1 : garis === 5 ? 5 : garis / 2;
    for (let c = 0; c < 2000; c++) {
      const nilai = Array.from({ length: n }, () => langkah * acak(Math.ceil(L.min / langkah), Math.floor(L.maks / langkah)));
      if (new Set(nilai).size !== n) continue;
      const ymax = Math.ceil(Math.max(...nilai) / garis) * garis;
      if (ymax / garis > 10 || ymax / garis < 3) continue;
      return { topik, nama, nilai, garis, ymax };
    }
    throw new Error('buatDiagram gagal');
  }
  const dataDariContoh = (c) => ({ topik: adaTopik(c.topik), nama: c.nama.slice(), nilai: c.nilai.slice(), garis: c.garis, ymax: Math.ceil(Math.max(...c.nilai) / c.garis) * c.garis });
  const gDiag = (D, o) => GAMBAR.diagramBatang({ nama: D.nama, nilai: D.nilai, garis: D.garis, ymax: D.ymax }, o);
  const sebut = (D, idx) => D.topik.aw + D.nama[idx];

  function sisipPengecoh(segmen, tingkat, terlarang) {
    const gen = ['Data itu dicatat selama {x} minggu.', 'Ada {x} orang yang membantu mencatat data itu.', 'Diagram itu digambar pukul {x} pagi.'];
    const dis = [];
    kocok(gen).slice(0, BANYAK_PENGECOH[tingkat]).forEach((g) => {
      let v, n = 0;
      do { v = acak(2, 9); n++; } while (terlarang.has(v) && n < 100);
      terlarang.add(v); dis.push(v);
      const [d, b] = g.split('{x}');
      segmen.splice(segmen.length - 1, 0, T(d), { k: 'angka', t: String(v), penting: false }, T(b + ' '));
    });
    return dis;
  }

  // Tiga pilihan diagram: mode 'beda' (selisih, tanda ?) / 'gabung' (jumlah, tanda +) / 'satu'. benar = yang cocok, salah = calon pengecoh.
  function pilihanDiagram(D, benar, salah) {
    const buat = (c0) => {
      const c = { mode: c0.mode, sorot: c0.sorot.slice().sort((p, r) => p - r) };
      const nm = c.sorot.map((i) => D.nama[i]).join(' dan ');
      const ket = c.mode === 'beda' ? 'Dibandingkan: ' + nm : c.mode === 'gabung' ? (c.sorot.length === D.nama.length ? 'Semua digabung (+)' : 'Digabung (+): ' + nm) : 'Satu batang: ' + nm;
      return { id: c.mode + '-' + c.sorot.join(''), mode: c.mode, sorot: c.sorot.slice(), ket, svg: gDiag(D, { sorot: c.sorot, mode: c.mode }) };
    };
    const sama = (a, b) => a.mode === b.mode && a.sorot.join() === b.sorot.join();
    const unik = [];
    salah.forEach((c) => { if (!sama(c, benar) && !unik.some((u) => sama(u, c))) unik.push(c); });
    const b = buat(benar), lain = unik.slice(0, 2).map(buat);
    return { benar: b.id, pilihan: kocok([b].concat(lain)) };
  }

  // ---------- SELISIH ----------
  function soalSelisih(tingkat, pakai) {
    for (let coba = 0; coba < 2000; coba++) {
      let D, X, Y, sub, contoh = false;
      const cs = tingkat === 2 ? CONTOH.filter((c) => c.jenis === 'selisih') : [];
      if (cs.length && Math.random() < 0.12) { const c = pilih(cs); D = dataDariContoh(c); X = c.X; Y = c.Y; sub = c.sub; contoh = true; }
      else {
        D = buatDiagram(tingkat, pilih(TOPIK));
        const n = D.nama.length, i = acak(0, n - 1); let j; do { j = acak(0, n - 1); } while (j === i);
        X = D.nilai[i] > D.nilai[j] ? i : j; Y = X === i ? j : i;
        sub = pilih(['banyak', 'sedikit', 'selisih']);
      }
      const t = D.topik, g = D.garis, a = D.nilai[X], b = D.nilai[Y], kunci = a - b;
      const kode = 'sel-' + t.id + '-' + D.nilai.join('.') + '-' + sub + X + Y;
      if (pakai && pakai.has(kode)) continue;
      const [A1, B1] = Math.random() < 0.5 ? [X, Y] : [Y, X];
      const fx = sebut(D, X), fy = sebut(D, Y);
      let q, kata;
      if (sub === 'banyak') { q = 'Berapa ' + t.benda + ' lebih banyak yang ' + t.verba + ' ' + fx + ' daripada ' + fy + '?'; kata = ['lebih banyak']; }
      else if (sub === 'sedikit') { q = 'Berapa ' + t.benda + ' lebih sedikit yang ' + t.verba + ' ' + fy + ' daripada ' + fx + '?'; kata = ['lebih sedikit']; }
      else { q = 'Berapa selisih ' + t.benda + ' yang ' + t.verba + ' ' + fx + ' dan ' + fy + '?'; kata = ['selisih']; }
      const awal = t.intro + ' ' + pelaku(t) + ' ingin membandingkan ' + t.aw;
      const cerita0 = awal + D.nama[A1] + ' dan ' + t.aw + D.nama[B1] + '. ' + q;
      const segmen = [T(awal), A(D.nama[A1]), T(' dan ' + t.aw), A(D.nama[B1]), T('. '), Q(q)];
      const dis = sisipPengecoh(segmen, tingkat, new Set(D.nilai.concat([kunci, g, a + b])));
      const lantai = (v) => Math.floor(v / g);
      const grup = [
        { s: 'Itu hasil ditambah (' + a + ' + ' + b + '). ' + (sub === 'banyak' ? 'Lebih banyak' : sub === 'sedikit' ? 'Lebih sedikit' : 'Selisih') + ' berarti dikurangi.', v: [a + b] },
        { s: 'Itu tinggi satu batang saja (' + D.nama[X] + '). Kurangi dengan batang yang satu lagi.', v: [a] },
        { s: 'Itu tinggi satu batang saja (' + D.nama[Y] + '). Batang itu belum dikurangkan dari batang yang lebih tinggi.', v: [b] },
      ];
      if (g > 1) grup.unshift({ s: 'Itu selisih banyak garis, bukan nilainya. Tiap garis bernilai ' + g + ', jadi nilai tiap batang dibaca dari angka di sumbu.', v: [Math.abs(lantai(a) - lantai(b))] });
      const { opsi, sebab } = buatOpsi(kunci, grup, [kunci + 1, kunci - 1, kunci + g, kunci - g, kunci + 2, kunci + 5], { min: 1, maks: 200 });
      const kata2 = sub === 'banyak' ? 'lebih banyak' : sub === 'sedikit' ? 'lebih sedikit' : 'selisih';
      const cek = 'Kata <b>' + kata2 + '</b> berarti dibandingkan, jadi dikurangi. Skala: tiap garis bernilai ' + g + ' ' + t.satuan + '.' +
        '<br>' + D.nama[X] + ' = ' + a + ', ' + D.nama[Y] + ' = ' + b +
        '<br>' + a + ' − ' + b + ' = <b>' + fmt(kunci) + '</b> ' + t.satuan +
        '<br><small>Cek: ' + b + ' + ' + kunci + ' = ' + a + '. Batang yang lebih tinggi dikurangi batang yang lebih pendek.</small>';
      const lain = D.nama.map((_, k) => k).filter((k) => k !== X && k !== Y);
      return {
        jenis: 'selisih', tingkat, kode, tid: t.id, nama: D.nama, nilai: D.nilai, garis: g, ymax: D.ymax, X, Y, sub, kunci, jumlah2: a + b, contoh,
        cerita0, kata, segmen, angkaPengecoh: dis, arahAngka: 'batang yang dibandingkan',
        hintKurang: 'Masih ada batang yang dibandingkan yang belum kuning. Ketuk nama dua batang yang disebut dalam cerita.',
        diagram: gDiag(D),
        gambar: pilihanDiagram(D, { mode: 'beda', sorot: [X, Y] }, [
          { mode: 'gabung', sorot: [X, Y] },
          lain.length ? { mode: 'beda', sorot: [X, lain[0]] } : { mode: 'satu', sorot: [X] },
          lain.length ? { mode: 'gabung', sorot: D.nama.map((_, k) => k) } : { mode: 'satu', sorot: [Y] },
        ]),
        tanya4: { teks: q, satuan: t.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalSelisih gagal');
  }

  // ---------- SELURUH ----------
  function soalSeluruh(tingkat, pakai) {
    for (let coba = 0; coba < 2000; coba++) {
      let D, mode, idx, contoh = false;
      const cs = tingkat === 2 ? CONTOH.filter((c) => c.jenis === 'seluruh') : [];
      if (cs.length && Math.random() < 0.12) { D = dataDariContoh(pilih(cs)); mode = 'semua'; contoh = true; }
      else { D = buatDiagram(tingkat, pilih(TOPIK)); mode = tingkat === 3 && Math.random() < 0.5 ? 'dua' : 'semua'; }
      const t = D.topik, g = D.garis, n = D.nama.length;
      if (mode === 'dua') { const i = acak(0, n - 1); let j; do { j = acak(0, n - 1); } while (j === i); idx = [Math.min(i, j), Math.max(i, j)]; }
      else idx = D.nama.map((_, k) => k);
      const nil = idx.map((k) => D.nilai[k]), kunci = jumlah(nil);
      const kode = 'jml-' + t.id + '-' + D.nilai.join('.') + '-' + mode + idx.join('');
      if (pakai && pakai.has(kode)) continue;
      let q, kata, segmen, cerita0;
      if (mode === 'semua') {
        q = pilih(t.semua); kata = [/seluruhnya/.test(q) ? 'seluruhnya' : 'jumlah'];
        segmen = [T(t.intro + ' Datanya untuk ' + t.aw)];
        D.nama.forEach((nm, k) => { if (k) segmen.push(T(k === n - 1 ? ' dan ' : ', ')); segmen.push(A(nm)); });
        segmen.push(T('. '), Q(q));
        cerita0 = t.intro + ' Datanya untuk ' + t.aw + D.nama.slice(0, -1).join(', ') + ' dan ' + D.nama[n - 1] + '. ' + q;
      } else {
        q = 'Berapa jumlah ' + t.benda + ' yang ' + t.verba + ' ' + sebut(D, idx[0]) + ' dan ' + sebut(D, idx[1]) + '?'; kata = ['jumlah'];
        const awal = t.intro + ' ' + pelaku(t) + ' ingin menggabungkan ' + t.aw;
        segmen = [T(awal), A(D.nama[idx[0]]), T(' dan ' + t.aw), A(D.nama[idx[1]]), T('. '), Q(q)];
        cerita0 = awal + D.nama[idx[0]] + ' dan ' + t.aw + D.nama[idx[1]] + '. ' + q;
      }
      const dis = sisipPengecoh(segmen, tingkat, new Set(D.nilai.concat([kunci, g])));
      const lantai = (v) => Math.floor(v / g);
      const grup = [];
      if (mode === 'semua') {
        grup.push({ s: 'Itu hasil dikurangi (batang tertinggi dikurangi batang terpendek). Seluruhnya berarti ditambah.', v: [Math.max(...nil) - Math.min(...nil)] });
        grup.push({ s: 'Ada satu batang yang belum ikut dijumlahkan. Jumlahkan semua batang.', v: [kunci - Math.min(...nil), kunci - nil[nil.length - 1]] });
      } else {
        grup.push({ s: 'Itu hasil dikurangi. Jumlah berarti ditambah.', v: [Math.abs(nil[0] - nil[1])] });
        grup.push({ s: 'Semua batang ikut dijumlahkan, padahal yang ditanya hanya dua batang saja.', v: [jumlah(D.nilai)] });
      }
      if (g > 1) grup.unshift({ s: 'Itu jumlah banyak garis, bukan nilainya. Tiap garis bernilai ' + g + ', jadi nilai tiap batang dibaca dari angka di sumbu.', v: [jumlah(nil.map(lantai))] });
      const { opsi, sebab } = buatOpsi(kunci, grup, [kunci + 1, kunci - 1, kunci + g, kunci - g, kunci + 5, kunci - 5, kunci + 10], { min: 1, maks: 400 });
      const cek = 'Kata <b>' + (mode === 'semua' ? kata[0] : 'jumlah') + '</b> berarti digabung, jadi ditambah. Skala: tiap garis bernilai ' + g + ' ' + t.satuan + '.' +
        '<br>' + idx.map((k) => D.nama[k] + ' = ' + D.nilai[k]).join(', ') +
        '<br>' + nil.join(' + ') + ' = <b>' + fmt(kunci) + '</b> ' + t.satuan +
        '<br><small>Cek: ' + (mode === 'semua' ? 'semua ' + n + ' batang sudah ikut dijumlahkan.' : 'hanya dua batang yang disebut yang dijumlahkan.') + '</small>';
      const ketiga = D.nama.map((_, k) => k).find((k) => !idx.includes(k));
      const salah = mode === 'semua'
        ? [{ mode: 'beda', sorot: [idx[0], idx[1]] }, { mode: 'satu', sorot: [idx[idx.length - 1]] }, n > 2 ? { mode: 'gabung', sorot: idx.slice(0, 2) } : { mode: 'satu', sorot: [idx[0]] }]
        : [{ mode: 'gabung', sorot: D.nama.map((_, k) => k) }, { mode: 'beda', sorot: idx }, { mode: 'gabung', sorot: [idx[0], ketiga].sort((p, r) => p - r) }];
      return {
        jenis: 'seluruh', tingkat, kode, tid: t.id, nama: D.nama, nilai: D.nilai, garis: g, ymax: D.ymax, mode, idx, kunci, contoh,
        cerita0, kata, segmen, angkaPengecoh: dis, arahAngka: mode === 'semua' ? 'semua batang yang dijumlahkan' : 'batang yang dijumlahkan',
        hintKurang: 'Masih ada batang yang dijumlahkan yang belum kuning. Ketuk nama batang yang disebut dalam cerita.',
        diagram: gDiag(D),
        gambar: pilihanDiagram(D, { mode: 'gabung', sorot: idx }, salah),
        tanya4: { teks: q, satuan: t.satuan }, opsi, sebab, cek,
      };
    }
    throw new Error('soalSeluruh gagal');
  }

  const data = {
    id: 'k4b12',
    jenis: [
      { id: 'selisih', nama: 'Lebih banyak / selisih (kurang)', petunjuk: 'ada kata <b>lebih banyak</b>, <b>lebih sedikit</b>, atau <b>selisih</b>: dua batang dibandingkan, jadi dikurangi.',
        gambarPetunjuk: 'Soal ini membandingkan <b>dua batang</b> (selisih). Pilih diagram dengan tanda <b>?</b> di antara dua batang yang disebut.' },
      { id: 'seluruh', nama: 'Seluruhnya (tambah)', petunjuk: 'ada kata <b>seluruhnya</b>, <b>jumlah</b>, atau <b>semuanya</b>: batang digabung, jadi ditambah.',
        gambarPetunjuk: 'Soal ini menggabungkan batang (jumlah). Pilih diagram dengan tanda <b>+</b> pada batang yang disebut.' },
    ],
    tingkat: ['dua batang, skala 1 atau 2, tanpa angka pengecoh', 'skala 5, 3-4 batang, 1 angka pengecoh', 'skala 5 atau 10, 4-5 batang, jumlah dua batang saja, 2 angka pengecoh'],
    ingat: 'Baca, Tandai, Gambar, Hitung dan Cek. Baca skala dulu: tiap garis bernilai berapa? Lebih banyak, lebih sedikit, atau selisih = dikurangi (dua batang). Seluruhnya atau jumlah = ditambah (batang digabung).',
    buatSoal(tingkat, jenisId, pakai) {
      const s = jenisId === 'selisih' ? soalSelisih(tingkat, pakai) : soalSeluruh(tingkat, pakai);
      if (pakai) pakai.add(s.kode);
      return s;
    },
    LEVEL, CONTOH, TOPIK,
  };
  if (modul) { module.exports = data; return; }
  root.SoalCeritaData = root.SoalCeritaData || {};
  root.SoalCeritaData.k4b12 = data;
})(typeof window !== 'undefined' ? window : globalThis);
