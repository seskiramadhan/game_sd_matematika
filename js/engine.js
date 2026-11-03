// Mesin ronde: 5 soal, umpan balik benar/salah, soal yang salah diulang (soal mirip) di akhir ronde.
// Dipakai semua mini game. Sebuah mini game menyediakan:
//   tingkat: ['label tingkat 1', ...], ingat: 'kalimat pengingat'
//   buatRonde(tingkat) -> array 5 soal
//   soalMirip(soal, tingkat) -> soal baru yang mirip (untuk ulangan)
//   tampilkan(soal, wadah, kirim)   kirim({ benar: bool, ... }) dipanggil sekali saat anak menjawab
//   alasan(soal, jawaban, wadah)    gambar/penjelasan saat salah
//   pujian(soal, jawaban) (opsional) -> teks, atau { html } untuk isi ber-HTML (mis. pecahan bertumpuk)
(function () {
  const $ = (id) => document.getElementById(id);
  const JUMLAH = 5;
  const PUJIAN = ['benar', 'hebat', 'pintar'];
  const TEKS_PUJIAN = ['Benar!', 'Hebat!', 'Pintar sekali!'];

  let sesi = null;

  function garuda(ekspresi, gerak) {
    const g = $('garuda-ronde');
    g.src = 'assets/garuda/garuda-' + ekspresi + '.svg';
    g.classList.remove('lompat', 'goyang', 'putar');
    void g.offsetWidth;
    if (gerak) g.classList.add(gerak);
  }

  function gambarTitik() {
    const w = $('titik-titik'); w.innerHTML = '';
    for (let i = 0; i < JUMLAH; i++) {
      const t = document.createElement('div');
      const h = sesi.hasil[i];
      t.className = 'titik' + (h === true ? ' benar' : h === false ? ' salah' : '') + (i === sesi.indeks && !sesi.ulang ? ' sekarang' : '');
      t.textContent = h === true ? '✓' : h === false ? '✗' : '';
      w.appendChild(t);
    }
    if (sesi.ulang) {
      const t = document.createElement('div');
      t.className = 'titik ulang';
      t.textContent = '↻ ' + (sesi.antrean.length + 1);
      w.appendChild(t);
    }
  }

  function soalBerikut() {
    if (!sesi) return;
    let soal;
    if (sesi.indeks < JUMLAH) {
      soal = sesi.soal[sesi.indeks];
    } else if (sesi.antrean.length) {
      sesi.ulang = true;
      soal = sesi.antrean.shift();
    } else {
      return selesai();
    }
    sesi.sekarang = soal;
    gambarTitik();
    garuda('semangat');
    $('umpan').hidden = true;
    const wadah = $('ronde-isi');
    wadah.innerHTML = '';
    if (sesi.ulang) {
      const l = document.createElement('div');
      l.className = 'soal-label';
      l.textContent = '↻ Coba soal yang mirip';
      wadah.appendChild(l);
    }
    let sudah = false;
    sesi.game.tampilkan(soal, wadah, (jawaban) => {
      if (sudah || !sesi) return;
      sudah = true;
      nilai(soal, jawaban);
    });
  }

  function nilai(soal, jawaban) {
    const utama = !sesi.ulang;
    if (utama) sesi.hasil[sesi.indeks] = !!jawaban.benar;
    const umpan = $('umpan'), judul = $('umpan-judul'), isi = $('umpan-isi');
    isi.innerHTML = '';
    if (jawaban.benar) {
      const k = sesi.pujian++ % PUJIAN.length;
      Suara.efek('ding');
      Suara.frasa(PUJIAN[k], 150);
      garuda('senang', 'lompat');
      judul.className = 'umpan-judul benar';
      judul.textContent = '✓ ' + TEKS_PUJIAN[k];
      if (sesi.game.pujian) { const p = sesi.game.pujian(soal, jawaban); if (p) { const d = document.createElement('div'); if (p.html) d.innerHTML = p.html; else d.textContent = p; isi.appendChild(d); } }
      umpan.classList.add('benar-saja');
      umpan.hidden = false;
      gambarTitik();
      sesi.tunggu = setTimeout(lanjut, 1500);
    } else {
      Suara.efek('boing');
      Suara.frasa(sesi.ulang ? 'hampir' : 'coba-lagi', 250);
      garuda('ups', 'goyang');
      judul.className = 'umpan-judul salah';
      judul.textContent = 'Ups, belum tepat. Lihat ya:';
      umpan.classList.remove('benar-saja');
      umpan.hidden = false;
      sesi.game.alasan(soal, jawaban, isi);
      // soal yang salah diulang di akhir ronde (sekali saja, tidak menambah bintang)
      if (utama) sesi.antrean.push(sesi.game.soalMirip(soal, sesi.tingkat));
      gambarTitik();
    }
  }

  function lanjut() {
    if (!sesi) return;
    clearTimeout(sesi.tunggu);
    $('umpan').hidden = true;
    if (!sesi.ulang) sesi.indeks++;
    soalBerikut();
  }
  $('tombol-lanjut').onclick = () => { Suara.efek('pop'); lanjut(); };
  // ketuk di mana saja saat "benar" untuk langsung lanjut
  $('umpan').addEventListener('click', (e) => { if (sesi && $('umpan').classList.contains('benar-saja') && e.target !== $('tombol-lanjut')) lanjut(); });

  function selesai() {
    const benar = sesi.hasil.filter((x) => x === true).length;
    const bintang = benar >= 5 ? 3 : benar === 4 ? 2 : benar === 3 ? 1 : 0;
    const cb = sesi.onSelesai;
    const hasil = { benar, total: JUMLAH, bintang };
    sesi = null;
    cb(hasil);
  }

  window.Ronde = {
    JUMLAH,
    mulai({ game, tingkat, onSelesai }) {
      if (sesi) clearTimeout(sesi.tunggu);
      sesi = {
        game, tingkat, onSelesai,
        soal: game.buatRonde(tingkat).slice(0, JUMLAH),
        hasil: [], indeks: 0, antrean: [], ulang: false, pujian: 0, tunggu: null,
      };
      soalBerikut();
    },
    berhenti() { if (sesi) clearTimeout(sesi.tunggu); sesi = null; $('umpan').hidden = true; },
    get sesi() { return sesi; },
  };
})();
