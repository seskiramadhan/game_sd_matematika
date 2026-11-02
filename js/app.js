// Navigasi layar, peta bab, layar hasil.
(function () {
  const $ = (id) => document.getElementById(id);
  const WARNA = ['#FF6384', '#3A86FF', '#FFC400', '#2BB673', '#9B5DE5', '#FF8A3D'];
  const GARUDA = (ekspresi) => 'assets/garuda/garuda-' + ekspresi + '.svg';

  const state = { kelas: 4, babId: null, pos: null, tingkat: 1 };

  function tampil(nama) {
    document.querySelectorAll('.layar').forEach((l) => l.classList.toggle('aktif', l.id === 'layar-' + nama));
    if (nama === 'kelas') isiKelas();
    if (nama === 'bab') isiBab();
    if (nama === 'peta') isiPeta();
  }

  function toast(teks) {
    const t = $('toast');
    t.textContent = teks; t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  function animasi(el, kelas) {
    el.classList.remove('lompat', 'goyang', 'putar');
    void el.offsetWidth;
    el.classList.add(kelas);
  }

  // ---------- Beranda ----------
  function aturTombolSuara() { $('tombol-suara').textContent = Suara.nyala ? '🔊' : '🔇'; }
  $('tombol-suara').onclick = () => { Suara.nyala = !Suara.nyala; aturTombolSuara(); if (Suara.nyala) Suara.efek('pop'); };
  $('tombol-main').onclick = () => { Suara.efek('pop'); tampil('kelas'); };
  document.querySelectorAll('[data-ke]').forEach((b) => { b.onclick = () => { Suara.efek('pop'); tampil(b.dataset.ke); }; });

  // ---------- Pilih kelas ----------
  function isiKelas() {
    const wadah = $('daftar-kelas'); wadah.innerHTML = '';
    for (let k = 1; k <= 6; k++) {
      const ada = Object.values(DAFTAR_BAB).some((b) => b.kelas === k);
      const t = document.createElement('button');
      t.className = 'kartu-pilih' + (ada ? '' : ' kunci');
      t.style.setProperty('--warna', WARNA[k - 1]);
      t.innerHTML = 'Kelas ' + k + '<small>' + (ada ? 'Ayo main!' : '🔒 Segera') + '</small>';
      t.onclick = () => {
        if (!ada) { Suara.efek('boing'); toast('Kelas ' + k + ' segera hadir.'); return; }
        Suara.efek('pop'); state.kelas = k; tampil('bab');
      };
      wadah.appendChild(t);
    }
  }

  // ---------- Pilih bab ----------
  function isiBab() {
    $('judul-bab').textContent = 'Kelas ' + state.kelas + ' · Pilih Bab';
    const wadah = $('daftar-bab'); wadah.innerHTML = '';
    for (let n = 1; n <= 12; n++) {
      const id = 'k' + state.kelas + 'b' + n;
      const bab = DAFTAR_BAB[id];
      const t = document.createElement('button');
      t.className = 'kartu-pilih' + (bab ? '' : ' kunci');
      t.style.setProperty('--warna', WARNA[(n - 1) % 6]);
      t.innerHTML = 'Bab ' + n + '<small>' + (bab ? bab.judul : '🔒 Segera') + '</small>';
      t.onclick = () => {
        if (!bab) { Suara.efek('boing'); toast('Bab ' + n + ' segera hadir.'); return; }
        Suara.efek('pop'); state.babId = id; tampil('peta');
      };
      wadah.appendChild(t);
    }
  }

  // ---------- Peta bab ----------
  function posTerbuka(bab) {
    // Pos terbuka bila tidak "segera" dan pos aktif sebelumnya sudah >= 1 bintang.
    // Pos yang sudah pernah dimainkan selalu tetap terbuka, supaya progres lama tidak terkunci
    // bila urutan pos berubah (mis. pos baru ditambahkan di depan).
    const hasil = {};
    let sebelumnyaLulus = true;
    bab.pos.forEach((p) => {
      if (p.segera) { hasil[p.id] = false; return; }
      const prog = Simpan.pos(state.babId, p.id);
      hasil[p.id] = sebelumnyaLulus || prog.main >= 1 || prog.bintang >= 1;
      sebelumnyaLulus = prog.bintang >= 1;
    });
    return hasil;
  }

  function isiPeta() {
    const bab = DAFTAR_BAB[state.babId];
    $('judul-peta').textContent = 'Bab ' + bab.bab + ' · ' + bab.judul;
    $('catatan-peta').textContent = bab.catatan || '';
    const peta = $('peta'); peta.innerHTML = '';
    const n = bab.pos.length;
    const titik = bab.pos.map((p, i) => ({ x: 14 + (72 * i) / Math.max(1, n - 1), y: i % 2 ? 62 : 38 }));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'jalur'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none');
    let d = 'M ' + titik[0].x + ' ' + titik[0].y;
    for (let i = 1; i < n; i++) {
      const a = titik[i - 1], b = titik[i], mx = (a.x + b.x) / 2;
      d += ' C ' + mx + ' ' + a.y + ' ' + mx + ' ' + b.y + ' ' + b.x + ' ' + b.y;
    }
    svg.innerHTML = '<path d="' + d + '" fill="none" stroke="#E8C98F" stroke-width="2.2" stroke-dasharray="0.1 4" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:14px"/>';
    peta.appendChild(svg);

    const buka = posTerbuka(bab);
    let posGaruda = null;
    const posTerbukaEl = [];
    bab.pos.forEach((p, i) => {
      const prog = Simpan.pos(state.babId, p.id);
      const terbuka = buka[p.id];
      const el = document.createElement('button');
      el.className = 'pos' + (terbuka ? ' aktif' : ' kunci');
      el.style.left = titik[i].x + '%'; el.style.top = titik[i].y + '%';
      el.style.setProperty('--warna', p.warna);
      let bawah;
      if (p.segera) bawah = '<span class="label-segera">🔒 Segera</span>';
      else if (!terbuka) bawah = '<span class="label-segera">🔒</span>';
      else bawah = '<span class="label-tingkat">Tingkat ' + prog.tingkat + '</span><span class="bintang-kecil">' + bintangTeks(prog.bintangT[prog.tingkat] || 0) + '</span>';
      el.innerHTML = '<span class="bulat">' + p.ikon + '</span><span class="nama">' + p.nama + '</span>' + bawah;
      el.onclick = () => {
        if (p.segera) { Suara.efek('boing'); toast(p.nama + ' segera hadir.'); return; }
        if (!terbuka) { Suara.efek('boing'); toast('Selesaikan pos sebelumnya dulu ya.'); return; }
        Suara.efek('pop'); bukaJendelaMulai(p);
      };
      peta.appendChild(el);
      if (terbuka) { posTerbukaEl.push(el); if (prog.bintang < 1 && !posGaruda) posGaruda = el; }
    });
    // Garuda berdiri di pos terbuka pertama yang belum berbintang (bila semua berbintang: pos terbuka terakhir)
    if (!posGaruda) posGaruda = posTerbukaEl[posTerbukaEl.length - 1] || null;
    if (posGaruda) {
      const g = document.createElement('img');
      g.className = 'garuda garuda-peta lambai'; g.src = GARUDA('semangat'); g.alt = '';
      posGaruda.appendChild(g);
    }
  }

  function bintangTeks(b) { return '⭐'.repeat(b) + '<span style="opacity:.25">' + '⭐'.repeat(3 - b) + '</span>'; }

  $('tombol-video').onclick = () => {
    const bab = DAFTAR_BAB[state.babId];
    if (bab && bab.video) window.open(bab.video, '_blank');
    else toast('Video bab ini segera hadir.');
  };

  // ---------- Jendela pilih tingkat ----------
  function bukaJendelaMulai(p) {
    const game = p.game();
    if (!game) { toast('Game belum siap.'); return; }
    state.pos = p;
    const prog = Simpan.pos(state.babId, p.id);
    state.tingkat = prog.tingkat;
    $('mulai-ikon').textContent = p.ikon;
    $('mulai-judul').textContent = p.nama;
    $('mulai-ingat').textContent = game.ingat || '';
    const wadah = $('pilih-tingkat'); wadah.innerHTML = '';
    game.tingkat.forEach((t, i) => {
      const b = document.createElement('button');
      b.className = 'tombol' + (i + 1 === state.tingkat ? ' dipilih' : '');
      b.innerHTML = 'Tingkat ' + (i + 1) + '<small>' + t + '</small>';
      b.onclick = () => {
        Suara.efek('pop'); state.tingkat = i + 1;
        wadah.querySelectorAll('.tombol').forEach((x, j) => x.classList.toggle('dipilih', j === i));
      };
      wadah.appendChild(b);
    });
    $('jendela-mulai').hidden = false;
  }
  $('tombol-batal').onclick = () => { $('jendela-mulai').hidden = true; };
  $('tombol-mulai').onclick = () => { $('jendela-mulai').hidden = true; mulaiRonde(); };

  // ---------- Ronde & hasil ----------
  function mulaiRonde() {
    const p = state.pos;
    tampil('ronde');
    $('judul-ronde').textContent = p.ikon + ' ' + p.nama + ' · Tingkat ' + state.tingkat;
    Suara.frasa('ayo-mulai');
    Ronde.mulai({ game: p.game(), tingkat: state.tingkat, onSelesai: tampilHasil });
  }

  function tampilHasil(hasil) {
    const p = state.pos;
    const catat = Simpan.catatHasil(state.babId, p.id, state.tingkat, hasil.bintang);
    tampil('hasil');
    const b = hasil.bintang;
    $('hasil-bintang').innerHTML = '⭐'.repeat(b) + '<span class="mati">' + '⭐'.repeat(3 - b) + '</span>';
    const judul = ['Coba lagi yuk!', 'Bagus!', 'Hebat!', 'Luar biasa!'][b];
    $('hasil-judul').textContent = judul;
    let sub = 'Benar ' + hasil.benar + ' dari ' + hasil.total + ' soal.';
    if (catat.naik) sub += ' Naik ke Tingkat ' + catat.tingkatBaru + '!';
    $('hasil-sub').textContent = sub;
    const g = $('garuda-hasil');
    g.src = GARUDA(b >= 1 ? 'senang' : 'semangat');
    animasi(g, b >= 2 ? 'putar' : 'lompat');
    if (b >= 2) Suara.efek('tada');
    Suara.frasa('bintang-' + b, 500);
    if (catat.naik) state.tingkat = catat.tingkatBaru;
  }
  $('tombol-lagi').onclick = () => { Suara.efek('pop'); mulaiRonde(); };
  $('tombol-ke-peta').onclick = () => { Suara.efek('pop'); tampil('peta'); };
  $('tombol-keluar').onclick = () => { Ronde.berhenti(); Suara.efek('pop'); tampil('peta'); };

  aturTombolSuara();
  window.App = { tampil, state, toast };
})();
