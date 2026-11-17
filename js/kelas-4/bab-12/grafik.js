// Alat bersama Bab 12 (Grafik Batang): data, turus, pertanyaan (kunci dihitung kode), gambar turus, diagram batang, piktogram.
// Semua bilangan bulat. Cek logika: node tools/cek-bab12.js
(function (root) {
  const modul = typeof module !== 'undefined' && module.exports;

  // ---------- Logika (tanpa DOM) ----------
  const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pilih = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const kocok = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const unik = (arr) => new Set(arr).size === arr.length;
  const jumlah = (a) => a.reduce((x, y) => x + y, 0);
  const WARNA = ['#3A86FF', '#FF8A3D', '#2BB673', '#9B5DE5', '#FF6384'];
  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  // Topik original. kat: kategori bergambar; hari: kategori = hari sekolah.
  const TOPIK = [
    { id: 'hewan', judul: 'Hewan peliharaan murid kelas 4', satuan: 'murid', cats: [['Kucing', '🐱'], ['Ikan', '🐟'], ['Burung', '🐦'], ['Kelinci', '🐰'], ['Hamster', '🐹']] },
    { id: 'olahraga', judul: 'Olahraga kesukaan murid', satuan: 'murid', cats: [['Sepak bola', '⚽'], ['Voli', '🏐'], ['Renang', '🏊'], ['Basket', '🏀'], ['Bulu tangkis', '🏸']] },
    { id: 'jajan', judul: 'Jajanan kantin yang terjual', satuan: 'porsi', cats: [['Bakso', '🍜'], ['Roti', '🍞'], ['Es teh', '🥤'], ['Cilok', '🍡'], ['Kue', '🍪']] },
    { id: 'warna', judul: 'Warna kesukaan murid', satuan: 'murid', cats: [['Merah', '🔴'], ['Biru', '🔵'], ['Hijau', '🟢'], ['Kuning', '🟡'], ['Ungu', '🟣']] },
    { id: 'transport', judul: 'Cara murid pergi ke sekolah', satuan: 'murid', cats: [['Jalan kaki', '🚶'], ['Sepeda', '🚲'], ['Motor', '🛵'], ['Mobil', '🚗'], ['Bus', '🚌']] },
    { id: 'bunga', judul: 'Bunga di taman sekolah', satuan: 'tangkai', cats: [['Mawar', '🌹'], ['Bunga matahari', '🌻'], ['Tulip', '🌷'], ['Melati', '🌼'], ['Teratai', '🪷']] },
    { id: 'ekskul', judul: 'Kegiatan ekstrakurikuler pilihan murid', satuan: 'murid', cats: [['Pramuka', '⛺'], ['Menari', '💃'], ['Melukis', '🎨'], ['Musik', '🎵'], ['Catur', '♟️']] },
    { id: 'botol', judul: 'Botol bekas yang terkumpul', satuan: 'botol', hari: true },
    { id: 'perpus', judul: 'Pengunjung perpustakaan', satuan: 'anak', hari: true },
    { id: 'sampah', judul: 'Kantong sampah plastik yang terkumpul', satuan: 'kantong', hari: true },
    { id: 'eslilin', judul: 'Es lilin yang terjual di koperasi', satuan: 'buah', hari: true },
  ];
  // Tiga contoh yang SAMA dengan video dan Buku Saku (hasil sudah dihitung ulang).
  const CONTOH = {
    buah: { id: 'buah', judul: 'Buah kesukaan 28 murid', satuan: 'murid', cats: [['Mangga', '🥭'], ['Jeruk', '🍊'], ['Pisang', '🍌'], ['Apel', '🍎'], ['Semangka', '🍉']], nilai: [8, 7, 5, 4, 4], garis: 1 },
    buku: { id: 'buku', judul: 'Buku yang dibaca Senin sampai Jumat', satuan: 'buku', cats: HARI.map((h) => [h, '']), nilai: [6, 10, 7, 12, 9], garis: 2 },
    kue: { id: 'kue', judul: 'Kue Bu Ani yang terjual', satuan: 'kue', cats: HARI.slice(0, 4).map((h) => [h, '']), nilai: [15, 20, 10, 25], garis: 5 },
  };
  const dataContoh = (id, garis) => {
    const c = CONTOH[id], g = garis || c.garis, mx = Math.max(...c.nilai);
    return { topik: c.id, judul: c.judul, satuan: c.satuan, cats: c.cats.map((k, i) => ({ nama: k[0], ikon: k[1], warna: WARNA[i % 5] })), nilai: c.nilai.slice(), garis: g, langkah: 1, ymax: Math.ceil(mx / g) * g, contoh: true };
  };

  // opsi: n kategori, tipe ('kat' | 'hari' | undefined), min/maks nilai, langkah (kelipatan nilai), garis (jarak garis sumbu), ganjil (minimal banyak nilai ganjil), unikExtrem
  function buatData(o) {
    const n = o.n, langkah = o.langkah || 1, garis = o.garis || langkah;
    const kand = TOPIK.filter((t) => (o.tipe === 'hari' ? t.hari : o.tipe === 'kat' ? !t.hari : true) && (t.hari ? n <= 5 : t.cats.length >= n));
    const t = o.topik ? TOPIK.find((x) => x.id === o.topik) : pilih(kand);
    const cats = (t.hari ? HARI.slice(0, n).map((h) => [h, '']) : kocok(t.cats).slice(0, n)).map((k, i) => ({ nama: k[0], ikon: k[1], warna: WARNA[i % 5] }));
    let nilai;
    for (let c = 0; c < 2000; c++) {
      nilai = Array.from({ length: n }, () => langkah * acak(Math.ceil(o.min / langkah), Math.floor(o.maks / langkah)));
      const mx = Math.max(...nilai), mn = Math.min(...nilai);
      if (o.unikExtrem !== false && (nilai.filter((v) => v === mx).length !== 1 || nilai.filter((v) => v === mn).length !== 1)) continue;
      if (o.ganjil && nilai.filter((v) => v % 2).length < o.ganjil) continue;
      if (o.maksJumlah && jumlah(nilai) > o.maksJumlah) continue;
      if (o.minJumlah && jumlah(nilai) < o.minJumlah) continue;
      break;
    }
    return { topik: t.id, judul: t.judul, satuan: t.satuan, cats, nilai, garis, langkah, ymax: Math.ceil(Math.max(...nilai) / garis) * garis };
  }

  const turusPecah = (n) => ({ ikat: Math.floor(n / 5), sisa: n % 5 });

  // ---- pilihan jawaban ----
  // kand: [{v, sebab}] pengecoh yang diutamakan. Hasil: 4 pilihan unik, bilangan bulat positif.
  function opsiAngka(kunci, kand, sebab) {
    const set = [kunci];
    const tambah = (v) => { if (Number.isInteger(v) && v > 0 && set.length < 4 && !set.includes(v)) set.push(v); };
    kocok(kand || []).forEach((x) => { if (sebab && x.sebab && x.v !== kunci && Number.isInteger(x.v) && x.v > 0 && !sebab[x.v]) sebab[x.v] = x.sebab; tambah(x.v); });
    for (let d = 1; set.length < 4; d++) { tambah(kunci + d); tambah(kunci - d); }
    return kocok(set).map((v) => ({ kode: String(v), teks: String(v) }));
  }
  function opsiNama(d, kunci, kandIdx) {
    const set = [kunci];
    kocok(kandIdx || []).forEach((i) => { if (!set.includes(i) && set.length < 4) set.push(i); });
    kocok(d.cats.map((_, i) => i)).forEach((i) => { if (!set.includes(i) && set.length < 4) set.push(i); });
    return kocok(set).map((i) => ({ kode: String(i), teks: d.cats[i].nama, ikon: d.cats[i].ikon }));
  }
  const nm = (d, i) => (d.cats[i].ikon ? d.cats[i].ikon + ' ' : '') + '<b>' + d.cats[i].nama + '</b>';

  // Pertanyaan tentang data. jenis: nilai | paling | selisih | jumlah2 | jumlah | turus (ubah turus jadi angka). o: {i, j, sub, kotak}
  const kata = (g) => (d0.pikto ? 'banyak gambar. Kalikan dengan nilai satu gambar (' + g + ').' : 'banyak garis. Kalikan dengan skala (tiap garis ' + g + ').');
  let d0 = {};
  function tanya(d, jenis, o) {
    d0 = d;
    o = o || {};
    const v = d.nilai, n = v.length, g = d.garis, sebab = {}, idx = [...Array(n).keys()];
    const q = { jenis, sebab, i: o.i, j: o.j };
    if (jenis === 'nilai' || jenis === 'turus') {
      const i = o.i != null ? o.i : acak(0, n - 1), x = v[i], lo = Math.floor(x / g) * g, hi = lo + g;
      q.i = i; q.kunci = String(x);
      const kand = [];
      if (jenis === 'turus') {
        const t = turusPecah(x);
        kand.push({ v: x - t.ikat, sebab: 'Garis miring juga dihitung: satu ikat = 5 turus, bukan 4.' }, { v: t.ikat + t.sisa, sebab: 'Satu ikat itu 5, bukan 1.' });
        q.teks = 'Berapa banyak ' + nm(d, i) + '?';
      } else {
        if (x % g && !d.pikto) kand.push({ v: lo, sebab: 'Batang berhenti di antara garis ' + lo + ' dan ' + hi + ', jadi nilainya bukan ' + lo + '.' }, { v: hi, sebab: 'Batang belum sampai garis ' + hi + ', jadi nilainya bukan ' + hi + '.' });
        else if (g > 1) kand.push({ v: x / g, sebab: d.pikto ? x / g + ' itu banyak gambar. Satu gambar = ' + g + ', jadi kalikan.' : x / g + ' itu banyak garis. Nilainya dibaca dari angka di sumbu, dan tiap garis naik ' + g + '.' });
        q.teks = 'Berapa banyak ' + nm(d, i) + '?';
      }
      kand.push({ v: x + 1 }, { v: x - 1 });
      q.opsi = opsiAngka(x, kand, sebab);
      q.penjelasan = d.cats[i].nama + ' = <b>' + x + ' ' + d.satuan + '</b>';
    } else if (jenis === 'paling') {
      const sub = o.sub || pilih(['banyak', 'sedikit']), pakai = sub === 'banyak' ? Math.max(...v) : Math.min(...v), lawan = sub === 'banyak' ? Math.min(...v) : Math.max(...v);
      const k = v.indexOf(pakai), l = v.indexOf(lawan);
      q.sub = sub; q.kunci = String(k);
      q.opsi = opsiNama(d, k, [l]);
      sebab[l] = 'Itu paling ' + (sub === 'banyak' ? 'sedikit' : 'banyak') + '. Paling ' + sub + ' = batang paling ' + (sub === 'banyak' ? 'tinggi' : 'pendek') + '.';
      q.teks = 'Mana yang <b>paling ' + sub + '</b>?';
      q.penjelasan = d.cats[k].nama + ' = ' + pakai + ' → paling ' + sub;
    } else if (jenis === 'selisih' || jenis === 'jumlah2') {
      let i = o.i, j = o.j;
      if (i == null) { do { i = acak(0, n - 1); j = acak(0, n - 1); } while (i === j || v[i] === v[j]); if (jenis === 'selisih' && v[i] < v[j]) [i, j] = [j, i]; }
      q.i = i; q.j = j;
      const a = v[i], b = v[j], s = a + b, sel = Math.abs(a - b), kt = (x) => Math.floor(x / g);
      const kunci = jenis === 'selisih' ? sel : s;
      q.kunci = String(kunci);
      const kand = jenis === 'selisih'
        ? [{ v: s, sebab: s + ' itu jumlah (ditambah). Selisih = dikurangi.' }, g > 1 ? { v: Math.abs(kt(a) - kt(b)), sebab: 'Itu selisih ' + kata(g) + '.' } : { v: sel + 1 }, { v: sel + 1 }, { v: sel - 1 }]
        : [{ v: sel, sebab: sel + ' itu selisih (dikurangi). Jumlah = ditambah.' }, g > 1 ? { v: kt(a) + kt(b), sebab: 'Itu jumlah ' + kata(g) + '.' } : { v: s + 1 }, { v: s + 1 }, { v: s - 1 }];
      q.opsi = opsiAngka(kunci, kand, sebab);
      q.teks = 'Berapa <b>' + (jenis === 'selisih' ? 'selisih' : 'jumlah') + '</b> ' + nm(d, i) + ' dan ' + nm(d, j) + '?' + (jenis === 'selisih' ? ' <small>(selisih = dikurangi)</small>' : '');
      q.penjelasan = jenis === 'selisih' ? a + ' − ' + b + ' = <b>' + sel + '</b>' : a + ' + ' + b + ' = <b>' + s + '</b>';
    } else { // jumlah semua
      const s = jumlah(v), kt = (x) => Math.floor(x / g);
      q.kunci = String(s);
      const kand = [{ v: s - Math.min(...v), sebab: 'Ada satu kategori yang belum ikut dijumlah. Jumlahkan semuanya.' }, { v: s - v[n - 1], sebab: 'Kategori terakhir belum ikut dijumlah.' }, { v: s + 1 }, { v: s - 1 }];
      if (g > 1) kand.unshift({ v: jumlah(v.map(kt)), sebab: 'Itu jumlah ' + kata(g) + '.' });
      q.opsi = opsiAngka(s, kand, sebab);
      q.teks = 'Berapa <b>jumlah</b> semuanya?';
      q.penjelasan = v.join(' + ') + ' = <b>' + s + ' ' + d.satuan + '</b>';
    }
    return q;
  }
  const periksa = (soal, kode) => ({ benar: kode === soal.q.kunci, pilih: kode });
  const teksOpsi = (q, kode) => { const o = q.opsi.find((x) => x.kode === kode); return o ? o.teks : kode; };
  const kodeData = (d, q) => d.topik + ':' + d.nilai.join(',') + (q ? ':' + q.jenis + (q.sub || '') + (q.i != null ? q.i : '') + (q.j != null ? q.j : '') : '');

  // pilih satu pertanyaan sesuai daftar jenis [{jenis, ...o}]; sebagian dengan i/j tertentu
  function pertanyaanUntuk(d, jenis, o) { return tanya(d, jenis, o); }

  const logika = { acak, pilih, kocok, unik, jumlah, WARNA, HARI, TOPIK, CONTOH, dataContoh, buatData, turusPecah, tanya, pertanyaanUntuk, periksa, teksOpsi, kodeData, opsiAngka, opsiNama, nm };
  if (modul) { module.exports = logika; return; }

  // ---------- Gambar (browser) ----------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attr) => { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const el = (tag, kelas, html) => { const e = document.createElement(tag); if (kelas) e.className = kelas; if (html != null) e.innerHTML = html; return e; };
  const teks = (svg, x, y, isi, ukuran, warna, extra) => {
    const t = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': ukuran, 'font-weight': 800, fill: warna, 'font-family': 'Poppins, sans-serif', 'paint-order': 'stroke', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, extra || {}));
    t.textContent = isi; svg.appendChild(t); return t;
  };
  const KECIL = () => window.innerHeight < 790;
  const TINTA = '#1F2A44';

  // turus: ikat 5 = 4 garis tegak + 1 miring
  function turusSvg(n, warna, tinggi) {
    const h = tinggi || 34, sisaIkat = Math.floor(n / 5), sisa = n % 5, lebarIkat = 46, W = Math.max(sisaIkat * lebarIkat + (sisa ? sisa * 9 + 6 : 0), 8);
    const svg = svgEl('svg', { width: W, height: h, viewBox: '0 0 ' + W + ' ' + h, class: 'gb-turus' });
    const garis = (x1, y1, x2, y2) => svg.appendChild(svgEl('line', { x1, y1, x2, y2, stroke: warna, 'stroke-width': 4, 'stroke-linecap': 'round' }));
    for (let k = 0; k < sisaIkat; k++) { for (let t = 0; t < 4; t++) garis(k * lebarIkat + 5 + t * 10, 4, k * lebarIkat + 5 + t * 10, h - 4); garis(k * lebarIkat + 0, h - 6, k * lebarIkat + 40, 6); }
    for (let t = 0; t < sisa; t++) garis(sisaIkat * lebarIkat + 5 + t * 9, 4, sisaIkat * lebarIkat + 5 + t * 9, h - 4);
    return svg;
  }
  // tabel turus (HTML). n[] = jumlah per kategori; angka: tampilkan angka di kanan; sorot: indeks baris
  function tabelTurus(d, n, o) {
    o = o || {};
    const t = el('div', 'gb-tabel' + (o.kecil ? ' gb-tabel-kecil' : ''));
    d.cats.forEach((c, i) => {
      const b = el('div', 'gb-baris' + (o.sorot === i ? ' gb-sorot' : ''));
      b.dataset.baris = i;
      b.appendChild(el('div', 'gb-nama', (c.ikon ? '<span class="gb-ikon">' + c.ikon + '</span>' : '') + c.nama));
      const w = el('div', 'gb-turus-wadah'); w.appendChild(turusSvg(n[i], c.warna, o.kecil ? 28 : 34)); b.appendChild(w);
      if (o.angka) { const t2 = turusPecah(n[i]); b.appendChild(el('div', 'gb-angka', t2.ikat ? (t2.sisa ? t2.ikat * 5 + ' + ' + t2.sisa + ' = <b>' + n[i] + '</b>' : t2.ikat + ' ikat = <b>' + n[i] + '</b>') : '<b>' + n[i] + '</b>')); }
      t.appendChild(b);
    });
    return t;
  }
  const batasGambar = () => (KECIL() ? { w: 560, h: 250 } : { w: 620, h: 300 });

  // Diagram batang. d: data; tinggi[]: tinggi tiap batang (default d.nilai).
  // o: { lebar, tinggi, sorot: [i], bantu: i (garis bantu ke sumbu), labelNilai: bool, target: [nilai] (garis putus tinggi benar), salah: [i], ketuk(i, nilaiBaru) (ketuk di kolom batang), langkah }
  function diagramSvg(d, tinggiBatang, o) {
    o = o || {};
    const b = batasGambar(), W = o.lebar || b.w, H = o.tinggi || b.h, n = d.cats.length, adaIkon = d.cats.some((c) => c.ikon);
    const kiri = 44, kanan = 10, atas = 16, bawah = adaIkon ? (o.kecil ? 50 : 62) : 30;
    const pw = W - kiri - kanan, ph = H - atas - bawah, kol = pw / n, y = (v) => atas + ph - (v / d.ymax) * ph, x = (i) => kiri + i * kol;
    const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'gb-diagram' });
    svg.appendChild(svgEl('rect', { x: 1, y: 1, width: W - 2, height: H - 2, rx: 18, fill: '#fff', stroke: '#E9DFCB', 'stroke-width': 3 }));
    for (let v = 0; v <= d.ymax; v += d.garis) {
      svg.appendChild(svgEl('line', { x1: kiri, x2: W - kanan, y1: y(v), y2: y(v), stroke: v === 0 ? TINTA : '#C9D6E8', 'stroke-width': v === 0 ? 3 : 1.6 }));
      teks(svg, kiri - 17, y(v), v, KECIL() || o.kecil ? 14 : 16, '#4A5878', { 'stroke-width': 3 });
    }
    svg.appendChild(svgEl('line', { x1: kiri, x2: kiri, y1: atas - 4, y2: y(0), stroke: TINTA, 'stroke-width': 3 }));
    d.cats.forEach((c, i) => {
      const bw = Math.min(kol * 0.56, 78), bx = x(i) + (kol - bw) / 2, v = tinggiBatang[i], by = y(v);
      if (v > 0) svg.appendChild(svgEl('rect', { x: bx, y: by, width: bw, height: y(0) - by, rx: 6, fill: c.warna, 'fill-opacity': 0.9, stroke: (o.salah || []).includes(i) ? '#E04466' : (o.sorot || []).includes(i) ? '#E0A800' : c.warna, 'stroke-width': (o.salah || []).includes(i) || (o.sorot || []).includes(i) ? 5 : 2 }));
      if (o.target && o.target[i] !== tinggiBatang[i]) { // garis putus tinggi yang benar (digambar di atas batang)
        svg.appendChild(svgEl('rect', { x: bx - 3, y: y(o.target[i]), width: bw + 6, height: y(0) - y(o.target[i]), rx: 6, fill: 'none', stroke: '#1C9A5E', 'stroke-width': 4, 'stroke-dasharray': '8 5' }));
        teks(svg, bx + bw / 2, o.target[i] < tinggiBatang[i] ? y(o.target[i]) + 14 : y(o.target[i]) - 12, o.target[i], 20, '#1C9A5E');
      }
      if (o.bantu === i || (Array.isArray(o.bantu) && o.bantu.includes(i))) {
        svg.appendChild(svgEl('line', { x1: kiri, x2: bx + bw / 2, y1: by, y2: by, stroke: '#E0A800', 'stroke-width': 3.5, 'stroke-dasharray': '8 5' }));
        const lo = Math.floor(v / d.garis) * d.garis;
        if (v % d.garis) { [lo, lo + d.garis].forEach((gv) => svg.appendChild(svgEl('line', { x1: kiri, x2: W - kanan, y1: y(gv), y2: y(gv), stroke: '#E0A800', 'stroke-width': 2.6 }))); }
      }
      if (o.labelNilai || (o.bantu === i || (Array.isArray(o.bantu) && o.bantu.includes(i)))) teks(svg, bx + bw / 2, by - 12, v, 20, TINTA);
      // nama kategori
      const cx = x(i) + kol / 2;
      if (c.ikon) { teks(svg, cx, H - bawah + 18, c.ikon, o.kecil ? 22 : 26, TINTA, { 'stroke-width': 0 }); teks(svg, cx, H - bawah + (o.kecil ? 38 : 46), c.nama, kol < 95 ? 12 : 14, TINTA, { 'stroke-width': 3 }); }
      else teks(svg, cx, H - bawah + 16, c.nama, kol < 95 ? 15 : 17, TINTA, { 'stroke-width': 3 });
      if (o.ketuk) {
        const r = svgEl('rect', { x: x(i), y: 2, width: kol, height: atas + ph + 2, fill: '#fff', 'fill-opacity': 0.001, class: 'gb-ketuk' });
        r.addEventListener('click', (e) => {
          const bb = svg.getBoundingClientRect(), py = (e.clientY - bb.top) * (H / bb.height), val = ((atas + ph - py) / ph) * d.ymax, st = o.langkah || 1;
          o.ketuk(i, Math.max(0, Math.min(d.ymax, Math.round(val / st) * st)));
        });
        svg.appendChild(r);
      }
    });
    return svg;
  }

  // Piktogram (HTML): tiap baris ikon x banyak gambar; satu gambar = step
  function piktogram(d, step, o) {
    o = o || {};
    const t = el('div', 'gb-pikto');
    t.appendChild(el('div', 'gb-pikto-judul', 'Satu gambar = <b>' + step + ' ' + d.satuan + '</b>'));
    d.cats.forEach((c, i) => {
      const b = el('div', 'gb-baris' + (o.sorot === i ? ' gb-sorot' : ''));
      b.appendChild(el('div', 'gb-nama', c.nama));
      const w = el('div', 'gb-pikto-ikon');
      const ikon = c.ikon || pilihIkon(d);
      for (let k = 0; k < d.nilai[i] / step; k++) w.appendChild(el('span', 'gb-pk', ikon));
      b.appendChild(w);
      if (o.angka) b.appendChild(el('div', 'gb-angka', d.nilai[i] / step + ' × ' + step + ' = <b>' + d.nilai[i] + '</b>'));
      t.appendChild(b);
    });
    return t;
  }
  const pilihIkon = (d) => ({ hewan: '🐾', olahraga: '🏅', jajan: '🍽️', warna: '🎨', transport: '🚏', bunga: '🌱', ekskul: '⭐', botol: '🍾', perpus: '📚', sampah: '🛍️', eslilin: '🍦', buah: '🍏', buku: '📖', kue: '🧁' }[d.topik] || '⭐');

  Object.assign(logika, { svgEl, el, teks, KECIL, TINTA, turusSvg, tabelTurus, diagramSvg, piktogram, batasGambar });
  root.Grafik = logika;
})(typeof window !== 'undefined' ? window : globalThis);
