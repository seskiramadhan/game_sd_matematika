// Mini game ✖️ Sudut Silang (Kelas 4 Bab 9): sudut lurus = 180°, sudut bersebelahan di garis lurus, sudut seberang sama besar.
// Tingkat 1: soal 1-3 sudut lurus dibagi satu sinar (kelipatan 10°), soal 4-5 ketuk sudut pada dua garis berpotongan.
// Tingkat 2: soal 1-3 cari sudut sebelah di dua garis berpotongan (kelipatan 5°, satu soal garis tegak lurus = 90°), soal 4-5 ketuk.
// Tingkat 3: sembarang 1°; soal 1-2 sudut lurus 3 bagian (180 - x - y), soal 3 sudut sebelah, soal 4 ketuk, soal 5 isi keempat sudut (jumlah 360°).
// Ketuk: daerah sudut ditentukan dari arah ketukan terhadap titik potong (sudut kecil >= 35°, supaya daerahnya >= 80 px).
// Semua besar sudut bilangan bulat; kunci dihitung dengan 180 - a. Cek: node tools/cek-bab9.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;
  const S = modul ? require('../bab-8/sudut.js') : root.Sudut;
  const { acak, pilih, kocok, mod } = S;

  // ---------- Logika (tanpa DOM) ----------
  const range = (a, b, st) => { const r = []; for (let x = a; x <= b; x += st) r.push(x); return r; };
  const BAGIAN = { 1: range(20, 160, 10).filter((x) => x !== 90) };
  const SEBELAH = { 2: range(20, 160, 5), 3: range(25, 155, 1).filter((x) => x !== 90) };
  const KETUK = { 1: range(40, 140, 10).filter((x) => x !== 90), 2: range(35, 145, 5).filter((x) => x !== 90), 3: range(35, 145, 1).filter((x) => x !== 90) };

  // empat wilayah di dua garis berpotongan, berurutan berlawanan jarum jam mulai dari sudut diketahui a
  const ukuranWilayah = (a) => [a, 180 - a, a, 180 - a];
  // wilayah (0-3) yang berisi arah rel derajat (diukur dari sinar pertama, berlawanan jarum jam)
  function wilayahDariSudut(a, rel) {
    const r = mod(rel, 360);
    return r < a ? 0 : r < 180 ? 1 : r < 180 + a ? 2 : 3;
  }
  // pilihan ganda angka: kunci + tiga pengecoh (urut prioritas), dijamin 4 nilai berbeda & valid (1..359)
  function opsiAngka(kunci, kandidat) {
    const hasil = [];
    kandidat.concat([90, 180, 45, 270, 60, 120, 30, 150]).forEach((x) => {
      if (hasil.length < 3 && Number.isInteger(x) && x >= 1 && x <= 359 && x !== kunci && !hasil.includes(x)) hasil.push(x);
    });
    return kocok([kunci].concat(hasil));
  }
  const teksTriple = (t) => t.map((x) => x + '°').join(' · ');

  function soalLurus1(tingkat, a) {
    if (a == null) a = pilih(BAGIAN[tingkat]);
    const kunci = 180 - a;
    return { jenis: 'lurus1', tingkat, a, kunci, theta: acak(0, 359), kiri: Math.random() < 0.5,
      opsi: opsiAngka(kunci, [Math.abs(90 - a), 360 - a, a]), kode: 'l1:' + a };
  }
  function soalLurus3(tingkat) {
    const x = acak(25, 75), y = acak(25, 75), kunci = 180 - x - y;
    const urut = kocok([x, y, 0]); // 0 = bagian yang ditanya
    return { jenis: 'lurus3', tingkat, x, y, kunci, urut, theta: acak(0, 359),
      opsi: opsiAngka(kunci, [x + y, 180 - x, 180 - y, 360 - x - y, x, y]), kode: 'l3:' + x + ':' + y };
  }
  function soalSebelah(tingkat, a) {
    if (a == null) a = pilih(SEBELAH[tingkat]);
    const kunci = 180 - a;
    return { jenis: 'sebelah', tingkat, a, kunci, alpha: acak(0, 359), tanyaR3: Math.random() < 0.5,
      opsi: opsiAngka(kunci, [Math.abs(90 - a), 360 - a, a]), kode: 'sb:' + a };
  }
  function soalKetuk(tingkat) {
    const a = pilih(KETUK[tingkat]);
    const q = Math.random() < 0.5 ? 'sebelah' : 'seberang';
    const target = q === 'sebelah' ? 180 - a : a;
    const u = ukuranWilayah(a);
    const kunciWilayah = [1, 2, 3].filter((i) => u[i] === target); // wilayah 0 = sudut yang diketahui, tidak dihitung
    return { jenis: 'ketuk', tingkat, a, q, target, kunciWilayah, alpha: acak(0, 359), kode: 'kt:' + a + q };
  }
  function soalEmpat(tingkat) {
    const a = pilih(KETUK[tingkat]), b = 180 - a;
    const kunci = teksTriple([b, a, b]);
    const kand = [[a, b, a], [b, b, a], [Math.abs(90 - a), a, Math.abs(90 - a)], [b, a, a], [a, a, b]].map(teksTriple);
    const opsi = [kunci]; kand.forEach((t) => { if (opsi.length < 4 && !opsi.includes(t)) opsi.push(t); });
    return { jenis: 'empat', tingkat, a, kunci, opsi: kocok(opsi), alpha: acak(0, 359), kode: 'em:' + a };
  }

  function buatRonde(tingkat) {
    for (let n = 0; n < 500; n++) {
      let r;
      if (tingkat === 1) r = [soalLurus1(1), soalLurus1(1), soalLurus1(1), soalKetuk(1), soalKetuk(1)];
      else if (tingkat === 2) {
        const tiga = [soalSebelah(2), soalSebelah(2), soalSebelah(2)];
        tiga[acak(0, 2)] = soalSebelah(2, 90); // satu soal: garis tegak lurus -> 90°
        r = tiga.concat([soalKetuk(2), soalKetuk(2)]);
      } else r = [soalLurus3(3), soalLurus3(3), soalSebelah(3), soalKetuk(3), soalEmpat(3)];
      if (new Set(r.map((s) => s.kode)).size === 5) return r;
    }
    throw new Error('ronde gagal');
  }
  function soalMirip(soal, tingkat) {
    for (let i = 0; i < 200; i++) {
      let s;
      if (soal.jenis === 'lurus1') s = soalLurus1(tingkat);
      else if (soal.jenis === 'lurus3') s = soalLurus3(tingkat);
      else if (soal.jenis === 'sebelah') s = soalSebelah(tingkat, soal.a === 90 ? 90 : undefined);
      else if (soal.jenis === 'ketuk') s = soalKetuk(tingkat);
      else s = soalEmpat(tingkat);
      if (s.kode !== soal.kode) return s;
    }
    return soal;
  }
  const periksaPilih = (soal, v) => ({ benar: v === soal.kunci, pilih: v });
  const periksaKetuk = (soal, w) => ({ benar: soal.kunciWilayah.includes(w), wilayah: w });

  const logika = { BAGIAN, SEBELAH, KETUK, ukuranWilayah, wilayahDariSudut, opsiAngka, teksTriple, soalLurus1, soalLurus3, soalSebelah, soalKetuk, soalEmpat, buatRonde, soalMirip, periksaPilih, periksaKetuk };
  if (modul) { module.exports = logika; return; }

  // ---------- Tampilan (browser) ----------
  const { el, sudutSvg, jalurLengkung, svgEl, titik } = S;
  const KECIL = () => window.innerHeight < 790;
  const BIRU = '#3A86FF', MERAH = '#E04466', HIJAU = '#2BB673', ABU = '#9AA4B8', ORANYE = '#FF8A3D', UNGU = '#9B5DE5';
  const B = (x) => '<b class="biru">' + x + '</b>', M = (x) => '<b class="merah">' + x + '</b>';

  // sinar & lengkung untuk satu soal (statis); wil = {indeks: warna} untuk menimpa warna wilayah (ketuk)
  function bangun(soal, o) {
    o = o || {};
    if (soal.jenis === 'lurus1') {
      const x = soal.kiri ? 180 - soal.a : soal.a, th = soal.theta;
      // bagian pertama (th .. th+x) dan kedua; yang berukuran a berwarna biru dan berangka, satunya "?"
      const bagian = soal.kiri ? [{ s: x, tanya: true }, { s: 180 - x, tanya: false }] : [{ s: x, tanya: false }, { s: 180 - x, tanya: true }];
      return { sinar: [{ a: th }, { a: th + 180 }, { a: th + x }], lengkung: bagian.map((b, i) => ({ a: th + (i ? x : 0), s: b.s, r: 100, rTeks: 74, warna: b.tanya ? MERAH : BIRU, teks: b.tanya ? '?' : soal.a + '°' })) };
    }
    if (soal.jenis === 'lurus3') {
      const th = soal.theta; let acc = 0; const sinar = [{ a: th }, { a: th + 180 }], lengkung = [];
      soal.urut.forEach((v, i) => {
        const s = v === 0 ? soal.kunci : v;
        lengkung.push({ a: th + acc, s, r: 100, rTeks: 74, warna: v === 0 ? MERAH : i === 0 || (i === 1 && soal.urut[0] === 0) ? BIRU : HIJAU, teks: v === 0 ? '?' : v + '°' });
        acc += s; if (i < 2) sinar.push({ a: th + acc });
      });
      return { sinar, lengkung };
    }
    // dua garis berpotongan
    const a = soal.a, al = soal.alpha, u = ukuranWilayah(a), awal = [al, al + a, al + 180, al + 180 + a];
    const sinar = awal.map((x) => ({ a: x }));
    const warna = [BIRU, ABU, ABU, ABU];
    if (soal.jenis === 'sebelah') { warna[1] = soal.tanyaR3 ? ABU : MERAH; warna[3] = soal.tanyaR3 ? MERAH : ABU; }
    if (soal.jenis === 'empat') { warna[1] = MERAH; warna[2] = HIJAU; warna[3] = UNGU; }
    if (o.wil) Object.keys(o.wil).forEach((i) => { warna[i] = o.wil[i]; });
    const nilai = o.nilai || u;
    const lengkung = [0, 1, 2, 3].map((i) => {
      const dari = awal[i], s = i % 2 ? 180 - a : a;
      let t = '';
      if (o.semua) t = nilai[i] + '°';
      else if (soal.jenis === 'sebelah') t = i === 0 ? (a === 90 ? '' : nilai[0] + '°') : (i === 1 && !soal.tanyaR3) || (i === 3 && soal.tanyaR3) ? '?' : '';
      else if (soal.jenis === 'empat') t = i === 0 ? nilai[0] + '°' : ['', '①', '②', '③'][i];
      else if (soal.jenis === 'ketuk') t = i === 0 ? nilai[0] + '°' : '';
      return { a: dari, s, r: o.rLengkung || 84, warna: warna[i], teks: t };
    });
    return { sinar, lengkung, awal };
  }
  function gambar(soal, o) {
    o = o || {};
    const b = bangun(soal, o);
    const svg = sudutSvg({ sinar: b.sinar, lengkung: b.lengkung, pojok: o.pojok === false ? null : (soal.jenis === 'sebelah' && soal.a === 90 ? b.awal[0] : null), ukuran: o.ukuran || 300 });
    if (o.setengah) {
      const th = soal.jenis === 'lurus1' || soal.jenis === 'lurus3' ? soal.theta : soal.alpha;
      svg.appendChild(svgEl('path', { d: jalurLengkung(150, 150, 103, th + (o.setengahDari || 0), 180, false), fill: 'none', stroke: '#1F2A44', 'stroke-width': 3, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }));
    }
    return svg;
  }

  function tampilkan(soal, wadah, kirim) {
    const ukuran = KECIL() ? 330 : 380;
    const j = soal.jenis;
    if (j === 'lurus1') wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Garis lurus = <b>180°</b>. Satu bagian sudutnya ' + B(soal.a + '°') + '.<br>Sudut ' + M('?') + ' besarnya…?'));
    else if (j === 'lurus3') {
      const dua = soal.urut.filter((v) => v);
      wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Garis lurus = <b>180°</b>, terbagi tiga: ' + B(dua[0] + '°') + ', ' + B(dua[1] + '°') + ' dan ' + M('?') + '.<br>Sudut ' + M('?') + ' besarnya…?'));
    } else if (j === 'sebelah') wadah.appendChild(el('div', 'soal-teks soal-sedang', soal.a === 90
      ? 'Dua garis <b>tegak lurus</b> (kotak kecil = siku-siku).<br>Sudut ' + M('?') + ' besarnya…?'
      : 'Dua garis berpotongan. Sudut ' + B(soal.a + '°') + '.<br>Sudut ' + M('?') + ' yang bersebelahan besarnya…?'));
    else if (j === 'ketuk') wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Sudut ' + B(soal.a + '°') + ' sudah diketahui.<br>' + (soal.q === 'sebelah' ? 'Ketuk sudut yang besarnya <b>' + soal.target + '°</b>.' : 'Ketuk sudut yang <b>juga ' + soal.target + '°</b>.')));
    else wadah.appendChild(el('div', 'soal-teks soal-sedang', 'Sudut ' + B(soal.a + '°') + '. Berapa sudut ① ② ③ (berurutan)?'));

    const tempat = el('div', 'sudut-tempat'); tempat.style.justifyContent = 'center';
    if (j === 'ketuk') {
      let sudah = false;
      const susun = (wil) => {
        tempat.innerHTML = '';
        const svg = gambar(soal, { ukuran: ukuran + 30, wil, rLengkung: 108 });
        svg.classList.add('gambar-silang');
        if (!sudah) svg.addEventListener('click', (e) => {
          const r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = cy - e.clientY;
          if (Math.hypot(dx, dy) < 16) return;
          const sudut = (Math.atan2(dy, dx) * 180) / Math.PI;
          const w = wilayahDariSudut(soal.a, sudut - soal.alpha);
          if (w === 0) { Suara.efek('boing'); return; } // sudut yang sudah diketahui bukan jawaban
          sudah = true;
          const h = periksaKetuk(soal, w);
          susun({ [w]: h.benar ? HIJAU : MERAH });
          kirim(h);
        });
        tempat.appendChild(svg);
      };
      susun();
      wadah.appendChild(tempat);
      wadah.appendChild(el('div', 'ingat-kecil', 'Ketuk di dalam daerah sudutnya (bukan sudut biru).'));
      return;
    }
    tempat.appendChild(gambar(soal, { ukuran }));
    wadah.appendChild(tempat);
    const opsi = el('div', 'des-opsi des-opsi-baris' + (j === 'empat' ? ' dua' : ''));
    soal.opsi.forEach((v) => {
      const b = el('button', 'tombol tombol-des', j === 'empat' ? v : v + '°');
      b.onclick = () => kirim(periksaPilih(soal, v));
      opsi.appendChild(b);
    });
    wadah.appendChild(opsi);
  }

  function pujian(soal) {
    const a = soal.a;
    if (soal.jenis === 'lurus1' || soal.jenis === 'sebelah') return { html: a + '° + ' + soal.kunci + '° = <b>180°</b> (garis lurus)' };
    if (soal.jenis === 'lurus3') return { html: soal.x + '° + ' + soal.y + '° + ' + soal.kunci + '° = <b>180°</b>' };
    if (soal.jenis === 'ketuk') return { html: a + '° + ' + (180 - a) + '° = <b>180°</b> · sudut seberang sama besar' };
    return { html: a + '° + ' + (180 - a) + '° + ' + a + '° + ' + (180 - a) + '° = <b>360°</b>' };
  }

  function catatanSalah(soal, v) {
    const a = soal.a;
    if (soal.jenis === 'lurus3') {
      if (v === soal.x + soal.y) return 'Itu hasil menjumlah dua bagian. Bagian ketiga = 180° − ' + soal.x + '° − ' + soal.y + '°.';
      if (v > 180) return 'Garis lurus hanya 180°, tidak mungkin ada bagian yang lebih besar.';
      return '';
    }
    if (v === 360 - a) return '360° itu satu putaran penuh. Garis lurus hanya setengah putaran = 180°.';
    if (v === Math.abs(90 - a)) return 'Itu dihitung 90° − ' + a + '°. Padahal garis lurus = 180°, bukan 90°.';
    if (v === a) return 'Itu sudut yang sudah diketahui. Yang ditanya adalah bagian lainnya.';
    return '';
  }

  // animasi: garis diputar sedikit, dua sudut seberang ikut berubah bersama
  function animasiSeberang(wadah, soal, ukuran) {
    const a = soal.a, naik = a + 10 === 90 ? a + 15 : a + 10, turun = a - 10 === 90 ? a - 15 : a - 10; // lewati 90 supaya tidak tampak tegak lurus
    const nilai = [a, naik <= 150 ? naik : turun, a, turun >= 30 ? turun : naik];
    let i = 0;
    const tempat = el('div', 'sudut-tempat');
    const gambarNilai = (v) => {
      tempat.innerHTML = '';
      const tiruan = { jenis: 'sebelah', a: v, alpha: soal.alpha, tanyaR3: false };
      tempat.appendChild(gambar(tiruan, { ukuran, nilai: ukuranWilayah(v), semua: true, rLengkung: 74, pojok: false, wil: { 2: BIRU, 3: MERAH } }));
    };
    gambarNilai(a);
    const t = setInterval(() => {
      if (!tempat.isConnected) { clearInterval(t); return; }
      i = (i + 1) % nilai.length; gambarNilai(nilai[i]);
    }, 1100);
    return tempat;
  }

  function alasan(soal, jawaban, wadah) {
    const ukuran = KECIL() ? 240 : 270;
    const j = soal.jenis, a = soal.a;
    const baris = el('div', 'alasan-baris');
    let t;
    if (j === 'lurus1' || j === 'lurus3') {
      baris.appendChild(gambar(soal, { ukuran, setengah: true }));
      t = j === 'lurus1'
        ? 'Garis lurus = setengah putaran = <b>180°</b> (busur putus-putus).<br>' + a + '° + ? = 180° → ? = 180° − ' + a + '° = <b>' + soal.kunci + '°</b>.'
        : 'Garis lurus = <b>180°</b>. Jumlah tiga bagian = 180°.<br>? = 180° − ' + soal.x + '° − ' + soal.y + '° = <b>' + soal.kunci + '°</b>.';
      t += '<br><small>Kamu memilih ' + jawaban.pilih + '°. ' + catatanSalah(soal, jawaban.pilih) + '</small>';
    } else if (j === 'sebelah') {
      baris.appendChild(animasiSeberang(wadah, soal, ukuran));
      t = 'Dua sudut yang bersebelahan membentuk <b>garis lurus</b>: ' + a + '° + ? = 180° → ? = <b>' + soal.kunci + '°</b>.<br>Garis diputar sedikit: <b>sudut seberang selalu sama besar</b>.';
      t += '<br><small>Kamu memilih ' + jawaban.pilih + '°. ' + catatanSalah(soal, jawaban.pilih) + '</small>';
    } else if (j === 'ketuk') {
      baris.appendChild(animasiSeberang(wadah, soal, ukuran));
      const u = ukuranWilayah(a);
      t = 'Sudut ' + a + '°. Sebelahnya: 180° − ' + a + '° = <b>' + (180 - a) + '°</b>. Seberangnya sama besar: <b>' + a + '°</b>.<br>' +
        (soal.q === 'sebelah' ? 'Jawaban: kedua sudut ' + soal.target + '° (yang bersebelahan dengan sudut biru).' : 'Jawaban: sudut yang tepat di seberang sudut biru.') +
        '<br><small>Kamu mengetuk sudut ' + u[jawaban.wilayah] + '°.</small>';
    } else {
      baris.appendChild(animasiSeberang(wadah, soal, ukuran));
      t = 'Sebelah sudut ' + a + '° ada ' + (180 - a) + '° (180° − ' + a + '°). Seberangnya sama besar: ' + a + '° dan ' + (180 - a) + '°.<br>Urutan ① ② ③: <b>' + soal.kunci + '</b>.<br>Jumlah keempat sudut: ' + a + ' + ' + (180 - a) + ' + ' + a + ' + ' + (180 - a) + ' = <b>360°</b>.';
      t += '<br><small>Kamu memilih ' + jawaban.pilih + '.</small>';
    }
    baris.appendChild(el('div', 'kotak-teks', t));
    wadah.appendChild(baris);
  }

  root.GameSudutSilang = Object.assign({
    id: 'sudut-silang',
    tingkat: ['sudut lurus, kelipatan 10°', 'dua garis berpotongan', 'sembarang 1°, empat sudut'],
    ingat: 'Garis lurus = 180° (setengah putaran). Dua sudut bersebelahan di garis lurus jumlahnya 180°. Sudut yang berseberangan sama besar.',
    tampilkan, alasan, pujian,
  }, logika);
})(typeof window !== 'undefined' ? window : globalThis);
