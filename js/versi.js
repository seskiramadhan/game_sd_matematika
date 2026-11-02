// Cek versi baru: bandingkan <meta name="versi"> dengan versi.json di server (tanpa cache).
// Bila beda, tampilkan tombol "Perbarui" (tidak saat ronde berjalan). Progres di localStorage tetap aman.
// Di Beranda ada label versi + tombol "Cek pembaruan" manual.
(function () {
  const sekarang = (document.querySelector('meta[name="versi"]') || {}).content || '';
  const tombol = document.getElementById('tombol-perbarui');
  let versiBaru = null;

  document.getElementById('label-versi').textContent = sekarang || '-';

  function toast(teks) {
    const t = document.getElementById('toast');
    t.textContent = teks; t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2200);
  }

  function sedangRonde() {
    const r = document.getElementById('layar-ronde');
    return r && r.classList.contains('aktif');
  }

  function tampilkan() {
    tombol.hidden = !versiBaru || sedangRonde();
  }

  function perbarui() {
    // alamat baru memaksa Safari mengambil index.html (dan css/js ?v=) yang baru
    location.replace(location.pathname + '?v=' + encodeURIComponent(versiBaru));
  }

  function cek(manual) {
    fetch('versi.json?t=' + Date.now(), { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && j.versi && sekarang && j.versi !== sekarang) versiBaru = j.versi;
        if (manual) {
          if (versiBaru) perbarui();
          else toast('Sudah versi terbaru 👍');
        }
        tampilkan();
      })
      .catch(() => { if (manual) toast('Tidak bisa cek, periksa internet.'); });
  }

  tombol.onclick = perbarui;
  document.getElementById('tombol-cek-versi').onclick = () => cek(true);

  cek(false);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) cek(false); });
  setInterval(() => cek(false), 5 * 60 * 1000);
  // sembunyikan saat ronde, munculkan lagi sesudahnya
  new MutationObserver(tampilkan).observe(document.getElementById('layar-ronde'), { attributes: true, attributeFilter: ['class'] });
})();
